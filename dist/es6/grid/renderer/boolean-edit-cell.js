import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { extend } from '@syncfusion/ej2-base';
import { isEditable, addRemoveActiveClasses } from '../base/util';
/**
 * `BooleanEditCell` is used to handle boolean cell type editing.
 * @hidden
 */
var BooleanEditCell = /** @class */ (function () {
    function BooleanEditCell(parent) {
        this.activeClasses = ['e-selectionbackground', 'e-active'];
        this.parent = parent;
    }
    BooleanEditCell.prototype.create = function (args) {
        var col = args.column;
        var classNames = 'e-field e-boolcell';
        if (col.type === 'checkbox') {
            classNames = 'e-field e-boolcell e-edit-checkselect';
        }
        return createElement('input', {
            className: classNames, attrs: {
                type: 'checkbox', value: args.value, 'e-mappinguid': col.uid,
                id: this.parent.element.id + col.field, name: col.field
            }
        });
    };
    BooleanEditCell.prototype.read = function (element) {
        return element.checked;
    };
    BooleanEditCell.prototype.write = function (args) {
        var selectChkBox;
        var chkState;
        if (!isNullOrUndefined(args.row)) {
            selectChkBox = args.row.querySelector('.e-edit-checkselect');
        }
        if (args.rowData[args.column.field]) {
            chkState = JSON.parse(args.rowData[args.column.field].toString().toLowerCase());
        }
        if (!isNullOrUndefined(selectChkBox)) {
            this.editType = this.parent.editSettings.mode;
            this.editRow = args.row;
            if (args.requestType !== 'add') {
                var row = this.parent.getRowObjectFromUID(args.row.getAttribute('data-uid'));
                chkState = row ? row.isSelected : false;
            }
            addRemoveActiveClasses.apply(void 0, [[].slice.call(args.row.querySelectorAll('.e-rowcell')), chkState].concat(this.activeClasses));
        }
        this.obj = new CheckBox(extend({
            label: this.parent.editSettings.mode !== 'dialog' ? '' : args.column.headerText,
            checked: chkState,
            disabled: !isEditable(args.column, args.requestType, args.element), enableRtl: this.parent.enableRtl,
            change: this.checkBoxChange.bind(this)
        }, args.column.edit.params));
        this.obj.appendTo(args.element);
    };
    BooleanEditCell.prototype.checkBoxChange = function (args) {
        if (this.editRow && this.editType !== 'dialog') {
            var add = false;
            if (!args.checked) {
                this.editRow.removeAttribute('aria-selected');
            }
            else {
                add = true;
                this.editRow.setAttribute('aria-selected', add.toString());
            }
            addRemoveActiveClasses.apply(void 0, [[].slice.call(this.editRow.querySelectorAll('.e-rowcell')), add].concat(this.activeClasses));
        }
    };
    BooleanEditCell.prototype.destroy = function () {
        if (this.obj) {
            this.obj.destroy();
        }
    };
    return BooleanEditCell;
}());
export { BooleanEditCell };
