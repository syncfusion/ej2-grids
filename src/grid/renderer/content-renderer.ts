import { Droppable, DropEventArgs, Browser } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base/util';
import { createElement, setStyleAttribute, remove } from '@syncfusion/ej2-base/dom';
import { getUpdateUsingRaf } from '../base/util';
import * as events from '../base/constant';
import { IRenderer, IGrid, NotifyArgs, IModelGenerator } from '../base/interface';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { RowRenderer } from './row-renderer';
import { ServiceLocator } from '../services/service-locator';
import { AriaService } from '../services/aria-service';
import { RowModelGenerator } from '../services/row-model-generator';
import { GroupModelGenerator } from '../services/group-model-generator';


/**
 * Content module is used to render grid content
 * @hidden
 */
export class ContentRender implements IRenderer {
    //Internal variables             
    private contentTable: Element;
    private contentPanel: Element;
    private rows: Row<Column>[] = [];
    private rowElements: Element[];
    private colgroup: Element;
    private drop: Function = (e: DropEventArgs) => {
        this.parent.notify(events.columnDrop, { target: e.target, droppedElement: e.droppedElement });
        remove(e.droppedElement);
    }
    private args: NotifyArgs;
    private rafCallback: Function = () => {
        this.ariaService.setBusy(<HTMLElement>this.getPanel().firstChild, false);
        if (this.parent.isDestroyed) { return; }
        this.parent.notify(events.contentReady, {});
        this.parent.trigger(events.dataBound, {});
        if (this.args) {
            let action: string = (this.args.requestType || '').toLowerCase() + '-complete';
            this.parent.notify(action, this.args);
        }
    }
    //Module declarations
    protected parent: IGrid;
    private serviceLocator: ServiceLocator;
    private ariaService: AriaService;

    /**
     * Constructor for content renderer module
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.ariaService = this.serviceLocator.getService<AriaService>('ariaService');
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
        this.parent.on(events.colGroupRefresh, this.colGroupRefresh, this);
    }

    /**
     * The function is used to render grid content div    
     */
    public renderPanel(): void {
        let gObj: IGrid = this.parent;
        let div: Element = createElement('div', { className: 'e-gridcontent' });
        let innerDiv: Element = createElement('div', {
            className: 'e-content'
        });
        if (!Browser.isDevice) {
            innerDiv.setAttribute('tabindex', '0');
        }
        this.ariaService.setOptions(<HTMLElement>innerDiv, { busy: false });
        div.appendChild(innerDiv);
        this.setPanel(div);
        gObj.element.appendChild(div);
    }

    /**
     * The function is used to render grid content table    
     */
    public renderTable(): void {
        let contentDiv: Element = this.getPanel();
        contentDiv.appendChild(this.createContentTable());
        this.setTable(contentDiv.querySelector('.e-table'));
        this.ariaService.setOptions(<HTMLElement>this.getTable(), {
            multiselectable: this.parent.selectionSettings.type === 'multiple'
        });
        this.initializeContentDrop();
    }

