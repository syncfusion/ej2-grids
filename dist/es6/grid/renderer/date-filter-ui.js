import { DatePicker } from '@syncfusion/ej2-calendars';
import { createElement } from '@syncfusion/ej2-base';
import { Internationalization } from '@syncfusion/ej2-base';
/**
 * `datefilterui` render date column.
 * @hidden
 */
var DateFilterUI = /** @class */ (function () {
    function DateFilterUI(parent, serviceLocator, filterSettings) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.fltrSettings = filterSettings;
    }
    DateFilterUI.prototype.create = function (args) {
        var intl = new Internationalization();
        var colFormat = args.column.format;
        var format = intl.getDatePattern({ type: 'date', skeleton: colFormat }, false);
        this.dialogObj = args.dialogObj;
        this.inputElem = createElement('input', { className: 'e-flmenu-input', id: 'dateui-' + args.column.uid });
        args.target.appendChild(this.inputElem);
        this.datePickerObj = new DatePicker({
            format: format,
            cssClass: 'e-popup-flmenu',
            placeholder: args.localizeText.getConstant('ChooseDate'),
            width: '100%',
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            open: this.openPopup.bind(this),
        });
        this.datePickerObj.appendTo(this.inputElem);
    };
    DateFilterUI.prototype.write = function (args) {
        var columns = this.fltrSettings.columns;
        var dateuiObj = document.querySelector('#dateui-' + args.column.uid).ej2_instances[0];
        dateuiObj.value = args.filteredValue;
    };
    DateFilterUI.prototype.read = function (element, column, filterOptr, filterObj) {
        var dateuiObj = document.querySelector('#dateui-' + column.uid).ej2_instances[0];
        var filterValue = dateuiObj.value;
        filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', true);
    };
    DateFilterUI.prototype.openPopup = function (args) {
        args.popupElement.element.style.zIndex = (this.dialogObj.zIndex + 1).toString();
    };
    return DateFilterUI;
}());
export { DateFilterUI };
