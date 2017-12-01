import { AutoComplete } from '@syncfusion/ej2-dropdowns';
import { DataManager } from '@syncfusion/ej2-data';
import { createElement } from '@syncfusion/ej2-base';
import { getZIndexCalcualtion } from '../base/util';
/**
 * `string filterui` render string column.
 * @hidden
 */
var StringFilterUI = /** @class */ (function () {
    function StringFilterUI(parent, serviceLocator, filterSettings) {
        this.parent = parent;
        this.serLocator = serviceLocator;
        this.filterSettings = filterSettings;
    }
    StringFilterUI.prototype.create = function (args) {
        var _this = this;
        var data;
        var floptr;
        this.instance = createElement('input', { className: 'e-flmenu-input', id: 'strui-' + args.column.uid });
        args.target.appendChild(this.instance);
        this.dialogObj = args.dialogObj;
        this.actObj = new AutoComplete({
            dataSource: this.parent.dataSource instanceof DataManager ?
                this.parent.dataSource : new DataManager(this.parent.dataSource),
            fields: { value: args.column.field },
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            sortOrder: 'Ascending',
            open: this.openPopup.bind(this),
            cssClass: 'e-popup-flmenu',
            focus: function () {
                _this.actObj.filterType = args.getOptrInstance.getFlOperator();
            },
            autofill: true,
            placeholder: args.localizeText.getConstant('EnterValue'),
            actionComplete: function (e) {
                e.result = e.result.filter(function (obj, index, arr) {
                    return arr.map(function (mapObj) {
                        return mapObj[_this.actObj.fields.value];
                    }).indexOf(obj[_this.actObj.fields.value]) === index;
                });
            }
        });
        this.actObj.appendTo(this.instance);
    };
    StringFilterUI.prototype.write = function (args) {
        var columns = this.filterSettings.columns;
        if (args.filteredValue !== '') {
            var struiObj = document.querySelector('#strui-' + args.column.uid).ej2_instances[0];
            struiObj.value = args.filteredValue;
        }
    };
    StringFilterUI.prototype.read = function (element, column, filterOptr, filterObj) {
        var actuiObj = document.querySelector('#strui-' + column.uid).ej2_instances[0];
        var filterValue = actuiObj.value;
        filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', false);
    };
    StringFilterUI.prototype.openPopup = function (args) {
        getZIndexCalcualtion(args, this.dialogObj);
    };
    return StringFilterUI;
}());
export { StringFilterUI };
