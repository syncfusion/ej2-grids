/**
 * Command Column spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Column } from '../../../src/grid/models/column';
import { data } from '../base/datasource.spec';
import { CommandColumn } from '../../../src/grid/actions/command-column';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { Edit } from '../../../src/grid/actions/edit';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Filter } from '../../../src/grid/actions/filter';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Group, Sort, Filter, Reorder, CommandColumn, Edit);

describe('Command Column ', () => {

    describe('Command Column Rendering feature', () => {
        let rows: HTMLTableRowElement;
        let grid: Grid;
        let element: Element = createElement('div', { id: 'Grid' });
        beforeAll((done: EmitType<Object>) => {
            document.body.appendChild(element);
            grid = new Grid(
                {
                    columns: [
                        {
                            commands: [{type: 'edit', buttonOption: {content: 'edit'}},
                            {type: 'delete', buttonOption: {content: 'delete'}},
                            {type: 'save', buttonOption: {content: 'save'}},
                            {type: 'cancel', buttonOption: {content: 'cancel'}}
                        ], headerText: 'Command Column'
                        }
                    ],
                    dataSource: [{ data: { a: 1 }, b: 5, c: true, d: new Date() },
                    { data: { a: 2 }, b: 6, c: false, d: new Date() }],
                    allowPaging: false, dataBound: done
                }
            );
            grid.appendTo('#Grid');
        });

        it('Command Column initial render checking', () => {
            rows = <HTMLTableRowElement>grid.getRows()[0];
            expect(rows.querySelector('.e-unboundcelldiv').children.length).toBe(4);
            expect(rows.querySelector('.e-unboundcelldiv').children[0].classList.contains('e-edit-delete')).toBeTruthy();
            expect(rows.querySelector('.e-unboundcelldiv').children[1].classList.contains('e-edit-delete')).toBeTruthy();
            expect(rows.querySelector('.e-unboundcelldiv').children[2].classList.contains('e-save-cancel')).toBeTruthy();
            expect(rows.querySelector('.e-unboundcelldiv').children[3].classList.contains('e-save-cancel')).toBeTruthy();
            expect(rows.querySelector('.e-unboundcelldiv').children[2].classList.contains('e-hide')).toBeTruthy();
            expect(rows.querySelector('.e-unboundcelldiv').children[3].classList.contains('e-hide')).toBeTruthy();
            expect(rows.querySelector('.e-unboundcelldiv').children[0].classList.contains('e-editbutton')).toBeTruthy();
            expect(rows.querySelector('.e-unboundcelldiv').children[1].classList.contains('e-deletebutton')).toBeTruthy();
            expect(rows.querySelector('.e-unboundcelldiv').children[2].classList.contains('e-savebutton')).toBeTruthy();
            expect(rows.querySelector('.e-unboundcelldiv').children[3].classList.contains('e-cancelbutton')).toBeTruthy();
        });

        it('Render Command Column with single string', (done: Function) => {

            grid.dataBound = () => {
                rows = <HTMLTableRowElement>grid.getRows()[0];
                expect(rows.querySelector('.e-unboundcelldiv').children[0].classList.contains('e-deletebutton')).toBeTruthy();
                done();
            };
            (<Column>grid.columns[0]).commands = [{type: 'delete', buttonOption: {content: 'delete'}}];
            grid.refresh();
        });
        it('Render Command Column with predefined and custom buttons', (done: Function) => {
            let buttonClick = (args: Event) => {
                expect((<HTMLElement>args.target).classList.contains('e-details')).toBeTruthy();
                done();
            };
            grid.dataBound = () => {
                rows = <HTMLTableRowElement>grid.getRows()[0];
                expect((<HTMLElement>rows.querySelector('.e-unboundcelldiv').children[1]).innerText.toLowerCase()).toBe('details');
                expect((<HTMLElement>rows.querySelector('.e-unboundcelldiv').children[0]).innerText.toLowerCase()).toBe('edit');
                (<HTMLElement>rows.querySelector('.e-details')).click();
            };
            (<Column>grid.columns[0]).commands = [{type: 'edit', buttonOption: {content: 'edit'}} ,
            {buttonOption: { content: 'Details', click: buttonClick, cssClass: 'e-details' }} ];
            grid.refresh();
        });

        afterAll(() => {
            remove(element);
        });

    });

    describe('Command column with sorting, filtering, grouping enable', () => {
        let row: HTMLTableRowElement;
        let grid: Grid;
        let element: Element = createElement('div', { id: 'Grid' });
        let actionBegin: (e?: Object) => void;
        let actionComplete: (e?: Object) => void;
        beforeAll((done: EmitType<Object>) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(element);
            grid = new Grid(
                {
                    dataSource: data,
                    allowGrouping: true,
                    allowFiltering: true,
                    allowSorting: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' },
                    {
                        commands: [{type: 'edit', buttonOption: {content: 'edit'}},
                        {type: 'delete', buttonOption: {content: 'delete'}},
                        {type: 'cancel', buttonOption: {content: 'cancel'}},
                        {type: 'save', buttonOption: {content: 'save'}}
                    ], headerText: 'Command Column'
                    }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                }
            );
            grid.appendTo('#Grid');
        });

        it('Initial checking', () => {
            row = <HTMLTableRowElement>grid.getRows()[3];
            expect(row.querySelector('.e-unboundcelldiv').children.length).toBe(4);
            (<HTMLElement>row.querySelector('.e-unboundcelldiv').children[0]).click();
        });
        it('grouping, sorting, filtering test', () => {
            expect((<Column>grid.columns[5]).allowGrouping).toBeFalsy();
            expect((<Column>grid.columns[5]).allowFiltering).toBeFalsy();
            expect((<Column>grid.columns[5]).allowSorting).toBeFalsy();
            // for coverage
            grid.isDestroyed = true;
            (<any>grid).commandColumnModule.addEventListener();
            (<any>grid).commandColumnModule.destroy();
            (<any>grid).commandColumnModule.removeEventListener();
            grid.isDestroyed = false;
            (<any>grid).commandColumnModule.removeEventListener();
            (<any>grid).commandColumnModule.destroy();
        });

        afterAll(() => {
            remove(element);
        });
    });
    describe('Command column with Editing enable', () => {
        let row: HTMLTableRowElement;
        let grid: Grid;
        let element: Element = createElement('div', { id: 'Grid' });
        let actionBegin: (e?: Object) => void;
        let actionComplete: (e?: Object) => void;
        beforeAll((done: EmitType<Object>) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(element);
            grid = new Grid(
                {
                    dataSource: data,
                    editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true },
                    columns: [{ field: 'OrderID', isPrimaryKey: true }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' },
                    {
                        commands: [{type: 'edit', buttonOption: {content: 'edit'}},
                        {type: 'delete', buttonOption: {content: 'delete'}},
                        {type: 'cancel', buttonOption: {content: 'cancel'}},
                        {type: 'save', buttonOption: {content: 'save'}}
                    ], headerText: 'Command Column'
                    }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                }
            );
            grid.appendTo('#Grid');
        });

        it('Editing feature with command edit', (done: Function) => {
            grid.actionComplete = (args) => {
                if (args.requestType === 'beginEdit') {
                    expect(grid.getRows()[0].querySelector('.e-unboundcelldiv').children[0].classList.contains('e-hide')).toBeTruthy();
                    (<any>grid).commandColumnModule.commandClickHandler({ target: grid.getRows()[0].querySelector('.e-unboundcelldiv').children[3] });
                }
                if (args.requestType === 'save') {
                    done();
                }
            }
            expect(grid.getRows()[0].querySelector('.e-unboundcelldiv').children.length).toBe(4);
            (<any>grid).commandColumnModule.commandClickHandler({ target: grid.getRows()[0].querySelector('.e-unboundcelldiv').children[0] });
        });

        it('Editing feature with edit new row', (done: Function) => {
            grid.actionComplete = (args) => {
                if (args.requestType === 'beginEdit') {
                    expect(grid.getRows()[4].querySelector('.e-unboundcelldiv').children[0].classList.contains('e-hide')).toBeTruthy();
                    (<any>grid).commandColumnModule.commandClickHandler({ target: grid.getRows()[2].querySelector('.e-unboundcelldiv').children[0] });
                }
                if (args.requestType === 'save') {
                    grid.actionComplete = undefined;
                    (<any>grid).commandColumnModule.commandClickHandler({ target: grid.getRows()[2].querySelector('.e-unboundcelldiv').children[2] });
                    done();
                }
            }
            (<any>grid).commandColumnModule.commandClickHandler({ target: grid.getRows()[4].querySelector('.e-unboundcelldiv').children[0] });
        });


        it('keyboard Testing', (done) => {
            grid.actionComplete = (args) => {
                if (args.requestType === 'beginEdit') {
                    expect(grid.getRows()[0].querySelector('.e-unboundcelldiv').children[0].classList.contains('e-hide')).toBeTruthy();
                    done();
                }
            }
            (<any>grid).commandColumnModule.keyPressHandler({ action: 'enter', target: grid.getRows()[0].querySelector('.e-unboundcelldiv').children[0], preventDefault: function () { } });
            (<any>grid).commandColumnModule.keyPressHandler({ action: 'enter', target: grid.getRows()[0].querySelector('.e-unboundcelldiv') });
        });

        afterAll(() => {
            remove(element);
        });
    });
    describe('Command column with deleting', () => {
        let row: HTMLTableRowElement;
        let grid: Grid;
        let element: Element = createElement('div', { id: 'Grid' });
        let actionBegin: (e?: Object) => void;
        let actionComplete: (e?: Object) => void;
        beforeAll((done: EmitType<Object>) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(element);
            grid = new Grid(
                {
                    columns: [
                        { field: 'b' },
                        {
                            commands: [{type: 'edit', buttonOption: {content: 'edit'}},
                             {type: 'delete', buttonOption: {content: 'delete'}},
                             {type: 'cancel', buttonOption: {content: 'cancel'}},
                             {type: 'save', buttonOption: {content: 'save'}},
                             { buttonOption: {content: 'Details'}}], headerText: 'Command Column'
                        }
                    ],
                    dataSource: [{ data: { a: 1 }, b: 5, c: true, d: new Date() },
                    { data: { a: 2 }, b: 6, c: false, d: new Date() }],
                    editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true },
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                }
            );
            grid.appendTo('#Grid');
        });

        it('Editing feature with delete command', (done: Function) => {
            grid.actionComplete = (args) => {
                if (args.requestType === 'delete') {
                    expect(grid.getRows()[0].querySelector('.e-unboundcelldiv').children[0].classList.contains('e-hide')).toBeFalsy();
                    done();
                }
            }
            (<any>grid).commandColumnModule.commandClickHandler({ target: grid.getRows()[grid.getRows().length - 1].querySelector('.e-unboundcelldiv').children[1] });
        });

        afterAll(() => {
            remove(element);
        });
    });
    describe('Command column with feature combinations', () => {
        let row: HTMLTableRowElement;
        let grid: Grid;
        let element: Element = createElement('div', { id: 'Grid' });
        let actionBegin: (e?: Object) => void;
        let actionComplete: (e?: Object) => void;
        beforeAll((done: EmitType<Object>) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(element);
            grid = new Grid(
                {
                    dataSource: data,
                    allowReordering: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' },
                    {
                        field: 'commandcolumn', commands: [{type: 'edit', buttonOption: {content: 'edit'}},
                        {type: 'delete', buttonOption: {content: 'delete'}},
                        {type: 'cancel', buttonOption: {content: 'cancel'}},
                        {type: 'save', buttonOption: {content: 'save'}},
                        { buttonOption: {content: 'Details'}}
                    ], headerText: 'Command Column'
                    }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                }
            );
            grid.appendTo('#Grid');
        });

        it('Reordering the command column', (done: Function) => {
            let commandColumn: Column = <Column>grid.columns[5];
            grid.actionComplete = () => {
                expect((<Column>grid.columns[0]).headerText).toBe(commandColumn.headerText);
                done();
            };
            grid.reorderModule.reorderColumns('commandcolumn', 'OrderID');
        });

        it('Selection with command column', (done: Function) => {
            grid.rowSelected = () => {
                expect(grid.getRows()[0].children[0].classList.contains('e-selectionbackground')).toBeTruthy();
                done();
            };
            grid.actionComplete = undefined;
            (<HTMLElement>grid.getContent().querySelector('tr').firstElementChild).click();
        });

        it('CommandColumn with print', (done: Function) => {
            grid.beforePrint = (args: { element: Element }) => {
                row = args.element.querySelector('.e-gridcontent').querySelectorAll('tr')[0];
                expect(row.firstElementChild.classList.contains('e-unboundcell')).toBeTruthy();
                done();
            };
            grid.print();
        });

        afterAll((done) => {
            remove(element);
            setTimeout(function () {
                done();
            }, 1000);
    
        });
    });

});