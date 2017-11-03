import { L10n, NumberFormatOptions } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { isNullOrUndefined, getValue, extend } from '@syncfusion/ej2-base';
import { DataManager, Group, Query, Deferred, Predicate } from '@syncfusion/ej2-data';
import { IGrid, NotifyArgs, IValueFormatter } from '../base/interface';
import { RenderType, CellType } from '../base/enum';
import { ReturnType } from '../base/type';
import { Data } from '../actions/data';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { AggregateRowModel, AggregateColumnModel } from '../models/models';
import * as events from '../base/constant';
import { prepareColumns, calculateAggregate, setFormatter } from '../base/util';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { CellRendererFactory } from '../services/cell-render-factory';
import { ContentRender } from '../renderer/content-renderer';
import { HeaderRender } from '../renderer/header-renderer';
import { CellRenderer } from '../renderer/cell-renderer';
import { HeaderCellRenderer } from '../renderer/header-cell-renderer';
import { StackedHeaderCellRenderer } from '../renderer/stacked-cell-renderer';
import { IndentCellRenderer } from '../renderer/indent-cell-renderer';
import { GroupCaptionCellRenderer, GroupCaptionEmptyCellRenderer } from '../renderer/caption-cell-renderer';
import { ExpandCellRenderer } from '../renderer/expand-cell-renderer';
import { HeaderIndentCellRenderer } from '../renderer/header-indent-renderer';
import { DetailHeaderIndentCellRenderer } from '../renderer/detail-header-indent-renderer';
import { DetailExpandCellRenderer } from '../renderer/detail-expand-cell-renderer';
import { AriaService } from '../services/aria-service';

/**
 * Content module is used to render grid content
 * @hidden
 */
export class Render {
    //Internal variables              
    private isColTypeDef: boolean;
    //Module declarations
    private parent: IGrid;
    private locator: ServiceLocator;
    private headerRenderer: HeaderRender;
    private contentRenderer: ContentRender;
    private l10n: L10n;
    public data: Data;
    private ariaService: AriaService;
    private renderer: RendererFactory;

    /**
     * Constructor for render module
     */
    constructor(parent?: IGrid, locator?: ServiceLocator) {
        this.parent = parent;
        this.locator = locator;
        this.data = new Data(parent, locator);
        this.l10n = locator.getService<L10n>('localization');
        this.ariaService = this.locator.getService<AriaService>('ariaService');
        this.renderer = this.locator.getService<RendererFactory>('rendererFactory');
        this.addEventListener();
    }

    /**
     * To initialize grid header, content and footer rendering
     */
    public render(): void {
        let gObj: IGrid = this.parent;
        this.headerRenderer = <HeaderRender>this.renderer.getRenderer(RenderType.Header);
        this.contentRenderer = <ContentRender>this.renderer.getRenderer(RenderType.Content);
        this.headerRenderer.renderPanel();
        this.contentRenderer.renderPanel();
        if (gObj.getColumns().length) {
            this.headerRenderer.renderTable();
            this.contentRenderer.renderTable();
            this.emptyRow(false);
        }
        this.refreshDataManager();
    }

    /** 
     * Refresh the entire Grid. 
     * @return {void} 
     */
    public refresh(e: NotifyArgs = { requestType: 'refresh' }): void {
        this.parent.notify(`${e.requestType}-begin`, e);
        this.parent.trigger(events.actionBegin, e);
        if (e.cancel) {
            return;
        }
        this.refreshDataManager(e);
    }

    private refreshComplete(e?: NotifyArgs): void {
        this.parent.trigger(events.actionComplete, e);
    }

    /**
     * The function is used to refresh the dataManager
     * @return {void}
     */
    private refreshDataManager(args: NotifyArgs = {}): void {
        if (args.requestType !== 'virtualscroll') {
            this.parent.showSpinner();
        }
        let ready: Promise<Object> = this.data.dataManager.ready;
        this.ariaService.setBusy(<HTMLElement>this.parent.getContent().firstChild, true);
        let dataManager: Promise<Object> = this.data.getData(args as NotifyArgs, this.data.generateQuery().requiresCount());
        if (!ready) {
            if (this.parent.groupSettings.disablePageWiseAggregates && this.parent.groupSettings.columns.length) {
                dataManager = dataManager.then((e: ReturnType) => this.validateGroupRecords(e));
            }
            dataManager.then((e: ReturnType) => this.dataManagerSuccess(e, args))
                .catch((e: ReturnType) => this.dataManagerFailure(e));
        }
    }

