/**
 * Grid Selection spec document
 */
import { Browser, EmitType } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base/util';
import { createElement, remove } from '@syncfusion/ej2-base/dom';
import { Grid } from '../../../src/grid/base/grid';
import { Selection } from '../../../src/grid/actions/selection';
import { Page } from '../../../src/grid/actions/page';
import { data } from '../base/datasource.spec';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Selection, Page, Sort, Group);

function copyObject(source: Object, destiation: Object): Object {
    for (let prop in source) {
        destiation[prop] = source[prop];
    }
    return destiation;
}

function getEventObject(eventType: string, eventName: string, target?: Element, x?: number, y?: number): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = copyObject(tempEvent, {});
    returnObject.preventDefault = () => { return true; };

    if (!isNullOrUndefined(x)) {
        returnObject.pageX = x;
        returnObject.clientX = x;
    }
    if (!isNullOrUndefined(y)) {
        returnObject.pageY = y;
        returnObject.clientY = y;
    }
    if (!isNullOrUndefined(target)) {
        returnObject.target = returnObject.srcElement = returnObject.toElement = returnObject.currentTarget = target;
    }

    return returnObject;
}


describe('Selection Shortcuts testing', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let selectionModule: Selection;
    let rows: Element[];
    beforeAll((done: Function) => {
        let dataBound: EmitType<Object> = () => { done(); };
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: data, dataBound: dataBound,
                columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                allowPaging: true,
                pageSettings: { pageSize: 8, pageCount: 4, currentPage: 1 },
                allowSelection: true,
                selectionSettings: { type: 'multiple', mode: 'both' },
            });
        gridObj.appendTo('#Grid');
    });

    it('shiftDown intial cell, row shortcut testing', () => {
        let args: any = { action: 'shiftDown', preventDefault: preventDefault };
        let len: number = 5;
        gridObj.element.focus();
        selectionModule = gridObj.selectionModule;
        rows = gridObj.getRows();
        gridObj.keyboardModule.keyAction(args);
        for (let i: number = 0; i <= 1; i++) {
            if (i === 1) {
                len = 1;
            }
            for (let j: number = 0; j < len; j++) {
                expect(rows[i].querySelectorAll('.e-rowcell')[j].classList.contains('e-cellselectionbackground')).toBeTruthy();
            }
        }
        expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        gridObj.clearSelection();
    });

    it('downarrow shortcut testing', () => {
        let args: any = { action: 'downArrow', preventDefault: preventDefault };
        (gridObj.getRows()[1].querySelector('.e-rowcell') as HTMLElement).click();
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('2');
        expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect(gridObj.getSelectedRecords().length).toBe(1);
        expect(gridObj.getSelectedRowIndexes().length).toBe(1);
        expect(rows[2].firstElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy();
        expect(gridObj.getSelectedRowCellIndexes().length).toBe(1);
    });

    it('upArrow shortcut testing', () => {
        let args: any = { action: 'upArrow', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('1');
        expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect(selectionModule.selectedRecords.length).toBe(1);
        expect(selectionModule.selectedRowIndexes.length).toBe(1);
        expect(rows[1].firstElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy();
        expect(selectionModule.selectedRowCellIndexes.length).toBe(1);
    });

    it('rightArrow shortcut testing', () => {
        let args: any = { action: 'rightArrow', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect((rows[1].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(1);
    });

    it('rightArrow shortcut next row testing', () => {
        let args: any = { action: 'rightArrow', preventDefault: preventDefault };
        selectionModule.selectCell({ rowIndex: 0, cellIndex: 4 });
        gridObj.keyboardModule.keyAction(args);
        expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect((rows[1].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(0);
    });

    it('leftarrow shortcut prev row testing', () => {
        let args: any = { action: 'leftArrow', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect((rows[0].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(4);
    });

    it('leftarrow shortcut testing', () => {
        let args: any = { action: 'leftArrow', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect((rows[0].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(3);
    });

    it('home shortcut testing', () => {
        let args: any = { action: 'home', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('1');
        expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect((rows[0].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(0);
    });

    it('end shortcut testing', () => {
        let args: any = { action: 'end', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('1');
        expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect((rows[0].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(4);
    });

    it('ctrlHome shortcut testing', () => {
        let args: any = { action: 'ctrlHome', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('0');
        expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect((rows[0].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(0);
    });

    it('ctrlEnd shortcut testing', () => {
        let args: any = { action: 'ctrlEnd', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('7');
        expect(rows[7].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect((rows[7].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(4);
    });

    it('shiftUp row shortcut testing', () => {
        let args: any = { action: 'shiftUp', preventDefault: preventDefault };
        gridObj.selectRow(3);
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('2');
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[1].getAttribute('aria-rowindex')).toBe('3');
        expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect(rows[7].querySelectorAll('.e-rowcell')[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
    });

    it('shiftDown row shortcut testing', () => {
        let args: any = { action: 'shiftDown', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('3');
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[1].getAttribute('aria-rowindex')).toBe('4');
        expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect(rows[7].querySelectorAll('.e-rowcell')[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
    });

    it('shiftUp row shortcut reverse testing', () => {
        let args: any = { action: 'shiftUp', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('3');
        expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        expect(rows[7].querySelectorAll('.e-rowcell')[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
    });


    it('shiftLeft cell shortcut testing', () => {
        let args: any = { action: 'shiftLeft', preventDefault: preventDefault };
        selectionModule.selectCell({ rowIndex: 1, cellIndex: 1 });
        gridObj.keyboardModule.keyAction(args);
        expect(rows[1].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
        expect(rows[1].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeTruthy();
    });

    it('shiftRight cell shortcut testing', () => {
        let args: any = { action: 'shiftRight', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        gridObj.keyboardModule.keyAction(args);
        expect(rows[1].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
        expect(rows[1].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
        expect(rows[1].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeFalsy();
    });


    it('shiftUp cell shortcut testing', () => {
        let args: any = { action: 'shiftUp', preventDefault: preventDefault };
        let st: number = 2;
        let len: number = 2;
        gridObj.keyboardModule.keyAction(args);
        for (let i: number = 0; i <= 1; i++) {
            if (i === 1) {
                st = 0;
                len = 1;
            }
            for (let j: number = st; j < len; j++) {
                expect(rows[i].querySelectorAll('.e-rowcell')[j].classList.contains('e-cellselectionbackground')).toBeTruthy();
            }
        }
    });

    it('shiftDown cell shortcut testing', () => {
        let args: any = { action: 'shiftDown', preventDefault: preventDefault };
        let st: number = 1;
        let len: number = 3;
        gridObj.keyboardModule.keyAction(args);
        gridObj.keyboardModule.keyAction(args);
        for (let i: number = 1; i <= 2; i++) {
            if (i === 2) {
                st = 0;
                len = 2;
            }
            for (let j: number = st; j < len; j++) {
                expect(rows[i].querySelectorAll('.e-rowcell')[j].classList.contains('e-cellselectionbackground')).toBeTruthy();
            }
        }
    });

    it('escape shortcut testing', () => {
        let args: any = { action: 'escape', preventDefault: preventDefault };
        gridObj.selectRows([0, 1, 2]);
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.getSelectedRecords().length).toBe(0);
        expect(gridObj.getSelectedRowIndexes().length).toBe(0);
    });

    it('ctrl + A shortcut testing', () => {
        let args: any = { action: 'ctrlPlusA', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(gridObj.element.querySelectorAll('.e-rowcell').length);
        expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(gridObj.element.querySelectorAll('.e-rowcell').length);
        //for coverage
        gridObj.selectionSettings.mode = 'cell';
        gridObj.dataBind();
        (<any>gridObj.selectionModule).applyShiftLeftRightKey(1, false);
        gridObj.keyboardModule.keyAction(args);
        gridObj.selectionSettings.mode = 'row';
        gridObj.dataBind();
        gridObj.keyboardModule.keyAction(args);
        (<any>gridObj.selectionModule).applyShiftLeftRightKey(1, false);
        gridObj.selectionSettings.mode = 'both';
        gridObj.dataBind();
    });

    afterAll(() => {
        remove(elem);
    });
});


describe('Grid Selection module', () => {
    describe('grid single seletion functionalities', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let selectionModule: Selection;
        let rows: Element[];
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data, dataBound: dataBound,
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

        it('single row - selectRow testing', () => {
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            selectionModule.selectRow(0);
            expect(rows[0].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(5);
            expect(selectionModule.selectedRecords.length).toBe(1);
            expect(selectionModule.selectedRowIndexes.length).toBe(1);
        });

        it('single row testing', () => {
            selectionModule.selectRow(2);
            expect(rows[2].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(1);
            expect(selectionModule.selectedRowIndexes.length).toBe(1);
            expect(rows[1].hasAttribute('aria-selected')).toBeFalsy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        });

        it('single row - selectRowsByRange  testing', () => {
            selectionModule.clearRowSelection();
            selectionModule.selectRowsByRange(3, 4);
            expect(rows[3].hasAttribute('aria-selected')).toBeFalsy();
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(selectionModule.selectedRecords.length).toBe(0);
            expect(selectionModule.selectedRowIndexes.length).toBe(0);
        });

        it('single row - selectRows  testing', () => {
            selectionModule.clearRowSelection();
            gridObj.selectRows([1, 2]);
            expect(rows[1].hasAttribute('aria-selected')).toBeFalsy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(selectionModule.selectedRecords.length).toBe(0);
            expect(selectionModule.selectedRowIndexes.length).toBe(0);
        });

        it('single row - addRowsToSelection  testing', () => {
            selectionModule.clearRowSelection();
            selectionModule.addRowsToSelection([2]);
            expect(rows[1].hasAttribute('aria-selected')).toBeFalsy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(selectionModule.selectedRecords.length).toBe(0);
            expect(selectionModule.selectedRowIndexes.length).toBe(0);
        });

        it('clear row selection testing', () => {
            selectionModule.selectRow(1);
            selectionModule.clearRowSelection();
            expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(0);
            expect(selectionModule.selectedRecords.length).toBe(0);
            expect(selectionModule.selectedRowIndexes.length).toBe(0);
            expect(selectionModule.selectedRowIndexes.length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        it('single cell - selectCell testing', () => {
            gridObj.selectCell({ rowIndex: 0, cellIndex: 0 });
            expect((rows[0].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(1);
        });

        it('single cell testing', () => {
            selectionModule.selectCell({ rowIndex: 1, cellIndex: 1 });
            expect((rows[1].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(1);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(1);
            expect(rows[0].querySelectorAll('.e-cellselectionbackground').length).toBe(0);
        });

        it('single cell - selectCellsByRange testing', () => {
            selectionModule.clearCellSelection();
            selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: 1, cellIndex: 1 });
            expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        it('single cell - selectCellsByRange box mode testing', () => {
            selectionModule.clearCellSelection();
            gridObj.selectionSettings.cellSelectionMode = 'box';
            gridObj.dataBind();
            selectionModule.selectCellsByRange({ rowIndex: 1, cellIndex: 1 }, { rowIndex: 2, cellIndex: 2 });
            expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        it('single cell - selectCells testing', () => {
            selectionModule.clearCellSelection();
            selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [0] }, { rowIndex: 1, cellIndexes: [1] }]);
            expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        it('single cell - addCellsToSelection testing', () => {
            selectionModule.clearCellSelection();
            selectionModule.addCellsToSelection([{ rowIndex: 0, cellIndex: 0 }]);
            expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        it('clear cell selection testing', () => {
            selectionModule.selectCell({ rowIndex: 1, cellIndex: 1 });
            selectionModule.clearCellSelection();
            expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(0);
            expect(selectionModule.selectedRecords.length).toBe(0);
            expect(selectionModule.selectedRowIndexes.length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        afterAll(() => {
            remove(elem);
        });
    });
});


describe('Grid Selection module', () => {
    describe('grid row multiple seletion functionalities', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let selectionModule: Selection;
        let rows: Element[];
        let shiftEvt: MouseEvent = document.createEvent('MouseEvent');
        shiftEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            false, false, true, false, /* modifier keys */
            0 /*left*/, null
        );
        let ctrlEvt: MouseEvent = document.createEvent('MouseEvent');
        ctrlEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            true, false, false, false, /* modifier keys */
            0 /*left*/, null
        );
        let rowSelecting: (e?: Object) => void;
        let rowSelected: (e?: Object) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data, dataBound: dataBound,
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

        it('multi row - selectRow testing', () => {
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            selectionModule.selectRowsByRange(0, 1);
            selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [0] }]);
            expect(rows[0].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[1].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(2);
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        it('single row testing', () => {
            selectionModule.selectRow(2);
            expect(rows[2].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(1);
            expect(selectionModule.selectedRowIndexes.length).toBe(1);
            expect(rows[1].hasAttribute('aria-selected')).toBeFalsy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        });

        it('multi row - addRowsToSelection  testing', () => {
            selectionModule.addRowsToSelection([4]);
            expect(rows[4].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[2].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(2);
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        it('multi row - ctrl click testing', () => {
            rows[0].firstChild.dispatchEvent(ctrlEvt);
            expect(rows[4].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[2].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[0].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(3);
            expect(selectionModule.selectedRowIndexes.length).toBe(3);
        });

        it('multi row toogle - ctrl click testing', () => {
            rows[4].firstChild.dispatchEvent(ctrlEvt);
            expect(rows[4].hasAttribute('aria-selected')).toBeFalsy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(selectionModule.selectedRecords.length).toBe(2);
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        it('clear row selection testing', () => {
            selectionModule.clearRowSelection();
            expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(0);
            expect(selectionModule.selectedRecords.length).toBe(0);
            expect(selectionModule.selectedRowIndexes.length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        it('multi row - shift click  testing', () => {
            (rows[4].firstChild as HTMLElement).click();
            rows[3].firstChild.dispatchEvent(shiftEvt);
            expect(rows[3].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[4].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(2);
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        it('multi row - shift click testing', () => {
            rows[5].firstChild.dispatchEvent(shiftEvt);
            expect(rows[4].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[5].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[5].firstElementChild.classList.contains('e-cellselectionbackground')).toBeFalsy();
            expect(selectionModule.selectedRecords.length).toBe(2);
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        it('multi row - shift click  testing', () => {
            rows[2].firstChild.dispatchEvent(shiftEvt);
            expect(rows[2].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[3].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[4].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(3);
            expect(selectionModule.selectedRowIndexes.length).toBe(3);
        });

        it('rowSelecting event call', () => {
            let spyFn: (e?: Object) => void = jasmine.createSpy('begin');
            gridObj.rowSelecting = spyFn;
            selectionModule.selectRow(2);
            expect(spyFn).toHaveBeenCalled();
        });

        it('rowSelected event call', () => {
            let spyFn: (e?: Object) => void = jasmine.createSpy('begin');
            gridObj.rowSelected = spyFn;
            selectionModule.selectRow(3);
            expect(spyFn).toHaveBeenCalled();
        });

        it('multi cell - selectRows testing', () => {
            selectionModule.clearRowSelection();
            selectionModule.selectRows([0, 2])
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        afterAll(() => {
            remove(elem);
        });
    });
});

describe('Grid Selection module', () => {
    describe('grid cell multiple seletion functionalities', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let selectionModule: Selection;
        let rows: Element[];
        let cells: NodeListOf<Element>;
        let shiftEvt: MouseEvent = document.createEvent('MouseEvent');
        shiftEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            false, false, true, false, /* modifier keys */
            0 /*left*/, null
        );
        let ctrlEvt: MouseEvent = document.createEvent('MouseEvent');
        ctrlEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            true, false, false, false, /* modifier keys */
            0 /*left*/, null
        );
        let cellSelecting: (e?: Object) => void;
        let cellSelected: (e?: Object) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data, dataBound: dataBound,
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

        it('multi cell - selectCellsByRange testing', () => {
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: 1, cellIndex: 1 });
            let len = gridObj.getColumns().length;
            for (let i: number = 0; i <= 1; i++) {
                cells = rows[i].querySelectorAll('.e-rowcell');
                if (i === 1) {
                    len = 2;
                }
                for (let j: number = 0; j < len; j++) {
                    expect(cells[j].classList.contains('e-cellselectionbackground')).toBeTruthy();
                }
            }
            expect(selectionModule.selectedRowCellIndexes.length).toBe(2);
            expect(rows[0].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(rows[0].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('multi cell - selectCellsByRange box mode testing', () => {
            gridObj.selectionSettings.cellSelectionMode = 'box';
            gridObj.dataBind();
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 2 }, { rowIndex: 1, cellIndex: 3 });
            for (let i: number = 0; i <= 1; i++) {
                cells = rows[i].querySelectorAll('.e-rowcell');
                for (let j: number = 2; j < 4; j++) {
                    expect(cells[j].classList.contains('e-cellselectionbackground')).toBeTruthy();
                }
            }
            expect(selectionModule.selectedRowCellIndexes.length).toBe(2);
            expect(rows[0].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeFalsy();
            expect(rows[0].querySelectorAll('.e-rowcell')[4].classList.contains('e-cellselectionbackground')).toBeFalsy();
            gridObj.selectionSettings.cellSelectionMode = 'flow';
            gridObj.dataBind();
        });

        it('single cell testing', () => {
            selectionModule.selectCell({ rowIndex: 2, cellIndex: 2 });
            expect(rows[2].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowCellIndexes.length).toBe(1);
            expect(rows[0].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeFalsy();
        });

        it('multi cell - addCellsToSelection  testing', () => {
            selectionModule.addCellsToSelection([{ rowIndex: 1, cellIndex: 1 }]);
            expect(rows[2].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(rows[1].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowCellIndexes.length).toBe(2);
        });

        it('multi cell - addRowsToSelection click testing', () => {
            rows[0].firstChild.dispatchEvent(ctrlEvt);
            expect(rows[2].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(rows[1].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(rows[0].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowCellIndexes.length).toBe(3);
        });

        it('multi cell toogle - addRowsToSelection click testing', () => {
            rows[0].firstChild.dispatchEvent(ctrlEvt);
            expect(rows[0].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeFalsy();
        });

        it('selection on same row - addRowsToSelection click testing', () => {
            rows[0].querySelectorAll('.e-rowcell')[1].dispatchEvent(ctrlEvt);
            expect(rows[0].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('clear cell selection testing', () => {
            selectionModule.clearCellSelection();
            expect(selectionModule.selectedRowIndexes.length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        it('multi cell - shift click  testing', () => {
            (rows[1].querySelectorAll('.e-rowcell')[1] as HTMLElement).click();
            rows[2].querySelectorAll('.e-rowcell')[2].dispatchEvent(shiftEvt);
            let cellIndex: number = 1;
            let len: number = 5;
            for (let i: number = 1; i <= 2; i++) {
                cells = rows[i].querySelectorAll('.e-rowcell');
                if (i === 1) {
                    cellIndex = 2;
                    len = 3;
                }
                for (let j: number = cellIndex; j < len; j++) {
                    expect(cells[j].classList.contains('e-cellselectionbackground')).toBeTruthy();
                }
            }
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(selectionModule.selectedRowCellIndexes.length).toBe(2);
        });

        it('multi cell - shift click testing', () => {
            rows[0].querySelectorAll('.e-rowcell')[0].dispatchEvent(shiftEvt);
            let len: number = gridObj.getColumns().length;
            for (let i: number = 0; i <= 1; i++) {
                cells = rows[i].querySelectorAll('.e-rowcell');
                if (i === 1) {
                    len = 2;
                }
                for (let j: number = 0; j < len; j++) {
                    expect(cells[j].classList.contains('e-cellselectionbackground')).toBeTruthy();
                }
            }
            expect(selectionModule.selectedRowCellIndexes.length).toBe(2);
        });

        it('multi cell - shift click  testing', () => {
            rows[2].querySelectorAll('.e-rowcell')[2].dispatchEvent(shiftEvt);
            let cellIndex: number = 1;
            let len: number = 5;
            for (let i: number = 1; i <= 2; i++) {
                cells = rows[i].querySelectorAll('.e-rowcell');
                if (i === 1) {
                    cellIndex = 2;
                    len = 3;
                }
                for (let j: number = cellIndex; j < len; j++) {
                    expect(cells[j].classList.contains('e-cellselectionbackground')).toBeTruthy();
                }
            }
            expect(selectionModule.selectedRowCellIndexes.length).toBe(2);
        });

        it('cellSelecting event call', () => {
            let spyFn: (e?: Object) => void = jasmine.createSpy('begin');
            gridObj.cellSelecting = spyFn;
            selectionModule.selectCell({ rowIndex: 0, cellIndex: 0 });
            expect(spyFn).toHaveBeenCalled();
        });

        it('cellSelected event call', () => {
            let spyFn: (e?: Object) => void = jasmine.createSpy('begin');
            gridObj.cellSelected = spyFn;
            selectionModule.selectCell({ rowIndex: 0, cellIndex: 1 });
            expect(spyFn).toHaveBeenCalled();
        });


        it('multi cell - selectCells testing', () => {
            selectionModule.clearCellSelection();
            selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [0] }, { rowIndex: 1, cellIndexes: [1] }, { rowIndex: 2, cellIndexes: [2] }])
            for (let i: number = 0; i <= 2; i++) {
                cells = rows[i].querySelectorAll('.e-rowcell');
                expect(cells[i].classList.contains('e-cellselectionbackground')).toBeTruthy();
            }
            expect(selectionModule.selectedRowCellIndexes.length).toBe(3);
        });

        afterAll(() => {
            remove(elem);
        });

    });
});



describe('Grid Selection module', () => {
    describe('clear selection cases', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let selectionModule: Selection;
        let rows: Element[];
        let cell: HTMLElement;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data, dataBound: dataBound,
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

        it('select cell and clear row selection testing', () => {
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            cell = rows[0].firstChild as HTMLElement;
            selectionModule.selectCell({ rowIndex: 1, cellIndex: 0 });
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(rows[1].firstElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy();
            cell.click();
            expect(cell.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(rows[1].firstElementChild.classList.contains('e-cellselectionbackground')).toBeFalsy();
        });

        it('row and cell toogle testing', () => {
            selectionModule.clearSelection();
            cell.click();
            expect(cell.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeTruthy();
            cell.click();
            expect(cell.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeFalsy();
        });

        it('row and cell same row testing', () => {
            selectionModule.clearSelection();
            cell.click();
            expect(cell.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeTruthy();
            (rows[0].querySelectorAll('.e-rowcell')[1] as HTMLElement).click();
            expect(cell.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeFalsy();
            expect(rows[0].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
            (rows[0].querySelectorAll('.e-rowcell')[1] as HTMLElement).click();
            expect(cell.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeFalsy();
            expect(rows[0].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeFalsy();
            (rows[0].querySelectorAll('.e-rowcell')[1] as HTMLElement).click();
            expect(cell.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(rows[0].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('allowSelection false testing', () => {
            gridObj.allowSelection = false;
            gridObj.dataBind();
            cell.click();
            expect(cell.classList.contains('e-selectionbackground')).toBeFalsy();
            gridObj.selectionSettings.type = 'single'; //for coverage
            gridObj.dataBind();
        });

        it('Row select false testing', () => {
            (gridObj.element.querySelectorAll('.e-row')[0].firstChild as HTMLElement).click();
            expect(gridObj.element.querySelectorAll('.e-row')[0].hasAttribute('aria-selected')).toBeFalsy();
        });

        it('keydown selection false testing', () => {
            let preventDefault: Function = new Function();
            let args: any = { action: 'downArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.element.querySelectorAll('.e-row')[0].hasAttribute('aria-selected')).toBeFalsy();

            //for coverage
            gridObj.selectionSettings.mode = 'row';
            gridObj.dataBind();
            (<any>gridObj.selectionModule).applyDownUpKey(1, false, false);
            (<any>gridObj.selectionModule).applyRightLeftKey(1, false, false);
            gridObj.selectionModule.shiftUpKey();
            gridObj.selectionModule.shiftDownKey();
            gridObj.selectionSettings.mode = 'cell';
            (<any>gridObj.selectionModule).applyDownUpKey(1, false, false);
            (<any>gridObj.selectionModule).applyCtrlHomeEndKey(0, 0);
            gridObj.selectionModule.shiftUpKey();
            gridObj.dataBind();
            gridObj.selectionModule.shiftDownKey();
            (<any>gridObj.selectionModule).mouseDownHandler({ target: gridObj.element, preventDefault: () => { } });
            gridObj.allowRowDragAndDrop = true;
            gridObj.dataBind();
            (<any>gridObj.selectionModule).mouseDownHandler({ target: gridObj.element, preventDefault: () => { } });
            gridObj.isDestroyed = true;
            (<any>gridObj.selectionModule).addEventListener();
            gridObj.selectionModule.selectCell({ rowIndex: 1, cellIndex: 1 });
            (<any>gridObj.selectionModule).isTrigger = true;
            gridObj.selectionModule.clearCellSelection();
            (<any>gridObj.selectionModule).isTrigger = false;
            gridObj.selectRow(1);
            (<any>gridObj.selectionModule).isRowSelected = true;
            (<any>gridObj.selectionModule).isTrigger = true;
            gridObj.selectionModule.clearRowSelection();
            (<any>gridObj.selectionModule).isTrigger = false;
            (<any>gridObj.selectionModule).prevECIdxs = undefined;
            gridObj.selectionModule.selectCell({ rowIndex: 1, cellIndex: 1 });
            (<any>gridObj.selectionModule).prevECIdxs = undefined;
            gridObj.selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: 1, cellIndex: 1 });
            (<any>gridObj.selectionModule).prevECIdxs = undefined;
            gridObj.selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [0] }]);
            (<any>gridObj.selectionModule).prevECIdxs = undefined;
            gridObj.selectionModule.addCellsToSelection([{ rowIndex: 0, cellIndex: 0 }]);
            gridObj.selectionSettings.mode = 'row';
            gridObj.dataBind();
            (<any>gridObj.selectionModule).applyHomeEndKey({ rowIndex: 0, cellIndex: 0 });
            gridObj.allowRowDragAndDrop = true;
            gridObj.dataBind();
            (<any>gridObj.selectionModule).element = createElement('div');
            (<any>gridObj.selectionModule).startIndex = 0;
            (<any>gridObj.selectionModule).mouseMoveHandler({ target: gridObj.element, preventDefault: () => { }, clientX: 10, clientY: 10 });
            gridObj.selectionModule.destroy();
        });


        afterAll(() => {
            remove(elem);
        });
    });

    describe('Model changes', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let selectionModule: Selection;
        let rows: Element[];
        let cell: HTMLElement;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data, dataBound: dataBound,
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

        it('enable selection testing', () => {
            gridObj.allowSelection = true;
            gridObj.dataBind();
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            cell = rows[0].firstChild as HTMLElement;
            selectionModule.selectRows([0, 1]);
            expect(cell.classList.contains('e-selectionbackground')).toBeTruthy();
        });


        it('selction type change row testing', () => {
            gridObj.selectionSettings.type = 'single';
            gridObj.dataBind();
            expect(cell.classList.contains('e-selectionbackground')).toBeFalsy();
            gridObj.selectionSettings.type = 'multiple';
            gridObj.dataBind();
        });

        it('cell selection testing', () => {
            selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: 1, cellIndex: 0 });
            expect(cell.classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('selction type change row testing', () => {
            gridObj.selectionSettings.type = 'single';
            gridObj.dataBind();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeFalsy();
        });

        it('selection mode change to row', () => {
            gridObj.selectionSettings.mode = 'row';
            gridObj.dataBind();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeFalsy();
        });
        it('select a row with wrong row index', () => {
            gridObj.selectRow(20);
            gridObj.dataBind();
            expect(gridObj.getContent().querySelectorAll('.e-selectionbackground').length).toBe(0);
        });
        it('selction type change row testing', () => {
            gridObj.selectionSettings.type = 'multiple';
            gridObj.dataBind();
            expect(cell.classList.contains('e-selectionbackground')).toBeFalsy();
        });
        it('select multiple row with wrong index', () => {
            gridObj.selectRows([1, 3, 5, 15, 20]);
            gridObj.dataBind();
            expect(gridObj.getContent().querySelectorAll('.e-selectionbackground').length).toBe(3 * gridObj.columns.length);
        });
        it('change selection mode row to cell', () => {
            gridObj.selectionSettings.mode = 'cell';
            gridObj.dataBind();
            expect(gridObj.getContent().querySelectorAll('.e-selectionbackground').length).toBe(0);
        })
        it('select a cell with wrong object ', () => {
            gridObj.selectionModule.selectCell({ rowIndex: 0, cellIndex: 12 });
            gridObj.dataBind();
            expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toBe(0);
        });
        it('select cells with wrong object ', () => {
            gridObj.selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [12, 15] }, { rowIndex: 5, cellIndexes: [1, 2] }]);
            gridObj.dataBind();
            expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toBe(2);
        });
        it('select cells with selectCellsByRange method ', () => {
            gridObj.selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 12 }, { rowIndex: 6, cellIndex: 12 });
            gridObj.dataBind();
            expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toBe(31);
        });


        afterAll(() => {
            remove(elem);
        });
    });
});


describe('Grid Touch Selection', () => {
    describe('touch selection', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let selectionModule: Selection;
        let rows: Element[];
        let cell: HTMLElement;
        let gridPopUp: HTMLElement;
        let spanElement: Element;
        let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        beforeAll((done: Function) => {
            Browser.userAgent = androidPhoneUa;
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data, dataBound: dataBound,
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

        it('gridPopUp display testing', () => {
            rows = gridObj.getRows();
            selectionModule = gridObj.selectionModule;
            gridPopUp = gridObj.element.querySelector('.e-gridpopup') as HTMLElement;
            spanElement = gridPopUp.querySelector('span');
            expect(gridPopUp.style.display).toBe('none');
        });

        it('single row testing', () => {
            (gridObj.getRows()[0].querySelector('.e-rowcell') as HTMLElement).click();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowIndexes.length).toBe(1);
            expect(gridPopUp.style.display).toBe('');
            expect(spanElement.classList.contains('e-rowselect')).toBeTruthy();
        });

        it('multi row  testing', () => {
            (spanElement as HTMLElement).click();
            expect(spanElement.classList.contains('e-spanclicked')).toBeTruthy();
            (gridObj.getRows()[1].querySelector('.e-rowcell') as HTMLElement).click();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
            expect(gridPopUp.style.display).toBe('');
            expect(spanElement.classList.contains('e-rowselect')).toBeTruthy();
        });

        it('gridpopup hide testing', () => {
            (spanElement as HTMLElement).click();
            expect(gridPopUp.style.display).toBe('none');
        });

        afterAll(() => {
            remove(elem);
        });
    });

    // select row/cell and navigate with grouped columns
    describe('select Row/cell after grouping', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let columns: any;
        let rowSelected: EmitType<Object>;
        let rowSelecting: EmitType<Object>;
        let cellSelected: EmitType<Object>;
        let cellSelecting: EmitType<Object>;
        let previousRow: HTMLElement;
        let previousRowIndex: number;
        let previousRowCell: HTMLElement;
        let previousRowCellIndex: Object;
        let preventDefault: Function = new Function();
        let rows: HTMLElement[];
        let shiftEvt: MouseEvent = document.createEvent('MouseEvent');
        shiftEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            false, false, true, false, /* modifier keys */
            0 /*left*/, null
        );

        let ctrlEvt: MouseEvent = document.createEvent('MouseEvent');
        ctrlEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            true, false, false, false, /* modifier keys */
            0 /*left*/, null
        );
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
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

        it('initial check', () => {
            expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(1);
            expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toBe(2);
            expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].querySelectorAll('.e-ungroupbutton').length).toBe(2);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(2);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell').length).toBe(2);
            expect(gridObj.getContentTable().querySelectorAll('.e-indentcell').length > 0).toBeTruthy();
            expect(gridObj.groupSettings.columns.length).toBe(2);
        });
        it('select a row', (done: Function) => {
            let rowSelected = (args: Object) => {
                expect((<HTMLTableCellElement>gridObj.getContent().querySelectorAll('.e-selectionbackground')[0]).innerHTML).
                    toEqual(gridObj.currentViewData['records'][0]['OrderID'].toString());
                expect(JSON.stringify(args['data'])).toEqual(JSON.stringify(gridObj.getSelectedRecords()[0]));
                expect(args['rowIndex']).toBe(gridObj.getSelectedRowIndexes()[0]);
                expect(args['row']).toEqual(gridObj.getSelectedRows()[0]);
                expect(args['previousRow']).toEqual(gridObj.getSelectedRows()[0]);
                expect(args['previousRowIndex']).toBe(0);
                previousRow = args['previousRow'];
                previousRowIndex = args['previousRowIndex'];
                expect(gridObj.getRows()[0].children[2].hasAttribute('aria-selected')).toBeTruthy();
                done();
            };
            rowSelecting = (args: Object) => {
                expect(JSON.stringify(args['data'])).not.toBeUndefined();
                expect(args['rowIndex']).toBe(0);
                expect(args['row']).toEqual(gridObj.getRows()[0]);
                expect(args['previousRow']).toBeUndefined();
                expect(args['previousRowIndex']).toBeUndefined();
                expect(args['isCtrlPressed']).toBeFalsy();
                expect(args['isShiftPressed']).toBeFalsy();
            };
            gridObj.rowSelected = rowSelected;
            gridObj.rowSelecting = rowSelecting;
            (<HTMLElement>gridObj.getRows()[0].children[2]).click();
        });

        it('Check selected records', () => {
            let selectedData: Object[] = gridObj.getSelectedRecords();
            expect((<HTMLTableCellElement>gridObj.getContent().querySelectorAll('.e-selectionbackground')[0]).innerHTML).
                toEqual(selectedData[0]['OrderID'].toString());
            gridObj.rowSelected = undefined;
            gridObj.rowSelecting = undefined;
        });

        it('DeSelect a row', (done: Function) => {
            gridObj.rowSelected = undefined;
            gridObj.rowSelecting = undefined;
            let rowDeSelecting: EmitType<Object> = (args: Object) => {
                expect(args['data']).not.toEqual(undefined);
                expect(args['rowIndex'][0]).toEqual(0);
                expect(args['row'][0]).toEqual(gridObj.getRows()[0]);
            };
            let rowDeSelected: EmitType<Object> = (args: Object) => {
                expect(args['data']).not.toEqual(undefined);
                expect(args['rowIndex'][0]).toEqual(0);
                expect(args['row'][0]).toEqual(gridObj.getRows()[0]);
                gridObj.rowSelected = undefined;
                gridObj.rowSelecting = undefined;              
                done();
            };
            gridObj.rowDeselecting = rowDeSelecting;
            gridObj.rowDeselected = rowDeSelected;
            gridObj.selectRow(0);
        });

        //key board handling with grouping in row selection
        it('press up arrow', () => {
            gridObj.rowDeselecting = undefined;
            gridObj.rowDeselected = undefined;
            gridObj.selectRow(0);
            let args: any = { action: 'upArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[3].classList.contains('e-selectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[0].children[3].hasAttribute('aria-selected')).toBeTruthy();
        });
        it('press down arrow', (done: Function) => {
            rowSelected = (args: Object) => {
                expect(JSON.stringify(args['data'])).toEqual(JSON.stringify(gridObj.getSelectedRecords()[0]));
                expect(args['rowIndex']).toBe(gridObj.getSelectedRowIndexes()[0]);
                expect(args['row']).toEqual(gridObj.getSelectedRows()[0]);
                expect(args['previousRow']).toEqual(gridObj.getSelectedRows()[0]);
                expect(args['previousRowIndex']).toBe(1);
                expect(gridObj.getRows()[1].children[3].classList.contains('e-selectionbackground')).toBeTruthy();
                expect(gridObj.getRows()[1].children[3].hasAttribute('aria-selected')).toBeTruthy();
                done();
            };
            rowSelecting = (args: Object) => {
                expect(JSON.stringify(args['data'])).not.toBeUndefined();
                expect(args['rowIndex']).toBe(1);
                expect(args['row']).toEqual(gridObj.getRows()[1]);
                expect(args['previousRow']).toEqual(previousRow);
                expect(args['previousRowIndex']).toBe(previousRowIndex);
                expect(args['isCtrlPressed']).toBeFalsy();
                expect(args['isShiftPressed']).toBeFalsy();
            };
            gridObj.rowSelected = rowSelected;
            gridObj.rowSelecting = rowSelecting;
            let args: any = { action: 'downArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });

        it('press ctrl+home arrow', () => {
            gridObj.rowSelected = undefined;
            gridObj.rowSelecting = undefined;
            let args: any = { action: 'ctrlHome', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[3].classList.contains('e-selectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[0].children[2].hasAttribute('aria-selected')).toBeTruthy();
            expect(gridObj.getRows()[1].children[3].hasAttribute('aria-selected')).toBeFalsy();
        });

        it('press ctrl+end arrow', () => {
            gridObj.rowSelected = undefined;
            gridObj.rowSelecting = undefined;
            let args: any = { action: 'ctrlEnd', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[3].classList.contains('e-selectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[gridObj.columns.length - 1].hasAttribute('aria-selected')).toBeTruthy();
            expect(gridObj.getRows()[0].children[2].hasAttribute('aria-selected')).toBeFalsy();
        });

        it('press down arrow', () => {
            let args: any = { action: 'downArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[3].classList.contains('e-selectionbackground')).toBeTruthy();
        });

        it('select multiple row with selction type "single"', () => {
            gridObj.selectRows([1, 2, 4]);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[3].classList.contains('e-selectionbackground')).toBeTruthy();
            gridObj.selectionSettings.type = 'multiple';
            gridObj.dataBind();
        });

        it('Shift plus click event', () => {
            gridObj.getRows()[gridObj.getRows().length - 4].children[3].dispatchEvent(shiftEvt);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].querySelectorAll('.e-selectionbackground').length).toBe(6);
            expect(gridObj.getRows()[gridObj.getRows().length - 2].querySelectorAll('.e-selectionbackground').length).toBe(6);
            expect(gridObj.getRows()[gridObj.getRows().length - 3].querySelectorAll('.e-selectionbackground').length).toBe(6);
            expect(gridObj.getRows()[gridObj.getRows().length - 4].querySelectorAll('.e-selectionbackground').length).toBe(6);
            expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(24);
        });

        it('ctrl plus click', () => {
            gridObj.getRows()[1].children[3].dispatchEvent(ctrlEvt);
            expect(gridObj.getRows()[1].querySelectorAll('.e-selectionbackground').length).toBe(6);
            expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(30);
            expect(gridObj.getRows()[1].children[3].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('clear row selections', () => {
            gridObj.selectionModule.clearRowSelection();
            expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(0);
        });

        it('select a cell', (done: Function) => {
            cellSelecting = (args: Object) => {
                expect(JSON.stringify(args['data'])).not.toBeUndefined();
                expect(JSON.stringify(args['cellIndex'])).toEqual(JSON.stringify({ rowIndex: 0, cellIndex: 0 }));
                expect(args['currentCell']).toEqual(gridObj.getRows()[0].children[2]);
                expect(args['previousRowCellIndex']).toBeUndefined();
                expect(args['previousRowCell']).toBeUndefined();
                expect(args['isCtrlPressed']).toBeFalsy();
                expect(args['isShiftPressed']).toBeFalsy();
            };
            cellSelected = (args: Object) => {
                expect(JSON.stringify(args['data'])).not.toBeUndefined();
                expect(JSON.stringify(args['cellIndex'])).toEqual(JSON.stringify({ rowIndex: 0, cellIndex: 0 }));
                expect(args['currentCell']).toEqual(gridObj.getRows()[0].children[2]);
                expect(JSON.stringify(args['previousRowCellIndex'])).toEqual(JSON.stringify({ rowIndex: 0, cellIndex: 0 }));
                expect(args['previousRowCell']).toEqual(gridObj.getRows()[0].children[2]);
                expect(JSON.stringify(args['selectedRowCellIndex'])).toEqual(JSON.stringify([{ rowIndex: 0, cellIndexes: [0] }]));
                expect(gridObj.getRows()[0].children[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
                previousRowCell = args['previousRowCell'];
                previousRowCellIndex = args['selectedRowCellIndex'];
                done();
            };
            gridObj.selectionSettings.mode = 'cell';
            gridObj.selectionSettings.type = 'single';
            gridObj.cellSelected = cellSelected;
            gridObj.cellSelecting = cellSelecting;
            gridObj.dataBind();
            gridObj.selectCell({ rowIndex: 0, cellIndex: 0 });
        });

        it('DeSelect a cell', (done: Function) => {
            gridObj.cellSelected = undefined;
            gridObj.cellSelecting = undefined;
            let cellDeSelecting: EmitType<Object> = (args: Object) => {
                expect(args['data']).not.toEqual(undefined);
                expect(args['cellIndexes'][0]['cellIndexes'][0]).toEqual(0);
                expect(args['cellIndexes'][0]['rowIndex']).toEqual(0);
                expect(args['cells'][0]).toEqual(gridObj.getRows()[0].children[2]);
            };
            let cellDeSelected: EmitType<Object> = (args: Object) => {
                expect(args['data']).not.toEqual(undefined);
                expect(args['cellIndexes'][0]['cellIndexes'][0]).toEqual(0);
                expect(args['cellIndexes'][0]['rowIndex']).toEqual(0);
                expect(args['cells'][0]).toEqual(gridObj.getRows()[0].children[2]);
                gridObj.selectCell({ rowIndex: 0, cellIndex: 0 });
                done();
            };
            gridObj.cellDeselecting = cellDeSelecting;
            gridObj.cellDeselected = cellDeSelected;
            gridObj.selectCell({ rowIndex: 0, cellIndex: 0 });
        });

        //key board handling with grouping in cell selection
        it('press left arrow', () => {
            gridObj.cellDeselecting = undefined;
            gridObj.cellDeselected = undefined;
            let args: any = { action: 'leftArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
        });
        it('press right arrow', (done: Function) => {
            cellSelecting = (args: Object) => {
                expect(JSON.stringify(args['data'])).not.toBeUndefined();
                expect(JSON.stringify(args['cellIndex'])).toEqual(JSON.stringify({ rowIndex: 0, cellIndex: 1 }));
                expect(args['currentCell']).toEqual(gridObj.getRows()[0].children[3]);
                expect(JSON.stringify(args['previousRowCellIndex'])).toEqual(JSON.stringify({ rowIndex: 0, cellIndex: 0 }));
                expect(args['previousRowCell']).toEqual(previousRowCell);
                expect(args['isCtrlPressed']).toBeFalsy();
                expect(args['isShiftPressed']).toBeFalsy();
            };
            cellSelected = (args: Object) => {
                expect(JSON.stringify(args['data'])).not.toBeUndefined();
                expect(JSON.stringify(args['cellIndex'])).toEqual(JSON.stringify({ rowIndex: 0, cellIndex: 1 }));
                expect(args['currentCell']).toEqual(gridObj.getRows()[0].children[3]);
                expect(JSON.stringify(args['previousRowCellIndex'])).toEqual(JSON.stringify({ rowIndex: 0, cellIndex: 1 }));
                expect(args['previousRowCell']).toEqual(gridObj.getRows()[0].children[3]);
                expect(JSON.stringify(args['selectedRowCellIndex'])).toEqual(JSON.stringify([{ rowIndex: 0, cellIndexes: [1] }]));
                expect(gridObj.getRows()[0].children[3].classList.contains('e-cellselectionbackground')).toBeTruthy();
                done();
            };
            gridObj.cellSelected = cellSelected;
            gridObj.cellSelecting = cellSelecting;
            let args: any = { action: 'rightArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });

        it('press up arrow', () => {
            gridObj.cellSelected = undefined;
            gridObj.cellSelecting = undefined;
            let args: any = { action: 'upArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[3].classList.contains('e-cellselectionbackground')).toBeTruthy();
        });
        it('press down arrow', () => {
            let args: any = { action: 'downArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[1].children[3].classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('press ctrl+home arrow', () => {
            let args: any = { action: 'ctrlHome', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('press ctrl+end arrow', () => {
            let args: any = { action: 'ctrlEnd', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].lastElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('press right arrow', () => {
            let args: any = { action: 'rightArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].lastElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('selct multiple cell with selection type "single" ', () => {
            gridObj.selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [1, 2, 3] }]);
            expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toBe(1);
        });

        it('change selection Type as multiple', () => {
            gridObj.selectionSettings.type = 'multiple';
            gridObj.dataBind();
            expect(gridObj.getRows()[gridObj.getRows().length - 1].lastElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('press shiftUp arrow', () => {
            let args: any = { action: 'shiftUp', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toBe(gridObj.getColumns().length + 1);
        });

        it('press shiftDown arrow', () => {
            let args: any = { action: 'shiftDown', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].querySelectorAll('.e-cellselectionbackground').length).toBe(1);
        });

        it('press shiftLeft arrow', () => {
            let args: any = { action: 'shiftLeft', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].querySelectorAll('.e-cellselectionbackground').length).toBe(3);
        });

        it('press shiftRight arrow', () => {
            let args: any = { action: 'shiftRight', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].lastElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('press shift+click arrow', () => {
            gridObj.getRows()[gridObj.getRows().length - 2].children[3].dispatchEvent(shiftEvt);
            expect(gridObj.getContent().querySelectorAll('e-cellselectionbackground').length).toBe(gridObj.getColumns.length << 1);
        });

        it('press ctrl+click arrow', () => {
            gridObj.getRows()[gridObj.getRows().length - 4].children[3].dispatchEvent(ctrlEvt);
            expect(gridObj.getContent().querySelectorAll('e-cellselectionbackground').length).toBe(gridObj.getColumns.length << 1 + 1);
        });

        it('press ctrlPlusA ', () => {
            let args: any = { action: 'ctrlPlusA', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toBe(gridObj.getColumns().length * gridObj.getRows().length);
        });

        it('clear cell Selection', () => {
            gridObj.selectionModule.clearCellSelection();
            expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(0);
        });

        afterAll(() => {
            remove(elem);
        });
    });

    // navigate selected cells with hidden columns
    describe('select Row/cell in show/hide', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let columns: any;
        let rowSelected: EmitType<Object>;
        let rowSelecting: EmitType<Object>;
        let cellSelected: EmitType<Object>;
        let cellSelecting: EmitType<Object>;
        let previousRow: HTMLElement;
        let previousRowIndex: number;
        let previousRowCell: HTMLElement;
        let previousRowCellIndex: Object;
        let preventDefault: Function = new Function();
        let shiftEvt: MouseEvent = document.createEvent('MouseEvent');
        shiftEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            false, false, true, false, /* modifier keys */
            0 /*left*/, null
        );

        let ctrlEvt: MouseEvent = document.createEvent('MouseEvent');
        ctrlEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            true, false, false, false, /* modifier keys */
            0 /*left*/, null
        );

        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID', headerText: 'Order ID', visible: false },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID', visible: false },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country', visible: false }],
                    allowPaging: true,
                    selectionSettings: { mode: 'cell', type: 'multiple' },
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('initial check', () => {
            expect(gridObj.getHeaderContent().querySelectorAll('.e-headercell.e-hide').length).toBe(3);
            expect(gridObj.getContentTable().querySelectorAll('.e-hide').length).toBe(36);
        });

        it('select a cell', (done: Function) => {
            cellSelected = (args: Object) => {
                expect(gridObj.getRows()[0].children[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
                expect(gridObj.getRows()[0].children[1].hasAttribute('aria-selected')).toBeTruthy();
                done();
            };
            gridObj.cellSelected = cellSelected;
            gridObj.selectCell({ rowIndex: 0, cellIndex: 1 });
            gridObj.dataBind();
        });

        //key board handling with hidden in cell selection
        it('press left arrow', () => {
            gridObj.cellSelected = undefined;
            let args: any = { action: 'leftArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[0].children[1].hasAttribute('aria-selected')).toBeTruthy();
            expect(gridObj.getRows()[0].children[1].hasAttribute('aria-label')).toBeTruthy();
        });
        it('press right arrow', () => {
            let args: any = { action: 'rightArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[3].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[0].children[3].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('press up arrow', () => {
            let args: any = { action: 'upArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[3].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[0].children[3].hasAttribute('aria-selected')).toBeTruthy();
        });
        it('press down arrow', () => {
            let args: any = { action: 'downArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[1].children[3].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[0].children[1].hasAttribute('aria-selected')).toBeFalsy();
        });

        it('press ctrl+home arrow', () => {
            let args: any = { action: 'ctrlHome', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[0].children[1].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('press ctrl+end arrow', () => {
            let args: any = { action: 'ctrlEnd', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('press right arrow', () => {
            let args: any = { action: 'rightArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('change selection Type as multiple', () => {
            gridObj.selectionSettings.type = 'multiple';
            gridObj.dataBind();
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('press shiftUp arrow', () => {
            let args: any = { action: 'shiftUp', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toBe(gridObj.getColumns().length + 1);
            expect(gridObj.getRows()[gridObj.getRows().length - 2].children[4].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('press shiftDown arrow', () => {
            let args: any = { action: 'shiftDown', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].querySelectorAll('.e-cellselectionbackground').length).toBe(1);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('press shiftLeft arrow', () => {
            let args: any = { action: 'shiftLeft', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].querySelectorAll('.e-cellselectionbackground').length).toBe(2);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[3].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('press shiftRight arrow', () => {
            let args: any = { action: 'shiftRight', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('clear cell Selection', () => {
            gridObj.selectionModule.clearCellSelection();
            expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(0);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].hasAttribute('aria-selected')).toBeFalsy();
        });

        afterAll(() => {
            remove(elem);
        });
    });
});