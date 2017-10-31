import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { createElement, attributes as addAttributes } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { rowDataBound, queryCellInfo } from '../base/constant';
import { setStyleAndAttributes } from '../base/util';
import { ICellRenderer, IRowRenderer, IRow, QueryCellInfoEventArgs, RowDataBoundEventArgs, IGrid } from '../base/interface';
import { CellType } from '../base/enum';
import { CellRendererFactory } from '../services/cell-render-factory';
import { ServiceLocator } from '../services/service-locator';
import { CellMergeRender } from './cell-merge-renderer';

/**
 * RowRenderer class which responsible for building row content. 
 * @hidden
 */
export class RowRenderer<T> implements IRowRenderer<T> {

    public element: Element = createElement('tr', { attrs: { role: 'row' } });

    private cellRenderer: ICellRenderer<T>;

    private serviceLocator: ServiceLocator;

    private cellType: CellType;

    protected parent: IGrid;

    constructor(serviceLocator?: ServiceLocator, cellType?: CellType, parent?: IGrid) {
        this.cellType = cellType;
        this.serviceLocator = serviceLocator;
        this.parent = parent;
    }

    /**
     * Function to render the row content based on Column[] and data.
     * @param  {Column[]} columns
     * @param  {Object} data?
     * @param  {{[x:string]:Object}} attributes?
     * @param  {string} rowTemplate?
     */
    public render(row: Row<T>, columns: Column[], attributes?: { [x: string]: Object }, rowTemplate?: string): Element {
        return this.refreshRow(row, columns, attributes, rowTemplate);
    }

    /**
     * Function to refresh the row content based on Column[] and data.
     * @param  {Column[]} columns
     * @param  {Object} data?
     * @param  {{[x:string]:Object}} attributes?
     * @param  {string} rowTemplate?
     */
    public refresh(row: Row<T>, columns: Column[], isChanged: boolean, attributes?: { [x: string]: Object }, rowTemplate?: string): void {
        if (isChanged) {
            row.data = extend({}, row.changes);
            this.refreshMergeCells(row);
        }
        let node: Element = this.parent.getContent().querySelector('[data-uid=' + row.uid + ']');
        let tr: Element = this.refreshRow(row, columns, attributes, rowTemplate);
        let cells: HTMLTableDataCellElement[] = [].slice.call((tr as HTMLTableRowElement).cells);
        node.innerHTML = '';
        for (let cell of cells) {
            node.appendChild(cell);
        }
    }

    private refreshRow(row: Row<T>, columns: Column[], attributes?: { [x: string]: Object }, rowTemplate?: string): Element {
        let tr: Element = this.element.cloneNode() as Element;
        let rowArgs: RowDataBoundEventArgs = { data: row.data };
        let cellArgs: QueryCellInfoEventArgs = { data: row.data };
        let attrCopy: Object = extend({}, attributes, {});

        if (row.isDataRow) {
            row.isSelected = this.parent.getSelectedRowIndexes().indexOf(row.index) > -1;
        }

        this.buildAttributeFromRow(tr, row);

        addAttributes(tr, attrCopy as { [x: string]: string });
        setStyleAndAttributes(tr, row.attributes);

        let cellRendererFact: CellRendererFactory = this.serviceLocator.getService<CellRendererFactory>('cellRendererFactory');
        for (let i: number = 0, len: number = row.cells.length; i < len; i++) {
            let cell: Cell<T> = row.cells[i]; cell.isSelected = row.isSelected;
            let cellRenderer: ICellRenderer<T> = cellRendererFact.getCellRenderer(row.cells[i].cellType || CellType.Data);
            let td: Element = cellRenderer.render(
                row.cells[i], row.data,
                { 'index': !isNullOrUndefined(row.index) ? row.index.toString() : '' });
            if (row.cells[i].cellType === CellType.Data) {
                this.parent.trigger(queryCellInfo, extend(
                    cellArgs, <QueryCellInfoEventArgs>{ cell: td, column: <{}>cell.column, colSpan: 1 }));
                if (cellArgs.colSpan > 1 || row.cells[i].cellSpan > 1) {
                    let cellMerge: CellMergeRender<T> = new CellMergeRender(this.serviceLocator, this.parent);
                    td = cellMerge.render(cellArgs, row, i, td);
                }
            }
            if ( !row.cells[i].isSpanned) {
                tr.appendChild(td);
            }

        }
        if (row.isDataRow) {
            this.parent.trigger(rowDataBound, extend(rowArgs, <RowDataBoundEventArgs>{ row: tr }));
        }
        if (row.cssClass) {
            tr.classList.add(row.cssClass);
        }
        return tr;
    }
    private refreshMergeCells(row: Row<T>): Row<T> {
        for ( let cell of row.cells ){
            cell.isSpanned = false;
        }
        return row;
    }
    /**
     * Function to check and add alternative row css class.
     * @param  {Element} tr
     * @param  {{[x:string]:Object}} attr
     */
    public buildAttributeFromRow(tr: Element, row: Row<T>): void {
        let attr: IRow<T> & { 'class'?: string[] } = {};
        let prop: { 'rowindex'?: string; 'dataUID'?: string, 'ariaSelected'?: string }
            = { 'rowindex': 'aria-rowindex', 'dataUID': 'data-uid', 'ariaSelected': 'aria-selected' };
        let classes: string[] = [];

        if (row.isDataRow) {
            classes.push('e-row');
        }

        if (row.isAltRow) {
            classes.push('e-altrow');
        }

        if (!isNullOrUndefined(row.index)) {
            attr[prop.rowindex] = row.index;
        }

        if (row.rowSpan) {
            attr.rowSpan = row.rowSpan;
        }

        if (row.uid) {
            attr[prop.dataUID] = row.uid;
        }

        if (row.isSelected) {
            attr[prop.ariaSelected] = true;
        }

        if (row.visible === false) {
            classes.push('e-hide');
        }

        attr.class = classes;

        setStyleAndAttributes(tr, attr);
    }

}