import { EventHandler, L10n } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base/util';
import { getActualPropFromColl } from '../base/util';
import { remove, createElement, matches } from '@syncfusion/ej2-base/dom';
import { DataUtil } from '@syncfusion/ej2-data';
import { FilterSettings } from '../base/grid';
import { IGrid, IAction, NotifyArgs, IFilterOperator, IValueFormatter } from '../base/interface';
import * as events from '../base/constant';
import { CellType } from '../base/enum';
import { PredicateModel } from '../base/grid-model';
import { RowRenderer } from '../renderer/row-renderer';
import { ServiceLocator } from '../services/service-locator';
import { CellRendererFactory } from '../services/cell-render-factory';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { Row } from '../models/row';
import { FilterCellRenderer } from '../renderer/filter-cell-renderer';

/**
 * 
 * `Filter` module is used to handle filtering action.
 */
export class Filter implements IAction {
    //Internal variables   
    private filterSettings: FilterSettings;
    private element: Element;
    private value: string | number | Date | boolean;
    private predicate: string = 'and';
    private operator: string;
    private column: Column;
    private fieldName: string;
    private matchCase: boolean;
    private timer: number;
    private filterStatusMsg: string;
    private currentFilterObject: PredicateModel;
    private lastFilterElement: HTMLElement;
    private isRemove: boolean;
    private contentRefresh: boolean = true;
    private values: Object = {};
    private filterOperators: IFilterOperator = {
        contains: 'contains', endsWith: 'endswith', equal: 'equal', greaterThan: 'greaterthan', greaterThanOrEqual: 'greaterthanorequal',
        lessThan: 'lessthan', lessThanOrEqual: 'lessthanorequal', notEqual: 'notequal', startsWith: 'startswith'
    };

    //Module declarations
    private parent: IGrid;
    private serviceLocator: ServiceLocator;
    private l10n: L10n;
    private valueFormatter: IValueFormatter;

    /**
     * Constructor for Grid filtering module
     * @hidden
     */
    constructor(parent?: IGrid, filterSettings?: FilterSettings, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.filterSettings = filterSettings;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }

    /** 
     * To render filter bar when filtering enabled. 
     * @return {void}  
     * @hidden
     */
    public render(): void {
        let gObj: IGrid = this.parent;
        if (gObj.columns.length) {
            let rowRenderer: RowRenderer = new RowRenderer(this.serviceLocator, CellType.Filter);
            let row: Row;
            let cellrender: CellRendererFactory = this.serviceLocator.getService<CellRendererFactory>('cellRendererFactory');
            cellrender.addCellRenderer(CellType.Filter, new FilterCellRenderer(this.serviceLocator));
            this.l10n = this.serviceLocator.getService<L10n>('localization');
            this.valueFormatter = this.serviceLocator.getService<IValueFormatter>('valueFormatter');
            rowRenderer.element = createElement('tr', { className: 'e-filterbar' });
            row = this.generateRow();
            row.data = this.values;
            this.element = rowRenderer.render(row, <Column[]>gObj.getColumns());
            this.parent.getHeaderContent().querySelector('thead').appendChild(this.element);
            let detail: Element = this.element.querySelector('.e-detailheadercell');
            if (detail) {
                detail.className = 'e-filterbarcell e-mastercell';
            }
            this.wireEvents();
        }
    }

    /** 
     * To destroy the filter bar. 
     * @return {void} 
     * @hidden
     */
    public destroy(): void {
        this.filterSettings.columns = [];
        this.updateFilterMsg();
        this.removeEventListener();
        this.unWireEvents();
        remove(this.element);
    }

    private generateRow(index?: number): Row {
        let options: { [o: string]: Object } = {};
        let row: Row = new Row(options);
        row.cells = this.generateCells();
        return row;
    }

    private generateCells(): Cell[] {
        //TODO: generate dummy column for group, detail, stacked row here for filtering;
        let cells: Cell[] = [];
        if (this.parent.allowGrouping) {
            for (let c: number = 0, len: number = this.parent.groupSettings.columns.length; c < len; c++) {
                cells.push(this.generateCell({} as Column, CellType.HeaderIndent));
            }
        }
        if (this.parent.detailsTemplate || this.parent.childGrid) {
            cells.push(this.generateCell({} as Column, CellType.DetailHeader));
        }
        for (let dummy of this.parent.getColumns() as Column[]) {
            cells.push(this.generateCell(dummy));
        }
        return cells;
    }


