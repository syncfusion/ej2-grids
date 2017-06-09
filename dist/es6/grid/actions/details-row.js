import { createElement, closest, classList } from '@syncfusion/ej2-base/dom';
import { Grid } from '../base/grid';
import { parents, getUid } from '../base/util';
import * as events from '../base/constant';
import { AriaService } from '../services/aria-service';
var DetailsRow = (function () {
    function DetailsRow(parent) {
        this.aria = new AriaService();
        this.parent = parent;
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.keyPressed, this.keyPressHandler, this);
    }
    DetailsRow.prototype.clickHandler = function (e) {
        this.toogleExpandcollapse(closest(e.target, 'td'));
    };
    DetailsRow.prototype.toogleExpandcollapse = function (target) {
        var gObj = this.parent;
        var parent = 'parentDetails';
        if (target && (target.classList.contains('e-detailsrowcollapse') || target.classList.contains('e-detailsrowexpand'))) {
            var tr = target.parentElement;
            var nextRow = this.parent.getContentTable().querySelector('tbody').children[tr.rowIndex + 1];
            if (target.classList.contains('e-detailsrowcollapse')) {
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
                    for (var i = 0, len = gObj.groupSettings.columns.length; i < len; i++) {
                        detailRow.appendChild(createElement('td', { className: 'e-indentcell' }));
                    }
                    detailRow.appendChild(createElement('td', { className: 'e-detailindentcell' }));
                    if (gObj.detailsTemplate) {
                        detailCell.innerHTML = gObj.getDetailTemplate()(data);
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
                        var gridElem = createElement('div', {
                            id: 'child' + parents(tr, 'e-grid').length +
                                '_grid' + tr.rowIndex + getUid('')
                        });
                        grid.appendTo(gridElem);
                        detailCell.appendChild(gridElem);
                    }
                    detailRow.appendChild(detailCell);
                    tr.parentNode.insertBefore(detailRow, tr.nextSibling);
                    gObj.getRows().splice(tr.rowIndex + 1, 0, detailRow);
                    gObj.trigger(events.detailsDataBound, { detailsElement: detailCell, data: data });
                }
                classList(target, ['e-detailsrowexpand'], ['e-detailsrowcollapse']);
                classList(target.firstElementChild, ['e-dtdiagonaldown', 'e-icon-gdownarrow'], ['e-dtdiagonalright', 'e-icon-grightarrow']);
                this.aria.setExpand(target, true);
            }
            else {
                if (this.isDetailRow(nextRow)) {
                    nextRow.style.display = 'none';
                }
                classList(target, ['e-detailsrowcollapse'], ['e-detailsrowexpand']);
                classList(target.firstElementChild, ['e-dtdiagonalright', 'e-icon-grightarrow'], ['e-dtdiagonaldown', 'e-icon-gdownarrow']);
                this.aria.setExpand(target, false);
            }
        }
    };
    DetailsRow.prototype.isDetailRow = function (row) {
        return row && row.classList.contains('e-detailrow');
    };
    DetailsRow.prototype.destroy = function () {
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.keyPressed, this.keyPressHandler);
    };
    DetailsRow.prototype.getTDfromIndex = function (index, className) {
        var tr = this.parent.getDataRows()[index];
        if (tr && tr.querySelector(className)) {
            return tr.querySelector(className);
        }
        return null;
    };
    DetailsRow.prototype.expand = function (target) {
        if (!isNaN(target)) {
            target = this.getTDfromIndex(target, '.e-detailsrowcollapse');
        }
        if (target && target.classList.contains('e-detailsrowcollapse')) {
            this.toogleExpandcollapse(target);
        }
    };
    DetailsRow.prototype.collapse = function (target) {
        if (!isNaN(target)) {
            target = this.getTDfromIndex(target, '.e-detailsrowexpand');
        }
        if (target && target.classList.contains('e-detailsrowexpand')) {
            this.toogleExpandcollapse(target);
        }
    };
    DetailsRow.prototype.expandAll = function () {
        this.expandCollapse(true);
    };
    DetailsRow.prototype.collapseAll = function () {
        this.expandCollapse(false);
    };
    DetailsRow.prototype.expandCollapse = function (isExpand) {
        var td;
        var rows = this.parent.getDataRows();
        for (var i = 0, len = rows.length; i < len; i++) {
            td = rows[i].querySelector('.e-detailsrowcollapse, .e-detailsrowexpand');
            isExpand ? this.expand(td) : this.collapse(td);
        }
    };
    DetailsRow.prototype.keyPressHandler = function (e) {
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
                    var td = dataRow.querySelector('.e-detailsrowcollapse, .e-detailsrowexpand');
                    e.action === 'altDownArrow' ? this.expand(td) : this.collapse(td);
                }
                break;
        }
    };
    DetailsRow.prototype.getModuleName = function () {
        return 'detailsRow';
    };
    return DetailsRow;
}());
export { DetailsRow };
