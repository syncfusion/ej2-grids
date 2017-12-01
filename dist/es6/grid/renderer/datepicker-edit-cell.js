import { extend } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { isEditable } from '../base/util';
/**
 * `DatePickerEditCell` is used to handle datepicker cell type editing.
 * @hidden
 */
var DatePickerEditCell = /** @class */ (function () {
    function DatePickerEditCell(parent) {
        this.parent = parent;
    }
    DatePickerEditCell.prototype.create = function (args) {
        return createElement('input', {
            className: 'e-field', attrs: {
                id: this.parent.element.id + args.column.field, name: args.column.field, type: 'text', 'e-mappinguid': args.column.uid
            }
        });
    };
    DatePickerEditCell.prototype.read = function (element) {
        return element.ej2_instances[0].value;
    };
    DatePickerEditCell.prototype.write = function (args) {
        var isInline = this.parent.editSettings.mode !== 'dialog';
        this.obj = new DatePicker(extend({
            floatLabelType: isInline ? 'Never' : 'Always',
            value: new Date(args.rowData[args.column.field]), placeholder: isInline ?
                '' : args.column.headerText, enableRtl: this.parent.enableRtl,
            enabled: isEditable(args.column, args.type, args.element),
        }, args.column.edit.params));
        this.obj.appendTo(args.element);
    };
    DatePickerEditCell.prototype.destroy = function () {
        if (this.obj) {
            this.obj.destroy();
        }
    };
    return DatePickerEditCell;
}());
export { DatePickerEditCell };
