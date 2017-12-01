import { EventHandler } from '@syncfusion/ej2-base';
import { extend, getValue } from '@syncfusion/ej2-base';
import { remove, createElement } from '@syncfusion/ej2-base';
import { isNullOrUndefined, setValue } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { EditRender } from '../renderer/edit-renderer';
import { BooleanEditCell } from '../renderer/boolean-edit-cell';
import { DropDownEditCell } from '../renderer/dropdown-edit-cell';
import { NumericEditCell } from '../renderer/numeric-edit-cell';
import { DefaultEditCell } from '../renderer/default-edit-cell';
import { InlineEdit } from './inline-edit';
import { BatchEdit } from './batch-edit';
import { DialogEdit } from './dialog-edit';
import { Dialog } from '@syncfusion/ej2-popups';
import { parentsUntil, changeButtonType } from '../base/util';
import { FormValidator } from '@syncfusion/ej2-inputs';
import { DatePickerEditCell } from '../renderer/datepicker-edit-cell';
/**
 * `Edit` module is used to handle editing actions.
 */
var Edit = /** @class */ (function () {
    /**
     * Constructor for the Grid editing module
     * @hidden
     */
    function Edit(parent, serviceLocator) {
        this.editCellType = {
            'dropdownedit': DropDownEditCell, 'numericedit': NumericEditCell,
            'datepickeredit': DatePickerEditCell, 'booleanedit': BooleanEditCell, 'defaultedit': DefaultEditCell
        };
        this.editType = { 'inline': InlineEdit, 'normal': InlineEdit, 'batch': BatchEdit, 'dialog': DialogEdit };
        this.tapped = false;
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.l10n = this.serviceLocator.getService('localization');
        this.addEventListener();
        this.updateEditObj();
        this.createAlertDlg();
        this.createConfirmDlg();
    }
    Edit.prototype.updateColTypeObj = function () {
        for (var _i = 0, _a = this.parent.getColumns(); _i < _a.length; _i++) {
            var col = _a[_i];
            col.edit = extend(new this.editCellType[col.editType && this.editCellType[col.editType] ?
                col.editType : 'defaultedit'](this.parent, this.serviceLocator), col.edit || {});
        }
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Edit.prototype.getModuleName = function () {
        return 'edit';
    };
    /**
     * @hidden
     */
    Edit.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName()) {
            return;
        }
        var gObj = this.parent;
        var newProp = e.properties;
        for (var _i = 0, _a = Object.keys(e.properties); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'allowAdding':
                case 'allowDeleting':
                case 'allowEditing':
                    if (gObj.editSettings.allowAdding || gObj.editSettings.allowEditing || gObj.editSettings.allowDeleting) {
                        this.initialEnd();
                    }
                    break;
                case 'mode':
                    this.updateEditObj();
                    gObj.isEdit = false;
                    gObj.refresh();
                    break;
            }
        }
    };
    Edit.prototype.updateEditObj = function () {
        if (this.editModule) {
            this.editModule.destroy();
        }
        this.renderer = new EditRender(this.parent, this.serviceLocator);
        this.editModule = new this.editType[this.parent.editSettings.mode](this.parent, this.serviceLocator, this.renderer);
    };
    Edit.prototype.initialEnd = function () {
        this.updateColTypeObj();
    };
    Edit.prototype.wireEvents = function () {
        EventHandler.add(this.parent.getContent(), 'touchstart', this.tapEvent, this);
    };
    Edit.prototype.unwireEvents = function () {
        EventHandler.remove(this.parent.getContent(), 'touchstart', this.tapEvent);
    };
    Edit.prototype.tapEvent = function (e) {
        if (this.getUserAgent()) {
            if (!this.tapped) {
                this.tapped = setTimeout(this.timeoutHandler(), 300);
            }
            else {
                clearTimeout(this.tapped);
                this.parent.notify(events.doubleTap, e);
                this.tapped = null;
            }
        }
    };
    Edit.prototype.getUserAgent = function () {
        var userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipod|ipad/.test(userAgent);
    };
    Edit.prototype.timeoutHandler = function () {
        this.tapped = null;
    };
    /**
     * To edit any particular row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row to be edited.
     */
    Edit.prototype.startEdit = function (tr) {
        var gObj = this.parent;
        if (!gObj.editSettings.allowEditing || gObj.isEdit || gObj.editSettings.mode === 'batch') {
            return;
        }
        if (!gObj.getSelectedRows().length) {
            if (!tr) {
                this.showDialog('EditOperationAlert', this.alertDObj);
                return;
            }
        }
        else if (!tr) {
            tr = gObj.getSelectedRows()[0];
        }
        if (tr.style.display === 'none') {
            return;
        }
        this.editModule.startEdit(tr);
        this.refreshToolbar();
        gObj.element.querySelector('.e-gridpopup').style.display = 'none';
        this.parent.notify('start-edit', {});
    };
    /**
     * Cancel edited state.
     */
    Edit.prototype.closeEdit = function () {
        if (this.parent.editSettings.mode === 'batch' && this.parent.editSettings.showConfirmDialog
            && this.parent.element.querySelectorAll('.e-updatedtd').length) {
            this.showDialog('CancelEdit', this.dialogObj);
            return;
        }
        this.editModule.closeEdit();
        this.refreshToolbar();
        this.parent.notify('close-edit', {});
    };
    Edit.prototype.refreshToolbar = function () {
        this.parent.notify(events.toolbarRefresh, {});
    };
    /**
     * To add a new row at top of rows with given data. If data is not passed then it will render empty row.
     * > `editSettings.allowEditing` should be true.
     * @param {Object} data - Defines the new add record data.
     */
    Edit.prototype.addRecord = function (data) {
        if (!this.parent.editSettings.allowAdding) {
            return;
        }
        this.editModule.addRecord(data);
        this.refreshToolbar();
        this.parent.notify('start-add', {});
    };
    /**
     * Delete a record with Given options. If fieldname and data is not given then grid will delete the selected record.
     * > `editSettings.allowDeleting` should be true.
     * @param {string} fieldname - Defines the primary key field Name of the column.
     * @param {Object} data - Defines the JSON data of record need to be delete.
     */
    Edit.prototype.deleteRecord = function (fieldname, data) {
        var gObj = this.parent;
        if (!gObj.editSettings.allowDeleting) {
            return;
        }
        if (!data) {
            if (isNullOrUndefined(gObj.selectedRowIndex) || gObj.selectedRowIndex === -1) {
                this.showDialog('DeleteOperationAlert', this.alertDObj);
                return;
            }
            if (gObj.editSettings.showDeleteConfirmDialog) {
                this.showDialog('ConfirmDelete', this.dialogObj);
                return;
            }
        }
        this.editModule.deleteRecord(fieldname, data);
    };
    /**
     * Delete any visible row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row element.
     */
    Edit.prototype.deleteRow = function (tr) {
        this.deleteRecord(null, this.parent.getCurrentViewRecords()[parseInt(tr.getAttribute('aria-rowindex'), 10)]);
    };
    /**
     * If Grid is in editable state, then you can save a record by invoking endEdit.
     */
    Edit.prototype.endEdit = function () {
        if (this.parent.editSettings.mode === 'batch' && this.parent.editSettings.showConfirmDialog) {
            this.showDialog('BatchSaveConfirm', this.dialogObj);
            return;
        }
        this.endEditing();
    };
    /**
     * To update value of any cell without change into edit mode.
     * @param {number} rowIndex - Defines the row index.
     * @param {string} field - Defines the column field.
     * @param {string | number | boolean | Date} value - Defines the value to change.
     */
    Edit.prototype.updateCell = function (rowIndex, field, value) {
        this.editModule.updateCell(rowIndex, field, value);
    };
    /**
     * To update values of a row without changing into edit mode.
     * @param {number} index - Defines the row index.
     * @param {Object} data - Defines the data object to update.
     */
    Edit.prototype.updateRow = function (index, data) {
        this.editModule.updateRow(index, data);
    };
    /**
     * To reset added, edited and deleted records in batch mode.
     */
    Edit.prototype.batchCancel = function () {
        this.closeEdit();
    };
    /**
     * To bulk Save added, edited and deleted records in batch mode.
     */
    Edit.prototype.batchSave = function () {
        this.endEdit();
    };
    /**
     * To turn any particular cell into edited state by row index and field name in batch mode.
     * @param {number} index - Defines row index to edit particular cell.
     * @param {string} field - Defines the field name of the column to perform batch edit.
     */
    Edit.prototype.editCell = function (index, field) {
        this.editModule.editCell(index, field);
    };
    /**
     * To check current status of validation at the time of edited state. If validation passed then it will return true.
     * @return {boolean}
     */
    Edit.prototype.editFormValidate = function () {
        if (this.formObj) {
            return this.formObj.validate();
        }
        return false;
    };
    /**
     * To get added, edited and deleted data before bulk save to data source in batch mode.
     * @return {Object}
     */
    Edit.prototype.getBatchChanges = function () {
        return this.editModule.getBatchChanges ? this.editModule.getBatchChanges() : {};
    };
    /**
     * To get current value of edited component.
     */
    Edit.prototype.getCurrentEditCellData = function () {
        var obj = this.getCurrentEditedData(this.formObj.element, {});
        return obj[Object.keys(obj)[0]];
    };
    /**
     * To save current edited cell in batch. It does not save value to data source.
     */
    Edit.prototype.saveCell = function () {
        this.editModule.saveCell();
    };
    Edit.prototype.endEditing = function () {
        this.editModule.endEdit();
        this.refreshToolbar();
    };
    Edit.prototype.showDialog = function (content, obj) {
        obj.content = '<div>' + this.l10n.getConstant(content) + '</div>';
        obj.dataBind();
        obj.show();
    };
    Edit.prototype.getValueFromType = function (col, value) {
        var val = value;
        switch (col.type) {
            case 'number':
                val = !isNaN(parseFloat(value)) ? parseFloat(value) : null;
                break;
            case 'boolean':
                if (col.editType !== 'booleanedit') {
                    val = value === this.l10n.getConstant('True') ? true : false;
                }
                break;
            case 'date':
                if (col.editType !== 'datepicker') {
                    val = new Date(value);
                }
                break;
        }
        return val;
    };
    Edit.prototype.destroyToolTip = function () {
        var elements = [].slice.call(this.parent.getContentTable().querySelectorAll('.e-griderror'));
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var elem = elements_1[_i];
            remove(elem);
        }
    };
    Edit.prototype.createConfirmDlg = function () {
        this.dialogObj = this.dlgWidget([
            {
                click: this.dlgOk.bind(this),
                buttonModel: { content: this.l10n.getConstant('OKButton'), cssClass: 'e-primary', isPrimary: true }
            },
            {
                click: this.dlgCancel.bind(this),
                buttonModel: { cssClass: 'e-flat', content: this.l10n.getConstant('CancelButton') }
            }
        ], 'EditConfirm');
    };
    Edit.prototype.createAlertDlg = function () {
        this.alertDObj = this.dlgWidget([
            {
                click: this.alertClick.bind(this), buttonModel: { content: this.l10n.getConstant('OKButton'), cssClass: 'e-flat', isPrimary: true }
            }
        ], 'EditAlert');
    };
    Edit.prototype.alertClick = function () {
        this.alertDObj.hide();
    };
    Edit.prototype.dlgWidget = function (btnOptions, name) {
        var div = createElement('div', { id: this.parent.element.id + name });
        this.parent.element.appendChild(div);
        var options = {
            showCloseIcon: false,
            isModal: true,
            visible: false,
            closeOnEscape: true,
            target: this.parent.element,
            width: '320px',
            animationSettings: { effect: 'None' }
        };
        options.buttons = btnOptions;
        var obj = new Dialog(options);
        obj.appendTo(div);
        changeButtonType(obj.element);
        return obj;
    };
    Edit.prototype.dlgCancel = function () {
        this.dialogObj.hide();
    };
    Edit.prototype.dlgOk = function (e) {
        switch (this.dialogObj.element.querySelector('.e-dlg-content').firstElementChild.innerText) {
            case this.l10n.getConstant('ConfirmDelete'):
                this.editModule.deleteRecord();
                break;
            case this.l10n.getConstant('CancelEdit'):
                this.editModule.closeEdit();
                break;
            case this.l10n.getConstant('BatchSaveConfirm'):
                this.endEditing();
                break;
            case this.l10n.getConstant('BatchSaveLostChanges'):
                this.executeAction();
                break;
        }
        this.dlgCancel();
    };
    /**
     * @hidden
     */
    Edit.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(events.initialEnd, this.initialEnd, this);
        this.parent.on(events.keyPressed, this.keyPressHandler, this);
        this.parent.on(events.autoCol, this.updateColTypeObj, this);
        this.parent.on(events.tooltipDestroy, this.destroyToolTip, this);
        this.parent.on(events.preventBatch, this.preventBatch, this);
        this.parent.on(events.destroyForm, this.destroyForm, this);
        this.actionBeginFunction = this.onActionBegin.bind(this);
        this.actionCompleteFunction = this.actionComplete.bind(this);
        this.parent.addEventListener(events.actionBegin, this.actionBeginFunction);
        this.parent.addEventListener(events.actionComplete, this.actionCompleteFunction);
        this.parent.on(events.initialEnd, this.wireEvents, this);
    };
    /**
     * @hidden
     */
    Edit.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(events.initialEnd, this.initialEnd);
        this.parent.off(events.keyPressed, this.keyPressHandler);
        this.parent.off(events.autoCol, this.updateColTypeObj);
        this.parent.off(events.tooltipDestroy, this.destroyToolTip);
        this.parent.off(events.preventBatch, this.preventBatch);
        this.parent.off(events.destroyForm, this.destroyForm);
        this.parent.removeEventListener(events.actionComplete, this.actionCompleteFunction);
        this.parent.removeEventListener(events.actionBegin, this.actionBeginFunction);
        this.parent.off(events.initialEnd, this.unwireEvents);
    };
    Edit.prototype.actionComplete = function (e) {
        var actions = ['add', 'beginEdit', 'save', 'delete', 'cancel'];
        if (actions.indexOf(e.requestType) < 0) {
            this.parent.isEdit = false;
        }
        this.refreshToolbar();
    };
    /**
     * @hidden
     */
    Edit.prototype.getCurrentEditedData = function (form, editedData) {
        var gObj = this.parent;
        var inputs = [].slice.call(form.querySelectorAll('.e-field'));
        for (var i = 0, len = inputs.length; i < len; i++) {
            var col = gObj.getColumnByUid(inputs[i].getAttribute('e-mappinguid'));
            var value = void 0;
            if (col && col.field) {
                var temp = col.edit.read;
                if (typeof temp === 'string') {
                    temp = getValue(temp, window);
                }
                if (col.type !== 'checkbox') {
                    value = gObj.editModule.getValueFromType(col, col.edit.read(inputs[i]));
                }
                else {
                    value = inputs[i].checked;
                }
                setValue(col.field, value, editedData);
            }
        }
        return editedData;
    };
    /**
     * @hidden
     */
    Edit.prototype.onActionBegin = function (e) {
        if (this.parent.editSettings.mode !== 'batch' && e.requestType !== 'save' && this.formObj && !this.formObj.isDestroyed) {
            this.destroyForm();
            this.destroyWidgets();
        }
    };
    /**
     * @hidden
     */
    Edit.prototype.destroyWidgets = function (cols) {
        cols = cols ? cols : this.parent.getColumns();
        for (var _i = 0, cols_1 = cols; _i < cols_1.length; _i++) {
            var col = cols_1[_i];
            if (col.edit.destroy) {
                col.edit.destroy();
            }
        }
    };
    /**
     * @hidden
     */
    Edit.prototype.destroyForm = function () {
        this.destroyToolTip();
        if (this.formObj && !this.formObj.isDestroyed) {
            this.formObj.destroy();
        }
        this.destroyToolTip();
    };
    /**
     * To destroy the editing.
     * @return {void}
     * @hidden
     */
    Edit.prototype.destroy = function () {
        this.destroyForm();
        this.removeEventListener();
        var elem = this.dialogObj.element;
        this.dialogObj.destroy();
        remove(elem);
        elem = this.alertDObj.element;
        this.alertDObj.destroy();
        remove(elem);
        this.unwireEvents();
    };
    Edit.prototype.keyPressHandler = function (e) {
        switch (e.action) {
            case 'insert':
                this.addRecord();
                break;
            case 'delete':
                this.deleteRecord();
                break;
            case 'f2':
                this.startEdit();
                break;
            case 'enter':
                if (!parentsUntil(e.target, '.e-unboundcelldiv') && this.parent.editSettings.mode !== 'batch' &&
                    parentsUntil(e.target, 'e-gridcontent') && !document.querySelectorAll('.e-popup-open').length) {
                    e.preventDefault();
                    this.endEdit();
                }
                break;
            case 'escape':
                this.closeEdit();
                break;
        }
    };
    Edit.prototype.preventBatch = function (args) {
        this.preventObj = args;
        this.showDialog('BatchSaveLostChanges', this.dialogObj);
    };
    Edit.prototype.executeAction = function () {
        this.preventObj.handler.call(this.preventObj.instance, this.preventObj.arg1, this.preventObj.arg2, this.preventObj.arg3, this.preventObj.arg4, this.preventObj.arg5, this.preventObj.arg6, this.preventObj.arg7);
    };
    /**
     * @hidden
     */
    Edit.prototype.applyFormValidation = function (cols) {
        var _this = this;
        var gObj = this.parent;
        var form = gObj.element.querySelector('.e-gridform');
        var rules = {};
        cols = cols ? cols : gObj.columns;
        for (var _i = 0, cols_2 = cols; _i < cols_2.length; _i++) {
            var col = cols_2[_i];
            if (col.validationRules && form.querySelectorAll('#' + gObj.element.id + col.field).length) {
                rules[col.field] = col.validationRules;
            }
        }
        this.parent.editModule.formObj = new FormValidator(form, {
            rules: rules,
            validationComplete: function (args) {
                _this.validationComplete(args);
            },
            customPlacement: function (inputElement, error) {
                _this.valErrorPlacement(inputElement, error);
            }
        });
    };
    Edit.prototype.valErrorPlacement = function (inputElement, error) {
        if (this.parent.isEdit) {
            var id = error.getAttribute('for');
            var parentElem = this.parent.editSettings.mode !== 'dialog' ? this.parent.getContentTable() :
                this.parent.element.querySelector('#' + this.parent.element.id + '_dialogEdit_wrapper');
            var elem = parentElem.querySelector('#' + id + '_Error');
            if (!elem) {
                this.createTooltip(inputElement, error, id, '');
            }
            else {
                elem.querySelector('.e-tip-content').innerHTML = error.innerHTML;
            }
        }
    };
    Edit.prototype.validationComplete = function (args) {
        if (this.parent.isEdit) {
            var parentElem = this.parent.editSettings.mode !== 'dialog' ? this.parent.getContentTable() :
                this.parent.element.querySelector('#' + this.parent.element.id + '_dialogEdit_wrapper');
            var elem = parentElem.querySelector('#' + args.inputName + '_Error');
            if (elem) {
                if (args.status === 'failure') {
                    elem.style.display = '';
                }
                else {
                    elem.style.display = 'none';
                }
            }
        }
    };
    Edit.prototype.createTooltip = function (element, error, name, display) {
        var table = this.parent.editSettings.mode !== 'dialog' ? this.parent.getContentTable() :
            this.parent.element.querySelector('#' + this.parent.element.id + '_dialogEdit_wrapper').querySelector('.e-dlg-content');
        var client = table.getBoundingClientRect();
        var inputClient = parentsUntil(element, 'e-rowcell').getBoundingClientRect();
        var div = createElement('div', {
            className: 'e-tooltip-wrap e-popup e-griderror',
            id: name + '_Error',
            styles: 'display:' + display + ';top:' +
                (inputClient.bottom - client.top + table.scrollTop + 9) + 'px;left:' +
                (inputClient.left - client.left + table.scrollLeft + inputClient.width / 2) + 'px;'
        });
        var content = createElement('div', { className: 'e-tip-content' });
        content.appendChild(error);
        var arrow = createElement('div', { className: 'e-arrow-tip e-tip-top' });
        arrow.appendChild(createElement('div', { className: 'e-arrow-tip-outer e-tip-top' }));
        arrow.appendChild(createElement('div', { className: 'e-arrow-tip-inner e-tip-top' }));
        div.appendChild(content);
        div.appendChild(arrow);
        table.appendChild(div);
        div.style.left = (parseInt(div.style.left, 10) - div.offsetWidth / 2) + 'px';
    };
    return Edit;
}());
export { Edit };
