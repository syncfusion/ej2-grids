/**
 * Data spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { Query, DataManager, ODataV4Adaptor, DataUtil } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { CustomSummaryType } from '../../../src/grid/base/type';
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { AggregateColumn } from '../../../src/grid/models/aggregate';
import { GridModel } from '../../../src/grid/base/grid-model';
import { extend } from '@syncfusion/ej2-base';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Aggregate);

let createGrid: Function = (options: GridModel, done: Function): Grid => {
    let grid: Grid;
    let dataBound: EmitType<Object> = () => { done(); };
    grid = new Grid(
        extend(
            {}, {
                dataSource: data.slice(0, 15),
                dataBound: dataBound
            },
            options,
        )
    );
    grid.appendTo(createElement('div', { id: 'Grid' }));
    return grid;
};

let destroy: EmitType<Object> = (grid: Grid) => {
    if (grid) {
        grid.destroy();
        document.getElementById('Grid').remove();
    }
};

describe('Aggregates Functionality testing', () => {
    describe('Default functionality', () => {
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
                        { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'average',
                            field: 'Freight',
                            format: 'c2'
                        }]
                    }, {
                        columns: [{
                            type: 'max',
                            field: 'OrderDate',
                            format: { type: 'date', skeleton: 'medium' },
                            footerTemplate: '${max}'
                        }]
                    }]
                },
                done
            );
        });
        it('check content and table visiblity', () => {
            expect(grid.getFooterContent()).not.toBeNull();
            expect(grid.getFooterContentTable()).not.toBeNull();
        });
        it('check summary value', () => {
            let rows = ((grid.getFooterContentTable() as HTMLTableElement).tFoot.rows[0] as HTMLTableRowElement);
            expect(rows.cells[2].innerHTML).toBe('$' + DataUtil.aggregates.average(grid.dataSource, 'Freight').toFixed(2));
        });
        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Default functionality - Empty DataSource', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: [],
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'average',
                            field: 'Freight',
                            format: 'c2'
                        }]
                    }, {
                        columns: [{
                            type: 'max',
                            field: 'OrderDate',
                            format: { type: 'date', skeleton: 'medium' },
                            footerTemplate: '${max}'
                        }]
                    }]
                },
                done
            );
        });
        it('check content and table visiblity', () => {
            expect(grid.getFooterContentTable().querySelector('.e-summarycell')).toBeNull();
        });
        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Group functionality enabled', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    allowGrouping: true,
                    groupSettings: { columns: ['Verified'], showGroupedColumn: true },
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right'
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'average',
                            field: 'Freight',
                            format: 'c2'
                        }]
                    }, {
                        columns: [{
                            type: ['max'],
                            field: 'OrderDate',
                            format: 'yMd',
                            footerTemplate: '${max}'
                        }]
                    }]
                },
                done
            );
        });
        it('check summary value', () => {
            let rows = ((grid.getFooterContentTable() as HTMLTableElement).tFoot.rows[0] as HTMLTableRowElement);
            expect(rows.cells[3].innerHTML).toBe('$' + DataUtil.aggregates.average(grid.dataSource, 'Freight').toFixed(2));
            expect(rows.cells[0].classList.contains('e-indentcell')).toBeTruthy();
        });
        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Group and caption summary functionality enabled', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    allowGrouping: true,
                    allowPaging: true,
                    groupSettings: { columns: ['EmployeeID'] },
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right'
                        },
                        { field: 'Verified', displayAsCheckBox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'average',
                            field: 'Freight',
                            groupFooterTemplate: '${average}'
                        }]
                    },
                    {
                        columns: [{
                            type: ['max'],
                            field: 'OrderDate',
                            format: 'yMd',
                            groupCaptionTemplate: '${max}'
                        }]
                    }]
                },
                done
            );
        });

        it('Footer disabled check', () => {
            expect((grid.getFooterContentTable() as HTMLTableElement).tFoot.rows.length).toBe(0);
        });
        it('check caption summary value', () => {
            let rows: HTMLTableRowElement = <any>(grid.getContentTable() as HTMLTableElement)
                .querySelector('.e-summarycell.e-templatecell');
            let val: string | Object = grid.valueFormatterService.toView(
                DataUtil.aggregates.max((<{ items: Object[] }>grid.currentViewData[0]).items, 'OrderDate'),
                (<AggregateColumn>grid.aggregates[1].columns[0]).getFormatter());
            //  expect(rows.innerHTML).toBe(<string>val);
        });

        it('check group summary value', () => {
            let rows: HTMLTableRowElement = (<any>(grid.getContentTable() as HTMLTableElement)
                .querySelector('.e-summaryrow') as HTMLTableRowElement);
            // expect(rows.cells[3].innerHTML).toBe(
            //     DataUtil.aggregates.average((<{ items: Object[] }>grid.currentViewData[0]).items, 'Freight') + '');
        });

        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Custom summary functionality', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        let customSum: CustomSummaryType = (data: Object[], column: Object) => 'Best Employee: 1';
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    allowGrouping: true,
                    groupSettings: { columns: ['Verified'] },
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right'
                        },
                        { field: 'Verified', displayAsCheckBox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'custom',
                            columnName: 'EmployeeID',
                            customAggregate: customSum
                        },
                        //Use this to provide title in another column.
                        {
                            type: 'custom',
                            columnName: 'OrderID',
                            footerTemplate: 'Custom'
                        }]
                    }]
                },
                done
            );
        });

        it('check custom footer summary', () => {
            let rows: HTMLTableRowElement = <any>(grid.getFooterContentTable() as HTMLTableElement).tFoot.rows[0];
            expect(rows.cells[5].innerHTML).toBe('Best Employee: 1');
        });

        it('check custom caption summary value', () => {
            let rows: HTMLTableRowElement = <any>(grid.getContentTable() as HTMLTableElement)
                .querySelector('.e-summarycell:not(:empty)');
            expect(rows.innerHTML).toBe('Best Employee: 1');
        });

        it('check group summary value', () => {
            let rows: HTMLTableRowElement = (<any>(grid.getContentTable() as HTMLTableElement)
                .querySelector('.e-summaryrow') as HTMLTableRowElement);
            expect(rows.cells[5].innerHTML).toBe('Best Employee: 1');
        });

        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Set Model', () => {
        describe('Enable summary', () => {
            let grid: Grid;
            let rows: HTMLTableRowElement;
            beforeAll((done: Function) => {
                grid = createGrid(
                    {
                        allowGrouping: true,
                        groupSettings: { columns: ['Verified'] },
                        columns: [
                            {
                                field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                                textAlign: 'right'
                            },
                            { field: 'Verified', displayAsCheckBox: true, type: 'boolean' },
                            { field: 'Freight', format: 'C1' },
                            { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                            { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                        ]
                    },
                    () => {
                        grid.aggregates = [{
                            columns: [{
                                type: 'average',
                                field: 'Freight',
                                groupFooterTemplate: '${average}'
                            }]
                        },
                        {
                            columns: [{
                                type: ['max'],
                                field: 'OrderDate',
                                format: 'yMd',
                                groupCaptionTemplate: '${max}'
                            }]
                        }];
                        grid.dataBind();
                        done();
                    }
                );
            });

            it('check footer summary', () => {
                let footer: Element = grid.element.querySelector('.e-gridfooter');
                expect(footer).not.toBeNull();
            });

            afterAll(() => {
                destroy(grid);
            });
        });
        describe('Enable summary without group/caption summary', () => {
            let grid: Grid;
            let rows: HTMLTableRowElement;
            beforeAll((done: Function) => {
                grid = createGrid(
                    {
                        allowGrouping: true,
                        groupSettings: { columns: ['Verified'] },
                        columns: [
                            {
                                field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                                textAlign: 'right'
                            },
                            { field: 'Verified', displayAsCheckBox: true, type: 'boolean' },
                            { field: 'Freight', format: 'C1' },
                            { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                            { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                        ]
                    },
                    () => {
                        grid.aggregates = [{
                            columns: [{
                                type: 'average',
                                field: 'Freight',
                                footerTemplate: '${average}'
                            }]
                        }];
                        grid.dataBind();
                        done();
                    }
                );
            });

            it('check footer summary', () => {
                let footer: Element = grid.element.querySelector('.e-gridfooter');
                expect(footer).not.toBeNull();
            });

            afterAll(() => {
                destroy(grid);
            });
        });
        describe('Skip on other module update', () => {
            let grid: Grid;
            let rows: HTMLTableRowElement;
            beforeAll((done: Function) => {
                grid = createGrid(
                    {
                        allowGrouping: true,
                        groupSettings: { disablePageWiseAggregates: true, columns: ['Verified'] },
                        columns: [
                            {
                                field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                                textAlign: 'right'
                            },
                            { field: 'Verified', displayAsCheckBox: true, type: 'boolean' },
                            { field: 'Freight', format: 'C1' },
                            { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                            { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                        ],
                        aggregates: [{
                            columns: [{
                                type: 'average',
                                field: 'Freight',
                                groupFooterTemplate: '${average}'
                            }]
                        },
                        {
                            columns: [{
                                type: ['max'],
                                field: 'OrderDate',
                                format: 'yMd',
                                groupCaptionTemplate: '${max}'
                            }]
                        }]
                    },
                    done
                );
            });

            it('skip on other module update', () => {
                grid.allowPaging = true;
                grid.dataBind();
                let footer: Element = grid.element.querySelector('.e-gridfooter');
                expect(footer).not.toBeNull();
            });

            afterAll(() => {
                destroy(grid);
            });
        });
    });

    describe('Summary dynamic show/hide column', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;        
        beforeAll((done: Function) => {
		window['browserDetails']['isDevice'] = true;
            grid = createGrid(
                {
                    allowGrouping: true,
                    groupSettings: { columns: ['Verified'] },
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right'
                        },
                        { field: 'Verified', displayAsCheckBox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'average',
                            field: 'Freight',
                        }]
                    }],
                },
                () => {
                    grid.hideColumns('Order ID');
                    done();
                }
            );
        });

        it('Check cell visibility', () => {
            let rows: HTMLTableRowElement = <any>(grid.getFooterContentTable() as HTMLTableElement).tFoot.rows[0] as HTMLTableRowElement;
            expect(rows.cells[1].classList.contains('e-hide')).toBeTruthy();
            //for coverage
            grid.aggregates = [];
            grid.dataBind();
        });

        afterAll(() => {
            window['browserDetails']['isDevice'] = false;
            destroy(grid);
        });
    });

    describe('Aggregation with detailTemplate', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: [],
                    detailTemplate: '${OrderID}',
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'average',
                            field: 'Freight',
                            format: 'c2'
                        }]
                    }, {
                        columns: [{
                            type: 'max',
                            field: 'OrderDate',
                            format: { type: 'date', skeleton: 'medium' },
                            footerTemplate: '${max}'
                        }]
                    }]
                },
                done
            );
        });
        it('check colgroup length', () => {
            expect(grid.getFooterContentTable().querySelectorAll('colgroup col').length).toBe(grid.getColumns().length + 1);
        });
        afterAll(() => {
            destroy(grid);
        });
    });

});