    /**
     * The function is used to create content table elements
     * @return {Element} 
     * @hidden
     */
    public createContentTable(): Element {
        let innerDiv: Element = <Element>this.getPanel().firstChild;
        let table: Element = createElement('table', { className: 'e-table', attrs: { cellspacing: '0.25px', role: 'grid' } });
        this.setColGroup(<Element>this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').cloneNode(true));
        table.appendChild(this.getColGroup());
        table.appendChild(createElement('tbody'));
        innerDiv.appendChild(table);
        return innerDiv;
    }

    /** 
     * Refresh the content of the Grid. 
     * @return {void}  
     */
    public refreshContentRows(args?: NotifyArgs): void {
        let gObj: IGrid = this.parent;
        let dataSource: Object = gObj.currentViewData;
        let frag: DocumentFragment = document.createDocumentFragment();
        let columns: Column[] = <Column[]>gObj.getColumns();
        let tr: Element;
        let row: RowRenderer<Column> = new RowRenderer(this.serviceLocator, null, this.parent);
        this.rowElements = [];
        let model: IModelGenerator<Column> = gObj.allowGrouping && gObj.groupSettings.columns.length ?
            new GroupModelGenerator(this.parent) : new RowModelGenerator(this.parent);
        let modelData: Row<Column>[] = model.generateRows(dataSource);
        let tbody: Element = this.getTable().querySelector('tbody');

        for (let i: number = 0, len: number = modelData.length; i < len; i++) {
            if (!gObj.rowTemplate) {
                tr = row.render(modelData[i], columns);
            } else {
                tr = gObj.getRowTemplate()(extend({ index: i }, dataSource[i]))[0].children[0];
            }
            frag.appendChild(tr);
            this.rows.push(modelData[i]);
            if (modelData[i].isDataRow) {
                //detailrowvisible 
                let td: Element = tr.querySelectorAll('.e-rowcell:not(.e-hide)')[0];
                if (td) {
                    td.classList.add('e-detailrowvisible');
                }
                this.rowElements.push(tr);
            }
            this.ariaService.setOptions(this.getTable() as HTMLElement, { colcount: gObj.getColumns().length.toString() });
        }
        this.args = args;
        getUpdateUsingRaf<HTMLElement>(
            () => {
                remove(tbody);
                tbody = createElement('tbody');
                tbody.appendChild(frag);
                this.getTable().appendChild(tbody);
            },
            this.rafCallback);
    }


    /**
     * Get the content div element of grid
     * @return {Element} 
     */
    public getPanel(): Element {
        return this.contentPanel;
    }

    /**
     * Set the content div element of grid
     * @param  {Element} panel   
     */
    public setPanel(panel: Element): void {
        this.contentPanel = panel;
    }

    /**
     * Get the content table element of grid
     * @return {Element} 
     */
    public getTable(): Element {
        return this.contentTable;
    }

    /**
     * Set the content table element of grid
     * @param  {Element} table   
     */
    public setTable(table: Element): void {
        this.contentTable = table;
    }

    /**
     * Get the Row collection in the Grid.
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>}
     */
    public getRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement> {
        return this.rows;
    }


    /**
     * Get the content table data row elements
     * @return {Element} 
     */
    public getRowElements(): Element[] {
        return this.rowElements;
    }

    /**
     * Get the header colgroup element
     * @returns {Element}
     */
    public getColGroup(): Element {
        return this.colgroup;
    }

    /**
     * Get the content table data row elements
     * @return {Element} 
     */
    public setRowElements(elements: Element[]): void {
        this.rowElements = elements;
    }

    /**
     * Set the header colgroup element
     * @param {Element} colgroup
     * @returns {Element}
     */
    public setColGroup(colGroup: Element): Element {
        return this.colgroup = colGroup;
    }
    /**
     * Function to hide content table column based on visible property
     * @param  {Column[]} columns?
     */
    public setVisible(columns?: Column[]): void {
        let rows: Row<Column>[] = <Row<Column>[]>this.getRows();
        let element: Row<Column>;
        let testRow: Row<Column>;
        rows.some((r: Row<Column>) => { if (r.isDataRow) { testRow = r; } return r.isDataRow; });
        let tasks: Function[] = [];

        for (let c: number = 0, clen: number = columns.length; c < clen; c++) {
            let column: Column = columns[c];
            let idx: number = this.parent.getNormalizedColumnIndex(column.uid);

            //used canSkip method to skip unwanted visible toggle operation. 
            if (this.canSkip(column, testRow, idx)) {
                continue;
            }

            let displayVal: string = column.visible === true ? '' : 'none';

            setStyleAttribute(<HTMLElement>this.getColGroup().childNodes[idx], { 'display': displayVal });

        }

        this.refreshContentRows({ requestType: 'refresh' });
    }

    private colGroupRefresh(): void {
        if (this.getColGroup()) {
            let colGroup: Element = this.getColGroup();
            colGroup.innerHTML = this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').innerHTML;
            this.setColGroup(colGroup);
        }
    }

    private initializeContentDrop(): void {
        let gObj: IGrid = this.parent;
        let drop: Droppable = new Droppable(gObj.getContent() as HTMLElement, {
            accept: '.e-dragclone',
            drop: this.drop as (e: DropEventArgs) => void
        });
    }


    private canSkip(column: Column, row: Row<Column>, index: number): boolean {
        /**
         * Skip the toggle visiblity operation when one of the following success
         * 1. Grid has empty records
         * 2. column visible property is unchanged
         * 3. cell`s isVisible property is same as column`s visible property.
         */
        return isNullOrUndefined(row) ||           //(1)
            isNullOrUndefined(column.visible) ||   //(2)    
            row.cells[index].visible === column.visible;  //(3)
    }
}