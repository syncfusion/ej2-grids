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
var HeaderCellRenderer = (function (_super) {
    __extends(HeaderCellRenderer, _super);
    function HeaderCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = createElement('TH', { className: 'e-headercell', attrs: { role: 'columnheader', tabindex: '-1' } });
        _this.ariaService = new AriaService();
        _this.hTxtEle = createElement('span', { className: 'e-headertext' });
        _this.sortEle = createElement('div', { className: 'e-sortfilterdiv e-icons' });
        _this.gui = createElement('div');
        return _this;
    }
    HeaderCellRenderer.prototype.getGui = function () {
        return this.gui.cloneNode();
    };
    HeaderCellRenderer.prototype.render = function (cell, data, attributes) {
        var node = this.element.cloneNode();
        return this.prepareHeader(cell, node);
    };
    HeaderCellRenderer.prototype.refresh = function (cell, node) {
        this.clean(node);
        return this.prepareHeader(cell, node);
    };
    HeaderCellRenderer.prototype.clean = function (node) {
        node.innerHTML = '';
    };
    HeaderCellRenderer.prototype.prepareHeader = function (cell, node) {
        var column = cell.column;
        var ariaAttr = {};
        var innerDIV = this.getGui();
        var value = column.headerText;
        var headerText = this.hTxtEle.cloneNode();
        headerText[column.getDomSetter()] = value;
        innerDIV.appendChild(headerText);
        attributes(innerDIV, {
            'e-mappinguid': column.uid,
            'class': 'e-headercelldiv'
        });
        this.buildAttributeFromCell(node, cell);
        this.appendHtml(node, innerDIV);
        node.appendChild(this.sortEle.cloneNode());
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
        if (this.parent.allowResizing) {
            var handler = createElement('div');
            handler.className = column.allowResizing ? 'e-rhandler e-rcursor' : 'e-rsuppress';
            node.appendChild(handler);
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
    HeaderCellRenderer.prototype.appendHtml = function (node, innerHtml) {
        node.appendChild(innerHtml);
        return node;
    };
    return HeaderCellRenderer;
}(CellRenderer));
export { HeaderCellRenderer };
