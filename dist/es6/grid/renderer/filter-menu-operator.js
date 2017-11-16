import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';
var FlMenuOptrUI = (function () {
    function FlMenuOptrUI(parent, customFltrOperators, serviceLocator, filterSettings) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.filterSettings = filterSettings;
        this.customFilterOperators = customFltrOperators;
    }
    FlMenuOptrUI.prototype.renderOperatorUI = function (dlgConetntEle, target, column, dlgObj) {
        this.dialogObj = dlgObj;
        var optr = column.type + 'Operator';
        this.optrData = this.customOptr = (!isNullOrUndefined(this.parent.filterSettings.operators) &&
            !isNullOrUndefined(this.parent.filterSettings.operators[optr])) ?
            this.parent.filterSettings.operators[optr] : this.customFilterOperators[optr];
        var dropDatasource = this.customOptr;
        var selectedValue = this.dropSelectedVal(column, optr);
        var optrDiv = createElement('div', { className: 'e-flm_optrdiv' });
        dlgConetntEle.appendChild(optrDiv);
        var optrInput = createElement('input', { id: column.uid + '-floptr' });
        optrDiv.appendChild(optrInput);
        this.dropOptr = new DropDownList({
            dataSource: dropDatasource,
            fields: { text: 'text', value: 'value' },
            open: this.dropDownOpen.bind(this),
            text: selectedValue
        });
        this.dropOptr.appendTo('#' + column.uid + '-floptr');
    };
    FlMenuOptrUI.prototype.dropDownOpen = function (args) {
        args.popup.element.style.zIndex = (this.dialogObj.zIndex + 1).toString();
    };
    FlMenuOptrUI.prototype.dropSelectedVal = function (col, optr) {
        var selValue = '';
        var columns = this.parent.filterSettings.columns;
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var column = columns_1[_i];
            if (col.field === column.field) {
                var selectedField = new DataManager(this.optrData).executeLocal(new Query().where('value', 'equal', column.operator));
                selValue = !isNullOrUndefined(selectedField[0]) ? selectedField[0].text : '';
            }
        }
        if (selValue === '') {
            selValue = this.optrData[0].text;
        }
        return selValue;
    };
    FlMenuOptrUI.prototype.getFlOperator = function () {
        return this.dropOptr.value;
    };
    return FlMenuOptrUI;
}());
export { FlMenuOptrUI };
