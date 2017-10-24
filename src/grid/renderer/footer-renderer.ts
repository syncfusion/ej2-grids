import { createElement } from '@syncfusion/ej2-base';
import { formatUnit } from '@syncfusion/ej2-base';
import { IRenderer, IGrid } from '../base/interface';
import { Browser } from '@syncfusion/ej2-base';
import { colGroupRefresh, columnWidthChanged, scroll, columnVisibilityChanged } from '../base/constant';
import { Column } from '../models/column';
import { AggregateRowModel, AggregateColumnModel } from '../models/models';
import { Row } from '../models/row';
import { ContentRender } from './content-renderer';
import { RowRenderer } from './row-renderer';
import { ServiceLocator } from '../services/service-locator';
import { SummaryModelGenerator } from '../services/summary-model-generator';

/**
 * Footer module is used to render grid content
 * @hidden
 */
export class FooterRenderer extends ContentRender implements IRenderer {
    //private parent: Grid;
    private locator: ServiceLocator;
    protected modelGenerator: SummaryModelGenerator;
    private aggregates: Object = {};

    constructor(gridModule?: IGrid, serviceLocator?: ServiceLocator) {
        super(gridModule, serviceLocator);
        this.parent = gridModule;
        this.locator = serviceLocator;
        this.modelGenerator = new SummaryModelGenerator(this.parent);
        this.addEventListener();
    }

    /**
     * The function is used to render grid footer div    
     */
    public renderPanel(): void {
        let div: Element = createElement('div', { className: 'e-gridfooter' });
        let innerDiv: Element = createElement('div', { className: 'e-summarycontent' });
        if (Browser.isDevice) { (<HTMLElement>innerDiv).style.overflowX = 'scroll'; }
        div.appendChild(innerDiv);
        this.setPanel(div);
        if (this.parent.getPager() != null) {
            this.parent.element.insertBefore(div, this.parent.getPager());
        } else {
            this.parent.element.appendChild(div);
        }
    }
    /**
     * The function is used to render grid footer table    
     */
    public renderTable(): void {
        let contentDiv: Element = this.getPanel();
        let innerDiv: Element = this.createContentTable();
        let table: HTMLTableElement = <HTMLTableElement>innerDiv.querySelector('.e-table');
        let tFoot: HTMLTableSectionElement = <HTMLTableSectionElement>createElement('tfoot');
        table.appendChild(tFoot);
        this.setTable(table);
    }

    private renderSummaryContent(e?: Object): void {
        let input: Object[] = this.parent.dataSource instanceof Array ? this.parent.dataSource : this.parent.currentViewData;
        let summaries: AggregateRowModel[] = <AggregateRowModel[]>this.modelGenerator.getData();
        let dummies: Column[] = this.modelGenerator.getColumns();
        let rows: Row<AggregateColumnModel>[] = this.modelGenerator.generateRows(input, e || this.aggregates);
        let fragment: DocumentFragment = <DocumentFragment>document.createDocumentFragment();

        let rowrenderer: RowRenderer<AggregateColumnModel> = new RowRenderer<AggregateColumnModel>(this.locator);
        rowrenderer.element = createElement('TR', { className: 'e-summaryrow' });

        for (let srow: number = 0, len: number = summaries.length; srow < len; srow ++) {
            let row: Row<AggregateColumnModel> = rows[srow];
            if (!row) { continue; }
            let tr: Element = rowrenderer.render(row, dummies);
            fragment.appendChild(tr);
        }

        (<HTMLTableElement>this.getTable()).tFoot.appendChild(fragment);
        this.aggregates = e;
    }

    public refresh(e?: { aggregates?: Object }): void {
        (<HTMLTableElement>this.getTable()).tFoot.innerHTML = '';
        this.renderSummaryContent(e);
        this.onScroll();
    }

    public refreshCol(): void {
        let headerCol: Node = this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').cloneNode(true);
        this.getTable().replaceChild(headerCol, this.getColGroup());
        this.setColGroup(<Element>headerCol);
    }

    private onWidthChange(args: { index: string, width: number, module: string }): void {
        this.getColGroup().children[args.index].style.width = formatUnit(args.width);
        if (this.parent.allowResizing && args.module === 'resize') { this.updateFooterTableWidth(this.getTable() as HTMLElement); }
    }

    private onScroll(e: { left: number } = { left: (<HTMLElement>this.parent.getContent().firstChild).scrollLeft }): void {
        (<HTMLElement>this.getPanel().firstChild).scrollLeft = e.left;
    }

    private columnVisibilityChanged(): void {
        this.refresh();
    }

    public addEventListener(): void {
        this.parent.on(colGroupRefresh, this.refreshCol, this);
        this.parent.on(columnWidthChanged, this.onWidthChange, this);
        this.parent.on(scroll, this.onScroll, this);
        this.parent.on(columnVisibilityChanged, this.columnVisibilityChanged, this);
    }

    public removeEventListener(): void {
        this.parent.off(colGroupRefresh, this.refreshCol);
        this.parent.off(columnWidthChanged, this.onWidthChange);
        this.parent.off(scroll, this.onScroll);
        this.parent.off(columnVisibilityChanged, this.columnVisibilityChanged);
    }
    private updateFooterTableWidth(tFoot: HTMLElement): void {
        let tHead: HTMLTableElement = this.parent.getHeaderTable() as HTMLTableElement;
        if (tHead && tFoot) {
            tFoot.style.width = tHead.style.width;
        }
    }
}

