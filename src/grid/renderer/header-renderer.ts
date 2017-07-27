import { isNullOrUndefined } from '@syncfusion/ej2-base/util';
import { createElement, setStyleAttribute, closest as getClosest, remove } from '@syncfusion/ej2-base/dom';
import { classList } from '@syncfusion/ej2-base/dom';
import { CellType } from '../base/enum';
import { IRenderer, IGrid, ICell } from '../base/interface';
import { RowRenderer } from './row-renderer';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { Row } from '../models/row';
import { ServiceLocator } from '../services/service-locator';
import * as events from '../base/constant';
import { MouseEventArgs, Draggable, Droppable, DropEventArgs } from '@syncfusion/ej2-base';
import { ColumnWidthService } from '../services/width-controller';
import { parentsUntil } from '../base/util';
import { AriaService } from '../services/aria-service';

/**
 * Content module is used to render grid content
 * @hidden
 */
export class HeaderRender implements IRenderer {
    //Internal variables             
    private headerTable: Element;
    private headerPanel: Element;
    private colgroup: Element;
    private colDepth: number;
    private column: Column;
    private helper: Function = (e: { sender: MouseEvent }) => {
        let gObj: IGrid = this.parent;
        if (!(gObj.allowReordering || gObj.allowGrouping)) {
            return false;
        }
        let visualElement: HTMLElement = createElement('div', { className: 'e-cloneproperties e-dragclone e-headerclone' });
        let target: Element = (e.sender.target as Element);
        let element: HTMLElement = target.classList.contains('e-headercell') ? target as HTMLElement :
            parentsUntil(target, 'e-headercell') as HTMLElement;
        if (!element) {
            return false;
        }
        let height: number = element.offsetHeight;
        let headercelldiv: Element = element.querySelector('.e-headercelldiv');
        visualElement.textContent = headercelldiv ?
            gObj.getColumnByUid(headercelldiv.getAttribute('e-mappinguid')).headerText : element.innerHTML;
        visualElement.style.width = element.offsetWidth + 'px';
        visualElement.style.height = element.offsetHeight + 'px';
        visualElement.style.lineHeight = (height - 6).toString() + 'px';
        if (element.querySelector('.e-headercelldiv')) {
            this.column = gObj.getColumnByUid(element.querySelector('.e-headercelldiv').getAttribute('e-mappinguid'));
            visualElement.setAttribute('e-mappinguid', this.column.uid);
        }
        gObj.element.appendChild(visualElement);
        return visualElement;
    }
    private dragStart: Function = (e: { target: HTMLElement, event: MouseEventArgs }) => {
        let gObj: IGrid = this.parent;
        (gObj.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        gObj.notify(events.columnDragStart, { target: e.target, column: this.column, event: e.event });
    }
    private drag: Function = (e: { target: HTMLElement, event: MouseEventArgs }): void => {
        let gObj: IGrid = this.parent;
        let target: Element = e.target;
        if (target) {
            let closest: Element = getClosest(target, '.e-grid');
            let cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
            if (!closest || closest.getAttribute('id') !== gObj.element.getAttribute('id')) {
                classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                if (gObj.allowReordering) {
                    (gObj.element.querySelector('.e-reorderuparrow') as HTMLElement).style.display = 'none';
                    (gObj.element.querySelector('.e-reorderdownarrow') as HTMLElement).style.display = 'none';
                }
                return;
            }
            gObj.notify(events.columnDrag, { target: e.target, column: this.column, event: e.event });
        }
    }
    private dragStop: Function = (e: { target: HTMLElement, event: MouseEventArgs, helper: Element }) => {
        let gObj: IGrid = this.parent;
        let cancel: boolean;
        (gObj.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        if ((!parentsUntil(e.target, 'e-headercell') && !parentsUntil(e.target, 'e-groupdroparea')) ||
            (!gObj.allowReordering && parentsUntil(e.target, 'e-headercell')) ||
            (!e.helper.getAttribute('e-mappinguid') && parentsUntil(e.target, 'e-groupdroparea'))) {
            remove(e.helper);
            cancel = true;
        }
        gObj.notify(events.columnDragStop, { target: e.target, event: e.event, column: this.column, cancel: cancel });
    }
    private drop: Function = (e: DropEventArgs) => {
        let gObj: IGrid = this.parent;
        let uid: string = e.droppedElement.getAttribute('e-mappinguid');
        let closest: Element = getClosest(e.target, '.e-grid');
        remove(e.droppedElement);
        if (closest && closest.getAttribute('id') !== gObj.element.getAttribute('id') ||
            !(gObj.allowReordering || gObj.allowGrouping)) {
            return;
        }
        gObj.notify(events.headerDrop, { target: e.target, uid: uid });

    }

    //Module declarations
    private parent: IGrid;
    private serviceLocator: ServiceLocator;
    private widthService: ColumnWidthService;
    private ariaService: AriaService;
    /**
     * Constructor for header renderer module
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.ariaService = this.serviceLocator.getService<AriaService>('ariaService');
        this.widthService = this.serviceLocator.getService<ColumnWidthService>('widthService');
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
        this.parent.on(events.columnPositionChanged, this.refreshUI, this);
    }

    /**
     * The function is used to render grid header div    
     */
    public renderPanel(): void {
        let div: Element = createElement('div', { className: 'e-gridheader' });
        let innerDiv: Element = createElement('div', { className: 'e-headercontent' });
        div.appendChild(innerDiv);
        this.setPanel(div);
        this.parent.element.appendChild(div);
    }

    /**
     * The function is used to render grid header table    
     */
    public renderTable(): void {
        let headerDiv: Element = this.getPanel();
        headerDiv.appendChild(this.createHeaderTable());
        this.setTable(headerDiv.querySelector('.e-table'));
        this.initializeHeaderDrag();
        this.initializeHeaderDrop();
        this.parent.notify(events.headerRefreshed, {});
    }

    /**
     * Get the header content div element of grid 
     * @return {Element} 
     */
    public getPanel(): Element {
        return this.headerPanel;
    }

    /**
     * Set the header content div element of grid
     * @param  {Element} panel    
     */
    public setPanel(panel: Element): void {
        this.headerPanel = panel;
    }

    /**
     * Get the header table element of grid
     * @return {Element} 
     */
    public getTable(): Element {
        return this.headerTable;
    }

    /**
     * Set the header table element of grid
     * @param  {Element} table  
     */
    public setTable(table: Element): void {
        this.headerTable = table;
    }

    /**
     * Get the header colgroup element
     * @returns {Element}
     */
    public getColGroup(): Element {
        return this.colgroup;
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
     * Get the header row element collection.
     * @return {Element[]}
     */
    public getRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement> {
        let table: HTMLTableElement = <HTMLTableElement>this.getTable();
        return <HTMLCollectionOf<HTMLTableRowElement>>table.tHead.rows;
    }

    /**
     * The function is used to create header table elements
     * @return {Element} 
     * @hidden
     */
    private createHeaderTable(): Element {
        let gObj: IGrid = this.parent;
        let columns: Column[] = <Column[]>gObj.getColumns();
        let table: Element = createElement('table', { className: 'e-table', attrs: { cellspacing: '0.25px', role: 'grid' } });
        let innerDiv: Element = <Element>this.getPanel().firstChild;
        let thead: Element = createElement('thead');
        let tbody: Element = createElement('tbody', { className: 'e-hide' });
        let colHeader: Element = createElement('tr', { className: 'e-columnheader', attrs: { role: 'row' } });
        let colGroup: Element = createElement('colgroup');
        let rowBody: Element = createElement('tr');
        let bodyCell: Element;
        let rowRenderer: RowRenderer<Column> = new RowRenderer(this.serviceLocator, CellType.Header);
        rowRenderer.element = colHeader;
        let rows: Row<Column>[] = [];
        let headerRow: Element;
        this.colDepth = this.getObjDepth();
        for (let i: number = 0, len: number = this.colDepth; i < len; i++) {
            rows[i] = this.generateRow(i);
            rows[i].cells = [];
        }
        rows = this.ensureColumns(rows);
        rows = this.getHeaderCells(rows);
        for (let i: number = 0, len: number = this.colDepth; i < len; i++) {
            headerRow = rowRenderer.render(rows[i], columns);
            thead.appendChild(headerRow);
        }
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            for (let j: number = 0, len: number = rows[i].cells.length; j < len; j++) {
                let cell: Cell<Column> = rows[i].cells[j];
                bodyCell = createElement('td');
                rowBody.appendChild(bodyCell);
            }
        }
        if (gObj.allowFiltering || gObj.allowSorting || gObj.allowGrouping) {
            table.classList.add('e-sortfilter');
        }
        this.updateColGroup(colGroup);
        tbody.appendChild(rowBody);
        table.appendChild(this.setColGroup(colGroup));
        table.appendChild(thead);
        table.appendChild(tbody);
        innerDiv.appendChild(table);
        this.ariaService.setOptions(table as HTMLElement, { colcount: gObj.getColumns().length.toString() });
        return innerDiv;
    }

    private updateColGroup(colGroup: Element): Element {
        let cols: Column[] = this.parent.getColumns() as Column[];
        let col: Element;
        if (this.parent.allowGrouping) {
            for (let i: number = 0, len: number = this.parent.groupSettings.columns.length; i < len; i++) {
                col = createElement('col');
                colGroup.appendChild(col);
            }
        }
        if (this.parent.detailTemplate || this.parent.childGrid) {
            col = createElement('col');
            colGroup.appendChild(col);
        }
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            col = createElement('col');
            if (cols[i].visible === false) {
                setStyleAttribute(<HTMLElement>col, { 'display': 'none' });
            }
            colGroup.appendChild(col);

        }
        return colGroup;
    }

    private ensureColumns(rows: Row<Column>[]): Row<Column>[] {
        //TODO: generate dummy column for group, detail, stacked row here; ensureColumns here
        let gObj: IGrid = this.parent;
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            if (gObj.allowGrouping) {
                for (let c: number = 0, len: number = gObj.groupSettings.columns.length; c < len; c++) {
                    rows[i].cells.push(this.generateCell({} as Column, CellType.HeaderIndent));
                }
            }
            if (gObj.detailTemplate || gObj.childGrid) {
                rows[i].cells.push(this.generateCell({} as Column, CellType.DetailHeader));
            }
        }
        return rows;
    }

