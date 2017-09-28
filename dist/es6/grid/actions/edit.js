import { EventHandler } from '@syncfusion/ej2-base';
import { extend, getValue } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
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
import { parentsUntil } from '../base/util';
import { Tooltip } from '@syncfusion/ej2-popups';
import { FormValidator } from '@syncfusion/ej2-inputs';
var Edit = (function () {
    function Edit(parent, serviceLocator) {
        this.editCellType = {
            'dropdownedit': DropDownEditCell,
            'numericedit': NumericEditCell, 'booleanedit': BooleanEditCell, 'default': DefaultEditCell
        };
        this.editType = { 'inline': InlineEdit, 'normal': InlineEdit, 'batch': BatchEdit, 'dialog': DialogEdit };
        this.tapped = false;
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
        this.updateEditObj();
    }
    Edit.prototype.updateColTypeObj = function () {
        for (var _i = 0, _a = this.parent.columns; _i < _a.length; _i++) {
            var col = _a[_i];
            col.edit = extend(new this.editCellType[col.editType && this.editCellType[col.editType] ?
                col.editType : 'default'](this.parent, this.serviceLocator), col.edit || {});
        }
    };
    Edit.prototype.getModuleName = function () {
        return 'edit';
    };
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
        this.l10n = this.serviceLocator.getService('localization');
        this.createAlertDlg();
        this.createConfirmDlg();
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
    };
    Edit.prototype.closeEdit = function () {
        if (this.parent.editSettings.mode === 'batch' && this.parent.editSettings.showConfirmDialog
            && this.parent.element.querySelectorAll('.e-updatedtd').length) {
            this.showDialog('CancelEdit', this.dialogObj);
            return;
        }
        this.editModule.closeEdit();
        this.refreshToolbar();
    };
    Edit.prototype.refreshToolbar = function () {
        this.parent.notify(events.toolbarRefresh, {});
    };
    Edit.prototype.addRecord = function (data) {
        if (!this.parent.editSettings.allowAdding) {
            return;
        }
        this.editModule.addRecord(data);
        this.refreshToolbar();
    };
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
    Edit.prototype.deleteRow = function (tr) {
        this.deleteRecord(null, this.parent.getCurrentViewRecords()[parseInt(tr.getAttribute('aria-rowindex'), 10)]);
    };
    Edit.prototype.endEdit = function () {
        if (this.parent.editSettings.mode === 'batch' && this.parent.editSettings.showConfirmDialog) {
            this.showDialog('BatchSaveConfirm', this.dialogObj);
            return;
        }
        this.endEditing();
    };
    Edit.prototype.updateCell = function (rowIndex, field, value) {
        this.editModule.updateCell(rowIndex, field, value);
    };
    Edit.prototype.updateRow = function (index, data) {
        this.editModule.updateRow(index, data);
    };
    Edit.prototype.batchCancel = function () {
        this.closeEdit();
    };
    Edit.prototype.batchSave = function () {
        this.endEdit();
    };
    Edit.prototype.editCell = function (index, field) {
        this.editModule.editCell(index, field);
    };
    Edit.prototype.editFormValidate = function () {
        if (this.formObj) {
            return this.formObj.validate();
        }
        return false;
    };
    Edit.prototype.getBatchChanges = function () {
        return this.editModule.getBatchChanges ? this.editModule.getBatchChanges() : {};
    };
    Edit.prototype.getCurrentEditCellData = function () {
        var obj = this.getCurrentEditedData(this.formObj.element, {});
        return obj[Object.keys(obj)[0]];
    };
    Edit.prototype.saveCell = function () {
        this.editModule.saveCell();
    };
    Edit.prototype.endEditing = function () {
        this.editModule.endEdit();
        this.refreshToolbar();
    };
    Edit.prototype.showDialog = function (content, obj) {
        obj.content = '<div>' + this.l10n.getConstant(content) + '</div>';
        obj.show();
    };
    Edit.prototype.getValueFromType = function (col, value) {
        var val = value;
        switch (col.type) {
            case 'number':
                val = !isNullOrUndefined(parseFloat(value)) ? parseFloat(value) : null;
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
        var elements = [].slice.call(this.parent.element.getElementsByClassName('e-tooltip'));
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var elem = elements_1[_i];
            elem.ej2_instances[0].destroy();
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
        this.parent.addEventListener(events.actionBegin, this.onActionBegin.bind(this));
        this.parent.addEventListener(events.actionComplete, this.actionComplete.bind(this));
        this.parent.on(events.initialEnd, this.wireEvents, this);
    };
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
        this.parent.removeEventListener(events.actionComplete, this.actionComplete);
        this.parent.removeEventListener(events.actionBegin, this.onActionBegin);
        this.parent.off(events.initialEnd, this.unwireEvents);
    };
    Edit.prototype.actionComplete = function (e) {
        if (e.requestType !== 'add' && e.requestType !== 'beginEdit' && e.requestType !== 'delete') {
            this.parent.isEdit = false;
        }
        this.refreshToolbar();
    };
    Edit.prototype.getCurrentEditedData = function (form, editedData) {
        var gObj = this.parent;
        var inputs = [].slice.call(form.querySelectorAll('.e-field'));
        for (var i = 0, len = inputs.length; i < len; i++) {
            var col = gObj.getColumnByUid(inputs[i].getAttribute('e-mappinguid'));
            var value = void 0;
            if (col) {
                var temp = col.edit.read;
                if (typeof temp === 'string') {
                    temp = getValue(temp, window);
                }
                value = gObj.editModule.getValueFromType(col, col.edit.read(inputs[i]));
                setValue(col.field, value, editedData);
            }
        }
        return editedData;
    };
    Edit.prototype.onActionBegin = function (e) {
        if (this.parent.editSettings.mode !== 'batch' && this.formObj && !this.formObj.isDestroyed && !e.cancel) {
            this.destroyForm();
            this.destroyWidgets();
        }
    };
    Edit.prototype.destroyWidgets = function (cols) {
        cols = cols ? cols : this.parent.columns;
        for (var _i = 0, cols_1 = cols; _i < cols_1.length; _i++) {
            var col = cols_1[_i];
            if (col.edit.destroy) {
                col.edit.destroy();
            }
        }
    };
    Edit.prototype.destroyForm = function () {
        this.parent.notify(events.tooltipDestroy, {});
        if (this.formObj && !this.formObj.isDestroyed) {
            this.formObj.destroy();
        }
        this.parent.notify(events.tooltipDestroy, {});
    };
    Edit.prototype.destroy = function () {
        this.removeEventListener();
        this.dialogObj.destroy();
        this.alertDObj.destroy();
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
                if (this.parent.editSettings.mode !== 'batch' &&
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
            var td = parentsUntil(inputElement, 'e-rowcell');
            if (!td.ej2_instances || !td.ej2_instances.length) {
                var tooltip = new Tooltip({
                    opensOn: 'custom', content: error, position: 'bottom center', cssClass: 'e-griderror',
                    animation: { open: { effect: 'None' }, close: { effect: 'None' } }
                });
                tooltip.appendTo(td);
                tooltip.open(td);
            }
            else {
                td.ej2_instances[0].content = error;
            }
        }
    };
    Edit.prototype.validationComplete = function (args) {
        if (this.parent.isEdit) {
            var elem = parentsUntil(document.getElementById(this.parent.element.id + args.inputName), 'e-rowcell');
            if (elem && elem.ej2_instances && elem.ej2_instances.length) {
                var tObj = elem.ej2_instances[0];
                if (args.status === 'failure') {
                    tObj.open(parentsUntil(args.element, 'e-rowcell'));
                }
                else {
                    tObj.close();
                }
                tObj.refresh();
            }
        }
    };
    return Edit;
}());
export { Edit };
