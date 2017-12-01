import { distinctStringValues, getZIndexCalcualtion } from '../base/util';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * `boolfilterui` render boolean column.
 * @hidden
 */
var BooleanFilterUI = /** @class */ (function () {
    function BooleanFilterUI(parent, serviceLocator, filterSettings) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.filterSettings = filterSettings;
    }
    BooleanFilterUI.prototype.create = function (args) {
        var data;
        this.elem = createElement('input', { className: 'e-flmenu-input', id: 'bool-ui-' + args.column.uid });
        args.target.appendChild(this.elem);
        this.dialogObj = args.dialogObj;
        this.dropInstance = new DropDownList({
            dataSource: this.parent.dataSource instanceof DataManager ?
                this.parent.dataSource : new DataManager(this.parent.dataSource),
            query: new Query().select(args.column.field),
            fields: { text: args.column.field, value: args.column.field },
            placeholder: args.localizeText.getConstant('SelectValue'),
            cssClass: 'e-popup-flmenu',
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            open: this.openPopup.bind(this),
            actionComplete: this.ddActionComplete
        });
        this.dropInstance.appendTo(this.elem);
    };
    BooleanFilterUI.prototype.write = function (args) {
        var drpuiObj = document.querySelector('#bool-ui-' + args.column.uid).ej2_instances[0];
        drpuiObj.text = !isNullOrUndefined(args.filteredValue) ? args.filteredValue : '';
    };
    BooleanFilterUI.prototype.read = function (element, column, filterOptr, filterObj) {
        var drpuiObj = document.querySelector('#bool-ui-' + column.uid).ej2_instances[0];
        var filterValue = drpuiObj.value;
        filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', false);
    };
    BooleanFilterUI.prototype.ddActionComplete = function (e) {
        e.result = distinctStringValues(e.result);
    };
    BooleanFilterUI.prototype.openPopup = function (args) {
        getZIndexCalcualtion(args, this.dialogObj);
    };
    return BooleanFilterUI;
}());
export { BooleanFilterUI };
