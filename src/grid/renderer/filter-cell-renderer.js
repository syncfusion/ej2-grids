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
define(["require", "exports", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/dom", "./cell-renderer"], function (require, exports, util_1, dom_1, cell_renderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FilterCellRenderer = (function (_super) {
        __extends(FilterCellRenderer, _super);
        function FilterCellRenderer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.element = dom_1.createElement('TH', { className: 'e-filterbarcell' });
            return _this;
        }
        FilterCellRenderer.prototype.getGui = function () {
            return dom_1.createElement('div');
        };
        FilterCellRenderer.prototype.render = function (cell, data) {
            var node = this.element.cloneNode();
            var innerDIV = this.getGui();
            var input;
            var column = cell.column;
            if ((util_1.isNullOrUndefined(column.allowFiltering) || column.allowFiltering) && !util_1.isNullOrUndefined(column.filterBarTemplate)) {
                node.classList.add('e-fltrtemp');
                dom_1.attributes(innerDIV, {
                    'class': 'e-fltrtempdiv'
                });
                if (util_1.isNullOrUndefined(column.filterBarTemplate.create)) {
                    input = dom_1.createElement('input', {
                        id: column.field + '_filterBarcell', className: 'e-filterUi_input e-filtertext e-fltrTemp',
                        attrs: { type: 'search', title: column.headerText }
                    });
                    innerDIV.appendChild(input);
                }
                else {
                    var args = { column: column };
                    var temp = column.filterBarTemplate.create;
                    if (typeof temp === 'string') {
                        temp = util_1.getValue(temp, window);
                    }
                    input = temp(args);
                    dom_1.attributes(innerDIV, {
                        class: 'e-filterUi_input e-filtertext e-fltrTemp',
                        title: column.headerText,
                        id: column.field + '_filterBarcell',
                    });
                    innerDIV.appendChild(input);
                }
            }
            else {
                dom_1.attributes(innerDIV, {
                    'class': 'e-filterdiv e-fltrinputdiv'
                });
                input = dom_1.createElement('input', {
                    id: column.field + '_filterBarcell', className: 'e-filtertext',
                    attrs: {
                        type: 'search', title: column.headerText + cell.attributes.title,
                        value: data[cell.column.field] ? data[cell.column.field] : ''
                    }
                });
                innerDIV.appendChild(input);
                innerDIV.appendChild(dom_1.createElement('span', { className: 'e-cancel e-hide e-icons e-icon-hide', }));
            }
            if (column.allowFiltering === false || column.field === '' || util_1.isNullOrUndefined(column.field)) {
                input.setAttribute('disabled', 'true');
                input.classList.add('e-disable');
            }
            if (!column.visible) {
                node.classList.add('e-hide');
            }
            if ((util_1.isNullOrUndefined(column.allowFiltering) || column.allowFiltering) && !util_1.isNullOrUndefined(column.filterBarTemplate)) {
                var templateRead = column.filterBarTemplate.read;
                var templateWrite = column.filterBarTemplate.write;
                var args = { element: input, column: column };
                if (typeof templateRead === 'string') {
                    templateRead = args.column = util_1.getValue(templateRead, window);
                }
                if (typeof templateWrite === 'string') {
                    templateWrite = util_1.getValue(templateWrite, window);
                }
                templateWrite.call(this, args);
            }
            this.appendHtml(node, innerDIV);
            return node;
        };
        FilterCellRenderer.prototype.appendHtml = function (node, innerHtml) {
            node.appendChild(innerHtml);
            return node;
        };
        return FilterCellRenderer;
    }(cell_renderer_1.CellRenderer));
    exports.FilterCellRenderer = FilterCellRenderer;
});
