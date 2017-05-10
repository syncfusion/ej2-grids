define(["require", "exports", "@syncfusion/ej2-base", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/dom", "../base/util", "../base/constant"], function (require, exports, ej2_base_1, util_1, dom_1, util_2, events) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Selection = (function () {
        function Selection(parent, selectionSettings) {
            this.selectedRowIndexes = [];
            this.selectedRowCellIndexes = [];
            this.selectedRecords = [];
            this.isMultiShiftRequest = false;
            this.isMultiCtrlRequest = false;
            this.enableSelectMultiTouch = false;
            this.parent = parent;
            this.selectionSettings = selectionSettings;
            this.addEventListener();
        }
        Selection.prototype.initializeSelection = function () {
            ej2_base_1.EventHandler.add(this.parent.getContent(), 'mousedown', this.mouseDownHandler, this);
        };
        Selection.prototype.onActionBegin = function (args, type) {
            this.parent.trigger(type, args);
        };
        Selection.prototype.onActionComplete = function (args, type) {
            this.parent.trigger(type, args);
        };
        Selection.prototype.getModuleName = function () {
            return 'selection';
        };
        Selection.prototype.destroy = function () {
            this.hidePopUp();
            this.clearSelection();
            this.removeEventListener();
            ej2_base_1.EventHandler.remove(this.parent.getContent(), 'mousedown', this.mouseDownHandler);
        };
        Selection.prototype.selectRow = function (index) {
            var gObj = this.parent;
            var selectedRow = gObj.getRowByIndex(index);
            if (!this.isRowType() || !selectedRow) {
                return;
            }
            var isRowSelected = selectedRow.hasAttribute('aria-selected');
            this.clearRow();
            this.onActionBegin({
                data: gObj.currentViewData[index], rowIndex: index, isCtrlPressed: this.isMultiCtrlRequest,
                isShiftPressed: this.isMultiShiftRequest, row: selectedRow, previousRow: gObj.getRows()[this.prevRowIndex],
                previousRowIndex: this.prevRowIndex, target: this.target
            }, events.rowSelecting);
            if (!(index === this.prevRowIndex && isRowSelected)) {
                this.updateRowSelection(selectedRow, index);
            }
            this.updateRowProps(index);
            this.parent.selectedRowIndex = index;
            this.onActionComplete({
                data: gObj.currentViewData[index], rowIndex: index,
                row: selectedRow, previousRow: gObj.getRows()[this.prevRowIndex],
                previousRowIndex: this.prevRowIndex, target: this.target
            }, events.rowSelected);
        };
        Selection.prototype.selectRowsByRange = function (startIndex, endIndex) {
            this.selectRows(this.getCollectionFromIndexes(startIndex, endIndex));
            this.parent.selectedRowIndex = endIndex;
        };
        Selection.prototype.selectRows = function (rowIndexes) {
            var gObj = this.parent;
            var selectedRow = gObj.getRowByIndex(rowIndexes[0]);
            if (this.isSingleSel() || !this.isRowType()) {
                return;
            }
            this.clearRow();
            this.onActionBegin({
                rowIndexes: rowIndexes, row: selectedRow, rowIndex: rowIndexes[0], target: this.target,
                prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest
            }, events.rowSelecting);
            for (var _i = 0, rowIndexes_1 = rowIndexes; _i < rowIndexes_1.length; _i++) {
                var rowIndex = rowIndexes_1[_i];
                this.updateRowSelection(gObj.getRowByIndex(rowIndex), rowIndex);
            }
            this.updateRowProps(rowIndexes[0]);
            this.onActionComplete({
                rowIndexes: rowIndexes, row: selectedRow, rowIndex: rowIndexes[0], target: this.target,
                prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex
            }, events.rowSelected);
        };
        Selection.prototype.addRowsToSelection = function (rowIndexes) {
            var gObj = this.parent;
            var selectedRow = gObj.getRowByIndex(rowIndexes[0]);
            if (this.isSingleSel() || !this.isRowType()) {
                return;
            }
            for (var _i = 0, rowIndexes_2 = rowIndexes; _i < rowIndexes_2.length; _i++) {
                var rowIndex = rowIndexes_2[_i];
                this.onActionBegin({
                    data: gObj.currentViewData[rowIndex], rowIndex: rowIndex, row: selectedRow, target: this.target,
                    prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex,
                    isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest
                }, events.rowSelecting);
                gObj.selectedRowIndex = rowIndex;
                if (this.selectedRowIndexes.indexOf(rowIndex) > -1) {
                    this.selectedRowIndexes.splice(this.selectedRowIndexes.indexOf(rowIndex), 1);
                    this.selectedRecords.splice(this.selectedRecords.indexOf(selectedRow), 1);
                    selectedRow.removeAttribute('aria-selected');
                    this.addRemoveClassesForRow(selectedRow, false, 'e-selectionbackground', 'e-active');
                }
                else {
                    this.updateRowSelection(selectedRow, rowIndex);
                }
                this.updateRowProps(rowIndex);
                this.onActionComplete({
                    data: gObj.currentViewData[rowIndex], rowIndex: rowIndex, row: selectedRow, target: this.target,
                    prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex
                }, events.rowSelected);
            }
        };
        Selection.prototype.getCollectionFromIndexes = function (startIndex, endIndex) {
            var indexes = [];
            var _a = (startIndex < endIndex) ?
                { i: startIndex, max: endIndex } : { i: endIndex, max: startIndex }, i = _a.i, max = _a.max;
            for (; i <= max; i++) {
                indexes.push(i);
            }
            if (startIndex > endIndex) {
                indexes.reverse();
            }
            return indexes;
        };
        Selection.prototype.clearRow = function () {
            this.selectedRowIndexes = [];
            this.selectedRecords = [];
            this.clearRowSelection();
        };
        Selection.prototype.updateRowProps = function (startIndex) {
            this.prevRowIndex = startIndex;
            this.isRowSelected = this.selectedRowIndexes.length && true;
        };
        Selection.prototype.updateRowSelection = function (selectedRow, startIndex) {
            if (!selectedRow) {
                return;
            }
            this.selectedRowIndexes.push(startIndex);
            this.selectedRecords.push(selectedRow);
            selectedRow.setAttribute('aria-selected', 'true');
            this.addRemoveClassesForRow(selectedRow, true, 'e-selectionbackground', 'e-active');
        };
        Selection.prototype.clearSelection = function () {
            var span = this.parent.element.querySelector('.e-gridpopup').querySelector('span');
            if (span.classList.contains('e-rowselect')) {
                span.classList.remove('e-spanclicked');
            }
            this.clearRowSelection();
            this.clearCellSelection();
            this.enableSelectMultiTouch = false;
        };
        Selection.prototype.clearRowSelection = function () {
            if (this.isRowSelected) {
                var selectedRows = this.parent.getContentTable().querySelectorAll('tr[aria-selected="true"]');
                var data = [];
                var row = [];
                var rowIndex = [];
                for (var i = 0, len = this.selectedRowIndexes.length; i < len; i++) {
                    data.push(this.parent.currentViewData[this.selectedRowIndexes[i]]);
                    row.push(this.parent.getRows()[this.selectedRowIndexes[i]]);
                    rowIndex.push(this.selectedRowIndexes[i]);
                }
                if (this.isTrigger) {
                    this.parent.trigger(events.rowDeselecting, {
                        rowIndex: rowIndex, data: data, row: row
                    });
                }
                for (var i = 0, len = selectedRows.length; i < len; i++) {
                    selectedRows[i].removeAttribute('aria-selected');
                    this.addRemoveClassesForRow(selectedRows[i], false, 'e-selectionbackground', 'e-active');
                }
                if (this.isTrigger) {
                    this.parent.trigger(events.rowDeselected, {
                        rowIndex: rowIndex, data: data, row: row
                    });
                }
                this.selectedRowIndexes = [];
                this.selectedRecords = [];
                this.isRowSelected = false;
                this.parent.selectedRowIndex = undefined;
            }
        };
        Selection.prototype.selectCell = function (cellIndex) {
            var gObj = this.parent;
            var selectedCell = gObj.getCellFromIndex(cellIndex.rowIndex, cellIndex.cellIndex);
            if (!this.isCellType() || !selectedCell) {
                return;
            }
            var isCellSelected = selectedCell.classList.contains('e-cellselectionbackground');
            this.clearCell();
            this.onActionBegin({
                data: this.parent.getRows()[cellIndex.rowIndex], cellIndex: cellIndex, currentCell: selectedCell,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
                previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            }, events.cellSelecting);
            if (!(!util_1.isUndefined(this.prevCIdxs) &&
                cellIndex.rowIndex === this.prevCIdxs.rowIndex && cellIndex.cellIndex === this.prevCIdxs.cellIndex &&
                isCellSelected)) {
                this.updateCellSelection(selectedCell, cellIndex.rowIndex, cellIndex.cellIndex);
            }
            this.updateCellProps(cellIndex, cellIndex);
            this.onActionComplete({
                data: this.parent.getRows()[cellIndex.rowIndex], cellIndex: cellIndex, currentCell: selectedCell,
                previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes,
                previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            }, events.cellSelected);
        };
        Selection.prototype.selectCellsByRange = function (startIndex, endIndex) {
            var gObj = this.parent;
            var selectedCell = gObj.getCellFromIndex(startIndex.rowIndex, startIndex.cellIndex);
            var min;
            var max;
            var stIndex = startIndex;
            var edIndex = endIndex;
            var cellIndexes;
            if (this.isSingleSel() || !this.isCellType()) {
                return;
            }
            this.clearCell();
            this.onActionBegin({
                data: this.parent.getRows()[startIndex.rowIndex], cellIndex: startIndex, currentCell: selectedCell,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
                previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            }, events.cellSelecting);
            if (startIndex.rowIndex > endIndex.rowIndex) {
                var temp = startIndex;
                startIndex = endIndex;
                endIndex = temp;
            }
            for (var i = startIndex.rowIndex; i <= endIndex.rowIndex; i++) {
                if (this.selectionSettings.cellSelectionMode !== 'box') {
                    min = i === startIndex.rowIndex ? (startIndex.cellIndex) : 0;
                    max = i === endIndex.rowIndex ? (endIndex.cellIndex) : gObj.getColumns().length - 1;
                }
                else {
                    min = startIndex.cellIndex;
                    max = endIndex.cellIndex;
                }
                cellIndexes = [];
                for (var j = min < max ? min : max, len = min > max ? min : max; j <= len; j++) {
                    selectedCell = gObj.getCellFromIndex(i, j);
                    if (!selectedCell) {
                        continue;
                    }
                    cellIndexes.push(j);
                    selectedCell.classList.add('e-cellselectionbackground');
                }
                this.selectedRowCellIndexes.push({ rowIndex: i, cellIndexes: cellIndexes });
            }
            this.updateCellProps(stIndex, edIndex);
            this.onActionComplete({
                data: this.parent.getRows()[startIndex.rowIndex], cellIndex: startIndex, currentCell: selectedCell,
                previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes,
                previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            }, events.cellSelected);
        };
        Selection.prototype.selectCells = function (rowCellIndexes) {
            var gObj = this.parent;
            var selectedCell = gObj.getCellFromIndex(rowCellIndexes[0].rowIndex, rowCellIndexes[0].cellIndexes[0]);
            if (this.isSingleSel() || !this.isCellType()) {
                return;
            }
            this.onActionBegin({
                data: this.parent.getRows()[rowCellIndexes[0].rowIndex], cellIndex: rowCellIndexes[0].cellIndexes[0],
                currentCell: selectedCell, isCtrlPressed: this.isMultiCtrlRequest,
                isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
                previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            }, events.cellSelecting);
            for (var i = 0, len = rowCellIndexes.length; i < len; i++) {
                for (var j = 0, cellLen = rowCellIndexes[i].cellIndexes.length; j < cellLen; j++) {
                    selectedCell = gObj.getCellFromIndex(rowCellIndexes[i].rowIndex, rowCellIndexes[i].cellIndexes[j]);
                    if (!selectedCell) {
                        continue;
                    }
                    selectedCell.classList.add('e-cellselectionbackground');
                    this.addRowCellIndex({ rowIndex: rowCellIndexes[i].rowIndex, cellIndex: rowCellIndexes[i].cellIndexes[j] });
                }
            }
            this.updateCellProps({ rowIndex: rowCellIndexes[0].rowIndex, cellIndex: rowCellIndexes[0].cellIndexes[0] }, { rowIndex: rowCellIndexes[0].rowIndex, cellIndex: rowCellIndexes[0].cellIndexes[0] });
            this.onActionComplete({
                data: this.parent.getRows()[rowCellIndexes[0].rowIndex], cellIndex: rowCellIndexes[0].cellIndexes[0],
                currentCell: selectedCell,
                previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes,
                previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            }, events.cellSelected);
        };
        Selection.prototype.addCellsToSelection = function (cellIndexes) {
            var gObj = this.parent;
            var selectedCell = gObj.getCellFromIndex(cellIndexes[0].rowIndex, cellIndexes[0].cellIndex);
            var index;
            if (this.isSingleSel() || !this.isCellType()) {
                return;
            }
            for (var _i = 0, cellIndexes_1 = cellIndexes; _i < cellIndexes_1.length; _i++) {
                var cellIndex = cellIndexes_1[_i];
                this.onActionBegin({
                    data: this.parent.getRows()[cellIndexes[0].rowIndex], cellIndex: cellIndexes[0],
                    isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
                    currentCell: selectedCell, isCtrlPressed: this.isMultiCtrlRequest,
                    previousRowCell: this.prevECIdxs ?
                        gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
                }, events.cellSelecting);
                for (var i = 0, len = this.selectedRowCellIndexes.length; i < len; i++) {
                    if (this.selectedRowCellIndexes[i].rowIndex === cellIndex.rowIndex) {
                        index = i;
                        break;
                    }
                }
                if (index > -1) {
                    var selectedCellIdx = this.selectedRowCellIndexes[index].cellIndexes;
                    if (selectedCellIdx.indexOf(cellIndex.cellIndex) > -1) {
                        selectedCellIdx.splice(selectedCellIdx.indexOf(cellIndex.cellIndex), 1);
                        selectedCell.classList.remove('e-cellselectionbackground');
                    }
                    else {
                        this.addRowCellIndex({ rowIndex: cellIndex.rowIndex, cellIndex: cellIndex.cellIndex });
                        selectedCell.classList.add('e-cellselectionbackground');
                    }
                }
                else {
                    this.updateCellSelection(selectedCell, cellIndex.rowIndex, cellIndex.cellIndex);
                }
                this.updateCellProps(cellIndex, cellIndex);
                this.onActionComplete({
                    data: this.parent.getRows()[cellIndexes[0].rowIndex], cellIndex: cellIndexes[0], currentCell: selectedCell,
                    previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) :
                        undefined, previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes
                }, events.cellSelected);
            }
        };
        Selection.prototype.clearCell = function () {
            this.selectedRowCellIndexes = [];
            this.clearCellSelection();
        };
        Selection.prototype.updateCellSelection = function (selectedCell, rowIndex, cellIndex) {
            this.addRowCellIndex({ rowIndex: rowIndex, cellIndex: cellIndex });
            selectedCell.classList.add('e-cellselectionbackground');
        };
        Selection.prototype.updateCellProps = function (startIndex, endIndex) {
            this.prevCIdxs = startIndex;
            this.prevECIdxs = endIndex;
            this.isCellSelected = this.selectedRowCellIndexes.length && true;
        };
        Selection.prototype.addRowCellIndex = function (rowCellIndex) {
            var isRowAvail;
            var index;
            for (var i = 0, len = this.selectedRowCellIndexes.length; i < len; i++) {
                if (this.selectedRowCellIndexes[i].rowIndex === rowCellIndex.rowIndex) {
                    isRowAvail = true;
                    index = i;
                    break;
                }
            }
            if (isRowAvail) {
                if (this.selectedRowCellIndexes[index].cellIndexes.indexOf(rowCellIndex.cellIndex) < 0) {
                    this.selectedRowCellIndexes[index].cellIndexes.push(rowCellIndex.cellIndex);
                }
            }
            else {
                this.selectedRowCellIndexes.push({ rowIndex: rowCellIndex.rowIndex, cellIndexes: [rowCellIndex.cellIndex] });
            }
        };
        Selection.prototype.clearCellSelection = function () {
            if (this.isCellSelected) {
                var gObj = this.parent;
                var selectedCells = gObj.getContentTable().querySelectorAll('.e-cellselectionbackground');
                var rowCell = this.selectedRowCellIndexes;
                var data = [];
                var cells = [];
                for (var i = 0, len = rowCell.length; i < len; i++) {
                    data.push(this.parent.currentViewData[rowCell[i].rowIndex]);
                    for (var j = 0, cLen = rowCell.length; j < cLen; j++) {
                        cells.push(this.parent.getCellFromIndex(rowCell[i].rowIndex, rowCell[i].cellIndexes[j]));
                    }
                }
                if (this.isTrigger) {
                    this.parent.trigger(events.cellDeselecting, {
                        cells: cells, data: data, cellIndexes: rowCell
                    });
                }
                for (var i = 0, len = selectedCells.length; i < len; i++) {
                    selectedCells[i].classList.remove('e-cellselectionbackground');
                }
                this.selectedRowCellIndexes = [];
                this.isCellSelected = false;
                if (this.isTrigger) {
                    this.parent.trigger(events.cellDeselected, {
                        cells: cells, data: data, cellIndexes: rowCell
                    });
                }
            }
        };
        Selection.prototype.mouseMoveHandler = function (e) {
            e.preventDefault();
            var gBRect = this.parent.element.getBoundingClientRect();
            var x1 = this.x;
            var y1 = this.y;
            var position = util_2.getPosition(e);
            var x2 = position.x - gBRect.left;
            var y2 = position.y - gBRect.top;
            var tmp;
            var target = dom_1.closest(e.target, 'tr');
            this.isDragged = true;
            if (!target) {
                target = dom_1.closest(document.elementFromPoint(this.parent.element.offsetLeft + 2, e.clientY), 'tr');
            }
            if (x1 > x2) {
                tmp = x2;
                x2 = x1;
                x1 = tmp;
            }
            if (y1 > y2) {
                tmp = y2;
                y2 = y1;
                y1 = tmp;
            }
            this.element.style.left = x1 + 'px';
            this.element.style.top = y1 + 'px';
            this.element.style.width = x2 - x1 + 'px';
            this.element.style.height = y2 - y1 + 'px';
            if (target && !e.ctrlKey && !e.shiftKey) {
                var rowIndex = parseInt(target.getAttribute('aria-rowindex'), 10);
                this.selectRowsByRange(this.startIndex, rowIndex);
            }
        };
        Selection.prototype.mouseUpHandler = function (e) {
            document.body.classList.remove('e-disableuserselect');
            dom_1.remove(this.element);
            ej2_base_1.EventHandler.remove(this.parent.getContent(), 'mousemove', this.mouseMoveHandler);
            ej2_base_1.EventHandler.remove(document.body, 'mouseup', this.mouseUpHandler);
            this.isDragged = false;
        };
        Selection.prototype.mouseDownHandler = function (e) {
            var target = e.target;
            if (e.shiftKey || e.ctrlKey) {
                e.preventDefault();
            }
            if (this.parent.allowRowDragAndDrop && target.classList.contains('e-rowcell') && !e.shiftKey && !e.ctrlKey) {
                if (!this.isRowType() || this.isSingleSel() || dom_1.closest(target, 'td').classList.contains('e-selectionbackground')) {
                    this.isDragged = false;
                    return;
                }
                document.body.classList.add('e-disableuserselect');
                var tr = dom_1.closest(e.target, 'tr');
                var gBRect = this.parent.element.getBoundingClientRect();
                var postion = util_2.getPosition(e);
                this.startIndex = parseInt(tr.getAttribute('aria-rowindex'), 10);
                this.x = postion.x - gBRect.left;
                this.y = postion.y - gBRect.top;
                this.element = dom_1.createElement('div', { className: 'e-griddragarea' });
                this.parent.getContent().appendChild(this.element);
                ej2_base_1.EventHandler.add(this.parent.getContent(), 'mousemove', this.mouseMoveHandler, this);
                ej2_base_1.EventHandler.add(document.body, 'mouseup', this.mouseUpHandler, this);
            }
        };
        Selection.prototype.addEventListener = function () {
            if (this.parent.isDestroyed) {
                return;
            }
            this.parent.on(events.initialEnd, this.initializeSelection, this);
            this.parent.on(events.rowSelectionComplete, this.onActionComplete, this);
            this.parent.on(events.cellSelectionComplete, this.onActionComplete, this);
            this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
            this.parent.on(events.click, this.clickHandler, this);
            this.parent.on(events.keyPressed, this.keyPressHandler, this);
            this.parent.on(events.dataReady, this.clearSelection, this);
            this.parent.on(events.columnPositionChanged, this.clearSelection, this);
            this.parent.on(events.contentReady, this.initialEnd, this);
        };
        Selection.prototype.removeEventListener = function () {
            this.parent.off(events.initialEnd, this.initializeSelection);
            this.parent.off(events.rowSelectionComplete, this.onActionComplete);
            this.parent.off(events.cellSelectionComplete, this.onActionComplete);
            this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
            this.parent.off(events.click, this.clickHandler);
            this.parent.off(events.keyPressed, this.keyPressHandler);
            this.parent.off(events.dataReady, this.clearSelection);
            this.parent.off(events.columnPositionChanged, this.clearSelection);
        };
        Selection.prototype.onPropertyChanged = function (e) {
            if (e.module !== this.getModuleName()) {
                return;
            }
            var gObj = this.parent;
            if (!util_1.isNullOrUndefined(e.properties.type) && this.selectionSettings.type === 'single') {
                if (this.selectedRowCellIndexes.length > 1) {
                    this.clearCellSelection();
                }
                if (this.selectedRowIndexes.length > 1) {
                    this.clearRowSelection();
                }
                this.enableSelectMultiTouch = false;
                this.hidePopUp();
            }
            if (!util_1.isNullOrUndefined(e.properties.mode) ||
                !util_1.isNullOrUndefined(e.properties.cellSelectionMode)) {
                this.clearSelection();
            }
        };
        Selection.prototype.hidePopUp = function () {
            if (this.parent.element.querySelector('.e-gridpopup').querySelectorAll('.e-rowselect').length) {
                this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
            }
        };
        Selection.prototype.initialEnd = function () {
            this.parent.off(events.contentReady, this.initialEnd);
            this.selectRow(this.parent.selectedRowIndex);
        };
        Selection.prototype.clickHandler = function (e) {
            var target = e.target;
            this.isMultiCtrlRequest = e.ctrlKey || this.enableSelectMultiTouch;
            this.isMultiShiftRequest = e.shiftKey;
            this.popUpClickHandler(e);
            this.target = e.target;
            if (target.classList.contains('e-rowcell')) {
                this.rowCellSelectionHandler(parseInt(target.parentElement.getAttribute('aria-rowindex'), 10), parseInt(target.getAttribute('aria-colindex'), 10));
                if (ej2_base_1.Browser.isDevice && this.parent.selectionSettings.type === 'multiple') {
                    this.showPopup(e);
                }
            }
            this.target = undefined;
            this.isMultiCtrlRequest = false;
            this.isMultiShiftRequest = false;
        };
        Selection.prototype.popUpClickHandler = function (e) {
            var target = e.target;
            if (dom_1.closest(target, '.e-headercell') || e.target.classList.contains('e-rowcell') ||
                dom_1.closest(target, '.e-gridpopup')) {
                if (target.classList.contains('e-rowselect')) {
                    if (!target.classList.contains('e-spanclicked')) {
                        target.classList.add('e-spanclicked');
                        this.enableSelectMultiTouch = true;
                    }
                    else {
                        target.classList.remove('e-spanclicked');
                        this.enableSelectMultiTouch = false;
                        this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
                    }
                }
            }
            else {
                this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
            }
        };
        Selection.prototype.showPopup = function (e) {
            util_2.setCssInGridPopUp(this.parent.element.querySelector('.e-gridpopup'), e, 'e-rowselect e-icons e-icon-rowselect' +
                (this.selectionSettings.type === 'multiple' &&
                    (this.selectedRecords.length > 1 || this.selectedRowCellIndexes.length > 1) ? ' e-spanclicked' : ''));
        };
        Selection.prototype.rowCellSelectionHandler = function (rowIndex, cellIndex) {
            if (!this.isMultiCtrlRequest && !this.isMultiShiftRequest) {
                if (!this.isDragged) {
                    this.selectRow(rowIndex);
                }
                this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex });
            }
            else if (this.isMultiShiftRequest) {
                this.selectRowsByRange(util_1.isUndefined(this.prevRowIndex) ? rowIndex : this.prevRowIndex, rowIndex);
                this.selectCellsByRange(util_1.isUndefined(this.prevCIdxs) ? { rowIndex: rowIndex, cellIndex: cellIndex } : this.prevCIdxs, { rowIndex: rowIndex, cellIndex: cellIndex });
            }
            else {
                this.addRowsToSelection([rowIndex]);
                this.addCellsToSelection([{ rowIndex: rowIndex, cellIndex: cellIndex }]);
            }
            this.isDragged = false;
        };
        Selection.prototype.keyPressHandler = function (e) {
            var checkScroll;
            var preventDefault;
            switch (e.action) {
                case 'downArrow':
                    checkScroll = true;
                    this.downArrowKey();
                    break;
                case 'upArrow':
                    checkScroll = true;
                    this.upArrowKey();
                    break;
                case 'rightArrow':
                    preventDefault = true;
                    this.rightArrowKey();
                    break;
                case 'leftArrow':
                    preventDefault = true;
                    this.leftArrowKey();
                    break;
                case 'home':
                    preventDefault = true;
                    this.homeKey();
                    break;
                case 'end':
                    preventDefault = true;
                    this.endKey();
                    break;
                case 'ctrlHome':
                    preventDefault = true;
                    this.ctrlHomeKey();
                    break;
                case 'ctrlEnd':
                    preventDefault = true;
                    this.ctrlEndKey();
                    break;
                case 'shiftDown':
                    this.shiftDownKey();
                    break;
                case 'shiftUp':
                    this.shiftUpKey();
                    break;
                case 'shiftRight':
                    this.shiftRightKey();
                    break;
                case 'shiftLeft':
                    this.shiftLeftKey();
                    break;
                case 'escape':
                    preventDefault = true;
                    this.clearSelection();
                    break;
                case 'ctrlPlusA':
                    preventDefault = true;
                    this.ctrlPlusA();
                    break;
            }
            if (checkScroll) {
                var scrollElem = this.parent.getContent().firstElementChild;
                if (this.selectedRecords.length || this.selectedRowCellIndexes.length) {
                    var row = this.selectedRecords.length ? this.selectedRecords[0] :
                        this.parent.getRowByIndex(this.selectedRowCellIndexes[0].rowIndex);
                    var height = row.offsetHeight;
                    var rowIndex = row.rowIndex;
                    scrollElem.scrollTop = scrollElem.scrollTop + (e.action === 'downArrow' ? height : height * -1);
                    if (this.checkVisible(row) && rowIndex !== 0 && this.parent.getContent().querySelectorAll('tr').length !== rowIndex + 1) {
                        e.preventDefault();
                    }
                }
            }
            if (preventDefault) {
                e.preventDefault();
            }
        };
        Selection.prototype.checkVisible = function (element) {
            var st = window.scrollY;
            var y = element.getBoundingClientRect().top + st;
            return y + 36 < (window.innerHeight + st) - this.getRowHeight(element) && y > (st - element.offsetHeight) +
                this.getRowHeight(element);
        };
        Selection.prototype.getRowHeight = function (element) {
            return element.getBoundingClientRect().height;
        };
        Selection.prototype.ctrlPlusA = function () {
            if (this.isRowType()) {
                this.selectRowsByRange(0, this.parent.getRows().length - 1);
            }
            if (this.isCellType()) {
                this.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: this.parent.getRows().length - 1, cellIndex: this.parent.getColumns().length - 1 });
            }
        };
        Selection.prototype.downArrowKey = function () {
            this.applyDownUpKey(1, !util_1.isUndefined(this.parent.selectedRowIndex) && this.parent.selectedRowIndex + 1 < this.parent.getRows().length, !util_1.isUndefined(this.prevECIdxs) &&
                this.prevECIdxs.rowIndex + 1 < this.parent.getRows().length);
        };
        Selection.prototype.upArrowKey = function () {
            this.applyDownUpKey(-1, !util_1.isUndefined(this.parent.selectedRowIndex) && this.parent.selectedRowIndex - 1 > -1, !util_1.isUndefined(this.prevECIdxs) && this.prevECIdxs.rowIndex - 1 > -1);
        };
        Selection.prototype.applyDownUpKey = function (key, cond1, cond2) {
            var gObj = this.parent;
            if (this.isRowType() && cond1) {
                this.selectRow(gObj.selectedRowIndex + key);
            }
            if (this.isCellType() && cond2) {
                this.selectCell({ rowIndex: this.prevECIdxs.rowIndex + key, cellIndex: this.prevECIdxs.cellIndex });
            }
        };
        Selection.prototype.rightArrowKey = function () {
            this.applyRightLeftKey(1, 0, !util_1.isUndefined(this.prevECIdxs) && this.prevECIdxs.cellIndex + 1 < this.parent.getColumns().length);
        };
        Selection.prototype.leftArrowKey = function () {
            this.applyRightLeftKey(-1, this.parent.getColumns().length - 1, !util_1.isUndefined(this.prevECIdxs) && this.prevECIdxs.cellIndex - 1 > -1);
        };
        Selection.prototype.applyRightLeftKey = function (key1, key2, cond) {
            var gObj = this.parent;
            if (this.isCellType()) {
                if (cond && this.prevECIdxs.cellIndex + key1 > -1 &&
                    this.prevECIdxs.cellIndex + key1 < this.parent.getColumns().length) {
                    this.selectCell({ rowIndex: this.prevECIdxs.rowIndex, cellIndex: this.prevECIdxs.cellIndex + key1 });
                }
                else if (this.prevECIdxs.rowIndex + key1 > -1 &&
                    this.prevECIdxs.rowIndex + key1 < this.parent.getRows().length) {
                    this.selectCell({ rowIndex: this.prevECIdxs.rowIndex + key1, cellIndex: key2 });
                }
                if (gObj.element.querySelector('.e-cellselectionbackground').classList.contains('e-hide')) {
                    this.applyRightLeftKey(key1, key2, cond);
                }
            }
        };
        Selection.prototype.homeKey = function () {
            this.applyHomeEndKey({ rowIndex: 0, cellIndex: 0 });
        };
        Selection.prototype.endKey = function () {
            this.applyHomeEndKey({ rowIndex: this.parent.getRows().length - 1, cellIndex: this.parent.getColumns().length - 1 });
        };
        Selection.prototype.applyHomeEndKey = function (key) {
            if (this.isCellType()) {
                this.selectCell(key);
            }
        };
        Selection.prototype.shiftDownKey = function () {
            var gObj = this.parent;
            this.isMultiShiftRequest = true;
            if (this.isRowType()) {
                if (!util_1.isUndefined(this.prevRowIndex)) {
                    var endIndex = util_1.isUndefined(gObj.selectedRowIndex) ? this.prevRowIndex + 1 :
                        (gObj.selectedRowIndex + 1 < this.parent.getRows().length ?
                            gObj.selectedRowIndex + 1 : gObj.selectedRowIndex);
                    if (endIndex < this.parent.getRows().length) {
                        this.selectRowsByRange(this.prevRowIndex, endIndex);
                    }
                }
                else {
                    this.selectRow(0);
                }
            }
            if (this.isCellType()) {
                if (!util_1.isUndefined(this.prevCIdxs)) {
                    if (this.prevECIdxs.rowIndex + 1 < this.parent.getRows().length) {
                        this.selectCellsByRange(this.prevCIdxs, { rowIndex: this.prevECIdxs.rowIndex + 1, cellIndex: this.prevECIdxs.cellIndex });
                    }
                }
                else {
                    this.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: 1, cellIndex: 0 });
                }
            }
            this.isMultiShiftRequest = false;
        };
        Selection.prototype.shiftUpKey = function () {
            var gObj = this.parent;
            this.isMultiShiftRequest = true;
            if (this.isRowType() && !util_1.isUndefined(this.prevRowIndex)) {
                var endIndex = util_1.isUndefined(gObj.selectedRowIndex) ? (this.prevRowIndex - 1 > -1 ? (this.prevRowIndex - 1) : 0) :
                    ((gObj.selectedRowIndex - 1) > -1 ? gObj.selectedRowIndex - 1 : gObj.selectedRowIndex);
                this.selectRowsByRange(this.prevRowIndex, endIndex);
            }
            if (this.isCellType() && !util_1.isUndefined(this.prevECIdxs) && (this.prevECIdxs.rowIndex - 1) > -1) {
                this.selectCellsByRange(this.prevCIdxs, { rowIndex: this.prevECIdxs.rowIndex - 1, cellIndex: this.prevECIdxs.cellIndex });
            }
            this.isMultiShiftRequest = false;
        };
        Selection.prototype.shiftLeftKey = function () {
            this.applyShiftLeftRightKey(-1, !util_1.isUndefined(this.prevCIdxs) && this.prevECIdxs.cellIndex - 1 > -1);
        };
        Selection.prototype.shiftRightKey = function () {
            this.applyShiftLeftRightKey(1, !util_1.isUndefined(this.prevCIdxs) && this.prevECIdxs.cellIndex + 1 < this.parent.getColumns().length);
        };
        Selection.prototype.applyShiftLeftRightKey = function (key, cond) {
            var gObj = this.parent;
            this.isMultiShiftRequest = true;
            if (this.isCellType()) {
                if (cond) {
                    this.selectCellsByRange(this.prevCIdxs, {
                        rowIndex: this.prevECIdxs.rowIndex, cellIndex: this.prevECIdxs.cellIndex + key
                    });
                }
                else {
                    if (this.selectionSettings.cellSelectionMode === 'flow' &&
                        (key > 0 ? this.prevECIdxs.rowIndex + 1 < this.parent.pageSettings.pageSize : this.prevECIdxs.rowIndex - 1 > -1)) {
                        this.selectCellsByRange(this.prevCIdxs, {
                            rowIndex: this.prevECIdxs.rowIndex + key, cellIndex: key > 0 ? 0 : gObj.getColumns().length - 1
                        });
                    }
                }
            }
            this.isMultiShiftRequest = false;
        };
        Selection.prototype.ctrlHomeKey = function () {
            this.applyCtrlHomeEndKey(0, 0);
        };
        Selection.prototype.ctrlEndKey = function () {
            this.applyCtrlHomeEndKey(this.parent.getRows().length - 1, this.parent.getColumns().length - 1);
        };
        Selection.prototype.applyCtrlHomeEndKey = function (rowIndex, colIndex) {
            if (this.isRowType()) {
                this.selectRow(rowIndex);
            }
            if (this.isCellType()) {
                this.selectCell({ rowIndex: rowIndex, cellIndex: colIndex });
            }
        };
        Selection.prototype.addRemoveClassesForRow = function (row, isAdd) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var cells = row.querySelectorAll('.e-rowcell');
            for (var i = 0, len = cells.length; i < len; i++) {
                if (isAdd) {
                    dom_1.classList(cells[i], args.slice(), []);
                }
                else {
                    dom_1.classList(cells[i], [], args.slice());
                }
            }
        };
        Selection.prototype.isRowType = function () {
            return this.selectionSettings.mode === 'row' || this.selectionSettings.mode === 'both';
        };
        Selection.prototype.isCellType = function () {
            return this.selectionSettings.mode === 'cell' || this.selectionSettings.mode === 'both';
        };
        Selection.prototype.isSingleSel = function () {
            return this.selectionSettings.type === 'single';
        };
        return Selection;
    }());
    exports.Selection = Selection;
});
