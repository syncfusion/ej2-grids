import { getValue } from '@syncfusion/ej2-base';
import { InlineEditRender } from './inline-edit-renderer';
import { BatchEditRender } from './batch-edit-renderer';
import { DialogEditRender } from './dialog-edit-renderer';
import { createElement, attributes, classList } from '@syncfusion/ej2-base';
var EditRender = (function () {
    function EditRender(parent, serviceLocator) {
        this.editType = {
            'inline': InlineEditRender,
            'normal': InlineEditRender, 'batch': BatchEditRender, 'dialog': DialogEditRender
        };
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.renderer = new this.editType[this.parent.editSettings.mode](parent, serviceLocator);
    }
    EditRender.prototype.addNew = function (args) {
        this.renderer.addNew(this.getEditElements(args), args);
        this.convertWidget(args);
    };
    EditRender.prototype.update = function (args) {
        this.renderer.update(this.getEditElements(args), args);
        this.convertWidget(args);
    };
    EditRender.prototype.convertWidget = function (args) {
        var gObj = this.parent;
        var isFocused;
        var cell;
        var value;
        var form = gObj.element.querySelector('.e-gridform');
        var cols = gObj.editSettings.mode !== 'batch' ? gObj.columns : [gObj.getColumnByField(args.columnName)];
        for (var _i = 0, cols_1 = cols; _i < cols_1.length; _i++) {
            var col = cols_1[_i];
            if (!col.visible) {
                continue;
            }
            value = col.valueAccessor(col.field, args.rowData, col);
            cell = form.querySelector('[e-mappinguid=' + col.uid + ']');
            var temp = col.edit.write;
            if (typeof temp === 'string') {
                temp = getValue(temp, window);
            }
            col.edit.write({ rowData: args.rowData, element: cell, column: col, requestType: args.requestType });
            if (!isFocused && !cell.getAttribute('disabled')) {
                this.focusElement(cell);
                isFocused = true;
            }
        }
    };
    EditRender.prototype.focusElement = function (elem) {
        elem.focus();
        if (elem.classList.contains('e-defaultcell')) {
            elem.setSelectionRange(elem.value.length, elem.value.length);
        }
    };
    EditRender.prototype.getEditElements = function (args) {
        var gObj = this.parent;
        var elements = {};
        var cols = gObj.editSettings.mode !== 'batch' ? gObj.columns : [gObj.getColumnByField(args.columnName)];
        for (var _i = 0, cols_2 = cols; _i < cols_2.length; _i++) {
            var col = cols_2[_i];
            if (!col.visible) {
                continue;
            }
            var value = col.valueAccessor(col.field, args.rowData, col);
            var tArgs = { column: col, value: value, type: args.requestType };
            var temp = col.edit.create;
            var input = void 0;
            input = col.edit.create(tArgs);
            if (typeof input === 'string') {
                var div = createElement('div');
                div.innerHTML = input;
                input = div.firstChild;
            }
            var isInput = input.tagName !== 'input' && input.querySelectorAll('input').length;
            attributes(isInput ? input.querySelector('input') : input, {
                name: col.field, 'e-mappinguid': col.uid,
                id: gObj.element.id + col.field,
            });
            classList(input, ['e-input', 'e-field'], []);
            if ((col.isPrimaryKey || col.isIdentity) && args.requestType === 'beginEdit') {
                input.setAttribute('disabled', 'true');
            }
            elements[col.uid] = input;
        }
        return elements;
    };
    return EditRender;
}());
export { EditRender };