    private getHeaderCells(rows: Row<Column>[]): Row<Column>[] {
        let cols: Column[] = this.parent.columns as Column[];

        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            rows = this.appendCells(cols[i], rows, 0, i === 0, false);
        }
        return rows;
    }

    private appendCells(cols: Column, rows: Row<Column>[], index: number, isFirstObj: boolean, isFirstCol: boolean): Row<Column>[] {
        if (!cols.columns) {
            let col: Column = this.parent.getColumnByField(cols.field);
            rows[index].cells.push(this.generateCell(
                col, CellType.Header, this.colDepth - index,
                (isFirstObj ? '' : (isFirstCol ? 'e-firstcell' : '')), index, this.parent.getColumnIndexByUid(col.uid)));
        } else {
            let colSpan: number = this.getCellCnt(cols, 0);
            if (colSpan) {
                rows[index].cells.push(new Cell<Column>(<{ [x: string]: Object }>{
                    cellType: CellType.StackedHeader, column: cols, colSpan: colSpan
                }));
            }
            for (let i: number = 0, len: number = cols.columns.length; i < len; i++) {
                rows = this.appendCells((cols.columns as Column[])[i], rows, index + 1, isFirstObj, i === 0);
            }
        }
        return rows;
    }

    private generateRow(index: number): Row<Column> {
        return new Row<Column>({});
    }

    private generateCell(
        column: Column, cellType?: CellType, rowSpan?: number, className?: string,
        rowIndex?: number, colIndex?: number): Cell<Column> {
        let opt: ICell<Column> = {
            'visible': column.visible,
            'isDataCell': false,
            'isTemplate': !isNullOrUndefined(column.headerTemplate),
            'rowID': '',
            'column': column,
            'cellType': cellType,
            'rowSpan': rowSpan,
            'className': className,
            'index': rowIndex,
            'colIndex': colIndex
        };

        if (!opt.rowSpan || opt.rowSpan < 2) {
            delete opt.rowSpan;
        }

        return new Cell<Column>(<{ [x: string]: Object }>opt);
    }

    /**
     * Function to hide header table column based on visible property
     * @param  {Column[]} columns?
     */
    public setVisible(columns?: Column[]): void {
        let rows: HTMLTableRowElement[] = [].slice.call(this.getRows()); //NodeList -> Array        
        let displayVal: string = '';
        let idx: number;
        let className: Function;
        let element: HTMLTableRowElement;

        for (let c: number = 0, clen: number = columns.length; c < clen; c++) {
            let column: Column = columns[c];

            idx = this.parent.getNormalizedColumnIndex(column.uid);

            if (column.visible === false) {
                displayVal = 'none';
            }

            setStyleAttribute(<HTMLElement>this.getColGroup().childNodes[idx], { 'display': displayVal });

            this.refreshUI();
        }
    }

    /** 
     * Refresh the header of the Grid. 
     * @returns {void} 
     */
    public refreshUI(): void {
        let headerDiv: Element = this.getPanel();
        headerDiv.firstElementChild.innerHTML = '';
        headerDiv.appendChild(this.createHeaderTable());
        this.setTable(headerDiv.querySelector('.e-table'));
        this.parent.notify(events.colGroupRefresh, {});
        this.widthService.setWidthToColumns();
        this.initializeHeaderDrag();
        this.parent.notify(events.headerRefreshed, {});
    }

    private getObjDepth(): number {
        let max: number = 0;
        let cols: Column[] = this.parent.columns as Column[];
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            let depth: number = this.checkDepth(cols[i] as Column, 0);
            if (max < depth) {
                max = depth;
            }
        }
        return max + 1;
    }

    private checkDepth(col: Column, index: number): number {
        if (col.columns) {
            index++;
            for (let i: number = 0, len: number = col.columns.length; i < len; i++) {
                index = this.checkDepth(col.columns[i] as Column, index);
            }
        }
        return index;
    }

    private getCellCnt(col: Column, cnt: number): number {
        if (col.columns) {
            for (let i: number = 0, len: number = col.columns.length; i < len; i++) {
                cnt = this.getCellCnt(col.columns[i] as Column, cnt);
            }
        } else {
            if (col.visible) {
                cnt++;
            }
        }
        return cnt;
    }

    private initializeHeaderDrag(): void {
        let gObj: IGrid = this.parent;
        if (!(this.parent.allowReordering || this.parent.allowGrouping)) {
            return;
        }
        let headerRows: Element[] = [].slice.call(gObj.getHeaderContent().querySelectorAll('.e-columnheader'));
        for (let i: number = 0, len: number = headerRows.length; i < len; i++) {
            let drag: Draggable = new Draggable(headerRows[i] as HTMLElement, {
                dragTarget: '.e-headercell',
                distance: 5,
                helper: this.helper,
                dragStart: this.dragStart,
                drag: this.drag,
                dragStop: this.dragStop
            });
        }
    }

    private initializeHeaderDrop(): void {
        let gObj: IGrid = this.parent;
        let drop: Droppable = new Droppable(gObj.getHeaderContent() as HTMLElement, {
            accept: '.e-dragclone',
            drop: this.drop as (e: DropEventArgs) => void
        });
    }



}