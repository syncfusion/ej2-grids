var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, ChildProperty, Browser } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, addClass, removeClass, append, classList } from '@syncfusion/ej2-base';
import { Property, Collection, Complex, Event, NotifyPropertyChanges, L10n } from '@syncfusion/ej2-base';
import { EventHandler, KeyboardEvents } from '@syncfusion/ej2-base';
import { iterateArrayOrObject, prepareColumns, parentsUntil, wrap, templateCompiler } from './util';
import * as events from '../base/constant';
import { Render } from '../renderer/render';
import { RenderType } from './enum';
import { CellRendererFactory } from '../services/cell-render-factory';
import { ServiceLocator } from '../services/service-locator';
import { ValueFormatter } from '../services/value-formatter';
import { RendererFactory } from '../services/renderer-factory';
import { ColumnWidthService } from '../services/width-controller';
import { AriaService } from '../services/aria-service';
import { PageSettings } from '../models/page-settings';
import { Selection } from '../actions/selection';
import { Search } from '../actions/search';
import { ShowHide } from '../actions/show-hide';
import { Scroll } from '../actions/scroll';
import { Print } from '../actions/print';
import { AggregateRow } from '../models/aggregate';
import { ColumnChooser } from '../actions/column-chooser';
var SortDescriptor = (function (_super) {
    __extends(SortDescriptor, _super);
    function SortDescriptor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SortDescriptor;
}(ChildProperty));
export { SortDescriptor };
__decorate([
    Property()
], SortDescriptor.prototype, "field", void 0);
__decorate([
    Property()
], SortDescriptor.prototype, "direction", void 0);
var SortSettings = (function (_super) {
    __extends(SortSettings, _super);
    function SortSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SortSettings;
}(ChildProperty));
export { SortSettings };
__decorate([
    Collection([], SortDescriptor)
], SortSettings.prototype, "columns", void 0);
var Predicate = (function (_super) {
    __extends(Predicate, _super);
    function Predicate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Predicate;
}(ChildProperty));
export { Predicate };
__decorate([
    Property()
], Predicate.prototype, "field", void 0);
__decorate([
    Property()
], Predicate.prototype, "operator", void 0);
__decorate([
    Property()
], Predicate.prototype, "value", void 0);
__decorate([
    Property()
], Predicate.prototype, "matchCase", void 0);
__decorate([
    Property()
], Predicate.prototype, "predicate", void 0);
__decorate([
    Property({})
], Predicate.prototype, "actualFilterValue", void 0);
__decorate([
    Property({})
], Predicate.prototype, "actualOperator", void 0);
var FilterSettings = (function (_super) {
    __extends(FilterSettings, _super);
    function FilterSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FilterSettings;
}(ChildProperty));
export { FilterSettings };
__decorate([
    Collection([], Predicate)
], FilterSettings.prototype, "columns", void 0);
__decorate([
    Property('filterbar')
], FilterSettings.prototype, "type", void 0);
__decorate([
    Property()
], FilterSettings.prototype, "mode", void 0);
__decorate([
    Property(true)
], FilterSettings.prototype, "showFilterBarStatus", void 0);
__decorate([
    Property(1500)
], FilterSettings.prototype, "immediateModeDelay", void 0);
var SelectionSettings = (function (_super) {
    __extends(SelectionSettings, _super);
    function SelectionSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SelectionSettings;
}(ChildProperty));
export { SelectionSettings };
__decorate([
    Property('row')
], SelectionSettings.prototype, "mode", void 0);
__decorate([
    Property('flow')
], SelectionSettings.prototype, "cellSelectionMode", void 0);
__decorate([
    Property('single')
], SelectionSettings.prototype, "type", void 0);
var SearchSettings = (function (_super) {
    __extends(SearchSettings, _super);
    function SearchSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SearchSettings;
}(ChildProperty));
export { SearchSettings };
__decorate([
    Property([])
], SearchSettings.prototype, "fields", void 0);
__decorate([
    Property('')
], SearchSettings.prototype, "key", void 0);
__decorate([
    Property('contains')
], SearchSettings.prototype, "operator", void 0);
__decorate([
    Property(true)
], SearchSettings.prototype, "ignoreCase", void 0);
var RowDropSettings = (function (_super) {
    __extends(RowDropSettings, _super);
    function RowDropSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RowDropSettings;
}(ChildProperty));
export { RowDropSettings };
__decorate([
    Property()
], RowDropSettings.prototype, "targetID", void 0);
var TextWrapSettings = (function (_super) {
    __extends(TextWrapSettings, _super);
    function TextWrapSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TextWrapSettings;
}(ChildProperty));
export { TextWrapSettings };
__decorate([
    Property('both')
], TextWrapSettings.prototype, "wrapMode", void 0);
var GroupSettings = (function (_super) {
    __extends(GroupSettings, _super);
    function GroupSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GroupSettings;
}(ChildProperty));
export { GroupSettings };
__decorate([
    Property(true)
], GroupSettings.prototype, "showDropArea", void 0);
__decorate([
    Property(false)
], GroupSettings.prototype, "showToggleButton", void 0);
__decorate([
    Property(false)
], GroupSettings.prototype, "showGroupedColumn", void 0);
__decorate([
    Property(true)
], GroupSettings.prototype, "showUngroupButton", void 0);
__decorate([
    Property(false)
], GroupSettings.prototype, "disablePageWiseAggregates", void 0);
__decorate([
    Property([])
], GroupSettings.prototype, "columns", void 0);
var EditSettings = (function (_super) {
    __extends(EditSettings, _super);
    function EditSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EditSettings;
}(ChildProperty));
export { EditSettings };
__decorate([
    Property(false)
], EditSettings.prototype, "allowAdding", void 0);
__decorate([
    Property(false)
], EditSettings.prototype, "allowEditing", void 0);
__decorate([
    Property(false)
], EditSettings.prototype, "allowDeleting", void 0);
__decorate([
    Property('normal')
], EditSettings.prototype, "mode", void 0);
__decorate([
    Property(true)
], EditSettings.prototype, "allowEditOnDblClick", void 0);
__decorate([
    Property(true)
], EditSettings.prototype, "showConfirmDialog", void 0);
__decorate([
    Property(false)
], EditSettings.prototype, "showDeleteConfirmDialog", void 0);
var Grid = (function (_super) {
    __extends(Grid, _super);
    function Grid(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.isInitial = true;
        _this.sortedColumns = [];
        _this.inViewIndexes = [];
        _this.mediaCol = [];
        _this.isMediaQuery = false;
        _this.isInitialLoad = false;
        _this.filterOperators = {
            contains: 'contains', endsWith: 'endswith', equal: 'equal', greaterThan: 'greaterthan', greaterThanOrEqual: 'greaterthanorequal',
            lessThan: 'lessthan', lessThanOrEqual: 'lessthanorequal', notEqual: 'notequal', startsWith: 'startswith'
        };
        _this.defaultLocale = {
            EmptyRecord: 'No records to display',
            True: 'true',
            False: 'false',
            InvalidFilterMessage: 'Invalid Filter Data',
            GroupDropArea: 'Drag a column header here to group its column',
            UnGroup: 'Click here to ungroup',
            GroupDisable: 'Grouping is disabled for this column',
            FilterbarTitle: '\'s filter bar cell',
            EmptyDataSourceError: 'DataSource must not be empty at initial load since columns are generated from dataSource in AutoGenerate Column Grid',
            Add: 'Add',
            Edit: 'Edit',
            Cancel: 'Cancel',
            Update: 'Update',
            Delete: 'Delete',
            Print: 'Print',
            Pdfexport: 'PDF Export',
            Excelexport: 'Excel Export',
            Wordexport: 'Word Export',
            Csvexport: 'CSV Export',
            Search: 'Search',
            Item: 'item',
            Items: 'items',
            EditOperationAlert: 'No records selected for edit operation',
            DeleteOperationAlert: 'No records selected for delete operation',
            SaveButton: 'Save',
            OKButton: 'OK',
            CancelButton: 'Cancel',
            EditFormTitle: 'Details of ',
            AddFormTitle: 'Add New Record',
            BatchSaveConfirm: 'Are you sure you want to save changes?',
            BatchSaveLostChanges: 'Unsaved changes will be lost. Are you sure you want to continue?',
            ConfirmDelete: 'Are you sure you want to Delete Record?',
            CancelEdit: 'Are you sure you want to Cancel the changes?',
            ChooseColumns: 'Choose Column',
            SearchColumns: 'search columns',
            Matchs: 'No Matches Found'
        };
        _this.keyConfigs = {
            downArrow: 'downarrow',
            upArrow: 'uparrow',
            rightArrow: 'rightarrow',
            leftArrow: 'leftarrow',
            shiftDown: 'shift+downarrow',
            shiftUp: 'shift+uparrow',
            shiftRight: 'shift+rightarrow',
            shiftLeft: 'shift+leftarrow',
            home: 'home',
            end: 'end',
            escape: 'escape',
            ctrlHome: 'ctrl+home',
            ctrlEnd: 'ctrl+end',
            pageUp: 'pageup',
            pageDown: 'pagedown',
            ctrlAltPageUp: 'ctrl+alt+pageup',
            ctrlAltPageDown: 'ctrl+alt+pagedown',
            altPageUp: 'alt+pageup',
            altPageDown: 'alt+pagedown',
            altDownArrow: 'alt+downarrow',
            altUpArrow: 'alt+uparrow',
            ctrlDownArrow: 'ctrl+downarrow',
            ctrlUpArrow: 'ctrl+uparrow',
            ctrlPlusA: 'ctrl+A',
            ctrlPlusP: 'ctrl+P',
            insert: 'insert',
            delete: 'delete',
            f2: 'f2',
            enter: 'enter',
            tab: 'tab',
            shiftTab: 'shift+tab'
        };
        return _this;
    }
    Grid.prototype.getPersistData = function () {
        var keyEntity = ['allowPaging', 'pageSettings', 'allowSorting', 'sortSettings', 'allowSelection',
            'selectionSettings', 'allowFiltering', 'filterSettings', 'gridLines',
            'created', 'destroyed', 'load', 'actionBegin', 'actionComplete', 'actionFailure', 'rowSelecting', 'rowSelected',
            'columnSelecting', 'columnSelected', 'cellSelecting', 'cellSelected', 'dataBound', 'groupSettings', 'columns', 'allowKeyboard',
            'enableAltRow', 'enableHover', 'allowTextWrap', 'textWrapSettings', 'searchSettings', 'selectedRowIndex', 'allowReordering',
            'allowRowDragAndDrop', 'rowDropSettings', 'allowGrouping', 'height', 'width', 'rowTemplate', 'printMode',
            'rowDataBound', 'queryCellInfo', 'rowDeselecting', 'rowDeselected', 'cellDeselecting', 'cellDeselected',
            'columnDragStart', 'columnDrag', 'columnDrop', 'printComplete', 'beforePrint', 'detailDataBound', 'detailTemplate',
            'childGrid', 'queryString', 'toolbar', 'toolbarClick', 'editSettings',
            'batchAdd', 'batchDelete', 'beforeBatchAdd', 'beforeBatchDelete',
            'beforeBatchSave', 'beginEdit', 'cellEdit', 'cellSave', 'endAdd', 'endDelete', 'endEdit', 'beforeDataBound',
            'beforeOpenColumnChooser', 'allowResizing', 'ExcelExport', 'PdfExport',
            'allowExcelExport', 'allowPdfExport',
            'pdfQueryCellInfo', 'excelQueryCellInfo'];
        return this.addOnPersist(keyEntity);
    };
    Grid.prototype.requiredModules = function () {
        var modules = [];
        if (this.allowFiltering) {
            modules.push({
                member: 'filter',
                args: [this, this.filterSettings, this.serviceLocator]
            });
        }
        if (this.allowExcelExport) {
            modules.push({
                member: 'ExcelExport',
                args: [this]
            });
        }
        if (this.allowPdfExport) {
            modules.push({
                member: 'PdfExport',
                args: [this]
            });
        }
        if (this.allowSorting) {
            modules.push({
                member: 'sort',
                args: [this, this.sortSettings, this.sortedColumns]
            });
        }
        if (this.allowPaging) {
            modules.push({
                member: 'pager',
                args: [this, this.pageSettings]
            });
        }
        if (this.allowSelection) {
            modules.push({
                member: 'selection',
                args: [this, this.selectionSettings, this.serviceLocator]
            });
        }
        modules.push({
            member: 'resize',
            args: [this]
        });
        if (this.allowReordering) {
            modules.push({
                member: 'reorder',
                args: [this]
            });
        }
        if (this.allowRowDragAndDrop) {
            modules.push({
                member: 'rowDragAndDrop',
                args: [this]
            });
        }
        if (this.allowGrouping) {
            modules.push({
                member: 'group',
                args: [this, this.groupSettings, this.sortedColumns, this.serviceLocator]
            });
        }
        if (this.aggregates.length) {
            modules.push({ member: 'aggregate', args: [this, this.serviceLocator] });
        }
        if (this.isDetail()) {
            modules.push({
                member: 'detailRow',
                args: [this]
            });
        }
        if (this.toolbar || this.toolbarTemplate) {
            modules.push({
                member: 'toolbar',
                args: [this, this.serviceLocator]
            });
        }
        if (this.enableVirtualization || this.enableColumnVirtualization) {
            modules.push({
                member: 'virtualscroll',
                args: [this, this.serviceLocator]
            });
        }
        if (this.editSettings.allowAdding || this.editSettings.allowDeleting || this.editSettings.allowEditing) {
            modules.push({
                member: 'edit',
                args: [this, this.serviceLocator]
            });
        }
        return modules;
    };
    Grid.prototype.preRender = function () {
        this.serviceLocator = new ServiceLocator;
        this.initializeServices();
    };
    Grid.prototype.render = function () {
        this.ariaService.setOptions(this.element, { role: 'grid' });
        this.renderModule = new Render(this, this.serviceLocator);
        this.getMediaColumns();
        this.searchModule = new Search(this);
        this.scrollModule = new Scroll(this);
        if (this.showColumnChooser) {
            this.columnChooserModule = new ColumnChooser(this, this.serviceLocator);
        }
        this.notify(events.initialLoad, {});
        this.trigger(events.load);
        prepareColumns(this.columns, this.enableColumnVirtualization);
        this.getColumns();
        this.processModel();
        this.gridRender();
        this.wireEvents();
        this.addListener();
        this.updateDefaultCursor();
        this.notify(events.initialEnd, {});
    };
    Grid.prototype.getMediaColumns = function () {
        if (!this.enableColumnVirtualization) {
            var gcol = this.getColumns();
            this.getShowHideService = this.serviceLocator.getService('showHideService');
            if (!isNullOrUndefined(gcol)) {
                for (var index = 0; index < gcol.length; index++) {
                    if (!isNullOrUndefined(gcol[index].hideAtMedia)) {
                        this.mediaCol.push(gcol[index]);
                        var media = window.matchMedia(gcol[index].hideAtMedia);
                        this.mediaQueryUpdate(index, media);
                        media.addListener(this.mediaQueryUpdate.bind(this, index));
                    }
                }
            }
        }
    };
    Grid.prototype.mediaQueryUpdate = function (columnIndex, e) {
        this.isMediaQuery = true;
        var col = this.getColumns()[columnIndex];
        col.visible = e.matches;
        if (this.isInitialLoad) {
            if (col.visible) {
                this.showHider.show(col.headerText, 'headerText');
            }
            else {
                this.showHider.hide(col.headerText, 'headerText');
            }
        }
    };
    Grid.prototype.refreshMediaCol = function () {
        if (this.isMediaQuery) {
            this.refresh();
            this.isMediaQuery = false;
        }
        this.isInitialLoad = true;
    };
    Grid.prototype.eventInitializer = function () {
    };
    Grid.prototype.destroy = function () {
        this.unwireEvents();
        this.removeListener();
        this.notify(events.destroy, {});
        this.destroyDependentModules();
        _super.prototype.destroy.call(this);
        this.element.innerHTML = '';
        classList(this.element, [], ['e-rtl', 'e-gridhover', 'e-responsive', 'e-default', 'e-device']);
    };
    Grid.prototype.destroyDependentModules = function () {
        this.scrollModule.destroy();
        this.keyboardModule.destroy();
    };
    Grid.prototype.getModuleName = function () {
        return 'grid';
    };
    Grid.prototype.onPropertyChanged = function (newProp, oldProp) {
        var requireRefresh = false;
        var requireGridRefresh = false;
        var checkCursor;
        var args = { requestType: 'refresh' };
        if (this.isDestroyed) {
            return;
        }
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'allowPaging':
                    this.notify(events.uiUpdate, { module: 'pager', enable: this.allowPaging });
                    requireRefresh = true;
                    break;
                case 'pageSettings':
                    this.notify(events.inBoundModelChanged, { module: 'pager', properties: newProp.pageSettings });
                    if (isNullOrUndefined(newProp.pageSettings.currentPage) && isNullOrUndefined(newProp.pageSettings.totalRecordsCount)) {
                        requireRefresh = true;
                    }
                    break;
                case 'locale':
                    this.localeObj.setLocale(newProp.locale);
                    this.valueFormatterService.setCulture(newProp.locale);
                    requireRefresh = true;
                    if (this.toolbar) {
                        this.notify(events.uiUpdate, { module: 'toolbar' });
                    }
                    break;
                case 'allowSorting':
                    this.notify(events.uiUpdate, { module: 'sort', enable: this.allowSorting });
                    requireRefresh = true;
                    checkCursor = true;
                    break;
                case 'allowFiltering':
                    this.notify(events.uiUpdate, { module: 'filter', enable: this.allowFiltering });
                    requireRefresh = true;
                    break;
                case 'height':
                case 'width':
                    this.notify(events.uiUpdate, {
                        module: 'scroll',
                        properties: { width: newProp.width, height: newProp.height }
                    });
                    break;
                case 'allowReordering':
                    this.notify(events.uiUpdate, { module: 'reorder', enable: this.allowReordering });
                    checkCursor = true;
                    break;
                case 'allowRowDragAndDrop':
                    this.notify(events.uiUpdate, { module: 'rowDragAndDrop', enable: this.allowRowDragAndDrop });
                    break;
                case 'rowTemplate':
                    this.rowTemplateFn = templateCompiler(this.rowTemplate);
                    requireRefresh = true;
                    break;
                case 'detailTemplate':
                    this.detailTemplateFn = templateCompiler(this.detailTemplate);
                    requireRefresh = true;
                    break;
                case 'allowGrouping':
                    this.notify(events.uiUpdate, { module: 'group', enable: this.allowGrouping });
                    this.headerModule.refreshUI();
                    requireRefresh = true;
                    checkCursor = true;
                    break;
                case 'childGrid':
                    requireRefresh = true;
                    break;
                case 'toolbar':
                    this.notify(events.uiUpdate, { module: 'toolbar' });
                    break;
                case 'groupSettings':
                    if (!(isNullOrUndefined(newProp.groupSettings.showDropArea))) {
                        this.headerModule.refreshUI();
                        requireRefresh = true;
                        checkCursor = true;
                    }
                    this.notify(events.inBoundModelChanged, { module: 'group', properties: newProp.groupSettings });
                    break;
                case 'aggregates':
                    this.notify(events.uiUpdate, { module: 'aggregate', properties: newProp });
                    break;
                case 'columns':
                    this.updateColumnObject();
                    requireGridRefresh = true;
                    break;
                default:
                    this.extendedPropertyChange(prop, newProp);
            }
        }
        if (checkCursor) {
            this.updateDefaultCursor();
        }
        if (requireGridRefresh) {
            this.refresh();
        }
        else if (requireRefresh) {
            this.notify(events.modelChanged, args);
            requireRefresh = false;
        }
    };
    Grid.prototype.extendedPropertyChange = function (prop, newProp) {
        switch (prop) {
            case 'enableRtl':
                this.updateRTL();
                if (this.allowPaging) {
                    this.element.querySelector('.e-gridpager').ej2_instances[0].enableRtl = newProp.enableRtl;
                    this.element.querySelector('.e-gridpager').ej2_instances[0].dataBind();
                }
                if (this.height !== 'auto') {
                    this.scrollModule.removePadding(!newProp.enableRtl);
                    this.scrollModule.setPadding();
                }
                if (this.toolbar) {
                    this.toolbarModule.getToolbar().ej2_instances[0].enableRtl = newProp.enableRtl;
                    this.toolbarModule.getToolbar().ej2_instances[0].dataBind();
                }
                break;
            case 'enableAltRow':
                this.renderModule.refresh();
                break;
            case 'allowResizing':
                this.headerModule.refreshUI();
                break;
            case 'gridLines':
                this.updateGridLines();
                break;
            case 'filterSettings':
                this.notify(events.inBoundModelChanged, { module: 'filter', properties: newProp.filterSettings });
                break;
            case 'searchSettings':
                this.notify(events.inBoundModelChanged, { module: 'search', properties: newProp.searchSettings });
                break;
            case 'sortSettings':
                this.notify(events.inBoundModelChanged, { module: 'sort' });
                break;
            case 'selectionSettings':
                this.notify(events.inBoundModelChanged, { module: 'selection', properties: newProp.selectionSettings });
                break;
            case 'editSettings':
                this.notify(events.inBoundModelChanged, { module: 'edit', properties: newProp.editSettings });
                break;
            case 'allowTextWrap':
            case 'textWrapSettings':
                if (this.allowTextWrap) {
                    this.applyTextWrap();
                }
                else {
                    this.removeTextWrap();
                }
                break;
            case 'dataSource':
                this.notify(events.dataSourceModified, {});
                this.renderModule.refresh();
                break;
            case 'enableHover':
                var action = newProp.enableHover ? addClass : removeClass;
                action([this.element], 'e-gridhover');
                break;
        }
    };
    Grid.prototype.updateDefaultCursor = function () {
        var headerRows = [].slice.call(this.element.querySelectorAll('.e-columnheader'));
        for (var _i = 0, headerRows_1 = headerRows; _i < headerRows_1.length; _i++) {
            var row = headerRows_1[_i];
            if (this.allowSorting || this.allowGrouping || this.allowReordering) {
                row.classList.remove('e-defaultcursor');
            }
            else {
                row.classList.add('e-defaultcursor');
            }
        }
    };
    Grid.prototype.updateColumnModel = function (columns) {
        for (var i = 0, len = columns.length; i < len; i++) {
            if (columns[i].columns) {
                this.updateColumnModel(columns[i].columns);
            }
            else {
                this.columnModel.push(columns[i]);
            }
        }
    };
    Grid.prototype.getColumns = function () {
        var _this = this;
        var inview = this.inViewIndexes.map(function (v) { return v - _this.groupSettings.columns.length; }).filter(function (v) { return v > -1; });
        var vLen = inview.length;
        if (!this.enableColumnVirtualization || isNullOrUndefined(this.columnModel) || this.columnModel.length === 0) {
            this.columnModel = [];
            this.updateColumnModel(this.columns);
        }
        var columns = vLen === 0 ? this.columnModel :
            this.columnModel.slice(inview[0], inview[vLen - 1] + 1);
        return columns;
    };
    Grid.prototype.getColumnIndexesInView = function () {
        return this.inViewIndexes;
    };
    Grid.prototype.setColumnIndexesInView = function (indexes) {
        this.inViewIndexes = indexes;
    };
    Grid.prototype.getVisibleColumns = function () {
        var cols = [];
        for (var _i = 0, _a = this.columnModel; _i < _a.length; _i++) {
            var col = _a[_i];
            if (col.visible) {
                cols.push(col);
            }
        }
        return cols;
    };
    Grid.prototype.getHeaderContent = function () {
        return this.headerModule.getPanel();
    };
    Grid.prototype.setGridHeaderContent = function (element) {
        this.headerModule.setPanel(element);
    };
    Grid.prototype.getContentTable = function () {
        return this.contentModule.getTable();
    };
    Grid.prototype.setGridContentTable = function (element) {
        this.contentModule.setTable(element);
    };
    Grid.prototype.getContent = function () {
        return this.contentModule.getPanel();
    };
    Grid.prototype.setGridContent = function (element) {
        this.contentModule.setPanel(element);
    };
    Grid.prototype.getHeaderTable = function () {
        return this.headerModule.getTable();
    };
    Grid.prototype.setGridHeaderTable = function (element) {
        this.headerModule.setTable(element);
    };
    Grid.prototype.getFooterContent = function () {
        if (isNullOrUndefined(this.footerElement)) {
            this.footerElement = this.element.getElementsByClassName('e-gridfooter')[0];
        }
        return this.footerElement;
    };
    Grid.prototype.getFooterContentTable = function () {
        if (isNullOrUndefined(this.footerElement)) {
            this.footerElement = this.element.getElementsByClassName('e-gridfooter')[0];
        }
        return this.footerElement.firstChild.firstChild;
    };
    Grid.prototype.getPager = function () {
        return this.gridPager;
    };
    Grid.prototype.setGridPager = function (element) {
        this.gridPager = element;
    };
    Grid.prototype.getRowByIndex = function (index) {
        return this.contentModule.getRowByIndex(index);
    };
    Grid.prototype.getRows = function () {
        return this.contentModule.getRowElements();
    };
    Grid.prototype.getDataRows = function () {
        var rows = [].slice.call(this.getContentTable().querySelector('tbody').children);
        var dataRows = [];
        for (var i = 0, len = rows.length; i < len; i++) {
            if (rows[i].classList.contains('e-row') && !rows[i].classList.contains('e-hiddenrow')) {
                dataRows.push(rows[i]);
            }
        }
        return dataRows;
    };
    Grid.prototype.getCellFromIndex = function (rowIndex, columnIndex) {
        return this.getDataRows()[rowIndex].querySelectorAll('.e-rowcell')[columnIndex];
    };
    Grid.prototype.getColumnHeaderByIndex = function (index) {
        return this.getHeaderTable().querySelectorAll('.e-headercell')[index];
    };
    Grid.prototype.getRowObjectFromUID = function (uid) {
        for (var _i = 0, _a = this.contentModule.getRows(); _i < _a.length; _i++) {
            var row = _a[_i];
            if (row.uid === uid) {
                return row;
            }
        }
        return null;
    };
    Grid.prototype.getColumnHeaderByField = function (field) {
        return this.getColumnHeaderByUid(this.getColumnByField(field).uid);
    };
    Grid.prototype.getColumnHeaderByUid = function (uid) {
        return this.getHeaderContent().querySelector('[e-mappinguid=' + uid + ']').parentElement;
    };
    Grid.prototype.getColumnByField = function (field) {
        return iterateArrayOrObject(this.getColumns(), function (item, index) {
            if (item.field === field) {
                return item;
            }
            return undefined;
        })[0];
    };
    Grid.prototype.getColumnIndexByField = function (field) {
        var index = iterateArrayOrObject(this.getColumns(), function (item, index) {
            if (item.field === field) {
                return index;
            }
            return undefined;
        })[0];
        return !isNullOrUndefined(index) ? index : -1;
    };
    Grid.prototype.getColumnByUid = function (uid) {
        return iterateArrayOrObject(this.getColumns(), function (item, index) {
            if (item.uid === uid) {
                return item;
            }
            return undefined;
        })[0];
    };
    Grid.prototype.getColumnIndexByUid = function (uid) {
        var index = iterateArrayOrObject(this.getColumns(), function (item, index) {
            if (item.uid === uid) {
                return index;
            }
            return undefined;
        })[0];
        return !isNullOrUndefined(index) ? index : -1;
    };
    Grid.prototype.getUidByColumnField = function (field) {
        return iterateArrayOrObject(this.getColumns(), function (item, index) {
            if (item.field === field) {
                return item.uid;
            }
            return undefined;
        })[0];
    };
    Grid.prototype.getNormalizedColumnIndex = function (uid) {
        var index = this.getColumnIndexByUid(uid);
        if (this.allowGrouping) {
            index += this.groupSettings.columns.length;
        }
        if (this.isDetail()) {
            index++;
        }
        return index;
    };
    Grid.prototype.getColumnFieldNames = function () {
        var columnNames = [];
        var column;
        for (var i = 0, len = this.getColumns().length; i < len; i++) {
            column = this.getColumns()[i];
            if (column.visible) {
                columnNames.push(column.field);
            }
        }
        return columnNames;
    };
    Grid.prototype.getRowTemplate = function () {
        return this.rowTemplateFn;
    };
    Grid.prototype.getDetailTemplate = function () {
        return this.detailTemplateFn;
    };
    Grid.prototype.getPrimaryKeyFieldNames = function () {
        var keys = [];
        for (var key = 0, col = this.columns, cLen = col.length; key < cLen; key++) {
            if (col[key].isPrimaryKey) {
                keys.push(col[key].field);
            }
        }
        return keys;
    };
    Grid.prototype.refresh = function () {
        this.headerModule.refreshUI();
        this.renderModule.refresh();
    };
    Grid.prototype.refreshHeader = function () {
        this.headerModule.refreshUI();
    };
    Grid.prototype.getSelectedRows = function () {
        return this.selectionModule ? this.selectionModule.selectedRecords : [];
    };
    Grid.prototype.getSelectedRowIndexes = function () {
        return this.selectionModule ? this.selectionModule.selectedRowIndexes : [];
    };
    Grid.prototype.getSelectedRowCellIndexes = function () {
        return this.selectionModule.selectedRowCellIndexes;
    };
    Grid.prototype.getSelectedRecords = function () {
        return this.contentModule.getRows().filter(function (row) { return row.isSelected; })
            .map(function (m) { return m.data; });
    };
    Grid.prototype.getDataModule = function () {
        return this.renderModule.data;
    };
    Grid.prototype.showColumns = function (keys, showBy) {
        showBy = showBy ? showBy : 'headerText';
        this.showHider.show(keys, showBy);
    };
    Grid.prototype.hideColumns = function (keys, hideBy) {
        hideBy = hideBy ? hideBy : 'headerText';
        this.showHider.hide(keys, hideBy);
    };
    Grid.prototype.goToPage = function (pageNo) {
        this.pagerModule.goToPage(pageNo);
    };
    Grid.prototype.updateExternalMessage = function (message) {
        this.pagerModule.updateExternalMessage(message);
    };
    Grid.prototype.sortColumn = function (columnName, direction, isMultiSort) {
        this.sortModule.sortColumn(columnName, direction, isMultiSort);
    };
    Grid.prototype.clearSorting = function () {
        this.sortModule.clearSorting();
    };
    Grid.prototype.removeSortColumn = function (field) {
        this.sortModule.removeSortColumn(field);
    };
    Grid.prototype.filterByColumn = function (fieldName, filterOperator, filterValue, predicate, matchCase, actualFilterValue, actualOperator) {
        this.filterModule.filterByColumn(fieldName, filterOperator, filterValue, predicate, matchCase, actualFilterValue, actualOperator);
    };
    Grid.prototype.clearFiltering = function () {
        this.filterModule.clearFiltering();
    };
    Grid.prototype.removeFilteredColsByField = function (field, isClearFilterBar) {
        this.filterModule.removeFilteredColsByField(field, isClearFilterBar);
    };
    Grid.prototype.selectRow = function (index) {
        this.selectionModule.selectRow(index);
    };
    Grid.prototype.selectRows = function (rowIndexes) {
        this.selectionModule.selectRows(rowIndexes);
    };
    Grid.prototype.clearSelection = function () {
        this.selectionModule.clearSelection();
    };
    Grid.prototype.selectCell = function (cellIndex) {
        this.selectionModule.selectCell(cellIndex);
    };
    Grid.prototype.search = function (searchString) {
        this.searchModule.search(searchString);
    };
    Grid.prototype.print = function () {
        this.printModule.print();
    };
    Grid.prototype.deleteRecord = function (fieldname, data) {
        this.editModule.deleteRecord(fieldname, data);
    };
    Grid.prototype.startEdit = function () {
        this.editModule.startEdit();
    };
    Grid.prototype.endEdit = function () {
        this.editModule.endEdit();
    };
    Grid.prototype.closeEdit = function () {
        this.editModule.closeEdit();
    };
    Grid.prototype.addRecord = function (data) {
        this.editModule.addRecord(data);
    };
    Grid.prototype.deleteRow = function (tr) {
        this.editModule.deleteRow(tr);
    };
    Grid.prototype.recalcIndentWidth = function () {
        if (!this.getHeaderTable().querySelector('.e-emptycell')) {
            return;
        }
        if ((!this.groupSettings.columns.length && !this.isDetail()) ||
            this.getHeaderTable().querySelector('.e-emptycell').getAttribute('indentRefreshed') ||
            !this.getContentTable()) {
            return;
        }
        var indentWidth = this.getHeaderTable().querySelector('.e-emptycell').parentElement.offsetWidth;
        var headerCol = [].slice.call(this.getHeaderTable().querySelector('colgroup').childNodes);
        var contentCol = [].slice.call(this.getContentTable().querySelector('colgroup').childNodes);
        var perPixel = indentWidth / 30;
        var i = 0;
        if (perPixel >= 1) {
            indentWidth = (30 / perPixel);
        }
        if (this.enableColumnVirtualization) {
            indentWidth = 30;
        }
        while (i < this.groupSettings.columns.length) {
            headerCol[i].style.width = indentWidth + 'px';
            contentCol[i].style.width = indentWidth + 'px';
            this.notify(events.columnWidthChanged, { index: i, width: indentWidth });
            i++;
        }
        if (this.isDetail()) {
            headerCol[i].style.width = indentWidth + 'px';
            contentCol[i].style.width = indentWidth + 'px';
            this.notify(events.columnWidthChanged, { index: i, width: indentWidth });
        }
        this.getHeaderTable().querySelector('.e-emptycell').setAttribute('indentRefreshed', 'true');
    };
    Grid.prototype.reorderColumns = function (fromFName, toFName) {
        this.reorderModule.reorderColumns(fromFName, toFName);
    };
    Grid.prototype.autoFitColumns = function (fieldNames) {
        this.resizeModule.autoFitColumns(fieldNames);
    };
    Grid.prototype.createColumnchooser = function (x, y, target) {
        this.columnChooserModule.renderColumnChooser(x, y, target);
    };
    Grid.prototype.initializeServices = function () {
        this.serviceLocator.register('widthService', this.widthService = new ColumnWidthService(this));
        this.serviceLocator.register('cellRendererFactory', new CellRendererFactory);
        this.serviceLocator.register('rendererFactory', new RendererFactory);
        this.serviceLocator.register('localization', this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale));
        this.serviceLocator.register('valueFormatter', this.valueFormatterService = new ValueFormatter(this.locale));
        this.serviceLocator.register('showHideService', this.showHider = new ShowHide(this));
        this.serviceLocator.register('ariaService', this.ariaService = new AriaService());
    };
    Grid.prototype.processModel = function () {
        var gCols = this.groupSettings.columns;
        var sCols = this.sortSettings.columns;
        var flag;
        var j;
        if (this.allowGrouping) {
            var _loop_1 = function (i, len) {
                j = 0;
                for (var sLen = sCols.length; j < sLen; j++) {
                    if (sCols[j].field === gCols[i]) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    sCols.push({ field: gCols[i], direction: 'ascending' });
                }
                else {
                    if (this_1.allowSorting) {
                        this_1.sortedColumns.push(sCols[j].field);
                    }
                    else {
                        sCols[j].direction = 'ascending';
                    }
                }
                if (!this_1.groupSettings.showGroupedColumn) {
                    var column = this_1.enableColumnVirtualization ?
                        this_1.columns.filter(function (c) { return c.field === gCols[i]; })[0] : this_1.getColumnByField(gCols[i]);
                    column.visible = false;
                }
            };
            var this_1 = this;
            for (var i = 0, len = gCols.length; i < len; i++) {
                _loop_1(i, len);
            }
        }
        this.rowTemplateFn = templateCompiler(this.rowTemplate);
        this.detailTemplateFn = templateCompiler(this.detailTemplate);
        if (!isNullOrUndefined(this.parentDetails)) {
            var value = isNullOrUndefined(this.parentDetails.parentKeyFieldValue) ? 'undefined' :
                this.parentDetails.parentKeyFieldValue;
            this.query.where(this.queryString, 'equal', value, true);
        }
    };
    Grid.prototype.gridRender = function () {
        this.updateRTL();
        if (this.enableHover) {
            this.element.classList.add('e-gridhover');
        }
        if (Browser.isDevice) {
            this.element.classList.add('e-device');
        }
        classList(this.element, ['e-responsive', 'e-default'], []);
        var rendererFactory = this.serviceLocator.getService('rendererFactory');
        this.headerModule = rendererFactory.getRenderer(RenderType.Header);
        this.contentModule = rendererFactory.getRenderer(RenderType.Content);
        this.printModule = new Print(this, this.scrollModule);
        this.renderModule.render();
        this.eventInitializer();
        this.createGridPopUpElement();
        this.widthService.setWidthToColumns();
        this.updateGridLines();
        this.applyTextWrap();
    };
    Grid.prototype.dataReady = function () {
        this.scrollModule.setWidth();
        this.scrollModule.setHeight();
        if (this.height !== 'auto') {
            this.scrollModule.setPadding();
        }
    };
    Grid.prototype.updateRTL = function () {
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        }
        else {
            this.element.classList.remove('e-rtl');
        }
    };
    Grid.prototype.createGridPopUpElement = function () {
        var popup = createElement('div', { className: 'e-gridpopup', styles: 'display:none;' });
        var content = createElement('div', { className: 'e-content', attrs: { tabIndex: '-1' } });
        append([content, createElement('div', { className: 'e-uptail e-tail' })], popup);
        content.appendChild(createElement('span'));
        append([content, createElement('div', { className: 'e-downtail e-tail' })], popup);
        this.element.appendChild(popup);
    };
    Grid.prototype.updateGridLines = function () {
        classList(this.element, [], ['e-verticallines', 'e-horizontallines', 'e-hidelines', 'e-bothlines']);
        switch (this.gridLines) {
            case 'horizontal':
                this.element.classList.add('e-horizontallines');
                break;
            case 'vertical':
                this.element.classList.add('e-verticallines');
                break;
            case 'none':
                this.element.classList.add('e-hidelines');
                break;
            case 'both':
                this.element.classList.add('e-bothlines');
                break;
        }
    };
    Grid.prototype.applyTextWrap = function () {
        if (this.allowTextWrap) {
            var headerRows = [].slice.call(this.element.querySelectorAll('.e-columnheader'));
            switch (this.textWrapSettings.wrapMode) {
                case 'header':
                    wrap(this.element, false);
                    wrap(this.getContent(), false);
                    wrap(headerRows, true);
                    break;
                case 'content':
                    wrap(this.getContent(), true);
                    wrap(this.element, false);
                    wrap(headerRows, false);
                    break;
                default:
                    wrap(this.element, true);
                    wrap(this.getContent(), false);
                    wrap(headerRows, false);
            }
        }
    };
    Grid.prototype.removeTextWrap = function () {
        wrap(this.element, false);
        var headerRows = [].slice.call(this.element.querySelectorAll('.e-columnheader'));
        wrap(headerRows, false);
        wrap(this.getContent(), false);
    };
    Grid.prototype.wireEvents = function () {
        EventHandler.add(this.element, 'click', this.mouseClickHandler, this);
        EventHandler.add(this.element, 'touchend', this.mouseClickHandler, this);
        EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
        EventHandler.add(this.getContent(), 'dblclick', this.dblClickHandler, this);
        if (this.allowKeyboard) {
            this.element.tabIndex = this.element.tabIndex === -1 ? 0 : this.element.tabIndex;
        }
        this.keyboardModule = new KeyboardEvents(this.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
    };
    Grid.prototype.unwireEvents = function () {
        EventHandler.remove(this.element, 'click', this.mouseClickHandler);
        EventHandler.remove(this.element, 'touchend', this.mouseClickHandler);
        EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
    };
    Grid.prototype.addListener = function () {
        if (this.isDestroyed) {
            return;
        }
        this.on(events.dataReady, this.dataReady, this);
        this.on(events.contentReady, this.recalcIndentWidth, this);
        this.on(events.headerRefreshed, this.recalcIndentWidth, this);
        this.addEventListener(events.dataBound, this.refreshMediaCol.bind(this));
    };
    Grid.prototype.removeListener = function () {
        if (this.isDestroyed) {
            return;
        }
        this.off(events.dataReady, this.dataReady);
        this.off(events.contentReady, this.recalcIndentWidth);
        this.off(events.headerRefreshed, this.recalcIndentWidth);
        this.removeEventListener(events.dataBound, this.refreshMediaCol);
    };
    Grid.prototype.getCurrentViewRecords = function () {
        return (this.allowGrouping && this.groupSettings.columns.length) ?
            this.currentViewData.records : this.currentViewData;
    };
    Grid.prototype.mouseClickHandler = function (e) {
        if (this.isChildGrid(e) || (parentsUntil(e.target, 'e-gridpopup') && e.touches) ||
            this.element.querySelectorAll('.e-cloneproperties').length || this.checkEdit(e)) {
            return;
        }
        if (((!this.allowRowDragAndDrop && parentsUntil(e.target, 'e-gridcontent')) ||
            (!(this.allowGrouping || this.allowReordering) && parentsUntil(e.target, 'e-gridheader'))) && e.touches) {
            return;
        }
        if (parentsUntil(e.target, 'e-gridheader') && this.allowRowDragAndDrop) {
            e.preventDefault();
        }
        this.notify(events.click, e);
    };
    Grid.prototype.checkEdit = function (e) {
        var tr = parentsUntil(e.target, 'e-row');
        var isEdit = this.editSettings.mode !== 'batch' &&
            this.isEdit && tr && (tr.classList.contains('e-editedrow') || tr.classList.contains('e-addedrow'));
        return isEdit || (parentsUntil(e.target, 'e-rowcell') &&
            parentsUntil(e.target, 'e-rowcell').classList.contains('e-editedbatchcell'));
    };
    Grid.prototype.dblClickHandler = function (e) {
        if (parentsUntil(e.target, 'e-grid').id !== this.element.id) {
            return;
        }
        this.notify(events.dblclick, e);
    };
    Grid.prototype.focusOutHandler = function (e) {
        if (this.isChildGrid(e)) {
            return;
        }
        if (!parentsUntil(e.target, 'e-grid')) {
            this.element.querySelector('.e-gridpopup').style.display = 'none';
        }
        var filterClear = this.element.querySelector('.e-cancel:not(.e-hide)');
        if (filterClear) {
            filterClear.classList.add('e-hide');
        }
    };
    Grid.prototype.isChildGrid = function (e) {
        var gridElement = parentsUntil(e.target, 'e-grid');
        if (gridElement && gridElement.id !== this.element.id) {
            return true;
        }
        return false;
    };
    Grid.prototype.isDetail = function () {
        return !isNullOrUndefined(this.detailTemplate) || !isNullOrUndefined(this.childGrid);
    };
    Grid.prototype.keyActionHandler = function (e) {
        if (this.isChildGrid(e) ||
            (this.isEdit && e.action !== 'escape' && e.action !== 'enter' && e.action !== 'tab' && e.action !== 'shiftTab')) {
            return;
        }
        if (this.allowKeyboard) {
            if (e.action === 'ctrlPlusP') {
                e.preventDefault();
                this.print();
            }
            this.notify(events.keyPressed, e);
        }
    };
    Grid.prototype.setInjectedModules = function (modules) {
        this.injectedModules = modules;
    };
    Grid.prototype.updateColumnObject = function () {
        prepareColumns(this.columns, this.enableColumnVirtualization);
        if (this.editSettings.allowEditing || this.editSettings.allowAdding || this.editSettings.allowDeleting) {
            this.notify(events.autoCol, {});
        }
    };
    Grid.prototype.refreshColumns = function () {
        this.updateColumnObject();
        this.refresh();
    };
    Grid.prototype.excelExport = function (exportProperties, isMultipleExport, workbook) {
        return this.excelExportModule.Map(this, exportProperties, isMultipleExport, workbook, false);
    };
    Grid.prototype.csvExport = function (exportProperties, isMultipleExport, workbook) {
        return this.excelExportModule.Map(this, exportProperties, isMultipleExport, workbook, true);
    };
    Grid.prototype.pdfExport = function (exportProperties, isMultipleExport, pdfDoc) {
        return this.pdfExportModule.Map(this, exportProperties, isMultipleExport, pdfDoc);
    };
    return Grid;
}(Component));
__decorate([
    Property([])
], Grid.prototype, "columns", void 0);
__decorate([
    Property(true)
], Grid.prototype, "enableAltRow", void 0);
__decorate([
    Property(true)
], Grid.prototype, "enableHover", void 0);
__decorate([
    Property(true)
], Grid.prototype, "allowKeyboard", void 0);
__decorate([
    Property(false)
], Grid.prototype, "allowTextWrap", void 0);
__decorate([
    Complex({}, TextWrapSettings)
], Grid.prototype, "textWrapSettings", void 0);
__decorate([
    Property(false)
], Grid.prototype, "allowPaging", void 0);
__decorate([
    Complex({}, PageSettings)
], Grid.prototype, "pageSettings", void 0);
__decorate([
    Property(false)
], Grid.prototype, "enableVirtualization", void 0);
__decorate([
    Property(false)
], Grid.prototype, "enableColumnVirtualization", void 0);
__decorate([
    Complex({}, SearchSettings)
], Grid.prototype, "searchSettings", void 0);
__decorate([
    Property(false)
], Grid.prototype, "allowSorting", void 0);
__decorate([
    Property(false)
], Grid.prototype, "allowExcelExport", void 0);
__decorate([
    Property(false)
], Grid.prototype, "allowPdfExport", void 0);
__decorate([
    Complex({}, SortSettings)
], Grid.prototype, "sortSettings", void 0);
__decorate([
    Property(true)
], Grid.prototype, "allowSelection", void 0);
__decorate([
    Property(-1)
], Grid.prototype, "selectedRowIndex", void 0);
__decorate([
    Complex({}, SelectionSettings)
], Grid.prototype, "selectionSettings", void 0);
__decorate([
    Property(false)
], Grid.prototype, "allowFiltering", void 0);
__decorate([
    Property(false)
], Grid.prototype, "allowReordering", void 0);
__decorate([
    Property(false)
], Grid.prototype, "allowResizing", void 0);
__decorate([
    Property(false)
], Grid.prototype, "allowRowDragAndDrop", void 0);
__decorate([
    Complex({}, RowDropSettings)
], Grid.prototype, "rowDropSettings", void 0);
__decorate([
    Complex({}, FilterSettings)
], Grid.prototype, "filterSettings", void 0);
__decorate([
    Property(false)
], Grid.prototype, "allowGrouping", void 0);
__decorate([
    Complex({}, GroupSettings)
], Grid.prototype, "groupSettings", void 0);
__decorate([
    Complex({}, EditSettings)
], Grid.prototype, "editSettings", void 0);
__decorate([
    Collection([], AggregateRow)
], Grid.prototype, "aggregates", void 0);
__decorate([
    Property(false)
], Grid.prototype, "showColumnChooser", void 0);
__decorate([
    Property('auto')
], Grid.prototype, "height", void 0);
__decorate([
    Property('auto')
], Grid.prototype, "width", void 0);
__decorate([
    Property('default')
], Grid.prototype, "gridLines", void 0);
__decorate([
    Property()
], Grid.prototype, "rowTemplate", void 0);
__decorate([
    Property()
], Grid.prototype, "detailTemplate", void 0);
__decorate([
    Property()
], Grid.prototype, "childGrid", void 0);
__decorate([
    Property()
], Grid.prototype, "queryString", void 0);
__decorate([
    Property('allpages')
], Grid.prototype, "printMode", void 0);
__decorate([
    Property([])
], Grid.prototype, "dataSource", void 0);
__decorate([
    Property()
], Grid.prototype, "query", void 0);
__decorate([
    Property()
], Grid.prototype, "toolbar", void 0);
__decorate([
    Property()
], Grid.prototype, "toolbarTemplate", void 0);
__decorate([
    Event()
], Grid.prototype, "created", void 0);
__decorate([
    Event()
], Grid.prototype, "destroyed", void 0);
__decorate([
    Event()
], Grid.prototype, "load", void 0);
__decorate([
    Event()
], Grid.prototype, "rowDataBound", void 0);
__decorate([
    Event()
], Grid.prototype, "queryCellInfo", void 0);
__decorate([
    Event()
], Grid.prototype, "actionBegin", void 0);
__decorate([
    Event()
], Grid.prototype, "actionComplete", void 0);
__decorate([
    Event()
], Grid.prototype, "actionFailure", void 0);
__decorate([
    Event()
], Grid.prototype, "dataBound", void 0);
__decorate([
    Event()
], Grid.prototype, "rowSelecting", void 0);
__decorate([
    Event()
], Grid.prototype, "rowSelected", void 0);
__decorate([
    Event()
], Grid.prototype, "rowDeselecting", void 0);
__decorate([
    Event()
], Grid.prototype, "rowDeselected", void 0);
__decorate([
    Event()
], Grid.prototype, "cellSelecting", void 0);
__decorate([
    Event()
], Grid.prototype, "cellSelected", void 0);
__decorate([
    Event()
], Grid.prototype, "cellDeselecting", void 0);
__decorate([
    Event()
], Grid.prototype, "cellDeselected", void 0);
__decorate([
    Event()
], Grid.prototype, "columnDragStart", void 0);
__decorate([
    Event()
], Grid.prototype, "columnDrag", void 0);
__decorate([
    Event()
], Grid.prototype, "columnDrop", void 0);
__decorate([
    Event()
], Grid.prototype, "printComplete", void 0);
__decorate([
    Event()
], Grid.prototype, "beforePrint", void 0);
__decorate([
    Event()
], Grid.prototype, "pdfQueryCellInfo", void 0);
__decorate([
    Event()
], Grid.prototype, "excelQueryCellInfo", void 0);
__decorate([
    Event()
], Grid.prototype, "detailDataBound", void 0);
__decorate([
    Event()
], Grid.prototype, "rowDragStart", void 0);
__decorate([
    Event()
], Grid.prototype, "rowDrag", void 0);
__decorate([
    Event()
], Grid.prototype, "rowDrop", void 0);
__decorate([
    Event()
], Grid.prototype, "toolbarClick", void 0);
__decorate([
    Event()
], Grid.prototype, "beforeOpenColumnChooser", void 0);
__decorate([
    Event()
], Grid.prototype, "batchAdd", void 0);
__decorate([
    Event()
], Grid.prototype, "batchDelete", void 0);
__decorate([
    Event()
], Grid.prototype, "beforeBatchAdd", void 0);
__decorate([
    Event()
], Grid.prototype, "beforeBatchDelete", void 0);
__decorate([
    Event()
], Grid.prototype, "beforeBatchSave", void 0);
__decorate([
    Event()
], Grid.prototype, "beginEdit", void 0);
__decorate([
    Event()
], Grid.prototype, "cellEdit", void 0);
__decorate([
    Event()
], Grid.prototype, "cellSave", void 0);
__decorate([
    Event()
], Grid.prototype, "resizeStart", void 0);
__decorate([
    Event()
], Grid.prototype, "onResize", void 0);
__decorate([
    Event()
], Grid.prototype, "resizeStop", void 0);
__decorate([
    Event()
], Grid.prototype, "beforeDataBound", void 0);
Grid = __decorate([
    NotifyPropertyChanges
], Grid);
export { Grid };
Grid.Inject(Selection);
