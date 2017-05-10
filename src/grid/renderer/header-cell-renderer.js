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
define(["require", "exports", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/dom", "../base/util", "./cell-renderer", "../services/aria-service"], function (require, exports, util_1, dom_1, util_2, cell_renderer_1, aria_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeaderCellRenderer = (function (_super) {
        __extends(HeaderCellRenderer, _super);
        function HeaderCellRenderer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.element = dom_1.createElement('TH', { className: 'e-headercell', attrs: { role: 'columnheader' } });
            _this.ariaService = new aria_service_1.AriaService();
            return _this;
        }
        HeaderCellRenderer.prototype.getGui = function () {
            return dom_1.createElement('div');
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
            var headerText = dom_1.createElement('span', { className: 'e-headertext' });
            headerText[column.getDomSetter()] = value;
            innerDIV.appendChild(headerText);
            dom_1.attributes(innerDIV, {
                'e-mappinguid': column.uid,
                'class': 'e-headercelldiv'
            });
            this.buildAttributeFromCell(node, cell);
            this.appendHtml(node, innerDIV);
            node.appendChild(dom_1.createElement('div', { className: 'e-sortfilterdiv e-icons' }));
            if (cell.className) {
                node.classList.add(cell.className);
            }
            if (column.customAttributes) {
                util_2.setStyleAndAttributes(node, column.customAttributes);
            }
            if (column.allowSorting) {
                ariaAttr.sort = 'none';
            }
            if (column.allowGrouping) {
                ariaAttr.grabbed = false;
            }
            this.ariaService.setOptions(node, ariaAttr);
            if (!util_1.isNullOrUndefined(column.headerTextAlign) || !util_1.isNullOrUndefined(column.textAlign)) {
                var alignment = column.headerTextAlign || column.textAlign;
                innerDIV.style.textAlign = alignment;
                if (alignment === 'right' || alignment === 'left') {
                    node.classList.add(alignment === 'right' ? 'e-rightalign' : 'e-leftalign');
                }
            }
            node.setAttribute('aria-rowspan', (!util_1.isNullOrUndefined(cell.rowSpan) ? cell.rowSpan : 1).toString());
            node.setAttribute('aria-colspan', '1');
            return node;
        };
        HeaderCellRenderer.prototype.appendHtml = function (node, innerHtml) {
            node.appendChild(innerHtml);
            return node;
        };
        return HeaderCellRenderer;
    }(cell_renderer_1.CellRenderer));
    exports.HeaderCellRenderer = HeaderCellRenderer;
});
