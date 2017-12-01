import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { createElement, attributes as addAttributes } from '@syncfusion/ej2-base';
import { rowDataBound, queryCellInfo } from '../base/constant';
import { setStyleAndAttributes } from '../base/util';
import { CellType } from '../base/enum';
import { CellMergeRender } from './cell-merge-renderer';
/**
 * RowRenderer class which responsible for building row content.
 * @hidden
 */
var RowRenderer = /** @class */ (function () {
    function RowRenderer(serviceLocator, cellType, parent) {
        this.element = createElement('tr', { attrs: { role: 'row' } });
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
    RowRenderer.prototype.render = function (row, columns, attributes, rowTemplate) {
        return this.refreshRow(row, columns, attributes, rowTemplate);
    };
    /**
     * Function to refresh the row content based on Column[] and data.
     * @param  {Column[]} columns
     * @param  {Object} data?
     * @param  {{[x:string]:Object}} attributes?
     * @param  {string} rowTemplate?
     */
    RowRenderer.prototype.refresh = function (row, columns, isChanged, attributes, rowTemplate) {
        if (isChanged) {
            row.data = extend({}, row.changes);
            this.refreshMergeCells(row);
        }
        var node = this.parent.element.querySelector('[data-uid=' + row.uid + ']');
        var tr = this.refreshRow(row, columns, attributes, rowTemplate);
        var cells = [].slice.call(tr.cells);
        node.innerHTML = '';
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var cell = cells_1[_i];
            node.appendChild(cell);
        }
    };
    RowRenderer.prototype.refreshRow = function (row, columns, attributes, rowTemplate) {
        var tr = this.element.cloneNode();
        var rowArgs = { data: row.data };
        var cellArgs = { data: row.data };
        var attrCopy = extend({}, attributes, {});
        if (row.isDataRow) {
            row.isSelected = this.parent.getSelectedRowIndexes().indexOf(row.index) > -1;
        }
        this.buildAttributeFromRow(tr, row);
        addAttributes(tr, attrCopy);
        setStyleAndAttributes(tr, row.attributes);
        var cellRendererFact = this.serviceLocator.getService('cellRendererFactory');
        for (var i = 0, len = row.cells.length; i < len; i++) {
            var cell = row.cells[i];
            cell.isSelected = row.isSelected;
            var cellRenderer = cellRendererFact.getCellRenderer(row.cells[i].cellType || CellType.Data);
            var td = cellRenderer.render(row.cells[i], row.data, { 'index': !isNullOrUndefined(row.index) ? row.index.toString() : '' });
            if (row.cells[i].cellType === CellType.Data) {
                this.parent.trigger(queryCellInfo, extend(cellArgs, { cell: td, column: cell.column, colSpan: 1 }));
                if (cellArgs.colSpan > 1 || row.cells[i].cellSpan > 1) {
                    var cellMerge = new CellMergeRender(this.serviceLocator, this.parent);
                    td = cellMerge.render(cellArgs, row, i, td);
                }
            }
            if (!row.cells[i].isSpanned) {
                tr.appendChild(td);
            }
        }
        if (row.isDataRow) {
            this.parent.trigger(rowDataBound, extend(rowArgs, { row: tr }));
        }
        if (row.cssClass) {
            tr.classList.add(row.cssClass);
        }
        return tr;
    };
    RowRenderer.prototype.refreshMergeCells = function (row) {
        for (var _i = 0, _a = row.cells; _i < _a.length; _i++) {
            var cell = _a[_i];
            cell.isSpanned = false;
        }
        return row;
    };
    /**
     * Function to check and add alternative row css class.
     * @param  {Element} tr
     * @param  {{[x:string]:Object}} attr
     */
    RowRenderer.prototype.buildAttributeFromRow = function (tr, row) {
        var attr = {};
        var prop = { 'rowindex': 'aria-rowindex', 'dataUID': 'data-uid', 'ariaSelected': 'aria-selected' };
        var classes = [];
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
    };
    return RowRenderer;
}());
export { RowRenderer };
