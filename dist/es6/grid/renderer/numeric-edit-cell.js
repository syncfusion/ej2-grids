import { extend } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { isEditable } from '../base/util';
/**
 * `NumericEditCell` is used to handle numeric cell type editing.
 * @hidden
 */
var NumericEditCell = /** @class */ (function () {
    function NumericEditCell(parent) {
        this.parent = parent;
    }
    NumericEditCell.prototype.create = function (args) {
        return createElement('input', {
            className: 'e-field', attrs: {
                id: this.parent.element.id + args.column.field, name: args.column.field, 'e-mappinguid': args.column.uid
            }
        });
    };
    NumericEditCell.prototype.read = function (element) {
        element.ej2_instances[0].focusOut();
        return element.ej2_instances[0].value;
    };
    NumericEditCell.prototype.write = function (args) {
        var col = args.column;
        var isInline = this.parent.editSettings.mode !== 'dialog';
        this.obj = new NumericTextBox(extend({
            value: parseFloat(args.rowData[col.field]), enableRtl: this.parent.enableRtl,
            placeholder: isInline ? '' : args.column.headerText,
            enabled: isEditable(args.column, args.requestType, args.element),
            floatLabelType: this.parent.editSettings.mode !== 'dialog' ? 'Never' : 'Always',
        }, col.edit.params));
        this.obj.appendTo(args.element);
        args.element.setAttribute('name', col.field);
    };
    NumericEditCell.prototype.destroy = function () {
        if (this.obj && !this.obj.isDestroyed) {
            this.obj.destroy();
        }
    };
    return NumericEditCell;
}());
export { NumericEditCell };
