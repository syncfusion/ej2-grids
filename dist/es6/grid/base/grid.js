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
import { Component, ChildProperty, Browser, closest, extend } from '@syncfusion/ej2-base';
import { isNullOrUndefined, setValue } from '@syncfusion/ej2-base';
import { createElement, addClass, removeClass, append, classList } from '@syncfusion/ej2-base';
import { Property, Collection, Complex, Event, NotifyPropertyChanges, L10n } from '@syncfusion/ej2-base';
import { EventHandler, KeyboardEvents } from '@syncfusion/ej2-base';
import { createSpinner, hideSpinner, showSpinner, Tooltip } from '@syncfusion/ej2-popups';
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
import { FocusStrategy } from '../services/focus-strategy';
import { PageSettings } from '../models/page-settings';
import { Selection } from '../actions/selection';
import { Search } from '../actions/search';
import { ShowHide } from '../actions/show-hide';
import { Scroll } from '../actions/scroll';
import { Print } from '../actions/print';
import { AggregateRow } from '../models/aggregate';
import { ColumnChooser } from '../actions/column-chooser';
import { Clipboard } from '../actions/clipboard';
/**
 * Represents the field name and direction of sort column.
 */
var SortDescriptor = /** @class */ (function (_super) {
    __extends(SortDescriptor, _super);
    function SortDescriptor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], SortDescriptor.prototype, "field", void 0);
    __decorate([
        Property()
    ], SortDescriptor.prototype, "direction", void 0);
    return SortDescriptor;
}(ChildProperty));
export { SortDescriptor };
/**
 * Configures the sorting behavior of Grid.
 */
var SortSettings = /** @class */ (function (_super) {
    __extends(SortSettings, _super);
    function SortSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Collection([], SortDescriptor)
    ], SortSettings.prototype, "columns", void 0);
    __decorate([
        Property(true)
    ], SortSettings.prototype, "allowUnsort", void 0);
    return SortSettings;
}(ChildProperty));
export { SortSettings };
/**
 * Represents the predicate for filter column.
 */
var Predicate = /** @class */ (function (_super) {
    __extends(Predicate, _super);
    function Predicate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
    __decorate([
        Property()
    ], Predicate.prototype, "type", void 0);
    __decorate([
        Property()
    ], Predicate.prototype, "ejpredicate", void 0);
    __decorate([
        Property()
    ], Predicate.prototype, "matchcase", void 0);
    __decorate([
        Property()
    ], Predicate.prototype, "ignoreCase", void 0);
    return Predicate;
}(ChildProperty));
export { Predicate };
/**
 * Configures the filtering behavior of Grid..
 */
var FilterSettings = /** @class */ (function (_super) {
    __extends(FilterSettings, _super);
    function FilterSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
    __decorate([
        Property()
    ], FilterSettings.prototype, "operators", void 0);
    return FilterSettings;
}(ChildProperty));
export { FilterSettings };
/**
 * Configures the selection behavior of Grid.
 */
var SelectionSettings = /** @class */ (function (_super) {
    __extends(SelectionSettings, _super);
    function SelectionSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('row')
    ], SelectionSettings.prototype, "mode", void 0);
    __decorate([
        Property('flow')
    ], SelectionSettings.prototype, "cellSelectionMode", void 0);
    __decorate([
        Property('single')
    ], SelectionSettings.prototype, "type", void 0);
    __decorate([
        Property(false)
    ], SelectionSettings.prototype, "checkboxOnly", void 0);
    __decorate([
        Property(false)
    ], SelectionSettings.prototype, "persistSelection", void 0);
    return SelectionSettings;
}(ChildProperty));
export { SelectionSettings };
/**
 * Configures the search behavior of Grid.
 */
var SearchSettings = /** @class */ (function (_super) {
    __extends(SearchSettings, _super);
    function SearchSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
    return SearchSettings;
}(ChildProperty));
export { SearchSettings };
/**
 * Configures the row drop settings of the Grid.
 */
var RowDropSettings = /** @class */ (function (_super) {
    __extends(RowDropSettings, _super);
    function RowDropSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], RowDropSettings.prototype, "targetID", void 0);
    return RowDropSettings;
}(ChildProperty));
export { RowDropSettings };
/**
 * Configures the text wrap settings of the Grid.
 */
var TextWrapSettings = /** @class */ (function (_super) {
    __extends(TextWrapSettings, _super);
    function TextWrapSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('both')
    ], TextWrapSettings.prototype, "wrapMode", void 0);
    return TextWrapSettings;
}(ChildProperty));
export { TextWrapSettings };
/**
 * Configures the group behavior of the Grid.
 */
var GroupSettings = /** @class */ (function (_super) {
    __extends(GroupSettings, _super);
    function GroupSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
    __decorate([
        Property()
    ], GroupSettings.prototype, "captionTemplate", void 0);
    return GroupSettings;
}(ChildProperty));
export { GroupSettings };
/**
 * Configures the edit behavior of the Grid.
 */
var EditSettings = /** @class */ (function (_super) {
    __extends(EditSettings, _super);
    function EditSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
    return EditSettings;
}(ChildProperty));
export { EditSettings };
/**
 * Represents the Grid component.
 * ```html
 * <div id="grid"></div>
 * <script>
 *  var gridObj = new Grid({ allowPaging: true });
 *  gridObj.appendTo("#grid");
 * </script>
 * ```
 */
