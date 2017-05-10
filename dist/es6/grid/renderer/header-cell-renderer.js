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
import { isNullOrUndefined } from '@syncfusion/ej2-base/util';
import { createElement, attributes } from '@syncfusion/ej2-base/dom';
import { setStyleAndAttributes } from '../base/util';
import { CellRenderer } from './cell-renderer';
import { AriaService } from '../services/aria-service';
var HeaderCellRenderer = (function (_super) {
    __extends(HeaderCellRenderer, _super);
    function HeaderCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = createElement('TH', { className: 'e-headercell', attrs: { role: 'columnheader' } });
        _this.ariaService = new AriaService();
        return _this;
    }
    HeaderCellRenderer.prototype.getGui = function () {
        return createElement('div');
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
        var headerText = createElement('span', { className: 'e-headertext' });
        headerText[column.getDomSetter()] = value;
        innerDIV.appendChild(headerText);
        attributes(innerDIV, {
            'e-mappinguid': column.uid,
            'class': 'e-headercelldiv'
        });
        this.buildAttributeFromCell(node, cell);
        this.appendHtml(node, innerDIV);
        node.appendChild(createElement('div', { className: 'e-sortfilterdiv e-icons' }));
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
        this.ariaService.setOptions(node, ariaAttr);
        if (!isNullOrUndefined(column.headerTextAlign) || !isNullOrUndefined(column.textAlign)) {
            var alignment = column.headerTextAlign || column.textAlign;
            innerDIV.style.textAlign = alignment;
            if (alignment === 'right' || alignment === 'left') {
                node.classList.add(alignment === 'right' ? 'e-rightalign' : 'e-leftalign');
            }
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
