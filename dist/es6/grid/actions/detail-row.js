import { createElement, closest, classList } from '@syncfusion/ej2-base';
import { Grid } from '../base/grid';
import { parents, getUid, appendChildren } from '../base/util';
import * as events from '../base/constant';
import { AriaService } from '../services/aria-service';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { CellType } from '../base/enum';
/**
 * `DetailRow` module is used to handle Detail Template and Hierarchy Grid operations.
 */
var DetailRow = /** @class */ (function () {
    /**
     * Constructor for the Grid detail template module
     * @hidden
     */
    function DetailRow(parent, locator) {
        //Internal variables
        this.aria = new AriaService();
        this.parent = parent;
        if (this.parent.isDestroyed) {
            return;
        }
        this.focus = locator.getService('focus');
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.keyPressed, this.keyPressHandler, this);
    }
    DetailRow.prototype.clickHandler = function (e) {
        this.toogleExpandcollapse(closest(e.target, 'td'));
    };
    DetailRow.prototype.toogleExpandcollapse = function (target) {
        var gObj = this.parent;
        var parent = 'parentDetails';
        if (target && (target.classList.contains('e-detailrowcollapse') || target.classList.contains('e-detailrowexpand'))) {
            var tr = target.parentElement;
            var uid_1 = tr.getAttribute('data-uid');
            var nextRow = this.parent.getContentTable().querySelector('tbody').children[tr.rowIndex + 1];
            if (target.classList.contains('e-detailrowcollapse')) {
                var key = 'records';
                var currentViewData = gObj.allowGrouping && gObj.groupSettings.columns.length ?
                    gObj.currentViewData[key] : gObj.currentViewData;
                var data = currentViewData[tr.getAttribute('aria-rowindex')];
                if (this.isDetailRow(nextRow)) {
                    nextRow.style.display = '';
                }
                else if (gObj.getDetailTemplate() || gObj.childGrid) {
                    var detailRow = createElement('tr', { className: 'e-detailrow' });
                    var detailCell = createElement('td', { className: 'e-detailcell' });
                    detailCell.setAttribute('colspan', this.parent.getVisibleColumns().length.toString());
                    var row = new Row({
                        isDataRow: true,
                        cells: [new Cell({ cellType: CellType.Indent }), new Cell({ isDataCell: true, visible: true })]
                    });
                    for (var i = 0, len = gObj.groupSettings.columns.length; i < len; i++) {
                        detailRow.appendChild(createElement('td', { className: 'e-indentcell' }));
                        row.cells.unshift(new Cell({ cellType: CellType.Indent }));
                    }
                    detailRow.appendChild(createElement('td', { className: 'e-detailindentcell' }));
                    detailRow.appendChild(detailCell);
                    tr.parentNode.insertBefore(detailRow, tr.nextSibling);
                    if (gObj.detailTemplate) {
                        appendChildren(detailCell, gObj.getDetailTemplate()(data, gObj, 'detailTemplate'));
                    }
                    else {
                        gObj.childGrid[parent] = {
                            parentID: gObj.element.id,
                            parentPrimaryKeys: gObj.getPrimaryKeyFieldNames(),
                            parentKeyField: gObj.childGrid.queryString,
                            parentKeyFieldValue: data[gObj.childGrid.queryString],
                            parentRowData: data
                        };
                        var grid = new Grid(gObj.childGrid);
                        var modules = grid.getInjectedModules();
                        var injectedModues = gObj.getInjectedModules();
                        if (!modules || modules.length !== injectedModues.length) {
                            grid.setInjectedModules(injectedModues);
                        }
                        var gridElem = createElement('div', {
                            id: 'child' + parents(tr, 'e-grid').length +
                                '_grid' + tr.rowIndex + getUid('')
                        });
                        detailCell.appendChild(gridElem);
                        grid.appendTo(gridElem);
                    }
                    detailRow.appendChild(detailCell);
                    tr.parentNode.insertBefore(detailRow, tr.nextSibling);
                    var idx_1;
                    this.parent.getRowsObject().some(function (r, rIndex) { idx_1 = rIndex; return r.uid === uid_1; });
                    gObj.getRows().splice(tr.rowIndex + 1, 0, detailRow);
                    this.parent.getRowsObject().splice(idx_1 + 1, 0, row);
                    gObj.trigger(events.detailDataBound, { detailElement: detailCell, data: data });
                    gObj.notify(events.detailDataBound, { rows: this.parent.getRowsObject() });
                }
                classList(target, ['e-detailrowexpand'], ['e-detailrowcollapse']);
                classList(target.firstElementChild, ['e-dtdiagonaldown', 'e-icon-gdownarrow'], ['e-dtdiagonalright', 'e-icon-grightarrow']);
                this.aria.setExpand(target, true);
            }
            else {
                if (this.isDetailRow(nextRow)) {
                    nextRow.style.display = 'none';
                }
                classList(target, ['e-detailrowcollapse'], ['e-detailrowexpand']);
                classList(target.firstElementChild, ['e-dtdiagonalright', 'e-icon-grightarrow'], ['e-dtdiagonaldown', 'e-icon-gdownarrow']);
                this.aria.setExpand(target, false);
            }
        }
    };
    DetailRow.prototype.isDetailRow = function (row) {
        return row && row.classList.contains('e-detailrow');
    };
    DetailRow.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.keyPressed, this.keyPressHandler);
    };
    DetailRow.prototype.getTDfromIndex = function (index, className) {
        var tr = this.parent.getDataRows()[index];
        if (tr && tr.querySelector(className)) {
            return tr.querySelector(className);
        }
        return null;
    };
    /**
     * Expands a detail row with the given target.
     * @param  {Element} target - Defines the collapsed element to expand.
     * @return {void}
     */
    DetailRow.prototype.expand = function (target) {
        if (!isNaN(target)) {
            target = this.getTDfromIndex(target, '.e-detailrowcollapse');
        }
        if (target && target.classList.contains('e-detailrowcollapse')) {
            this.toogleExpandcollapse(target);
        }
    };
    /**
     * Collapses a detail row with the given target.
     * @param  {Element} target - Defines the expanded element to collapse.
     * @return {void}
     */
    DetailRow.prototype.collapse = function (target) {
        if (!isNaN(target)) {
            target = this.getTDfromIndex(target, '.e-detailrowexpand');
        }
        if (target && target.classList.contains('e-detailrowexpand')) {
            this.toogleExpandcollapse(target);
        }
    };
    /**
     * Expands all the detail rows of Grid.
     * @return {void}
     */
    DetailRow.prototype.expandAll = function () {
        this.expandCollapse(true);
    };
    /**
     * Collapses all the detail rows of Grid.
     * @return {void}
     */
    DetailRow.prototype.collapseAll = function () {
        this.expandCollapse(false);
    };
    DetailRow.prototype.expandCollapse = function (isExpand) {
        var td;
        var rows = this.parent.getDataRows();
        for (var i = 0, len = rows.length; i < len; i++) {
            td = rows[i].querySelector('.e-detailrowcollapse, .e-detailrowexpand');
            isExpand ? this.expand(td) : this.collapse(td);
        }
    };
    DetailRow.prototype.keyPressHandler = function (e) {
        var gObj = this.parent;
        switch (e.action) {
            case 'ctrlDownArrow':
                this.expandAll();
                break;
            case 'ctrlUpArrow':
                this.collapseAll();
                break;
            case 'altUpArrow':
            case 'altDownArrow':
                var selected = gObj.allowSelection ? gObj.getSelectedRowIndexes() : [];
                if (selected.length) {
                    var dataRow = gObj.getDataRows()[selected[selected.length - 1]];
                    var td = dataRow.querySelector('.e-detailrowcollapse, .e-detailrowexpand');
                    e.action === 'altDownArrow' ? this.expand(td) : this.collapse(td);
                }
                break;
            case 'enter':
                if (this.parent.isEdit) {
                    return;
                }
                var element = this.focus.getFocusedElement();
                if (!element.classList.contains('e-detailrowcollapse') && !element.classList.contains('e-detailrowexpand')) {
                    break;
                }
                this.toogleExpandcollapse(element);
                break;
        }
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    DetailRow.prototype.getModuleName = function () {
        return 'detailRow';
    };
    return DetailRow;
}());
export { DetailRow };
