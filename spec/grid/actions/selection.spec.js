define(["require", "exports", "@syncfusion/ej2-base", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../../../src/grid/actions/selection", "../../../src/grid/actions/page", "../base/datasource.spec", "../../../src/grid/actions/group", "../../../src/grid/actions/sort", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, ej2_base_1, dom_1, grid_1, selection_1, page_1, datasource_spec_1, group_1, sort_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    grid_1.Grid.Inject(selection_1.Selection, page_1.Page, sort_1.Sort, group_1.Group);
    describe('Selection Shortcuts testing', function () {
        var gridObj;
        var preventDefault = new Function();
        var elem = dom_1.createElement('div', { id: 'Grid' });
        var selectionModule;
        var rows;
        beforeAll(function (done) {
            var dataBound = function () { done(); };
            document.body.appendChild(elem);
            gridObj = new grid_1.Grid({
                dataSource: datasource_spec_1.data, dataBound: dataBound,
                columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                allowPaging: true,
                pageSettings: { pageSize: 8, pageCount: 4, currentPage: 1 },
                allowSelection: true,
                selectionSettings: { type: 'multiple', mode: 'both' },
            });
            gridObj.appendTo('#Grid');
        });
        it('shiftDown intial cell, row shortcut testing', function () {
            var args = { action: 'shiftDown', preventDefault: preventDefault };
            var len = 5;
            gridObj.element.focus();
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            gridObj.keyBoardModule.keyAction(args);
            for (var i = 0; i <= 1; i++) {
                if (i === 1) {
                    len = 1;
                }
                for (var j = 0; j < len; j++) {
                    expect(rows[i].querySelectorAll('.e-rowcell')[j].classList.contains('e-cellselectionbackground')).toEqual(true);
                }
            }
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
            gridObj.clearSelection();
        });
        it('downarrow shortcut testing', function () {
            var args = { action: 'downArrow', preventDefault: preventDefault };
            gridObj.getRows()[1].querySelector('.e-rowcell').click();
            gridObj.keyBoardModule.keyAction(args);
            expect(gridObj.element.querySelectorAll('[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toEqual('2');
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
            expect(gridObj.getSelectedRecords().length).toEqual(1);
            expect(gridObj.getSelectedRowIndexes().length).toEqual(1);
            expect(rows[2].firstElementChild.classList.contains('e-cellselectionbackground')).toEqual(true);
            expect(gridObj.getSelectedRowCellIndexes().length).toEqual(1);
        });
        it('upArrow shortcut testing', function () {
            var args = { action: 'upArrow', preventDefault: preventDefault };
            gridObj.keyBoardModule.keyAction(args);
            expect(gridObj.element.querySelectorAll('[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toEqual('1');
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
            expect(selectionModule.selectedRecords.length).toEqual(1);
            expect(selectionModule.selectedRowIndexes.length).toEqual(1);
            expect(rows[1].firstElementChild.classList.contains('e-cellselectionbackground')).toEqual(true);
            expect(selectionModule.selectedRowCellIndexes.length).toEqual(1);
        });
        it('rightArrow shortcut testing', function () {
            var args = { action: 'rightArrow', preventDefault: preventDefault };
            gridObj.keyBoardModule.keyAction(args);
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
            expect(rows[1].querySelector('.e-cellselectionbackground').cellIndex).toEqual(1);
        });
        it('rightArrow shortcut next row testing', function () {
            var args = { action: 'rightArrow', preventDefault: preventDefault };
            selectionModule.selectCell({ rowIndex: 0, cellIndex: 4 });
            gridObj.keyBoardModule.keyAction(args);
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
            expect(rows[1].querySelector('.e-cellselectionbackground').cellIndex).toEqual(0);
        });
        it('leftarrow shortcut prev row testing', function () {
            var args = { action: 'leftArrow', preventDefault: preventDefault };
            gridObj.keyBoardModule.keyAction(args);
            expect(rows[0].querySelector('.e-cellselectionbackground').cellIndex).toEqual(4);
        });
        it('leftarrow shortcut testing', function () {
            var args = { action: 'leftArrow', preventDefault: preventDefault };
            gridObj.keyBoardModule.keyAction(args);
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
            expect(rows[0].querySelector('.e-cellselectionbackground').cellIndex).toEqual(3);
        });
        it('home shortcut testing', function () {
            var args = { action: 'home', preventDefault: preventDefault };
            gridObj.keyBoardModule.keyAction(args);
            expect(gridObj.element.querySelectorAll('[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toEqual('1');
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
            expect(rows[0].querySelector('.e-cellselectionbackground').cellIndex).toEqual(0);
        });
        it('end shortcut testing', function () {
            var args = { action: 'end', preventDefault: preventDefault };
            gridObj.keyBoardModule.keyAction(args);
            expect(gridObj.element.querySelectorAll('[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toEqual('1');
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
            expect(rows[7].querySelector('.e-cellselectionbackground').cellIndex).toEqual(4);
        });
        it('ctrlHome shortcut testing', function () {
            var args = { action: 'ctrlHome', preventDefault: preventDefault };
            gridObj.keyBoardModule.keyAction(args);
            expect(gridObj.element.querySelectorAll('[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toEqual('0');
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
            expect(rows[0].querySelector('.e-cellselectionbackground').cellIndex).toEqual(0);
        });
        it('ctrlEnd shortcut testing', function () {
            var args = { action: 'ctrlEnd', preventDefault: preventDefault };
            gridObj.keyBoardModule.keyAction(args);
            expect(gridObj.element.querySelectorAll('[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toEqual('7');
            expect(rows[7].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
            expect(rows[7].querySelector('.e-cellselectionbackground').cellIndex).toEqual(4);
        });
        it('shiftUp row shortcut testing', function () {
            var args = { action: 'shiftUp', preventDefault: preventDefault };
            gridObj.selectRow(3);
            gridObj.keyBoardModule.keyAction(args);
            expect(gridObj.element.querySelectorAll('[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toEqual('2');
            expect(gridObj.element.querySelectorAll('[aria-selected="true"]')[1].getAttribute('aria-rowindex')).toEqual('3');
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
            expect(rows[7].querySelectorAll('.e-rowcell')[4].classList.contains('e-cellselectionbackground')).toEqual(true);
        });
        it('shiftDown row shortcut testing', function () {
            var args = { action: 'shiftDown', preventDefault: preventDefault };
            gridObj.keyBoardModule.keyAction(args);
            gridObj.keyBoardModule.keyAction(args);
            expect(gridObj.element.querySelectorAll('[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toEqual('3');
            expect(gridObj.element.querySelectorAll('[aria-selected="true"]')[1].getAttribute('aria-rowindex')).toEqual('4');
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toEqual(false);
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
            expect(rows[7].querySelectorAll('.e-rowcell')[4].classList.contains('e-cellselectionbackground')).toEqual(true);
        });
        it('shiftUp row shortcut reverse testing', function () {
            var args = { action: 'shiftUp', preventDefault: preventDefault };
            gridObj.keyBoardModule.keyAction(args);
            expect(gridObj.element.querySelectorAll('[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toEqual('3');
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toEqual(false);
            expect(rows[7].querySelectorAll('.e-rowcell')[4].classList.contains('e-cellselectionbackground')).toEqual(true);
        });
        it('shiftLeft cell shortcut testing', function () {
            var args = { action: 'shiftLeft', preventDefault: preventDefault };
            selectionModule.selectCell({ rowIndex: 1, cellIndex: 1 });
            gridObj.keyBoardModule.keyAction(args);
            expect(rows[1].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toEqual(true);
            expect(rows[1].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toEqual(true);
        });
        it('shiftRight cell shortcut testing', function () {
            var args = { action: 'shiftRight', preventDefault: preventDefault };
            gridObj.keyBoardModule.keyAction(args);
            gridObj.keyBoardModule.keyAction(args);
            expect(rows[1].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toEqual(true);
            expect(rows[1].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toEqual(true);
            expect(rows[1].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toEqual(false);
        });
        it('shiftUp cell shortcut testing', function () {
            var args = { action: 'shiftUp', preventDefault: preventDefault };
            var st = 2;
            var len = 2;
            gridObj.keyBoardModule.keyAction(args);
            for (var i = 0; i <= 1; i++) {
                if (i === 1) {
                    st = 0;
                    len = 1;
                }
                for (var j = st; j < len; j++) {
                    expect(rows[i].querySelectorAll('.e-rowcell')[j].classList.contains('e-cellselectionbackground')).toEqual(true);
                }
            }
        });
        it('shiftDown cell shortcut testing', function () {
            var args = { action: 'shiftDown', preventDefault: preventDefault };
            var st = 1;
            var len = 3;
            gridObj.keyBoardModule.keyAction(args);
            gridObj.keyBoardModule.keyAction(args);
            for (var i = 1; i <= 2; i++) {
                if (i === 2) {
                    st = 0;
                    len = 2;
                }
                for (var j = st; j < len; j++) {
                    expect(rows[i].querySelectorAll('.e-rowcell')[j].classList.contains('e-cellselectionbackground')).toEqual(true);
                }
            }
        });
        it('escape shortcut testing', function () {
            var args = { action: 'escape', preventDefault: preventDefault };
            gridObj.selectRows([0, 1, 2]);
            gridObj.keyBoardModule.keyAction(args);
            expect(gridObj.getSelectedRecords().length).toEqual(0);
            expect(gridObj.getSelectedRowIndexes().length).toEqual(0);
        });
        it('ctrl + A shortcut testing', function () {
            var args = { action: 'ctrlPlusA', preventDefault: preventDefault };
            gridObj.keyBoardModule.keyAction(args);
            expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toEqual(gridObj.element.querySelectorAll('.e-rowcell').length);
            expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toEqual(gridObj.element.querySelectorAll('.e-rowcell').length);
            gridObj.selectionSettings.mode = 'cell';
            gridObj.dataBind();
            gridObj.selectionModule.applyShiftLeftRightKey(1, false);
            gridObj.keyBoardModule.keyAction(args);
            gridObj.selectionSettings.mode = 'row';
            gridObj.dataBind();
            gridObj.keyBoardModule.keyAction(args);
            gridObj.selectionModule.applyShiftLeftRightKey(1, false);
            gridObj.selectionSettings.mode = 'both';
            gridObj.dataBind();
        });
        afterAll(function () {
            dom_1.remove(elem);
        });
    });
    describe('Grid Selection module', function () {
        describe('grid single seletion functionalities', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var selectionModule;
            var rows;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data, dataBound: dataBound,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    selectionSettings: { type: 'single', mode: 'both' },
                });
                gridObj.appendTo('#Grid');
            });
            it('single row - selectRow testing', function () {
                selectionModule = gridObj.selectionModule;
                rows = gridObj.getRows();
                selectionModule.selectRow(0);
                expect(rows[0].hasAttribute('aria-selected')).toEqual(true);
                expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toEqual(5);
                expect(selectionModule.selectedRecords.length).toEqual(1);
                expect(selectionModule.selectedRowIndexes.length).toEqual(1);
            });
            it('single row testing', function () {
                selectionModule.selectRow(2);
                expect(rows[2].hasAttribute('aria-selected')).toEqual(true);
                expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(selectionModule.selectedRecords.length).toEqual(1);
                expect(selectionModule.selectedRowIndexes.length).toEqual(1);
                expect(rows[1].hasAttribute('aria-selected')).toEqual(false);
                expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toEqual(false);
            });
            it('single row - selectRowsByRange  testing', function () {
                selectionModule.clearRowSelection();
                selectionModule.selectRowsByRange(3, 4);
                expect(rows[3].hasAttribute('aria-selected')).toEqual(false);
                expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toEqual(false);
                expect(selectionModule.selectedRecords.length).toEqual(0);
                expect(selectionModule.selectedRowIndexes.length).toEqual(0);
            });
            it('single row - selectRows  testing', function () {
                selectionModule.clearRowSelection();
                gridObj.selectRows([1, 2]);
                expect(rows[1].hasAttribute('aria-selected')).toEqual(false);
                expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toEqual(false);
                expect(selectionModule.selectedRecords.length).toEqual(0);
                expect(selectionModule.selectedRowIndexes.length).toEqual(0);
            });
            it('single row - addRowsToSelection  testing', function () {
                selectionModule.clearRowSelection();
                selectionModule.addRowsToSelection([2]);
                expect(rows[1].hasAttribute('aria-selected')).toEqual(false);
                expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toEqual(false);
                expect(selectionModule.selectedRecords.length).toEqual(0);
                expect(selectionModule.selectedRowIndexes.length).toEqual(0);
            });
            it('clear row selection testing', function () {
                selectionModule.selectRow(1);
                selectionModule.clearRowSelection();
                expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toEqual(0);
                expect(selectionModule.selectedRecords.length).toEqual(0);
                expect(selectionModule.selectedRowIndexes.length).toEqual(0);
                expect(selectionModule.selectedRowIndexes.length).toEqual(0);
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(0);
            });
            it('single cell - selectCell testing', function () {
                gridObj.selectCell({ rowIndex: 0, cellIndex: 0 });
                expect(rows[0].querySelector('.e-cellselectionbackground').cellIndex).toEqual(0);
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(1);
            });
            it('single cell testing', function () {
                selectionModule.selectCell({ rowIndex: 1, cellIndex: 1 });
                expect(rows[1].querySelector('.e-cellselectionbackground').cellIndex).toEqual(1);
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(1);
                expect(rows[0].querySelectorAll('.e-cellselectionbackground').length).toEqual(0);
            });
            it('single cell - selectCellsByRange testing', function () {
                selectionModule.clearCellSelection();
                selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: 1, cellIndex: 1 });
                expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toEqual(0);
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(0);
            });
            it('single cell - selectCellsByRange box mode testing', function () {
                selectionModule.clearCellSelection();
                gridObj.selectionSettings.cellSelectionMode = 'box';
                gridObj.dataBind();
                selectionModule.selectCellsByRange({ rowIndex: 1, cellIndex: 1 }, { rowIndex: 2, cellIndex: 2 });
                expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toEqual(0);
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(0);
            });
            it('single cell - selectCells testing', function () {
                selectionModule.clearCellSelection();
                selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [0] }, { rowIndex: 1, cellIndexes: [1] }]);
                expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toEqual(0);
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(0);
            });
            it('single cell - addCellsToSelection testing', function () {
                selectionModule.clearCellSelection();
                selectionModule.addCellsToSelection([{ rowIndex: 0, cellIndex: 0 }]);
                expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toEqual(0);
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(0);
            });
            it('clear cell selection testing', function () {
                selectionModule.selectCell({ rowIndex: 1, cellIndex: 1 });
                selectionModule.clearCellSelection();
                expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toEqual(0);
                expect(selectionModule.selectedRecords.length).toEqual(0);
                expect(selectionModule.selectedRowIndexes.length).toEqual(0);
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(0);
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
    describe('Grid Selection module', function () {
        describe('grid row multiple seletion functionalities', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var selectionModule;
            var rows;
            var shiftEvt = document.createEvent('MouseEvent');
            shiftEvt.initMouseEvent('click', true, true, window, null, 0, 0, 0, 0, false, false, true, false, 0, null);
            var ctrlEvt = document.createEvent('MouseEvent');
            ctrlEvt.initMouseEvent('click', true, true, window, null, 0, 0, 0, 0, true, false, false, false, 0, null);
            var rowSelecting;
            var rowSelected;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data, dataBound: dataBound,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    selectionSettings: { type: 'multiple', mode: 'row' },
                    rowSelecting: rowSelecting,
                    rowSelected: rowSelected,
                });
                gridObj.appendTo('#Grid');
            });
            it('multi row - selectRow testing', function () {
                selectionModule = gridObj.selectionModule;
                rows = gridObj.getRows();
                selectionModule.selectRowsByRange(0, 1);
                expect(rows[0].hasAttribute('aria-selected')).toEqual(true);
                expect(rows[1].hasAttribute('aria-selected')).toEqual(true);
                expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(selectionModule.selectedRecords.length).toEqual(2);
                expect(selectionModule.selectedRowIndexes.length).toEqual(2);
            });
            it('single row testing', function () {
                selectionModule.selectRow(2);
                expect(rows[2].hasAttribute('aria-selected')).toEqual(true);
                expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(selectionModule.selectedRecords.length).toEqual(1);
                expect(selectionModule.selectedRowIndexes.length).toEqual(1);
                expect(rows[1].hasAttribute('aria-selected')).toEqual(false);
                expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toEqual(false);
            });
            it('multi row - addRowsToSelection  testing', function () {
                selectionModule.addRowsToSelection([4]);
                expect(rows[4].hasAttribute('aria-selected')).toEqual(true);
                expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(rows[2].hasAttribute('aria-selected')).toEqual(true);
                expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(selectionModule.selectedRecords.length).toEqual(2);
                expect(selectionModule.selectedRowIndexes.length).toEqual(2);
            });
            it('multi row - ctrl click testing', function () {
                rows[0].firstChild.dispatchEvent(ctrlEvt);
                expect(rows[4].hasAttribute('aria-selected')).toEqual(true);
                expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(rows[2].hasAttribute('aria-selected')).toEqual(true);
                expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(rows[0].hasAttribute('aria-selected')).toEqual(true);
                expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(selectionModule.selectedRecords.length).toEqual(3);
                expect(selectionModule.selectedRowIndexes.length).toEqual(3);
            });
            it('multi row toogle - ctrl click testing', function () {
                rows[4].firstChild.dispatchEvent(ctrlEvt);
                expect(rows[4].hasAttribute('aria-selected')).toEqual(false);
                expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toEqual(false);
                expect(selectionModule.selectedRecords.length).toEqual(2);
                expect(selectionModule.selectedRowIndexes.length).toEqual(2);
            });
            it('clear row selection testing', function () {
                selectionModule.clearRowSelection();
                expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toEqual(0);
                expect(selectionModule.selectedRecords.length).toEqual(0);
                expect(selectionModule.selectedRowIndexes.length).toEqual(0);
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(0);
            });
            it('multi row - shift click  testing', function () {
                rows[4].firstChild.click();
                rows[3].firstChild.dispatchEvent(shiftEvt);
                expect(rows[3].hasAttribute('aria-selected')).toEqual(true);
                expect(rows[4].hasAttribute('aria-selected')).toEqual(true);
                expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(selectionModule.selectedRecords.length).toEqual(2);
                expect(selectionModule.selectedRowIndexes.length).toEqual(2);
            });
            it('multi row - shift click testing', function () {
                rows[5].firstChild.dispatchEvent(shiftEvt);
                expect(rows[4].hasAttribute('aria-selected')).toEqual(true);
                expect(rows[5].hasAttribute('aria-selected')).toEqual(true);
                expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(rows[5].firstElementChild.classList.contains('e-cellselectionbackground')).toEqual(false);
                expect(selectionModule.selectedRecords.length).toEqual(2);
                expect(selectionModule.selectedRowIndexes.length).toEqual(2);
            });
            it('multi row - shift click  testing', function () {
                rows[2].firstChild.dispatchEvent(shiftEvt);
                expect(rows[2].hasAttribute('aria-selected')).toEqual(true);
                expect(rows[3].hasAttribute('aria-selected')).toEqual(true);
                expect(rows[4].hasAttribute('aria-selected')).toEqual(true);
                expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(selectionModule.selectedRecords.length).toEqual(3);
                expect(selectionModule.selectedRowIndexes.length).toEqual(3);
            });
            it('rowSelecting event call', function () {
                var spyFn = jasmine.createSpy('begin');
                gridObj.rowSelecting = spyFn;
                selectionModule.selectRow(2);
                expect(spyFn).toHaveBeenCalled();
            });
            it('rowSelected event call', function () {
                var spyFn = jasmine.createSpy('begin');
                gridObj.rowSelected = spyFn;
                selectionModule.selectRow(3);
                expect(spyFn).toHaveBeenCalled();
            });
            it('multi cell - selectRows testing', function () {
                selectionModule.clearRowSelection();
                selectionModule.selectRows([0, 2]);
                expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(selectionModule.selectedRowIndexes.length).toEqual(2);
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
    describe('Grid Selection module', function () {
        describe('grid cell multiple seletion functionalities', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var selectionModule;
            var rows;
            var cells;
            var shiftEvt = document.createEvent('MouseEvent');
            shiftEvt.initMouseEvent('click', true, true, window, null, 0, 0, 0, 0, false, false, true, false, 0, null);
            var ctrlEvt = document.createEvent('MouseEvent');
            ctrlEvt.initMouseEvent('click', true, true, window, null, 0, 0, 0, 0, true, false, false, false, 0, null);
            var cellSelecting;
            var cellSelected;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data, dataBound: dataBound,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    selectionSettings: { type: 'multiple', mode: 'cell' },
                    cellSelecting: cellSelecting,
                    cellSelected: cellSelected,
                });
                gridObj.appendTo('#Grid');
            });
            it('multi cell - selectCellsByRange testing', function () {
                selectionModule = gridObj.selectionModule;
                rows = gridObj.getRows();
                selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: 1, cellIndex: 1 });
                var len = gridObj.getColumns().length;
                for (var i = 0; i <= 1; i++) {
                    cells = rows[i].querySelectorAll('.e-rowcell');
                    if (i === 1) {
                        len = 2;
                    }
                    for (var j = 0; j < len; j++) {
                        expect(cells[j].classList.contains('e-cellselectionbackground')).toEqual(true);
                    }
                }
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(2);
                expect(rows[0].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toEqual(true);
                expect(rows[0].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toEqual(true);
            });
            it('multi cell - selectCellsByRange box mode testing', function () {
                gridObj.selectionSettings.cellSelectionMode = 'box';
                gridObj.dataBind();
                selectionModule = gridObj.selectionModule;
                rows = gridObj.getRows();
                selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 2 }, { rowIndex: 1, cellIndex: 3 });
                for (var i = 0; i <= 1; i++) {
                    cells = rows[i].querySelectorAll('.e-rowcell');
                    for (var j = 2; j < 4; j++) {
                        expect(cells[j].classList.contains('e-cellselectionbackground')).toEqual(true);
                    }
                }
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(2);
                expect(rows[0].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toEqual(false);
                expect(rows[0].querySelectorAll('.e-rowcell')[4].classList.contains('e-cellselectionbackground')).toEqual(false);
                gridObj.selectionSettings.cellSelectionMode = 'flow';
                gridObj.dataBind();
            });
            it('single cell testing', function () {
                selectionModule.selectCell({ rowIndex: 2, cellIndex: 2 });
                expect(rows[2].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toEqual(true);
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(1);
                expect(rows[0].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toEqual(false);
            });
            it('multi cell - addCellsToSelection  testing', function () {
                selectionModule.addCellsToSelection([{ rowIndex: 1, cellIndex: 1 }]);
                expect(rows[2].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toEqual(true);
                expect(rows[1].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toEqual(true);
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(2);
            });
            it('multi cell - addRowsToSelection click testing', function () {
                rows[0].firstChild.dispatchEvent(ctrlEvt);
                expect(rows[2].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toEqual(true);
                expect(rows[1].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toEqual(true);
                expect(rows[0].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toEqual(true);
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(3);
            });
            it('multi cell toogle - addRowsToSelection click testing', function () {
                rows[0].firstChild.dispatchEvent(ctrlEvt);
                expect(rows[0].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toEqual(false);
            });
            it('selection on same row - addRowsToSelection click testing', function () {
                rows[0].querySelectorAll('.e-rowcell')[1].dispatchEvent(ctrlEvt);
                expect(rows[0].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toEqual(true);
            });
            it('clear cell selection testing', function () {
                selectionModule.clearCellSelection();
                expect(selectionModule.selectedRowIndexes.length).toEqual(0);
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(0);
            });
            it('multi cell - shift click  testing', function () {
                rows[1].querySelectorAll('.e-rowcell')[1].click();
                rows[2].querySelectorAll('.e-rowcell')[2].dispatchEvent(shiftEvt);
                var cellIndex = 1;
                var len = 5;
                for (var i = 1; i <= 2; i++) {
                    cells = rows[i].querySelectorAll('.e-rowcell');
                    if (i === 1) {
                        cellIndex = 2;
                        len = 3;
                    }
                    for (var j = cellIndex; j < len; j++) {
                        expect(cells[j].classList.contains('e-cellselectionbackground')).toEqual(true);
                    }
                }
                expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toEqual(false);
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(2);
            });
            it('multi cell - shift click testing', function () {
                rows[0].querySelectorAll('.e-rowcell')[0].dispatchEvent(shiftEvt);
                var len = gridObj.getColumns().length;
                for (var i = 0; i <= 1; i++) {
                    cells = rows[i].querySelectorAll('.e-rowcell');
                    if (i === 1) {
                        len = 2;
                    }
                    for (var j = 0; j < len; j++) {
                        expect(cells[j].classList.contains('e-cellselectionbackground')).toEqual(true);
                    }
                }
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(2);
            });
            it('multi cell - shift click  testing', function () {
                rows[2].querySelectorAll('.e-rowcell')[2].dispatchEvent(shiftEvt);
                var cellIndex = 1;
                var len = 5;
                for (var i = 1; i <= 2; i++) {
                    cells = rows[i].querySelectorAll('.e-rowcell');
                    if (i === 1) {
                        cellIndex = 2;
                        len = 3;
                    }
                    for (var j = cellIndex; j < len; j++) {
                        expect(cells[j].classList.contains('e-cellselectionbackground')).toEqual(true);
                    }
                }
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(2);
            });
            it('cellSelecting event call', function () {
                var spyFn = jasmine.createSpy('begin');
                gridObj.cellSelecting = spyFn;
                selectionModule.selectCell({ rowIndex: 0, cellIndex: 0 });
                expect(spyFn).toHaveBeenCalled();
            });
            it('cellSelected event call', function () {
                var spyFn = jasmine.createSpy('begin');
                gridObj.cellSelected = spyFn;
                selectionModule.selectCell({ rowIndex: 0, cellIndex: 1 });
                expect(spyFn).toHaveBeenCalled();
            });
            it('multi cell - selectCells testing', function () {
                selectionModule.clearCellSelection();
                selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [0] }, { rowIndex: 1, cellIndexes: [1] }, { rowIndex: 2, cellIndexes: [2] }]);
                for (var i = 0; i <= 2; i++) {
                    cells = rows[i].querySelectorAll('.e-rowcell');
                    expect(cells[i].classList.contains('e-cellselectionbackground')).toEqual(true);
                }
                expect(selectionModule.selectedRowCellIndexes.length).toEqual(3);
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
    describe('Grid Selection module', function () {
        describe('clear selection cases', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var selectionModule;
            var rows;
            var cell;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data, dataBound: dataBound,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    selectionSettings: { type: 'multiple', mode: 'both' },
                });
                gridObj.appendTo('#Grid');
            });
            it('select cell and clear row selection testing', function () {
                selectionModule = gridObj.selectionModule;
                rows = gridObj.getRows();
                cell = rows[0].firstChild;
                selectionModule.selectCell({ rowIndex: 1, cellIndex: 0 });
                expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toEqual(false);
                expect(rows[1].firstElementChild.classList.contains('e-cellselectionbackground')).toEqual(true);
                cell.click();
                expect(cell.classList.contains('e-selectionbackground')).toEqual(true);
                expect(cell.classList.contains('e-cellselectionbackground')).toEqual(true);
                expect(rows[1].firstElementChild.classList.contains('e-cellselectionbackground')).toEqual(false);
            });
            it('row and cell toogle testing', function () {
                selectionModule.clearSelection();
                cell.click();
                expect(cell.classList.contains('e-selectionbackground')).toEqual(true);
                expect(cell.classList.contains('e-cellselectionbackground')).toEqual(true);
                cell.click();
                expect(cell.classList.contains('e-selectionbackground')).toEqual(false);
                expect(cell.classList.contains('e-cellselectionbackground')).toEqual(false);
            });
            it('row and cell same row testing', function () {
                selectionModule.clearSelection();
                cell.click();
                expect(cell.classList.contains('e-selectionbackground')).toEqual(true);
                expect(cell.classList.contains('e-cellselectionbackground')).toEqual(true);
                rows[0].querySelectorAll('.e-rowcell')[1].click();
                expect(cell.classList.contains('e-selectionbackground')).toEqual(false);
                expect(cell.classList.contains('e-cellselectionbackground')).toEqual(false);
                expect(rows[0].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toEqual(true);
                rows[0].querySelectorAll('.e-rowcell')[1].click();
                expect(cell.classList.contains('e-selectionbackground')).toEqual(true);
                expect(cell.classList.contains('e-cellselectionbackground')).toEqual(false);
                expect(rows[0].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toEqual(false);
                rows[0].querySelectorAll('.e-rowcell')[1].click();
                expect(cell.classList.contains('e-selectionbackground')).toEqual(false);
                expect(rows[0].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toEqual(true);
            });
            it('allowSelection false testing', function () {
                gridObj.allowSelection = false;
                gridObj.dataBind();
                cell.click();
                expect(cell.classList.contains('e-selectionbackground')).toEqual(false);
                gridObj.selectionSettings.type = 'single';
                gridObj.dataBind();
            });
            it('Row select false testing', function () {
                gridObj.element.querySelectorAll('.e-row')[0].firstChild.click();
                expect(gridObj.element.querySelectorAll('.e-row')[0].hasAttribute('aria-selected')).toEqual(false);
            });
            it('keydown selection false testing', function () {
                var preventDefault = new Function();
                var args = { action: 'downArrow', preventDefault: preventDefault };
                gridObj.keyBoardModule.keyAction(args);
                expect(gridObj.element.querySelectorAll('.e-row')[0].hasAttribute('aria-selected')).toEqual(false);
                gridObj.selectionSettings.mode = 'row';
                gridObj.dataBind();
                gridObj.selectionModule.applyDownUpKey(1, false, false);
                gridObj.selectionModule.applyRightLeftKey(1, false, false);
                gridObj.selectionModule.shiftUpKey();
                gridObj.selectionModule.shiftDownKey();
                gridObj.selectionSettings.mode = 'cell';
                gridObj.selectionModule.applyDownUpKey(1, false, false);
                gridObj.selectionModule.applyCtrlHomeEndKey(1);
                gridObj.selectionModule.shiftUpKey();
                gridObj.dataBind();
                gridObj.selectionModule.shiftDownKey();
                gridObj.selectionModule.mouseDownHandler({ target: gridObj.element, preventDefault: function () { } });
                gridObj.allowRowDragAndDrop = true;
                gridObj.dataBind();
                gridObj.selectionModule.mouseDownHandler({ target: gridObj.element, preventDefault: function () { } });
                gridObj.isDestroyed = true;
                gridObj.selectionModule.addEventListener();
                gridObj.selectionModule.selectCell({ rowIndex: 1, cellIndex: 1 });
                gridObj.selectionModule.isTrigger = true;
                gridObj.selectionModule.clearCellSelection();
                gridObj.selectionModule.isTrigger = false;
                gridObj.selectRow(1);
                gridObj.selectionModule.isRowSelected = true;
                gridObj.selectionModule.isTrigger = true;
                gridObj.selectionModule.clearRowSelection();
                gridObj.selectionModule.isTrigger = false;
                gridObj.selectionModule.prevECIdxs = undefined;
                gridObj.selectionModule.selectCell({ rowIndex: 1, cellIndex: 1 });
                gridObj.selectionModule.prevECIdxs = undefined;
                gridObj.selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: 1, cellIndex: 1 });
                gridObj.selectionModule.prevECIdxs = undefined;
                gridObj.selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [0] }]);
                gridObj.selectionModule.prevECIdxs = undefined;
                gridObj.selectionModule.addCellsToSelection([{ rowIndex: 0, cellIndex: 0 }]);
                gridObj.selectionSettings.mode = 'row';
                gridObj.dataBind();
                gridObj.selectionModule.applyHomeEndKey();
                gridObj.allowRowDragAndDrop = true;
                gridObj.dataBind();
                gridObj.selectionModule.element = dom_1.createElement('div');
                gridObj.selectionModule.mouseMoveHandler({ target: gridObj.element, preventDefault: function () { }, clientX: 10, clientY: 10 });
                gridObj.selectionModule.destroy();
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('Model changes', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var selectionModule;
            var rows;
            var cell;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data, dataBound: dataBound,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: false,
                    selectionSettings: { type: 'multiple', mode: 'both' },
                });
                gridObj.appendTo('#Grid');
            });
            it('enable selection testing', function () {
                gridObj.allowSelection = true;
                gridObj.dataBind();
                selectionModule = gridObj.selectionModule;
                rows = gridObj.getRows();
                cell = rows[0].firstChild;
                selectionModule.selectRows([0, 1]);
                expect(cell.classList.contains('e-selectionbackground')).toEqual(true);
            });
            it('selction type change row testing', function () {
                gridObj.selectionSettings.type = 'single';
                gridObj.dataBind();
                expect(cell.classList.contains('e-selectionbackground')).toEqual(false);
                gridObj.selectionSettings.type = 'multiple';
                gridObj.dataBind();
            });
            it('cell selection testing', function () {
                selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: 1, cellIndex: 0 });
                expect(cell.classList.contains('e-cellselectionbackground')).toEqual(true);
            });
            it('selction type change row testing', function () {
                gridObj.selectionSettings.type = 'single';
                gridObj.dataBind();
                expect(cell.classList.contains('e-cellselectionbackground')).toEqual(false);
            });
            it('selection mode change to row', function () {
                gridObj.selectionSettings.mode = 'row';
                gridObj.dataBind();
                expect(cell.classList.contains('e-cellselectionbackground')).toEqual(false);
            });
            it('select a row with wrong row index', function () {
                gridObj.selectRow(20);
                gridObj.dataBind();
                expect(gridObj.getContent().querySelectorAll('.e-selectionbackground').length).toEqual(0);
            });
            it('selction type change row testing', function () {
                gridObj.selectionSettings.type = 'multiple';
                gridObj.dataBind();
                expect(cell.classList.contains('e-selectionbackground')).toEqual(false);
            });
            it('select multiple row with wrong index', function () {
                gridObj.selectRows([1, 3, 5, 15, 20]);
                gridObj.dataBind();
                expect(gridObj.getContent().querySelectorAll('.e-selectionbackground').length).toEqual(3 * gridObj.columns.length);
            });
            it('change selection mode row to cell', function () {
                gridObj.selectionSettings.mode = 'cell';
                gridObj.dataBind();
                expect(gridObj.getContent().querySelectorAll('.e-selectionbackground').length).toEqual(0);
            });
            it('select a cell with wrong object ', function () {
                gridObj.selectionModule.selectCell({ rowIndex: 0, cellIndex: 12 });
                gridObj.dataBind();
                expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toEqual(0);
            });
            it('select cells with wrong object ', function () {
                gridObj.selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [12, 15] }, { rowIndex: 5, cellIndexes: [1, 2] }]);
                gridObj.dataBind();
                expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toEqual(2);
            });
            it('select cells with selectCellsByRange method ', function () {
                gridObj.selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 12 }, { rowIndex: 6, cellIndex: 12 });
                gridObj.dataBind();
                expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toEqual(31);
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
    describe('Grid Touch Selection', function () {
        describe('touch selection', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var selectionModule;
            var rows;
            var cell;
            var gridPopUp;
            var spanElement;
            var androidPhoneUa = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            beforeAll(function (done) {
                ej2_base_1.Browser.userAgent = androidPhoneUa;
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data, dataBound: dataBound,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    selectionSettings: { type: 'multiple', mode: 'both' },
                });
                gridObj.appendTo('#Grid');
            });
            it('gridPopUp display testing', function () {
                rows = gridObj.getRows();
                selectionModule = gridObj.selectionModule;
                gridPopUp = gridObj.element.querySelector('.e-gridpopup');
                spanElement = gridPopUp.querySelector('span');
                expect(gridPopUp.style.display).toEqual('none');
            });
            it('single row testing', function () {
                gridObj.getRows()[0].querySelector('.e-rowcell').click();
                expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(selectionModule.selectedRowIndexes.length).toEqual(1);
                expect(gridPopUp.style.display).toEqual('');
                expect(spanElement.classList.contains('e-rowselect')).toEqual(true);
            });
            it('multi row  testing', function () {
                spanElement.click();
                expect(spanElement.classList.contains('e-spanclicked')).toEqual(true);
                gridObj.getRows()[1].querySelector('.e-rowcell').click();
                expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toEqual(true);
                expect(selectionModule.selectedRowIndexes.length).toEqual(2);
                expect(gridPopUp.style.display).toEqual('');
                expect(spanElement.classList.contains('e-rowselect')).toEqual(true);
            });
            it('gridpopup hide testing', function () {
                spanElement.click();
                expect(gridPopUp.style.display).toEqual('none');
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('select Row after grouping', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionBegin;
            var actionComplete;
            var columns;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'EmployeeID', headerText: 'Employee ID' },
                        { field: 'Freight', headerText: 'Freight' },
                        { field: 'ShipCity', headerText: 'Ship City' },
                        { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { columns: ['EmployeeID', 'ShipCity'] },
                    allowSorting: true,
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('initial check', function () {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toEqual(1);
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toEqual(2);
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].querySelectorAll('.e-ungroupbutton').length).toEqual(2);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toEqual(2);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell').length).toEqual(2);
                expect(gridObj.getContentTable().querySelectorAll('.e-indentcell').length > 0).toEqual(true);
                expect(gridObj.groupSettings.columns.length).toEqual(2);
            });
            it('select a row', function (done) {
                var rowSelected = function () {
                    expect(gridObj.getContent().querySelectorAll('.e-selectionbackground')[0].innerHTML).
                        toEqual(gridObj.currentViewData['records'][0]['OrderID'].toString());
                    done();
                };
                gridObj.rowSelected = rowSelected;
                gridObj.selectRow(0);
                gridObj.dataBind();
            });
            it('Check selected records', function () {
                var selectedData = gridObj.getSelectedRecords();
                gridObj.dataBind();
                expect(gridObj.getContent().querySelectorAll('.e-selectionbackground')[0].innerHTML).
                    toEqual(selectedData[0]['OrderID'].toString());
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
});