    private generateCell(column: Column, cellType?: CellType): Cell {
        let opt: { [o: string]: Object } = {
            'visible': column.visible,
            'isDataCell': false,
            'rowId': '',
            'column': column,
            'cellType': cellType ? cellType : CellType.Filter,
            'attributes': { title: this.l10n.getConstant('FilterbarTitle') }
        };
        return new Cell(opt);
    }

    /** 
     * To update filterSettings when applying filter. 
     * @return {void}
     * @hidden
     */
    public updateModel(): void {
        this.currentFilterObject = {
            field: this.fieldName, operator: this.operator, value: this.value as string, predicate: this.predicate,
            matchCase: this.matchCase, actualFilterValue: {}, actualOperator: {}
        };

        let index: number = this.getFilteredColsIndexByField(this.fieldName);
        if (index > -1) {
            this.filterSettings.columns[index] = this.currentFilterObject;
        } else {
            this.filterSettings.columns.push(this.currentFilterObject);
        }
        this.filterSettings.columns = this.filterSettings.columns;
        this.parent.dataBind();
    }

    private getFilteredColsIndexByField(field: string): number {
        let cols: PredicateModel[] = this.filterSettings.columns;
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            if (cols[i].field === field) {
                return i;
            }
        }
        return -1;
    }

    /** 
     * To trigger action complete event. 
     * @return {void} 
     * @hidden
     */
    public onActionComplete(e: NotifyArgs): void {
        let args: Object = !this.isRemove ? {
            currentFilterObject: this.currentFilterObject, currentFilteringColumn: this.column.field,
            columns: this.filterSettings.columns, requestType: 'filtering', type: events.actionComplete
        } : {
                requestType: 'filtering', type: events.actionComplete
            };
        this.parent.trigger(events.actionComplete, extend(e, args));
        this.isRemove = false;
    }

    private wireEvents(): void {
        EventHandler.add(this.parent.getHeaderContent(), 'mousedown', this.updateSpanClass, this);
        EventHandler.add(this.parent.element, 'focusin', this.updateSpanClass, this);
        EventHandler.add(this.parent.getHeaderContent(), 'keyup', this.keyUpHandler, this);
    }

    private unWireEvents(): void {
        EventHandler.remove(this.parent.element, 'focusin', this.updateSpanClass);
        EventHandler.remove(this.parent.getHeaderContent(), 'mousedown', this.updateSpanClass);
        EventHandler.remove(this.parent.getHeaderContent(), 'keyup', this.keyUpHandler);
    }

    private enableAfterRender(e: NotifyArgs): void {
        if (e.module === this.getModuleName() && e.enable) {
            this.render();
        }
    }

    private initialEnd(): void {
        this.parent.off(events.contentReady, this.initialEnd);
        if (this.parent.getColumns().length && this.filterSettings.columns.length) {
            let gObj: IGrid = this.parent;
            this.contentRefresh = false;
            for (let col of gObj.filterSettings.columns) {
                this.filterByColumn(
                    col.field, col.operator, col.value as string, col.predicate, col.matchCase, col.actualFilterValue, col.actualOperator);
            }
            this.updateFilterMsg();
            this.contentRefresh = true;
        }
    }
    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
        this.parent.on(events.filterComplete, this.onActionComplete, this);
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(events.keyPressed, this.keyUpHandler, this);
        this.parent.on(events.columnPositionChanged, this.columnPositionChanged, this);
        this.parent.on(events.headerRefreshed, this.render, this);
        this.parent.on(events.contentReady, this.initialEnd, this);
    }
    /**
     * @hidden
     */
    public removeEventListener(): void {
        this.parent.off(events.uiUpdate, this.enableAfterRender);
        this.parent.off(events.filterComplete, this.onActionComplete);
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(events.keyPressed, this.keyUpHandler);
        this.parent.off(events.columnPositionChanged, this.columnPositionChanged);
        this.parent.off(events.headerRefreshed, this.render);
    }

    /** 
     * Filters grid row by column name with given options.
     * @param  {string} fieldName - Defines the field name of the filter column. 
     * @param  {string} filterOperator - Defines the operator by how to filter records.
     * @param  {string | number | Date | boolean} filterValue - Defines the value which is used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query with another by using AND or OR predicate.   
     * @param  {boolean} matchCase - If match case set to true, then filter records with exact match or else  
     * filter records with case insensitive(uppercase and lowercase letters treated as same).
     * @param  {string} actualFilterValue - Defines the actual filter value for the filter column. 
     * @param  {string} actualOperator - Defines the actual filter operator for the filter column. 
     * @return {void} 
     */
    public filterByColumn(
        fieldName: string, filterOperator: string, filterValue: string | number | Date | boolean, predicate?: string, matchCase?: boolean,
        actualFilterValue?: Object, actualOperator?: Object): void {
        let gObj: IGrid = this.parent;
        let filterCell: HTMLInputElement;
        this.column = gObj.getColumnByField(fieldName);
        filterCell = this.element.querySelector('#' + this.column.field + '_filterBarcell') as HTMLInputElement;
        if (!isNullOrUndefined(this.column.allowFiltering) && !this.column.allowFiltering) {
            return;
        }
        this.value = filterValue;
        this.matchCase = matchCase || false;
        this.fieldName = fieldName;
        this.predicate = predicate || 'and';
        this.operator = filterOperator;
        filterValue = filterValue.toString();
        this.values[this.column.field] = filterValue;
        gObj.getColumnHeaderByField(fieldName).setAttribute('aria-filtered', 'true');
        if (filterValue.length < 1 || this.checkForSkipInput(this.column, filterValue)) {
            this.filterStatusMsg = filterValue.length < 1 ? '' : this.l10n.getConstant('InvalidFilterMessage');
            this.updateFilterMsg();
            return;
        }
        if (filterCell.value !== filterValue) {
            filterCell.value = filterValue;
        }
        if (this.checkAlreadyColFiltered(this.column.field)) {
            return;
        }
        this.updateModel();
    }

    private onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        for (let prop of Object.keys(e.properties)) {
            switch (prop) {
                case 'columns':
                    if (this.contentRefresh) {
                        this.parent.notify(events.modelChanged, {
                            currentFilterObject: this.currentFilterObject, currentFilteringColumn: this.column ?
                                this.column.field : undefined,
                            columns: this.filterSettings.columns, requestType: 'filtering', type: events.actionBegin
                        });
                        this.updateFilterMsg();
                    }
                    break;
                case 'showFilterBarStatus':
                    if (e.properties[prop]) {
                        this.updateFilterMsg();
                    } else if (this.parent.allowPaging) {
                        this.parent.updateExternalMessage('');
                    }
                    break;
            }
        }
    }

    /** 
     * Clears all the filtered rows of Grid.
     * @return {void} 
     */
    public clearFiltering(): void {
        let cols: PredicateModel[] = getActualPropFromColl(this.filterSettings.columns);
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            this.removeFilteredColsByField(cols[i].field, true);
        }
        this.isRemove = true;
        this.filterStatusMsg = '';
        this.updateFilterMsg();
    }

    private checkAlreadyColFiltered(field: string): boolean {
        let columns: PredicateModel[] = this.filterSettings.columns;
        for (let col of columns) {
            if (col.field === field && col.value === this.value &&
                col.operator === this.operator && col.predicate === this.predicate) {
                return true;
            }
        }
        return false;
    }

    /** 
     * Removes filtered column by field name. 
     * @param  {string} field - Defines column field name to remove filter. 
     * @param  {boolean} isClearFilterBar -  Specifies whether the filter bar value needs to be cleared.     
     * @return {void} 
     * @hidden
     */
    public removeFilteredColsByField(field: string, isClearFilterBar?: boolean): void {
        let cols: PredicateModel[] = this.filterSettings.columns;
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            if (cols[i].field === field) {
                if (!(isClearFilterBar === false)) {
                    (this.element.querySelector('#' + cols[i].field + '_filterBarcell') as HTMLInputElement).value = '';
                }
                cols.splice(i, 1);
                this.parent.getColumnHeaderByField(field).removeAttribute('aria-filtered');
                this.isRemove = true;
                this.parent.notify(events.modelChanged, {
                    requestType: 'filtering', type: events.actionBegin
                });
                break;
            }
        }
        this.updateFilterMsg();
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'filter';
    }


    private keyUpHandler(e: KeyboardEvent): void {
        let gObj: IGrid = this.parent;
        let target: HTMLInputElement = e.target as HTMLInputElement;
        if (matches(target, '.e-filterbar input')) {
            this.column = gObj.getColumnByField(target.id.split('_')[0]);
            if (!this.column) {
                return;
            }
            this.updateCrossIcon(target);
            if ((this.filterSettings.mode === 'immediate' || e.keyCode === 13) && e.keyCode !== 9) {
                this.value = target.value.trim();
                this.processFilter(e);
            }
        }
    }


    private updateSpanClass(e: Event): boolean {
        let target: HTMLInputElement = e.target as HTMLInputElement;
        if (e.type === 'mousedown' && target.classList.contains('e-cancel')) {
            let targetText: HTMLInputElement = target.previousElementSibling as HTMLInputElement;
            (targetText as HTMLInputElement).value = '';
            target.classList.add('e-hide');
            targetText.focus();
            e.preventDefault();
        }
        if (e.type === 'focusin' && target.classList.contains('e-filtertext') && !target.disabled) {
            if (this.lastFilterElement) {
                this.lastFilterElement.nextElementSibling.classList.add('e-hide');
            }
            this.updateCrossIcon(target);
            this.lastFilterElement = target;
        }
        if (e.type === 'focusin' && !target.classList.contains('e-filtertext') && this.lastFilterElement) {
            this.lastFilterElement.nextElementSibling.classList.add('e-hide');
        }
        return false;
    }

    private updateCrossIcon(element: HTMLInputElement): void {
        if (element.value.length) {
            element.nextElementSibling.classList.remove('e-hide');
        }
    }

    private updateFilterMsg(): void {
        let gObj: IGrid = this.parent;
        let columns: PredicateModel[] = this.filterSettings.columns;
        let column: Column;
        if (!this.filterSettings.showFilterBarStatus) {
            return;
        }
        if (columns.length > 0 && this.filterStatusMsg !== this.l10n.getConstant('InvalidFilterMessage')) {
            this.filterStatusMsg = '';
            for (let index: number = 0; index < columns.length; index++) {
                column = gObj.getColumnByField(columns[index].field);
                if (index) {
                    this.filterStatusMsg += ' && ';
                }
                this.filterStatusMsg += column.headerText + ': ' + this.values[column.field];
            }
        }
        if (gObj.allowPaging) {
            gObj.updateExternalMessage(this.filterStatusMsg);
        }

        //TODO: virtual paging       
        this.filterStatusMsg = '';
    }

    private checkForSkipInput(column: Column, value: string): boolean {
        let isSkip: boolean;
        let skipInput: string[];
        if (column.type === 'number') {
            skipInput = ['=', ' ', '!'];
            if (DataUtil.operatorSymbols[value] || skipInput.indexOf(value) > -1) {
                isSkip = true;
            }
        } else if (column.type === 'string') {
            skipInput = ['>', '<', '=', '!'];
            for (let val of value) {
                if (skipInput.indexOf(val) > -1) {
                    isSkip = true;
                }
            }
        }
        return isSkip;
    }

    private processFilter(e: KeyboardEvent): void {
        this.stopTimer();
        this.startTimer(e);
    }

    private startTimer(e: KeyboardEvent): void {
        this.timer = window.setInterval(
            () => { this.onTimerTick(); },
            e.keyCode === 13 ? 0 : this.filterSettings.immediateModeDelay);
    }

    private stopTimer(): void {
        window.clearInterval(this.timer);
    }

    private onTimerTick(): void {
        let filterElement: HTMLInputElement = (this.element.querySelector('#' + this.column.field + '_filterBarcell') as HTMLInputElement);
        let filterValue: string = JSON.parse(JSON.stringify(filterElement.value));
        this.stopTimer();
        if (this.value === '') {
            this.removeFilteredColsByField(this.column.field);
            return;
        }
        this.validateFilterValue(this.value as string);
        this.filterByColumn(this.column.field, this.operator, this.value as string, this.predicate, this.matchCase);
        this.values[this.column.field] = filterValue;
        filterElement.value = filterValue;
        this.updateFilterMsg();
    }

    private validateFilterValue(value: string): void {
        let gObj: IGrid = this.parent;
        let skipInput: string[];
        let index: number;
        this.matchCase = true;
        switch (this.column.type) {
            case 'number':
                this.operator = this.filterOperators.equal;
                skipInput = ['>', '<', '=', '!'];
                for (let i: number = 0; i < value.length; i++) {
                    if (skipInput.indexOf(value[i]) > -1) {
                        index = i;
                        break;
                    }
                }
                this.getOperator(value.substring(index));
                if (index !== 0) {
                    this.value = value.substring(0, index);
                }
                if (this.value !== '' && value.length >= 1) {
                    this.value = this.valueFormatter.fromView(
                        this.value as string, this.column.getParser(), this.column.type);
                }
                if (isNaN(this.value as number)) {
                    this.filterStatusMsg = this.l10n.getConstant('InvalidFilterMessage');
                }
                break;
            case 'date':
            case 'datetime':
                this.operator = this.filterOperators.equal;
                this.getOperator(value);
                if (this.value !== '') {
                    this.value = this.valueFormatter.fromView(
                        this.value as string, this.column.getParser(), this.column.type);
                    if (isNullOrUndefined(this.value)) {
                        this.filterStatusMsg = this.l10n.getConstant('InvalidFilterMessage');
                    }
                }
                break;
            case 'string':
                this.matchCase = false;
                if (value.charAt(0) === '*') {
                    this.value = (this.value as string).slice(1);
                    this.operator = this.filterOperators.startsWith;
                } else if (value.charAt(value.length - 1) === '%') {
                    this.value = (this.value as string).slice(0, -1);
                    this.operator = this.filterOperators.startsWith;
                } else if (value.charAt(0) === '%') {
                    this.value = (this.value as string).slice(1);
                    this.operator = this.filterOperators.endsWith;
                } else {
                    this.operator = this.filterOperators.startsWith;
                }
                break;
            case 'boolean':
                if (value.toLowerCase() === 'true' || value === '1') {
                    this.value = true;
                } else if (value.toLowerCase() === 'false' || value === '0') {
                    this.value = false;
                } else if (value.length) {
                    this.filterStatusMsg = this.l10n.getConstant('InvalidFilterMessage');
                }
                this.operator = this.filterOperators.equal;
                break;
            default:
                this.operator = this.filterOperators.equal;
        }
    }

    private getOperator(value: string): void {
        let singleOp: string = value.charAt(0);
        let multipleOp: string = value.slice(0, 2);
        let operators: Object = extend(
            { '=': this.filterOperators.equal, '!': this.filterOperators.notEqual }, DataUtil.operatorSymbols);
        if (operators.hasOwnProperty(singleOp) || operators.hasOwnProperty(multipleOp)) {
            this.operator = operators[singleOp];
            this.value = value.substring(1);
            if (!this.operator) {
                this.operator = operators[multipleOp];
                this.value = value.substring(2);
            }
        }
        if (this.operator === this.filterOperators.lessThan || this.operator === this.filterOperators.greaterThan) {
            if ((this.value as string).charAt(0) === '=') {
                this.operator = this.operator + 'orequal';
                this.value = (this.value as string).substring(1);
            }
        }
    }

    private columnPositionChanged(e: { fromIndex: number, toIndex: number }): void {
        let filterCells: Element[] = [].slice.call(this.element.querySelectorAll('.e-filterbarcell'));
        filterCells.splice(e.toIndex, 0, filterCells.splice(e.fromIndex, 1)[0]);
        this.element.innerHTML = '';
        for (let cell of filterCells) {
            this.element.appendChild(cell);
        }
    }

}
