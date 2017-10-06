import { extend, addClass } from '@syncfusion/ej2-base';
import { remove, classList, createElement } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { parentsUntil, inArray } from '../base/util';
import * as events from '../base/constant';
import { RowRenderer } from '../renderer/row-renderer';
import { CellRenderer } from '../renderer/cell-renderer';
import { RowModelGenerator } from '../services/row-model-generator';
var BatchEdit = (function () {
    function BatchEdit(parent, serviceLocator, renderer) {
        this.cellDetails = {};
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.renderer = renderer;
        this.addEventListener();
    }
    BatchEdit.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.dblclick, this.dblClickHandler, this);
        this.parent.on(events.keyPressed, this.keyPressHandler, this);
        this.parent.addEventListener(events.dataBound, this.dataBound.bind(this));
        this.parent.on(events.doubleTap, this.dblClickHandler, this);
    };
    BatchEdit.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.dblclick, this.dblClickHandler);
        this.parent.off(events.keyPressed, this.keyPressHandler);
        this.parent.removeEventListener(events.dataBound, this.dataBound);
        this.parent.off(events.doubleTap, this.dblClickHandler);
    };
    BatchEdit.prototype.dataBound = function () {
        this.parent.notify(events.toolbarRefresh, {});
    };
    BatchEdit.prototype.destroy = function () {
        this.removeEventListener();
    };
    BatchEdit.prototype.clickHandler = function (e) {
        if (!parentsUntil(e.target, this.parent.element.id + '_add', true)) {
            this.saveCell();
            if (parentsUntil(e.target, 'e-rowcell') && !this.parent.isEdit) {
                this.setCellIdx(e.target);
            }
        }
    };
    BatchEdit.prototype.dblClickHandler = function (e) {
        var target = e.target;
        var tr = parentsUntil(e.target, 'e-row');
        if ((parentsUntil(target, 'e-rowcell')) && tr) {
            this.editCell(parseInt(tr.getAttribute('aria-rowindex'), 10), this.parent.columns[parseInt(parentsUntil(target, 'e-rowcell').getAttribute('aria-colindex'), 10)].field);
        }
    };
    BatchEdit.prototype.keyPressHandler = function (e) {
        var isEdit = this.parent.isEdit;
        if (!document.querySelectorAll('.e-popup-open').length) {
            this.saveCell();
            isEdit = isEdit && !this.validateFormObj();
            switch (e.action) {
                case 'tab':
                    if (isEdit) {
                        this.editNextCell();
                    }
                    break;
                case 'shiftTab':
                    if (isEdit) {
                        this.editPrevCell();
                    }
                    break;
                case 'enter':
                    e.preventDefault();
                    if (isEdit && this.cellDetails.rowIndex + 1 < this.parent.getDataRows().length) {
                        this.editCell(this.cellDetails.rowIndex + 1, this.cellDetails.column.field);
                    }
                    break;
                case 'f2':
                    this.editCellFromIndex(this.cellDetails.rowIndex, this.cellDetails.cellIndex);
                    break;
            }
            if (this.parent.isEdit || !(this.cellDetails.cellIndex === 0 && this.cellDetails.rowIndex === 0) ||
                !(this.cellDetails.rowIndex === this.parent.getDataRows().length &&
                    this.cellDetails.cellIndex === this.parent.columns.length - 1)) {
                e.preventDefault();
            }
        }
        this.reFocusOnError(e);
    };
    BatchEdit.prototype.reFocusOnError = function (e) {
        if (this.validateFormObj() && (e.action === 'tab' || e.action === 'shiftTab')) {
            e.target.focus();
            e.preventDefault();
        }
    };
    BatchEdit.prototype.isAddRow = function (index) {
        return this.parent.getDataRows()[index].classList.contains('e-insertedrow');
    };
    BatchEdit.prototype.editNextCell = function () {
        var oldIdx = this.cellDetails.cellIndex;
        var cellIdx = this.findNextEditableCell(this.cellDetails.cellIndex + 1, this.isAddRow(this.cellDetails.rowIndex));
        if (cellIdx > -1) {
            this.cellDetails.cellIndex = cellIdx;
        }
        else if (this.cellDetails.rowIndex + 1 < this.parent.getDataRows().length) {
            this.cellDetails.rowIndex++;
            this.cellDetails.cellIndex = this.findNextEditableCell(0, this.isAddRow(this.cellDetails.rowIndex));
        }
        if (oldIdx !== this.cellDetails.cellIndex) {
            this.editCellFromIndex(this.cellDetails.rowIndex, this.cellDetails.cellIndex);
        }
    };
    BatchEdit.prototype.editPrevCell = function () {
        var oldIdx = this.cellDetails.cellIndex;
        var cellIdx = this.findPrevEditableCell(this.cellDetails.cellIndex - 1, this.isAddRow(this.cellDetails.rowIndex));
        if (cellIdx > -1) {
            this.cellDetails.cellIndex = cellIdx;
        }
        else if (this.cellDetails.rowIndex - 1 > -1) {
            this.cellDetails.rowIndex--;
            this.cellDetails.cellIndex = this.findPrevEditableCell(this.parent.columns.length - 1, this.isAddRow(this.cellDetails.rowIndex));
        }
        if (oldIdx !== this.cellDetails.cellIndex) {
            this.editCellFromIndex(this.cellDetails.rowIndex, this.cellDetails.cellIndex);
        }
    };
    BatchEdit.prototype.editCellFromIndex = function (rowIdx, cellIdx) {
        this.cellDetails.rowIndex = rowIdx;
        this.cellDetails.cellIndex = cellIdx;
        this.editCell(rowIdx, this.parent.columns[cellIdx].field);
    };
    BatchEdit.prototype.closeEdit = function () {
        var gObj = this.parent;
        var rows = gObj.contentModule.getRows();
        var rowRenderer = new RowRenderer(this.serviceLocator, null, this.parent);
        var tr;
        if (gObj.isEdit) {
            this.saveCell(true);
        }
        gObj.clearSelection();
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].isDirty) {
                tr = gObj.getContentTable().querySelector('[data-uid=' + rows[i].uid + ']');
                if (tr) {
                    if (tr.classList.contains('e-insertedrow')) {
                        remove(tr);
                        this.removeRowObjectFromUID(rows[i].uid);
                        i--;
                    }
                    else {
                        delete rows[i].changes;
                        rows[i].isDirty = false;
                        classList(tr, [], ['e-hiddenrow', 'e-updatedtd']);
                        rowRenderer.refresh(rows[i], gObj.columns, false);
                    }
                }
            }
        }
        gObj.selectRow(this.cellDetails.rowIndex);
        this.refreshRowIdx();
        gObj.notify(events.toolbarRefresh, {});
        this.parent.notify(events.tooltipDestroy, {});
    };
    BatchEdit.prototype.deleteRecord = function (fieldname, data) {
        this.saveCell();
        this.bulkDelete(fieldname, data);
    };
    BatchEdit.prototype.addRecord = function (data) {
        this.bulkAddRow(data);
    };
    BatchEdit.prototype.endEdit = function (data) {
        if (this.parent.isEdit && this.validateFormObj()) {
            return;
        }
        this.batchSave();
    };
    BatchEdit.prototype.validateFormObj = function () {
        return this.parent.editModule.formObj && !this.parent.editModule.formObj.validate();
    };
    BatchEdit.prototype.batchSave = function () {
        var gObj = this.parent;
        this.saveCell();
        if (gObj.isEdit) {
            return;
        }
        var changes = this.getBatchChanges();
        var args = { batchChanges: changes, cancel: false };
        gObj.trigger(events.beforeBatchSave, args);
        if (args.cancel) {
            return;
        }
        gObj.notify(events.bulkSave, { changes: changes });
    };
    BatchEdit.prototype.getBatchChanges = function () {
        var changes = {
            addedRecords: [],
            deletedRecords: [],
            changedRecords: []
        };
        var rows = this.parent.contentModule.getRows();
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            if (row.isDirty) {
                switch (row.edit) {
                    case 'add':
                        changes.addedRecords.push(row.changes);
                        break;
                    case 'delete':
                        changes.deletedRecords.push(row.data);
                        break;
                    default:
                        changes.changedRecords.push(row.changes);
                }
            }
        }
        return changes;
    };
    BatchEdit.prototype.removeRowObjectFromUID = function (uid) {
        var rows = this.parent.contentModule.getRows();
        var i = 0;
        for (var len = rows.length; i < len; i++) {
            if (rows[i].uid === uid) {
                break;
            }
        }
        rows.splice(i, 1);
    };
    BatchEdit.prototype.addRowObject = function (row) {
        this.parent.contentModule.getRows().unshift(row);
    };
    BatchEdit.prototype.bulkDelete = function (fieldname, data) {
        var gObj = this.parent;
        var index = data ? this.getIndexFromData(data) : gObj.selectedRowIndex;
        var args = {
            primaryKey: this.parent.getPrimaryKeyFieldNames(),
            rowIndex: index,
            rowData: data ? data : gObj.getSelectedRecords()[0],
            row: data ? gObj.getRows()[index] : gObj.getSelectedRows()[0], cancel: false
        };
        if (!args.row) {
            return;
        }
        gObj.trigger(events.beforeBatchDelete, args);
        if (args.cancel) {
            return;
        }
        gObj.clearSelection();
        var uid = args.row.getAttribute('data-uid');
        if (args.row.classList.contains('e-insertedrow')) {
            this.removeRowObjectFromUID(uid);
            remove(args.row);
        }
        else {
            var rowObj = gObj.getRowObjectFromUID(uid);
            rowObj.isDirty = true;
            rowObj.edit = 'delete';
            classList(args.row, ['e-hiddenrow', 'e-updatedtd'], []);
        }
        this.refreshRowIdx();
        gObj.selectRow(index);
        delete args.row;
        gObj.trigger(events.batchDelete, args);
        gObj.notify(events.toolbarRefresh, {});
        gObj.element.focus();
    };
    BatchEdit.prototype.refreshRowIdx = function () {
        var rows = [].slice.call(this.parent.getContentTable().querySelector('tbody').children);
        var dataRows = [];
        for (var i = 0, j = 0, len = rows.length; i < len; i++) {
            if (rows[i].classList.contains('e-row') && !rows[i].classList.contains('e-hiddenrow')) {
                rows[i].setAttribute('aria-rowindex', j.toString());
                j++;
            }
            else {
                rows[i].removeAttribute('aria-rowindex');
            }
        }
    };
    BatchEdit.prototype.getIndexFromData = function (data) {
        return inArray(data, this.parent.getCurrentViewRecords());
    };
    BatchEdit.prototype.bulkAddRow = function (data) {
        var gObj = this.parent;
        if (!gObj.editSettings.allowAdding) {
            return;
        }
        if (gObj.isEdit) {
            this.saveCell();
        }
        if (gObj.isEdit) {
            return;
        }
        var defaultData = data ? data : this.getDefaultData();
        var args = {
            defaultData: defaultData,
            primaryKey: gObj.getPrimaryKeyFieldNames(),
            cancel: false
        };
        gObj.trigger(events.beforeBatchAdd, args);
        if (args.cancel) {
            return;
        }
        gObj.clearSelection();
        var row = new RowRenderer(this.serviceLocator, null, this.parent);
        var model = new RowModelGenerator(this.parent);
        var modelData = model.generateRows([args.defaultData]);
        var tr = row.render(modelData[0], gObj.getColumns());
        var col;
        var index;
        for (var i = 0; i < this.parent.groupSettings.columns.length; i++) {
            tr.insertBefore(createElement('td', { className: 'e-indentcell' }), tr.firstChild);
        }
        var tbody = gObj.getContentTable().querySelector('tbody');
        tr.classList.add('e-insertedrow');
        tbody.insertBefore(tr, tbody.firstChild);
        addClass(tr.querySelectorAll('.e-rowcell'), ['e-updatedtd']);
        modelData[0].isDirty = true;
        modelData[0].changes = extend({}, modelData[0].data);
        modelData[0].edit = 'add';
        this.addRowObject(modelData[0]);
        this.refreshRowIdx();
        gObj.selectRow(0);
        if (!data) {
            index = this.findNextEditableCell(0, true);
            col = gObj.columns[index];
            this.editCell(0, col.field, true);
        }
        var args1 = {
            defaultData: args.defaultData, row: tr,
            columnObject: col, columnIndex: index, primaryKey: args.primaryKey, cell: tr.cells[index]
        };
        gObj.trigger(events.batchAdd, args1);
    };
    BatchEdit.prototype.findNextEditableCell = function (columnIndex, isAdd) {
        var cols = this.parent.columns;
        var endIndex = cols.length;
        for (var i = columnIndex; i < endIndex; i++) {
            if (!isAdd && this.checkNPCell(cols[i])) {
                return i;
            }
            else if (isAdd && !cols[i].template && cols[i].visible && cols[i].allowEditing) {
                return i;
            }
        }
        return -1;
    };
    BatchEdit.prototype.findPrevEditableCell = function (columnIndex, isAdd) {
        var cols = this.parent.columns;
        for (var i = columnIndex; i > -1; i--) {
            if (!isAdd && this.checkNPCell(cols[i])) {
                return i;
            }
            else if (isAdd && !cols[i].template && cols[i].visible && cols[i].allowEditing) {
                return i;
            }
        }
        return -1;
    };
    BatchEdit.prototype.checkNPCell = function (col) {
        return !col.template && col.visible && !col.isPrimaryKey && !col.isIdentity && col.allowEditing;
    };
    BatchEdit.prototype.getDefaultData = function () {
        var gObj = this.parent;
        var data = {};
        var dValues = { 'number': 0, 'string': null, 'boolean': false, 'date': null, 'datetime': null };
        for (var _i = 0, _a = gObj.columns; _i < _a.length; _i++) {
            var col = _a[_i];
            data[col.field] = col.defaultValue ? col.defaultValue : dValues[col.type];
        }
        return data;
    };
    BatchEdit.prototype.setCellIdx = function (target) {
        var gLen = 0;
        if (this.parent.allowGrouping) {
            gLen = this.parent.groupSettings.columns.length;
        }
        this.cellDetails.cellIndex = target.cellIndex - gLen;
        this.cellDetails.rowIndex = parseInt(target.parentElement.getAttribute('aria-rowindex'), 10);
    };
    BatchEdit.prototype.editCell = function (index, field, isAdd) {
        var gObj = this.parent;
        var col = gObj.getColumnByField(field);
        var keys = gObj.getPrimaryKeyFieldNames();
        if (gObj.editSettings.allowEditing && col.allowEditing) {
            if (gObj.isEdit && !(this.cellDetails.column.field === field && this.cellDetails.rowIndex === index)) {
                this.saveCell();
            }
            if (gObj.isEdit) {
                return;
            }
            var row = gObj.getDataRows()[index];
            if ((keys[0] === col.field && !row.classList.contains('e-insertedrow')) || col.template || col.columns) {
                return;
            }
            var rowData = extend({}, this.getDataByIndex(index));
            var args = {
                cell: row.cells[this.getCellIdx(col.uid)], row: row,
                columnName: col.field, columnObject: col, isForeignKey: !isNullOrUndefined(col.foreignKeyValue),
                primaryKey: keys, rowData: rowData,
                validationRules: extend({}, col.validationRules ? col.validationRules : {}),
                value: rowData[col.field], type: !isAdd ? 'edit' : 'add', cancel: false
            };
            gObj.trigger(events.cellEdit, args);
            if (args.cancel) {
                return;
            }
            this.cellDetails = {
                rowData: rowData, column: col, value: args.value, isForeignKey: args.isForeignKey,
            };
            this.setCellIdx(args.cell);
            if (args.cell.classList.contains('e-updatedtd')) {
                this.isColored = true;
                args.cell.classList.remove('e-updatedtd');
            }
            gObj.clearSelection();
            gObj.selectRow(this.cellDetails.rowIndex);
            gObj.isEdit = true;
            this.renderer.update(args);
            this.form = gObj.element.querySelector('#' + gObj.element.id + 'EditForm');
            gObj.editModule.applyFormValidation([col]);
            this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
        }
    };
    BatchEdit.prototype.updateCell = function (rowIndex, field, value) {
        var col = this.parent.getColumnByField(field);
        if (col && !col.isPrimaryKey) {
            var td = this.parent.getDataRows()[rowIndex].cells[this.parent.getColumnIndexByField(field)];
            var rowObj = this.parent.getRowObjectFromUID(td.parentElement.getAttribute('data-uid'));
            this.refreshTD(td, col, rowObj, value);
            this.parent.trigger(events.queryCellInfo, {
                cell: td, column: col, data: rowObj.changes
            });
        }
    };
    BatchEdit.prototype.setChanges = function (rowObj, field, value) {
        if (!rowObj.changes) {
            rowObj.changes = extend({}, rowObj.data);
        }
        rowObj.changes[field] = value;
        rowObj.isDirty = true;
    };
    BatchEdit.prototype.updateRow = function (index, data) {
        var keys = Object.keys(data);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var col = keys_1[_i];
            this.updateCell(index, col, data[col]);
        }
    };
    BatchEdit.prototype.getCellIdx = function (uid) {
        var cIdx = this.parent.getColumnIndexByUid(uid) + this.parent.groupSettings.columns.length;
        if (!isNullOrUndefined(this.parent.detailTemplate) || !isNullOrUndefined(this.parent.childGrid)) {
            cIdx++;
        }
        return cIdx;
    };
    BatchEdit.prototype.refreshTD = function (td, column, rowObj, value) {
        var cell = new CellRenderer(this.parent, this.serviceLocator);
        this.setChanges(rowObj, column.field, value);
        cell.refreshTD(td, rowObj.cells[this.getCellIdx(column.uid)], rowObj.changes);
        td.classList.add('e-updatedtd');
        this.parent.notify(events.toolbarRefresh, {});
    };
    BatchEdit.prototype.saveCell = function (isForceSave) {
        var gObj = this.parent;
        if (!isForceSave && (!gObj.isEdit || this.validateFormObj())) {
            return;
        }
        var tr = parentsUntil(this.form, 'e-row');
        var column = this.cellDetails.column;
        var editedData = gObj.editModule.getCurrentEditedData(this.form, {});
        editedData = extend(this.cellDetails.rowData, editedData);
        var args = {
            columnName: column.field,
            value: editedData[column.field],
            rowData: this.cellDetails.rowData,
            previousValue: this.cellDetails.value,
            columnObject: column,
            cell: this.form.parentElement,
            isForeignKey: this.cellDetails.isForeignKey, cancel: false
        };
        if (!isForceSave) {
            gObj.trigger(events.cellSave, args);
        }
        if (args.cancel) {
            return;
        }
        gObj.editModule.destroyForm();
        gObj.editModule.destroyWidgets([column]);
        this.parent.notify(events.tooltipDestroy, {});
        this.refreshTD(args.cell, column, gObj.getRowObjectFromUID(tr.getAttribute('data-uid')), args.value);
        classList(tr, [], ['e-editedrow', 'e-batchrow']);
        args.cell.classList.remove('e-editedbatchcell');
        gObj.isEdit = false;
        if (!isNullOrUndefined(args.value) && args.value.toString() ===
            (!isNullOrUndefined(this.cellDetails.value) ? this.cellDetails.value : '').toString() && !this.isColored) {
            args.cell.classList.remove('e-updatedtd');
        }
        gObj.notify(events.toolbarRefresh, {});
        this.isColored = false;
    };
    BatchEdit.prototype.getDataByIndex = function (index) {
        var row = this.parent.getRowObjectFromUID(this.parent.getDataRows()[index].getAttribute('data-uid'));
        return row.changes ? row.changes : row.data;
    };
    BatchEdit.prototype.valComplete = function (args) {
        var edit = this.parent.editModule;
        edit.validationComplete(args);
    };
    BatchEdit.prototype.customPlacement = function (inputElement, error) {
        var edit = this.parent.editModule;
        edit.valErrorPlacement(inputElement, error);
    };
    return BatchEdit;
}());
export { BatchEdit };
