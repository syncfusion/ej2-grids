import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { doesImplementInterface, setStyleAndAttributes, appendChildren } from '../base/util';
import { CheckBox, createCheckBox } from '@syncfusion/ej2-buttons';
/**
 * CellRenderer class which responsible for building cell content.
 * @hidden
 */
var CellRenderer = /** @class */ (function () {
    function CellRenderer(parent, locator) {
        this.element = createElement('TD', { className: 'e-rowcell', attrs: { role: 'gridcell', tabindex: '-1' } });
        this.rowChkBox = createElement('input', { className: 'e-checkselect', attrs: { 'type': 'checkbox' } });
        this.localizer = locator.getService('localization');
        this.formatter = locator.getService('valueFormatter');
        this.parent = parent;
    }
    /**
     * Function to return the wrapper for the TD content
     * @returns string
     */
    CellRenderer.prototype.getGui = function () {
        return '';
    };
    /**
     * Function to format the cell value.
     * @param  {Column} column
     * @param  {Object} value
     * @param  {Object} data
     */
    CellRenderer.prototype.format = function (column, value, data) {
        if (!isNullOrUndefined(column.format)) {
            value = this.formatter.toView(value, column.getFormatter());
        }
        return isNullOrUndefined(value) ? '' : value.toString();
    };
    CellRenderer.prototype.evaluate = function (node, cell, data, attributes) {
        var result;
        if (cell.column.template) {
            var literals = ['index'];
            result = cell.column.getColumnTemplate()(extend({ 'index': attributes[literals[0]] }, data), this.parent, 'template');
            appendChildren(node, result);
            node.setAttribute('aria-label', node.innerText + ' is template cell' + ' column header ' +
                cell.column.headerText);
            return false;
        }
        return true;
    };
    /**
     * Function to invoke the custom formatter available in the column object.
     * @param  {Column} column
     * @param  {Object} value
     * @param  {Object} data
     */
    CellRenderer.prototype.invokeFormatter = function (column, value, data) {
        if (!isNullOrUndefined(column.formatter)) {
            if (doesImplementInterface(column.formatter, 'getValue')) {
                var formatter = column.formatter;
                value = new formatter().getValue(column, data);
            }
            else if (typeof column.formatter === 'function') {
                value = column.formatter(column, data);
            }
            else {
                value = column.formatter.getValue(column, data);
            }
        }
        return value;
    };
    /**
     * Function to render the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data
     * @param  {{[x:string]:Object}} attributes?
     * @param  {Element}
     */
    CellRenderer.prototype.render = function (cell, data, attributes) {
        return this.refreshCell(cell, data, attributes);
    };
    /**
     * Function to refresh the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data
     * @param  {{[x:string]:Object}} attributes?
     * @param  {Element}
     */
    CellRenderer.prototype.refreshTD = function (td, cell, data, attributes) {
        var node = this.refreshCell(cell, data, attributes);
        td.innerHTML = '';
        var elements = [].slice.call(node.childNodes);
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var elem = elements_1[_i];
            td.appendChild(elem);
        }
    };
    CellRenderer.prototype.refreshCell = function (cell, data, attributes) {
        var node = this.element.cloneNode();
        var column = cell.column;
        //Prepare innerHtml
        var innerHtml = this.getGui();
        var value = this.getValue(column.field, data, column);
        if (column.type === 'date' && !isNullOrUndefined(value)) {
            value = new Date(value);
        }
        value = this.format(column, value, data);
        innerHtml = value.toString();
        if (column.type === 'boolean') {
            var isNull = (value !== 'true' && value !== 'false');
            if (column.displayAsCheckBox) {
                node.classList.add('e-checkbox');
                innerHtml = isNull ? null : '<input type="checkbox" disabled ' + '/>';
            }
            else {
                var localeStr = isNull ? null : value === 'true' ? 'True' : 'False';
                innerHtml = localeStr ? this.localizer.getConstant(localeStr) : innerHtml;
            }
        }
        var fromFormatter = this.invokeFormatter(column, value, data);
        innerHtml = !isNullOrUndefined(column.formatter) ? isNullOrUndefined(fromFormatter) ? '' : fromFormatter.toString() : innerHtml;
        node.setAttribute('aria-label', innerHtml + ' column header ' + cell.column.headerText);
        if (this.evaluate(node, cell, data, attributes) && column.type !== 'checkbox') {
            this.appendHtml(node, innerHtml, column.getDomSetter ? column.getDomSetter() : 'innerHTML');
        }
        else if (column.type === 'checkbox') {
            node.classList.add('e-gridchkbox');
            node.setAttribute('aria-label', 'column header ' + cell.column.headerText);
            if (this.parent.selectionSettings.persistSelection) {
                value = value === 'true';
            }
            else {
                value = false;
            }
            var checkWrap = createCheckBox(false, { checked: value, label: ' ' });
            checkWrap.insertBefore(this.rowChkBox.cloneNode(), checkWrap.firstChild);
            node.appendChild(checkWrap);
        }
        this.setAttributes(node, cell, attributes);
        if (column.type === 'boolean') {
            var obj = new CheckBox({ disabled: true, checked: value === 'true' });
            obj.appendTo(node.firstElementChild);
        }
        return node;
    };
    /**
     * Function to specifies how the result content to be placed in the cell.
     * @param  {Element} node
     * @param  {string|Element} innerHtml
     * @returns Element
     */
    CellRenderer.prototype.appendHtml = function (node, innerHtml, property) {
        if (property === void 0) { property = 'innerHTML'; }
        node[property] = innerHtml;
        return node;
    };
    /**
     * @hidden
     */
    CellRenderer.prototype.setAttributes = function (node, cell, attributes) {
        var column = cell.column;
        this.buildAttributeFromCell(node, cell);
        setStyleAndAttributes(node, attributes);
        setStyleAndAttributes(node, cell.attributes);
        if (column.customAttributes) {
            setStyleAndAttributes(node, column.customAttributes);
        }
        if (column.textAlign) {
            node.style.textAlign = column.textAlign;
        }
        if (column.clipMode === 'clip') {
            node.classList.add('e-gridclip');
        }
        else if (column.clipMode === 'ellipsiswithtooltip') {
            node.classList.add('e-ellipsistooltip');
        }
    };
    CellRenderer.prototype.buildAttributeFromCell = function (node, cell) {
        var attr = {};
        var prop = { 'colindex': 'aria-colindex' };
        var classes = [];
        if (cell.colSpan) {
            attr.colSpan = cell.colSpan;
        }
        if (cell.rowSpan) {
            attr.rowSpan = cell.rowSpan;
        }
        if (cell.isTemplate) {
            classes.push('e-templatecell');
        }
        if (cell.isSelected) {
            classes.push.apply(classes, ['e-selectionbackground', 'e-active']);
        }
        if (!isNullOrUndefined(cell.index)) {
            attr[prop.colindex] = cell.index;
        }
        if (!cell.visible) {
            classes.push('e-hide');
        }
        attr.class = classes;
        setStyleAndAttributes(node, attr);
    };
    CellRenderer.prototype.getValue = function (field, data, column) {
        return column.valueAccessor(column.field, data, column);
    };
    return CellRenderer;
}());
export { CellRenderer };