var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    /**
     * Constructor for creating the component
     * @hidden
     */
    function Grid(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.isInitial = true;
        _this.sortedColumns = [];
        _this.inViewIndexes = [];
        _this.mediaCol = [];
        _this.isMediaQuery = false;
        _this.isInitialLoad = false;
        _this.freezeRefresh = Component.prototype.refresh;
        /**
         * @hidden
         */
        _this.mergeCells = {};
        /** @hidden */
        _this.isEdit = false;
        /** @hidden */
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
            // Toolbar Items
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
            Save: 'Save',
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
            Matchs: 'No Matches Found',
            FilterButton: 'Filter',
            ClearButton: 'Clear',
            StartsWith: 'StartsWith',
            EndsWith: 'EndsWith',
            Contains: 'Contains',
            Equal: 'Equal',
            NotEqual: 'NotEqual',
            LessThan: 'LessThan',
            LessThanOrEqual: 'LessThanOrEqual',
            GreaterThan: 'GreaterThan',
            GreaterThanOrEqual: 'GreaterThanOrEqual',
            ChooseDate: 'Choose a Date',
            EnterValue: 'Enter the value',
            Copy: 'Copy',
            Group: 'Group by this column',
            Ungroup: 'Ungroup by this column',
            autoFitAll: 'Auto Fit all columns',
            autoFit: 'Auto Fit this column',
            Export: 'Export',
            FirstPage: 'First Page',
            LastPage: 'Last Page',
            PreviousPage: 'Previous Page',
            NextPage: 'Next Page',
            SortAscending: 'Sort Ascending',
            SortDescending: 'Sort Descending',
            EditRecord: 'Edit Record',
            DeleteRecord: 'Delete Record',
            FilterMenu: 'Filter',
            Columnchooser: 'Columns'
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
            ctrlEnter: 'ctrl+enter',
            shiftEnter: 'shift+enter',
            tab: 'tab',
            shiftTab: 'shift+tab',
            space: 'space',
            ctrlPlusC: 'ctrl+C',
            ctrlShiftPlusH: 'ctrl+shift+H'
        };
        setValue('mergePersistData', _this.mergePersistGridData, _this);
        return _this;
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     * @hidden
     */
    Grid.prototype.getPersistData = function () {
        var _this = this;
        var keyEntity = ['pageSettings', 'sortSettings',
            'filterSettings', 'groupSettings', 'columns', 'searchSettings', 'selectedRowIndex'];
        var ignoreOnPersist = {
            pageSettings: ['template', 'pageSizes', 'enableQueryString', 'totalRecordsCount', 'pageCount'],
            filterSettings: ['type', 'mode', 'showFilterBarStatus', 'immediateModeDelay'],
            groupSettings: ['showDropArea', 'showToggleButton', 'showGroupedColumn', 'showUngroupButton',
                'disablePageWiseAggregates', 'hideCaptionCount'],
            searchSettings: ['fields', 'operator', 'ignoreCase'],
            sortSettings: [], columns: [], selectedRowIndex: []
        };
        var ignoreOnColumn = ['filter', 'edit', 'filterBarTemplate', 'headerTemplate', 'template',
            'commandTemplate', 'commands'];
        keyEntity.forEach(function (value) {
            var currentObject = _this[value];
            for (var _i = 0, _a = ignoreOnPersist[value]; _i < _a.length; _i++) {
                var val = _a[_i];
                delete currentObject[val];
            }
        });
        this.ignoreInArrays(ignoreOnColumn, this.columns);
        return this.addOnPersist(keyEntity);
    };
    Grid.prototype.ignoreInArrays = function (ignoreOnColumn, columns) {
        var _this = this;
        columns.forEach(function (column) {
            if (column.columns) {
                _this.ignoreInColumn(ignoreOnColumn, column);
                _this.ignoreInArrays(ignoreOnColumn, column.columns);
            }
            else {
                _this.ignoreInColumn(ignoreOnColumn, column);
            }
        });
    };
    Grid.prototype.ignoreInColumn = function (ignoreOnColumn, column) {
        ignoreOnColumn.forEach(function (val) {
            delete column[val];
        });
    };
    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
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
                args: [this, this.sortSettings, this.sortedColumns, this.serviceLocator]
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
                args: [this, this.serviceLocator]
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
        if (this.frozenColumns || this.frozenRows) {
            modules.push({ member: 'freeze', args: [this, this.serviceLocator] });
        }
        if (this.editSettings.allowAdding || this.editSettings.allowDeleting || this.editSettings.allowEditing) {
            modules.push({
                member: 'edit',
                args: [this, this.serviceLocator]
            });
        }
        this.extendRequiredModules(modules);
        return modules;
    };
    Grid.prototype.extendRequiredModules = function (modules) {
        if (this.isCommandColumn(this.columns)) {
            modules.push({
                member: 'commandColumn',
                args: [this, this.serviceLocator]
            });
        }
        if (this.contextMenuItems) {
            modules.push({
                member: 'contextMenu',
                args: [this, this.serviceLocator]
            });
        }
        if (this.showColumnMenu) {
            modules.push({
                member: 'columnMenu',
                args: [this, this.serviceLocator]
            });
        }
    };
    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    Grid.prototype.preRender = function () {
        this.serviceLocator = new ServiceLocator;
        this.initializeServices();
    };
    /**
     * For internal use only - To Initialize the component rendering.
     * @private
     */
    Grid.prototype.render = function () {
        this.ariaService.setOptions(this.element, { role: 'grid' });
        createSpinner({ target: this.element });
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
        this.showSpinner();
        this.notify(events.initialEnd, {});
    };
    /**
     * Method used to show the spinner.
     */
    Grid.prototype.showSpinner = function () {
        showSpinner(this.element);
    };
    /**
     * Method used to hide the spinner.
     */
    Grid.prototype.hideSpinner = function () {
        hideSpinner(this.element);
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
    /**
     * @hidden
     */
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
    /**
     * For internal use only - Initialize the event handler
     * @private
     */
    Grid.prototype.eventInitializer = function () {
        //eventInitializer
    };
    /**
     * To destroy the component(Detaches/removes all event handlers, attributes, classes and empty the component element).
     * @method destroy
     * @return {void}
     */
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
        this.focusModule.destroy();
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Grid.prototype.getModuleName = function () {
        return 'grid';
    };
    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
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
                    this.notify(events.uiUpdate, { module: 'scroll', properties: { width: newProp.width, height: newProp.height } });
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
                case 'frozenColumns':
                case 'frozenRows':
                    this.freezeRefresh();
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
                if (this.contextMenuItems) {
                    this.contextMenuModule.getContextMenu().ej2_instances[0].enableRtl = newProp.enableRtl;
                    this.contextMenuModule.getContextMenu().ej2_instances[0].dataBind();
                }
                if (this.showColumnMenu) {
                    this.columnMenuModule.getColumnMenu().ej2_instances[0].enableRtl = newProp.enableRtl;
                    this.columnMenuModule.getColumnMenu().ej2_instances[0].dataBind();
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
                this.notify(events.freezeRender, { case: 'textwrap', isModeChg: (prop === 'textWrapSettings') });
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
    /**
     * Gets the columns from Grid.
     * @return {Column[]}
     */
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
    /**
     * @private
     */
    Grid.prototype.getColumnIndexesInView = function () {
        return this.inViewIndexes;
    };
    /**
     * @private
     */
    Grid.prototype.getLocaleConstants = function () {
        return this.defaultLocale;
    };
    /**
     * @private
     */
    Grid.prototype.setColumnIndexesInView = function (indexes) {
        this.inViewIndexes = indexes;
    };
    /**
     * Gets the visible columns from Grid.
     * @return {Column[]}
     */
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
    /**
     * Gets the header div of Grid.
     * @return {Element}
     */
    Grid.prototype.getHeaderContent = function () {
        return this.headerModule.getPanel();
    };
    /**
     * Sets the header div of Grid to replace the old header.
     * @param  {Element} element - Specifies the Grid header.
     * @return {void}
     */
    Grid.prototype.setGridHeaderContent = function (element) {
        this.headerModule.setPanel(element);
    };
    /**
     * Gets the content table of Grid.
     * @return {Element}
     */
    Grid.prototype.getContentTable = function () {
        return this.contentModule.getTable();
    };
    /**
     * Sets the content table of Grid to replace old content table.
     * @param  {Element} element - Specifies the Grid content table.
     * @return {void}
     */
    Grid.prototype.setGridContentTable = function (element) {
        this.contentModule.setTable(element);
    };
    /**
     * Gets the content div of Grid.
     * @return {Element}
     */
    Grid.prototype.getContent = function () {
        return this.contentModule.getPanel();
    };
    /**
     * Sets the content div of Grid to replace the old Grid content.
     * @param  {Element} element - Specifies the Grid content.
     * @return {void}
     */
    Grid.prototype.setGridContent = function (element) {
        this.contentModule.setPanel(element);
    };
    /**
     * Gets the header table element of Grid.
     * @return {Element}
     */
    Grid.prototype.getHeaderTable = function () {
        return this.headerModule.getTable();
    };
    /**
     * Sets the header table of Grid to replace old header table.
     * @param  {Element} element - Specifies the Grid header table.
     * @return {void}
     */
    Grid.prototype.setGridHeaderTable = function (element) {
        this.headerModule.setTable(element);
    };
    /**
     * Gets the footer div of Grid.
     * @return {Element}
     */
    Grid.prototype.getFooterContent = function () {
        if (isNullOrUndefined(this.footerElement)) {
            this.footerElement = this.element.getElementsByClassName('e-gridfooter')[0];
        }
        return this.footerElement;
    };
    /**
     * Gets the footer table element of Grid.
     * @return {Element}
     */
    Grid.prototype.getFooterContentTable = function () {
        if (isNullOrUndefined(this.footerElement)) {
            this.footerElement = this.element.getElementsByClassName('e-gridfooter')[0];
        }
        return this.footerElement.firstChild.firstChild;
    };
    /**
     * Gets the pager of Grid.
     * @return {Element}
     */
    Grid.prototype.getPager = function () {
        return this.gridPager; //get element from pager
    };
    /**
     * Sets the pager of Grid to replace old pager.
     * @param  {Element} element - Specifies the Grid pager.
     * @return {void}
     */
    Grid.prototype.setGridPager = function (element) {
        this.gridPager = element;
    };
    /**
     * Gets a row by index.
     * @param  {number} index - Specifies the row index.
     * @return {Element}
     */
    Grid.prototype.getRowByIndex = function (index) {
        return this.contentModule.getRowByIndex(index);
    };
    /**
     * Gets all the Grid's content rows.
     * @return {Element[]}
     */
    Grid.prototype.getRows = function () {
        return this.contentModule.getRowElements();
    };
    /**
     * Get a row information based on cell
     * @param {Element}
     * @return RowInfo
     */
    Grid.prototype.getRowInfo = function (target) {
        var ele = target;
        var args = {};
        if (!isNullOrUndefined(target) && isNullOrUndefined(parentsUntil(ele, 'e-detailrowcollapse')
            && isNullOrUndefined(parentsUntil(ele, 'e-recordplusexpand')))) {
            var cell = closest(ele, '.e-rowcell');
            if (!isNullOrUndefined(cell)) {
                var cellIndex = parseInt(cell.getAttribute('aria-colindex'), 10);
                var row_1 = closest(cell, '.e-row');
                var rowIndex = parseInt(row_1.getAttribute('aria-rowindex'), 10);
                var rowsObject = this.contentModule.getRows().filter(function (r) {
                    return r.uid === row_1.getAttribute('data-uid');
                });
                var rowData = rowsObject[0].data;
                var column = rowsObject[0].cells[cellIndex].column;
                args = { cell: cell, cellIndex: cellIndex, row: row_1, rowIndex: rowIndex, rowData: rowData, column: column };
            }
        }
        return args;
    };
    /**
     * Gets all the Grid's data rows.
     * @return {Element[]}
     */
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
    /**
     * Gets a cell by row and column index.
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @return {Element}
     */
    Grid.prototype.getCellFromIndex = function (rowIndex, columnIndex) {
        return this.getDataRows()[rowIndex].querySelectorAll('.e-rowcell')[columnIndex];
    };
    /**
     * Gets a column header by column index.
     * @param  {number} index - Specifies the column index.
     * @return {Element}
     */
    Grid.prototype.getColumnHeaderByIndex = function (index) {
        return this.getHeaderTable().querySelectorAll('.e-headercell')[index];
    };
    /**
     * @hidden
     */
    Grid.prototype.getRowObjectFromUID = function (uid) {
        for (var _i = 0, _a = this.contentModule.getRows(); _i < _a.length; _i++) {
            var row = _a[_i];
            if (row.uid === uid) {
                return row;
            }
        }
        return null;
    };
    /**
     * @hidden
     */
    Grid.prototype.getRowsObject = function () {
        return this.contentModule.getRows();
    };
    /**
     * Gets a column header by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Element}
     */
    Grid.prototype.getColumnHeaderByField = function (field) {
        return this.getColumnHeaderByUid(this.getColumnByField(field).uid);
    };
    /**
     * Gets a column header by uid.
     * @param  {string} field - Specifies the column uid.
     * @return {Element}
     */
    Grid.prototype.getColumnHeaderByUid = function (uid) {
        return this.getHeaderContent().querySelector('[e-mappinguid=' + uid + ']').parentElement;
    };
    /**
     * Gets a Column by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Column}
     */
    Grid.prototype.getColumnByField = function (field) {
        return iterateArrayOrObject(this.getColumns(), function (item, index) {
            if (item.field === field) {
                return item;
            }
            return undefined;
        })[0];
    };
    /**
     * Gets a column index by column name.
     * @param  {string} field - Specifies the column name.
     * @return {number}
     */
    Grid.prototype.getColumnIndexByField = function (field) {
        var index = iterateArrayOrObject(this.getColumns(), function (item, index) {
            if (item.field === field) {
                return index;
            }
            return undefined;
        })[0];
        return !isNullOrUndefined(index) ? index : -1;
    };
    /**
     * Gets a column by uid.
     * @param  {string} uid - Specifies the column uid.
     * @return {Column}
     */
    Grid.prototype.getColumnByUid = function (uid) {
        return iterateArrayOrObject(this.getColumns(), function (item, index) {
            if (item.uid === uid) {
                return item;
            }
            return undefined;
        })[0];
    };
    /**
     * Gets a column index by uid.
     * @param  {string} uid - Specifies the column uid.
     * @return {number}
     */
    Grid.prototype.getColumnIndexByUid = function (uid) {
        var index = iterateArrayOrObject(this.getColumns(), function (item, index) {
            if (item.uid === uid) {
                return index;
            }
            return undefined;
        })[0];
        return !isNullOrUndefined(index) ? index : -1;
    };
    /**
     * Gets uid by column name.
     * @param  {string} field - Specifies the column name.
     * @return {string}
     */
    Grid.prototype.getUidByColumnField = function (field) {
        return iterateArrayOrObject(this.getColumns(), function (item, index) {
            if (item.field === field) {
                return item.uid;
            }
            return undefined;
        })[0];
    };
    /**
     * Gets TH index by column uid value.
     * @private
     * @param  {string} uid - Specifies the column uid.
     * @return {number}
     */
    Grid.prototype.getNormalizedColumnIndex = function (uid) {
        var index = this.getColumnIndexByUid(uid);
        if (this.allowGrouping) {
            index += this.groupSettings.columns.length;
        }
        if (this.isDetail()) {
            index++;
        }
        /**
         * TODO: index normalization based on the stacked header, grouping and detailTemplate
         * and frozen should be handled here
         */
        return index;
    };
    /**
     * Gets the collection of column fields.
     * @return {string[]}
     */
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
    /**
     * Gets a compiled row template.
     * @return {Function}
     * @private
     */
    Grid.prototype.getRowTemplate = function () {
        return this.rowTemplateFn;
    };
    /**
     * Gets a compiled detail row template.
     * @private
     * @return {Function}
     */
    Grid.prototype.getDetailTemplate = function () {
        return this.detailTemplateFn;
    };
    /**
     * Get the names of primary key columns in Grid.
     * @return {string[]}
     */
    Grid.prototype.getPrimaryKeyFieldNames = function () {
        var keys = [];
        for (var key = 0, col = this.columns, cLen = col.length; key < cLen; key++) {
            if (col[key].isPrimaryKey) {
                keys.push(col[key].field);
            }
        }
        return keys;
    };
    /**
     * Refreshes the Grid header and content.
     */
    Grid.prototype.refresh = function () {
        this.headerModule.refreshUI();
        this.renderModule.refresh();
    };
    /**
     * Refreshes the Grid header.
     */
    Grid.prototype.refreshHeader = function () {
        this.headerModule.refreshUI();
    };
    /**
     * Gets the collection of selected rows.
     * @return {Element[]}
     */
    Grid.prototype.getSelectedRows = function () {
        return this.selectionModule ? this.selectionModule.selectedRecords : [];
    };
    /**
     * Gets the collection of selected row indexes.
     * @return {number[]}
     */
    Grid.prototype.getSelectedRowIndexes = function () {
        return this.selectionModule ? this.selectionModule.selectedRowIndexes : [];
    };
    /**
     * Gets the collection of selected row and cell indexes.
     * @return {number[]}
     */
    Grid.prototype.getSelectedRowCellIndexes = function () {
        return this.selectionModule.selectedRowCellIndexes;
    };
    /**
     * Gets the collection of selected records.
     * @return {Object[]}
     */
    Grid.prototype.getSelectedRecords = function () {
        return this.selectionModule.getSelectedRecords();
    };
    /**
     * Gets the Grid's data.
     * @return {Data}
     */
    Grid.prototype.getDataModule = function () {
        return this.renderModule.data;
    };
    /**
     * Shows a column by column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} showBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    Grid.prototype.showColumns = function (keys, showBy) {
        showBy = showBy ? showBy : 'headerText';
        this.showHider.show(keys, showBy);
    };
    /**
     * Hides a column by column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} hideBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    Grid.prototype.hideColumns = function (keys, hideBy) {
        hideBy = hideBy ? hideBy : 'headerText';
        this.showHider.hide(keys, hideBy);
    };
    /**
     * Navigate to target page by given number.
     * @param  {number} pageNo - Defines the page number to navigate.
     * @return {void}
     */
    Grid.prototype.goToPage = function (pageNo) {
        this.pagerModule.goToPage(pageNo);
    };
    /**
     * Defines the text of external message.
     * @param  {string} message - Defines the message to update.
     * @return {void}
     */
    Grid.prototype.updateExternalMessage = function (message) {
        this.pagerModule.updateExternalMessage(message);
    };
    /**
     * Sorts a column with given options.
     * @param {string} columnName - Defines the column name to sort.
     * @param {SortDirection} direction - Defines the direction of sorting for field.
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns to be maintained.
     * @return {void}
     */
    Grid.prototype.sortColumn = function (columnName, direction, isMultiSort) {
        this.sortModule.sortColumn(columnName, direction, isMultiSort);
    };
    /**
     * Clears all the sorted columns of Grid.
     * @return {void}
     */
    Grid.prototype.clearSorting = function () {
        this.sortModule.clearSorting();
    };
    /**
     * Remove sorted column by field name.
     * @param {string} field - Defines the column field name to remove sort.
     * @return {void}
     * @hidden
     */
    Grid.prototype.removeSortColumn = function (field) {
        this.sortModule.removeSortColumn(field);
    };
    /**
     * Filters grid row by column name with given options.
     * @param  {string} fieldName - Defines the field name of the filter column.
     * @param  {string} filterOperator - Defines the operator by how to filter records.
     * @param  {string | number | Date | boolean} filterValue - Defines the value which is used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query with another by using AND or OR predicate.
     * @param  {boolean} matchCase - If match case set to true, then filter records with exact match or else
     * filter records with case insensitive(uppercase and lowercase letters treated as same).
     * @param  {string} actualFilterValue - Defines the actual filter value for the filter column.
     * @param  {string} actualOperator - Defines the actual filter operator for the filter column.
     * @return {void}
     */
    Grid.prototype.filterByColumn = function (fieldName, filterOperator, filterValue, predicate, matchCase, actualFilterValue, actualOperator) {
        this.filterModule.filterByColumn(fieldName, filterOperator, filterValue, predicate, matchCase, actualFilterValue, actualOperator);
    };
    /**
     * Clears all the filtered rows of Grid.
     * @return {void}
     */
    Grid.prototype.clearFiltering = function () {
        this.filterModule.clearFiltering();
    };
    /**
     * Removes filtered column by field name.
     * @param  {string} field - Defines column field name to remove filter.
     * @param  {boolean} isClearFilterBar -  Specifies whether the filter bar value needs to be cleared.
     * @return {void}
     * @hidden
     */
    Grid.prototype.removeFilteredColsByField = function (field, isClearFilterBar) {
        this.filterModule.removeFilteredColsByField(field, isClearFilterBar);
    };
    /**
     * Selects a row by given index.
     * @param  {number} index - Defines the row index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    Grid.prototype.selectRow = function (index, isToggle) {
        this.selectionModule.selectRow(index, isToggle);
    };
    /**
     * Selects a collection of rows by indexes.
     * @param  {number[]} rowIndexes - Specifies the row indexes.
     * @return {void}
     */
    Grid.prototype.selectRows = function (rowIndexes) {
        this.selectionModule.selectRows(rowIndexes);
    };
    /**
     * Deselects the current selected rows and cells.
     * @return {void}
     */
    Grid.prototype.clearSelection = function () {
        this.selectionModule.clearSelection();
    };
    /**
     * Selects a cell by given index.
     * @param  {IIndex} cellIndex - Defines the row and column index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    Grid.prototype.selectCell = function (cellIndex, isToggle) {
        this.selectionModule.selectCell(cellIndex, isToggle);
    };
    /**
     * Searches Grid records by given key.
     * @param  {string} searchString - Defines the key.
     * @return {void}
     */
    Grid.prototype.search = function (searchString) {
        this.searchModule.search(searchString);
    };
    /**
     * By default, it prints all the pages of Grid and hides pager.
     * > Customize print options using [`printMode`](http://ej2.syncfusion.com/documentation/grid/api-grid.html#printmode-string).
     * @return {void}
     */
    Grid.prototype.print = function () {
        this.printModule.print();
    };
    /**
     * Delete a record with Given options. If fieldname and data is not given then grid will delete the selected record.
     * > `editSettings.allowDeleting` should be true.
     * @param {string} fieldname - Defines the primary key field Name of the column.
     * @param {Object} data - Defines the JSON data of record need to be delete.
     */
    Grid.prototype.deleteRecord = function (fieldname, data) {
        this.editModule.deleteRecord(fieldname, data);
    };
    /**
     * To edit any particular row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row to be edited.
     */
    Grid.prototype.startEdit = function () {
        this.editModule.startEdit();
    };
    /**
     * If Grid is in editable state, then you can save a record by invoking endEdit.
     */
    Grid.prototype.endEdit = function () {
        this.editModule.endEdit();
    };
    /**
     * Cancel edited state.
     */
    Grid.prototype.closeEdit = function () {
        this.editModule.closeEdit();
    };
    /**
     * To add a new row at top of rows with given data. If data is not passed then it will render empty row.
     * > `editSettings.allowEditing` should be true.
     * @param {Object} data - Defines the new add record data.
     */
    Grid.prototype.addRecord = function (data) {
        this.editModule.addRecord(data);
    };
    /**
     * Delete any visible row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row element.
     */
    Grid.prototype.deleteRow = function (tr) {
        this.editModule.deleteRow(tr);
    };
    /**
     * Copy selected rows or cells data into clipboard.
     * @param {boolean} withHeader - Specifies whether the column header data need to be copied or not.
     */
    Grid.prototype.copy = function (withHeader) {
        this.clipboardModule.copy(withHeader);
    };
    /**
     * @hidden
     */
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
    /**
     * Changes the Grid column positions by field names.
     * @param  {string} fromFName - Defines the origin field name.
     * @param  {string} toFName - Defines the destination field name.
     * @return {void}
     */
    Grid.prototype.reorderColumns = function (fromFName, toFName) {
        this.reorderModule.reorderColumns(fromFName, toFName);
    };
    /**
     * Change the column width to automatically fit its content
     * which ensures that the width is wide enough to show the content without wrapping/hiding.
     * > * This method ignores the hidden columns.
     * > * Use the `autoFitColumns` method in the `dataBound` event to resize at the initial rendering
     * @param  {string |string[]} fieldNames - Defines the column names.
     * @return {void}
     *
     *
     * ```typescript
     * <div id="Grid"></div>
     * <script>
     * let gridObj: Grid = new Grid({
     *     dataSource: employeeData,
     *     columns: [
     *         { field: 'OrderID', headerText: 'Order ID', width:100 },
     *         { field: 'EmployeeID', headerText: 'Employee ID' }],
     *     dataBound: () => gridObj.autoFitColumns('EmployeeID')
     * });
     * gridObj.appendTo('#Grid');
     * </script>
     * ```
     *
     */
    Grid.prototype.autoFitColumns = function (fieldNames) {
        this.resizeModule.autoFitColumns(fieldNames);
    };
    /**
     * @hidden
     */
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
        this.serviceLocator.register('focus', this.focusModule = new FocusStrategy(this));
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
        this.clipboardModule = new Clipboard(this);
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
    /**
     * The function is used to apply text wrap
     * @return {void}
     * @hidden
     */
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
    /**
     * The function is used to remove text wrap
     * @return {void}
     * @hidden
     */
    Grid.prototype.removeTextWrap = function () {
        wrap(this.element, false);
        var headerRows = [].slice.call(this.element.querySelectorAll('.e-columnheader'));
        wrap(headerRows, false);
        wrap(this.getContent(), false);
    };
    /**
     * The function is used to add Tooltip to the grid cell that has ellipsiswithtooltip clip mode.
     * @return {void}
     * @hidden
     */
    Grid.prototype.refreshTooltip = function () {
        var width;
        var headerTable = this.getHeaderTable();
        var contentTable = this.getContentTable();
        var headerDivTag = 'e-gridheader';
        var contentDivTag = 'e-gridcontent';
        var htable = this.createTable(headerTable, headerDivTag, 'header');
        var ctable = this.createTable(headerTable, headerDivTag, 'content');
        var all = this.element.querySelectorAll('.e-ellipsistooltip');
        var allele = [];
        for (var i = 0; i < all.length; i++) {
            allele[i] = all[i];
        }
        allele.forEach(function (element) {
            var td = element;
            var table = headerTable.contains(element) ? htable : ctable;
            var ele = headerTable.contains(element) ? 'th' : 'tr';
            table.querySelector(ele).className = element.className;
            table.querySelector(ele).innerHTML = element.innerHTML;
            width = table.querySelector(ele).getBoundingClientRect().width;
            if (width > element.getBoundingClientRect().width && !element.classList.contains('e-tooltip')) {
                var tooltip = new Tooltip({ content: element.innerHTML }, element);
            }
            else if (width < element.getBoundingClientRect().width && element.classList.contains('e-tooltip')) {
                element.ej2_instances[0].destroy();
            }
        });
        document.body.removeChild(htable);
        document.body.removeChild(ctable);
    };
    /**
     * To create table for ellipsiswithtooltip
     * @hidden
     */
    Grid.prototype.createTable = function (table, tag, type) {
        var myTableDiv = createElement('div');
        myTableDiv.className = this.element.className;
        myTableDiv.style.cssText = 'display: inline-block;visibility:hidden;position:absolute';
        var mySubDiv = createElement('div');
        mySubDiv.className = tag;
        var myTable = createElement('table');
        myTable.className = table.className;
        myTable.style.cssText = 'table-layout: auto;width: auto';
        var ele = (type === 'header') ? 'th' : 'td';
        var myTr = createElement('tr');
        var mytd = createElement(ele);
        myTr.appendChild(mytd);
        myTable.appendChild(myTr);
        mySubDiv.appendChild(myTable);
        myTableDiv.appendChild(mySubDiv);
        document.body.appendChild(myTableDiv);
        return myTableDiv;
    };
    /**
     * Binding events to the element while component creation.
     * @hidden
     */
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
    /**
     * Unbinding events from the element while component destroy.
     * @hidden
     */
    Grid.prototype.unwireEvents = function () {
        EventHandler.remove(this.element, 'click', this.mouseClickHandler);
        EventHandler.remove(this.element, 'touchend', this.mouseClickHandler);
        EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
    };
    /**
     * @hidden
     */
    Grid.prototype.addListener = function () {
        var _this = this;
        if (this.isDestroyed) {
            return;
        }
        this.on(events.dataReady, this.dataReady, this);
        this.on(events.contentReady, this.recalcIndentWidth, this);
        [events.updateData, events.modelChanged, events.contentReady, events.columnWidthChanged].forEach(function (event) {
            return _this.on(event, _this.refreshTooltip, _this);
        });
        this.on(events.headerRefreshed, this.recalcIndentWidth, this);
        this.dataBoundFunction = this.refreshMediaCol.bind(this);
        this.addEventListener(events.dataBound, this.dataBoundFunction);
    };
    /**
     * @hidden
     */
    Grid.prototype.removeListener = function () {
        var _this = this;
        if (this.isDestroyed) {
            return;
        }
        this.off(events.dataReady, this.dataReady);
        this.off(events.contentReady, this.recalcIndentWidth);
        [events.updateData, events.modelChanged, events.contentReady, events.columnWidthChanged].forEach(function (event) {
            return _this.off(event, _this.refreshTooltip);
        });
        this.off(events.headerRefreshed, this.recalcIndentWidth);
        this.removeEventListener(events.dataBound, this.dataBoundFunction);
    };
    /**
     * Get current visible data of grid.
     * @return {Object[]}
     * @hidden
     */
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
        return !parentsUntil(e.target, 'e-unboundcelldiv') && (isEdit || (parentsUntil(e.target, 'e-rowcell') &&
            parentsUntil(e.target, 'e-rowcell').classList.contains('e-editedbatchcell')));
    };
    Grid.prototype.dblClickHandler = function (e) {
        if (parentsUntil(e.target, 'e-grid').id !== this.element.id || closest(e.target, '.e-unboundcelldiv')) {
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
    Grid.prototype.mergePersistGridData = function () {
        var data = window.localStorage.getItem(this.getModuleName() + this.element.id);
        if (!(isNullOrUndefined(data) || (data === ''))) {
            var dataObj_1 = JSON.parse(data);
            var keys = Object.keys(dataObj_1);
            this.isProtectedOnChange = true;
            var _loop_2 = function (key) {
                if ((typeof this_2[key] === 'object') && !isNullOrUndefined(this_2[key])) {
                    if (Array.isArray(this_2[key])) {
                        this_2[key].forEach(function (element, index) {
                            extend(element, dataObj_1[key][index]);
                        });
                    }
                    else {
                        extend(this_2[key], dataObj_1[key]);
                    }
                }
                else {
                    this_2[key] = dataObj_1[key];
                }
            };
            var this_2 = this;
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                _loop_2(key);
            }
            this.isProtectedOnChange = false;
        }
    };
    Grid.prototype.isDetail = function () {
        return !isNullOrUndefined(this.detailTemplate) || !isNullOrUndefined(this.childGrid);
    };
    Grid.prototype.keyActionHandler = function (e) {
        if (this.isChildGrid(e) ||
            (this.isEdit && e.action !== 'escape' && e.action !== 'enter' && e.action !== 'shiftEnter'
                && e.action !== 'tab' && e.action !== 'shiftTab')) {
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
    /**
     * @hidden
     */
    Grid.prototype.setInjectedModules = function (modules) {
        this.injectedModules = modules;
    };
    Grid.prototype.updateColumnObject = function () {
        prepareColumns(this.columns, this.enableColumnVirtualization);
        if (this.editSettings.allowEditing || this.editSettings.allowAdding || this.editSettings.allowDeleting) {
            this.notify(events.autoCol, {});
        }
    };
    /**
     * Refreshes the Grid column changes
     */
    Grid.prototype.refreshColumns = function () {
        this.updateColumnObject();
        this.refresh();
    };
    /**
     * Export Grid data to Excel file(.xlsx).
     * @param  {exportProperties} exportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @return {Promise<any>}
     */
    /* tslint:disable-next-line:no-any */
    Grid.prototype.excelExport = function (exportProperties, isMultipleExport, workbook) {
        return this.excelExportModule.Map(this, exportProperties, isMultipleExport, workbook, false);
    };
    /**
     * Export Grid data to CSV file.
     * @param  {exportProperties} exportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @return {Promise<any>}
     */
    /* tslint:disable-next-line:no-any */
    Grid.prototype.csvExport = function (exportProperties, isMultipleExport, workbook) {
        return this.excelExportModule.Map(this, exportProperties, isMultipleExport, workbook, true);
    };
    /**
     * Export Grid data to PDF document.
     * @param  {exportProperties} exportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Define to enable multiple export.
     * @param  {pdfDoc} pdfDoc - Defined the Pdf Document if multiple export is enabled.
     * @return {Promise<any>}
     */
    /* tslint:disable-next-line:no-any */
    Grid.prototype.pdfExport = function (exportProperties, isMultipleExport, pdfDoc) {
        return this.pdfExportModule.Map(this, exportProperties, isMultipleExport, pdfDoc);
    };
    Grid.prototype.isCommandColumn = function (columns) {
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var column = columns_1[_i];
            if (column.columns) {
                if (this.isCommandColumn(column.columns)) {
                    return true;
                }
            }
            else if (column.commands || column.commandsTemplate) {
                return true;
            }
        }
        return false;
    };
    /**
     * Groups a column by column name.
     * @param  {string} columnName - Defines the column name to group.
     * @return {void}
     */
    Grid.prototype.groupColumn = function (columnName) {
        this.groupModule.groupColumn(columnName);
    };
    /**
     * Ungroups a column by column name.
     * @param  {string} columnName - Defines the column name to ungroup.
     * @return {void}
     */
    Grid.prototype.ungroupColumn = function (columnName) {
        this.groupModule.ungroupColumn(columnName);
    };
    /**
     * @hidden
     */
    Grid.prototype.isContextMenuOpen = function () {
        return this.contextMenuModule && this.contextMenuModule.isOpen;
    };
    /**
     * @hidden
     */
    Grid.prototype.ensureModuleInjected = function (module) {
        return this.getInjectedModules().indexOf(module) >= 0;
    };
    /**
     * Shows a column by column name.
     * @param  {string|string[]} columnName - Defines a single or collection of column names to show.
     * @param  {string} showBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    Grid.prototype.showColumn = function (columnName, showBy) {
        this.showHider.show(columnName, showBy);
    };
    /**
     * Hides a column by column name.
     * @param  {string|string[]} columnName - Defines a single or collection of column names to hide.
     * @param  {string} hideBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    Grid.prototype.hideColumn = function (columnName, hideBy) {
        this.showHider.hide(columnName, hideBy);
    };
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
        Property(true)
    ], Grid.prototype, "allowMultiSorting", void 0);
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
        Property(false)
    ], Grid.prototype, "showColumnMenu", void 0);
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
    ], Grid.prototype, "contextMenuItems", void 0);
    __decorate([
        Property()
    ], Grid.prototype, "columnMenuItems", void 0);
    __decorate([
        Property()
    ], Grid.prototype, "toolbarTemplate", void 0);
    __decorate([
        Property()
    ], Grid.prototype, "pagerTemplate", void 0);
    __decorate([
        Property(0)
    ], Grid.prototype, "frozenRows", void 0);
    __decorate([
        Property(0)
    ], Grid.prototype, "frozenColumns", void 0);
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
    ], Grid.prototype, "beforeExcelExport", void 0);
    __decorate([
        Event()
    ], Grid.prototype, "excelExportComplete", void 0);
    __decorate([
        Event()
    ], Grid.prototype, "beforePdfExport", void 0);
    __decorate([
        Event()
    ], Grid.prototype, "pdfExportComplete", void 0);
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
    __decorate([
        Event()
    ], Grid.prototype, "contextMenuOpen", void 0);
    __decorate([
        Event()
    ], Grid.prototype, "contextMenuClick", void 0);
    __decorate([
        Event()
    ], Grid.prototype, "columnMenuOpen", void 0);
    __decorate([
        Event()
    ], Grid.prototype, "columnMenuClick", void 0);
    __decorate([
        Event()
    ], Grid.prototype, "checkBoxChange", void 0);
    __decorate([
        Event()
    ], Grid.prototype, "beforeCopy", void 0);
    Grid = __decorate([
        NotifyPropertyChanges
    ], Grid);
    return Grid;
}(Component));
export { Grid };
Grid.Inject(Selection);
