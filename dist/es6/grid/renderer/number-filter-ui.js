import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { createElement } from '@syncfusion/ej2-base';
/**
 * `numberfilterui` render number column.
 * @hidden
 */
var NumberFilterUI = /** @class */ (function () {
    function NumberFilterUI(parent, serviceLocator, filterSettings) {
        this.filterSettings = filterSettings;
        this.parent = parent;
        this.serviceLocator = serviceLocator;
    }
    NumberFilterUI.prototype.create = function (args) {
        this.instance = createElement('input', { className: 'e-flmenu-input', id: 'numberui-' + args.column.uid });
        args.target.appendChild(this.instance);
        this.numericTxtObj = new NumericTextBox({
            format: args.column.format,
            locale: this.parent.locale,
            cssClass: 'e-popup-flmenu',
            placeholder: args.localizeText.getConstant('EnterValue'),
            enableRtl: this.parent.enableRtl,
        });
        this.numericTxtObj.appendTo(this.instance);
    };
    NumberFilterUI.prototype.write = function (args) {
        var numberuiObj = document.querySelector('#numberui-' + args.column.uid).ej2_instances[0];
        numberuiObj.value = args.filteredValue;
    };
    NumberFilterUI.prototype.read = function (element, column, filterOptr, filterObj) {
        var numberuiObj = document.querySelector('#numberui-' + column.uid).ej2_instances[0];
        var filterValue = numberuiObj.value;
        filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', true);
    };
    return NumberFilterUI;
}());
export { NumberFilterUI };
