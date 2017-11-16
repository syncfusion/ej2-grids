import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { isEditable } from '../base/util';
import { parentsUntil } from '../base/util';
var DropDownEditCell = (function () {
    function DropDownEditCell(parent) {
        this.parent = parent;
    }
    DropDownEditCell.prototype.create = function (args) {
        return createElement('input', {
            className: 'e-field', attrs: {
                id: this.parent.element.id + args.column.field, name: args.column.field, type: 'text', 'e-mappinguid': args.column.uid,
            }
        });
    };
    DropDownEditCell.prototype.write = function (args) {
        var col = args.column;
        var isInline = this.parent.editSettings.mode !== 'dialog';
        this.obj = new DropDownList(extend({
            dataSource: this.parent.dataSource instanceof DataManager ?
                this.parent.dataSource : new DataManager(this.parent.dataSource),
            query: new Query().select(args.column.field), enabled: isEditable(args.column, args.requestType, args.element),
            fields: { value: args.column.field }, value: args.rowData[args.column.field],
            enableRtl: this.parent.enableRtl, actionComplete: this.ddActionComplete,
            placeholder: isInline ? '' : args.column.headerText, popupHeight: '200px',
            floatLabelType: isInline ? 'Never' : 'Always', open: this.dropDownOpen.bind(this),
        }, args.column.edit.params));
        this.obj.appendTo(args.element);
        args.element.setAttribute('name', args.column.field);
    };
    DropDownEditCell.prototype.read = function (element) {
        return element.ej2_instances[0].value;
    };
    DropDownEditCell.prototype.ddActionComplete = function (e) {
        e.result = e.result.filter(function (val, i, values) { return values.indexOf(val) === i; });
        e.result.sort();
    };
    DropDownEditCell.prototype.dropDownOpen = function (args) {
        var dlgElement = parentsUntil(this.obj.element, 'e-dialog');
        if (!isNullOrUndefined(dlgElement)) {
            var dlgObj = this.parent.element.querySelector('#' + dlgElement.id).ej2_instances[0];
            args.popup.element.style.zIndex = (dlgObj.zIndex + 1).toString();
        }
    };
    DropDownEditCell.prototype.destroy = function () {
        if (this.obj) {
            this.obj.destroy();
        }
    };
    return DropDownEditCell;
}());
export { DropDownEditCell };
