/**
 * Grid Clipboard spec document
 */
import { Browser, EmitType, extend } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Selection } from '../../../src/grid/actions/selection';
import { Clipboard } from '../../../src/grid/actions/clipboard';
import { employeeData } from '../base/datasource.spec';
import { BeforeCopyEventArgs } from '../../../src/grid/base/interface';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Selection, Clipboard);

describe('Grid clipboard copy testing - row type selection', () => {
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
                dataSource: employeeData, dataBound: dataBound,
                columns: [
                    { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right', width: 135, },
                    { field: 'FirstName', headerText: 'Name', width: 125 },
                    { field: 'Title', headerText: 'Title', width: 180 },
                ],
                allowSelection: true,
                selectionSettings: { type: 'multiple' }
            });
        gridObj.appendTo('#Grid');
    });

    it('Check hidden clipboard textarea', () => {
        let clipArea: HTMLElement = (gridObj.element.querySelectorAll('.e-clipboard')[0] as HTMLElement);
        expect(gridObj.element.querySelectorAll('.e-clipboard').length > 0).toBeTruthy();
        expect(clipArea.style.opacity === '0').toBeTruthy();
    });

    it('Check with row type selection', () => {
        gridObj.selectRows([0, 1]);
        gridObj.copy();
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === '1	Nancy	Sales Representative\n2	Andrew	Vice President, Sales').toBeTruthy();
    });

    it('Check with row type selection - include header', () => {
        gridObj.copy(true);
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === 'Employee ID	Name	Title\n1	Nancy	Sales Representative\n2	Andrew	Vice President, Sales').toBeTruthy();
    });

    it('Browser default selection for coverage', () => {
        let range: any = document.createRange();
        range.selectNodeContents(gridObj.element.querySelectorAll('.e-rowcell')[2]);
        let selection: any = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        gridObj.copy();
        selection.removeAllRanges();
    });

    it('Check with row type selection in iOS Device', () => {
        let iphoneUa: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6' +
            ' (KHTML, like Gecko) Version/10.0 Mobile/14D27 Safari/602.1';
        let browUa: string = Browser.userAgent;
        Browser.userAgent = iphoneUa;
        gridObj.copy();
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === '1	Nancy	Sales Representative\n2	Andrew	Vice President, Sales').toBeTruthy();
        Browser.userAgent = browUa;
    });

    it('Check clipboard area after destroy', () => {
        gridObj.clipboardModule.destroy();
        expect(document.querySelectorAll('.e-clipboard').length === 0).toBeTruthy();
    });

    afterAll(() => {
        remove(elem);
    });
});

describe('Grid clipboard copy testing - cells type selection', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let selectionModule: Selection;
    let gridBeforeCopy: (e: BeforeCopyEventArgs) => void;
    let rows: Element[];
    beforeAll((done: Function) => {
        let dataBound: EmitType<Object> = () => { done(); };
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: employeeData, dataBound: dataBound,
                columns: [
                    { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right', width: 135, },
                    { field: 'FirstName', headerText: 'Name', width: 125 },
                    { field: 'Title', headerText: 'Title', width: 180 },
                ],
                allowSelection: true,
                selectionSettings: { type: 'multiple', mode: 'cell' },
                beforeCopy: gridBeforeCopy
            });
        gridObj.appendTo('#Grid');
    });

    it('Check with cells type selection', () => {
        gridObj.selectionModule.selectCells([{
            rowIndex: 0,
            cellIndexes: [0, 1]
        }, {
            rowIndex: 1,
            cellIndexes: [1, 2]
        }])
        gridObj.copy();
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === '1\nNancy\nAndrew\nVice President, Sales').toBeTruthy();
    });

    it('Check with row type selection - include header', () => {
        gridObj.selectionModule.selectCells([{
            rowIndex: 0,
            cellIndexes: [0, 1]
        }, {
            rowIndex: 1,
            cellIndexes: [1, 2]
        }])
        gridObj.copy(true);
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === 'Employee ID\n1\nName\nNancy\nName\nAndrew\nTitle\nVice President, Sales').toBeTruthy();
    });

    it('Check with ctrlPlusC key press', () => {
        let preventDefault: Function = new Function();
        let args: any = { action: 'ctrlPlusC', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === '1\nNancy\nAndrew\nVice President, Sales').toBeTruthy();
    });

    it('Check with ctrlShiftPlusH key press', () => {
        let preventDefault: Function = new Function();
        let args: any = { action: 'ctrlShiftPlusH', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === 'Employee ID\n1\nName\nNancy\nName\nAndrew\nTitle\nVice President, Sales').toBeTruthy();
        args.action = 'space';
        args.target = document.querySelector('.e-clipboard') as HTMLInputElement;
        gridObj.keyboardModule.keyAction(args);
    });

    it('Check with args cancel for coverage', () => {
        gridBeforeCopy = (args: BeforeCopyEventArgs): void => {
            args.cancel = true;
        };
        gridObj.beforeCopy = gridBeforeCopy;
        gridObj.copy();
        gridObj.destroy();
        gridObj.clipboardModule.addEventListener();
        gridObj.clipboardModule.removeEventListener();
    });

    afterAll(() => {
        remove(elem);
    });
});
