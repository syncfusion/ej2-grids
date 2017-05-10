define(["require", "exports", "@syncfusion/ej2-base", "@syncfusion/ej2-base/util", "../base/util", "@syncfusion/ej2-base/dom", "@syncfusion/ej2-data", "../base/constant", "../base/enum", "../renderer/row-renderer", "../models/cell", "../models/row", "../renderer/filter-cell-renderer"], function (require, exports, ej2_base_1, util_1, util_2, dom_1, ej2_data_1, events, enum_1, row_renderer_1, cell_1, row_1, filter_cell_renderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Filter = (function () {
        function Filter(parent, filterSettings, serviceLocator) {
            this.predicate = 'and';
            this.contentRefresh = true;
            this.values = {};
            this.filterOperators = {
                contains: 'contains', endsWith: 'endswith', equal: 'equal', greaterThan: 'greaterthan', greaterThanOrEqual: 'greaterthanorequal',
                lessThan: 'lessthan', lessThanOrEqual: 'lessthanorequal', notEqual: 'notequal', startsWith: 'startswith'
            };
            this.parent = parent;
            this.filterSettings = filterSettings;
            this.serviceLocator = serviceLocator;
            this.addEventListener();
        }
        Filter.prototype.render = function () {
            var gObj = this.parent;
            if (gObj.columns.length) {
                var rowRenderer = new row_renderer_1.RowRenderer(this.serviceLocator, enum_1.CellType.Filter);
                var row = void 0;
                var cellrender = this.serviceLocator.getService('cellRendererFactory');
                cellrender.addCellRenderer(enum_1.CellType.Filter, new filter_cell_renderer_1.FilterCellRenderer(this.serviceLocator));
                this.l10n = this.serviceLocator.getService('localization');
                this.valueFormatter = this.serviceLocator.getService('valueFormatter');
                rowRenderer.element = dom_1.createElement('tr', { className: 'e-filterbar' });
                row = this.generateRow();
                row.data = this.values;
                this.element = rowRenderer.render(row, gObj.getColumns());
                this.parent.getHeaderContent().querySelector('thead').appendChild(this.element);
                this.wireEvents();
            }
        };
        Filter.prototype.destroy = function () {
            this.filterSettings.columns = [];
            this.updateFilterMsg();
            this.removeEventListener();
            this.unWireEvents();
            dom_1.remove(this.element);
        };
        Filter.prototype.generateRow = function (index) {
            var options = {};
            var row = new row_1.Row(options);
            row.cells = this.generateCells();
            return row;
        };
        Filter.prototype.generateCells = function () {
            var cells = [];
            if (this.parent.allowGrouping) {
                for (var c = 0, len = this.parent.groupSettings.columns.length; c < len; c++) {
                    cells.push(this.generateCell({}, enum_1.CellType.HeaderIndent));
                }
            }
            for (var _i = 0, _a = this.parent.getColumns(); _i < _a.length; _i++) {
                var dummy = _a[_i];
                cells.push(this.generateCell(dummy));
            }
            return cells;
        };
        Filter.prototype.generateCell = function (column, cellType) {
            var opt = {
                'visible': column.visible,
                'isDataCell': false,
                'rowId': '',
                'column': column,
                'cellType': cellType ? cellType : enum_1.CellType.Filter,
                'attributes': { title: this.l10n.getConstant('FilterbarTitle') }
            };
            return new cell_1.Cell(opt);
        };
        Filter.prototype.updateModel = function () {
            this.currentFilterObject = {
                field: this.fieldName, operator: this.operator, value: this.value, predicate: this.predicate,
                matchCase: this.matchCase, actualFilterValue: {}, actualOperator: {}
            };
            var index = this.getFilteredColsIndexByField(this.fieldName);
            if (index > -1) {
                this.filterSettings.columns[index] = this.currentFilterObject;
            }
            else {
                this.filterSettings.columns.push(this.currentFilterObject);
            }
            this.filterSettings.columns = this.filterSettings.columns;
            this.parent.dataBind();
        };
        Filter.prototype.getFilteredColsIndexByField = function (field) {
            var cols = this.filterSettings.columns;
            for (var i = 0, len = cols.length; i < len; i++) {
                if (cols[i].field === field) {
                    return i;
                }
            }
            return -1;
        };
        Filter.prototype.onActionComplete = function (e) {
            var args = !this.isRemove ? {
                currentFilterObject: this.currentFilterObject, currentFilteringColumn: this.column.field,
                columns: this.filterSettings.columns, requestType: 'filtering', type: events.actionComplete
            } : {
                requestType: 'filtering', type: events.actionComplete
            };
            this.parent.trigger(events.actionComplete, util_1.extend(e, args));
            this.isRemove = false;
        };
        Filter.prototype.wireEvents = function () {
            ej2_base_1.EventHandler.add(this.parent.getHeaderContent(), 'mousedown', this.updateSpanClass, this);
            ej2_base_1.EventHandler.add(this.parent.element, 'focusin', this.updateSpanClass, this);
            ej2_base_1.EventHandler.add(this.parent.getHeaderContent(), 'keyup', this.keyUpHandler, this);
        };
        Filter.prototype.unWireEvents = function () {
            ej2_base_1.EventHandler.remove(this.parent.element, 'focusin', this.updateSpanClass);
            ej2_base_1.EventHandler.remove(this.parent.getHeaderContent(), 'mousedown', this.updateSpanClass);
            ej2_base_1.EventHandler.remove(this.parent.getHeaderContent(), 'keyup', this.keyUpHandler);
        };
        Filter.prototype.enableAfterRender = function (e) {
            if (e.module === this.getModuleName() && e.enable) {
                this.render();
            }
        };
        Filter.prototype.initialEnd = function () {
            this.parent.off(events.contentReady, this.initialEnd);
            if (this.parent.getColumns().length && this.filterSettings.columns.length) {
                var gObj = this.parent;
                this.contentRefresh = false;
                for (var _i = 0, _a = gObj.filterSettings.columns; _i < _a.length; _i++) {
                    var col = _a[_i];
                    this.filterByColumn(col.field, col.operator, col.value, col.predicate, col.matchCase, col.actualFilterValue, col.actualOperator);
                }
                this.updateFilterMsg();
                this.contentRefresh = true;
            }
        };
        Filter.prototype.addEventListener = function () {
            if (this.parent.isDestroyed) {
                return;
            }
            this.parent.on(events.uiUpdate, this.enableAfterRender, this);
            this.parent.on(events.filterComplete, this.onActionComplete, this);
            this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
            this.parent.on(events.keyPressed, this.keyUpHandler, this);
            this.parent.on(events.columnPositionChanged, this.columnPositionChanged, this);
            this.parent.on(events.headerRefreshed, this.render, this);
            this.parent.on(events.contentReady, this.initialEnd, this);
        };
        Filter.prototype.removeEventListener = function () {
            this.parent.off(events.uiUpdate, this.enableAfterRender);
            this.parent.off(events.filterComplete, this.onActionComplete);
            this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
            this.parent.off(events.keyPressed, this.keyUpHandler);
            this.parent.off(events.columnPositionChanged, this.columnPositionChanged);
            this.parent.off(events.headerRefreshed, this.render);
        };
        Filter.prototype.filterByColumn = function (fieldName, filterOperator, filterValue, predicate, matchCase, actualFilterValue, actualOperator) {
            var gObj = this.parent;
            var filterCell;
            this.column = gObj.getColumnByField(fieldName);
            filterCell = this.element.querySelector('#' + this.column.field + '_filterBarcell');
            if (!util_1.isNullOrUndefined(this.column.allowFiltering) && !this.column.allowFiltering) {
                return;
            }
            this.value = filterValue;
            this.matchCase = matchCase || false;
            this.fieldName = fieldName;
            this.predicate = predicate || 'and';
            this.operator = filterOperator;
            filterValue = filterValue.toString();
            this.values[this.column.field] = filterValue;
            gObj.getColumnHeaderByField(fieldName).setAttribute('aria-filtered', 'true');
            if (filterValue.length < 1 || this.checkForSkipInput(this.column, filterValue)) {
                this.filterStatusMsg = filterValue.length < 1 ? '' : this.l10n.getConstant('InvalidFilterMessage');
                this.updateFilterMsg();
                return;
            }
            if (filterCell.value !== filterValue) {
                filterCell.value = filterValue;
            }
            if (this.checkAlreadyColFiltered(this.column.field)) {
                return;
            }
            this.updateModel();
        };
        Filter.prototype.onPropertyChanged = function (e) {
            if (e.module !== this.getModuleName()) {
                return;
            }
            for (var _i = 0, _a = Object.keys(e.properties); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'columns':
                        if (this.contentRefresh) {
                            this.parent.notify(events.modelChanged, {
                                currentFilterObject: this.currentFilterObject, currentFilteringColumn: this.column ?
                                    this.column.field : undefined,
                                columns: this.filterSettings.columns, requestType: 'filtering', type: events.actionBegin
                            });
                            this.updateFilterMsg();
                        }
                        break;
                    case 'showFilterBarStatus':
                        if (e.properties[prop]) {
                            this.updateFilterMsg();
                        }
                        else if (this.parent.allowPaging) {
                            this.parent.updateExternalMessage('');
                        }
                        break;
                }
            }
        };
        Filter.prototype.clearFiltering = function () {
            var cols = util_2.getActualPropFromColl(this.filterSettings.columns);
            for (var i = 0, len = cols.length; i < len; i++) {
                this.removeFilteredColsByField(cols[i].field, true);
            }
            this.isRemove = true;
            this.filterStatusMsg = '';
            this.updateFilterMsg();
        };
        Filter.prototype.checkAlreadyColFiltered = function (field) {
            var columns = this.filterSettings.columns;
            for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                var col = columns_1[_i];
                if (col.field === field && col.value === this.value &&
                    col.operator === this.operator && col.predicate === this.predicate) {
                    return true;
                }
            }
            return false;
        };
        Filter.prototype.removeFilteredColsByField = function (field, isClearFilterBar) {
            var cols = this.filterSettings.columns;
            for (var i = 0, len = cols.length; i < len; i++) {
                if (cols[i].field === field) {
                    if (!(isClearFilterBar === false)) {
                        this.element.querySelector('#' + cols[i].field + '_filterBarcell').value = '';
                    }
                    cols.splice(i, 1);
                    this.parent.getColumnHeaderByField(field).removeAttribute('aria-filtered');
                    this.isRemove = true;
                    this.parent.notify(events.modelChanged, {
                        requestType: 'filtering', type: events.actionBegin
                    });
                    break;
                }
            }
            this.updateFilterMsg();
        };
        Filter.prototype.getModuleName = function () {
            return 'filter';
        };
        Filter.prototype.keyUpHandler = function (e) {
            var gObj = this.parent;
            var target = e.target;
            if (dom_1.matches(target, '.e-filterbar input')) {
                this.column = gObj.getColumnByField(target.id.split('_')[0]);
                if (!this.column) {
                    return;
                }
                this.updateCrossIcon(target);
                if ((this.filterSettings.mode === 'immediate' || e.keyCode === 13) && e.keyCode !== 9) {
                    this.value = target.value.trim();
                    this.processFilter(e);
                }
            }
        };
        Filter.prototype.updateSpanClass = function (e) {
            var target = e.target;
            if (e.type === 'mousedown' && target.classList.contains('e-cancel')) {
                var targetText = target.previousElementSibling;
                targetText.value = '';
                target.classList.add('e-hide');
                targetText.focus();
                e.preventDefault();
            }
            if (e.type === 'focusin' && target.classList.contains('e-filtertext') && !target.disabled) {
                if (this.lastFilterElement) {
                    this.lastFilterElement.nextElementSibling.classList.add('e-hide');
                }
                this.updateCrossIcon(target);
                this.lastFilterElement = target;
            }
            if (e.type === 'focusin' && !target.classList.contains('e-filtertext') && this.lastFilterElement) {
                this.lastFilterElement.nextElementSibling.classList.add('e-hide');
            }
            return false;
        };
        Filter.prototype.updateCrossIcon = function (element) {
            if (element.value.length) {
                element.nextElementSibling.classList.remove('e-hide');
            }
        };
        Filter.prototype.updateFilterMsg = function () {
            var gObj = this.parent;
            var columns = this.filterSettings.columns;
            var column;
            if (!this.filterSettings.showFilterBarStatus) {
                return;
            }
            if (columns.length > 0 && this.filterStatusMsg !== this.l10n.getConstant('InvalidFilterMessage')) {
                this.filterStatusMsg = '';
                for (var index = 0; index < columns.length; index++) {
                    column = gObj.getColumnByField(columns[index].field);
                    if (index) {
                        this.filterStatusMsg += ' && ';
                    }
                    this.filterStatusMsg += column.headerText + ': ' + this.values[column.field];
                }
            }
            if (gObj.allowPaging) {
                gObj.updateExternalMessage(this.filterStatusMsg);
            }
            this.filterStatusMsg = '';
        };
        Filter.prototype.checkForSkipInput = function (column, value) {
            var isSkip;
            var skipInput;
            if (column.type === 'number') {
                skipInput = ['=', ' ', '!'];
                if (ej2_data_1.DataUtil.operatorSymbols[value] || skipInput.indexOf(value) > -1) {
                    isSkip = true;
                }
            }
            else if (column.type === 'string') {
                skipInput = ['>', '<', '=', '!'];
                for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                    var val = value_1[_i];
                    if (skipInput.indexOf(val) > -1) {
                        isSkip = true;
                    }
                }
            }
            return isSkip;
        };
        Filter.prototype.processFilter = function (e) {
            this.stopTimer();
            this.startTimer(e);
        };
        Filter.prototype.startTimer = function (e) {
            var _this = this;
            this.timer = window.setInterval(function () { _this.onTimerTick(); }, e.keyCode === 13 ? 0 : this.filterSettings.immediateModeDelay);
        };
        Filter.prototype.stopTimer = function () {
            window.clearInterval(this.timer);
        };
        Filter.prototype.onTimerTick = function () {
            var filterElement = this.element.querySelector('#' + this.column.field + '_filterBarcell');
            var filterValue = JSON.parse(JSON.stringify(filterElement.value));
            this.stopTimer();
            if (this.value === '') {
                this.removeFilteredColsByField(this.column.field);
                return;
            }
            this.validateFilterValue(this.value);
            this.filterByColumn(this.column.field, this.operator, this.value, this.predicate, this.matchCase);
            this.values[this.column.field] = filterValue;
            filterElement.value = filterValue;
            this.updateFilterMsg();
        };
        Filter.prototype.validateFilterValue = function (value) {
            var gObj = this.parent;
            var skipInput;
            var index;
            this.matchCase = true;
            switch (this.column.type) {
                case 'number':
                    this.operator = this.filterOperators.equal;
                    skipInput = ['>', '<', '=', '!'];
                    for (var i = 0; i < value.length; i++) {
                        if (skipInput.indexOf(value[i]) > -1) {
                            index = i;
                            break;
                        }
                    }
                    this.getOperator(value.substring(index));
                    if (index !== 0) {
                        this.value = value.substring(0, index);
                    }
                    if (this.value !== '' && value.length >= 1) {
                        this.value = this.valueFormatter.fromView(this.value, this.column.getParser(), this.column.type);
                    }
                    if (isNaN(this.value)) {
                        this.filterStatusMsg = this.l10n.getConstant('InvalidFilterMessage');
                    }
                    break;
                case 'date':
                case 'datetime':
                    this.operator = this.filterOperators.equal;
                    this.getOperator(value);
                    if (this.value !== '') {
                        this.value = this.valueFormatter.fromView(this.value, this.column.getParser(), this.column.type);
                        if (util_1.isNullOrUndefined(this.value)) {
                            this.filterStatusMsg = this.l10n.getConstant('InvalidFilterMessage');
                        }
                    }
                    break;
                case 'string':
                    this.matchCase = false;
                    if (value.charAt(0) === '*') {
                        this.value = this.value.slice(1);
                        this.operator = this.filterOperators.startsWith;
                    }
                    else if (value.charAt(value.length - 1) === '%') {
                        this.value = this.value.slice(0, -1);
                        this.operator = this.filterOperators.startsWith;
                    }
                    else if (value.charAt(0) === '%') {
                        this.value = this.value.slice(1);
                        this.operator = this.filterOperators.endsWith;
                    }
                    else {
                        this.operator = this.filterOperators.startsWith;
                    }
                    break;
                case 'boolean':
                    if (value.toLowerCase() === 'true' || value === '1') {
                        this.value = true;
                    }
                    else if (value.toLowerCase() === 'false' || value === '0') {
                        this.value = false;
                    }
                    else if (value.length) {
                        this.filterStatusMsg = this.l10n.getConstant('InvalidFilterMessage');
                    }
                    this.operator = this.filterOperators.equal;
                    break;
                default:
                    this.operator = this.filterOperators.equal;
            }
        };
        Filter.prototype.getOperator = function (value) {
            var singleOp = value.charAt(0);
            var multipleOp = value.slice(0, 2);
            var operators = util_1.extend({ '=': this.filterOperators.equal, '!': this.filterOperators.notEqual }, ej2_data_1.DataUtil.operatorSymbols);
            if (operators.hasOwnProperty(singleOp) || operators.hasOwnProperty(multipleOp)) {
                this.operator = operators[singleOp];
                this.value = value.substring(1);
                if (!this.operator) {
                    this.operator = operators[multipleOp];
                    this.value = value.substring(2);
                }
            }
            if (this.operator === this.filterOperators.lessThan || this.operator === this.filterOperators.greaterThan) {
                if (this.value.charAt(0) === '=') {
                    this.operator = this.operator + 'orequal';
                    this.value = this.value.substring(1);
                }
            }
        };
        Filter.prototype.columnPositionChanged = function (e) {
            var filterCells = [].slice.call(this.element.querySelectorAll('.e-filterbarcell'));
            filterCells.splice(e.toIndex, 0, filterCells.splice(e.fromIndex, 1)[0]);
            this.element.innerHTML = '';
            for (var _i = 0, filterCells_1 = filterCells; _i < filterCells_1.length; _i++) {
                var cell = filterCells_1[_i];
                this.element.appendChild(cell);
            }
        };
        return Filter;
    }());
    exports.Filter = Filter;
});
