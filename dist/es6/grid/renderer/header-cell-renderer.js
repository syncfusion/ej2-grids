var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, attributes } from '@syncfusion/ej2-base';
import { setStyleAndAttributes } from '../base/util';
import { CellRenderer } from './cell-renderer';
import { AriaService } from '../services/aria-service';
import { CheckBox } from '@syncfusion/ej2-buttons';
var HeaderCellRenderer = (function (_super) {
    __extends(HeaderCellRenderer, _super);
    function HeaderCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = createElement('TH', { className: 'e-headercell', attrs: { role: 'columnheader', tabindex: '-1' } });
        _this.ariaService = new AriaService();
        _this.hTxtEle = createElement('span', { className: 'e-headertext' });
        _this.sortEle = createElement('div', { className: 'e-sortfilterdiv e-icons' });
        _this.gui = createElement('div');
        _this.chkAllBox = createElement('input', { className: 'e-checkselectall', attrs: { 'type': 'checkbox' } });
        return _this;
    }
    HeaderCellRenderer.prototype.getGui = function () {
        return this.gui.cloneNode();
    };
    HeaderCellRenderer.prototype.render = function (cell, data, attributes) {
        var node = this.element.cloneNode();
        var fltrMenuEle = createElement('div', { className: 'e-filtermenudiv e-icons e-icon-filter' });
        return this.prepareHeader(cell, node, fltrMenuEle);
    };
    HeaderCellRenderer.prototype.refresh = function (cell, node) {
        this.clean(node);
        var fltrMenuEle = createElement('div', { className: 'e-filtermenudiv e-icons e-icon-filter' });
        return this.prepareHeader(cell, node, fltrMenuEle);
    };
    HeaderCellRenderer.prototype.clean = function (node) {
        node.innerHTML = '';
    };
    HeaderCellRenderer.prototype.prepareHeader = function (cell, node, fltrMenuEle) {
        var column = cell.column;
        var ariaAttr = {};
        var innerDIV = this.getGui();
        attributes(innerDIV, {
            'e-mappinguid': column.uid,
            'class': 'e-headercelldiv'
        });
        if (column.type !== 'checkbox') {
            var value = column.headerText;
            var headerText = this.hTxtEle.cloneNode();
            headerText[column.getDomSetter()] = value;
            innerDIV.appendChild(headerText);
        }
        else {
            column.editType = 'booleanedit';
            var checkAllBox = this.chkAllBox.cloneNode();
            innerDIV.appendChild(checkAllBox);
            var checkAllBoxObj = new CheckBox();
            checkAllBoxObj.appendTo(checkAllBox);
            innerDIV.classList.add('e-headerchkcelldiv');
        }
        this.buildAttributeFromCell(node, cell);
        this.appendHtml(node, innerDIV);
        node.appendChild(this.sortEle.cloneNode());
        if ((this.parent.allowFiltering && this.parent.filterSettings.type !== 'filterbar') &&
            (column.allowFiltering && !isNullOrUndefined(column.field)) &&
            !(this.parent.showColumnMenu && column.showColumnMenu)) {
            attributes(fltrMenuEle, {
                'e-mappinguid': 'e-flmenu-' + column.uid,
            });
            node.classList.add('e-fltr-icon');
            var matchFlColumns = [];
            if (this.parent.filterSettings.columns.length && this.parent.filterSettings.columns.length !== matchFlColumns.length) {
                for (var index = 0; index < this.parent.columns.length; index++) {
                    for (var count = 0; count < this.parent.filterSettings.columns.length; count++) {
                        if (this.parent.filterSettings.columns[count].field === column.field) {
                            fltrMenuEle.classList.add('e-filtered');
                            matchFlColumns.push(column.field);
                            break;
                        }
                    }
                }
            }
            node.appendChild(fltrMenuEle.cloneNode());
        }
        if (cell.className) {
            node.classList.add(cell.className);
        }
        if (column.customAttributes) {
            setStyleAndAttributes(node, column.customAttributes);
        }
        if (column.allowSorting) {
            ariaAttr.sort = 'none';
        }
        if (column.allowGrouping) {
            ariaAttr.grabbed = false;
        }
        node = this.extendPrepareHeader(column, node);
        if (!isNullOrUndefined(column.headerTemplate)) {
            if (column.headerTemplate.indexOf('#') !== -1) {
                innerDIV.innerHTML = document.querySelector(column.headerTemplate).innerHTML.trim();
            }
            else {
                innerDIV.innerHTML = column.headerTemplate;
            }
        }
        this.ariaService.setOptions(node, ariaAttr);
        if (!isNullOrUndefined(column.headerTextAlign) || !isNullOrUndefined(column.textAlign)) {
            var alignment = column.headerTextAlign || column.textAlign;
            innerDIV.style.textAlign = alignment;
            if (alignment === 'right' || alignment === 'left') {
                node.classList.add(alignment === 'right' ? 'e-rightalign' : 'e-leftalign');
            }
        }
        if (column.clipMode === 'clip') {
            node.classList.add('e-gridclip');
        }
        else if (column.clipMode === 'ellipsiswithtooltip') {
            node.classList.add('e-ellipsistooltip');
        }
        node.setAttribute('aria-rowspan', (!isNullOrUndefined(cell.rowSpan) ? cell.rowSpan : 1).toString());
        node.setAttribute('aria-colspan', '1');
        return node;
    };
    HeaderCellRenderer.prototype.extendPrepareHeader = function (column, node) {
        if (this.parent.showColumnMenu && column.showColumnMenu) {
            var element = (createElement('div', { className: 'e-icons e-columnmenu' }));
            var matchFilteredColumns = [];
            if (this.parent.filterSettings.columns.length && this.parent.filterSettings.columns.length !== matchFilteredColumns.length) {
                for (var i = 0; i < this.parent.columns.length; i++) {
                    for (var j = 0; j < this.parent.filterSettings.columns.length; j++) {
                        if (this.parent.filterSettings.columns[j].field === column.field) {
                            element.classList.add('e-filtered');
                            matchFilteredColumns.push(column.field);
                            break;
                        }
                    }
                }
            }
            node.classList.add('e-fltr-icon');
            node.appendChild(element);
        }
        if (this.parent.allowResizing) {
            var handler = createElement('div');
            handler.className = column.allowResizing ? 'e-rhandler e-rcursor' : 'e-rsuppress';
            node.appendChild(handler);
        }
        return node;
    };
    HeaderCellRenderer.prototype.appendHtml = function (node, innerHtml) {
        node.appendChild(innerHtml);
        return node;
    };
    return HeaderCellRenderer;
}(CellRenderer));
export { HeaderCellRenderer };
