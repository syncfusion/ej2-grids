import { createElement } from '@syncfusion/ej2-base';
import { isEditable } from '../base/util';
var BooleanEditCell = (function () {
    function BooleanEditCell(parent) {
        this.parent = parent;
    }
    BooleanEditCell.prototype.create = function (args) {
        var col = args.column;
        var input = createElement('input', {
            className: 'e-field e-boolcell', attrs: {
                type: 'checkbox', value: args.value, 'e-mappinguid': col.uid,
                id: this.parent.element.id + col.field, name: col.field
            }
        });
        if (!isEditable(args.column, args.requestType, args.element)) {
            input.setAttribute('disabled', 'true');
        }
        if (args.value) {
            input.checked = true;
        }
        return input;
    };
    BooleanEditCell.prototype.read = function (element) {
        return element.checked;
    };
    BooleanEditCell.prototype.write = function (args) {
        args.element.style.width = 'auto';
    };
    BooleanEditCell.prototype.destroy = function () {
    };
    return BooleanEditCell;
}());
export { BooleanEditCell };