    private sendBulkRequest(args?: { changes: Object }): void {
        let promise: Promise<Object> = this.data.saveChanges(args.changes, this.parent.getPrimaryKeyFieldNames()[0]);
        if (this.data.dataManager.dataSource.offline) {
            this.refreshDataManager({ requestType: 'batchsave' } as NotifyArgs);
            return;
        } else {
            promise.then((e: ReturnType) => this.dmSuccess(e, args as NotifyArgs))
                .catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }));
        }
    }

    private dmSuccess(e: ReturnType, args: NotifyArgs): void {
        this.dataManagerSuccess(e, args as NotifyArgs);
    }

    private dmFailure(e: { result: Object[] }): void {
        this.dataManagerFailure(e);
    }

    /** 
     * Render empty row to Grid which is used at the time to represent to no records. 
     * @return {void} 
     * @hidden
     */
    public renderEmptyRow(): void {
        this.emptyRow(true);
    }

    private emptyRow(isTrigger?: boolean): void {
        let gObj: IGrid = this.parent;
        let tbody: Element = this.contentRenderer.getTable().querySelector('tbody');
        let tr: Element;
        remove(tbody);
        tbody = createElement('tbody');
        tr = createElement('tr', { className: 'e-emptyrow' });
        tr.appendChild(createElement('td', {
            innerHTML: this.l10n.getConstant('EmptyRecord'),
            attrs: { colspan: gObj.getColumns().length.toString() }
        }));
        tbody.appendChild(tr);
        this.contentRenderer.renderEmpty(<HTMLElement>tbody);
        if (isTrigger) {
            this.parent.trigger(events.dataBound, {});
            this.parent.notify(
                events.onEmpty,
                { rows: [new Row<Column>({ isDataRow: true, cells: [new Cell<Column>({ isDataCell: true, visible: true })]})] }
            );
        }
    }

    private updateColumnType(record: Object): void {
        let columns: Column[] = this.parent.getColumns() as Column[];
        let value: Date;
        let data: Object = record && (<{ items: Object[] }>record).items ? (<{ items: Object[] }>record).items[0] : record;
        let fmtr: IValueFormatter = this.locator.getService<IValueFormatter>('valueFormatter');
        for (let i: number = 0, len: number = columns.length; i < len; i++) {
            value = getValue(columns[i].field || '', data);
            if (!isNullOrUndefined(value)) {
                this.isColTypeDef = true;
                if (!columns[i].type) {
                    columns[i].type = value.getDay ? (value.getHours() > 0 || value.getMinutes() > 0 ||
                        value.getSeconds() > 0 || value.getMilliseconds() > 0 ? 'datetime' : 'date') : typeof (value);
                }
                if (typeof (columns[i].format) === 'string') {
                    setFormatter(this.locator, columns[i]);
                } else if (!columns[i].format && columns[i].type === 'number') {
                    columns[i].setParser(
                        fmtr.getParserFunction({ format: 'n2' } as NumberFormatOptions));
                }
            } else {
                columns[i].type = columns[i].type || null;
            }
        }
    }

    private dataManagerSuccess(e: ReturnType, args?: NotifyArgs): void {
        let gObj: IGrid = this.parent;
        gObj.trigger(events.beforeDataBound, e);
        let len: number = Object.keys(e.result).length;
        if (this.parent.isDestroyed) { return; }
        this.parent.notify(events.tooltipDestroy, {});
        gObj.currentViewData = <Object[]>e.result;
        if (!len && e.count && gObj.allowPaging) {
            gObj.pageSettings.currentPage = Math.ceil(e.count / gObj.pageSettings.pageSize);
            gObj.dataBind();
            return;
        }
        if (!gObj.getColumns().length && len) {
            this.updatesOnInitialRender(e);
        }
        if (!this.isColTypeDef) {
            this.updateColumnType(gObj.getCurrentViewRecords()[0]);
        }
        this.parent.notify(events.dataReady, extend({ count: e.count, result: e.result, aggregates: e.aggregates }, args));
        if (gObj.groupSettings.columns.length || (args && args.requestType === 'ungrouping')) {
            this.headerRenderer.refreshUI();
        }
        if (len) {
            this.contentRenderer.refreshContentRows(args);
        } else {
            if (!gObj.getColumns().length) {
                gObj.element.innerHTML = '';
                alert(this.l10n.getConstant('EmptyDataSourceError')); //ToDO: change this alert as dialog
                return;
            }
            this.contentRenderer.setRowElements([]);
            this.renderEmptyRow();
            if (args) {
                let action: string = (args.requestType || '').toLowerCase() + '-complete';
                this.parent.notify(action, args);
            }
            this.parent.hideSpinner();
        }
    }

    private dataManagerFailure(e: { result: Object[] }): void {
        this.ariaService.setOptions(<HTMLElement>this.parent.getContent().firstChild, { busy: false, invalid: true });
        this.parent.trigger(events.actionFailure, { error: e });
        this.parent.currentViewData = [];
        this.renderEmptyRow();
        this.parent.hideSpinner();
    }

    private updatesOnInitialRender(e: { result: Object, count: number }): void {
        this.buildColumns(e.result[0]);
        prepareColumns(this.parent.columns);
        this.headerRenderer.renderTable();
        this.contentRenderer.renderTable();
        this.parent.notify(events.autoCol, {});
    }

    private buildColumns(record: Object): void {
        let columns: string[] = Object.keys(record);
        let cols: Column[] = [];
        for (let i: number = 0, len: number = columns.length; i < len; i++) {
            cols[i] = { 'field': columns[i] } as Column;
            if (this.parent.enableColumnVirtualization) {
                cols[i].width = !isNullOrUndefined(cols[i].width) ? cols[i].width : 200;
            }
        }
        this.parent.columns = cols;
    }

    private instantiateRenderer(): void {
        this.renderer.addRenderer(RenderType.Header, new HeaderRender(this.parent, this.locator));
        this.renderer.addRenderer(RenderType.Content, new ContentRender(this.parent, this.locator));

        let cellrender: CellRendererFactory = this.locator.getService<CellRendererFactory>('cellRendererFactory');
        cellrender.addCellRenderer(CellType.Header, new HeaderCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.Data, new CellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.StackedHeader, new StackedHeaderCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.Indent, new IndentCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.GroupCaption, new GroupCaptionCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.GroupCaptionEmpty, new GroupCaptionEmptyCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.Expand, new ExpandCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.HeaderIndent, new HeaderIndentCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.StackedHeader, new StackedHeaderCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.DetailHeader, new DetailHeaderIndentCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.DetailExpand, new DetailExpandCellRenderer(this.parent, this.locator));

    }

    private addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initialLoad, this.instantiateRenderer, this);
        this.parent.on(events.modelChanged, this.refresh, this);
        this.parent.on(events.refreshComplete, this.refreshComplete, this);
        this.parent.on(events.bulkSave, this.sendBulkRequest, this);
    }

    /** @hidden */
    public validateGroupRecords(e: ReturnType): Promise<Object> {
        let index: number = e.result.length - 1;
        if (index < 0) { return Promise.resolve(e); }
        let group0: Group = <Group>e.result[0];
        let groupN: Group = <Group>e.result[index]; let predicate: Predicate[] = [];
        let addWhere: (query: Query) => void =
            (input: Query) => {
                [group0, groupN].forEach((group: Group) =>
                    predicate.push(new Predicate('field', '==', group.field).and(this.getPredicate('key', 'equal', group.key))));
                input.where(Predicate.or(predicate));
            };
        let query: Query = new Query(); addWhere(query);
        let curDm: DataManager = new DataManager(e.result as JSON[]);
        let curFilter: Object[] = <Object[]>curDm.executeLocal(query);
        let newQuery: Query = this.data.generateQuery(true); let rPredicate: Predicate[] = [];
        if (this.data.isRemote()) {
            [group0, groupN].forEach((group: Group) =>
                rPredicate.push(this.getPredicate(group.field, 'equal', group.key)));
            newQuery.where(Predicate.or(rPredicate));
        } else {
            addWhere(newQuery);
        }
        let deferred: Deferred = new Deferred();
        this.data.getData({}, newQuery).then((r: ReturnType) => {
            this.updateGroupInfo(curFilter, r.result);
            deferred.resolve(e);
        }).catch((e: Object) => deferred.reject(e));
        return deferred.promise;
    }

    private getPredicate(key: string, operator: string, value: string | number | Date): Predicate {
        if (value instanceof Date) {
            return this.data.getDatePredicate({ field: key, operator: operator, value: value });
        }
        return new Predicate(key, operator, value);
    }

    private updateGroupInfo(current: Object[], untouched: Object[]): Object[] {
        let dm: DataManager = new DataManager(<JSON[]>untouched);
        current.forEach((element: Group, index: number, array: Object[]) => {
            let uGroup: Group = dm.executeLocal(new Query()
                .where(new Predicate('field', '==', element.field).and(this.getPredicate('key', 'equal', element.key))))[0];
            element.count = uGroup.count; let itemGroup: Group = (<Group>element.items); let uGroupItem: Group = (<Group>uGroup.items);
            if (itemGroup.GroupGuid) {
                element.items = <Object[]>this.updateGroupInfo(element.items, uGroup.items);
            }
            this.parent.aggregates.forEach((row: AggregateRowModel) =>
                row.columns.forEach((column: AggregateColumnModel) => {
                    let types: string[] = column.type instanceof Array ? column.type : [column.type];
                    types.forEach((type: string) => {
                        let key: string = column.field + ' - ' + type;
                        element.aggregates[key] = calculateAggregate(type, itemGroup.level ? uGroupItem.records : uGroup.items, column);
                    });
                }));
        });
        return current;
    }
}

