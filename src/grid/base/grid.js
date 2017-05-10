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
define(["require", "exports", "@syncfusion/ej2-base", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/dom", "@syncfusion/ej2-base", "@syncfusion/ej2-base", "./util", "../base/constant", "../renderer/render", "./enum", "../services/cell-render-factory", "../services/service-locator", "../services/value-formatter", "../services/renderer-factory", "../services/width-controller", "../services/aria-service", "../models/page-settings", "../actions/search", "../actions/show-hide", "../actions/scroll", "../actions/print"], function (require, exports, ej2_base_1, util_1, dom_1, ej2_base_2, ej2_base_3, util_2, events, render_1, enum_1, cell_render_factory_1, service_locator_1, value_formatter_1, renderer_factory_1, width_controller_1, aria_service_1, page_settings_1, search_1, show_hide_1, scroll_1, print_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SortDescriptor = (function (_super) {
        __extends(SortDescriptor, _super);
        function SortDescriptor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SortDescriptor;
    }(ej2_base_1.ChildProperty));
    __decorate([
        ej2_base_2.Property()
    ], SortDescriptor.prototype, "field", void 0);
    __decorate([
        ej2_base_2.Property()
    ], SortDescriptor.prototype, "direction", void 0);
    exports.SortDescriptor = SortDescriptor;
    var SortSettings = (function (_super) {
        __extends(SortSettings, _super);
        function SortSettings() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SortSettings;
    }(ej2_base_1.ChildProperty));
    __decorate([
        ej2_base_2.Collection([], SortDescriptor)
    ], SortSettings.prototype, "columns", void 0);
    exports.SortSettings = SortSettings;
    var Predicate = (function (_super) {
        __extends(Predicate, _super);
        function Predicate() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Predicate;
    }(ej2_base_1.ChildProperty));
    __decorate([
        ej2_base_2.Property()
    ], Predicate.prototype, "field", void 0);
    __decorate([
        ej2_base_2.Property()
    ], Predicate.prototype, "operator", void 0);
    __decorate([
        ej2_base_2.Property()
    ], Predicate.prototype, "value", void 0);
    __decorate([
        ej2_base_2.Property()
    ], Predicate.prototype, "matchCase", void 0);
    __decorate([
        ej2_base_2.Property()
    ], Predicate.prototype, "predicate", void 0);
    __decorate([
        ej2_base_2.Property({})
    ], Predicate.prototype, "actualFilterValue", void 0);
    __decorate([
        ej2_base_2.Property({})
    ], Predicate.prototype, "actualOperator", void 0);
    exports.Predicate = Predicate;
    var FilterSettings = (function (_super) {
        __extends(FilterSettings, _super);
        function FilterSettings() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return FilterSettings;
    }(ej2_base_1.ChildProperty));
    __decorate([
        ej2_base_2.Collection([], Predicate)
    ], FilterSettings.prototype, "columns", void 0);
    __decorate([
        ej2_base_2.Property('filterbar')
    ], FilterSettings.prototype, "type", void 0);
    __decorate([
        ej2_base_2.Property()
    ], FilterSettings.prototype, "mode", void 0);
    __decorate([
        ej2_base_2.Property(true)
    ], FilterSettings.prototype, "showFilterBarStatus", void 0);
    __decorate([
        ej2_base_2.Property(1500)
    ], FilterSettings.prototype, "immediateModeDelay", void 0);
    exports.FilterSettings = FilterSettings;
    var SelectionSettings = (function (_super) {
        __extends(SelectionSettings, _super);
        function SelectionSettings() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SelectionSettings;
    }(ej2_base_1.ChildProperty));
    __decorate([
        ej2_base_2.Property('row')
    ], SelectionSettings.prototype, "mode", void 0);
    __decorate([
        ej2_base_2.Property('flow')
    ], SelectionSettings.prototype, "cellSelectionMode", void 0);
    __decorate([
        ej2_base_2.Property('single')
    ], SelectionSettings.prototype, "type", void 0);
    exports.SelectionSettings = SelectionSettings;
    var SearchSettings = (function (_super) {
        __extends(SearchSettings, _super);
        function SearchSettings() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SearchSettings;
    }(ej2_base_1.ChildProperty));
    __decorate([
        ej2_base_2.Property([])
    ], SearchSettings.prototype, "fields", void 0);
    __decorate([
        ej2_base_2.Property('')
    ], SearchSettings.prototype, "key", void 0);
    __decorate([
        ej2_base_2.Property('contains')
    ], SearchSettings.prototype, "operator", void 0);
    __decorate([
        ej2_base_2.Property(true)
    ], SearchSettings.prototype, "ignoreCase", void 0);
    exports.SearchSettings = SearchSettings;
    var RowDropSettings = (function (_super) {
        __extends(RowDropSettings, _super);
        function RowDropSettings() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return RowDropSettings;
    }(ej2_base_1.ChildProperty));
    __decorate([
        ej2_base_2.Property()
    ], RowDropSettings.prototype, "targetID", void 0);
    exports.RowDropSettings = RowDropSettings;
    var GroupSettings = (function (_super) {
        __extends(GroupSettings, _super);
        function GroupSettings() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return GroupSettings;
    }(ej2_base_1.ChildProperty));
    __decorate([
        ej2_base_2.Property(true)
    ], GroupSettings.prototype, "showDropArea", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], GroupSettings.prototype, "showToggleButton", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], GroupSettings.prototype, "showGroupedColumn", void 0);
    __decorate([
        ej2_base_2.Property(true)
    ], GroupSettings.prototype, "showUngroupButton", void 0);
    __decorate([
        ej2_base_2.Property([])
    ], GroupSettings.prototype, "columns", void 0);
    exports.GroupSettings = GroupSettings;
    var Grid = (function (_super) {
        __extends(Grid, _super);
        function Grid(options, element) {
            var _this = _super.call(this, options, element) || this;
            _this.isInitial = true;
            _this.sortedColumns = [];
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
                EmptyDataSourceError: 'DataSource must not be empty at initial load since columns are generated from dataSource in AutoGenerate Column Grid'
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
                ctrlPlusA: 'ctrl+A'
            };
            return _this;
        }
        Grid.prototype.getPersistData = function () {
            var keyEntity = ['allowPaging', 'pageSettings', 'allowSorting', 'sortSettings', 'allowSelection',
                'selectionSettings', 'allowFiltering', 'filterSettings', 'gridLines',
                'create', 'destroyed', 'load', 'actionBegin', 'actionComplete', 'actionFailure', 'rowSelecting', 'rowSelected',
                'columnSelecting', 'columnSelected', 'cellSelecting', 'cellSelected', 'dataBound'];
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
                    args: [this, this.selectionSettings]
                });
            }
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
            return modules;
        };
        Grid.prototype.preRender = function () {
            this.serviceLocator = new service_locator_1.ServiceLocator;
        };
        Grid.prototype.render = function () {
            this.initializeServices();
            this.ariaService.setOptions(this.element, { role: 'grid' });
            this.renderModule = new render_1.Render(this, this.serviceLocator);
            this.searchModule = new search_1.Search(this);
            this.scrollModule = new scroll_1.Scroll(this);
            this.notify(events.initialLoad, {});
            this.trigger(events.load);
            util_2.prepareColumns(this.columns);
            this.getColumns();
            this.processModel();
            this.gridRender();
            this.wireEvents();
            this.addListener();
            this.updateDefaultCursor();
            this.notify(events.initialEnd, {});
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
            dom_1.classList(this.element, [], ['e-rtl', 'e-gridhover', 'e-responsive', 'e-default', 'e-device']);
        };
        Grid.prototype.destroyDependentModules = function () {
            this.scrollModule.destroy();
            this.keyBoardModule.destroy();
        };
        Grid.prototype.getModuleName = function () {
            return 'grid';
        };
        Grid.prototype.onPropertyChanged = function (newProp, oldProp) {
            var requireRefresh = false;
            var checkCursor;
            var args = { requestType: 'refresh' };
            if (this.isDestroyed) {
                return;
            }
            for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
                var prop = _a[_i];
                this.extendedPropertyChange(prop, newProp);
                switch (prop) {
                    case 'enableRtl':
                        this.updateRTL();
                        if (this.allowPaging) {
                            this.element.querySelector('.e-gridpager').ej2_instances[0].enableRtl = newProp.enableRtl;
                        }
                        if (this.height !== 'auto') {
                            this.scrollModule.removePadding(!newProp.enableRtl);
                            this.scrollModule.setPadding();
                        }
                        break;
                    case 'enableHover':
                        var action = newProp.enableHover ? dom_1.addClass : dom_1.removeClass;
                        action([this.element], 'e-gridhover');
                        break;
                    case 'dataSource':
                    case 'query':
                        this.notify(events.dataSourceModified, {});
                        this.renderModule.refresh();
                        break;
                    case 'allowPaging':
                        this.notify(events.uiUpdate, { module: 'pager', enable: this.allowPaging });
                        requireRefresh = true;
                        break;
                    case 'pageSettings':
                        this.notify(events.inBoundModelChanged, { module: 'pager', properties: newProp.pageSettings });
                        if (util_1.isNullOrUndefined(newProp.pageSettings.currentPage) && util_1.isNullOrUndefined(newProp.pageSettings.totalRecordsCount)) {
                            requireRefresh = true;
                        }
                        break;
                    case 'allowTextWrap':
                        if (this.allowTextWrap) {
                            this.applyTextWrap();
                        }
                        else {
                            this.removeTextWrap();
                        }
                        break;
                    case 'locale':
                        this.localeObj.setLocale(newProp.locale);
                        this.valueFormatterService.setCulture(newProp.locale);
                        requireRefresh = true;
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
                        this.updateRowTemplateFn();
                        requireRefresh = true;
                        break;
                    case 'allowGrouping':
                        this.notify(events.uiUpdate, { module: 'group', enable: this.allowGrouping });
                        this.headerModule.refreshUI();
                        requireRefresh = true;
                        checkCursor = true;
                        break;
                }
            }
            if (checkCursor) {
                this.updateDefaultCursor();
            }
            if (requireRefresh) {
                this.notify(events.modelChanged, args);
                requireRefresh = false;
            }
        };
        Grid.prototype.extendedPropertyChange = function (prop, newProp) {
            switch (prop) {
                case 'enableAltRow':
                    this.renderModule.refresh();
                    break;
                case 'gridLines':
                    this.updateGridLines();
                    break;
                case 'groupSettings':
                    this.notify(events.inBoundModelChanged, { module: 'group', properties: newProp.groupSettings });
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
            this.columnModel = [];
            this.updateColumnModel(this.columns);
            return this.columnModel;
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
        Grid.prototype.getPager = function () {
            return this.gridPager;
        };
        Grid.prototype.setGridPager = function (element) {
            this.gridPager = element;
        };
        Grid.prototype.getRowByIndex = function (index) {
            return this.getContentTable().querySelectorAll('.e-row')[index];
        };
        Grid.prototype.getRows = function () {
            return this.contentModule.getRowElements();
        };
        Grid.prototype.getCellFromIndex = function (rowIndex, columnIndex) {
            return this.getContent().querySelectorAll('.e-row')[rowIndex].querySelectorAll('.e-rowcell')[columnIndex];
        };
        Grid.prototype.getColumnHeaderByIndex = function (index) {
            return this.getHeaderTable().querySelectorAll('.e-headercell')[index];
        };
        Grid.prototype.getColumnHeaderByField = function (field) {
            return this.getColumnHeaderByUid(this.getColumnByField(field).uid);
        };
        Grid.prototype.getColumnHeaderByUid = function (uid) {
            return this.getHeaderContent().querySelector('[e-mappinguid=' + uid + ']').parentElement;
        };
        Grid.prototype.getColumnByField = function (field) {
            return util_2.iterateArrayOrObject(this.getColumns(), function (item, index) {
                if (item.field === field) {
                    return item;
                }
                return undefined;
            })[0];
        };
        Grid.prototype.getColumnIndexByField = function (field) {
            var index = util_2.iterateArrayOrObject(this.getColumns(), function (item, index) {
                if (item.field === field) {
                    return index;
                }
                return undefined;
            })[0];
            return !util_1.isNullOrUndefined(index) ? index : -1;
        };
        Grid.prototype.getColumnByUid = function (uid) {
            return util_2.iterateArrayOrObject(this.getColumns(), function (item, index) {
                if (item.uid === uid) {
                    return item;
                }
                return undefined;
            })[0];
        };
        Grid.prototype.getColumnIndexByUid = function (uid) {
            var index = util_2.iterateArrayOrObject(this.getColumns(), function (item, index) {
                if (item.uid === uid) {
                    return index;
                }
                return undefined;
            })[0];
            return !util_1.isNullOrUndefined(index) ? index : -1;
        };
        Grid.prototype.getUidByColumnField = function (field) {
            return util_2.iterateArrayOrObject(this.getColumns(), function (item, index) {
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
        Grid.prototype.refresh = function () {
            this.headerModule.refreshUI();
            this.renderModule.refresh();
        };
        Grid.prototype.refreshHeader = function () {
            this.headerModule.refreshUI();
        };
        Grid.prototype.getSelectedRows = function () {
            return this.selectionModule.selectedRecords;
        };
        Grid.prototype.getSelectedRowIndexes = function () {
            return this.selectionModule.selectedRowIndexes;
        };
        Grid.prototype.getSelectedRowCellIndexes = function () {
            return this.selectionModule.selectedRowCellIndexes;
        };
        Grid.prototype.getSelectedRecords = function () {
            var records = [];
            var key = 'records';
            var currentViewData = this.allowGrouping && this.groupSettings.columns.length ?
                this.currentViewData[key] : this.currentViewData;
            for (var i = 0, len = this.selectionModule.selectedRowIndexes.length; i < len; i++) {
                records.push(currentViewData[this.selectionModule.selectedRowIndexes[i]]);
            }
            return records;
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
        Grid.prototype.reorderColumns = function (fromFName, toFName) {
            this.reorderModule.reorderColumns(fromFName, toFName);
        };
        Grid.prototype.initializeServices = function () {
            this.serviceLocator.register('widthService', this.widthService = new width_controller_1.ColumnWidthService(this));
            this.serviceLocator.register('cellRendererFactory', new cell_render_factory_1.CellRendererFactory);
            this.serviceLocator.register('rendererFactory', new renderer_factory_1.RendererFactory);
            this.serviceLocator.register('localization', this.localeObj = new ej2_base_2.L10n(this.getModuleName(), this.defaultLocale, this.locale));
            this.serviceLocator.register('valueFormatter', this.valueFormatterService = new value_formatter_1.ValueFormatter(this.locale));
            this.serviceLocator.register('showHideService', this.showHider = new show_hide_1.ShowHide(this));
            this.serviceLocator.register('ariaService', this.ariaService = new aria_service_1.AriaService());
        };
        Grid.prototype.processModel = function () {
            var gCols = this.groupSettings.columns;
            var sCols = this.sortSettings.columns;
            var flag;
            var j;
            if (this.allowGrouping) {
                for (var i = 0, len = gCols.length; i < len; i++) {
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
                        if (this.allowSorting) {
                            this.sortedColumns.push(sCols[j].field);
                        }
                        else {
                            sCols[j].direction = 'ascending';
                        }
                    }
                    if (!this.groupSettings.showGroupedColumn) {
                        this.getColumnByField(gCols[i]).visible = false;
                    }
                }
            }
            this.updateRowTemplateFn();
        };
        Grid.prototype.updateRowTemplateFn = function () {
            if (this.rowTemplate) {
                var e = void 0;
                try {
                    if (document.querySelectorAll(this.rowTemplate).length) {
                        this.rowTemplateFn = ej2_base_1.compile(document.querySelector(this.rowTemplate).innerHTML.trim());
                    }
                }
                catch (e) {
                    this.rowTemplateFn = ej2_base_1.compile(this.rowTemplate);
                }
            }
        };
        Grid.prototype.gridRender = function () {
            this.updateRTL();
            if (this.enableHover) {
                this.element.classList.add('e-gridhover');
            }
            if (ej2_base_1.Browser.isDevice) {
                this.element.classList.add('e-device');
            }
            dom_1.classList(this.element, ['e-responsive', 'e-default'], []);
            var rendererFactory = this.serviceLocator.getService('rendererFactory');
            this.headerModule = rendererFactory.getRenderer(enum_1.RenderType.Header);
            this.contentModule = rendererFactory.getRenderer(enum_1.RenderType.Content);
            this.printModule = new print_1.Print(this, this.scrollModule);
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
            var popup = dom_1.createElement('div', { className: 'e-gridpopup', styles: 'display:none;' });
            var content = dom_1.createElement('div', { className: 'e-content' });
            dom_1.append([content, dom_1.createElement('div', { className: 'e-uptail e-tail' })], popup);
            content.appendChild(dom_1.createElement('span'));
            dom_1.append([content, dom_1.createElement('div', { className: 'e-downtail e-tail' })], popup);
            this.element.appendChild(popup);
        };
        Grid.prototype.updateGridLines = function () {
            dom_1.classList(this.element, [], ['e-verticallines', 'e-horizontallines', 'e-hidelines', 'e-bothlines']);
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
                this.element.classList.add('e-wrap');
            }
        };
        Grid.prototype.removeTextWrap = function () {
            this.element.classList.remove('e-wrap');
        };
        Grid.prototype.wireEvents = function () {
            ej2_base_3.EventHandler.add(this.element, 'click', this.mouseClickHandler, this);
            ej2_base_3.EventHandler.add(this.element, 'touchend', this.mouseClickHandler, this);
            ej2_base_3.EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
            if (this.allowKeyboard) {
                this.element.tabIndex = this.element.tabIndex === -1 ? 0 : this.element.tabIndex;
            }
            this.keyBoardModule = new ej2_base_3.KeyboardEvents(this.element, {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            });
        };
        Grid.prototype.unwireEvents = function () {
            ej2_base_3.EventHandler.remove(this.element, 'click', this.mouseClickHandler);
            ej2_base_3.EventHandler.remove(this.element, 'touchend', this.mouseClickHandler);
            ej2_base_3.EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
        };
        Grid.prototype.addListener = function () {
            if (this.isDestroyed) {
                return;
            }
            this.on(events.dataReady, this.dataReady, this);
        };
        Grid.prototype.removeListener = function () {
            this.off(events.dataReady, this.dataReady);
        };
        Grid.prototype.mouseClickHandler = function (e) {
            if ((util_2.parentsUntil(e.target, 'e-gridpopup') && e.touches) || this.element.querySelectorAll('.e-cloneproperties').length) {
                return;
            }
            if (((!this.allowRowDragAndDrop && util_2.parentsUntil(e.target, 'e-gridcontent')) ||
                (!(this.allowGrouping || this.allowReordering) && util_2.parentsUntil(e.target, 'e-gridheader'))) && e.touches) {
                return;
            }
            if (util_2.parentsUntil(e.target, 'e-gridheader') && this.allowRowDragAndDrop) {
                e.preventDefault();
            }
            this.notify(events.click, e);
        };
        Grid.prototype.focusOutHandler = function (e) {
            if (!util_2.parentsUntil(e.target, 'e-grid')) {
                this.element.querySelector('.e-gridpopup').style.display = 'none';
            }
            var filterClear = this.element.querySelector('.e-cancel:not(.e-hide)');
            if (filterClear) {
                filterClear.classList.add('e-hide');
            }
        };
        Grid.prototype.keyActionHandler = function (e) {
            if (this.allowKeyboard) {
                this.notify(events.keyPressed, e);
            }
        };
        return Grid;
    }(ej2_base_1.Component));
    __decorate([
        ej2_base_2.Property([])
    ], Grid.prototype, "columns", void 0);
    __decorate([
        ej2_base_2.Property(true)
    ], Grid.prototype, "enableAltRow", void 0);
    __decorate([
        ej2_base_2.Property(true)
    ], Grid.prototype, "enableHover", void 0);
    __decorate([
        ej2_base_2.Property(true)
    ], Grid.prototype, "allowKeyboard", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], Grid.prototype, "allowTextWrap", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], Grid.prototype, "allowPaging", void 0);
    __decorate([
        ej2_base_2.Complex({}, page_settings_1.PageSettings)
    ], Grid.prototype, "pageSettings", void 0);
    __decorate([
        ej2_base_2.Complex({}, SearchSettings)
    ], Grid.prototype, "searchSettings", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], Grid.prototype, "allowSorting", void 0);
    __decorate([
        ej2_base_2.Complex({}, SortSettings)
    ], Grid.prototype, "sortSettings", void 0);
    __decorate([
        ej2_base_2.Property(true)
    ], Grid.prototype, "allowSelection", void 0);
    __decorate([
        ej2_base_2.Property()
    ], Grid.prototype, "selectedRowIndex", void 0);
    __decorate([
        ej2_base_2.Complex({}, SelectionSettings)
    ], Grid.prototype, "selectionSettings", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], Grid.prototype, "allowFiltering", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], Grid.prototype, "allowReordering", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], Grid.prototype, "allowRowDragAndDrop", void 0);
    __decorate([
        ej2_base_2.Complex({}, RowDropSettings)
    ], Grid.prototype, "rowDropSettings", void 0);
    __decorate([
        ej2_base_2.Complex({}, FilterSettings)
    ], Grid.prototype, "filterSettings", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], Grid.prototype, "allowGrouping", void 0);
    __decorate([
        ej2_base_2.Complex({}, GroupSettings)
    ], Grid.prototype, "groupSettings", void 0);
    __decorate([
        ej2_base_2.Property('auto')
    ], Grid.prototype, "height", void 0);
    __decorate([
        ej2_base_2.Property('auto')
    ], Grid.prototype, "width", void 0);
    __decorate([
        ej2_base_2.Property('default')
    ], Grid.prototype, "gridLines", void 0);
    __decorate([
        ej2_base_2.Property()
    ], Grid.prototype, "rowTemplate", void 0);
    __decorate([
        ej2_base_2.Property('allpages')
    ], Grid.prototype, "printMode", void 0);
    __decorate([
        ej2_base_2.Property([])
    ], Grid.prototype, "dataSource", void 0);
    __decorate([
        ej2_base_2.Property()
    ], Grid.prototype, "query", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "created", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "destroyed", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "load", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "rowDataBound", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "queryCellInfo", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "actionBegin", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "actionComplete", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "actionFailure", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "dataBound", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "rowSelecting", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "rowSelected", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "rowDeselecting", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "rowDeselected", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "cellSelecting", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "cellSelected", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "cellDeselecting", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "cellDeselected", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "columnDragStart", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "columnDrag", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "columnDrop", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "printComplete", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "beforePrint", void 0);
    Grid = __decorate([
        ej2_base_2.NotifyPropertyChanges
    ], Grid);
    exports.Grid = Grid;
});
