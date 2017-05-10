define(["require", "exports", "@syncfusion/ej2-base", "@syncfusion/ej2-base/dom", "@syncfusion/ej2-base/util", "../base/util", "../base/constant", "../services/aria-service"], function (require, exports, ej2_base_1, dom_1, util_1, util_2, events, aria_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Group = (function () {
        function Group(parent, groupSettings, sortedColumns, serviceLocator) {
            this.contentRefresh = true;
            this.aria = new aria_service_1.AriaService();
            this.parent = parent;
            this.groupSettings = groupSettings;
            this.serviceLocator = serviceLocator;
            this.sortedColumns = sortedColumns;
            this.addEventListener();
        }
        Group.prototype.drag = function (e) {
            var gObj = this.parent;
            var cloneElement = this.parent.element.querySelector('.e-cloneproperties');
            dom_1.classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
            if (!util_2.parentsUntil(e.target, 'e-groupdroparea') &&
                !(this.parent.allowReordering && util_2.parentsUntil(e.target, 'e-headercell'))) {
                dom_1.classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
            }
            e.target.classList.contains('e-groupdroparea') ? this.element.classList.add('e-hover') : this.element.classList.remove('e-hover');
        };
        Group.prototype.dragStart = function (e) {
            if (e.target.classList.contains('e-stackedheadercell')) {
                return;
            }
            var gObj = this.parent;
            var dropArea = this.parent.element.querySelector('.e-groupdroparea');
            this.aria.setDropTarget(dropArea, e.column.allowGrouping);
            var element = e.target.classList.contains('e-headercell') ? e.target : util_2.parentsUntil(e.target, 'e-headercell');
            this.aria.setGrabbed(element, true, !e.column.allowGrouping);
        };
        Group.prototype.columnDrop = function (e) {
            var gObj = this.parent;
            if (e.droppedElement.getAttribute('action') === 'grouping') {
                var column = gObj.getColumnByUid(e.droppedElement.getAttribute('e-mappinguid'));
                if (util_1.isNullOrUndefined(column) || column.allowGrouping === false ||
                    util_2.parentsUntil(gObj.getColumnHeaderByUid(column.uid), 'e-grid').getAttribute('id') !==
                        gObj.element.getAttribute('id')) {
                    return;
                }
                this.ungroupColumn(column.field);
            }
        };
        Group.prototype.addEventListener = function () {
            if (this.parent.isDestroyed) {
                return;
            }
            this.parent.on(events.uiUpdate, this.enableAfterRender, this);
            this.parent.on(events.groupComplete, this.onActionComplete, this);
            this.parent.on(events.ungroupComplete, this.onActionComplete, this);
            this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
            this.parent.on(events.click, this.clickHandler, this);
            this.parent.on(events.columnDrag, this.drag, this);
            this.parent.on(events.columnDragStart, this.dragStart, this);
            this.parent.on(events.columnDrop, this.columnDrop, this);
            this.parent.on(events.headerRefreshed, this.refreshSortIcons, this);
            this.parent.on(events.sortComplete, this.refreshSortIcons, this);
            this.parent.on(events.keyPressed, this.keyPressHandler, this);
            this.parent.on(events.contentReady, this.initialEnd, this);
            this.parent.on(events.initialEnd, this.render, this);
            this.parent.on(events.headerDrop, this.headerDrop, this);
        };
        Group.prototype.removeEventListener = function () {
            this.parent.off(events.initialEnd, this.render);
            this.parent.off(events.uiUpdate, this.enableAfterRender);
            this.parent.off(events.groupComplete, this.onActionComplete);
            this.parent.off(events.ungroupComplete, this.onActionComplete);
            this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
            this.parent.off(events.click, this.clickHandler);
            this.parent.off(events.columnDrag, this.drag);
            this.parent.off(events.columnDragStart, this.dragStart);
            this.parent.off(events.columnDrop, this.columnDrop);
            this.parent.off(events.headerRefreshed, this.refreshSortIcons);
            this.parent.off(events.sortComplete, this.refreshSortIcons);
            this.parent.off(events.keyPressed, this.keyPressHandler);
            this.parent.off(events.headerDrop, this.headerDrop);
        };
        Group.prototype.initialEnd = function () {
            var gObj = this.parent;
            this.parent.off(events.contentReady, this.initialEnd);
            if (this.parent.getColumns().length && this.groupSettings.columns.length) {
                this.contentRefresh = false;
                for (var _i = 0, _a = gObj.groupSettings.columns; _i < _a.length; _i++) {
                    var col = _a[_i];
                    this.groupColumn(col);
                }
                this.contentRefresh = true;
            }
            this.recalcIndentWidth();
        };
        Group.prototype.keyPressHandler = function (e) {
            var gObj = this.parent;
            if (!this.groupSettings.columns.length) {
                return;
            }
            e.preventDefault();
            switch (e.action) {
                case 'altDownArrow':
                case 'altUpArrow':
                    var selected = gObj.allowSelection ? gObj.getSelectedRowIndexes() : [];
                    if (selected.length) {
                        var selIndex = selected[selected.length - 1];
                        var rows = gObj.getRows();
                        var dataRow = gObj.getContent().querySelector('tr[aria-rowindex="' + selIndex + '"]');
                        var grpRow = void 0;
                        for (var i = dataRow.rowIndex; i >= 0; i--) {
                            if (!rows[i].classList.contains('e-row')) {
                                grpRow = rows[i];
                                break;
                            }
                        }
                        this.expandCollapseRows(grpRow.querySelector(e.action === 'altUpArrow' ?
                            '.e-recordplusexpand' : '.e-recordpluscollapse'));
                    }
                    break;
                case 'ctrlDownArrow':
                    this.expandAll();
                    break;
                case 'ctrlUpArrow':
                    this.collapseAll();
                    break;
            }
        };
        Group.prototype.clickHandler = function (e) {
            this.expandCollapseRows(e.target);
            this.applySortFromTarget(e.target);
            this.unGroupFromTarget(e.target);
            this.toogleGroupFromHeader(e.target);
        };
        Group.prototype.unGroupFromTarget = function (target) {
            if (target.classList.contains('e-ungroupbutton')) {
                this.ungroupColumn(target.parentElement.getAttribute('ej-mappingname'));
            }
        };
        Group.prototype.toogleGroupFromHeader = function (target) {
            if (this.groupSettings.showToggleButton) {
                if (target.classList.contains('e-grptogglebtn')) {
                    if (target.classList.contains('e-toggleungroup')) {
                        this.ungroupColumn(this.parent.getColumnByUid(target.parentElement.getAttribute('e-mappinguid')).field);
                    }
                    else {
                        this.groupColumn(this.parent.getColumnByUid(target.parentElement.getAttribute('e-mappinguid')).field);
                    }
                }
                else {
                    if (target.classList.contains('e-toggleungroup')) {
                        this.ungroupColumn(target.parentElement.getAttribute('ej-mappingname'));
                    }
                }
            }
        };
        Group.prototype.applySortFromTarget = function (target) {
            var gObj = this.parent;
            var gHeader = dom_1.closest(target, '.e-groupheadercell');
            if (gObj.allowSorting && gHeader && !target.classList.contains('e-ungroupbutton') &&
                !target.classList.contains('e-toggleungroup')) {
                var field = gHeader.firstElementChild.getAttribute('ej-mappingname');
                if (gObj.getColumnHeaderByField(field).querySelectorAll('.e-ascending').length) {
                    gObj.sortColumn(field, 'descending', true);
                }
                else {
                    gObj.sortColumn(field, 'ascending', true);
                }
            }
        };
        Group.prototype.expandCollapseRows = function (target) {
            var trgt = util_2.parentsUntil(target, 'e-recordplusexpand') ||
                util_2.parentsUntil(target, 'e-recordpluscollapse');
            if (trgt) {
                var cellIdx = trgt.cellIndex;
                var rowIdx = trgt.parentElement.rowIndex;
                var rowNodes = this.parent.getContent().querySelectorAll('tr');
                var rows = [].slice.call(rowNodes).slice(rowIdx + 1, rowNodes.length);
                var isHide = void 0;
                var expandElem = void 0;
                var toExpand = [];
                var indent = trgt.parentElement.querySelectorAll('.e-indentcell').length;
                var expand = false;
                if (trgt.classList.contains('e-recordpluscollapse')) {
                    trgt.className = 'e-recordplusexpand';
                    trgt.firstElementChild.className = 'e-icons e-gdiagonaldown e-icon-gdownarrow';
                    expand = true;
                }
                else {
                    isHide = true;
                    trgt.className = 'e-recordpluscollapse';
                    trgt.firstElementChild.className = 'e-icons e-gnextforward e-icon-grightarrow';
                }
                this.aria.setExpand(trgt, expand);
                for (var i = 0, len = rows.length; i < len; i++) {
                    if (rows[i].querySelectorAll('td')[cellIdx] && rows[i].querySelectorAll('td')[cellIdx].classList.contains('e-indentcell')) {
                        if (isHide) {
                            rows[i].style.display = 'none';
                        }
                        else {
                            if (rows[i].querySelectorAll('.e-indentcell').length === indent + 1) {
                                rows[i].style.display = '';
                                expandElem = rows[i].querySelector('.e-recordplusexpand');
                                if (expandElem) {
                                    toExpand.push(expandElem);
                                }
                            }
                        }
                    }
                    else {
                        break;
                    }
                }
                for (var i = 0, len = toExpand.length; i < len; i++) {
                    toExpand[i].className = 'e-recordpluscollapse';
                    toExpand[i].firstElementChild.className = 'e-icons e-gnextforward e-icon-grightarrow';
                    this.expandCollapseRows(toExpand[i]);
                }
            }
        };
        Group.prototype.expandCollapse = function (isExpand) {
            var rowNodes = this.parent.getContent().querySelectorAll('tr');
            var row;
            for (var i = 0, len = rowNodes.length; i < len; i++) {
                if (rowNodes[i].querySelectorAll('.e-recordplusexpand, .e-recordpluscollapse').length) {
                    row = rowNodes[i].querySelector(isExpand ? '.e-recordpluscollapse' : '.e-recordplusexpand');
                    if (row) {
                        row.className = isExpand ? 'e-recordplusexpand' : 'e-recordpluscollapse';
                        row.firstElementChild.className = isExpand ? 'e-icons e-gdiagonaldown e-icon-gdownarrow' :
                            'e-icons e-gnextforward e-icon-grightarrow';
                    }
                    if (!(rowNodes[i].firstElementChild.classList.contains('e-recordplusexpand') ||
                        rowNodes[i].firstElementChild.classList.contains('e-recordpluscollapse'))) {
                        rowNodes[i].style.display = isExpand ? '' : 'none';
                    }
                }
                else {
                    rowNodes[i].style.display = isExpand ? '' : 'none';
                }
            }
        };
        Group.prototype.expandAll = function () {
            this.expandCollapse(true);
        };
        Group.prototype.collapseAll = function () {
            this.expandCollapse(false);
        };
        Group.prototype.render = function () {
            this.l10n = this.serviceLocator.getService('localization');
            this.renderGroupDropArea();
            this.initDragAndDrop();
            this.refreshToggleBtn();
        };
        Group.prototype.renderGroupDropArea = function () {
            this.element = dom_1.createElement('div', { className: 'e-groupdroparea' });
            this.updateGroupDropArea();
            this.parent.element.insertBefore(this.element, this.parent.element.firstChild);
            if (!this.groupSettings.showDropArea) {
                this.element.style.display = 'none';
            }
        };
        Group.prototype.updateGroupDropArea = function () {
            if (this.groupSettings.showDropArea && !this.groupSettings.columns.length) {
                var dragLabel = this.l10n.getConstant('GroupDropArea');
                this.element.innerHTML = dragLabel;
                this.element.classList.remove('e-grouped');
            }
            else {
                if (this.element.innerHTML === this.l10n.getConstant('GroupDropArea') && this.groupSettings.columns.length === 1) {
                    this.element.innerHTML = '';
                }
                this.element.classList.add('e-grouped');
            }
        };
        Group.prototype.initDragAndDrop = function () {
            this.initializeGHeaderDrop();
            this.initializeGHeaderDrag();
        };
        Group.prototype.initializeGHeaderDrag = function () {
            var _this = this;
            var gObj = this.parent;
            var column;
            var visualElement = dom_1.createElement('div', {
                className: 'e-cloneproperties e-dragclone e-gdclone',
                styles: 'line-height:23px', attrs: { action: 'grouping' }
            });
            var drag = new ej2_base_1.Draggable(this.element, {
                dragTarget: '.e-groupheadercell',
                distance: 5,
                helper: function (e) {
                    var target = e.sender.target;
                    var element = target.classList.contains('e-groupheadercell') ? target :
                        util_2.parentsUntil(target, 'e-groupheadercell');
                    if (!element) {
                        return false;
                    }
                    column = gObj.getColumnByField(element.firstElementChild.getAttribute('ej-mappingname'));
                    visualElement.textContent = element.textContent;
                    visualElement.style.width = element.offsetWidth + 2 + 'px';
                    visualElement.style.height = element.offsetHeight + 2 + 'px';
                    visualElement.setAttribute('e-mappinguid', column.uid);
                    gObj.element.appendChild(visualElement);
                    return visualElement;
                },
                dragStart: function () {
                    gObj.element.classList.add('e-ungroupdrag');
                },
                drag: function (e) {
                    var target = e.target;
                    var cloneElement = _this.parent.element.querySelector('.e-cloneproperties');
                    gObj.trigger(events.columnDrag, { target: target, draggableType: 'headercell', column: column });
                    dom_1.classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
                    if (!(util_2.parentsUntil(target, 'e-gridcontent') || util_2.parentsUntil(target, 'e-headercell'))) {
                        dom_1.classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                    }
                },
                dragStop: function (e) {
                    gObj.element.classList.remove('e-ungroupdrag');
                    if (!(util_2.parentsUntil(e.target, 'e-gridcontent') || util_2.parentsUntil(e.target, 'e-gridheader'))) {
                        dom_1.remove(e.helper);
                        return;
                    }
                }
            });
        };
        Group.prototype.headerDrop = function (e) {
            if (!e.uid) {
                return;
            }
            var column = this.parent.getColumnByUid(e.uid);
            this.ungroupColumn(column.field);
        };
        Group.prototype.initializeGHeaderDrop = function () {
            var _this = this;
            var gObj = this.parent;
            var drop = new ej2_base_1.Droppable(this.element, {
                accept: '.e-dragclone',
                drop: function (e) {
                    var column = gObj.getColumnByUid(e.droppedElement.getAttribute('e-mappinguid'));
                    _this.element.classList.remove('e-hover');
                    dom_1.remove(e.droppedElement);
                    _this.aria.setDropTarget(_this.parent.element.querySelector('.e-groupdroparea'), false);
                    _this.aria.setGrabbed(_this.parent.getHeaderTable().querySelector('[aria-grabbed=true]'), false);
                    if (util_1.isNullOrUndefined(column) || column.allowGrouping === false ||
                        util_2.parentsUntil(gObj.getColumnHeaderByUid(column.uid), 'e-grid').getAttribute('id') !==
                            gObj.element.getAttribute('id')) {
                        return;
                    }
                    _this.groupColumn(column.field);
                }
            });
        };
        Group.prototype.groupColumn = function (columnName) {
            var gObj = this.parent;
            var column = gObj.getColumnByField(columnName);
            if (util_1.isNullOrUndefined(column) || column.allowGrouping === false ||
                (this.contentRefresh && this.groupSettings.columns.indexOf(columnName) > -1)) {
                return;
            }
            column.visible = gObj.groupSettings.showGroupedColumn;
            this.colName = columnName;
            if (this.contentRefresh) {
                this.updateModel();
            }
            else {
                this.addColToGroupDrop(columnName);
            }
            this.updateGroupDropArea();
        };
        Group.prototype.ungroupColumn = function (columnName) {
            var gObj = this.parent;
            var column = gObj.getColumnByField(columnName);
            if (util_1.isNullOrUndefined(column) || column.allowGrouping === false || this.groupSettings.columns.indexOf(columnName) < 0) {
                return;
            }
            column.visible = true;
            this.colName = column.field;
            var columns = JSON.parse(JSON.stringify(this.groupSettings.columns));
            columns.splice(columns.indexOf(this.colName), 1);
            if (this.sortedColumns.indexOf(columnName) < 0) {
                for (var i = 0, len = gObj.sortSettings.columns.length; i < len; i++) {
                    if (columnName === gObj.sortSettings.columns[i].field) {
                        gObj.sortSettings.columns.splice(i, 1);
                        break;
                    }
                }
            }
            this.groupSettings.columns = columns;
            if (gObj.allowGrouping) {
                this.parent.dataBind();
            }
        };
        Group.prototype.updateModel = function () {
            var gObj = this.parent;
            var i = 0;
            var columns = JSON.parse(JSON.stringify(this.groupSettings.columns));
            columns.push(this.colName);
            this.groupSettings.columns = columns;
            while (i < gObj.sortSettings.columns.length) {
                if (gObj.sortSettings.columns[i].field === this.colName) {
                    break;
                }
                i++;
            }
            if (gObj.sortSettings.columns.length === i) {
                gObj.sortSettings.columns.push({ field: this.colName, direction: 'ascending' });
            }
            else if (!gObj.allowSorting) {
                gObj.sortSettings.columns[i].direction = 'ascending';
            }
            this.parent.dataBind();
        };
        Group.prototype.onActionComplete = function (e) {
            var gObj = this.parent;
            if (e.requestType === 'grouping') {
                this.addColToGroupDrop(this.colName);
            }
            else {
                this.removeColFromGroupDrop(this.colName);
            }
            var args = this.groupSettings.columns.indexOf(this.colName) > -1 ? {
                columnName: this.colName, requestType: 'grouping', type: events.actionComplete
            } : { requestType: 'ungrouping', type: events.actionComplete };
            this.parent.trigger(events.actionComplete, util_1.extend(e, args));
        };
        Group.prototype.recalcIndentWidth = function () {
            var gObj = this.parent;
            if (!gObj.groupSettings.columns.length || gObj.getHeaderTable().querySelector('.e-emptycell').getAttribute('indentRefreshed') ||
                !gObj.getContentTable()) {
                return;
            }
            var indentWidth = gObj.getHeaderTable().querySelector('.e-grouptopleftcell').offsetWidth;
            var headerCol = [].slice.call(gObj.getHeaderTable().querySelector('colgroup').childNodes);
            var contentCol = [].slice.call(gObj.getContentTable().querySelector('colgroup').childNodes);
            var perPixel = indentWidth / 30;
            if (perPixel >= 1) {
                indentWidth = (30 / perPixel);
            }
            for (var i = 0; i < this.groupSettings.columns.length; i++) {
                headerCol[i].style.width = indentWidth + 'px';
                contentCol[i].style.width = indentWidth + 'px';
            }
            gObj.getHeaderTable().querySelector('.e-emptycell').setAttribute('indentRefreshed', 'true');
        };
        Group.prototype.addColToGroupDrop = function (field) {
            var gObj = this.parent;
            var direction = 'ascending';
            var groupedColumn = dom_1.createElement('div', { className: 'e-grid-icon e-groupheadercell' });
            var childDiv = dom_1.createElement('div', { attrs: { 'ej-mappingname': field } });
            var column = this.parent.getColumnByField(field);
            var headerCell = gObj.getColumnHeaderByUid(column.uid);
            childDiv.appendChild(dom_1.createElement('span', { className: 'e-grouptext', innerHTML: column.headerText }));
            if (this.groupSettings.showToggleButton) {
                childDiv.appendChild(dom_1.createElement('span', { className: 'e-togglegroupbutton e-icons e-icon-ungroup e-toggleungroup', innerHTML: '&nbsp;' }));
            }
            if (headerCell.querySelectorAll('.e-ascending,.e-descending').length) {
                direction = headerCell.querySelector('.e-ascending') ? 'ascending' : 'descending';
            }
            childDiv.appendChild(dom_1.createElement('span', { className: 'e-groupsort e-icons ' + ('e-' + direction + ' e-icon-' + direction), innerHTML: '&nbsp;' }));
            childDiv.appendChild(dom_1.createElement('span', {
                className: 'e-ungroupbutton e-icons e-icon-hide',
                attrs: { title: this.l10n.getConstant('UnGroup'), innerHTML: '&nbsp;' },
                styles: this.groupSettings.showUngroupButton ? '' : 'display:none'
            }));
            groupedColumn.appendChild(childDiv);
            this.element.appendChild(groupedColumn);
        };
        Group.prototype.refreshToggleBtn = function (isRemove) {
            if (this.groupSettings.showToggleButton) {
                var headers = [].slice.call(this.parent.element.getElementsByClassName('e-headercelldiv'));
                for (var i = 0, len = headers.length; i < len; i++) {
                    if (!(headers[i].classList.contains('e-emptycell'))) {
                        var column = this.parent.getColumnByUid(headers[i].getAttribute('e-mappinguid'));
                        if (headers[i].querySelectorAll('.e-grptogglebtn').length) {
                            dom_1.remove(headers[i].querySelectorAll('.e-grptogglebtn')[0]);
                        }
                        if (!isRemove) {
                            headers[i].appendChild(dom_1.createElement('span', {
                                className: 'e-grptogglebtn e-icons ' +
                                    (this.groupSettings.columns.indexOf(column.field) > -1 ? 'e-toggleungroup e-icon-ungroup'
                                        : 'e-togglegroup e-icon-group')
                            }));
                        }
                    }
                }
            }
        };
        Group.prototype.removeColFromGroupDrop = function (field) {
            dom_1.remove(this.getGHeaderCell(field));
            this.updateGroupDropArea();
        };
        Group.prototype.onPropertyChanged = function (e) {
            if (e.module !== this.getModuleName()) {
                return;
            }
            for (var _i = 0, _a = Object.keys(e.properties); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'columns':
                        if (this.contentRefresh) {
                            var args = this.groupSettings.columns.indexOf(this.colName) > -1 ? {
                                columnName: this.colName, requestType: 'grouping', type: events.actionBegin
                            } : { requestType: 'ungrouping', type: events.actionBegin };
                            this.parent.notify(events.modelChanged, args);
                        }
                        break;
                    case 'showDropArea':
                        this.groupSettings.showDropArea ? this.element.style.display = '' : this.element.style.display = 'none';
                        break;
                    case 'showGroupedColumn':
                        this.updateGroupedColumn(this.groupSettings.showGroupedColumn);
                        this.parent.notify(events.modelChanged, { requestType: 'refresh' });
                        break;
                    case 'showUngroupButton':
                        this.updateButtonVisibility(this.groupSettings.showUngroupButton, 'e-ungroupbutton');
                        break;
                    case 'showToggleButton':
                        this.updateButtonVisibility(this.groupSettings.showToggleButton, 'e-togglegroupbutton ');
                        this.parent.refreshHeader();
                        break;
                }
            }
        };
        Group.prototype.updateGroupedColumn = function (isVisible) {
            for (var i = 0; i < this.groupSettings.columns.length; i++) {
                this.parent.getColumnByField(this.groupSettings.columns[i]).visible = isVisible;
            }
        };
        Group.prototype.updateButtonVisibility = function (isVisible, className) {
            var gHeader = [].slice.call(this.element.querySelectorAll('.' + className));
            for (var i = 0; i < gHeader.length; i++) {
                gHeader[i].style.display = isVisible ? '' : 'none';
            }
        };
        Group.prototype.enableAfterRender = function (e) {
            if (e.module === this.getModuleName() && e.enable) {
                this.render();
            }
        };
        Group.prototype.destroy = function () {
            this.clearGrouping();
            this.removeEventListener();
            this.refreshToggleBtn(true);
            dom_1.remove(this.element);
        };
        Group.prototype.clearGrouping = function () {
            var cols = JSON.parse(JSON.stringify(this.groupSettings.columns));
            this.contentRefresh = false;
            for (var i = 0, len = cols.length; i < len; i++) {
                this.ungroupColumn(cols[i]);
            }
            this.contentRefresh = true;
        };
        Group.prototype.getModuleName = function () {
            return 'group';
        };
        Group.prototype.refreshSortIcons = function (e) {
            var gObj = this.parent;
            var header;
            var cols = gObj.sortSettings.columns;
            var gCols = gObj.groupSettings.columns;
            this.recalcIndentWidth();
            this.refreshToggleBtn();
            for (var i = 0, len = cols.length; i < len; i++) {
                header = gObj.getColumnHeaderByField(cols[i].field);
                if (!gObj.allowSorting && (this.sortedColumns.indexOf(cols[i].field) > -1 ||
                    this.groupSettings.columns.indexOf(cols[i].field) > -1)) {
                    dom_1.classList(header.querySelector('.e-sortfilterdiv'), ['e-ascending', 'e-icon-ascending'], []);
                    if (cols.length > 1) {
                        header.querySelector('.e-headercelldiv').appendChild(dom_1.createElement('span', { className: 'e-sortnumber', innerHTML: (i + 1).toString() }));
                    }
                }
                else if (this.getGHeaderCell(cols[i].field) && this.getGHeaderCell(cols[i].field).querySelectorAll('.e-groupsort').length) {
                    if (cols[i].direction === 'ascending') {
                        dom_1.classList(this.getGHeaderCell(cols[i].field).querySelector('.e-groupsort'), ['e-ascending', 'e-icon-ascending'], ['e-descending', 'e-icon-descending']);
                    }
                    else {
                        dom_1.classList(this.getGHeaderCell(cols[i].field).querySelector('.e-groupsort'), ['e-descending', 'e-icon-descending'], ['e-ascending', 'e-icon-ascending']);
                    }
                }
            }
            for (var i = 0, len = gCols.length; i < len; i++) {
                gObj.getColumnHeaderByField(gCols[i]).setAttribute('aria-grouped', 'true');
            }
        };
        Group.prototype.getGHeaderCell = function (field) {
            if (this.element && this.element.querySelector('[ej-mappingname=' + field + ']')) {
                return this.element.querySelector('[ej-mappingname=' + field + ']').parentElement;
            }
            return null;
        };
        return Group;
    }());
    exports.Group = Group;
});
