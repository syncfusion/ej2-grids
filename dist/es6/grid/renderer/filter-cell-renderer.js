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
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { createElement, attributes } from '@syncfusion/ej2-base';
import { CellRenderer } from './cell-renderer';
/**
 * FilterCellRenderer class which responsible for building filter cell.
 * @hidden
 */
var FilterCellRenderer = /** @class */ (function (_super) {
    __extends(FilterCellRenderer, _super);
    function FilterCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = createElement('TH', { className: 'e-filterbarcell' });
        return _this;
    }
    /**
     * Function to return the wrapper for the TH content.
     * @returns string
     */
    FilterCellRenderer.prototype.getGui = function () {
        return createElement('div');
    };
    /**
     * Function to render the cell content based on Column object.
     * @param  {Cell} cell
     * @param  {Object} data
     */
    FilterCellRenderer.prototype.render = function (cell, data) {
        var node = this.element.cloneNode();
        var innerDIV = this.getGui();
        var input;
        var column = cell.column;
        if (column.type !== 'checkbox') {
            if ((isNullOrUndefined(column.allowFiltering) || column.allowFiltering) && !isNullOrUndefined(column.filterBarTemplate)) {
                node.classList.add('e-fltrtemp');
                attributes(innerDIV, {
                    'class': 'e-fltrtempdiv'
                });
                if (isNullOrUndefined(column.filterBarTemplate.create)) {
                    input = createElement('input', {
                        id: column.field + '_filterBarcell', className: 'e-filterUi_input e-filtertext e-fltrTemp',
                        attrs: { type: 'search', title: column.headerText }
                    });
                    innerDIV.appendChild(input);
                }
                else {
                    var args = { column: column };
                    var temp = column.filterBarTemplate.create;
                    if (typeof temp === 'string') {
                        temp = getValue(temp, window);
                    }
                    input = temp(args);
                    if (typeof input === 'string') {
                        var div = createElement('div');
                        div.innerHTML = input;
                        input = div.firstChild;
                    }
                    attributes(innerDIV, {
                        class: 'e-filterUi_input e-filtertext e-fltrTemp',
                        title: column.headerText,
                        id: column.field + '_filterBarcell',
                    });
                    innerDIV.appendChild(input);
                }
            }
            else {
                attributes(innerDIV, {
                    'class': 'e-filterdiv e-fltrinputdiv'
                });
                input = createElement('input', {
                    id: column.field + '_filterBarcell', className: 'e-filtertext',
                    attrs: {
                        type: 'search', title: column.headerText + cell.attributes.title,
                        value: data[cell.column.field] ? data[cell.column.field] : '', role: 'search'
                    }
                });
                innerDIV.appendChild(input);
                innerDIV.appendChild(createElement('span', {
                    className: 'e-cancel e-hide e-icons e-icon-hide',
                    attrs: { 'aria-label': 'clear filter cell', tabindex: '-1' }
                }));
            }
            //TODO: apply intial filtering
            if (column.allowFiltering === false || column.field === '' || isNullOrUndefined(column.field)) {
                input.setAttribute('disabled', 'true');
                input.classList.add('e-disable');
            }
            if (!column.visible) {
                node.classList.add('e-hide');
            }
            if ((isNullOrUndefined(column.allowFiltering) || column.allowFiltering) && !isNullOrUndefined(column.filterBarTemplate)) {
                var templateRead = column.filterBarTemplate.read;
                var templateWrite = column.filterBarTemplate.write;
                var args = { element: input, column: column };
                if (typeof templateRead === 'string') {
                    templateRead = args.column = getValue(templateRead, window);
                }
                if (typeof templateWrite === 'string') {
                    templateWrite = getValue(templateWrite, window);
                }
                templateWrite.call(this, args);
            }
            this.appendHtml(node, innerDIV);
        }
        return node;
    };
    /**
     * Function to specifies how the result content to be placed in the cell.
     * @param  {Element} node
     * @param  {string|Element} innerHTML
     * @returns Element
     */
    FilterCellRenderer.prototype.appendHtml = function (node, innerHtml) {
        node.appendChild(innerHtml);
        return node;
    };
    return FilterCellRenderer;
}(CellRenderer));
export { FilterCellRenderer };