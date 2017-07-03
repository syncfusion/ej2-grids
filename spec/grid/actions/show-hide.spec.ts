/**
 * Show hide module specs
 */
import { EmitType } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base/util';
import { createElement, remove } from '@syncfusion/ej2-base/dom';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { contentReady } from '../../../src/grid/base/constant';
import { GridModel } from '../../../src/grid/base/grid-model';
import { Column } from '../../../src/grid/models/column';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Filter);

describe('ShowHide module testing', () => {

    let createGrid: Function = (options: GridModel, done: Function): Grid => {
        let grid: Grid;
        let dataBound: EmitType<Object> = () => { done(); };
        grid = new Grid(
            extend(
                {}, {
                    dataSource: data,
                    dataBound: dataBound,
                },
                options
            )
        );
        grid.appendTo(createElement('div', { id: 'Grid' }));
        return grid;
    };

    let destroy: EmitType<Object> = (grid: Grid) => {
        if (grid) {
            //  grid.destroy();
            document.getElementById('Grid').remove();
        }
    };

    describe('Hide column at initial rendering', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ]
                },
                done
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toEqual('none');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toEqual('none');
        });


        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Show Column using headerText', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ]
                },
                () => {
                    grid.on(contentReady, done);
                    grid.showColumns('Order ID');
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toEqual('');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toEqual('');
        });


        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Hide Column using headerText', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ]
                },
                () => {
                    grid.on(contentReady, done);
                    grid.hideColumns('Order ID');
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toEqual('none');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toEqual('none');
        });


        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Show Column using field', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ]
                },
                () => {
                    grid.on(contentReady, done);
                    grid.showColumns(['OrderID'], 'field');
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toEqual('');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toEqual('');
        });


        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Hide Column using field', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ]
                },
                () => {
                    grid.on(contentReady, done);
                    grid.hideColumns(['OrderID'], 'field');
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toEqual('none');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toEqual('none');
        });


        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Show Column using UID', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ]
                },
                () => {
                    grid.on(contentReady, done);
                    grid.showColumns((<Column>grid.getColumns()[0]).uid, 'uid');
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toEqual('');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toEqual('');
        });


        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Hide Column using UID', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ]
                },
                () => {
                    grid.on(contentReady, done);
                    grid.hideColumns((<Column>grid.getColumns()[0]).uid, 'uid');
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toEqual('none');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toEqual('none');
        });


        afterAll(() => {
            destroy(grid);
        });
    });

    describe('SetVisible function', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ]
                },
                () => {
                    grid.on(contentReady, done);
                    let cols: Column[] = <Column[]>(grid.getColumns());
                    cols[0].visible = true;
                    cols[1].visible = false;
                    grid.showHider.setVisible();
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[1].classList.contains('e-hide')).toBeTruthy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[1] as HTMLTableRowElement;
            expect(rows.cells[1].classList.contains('e-hide')).toBeTruthy();
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toEqual('');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toEqual('');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[1];
            expect(col.style.display).toEqual('none');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[1];
            expect(col.style.display).toEqual('none');
        });


        afterAll(() => {
            destroy(grid);
        });
    });

    // check Show-hide enabled with filtering

    describe('show/hide with filtering', () => {
        let grid: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            grid = new Grid(
                {
                    dataSource: data,
                    allowFiltering: true,
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckBox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ],
                    dataBound: dataBound
                });
            grid.appendTo('#Grid');
        });
        it('render grid with filter enable', () => {
            expect(grid.getHeaderContent().querySelectorAll('.e-filterbarcell.e-hide').length).
                toEqual(grid.getHeaderContent().querySelectorAll('.e-headercell.e-hide').length);
        });
        it('hide a column with filter enabled', (done: Function) => {
            grid.hideColumns('Verified', 'headerText');
            setTimeout(() => {
                expect(grid.getHeaderContent().querySelectorAll('.e-headercell.e-hide').length).toEqual(2);
                expect(grid.getHeaderContent().querySelectorAll('.e-filterbarcell.e-hide').length).toEqual(2);
                expect(grid.getContent().querySelectorAll('.e-rowcell.e-hide').length).toEqual(grid.currentViewData.length * 2)
                done();
            }, 1000);

        });
        it('show hidden columns', (done: Function) => {
            grid.showColumns(['Verified', 'Order ID'], 'headerText');
            setTimeout(() => {
                expect(grid.getHeaderContent().querySelectorAll('.e-headercell.e-hide').length).toEqual(0);
                expect(grid.getContent().querySelectorAll('.e-rowcell.e-hide').length).toEqual(0);
                done();
            }, 1000);

        });
        afterAll(() => {
            destroy(grid);
        });
    });
});