/**
 * Grid Filtering spec document
 */
import { EventHandler, ChildProperty, EmitType, L10n } from '@syncfusion/ej2-base';
import { extend, getValue } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Group } from '../../../src/grid/actions/group';
import { Page } from '../../../src/grid/actions/page';
import { Freeze } from '../../../src/grid/actions/freeze';
import { createGrid, destroy } from '../base/specutil.spec';
import { CellType } from '../../../src/grid/base/enum';
import { ValueFormatter } from '../../../src/grid/services/value-formatter';
import { Column } from '../../../src/grid/models/column';
import { Selection } from '../../../src/grid/actions/selection';
import { ExcelFilter } from '../../../src/grid/actions/excel-filter';
import { filterData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Filter, Page, Selection, Group, Freeze);

let getActualProperties: Function = (obj: any): any => {
    if (obj instanceof ChildProperty) {
        return <any>getValue('properties', obj);
    } else {
        return obj;
    }
};

let getString: Function = (obj: any) => {
    return JSON.stringify(obj, (key: string, value: Object) => {
        return getActualProperties(value);
    });
};

describe('Excel Filter functionalities', () => {
    let l10n: L10n;
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: () => void;
    let actionComplete: () => void;
    let filterElement: HTMLInputElement;
    let orderIDElement: HTMLInputElement;

    let numOptr: Object[] = [
        { value: 'equal', text: 'Equal' },
        { value: 'greaterThan', text: 'Greater Than' },
        { value: 'greaterThanOrEqual', text: 'Greater Than Or Equal' },
        { value: 'lessThan', text: 'Less Than' },
        { value: 'lessThanOrEqual', text: 'Less Than Or Equal' },
        { value: 'notEqual', text: 'Not Equal' }
    ];
    let customOperators: Object = {
        stringOperator: [
            { value: 'startsWith', text: 'Starts With' },
            { value: 'endsWith', text: 'Ends With' },
            { value: 'contains', text: 'Contains' },
            { value: 'equal', text: 'Equal' }, { value: 'notEqual', text: 'Not Equal' }],
        numberOperator: numOptr,
        dateOperator: numOptr,
        datetimeOperator: numOptr,
        booleanOperator: [
            { value: 'equal', text: 'Equal' }, { value: 'notEqual', text: 'Not Equal' }
        ]
    };
    beforeAll((done: Function) => {
        let dataBound: EmitType<Object> = () => { done(); };
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: filterData,
                allowFiltering: true,
                allowPaging: false,
                filterSettings: {
                    type: 'Excel',
                    columns: [
                        {
                            field: "ShipCountry",
                            operator: "contains",
                            value: "a",
                            predicate: "or",
                            matchCase: false,
                        }
                    ]
                },
                columns: [
                    { field: 'OrderID', type: 'number', visible: true },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'EmployeeID', type: 'number' },
                    { field: 'Freight', format: 'C2', type: 'number' },
                    { field: 'ShipCity' },
                    { field: 'Verified', type: 'boolean' },
                    { field: 'ShipName', allowFiltering: false },
                    { field: 'ShipCountry', type: 'string' },
                    { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' },
                    { field: 'ShipAddress', allowFiltering: true, visible: false }
                ],
                actionBegin: actionBegin,
                actionComplete: actionComplete,
                dataBound: dataBound
            });
        gridObj.appendTo('#Grid');
    });

    it('pre-filter-settings', (done: Function) => {
        expect(gridObj.element.querySelectorAll('.e-row').length).toBe(58);
        expect(getString(gridObj.filterSettings.columns)).toBe('[{"field":"ShipCountry","operator":"contains","value":"a","predicate":"or","matchCase":false,"ignoreAccent":false,"actualFilterValue":{},"actualOperator":{}}]');
        done();
    });
    it('or-predicate', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(58);
            expect(getString(gridObj.filterSettings.columns)).toBe('[{"field":"ShipCountry","operator":"contains","value":"a","predicate":"or","matchCase":false,"ignoreAccent":false,"actualFilterValue":{},"actualOperator":{}},{"field":"OrderID","predicate":"or","matchCase":false,"ignoreAccent":false,"operator":"greaterthan","value":10249,"type":"number"},{"field":"OrderID","predicate":"or","matchCase":false,"ignoreAccent":false,"operator":"lessthan","value":10280,"type":"number"}]');
            done();
        };


        let test = (<any>gridObj.filterModule);
        test.filterSettings = gridObj.filterSettings; //, gridObj.serviceLocator);
        let excel: any = new (<any>gridObj.filterModule).type['Excel'](
            gridObj, gridObj.filterSettings, gridObj.serviceLocator,
            customOperators);
        excel.updateModel({
            type: 'number', field: 'OrderID', displayName: 'Order ID',
            dataSource: gridObj.dataSource,
            filteredColumns: gridObj.filterSettings.columns, target: gridObj.element,
            query: gridObj.query,
            handler: test.filterHandler.bind(test), localizedStrings: {},
        });
        excel.filterByColumn('OrderID', 'greaterthan', 10249, 'or', false, false, 'lessthan', 10280);
        gridObj.dataBind();
        gridObj.actionComplete = actionComplete;
    });

    it('and-predicate', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(55);
            expect(getString(gridObj.filterSettings.columns)).toBe('[{"field":"ShipCountry","operator":"contains","value":"a","predicate":"or","matchCase":false,"ignoreAccent":false,"actualFilterValue":{},"actualOperator":{}},{"field":"OrderID","predicate":"and","matchCase":false,"ignoreAccent":false,"operator":"greaterthan","value":10249,"type":"number"},{"field":"OrderID","predicate":"and","matchCase":false,"ignoreAccent":false,"operator":"notequal","value":10250,"type":"number"}]');
            done();
        };

        let test = (<any>gridObj.filterModule);
        test.filterSettings = gridObj.filterSettings; //, gridObj.serviceLocator);
        let excel: any = new (<any>gridObj.filterModule).type['Excel'](
            gridObj, gridObj.filterSettings, gridObj.serviceLocator,
            customOperators);
        excel.updateModel({
            type: 'number', field: 'OrderID', displayName: 'Order ID',
            dataSource: gridObj.dataSource,
            filteredColumns: gridObj.filterSettings.columns, target: gridObj.element,
            query: gridObj.query,
            handler: test.filterHandler.bind(test), localizedStrings: {},
        });
        excel.filterByColumn('OrderID', 'greaterthan', 10249, 'and', false, false, 'notequal', 10250);
        gridObj.dataBind();
        gridObj.actionComplete = actionComplete;
    });

    it('first value', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(56);
            expect(getString(gridObj.filterSettings.columns)).toBe('[{"field":"ShipCountry","operator":"contains","value":"a","predicate":"or","matchCase":false,"ignoreAccent":false,"actualFilterValue":{},"actualOperator":{}},{"field":"OrderID","predicate":"and","matchCase":false,"operator":"greaterthan","value":10249,"type":"number","ignoreAccent":false}]');
            done();
        };

        let test = (<any>gridObj.filterModule);
        test.filterSettings = gridObj.filterSettings; //, gridObj.serviceLocator);
        let excel: any = new (<any>gridObj.filterModule).type['Excel'](
            gridObj, gridObj.filterSettings, gridObj.serviceLocator,
            customOperators);
        excel.updateModel({
            type: 'number', field: 'OrderID', displayName: 'Order ID',
            dataSource: gridObj.dataSource,
            filteredColumns: gridObj.filterSettings.columns, target: gridObj.element,
            query: gridObj.query,
            handler: test.filterHandler.bind(test), localizedStrings: {},
        });
        excel.filterByColumn('OrderID', 'greaterthan', 10249, 'and', false);//, undefined, 10250);
        gridObj.dataBind();
        gridObj.actionComplete = actionComplete;
    });

    it('EJ2-7592-Excel filter menu gets closed when click on the Text filter options', () => {

        let args: any = { event: { target: null }, cancel: false };
        let excel: any = new (<any>gridObj.filterModule).type['Excel'](
            gridObj, gridObj.filterSettings, gridObj.serviceLocator,
            customOperators);
        excel.preventClose(args);
        expect(args.cancel).toBeFalsy();
    });

    it('EJ2-7602-Excel Filter For notequal string operator Not Working', (done: Function) => {
        let value = (<string>gridObj.currentViewData[0]['ShipCountry']).toLowerCase();
        let actionComplete = (args: any) => {
            expect((<string>gridObj.currentViewData[0]['ShipCountry']).toLowerCase()).not.toBe(value);
            done();
        };
        gridObj.actionComplete = actionComplete;
        let test: any = <any>gridObj.filterModule;
        gridObj.filterSettings.columns.pop();
        test.column = gridObj.getColumnByField('ShipCountry');
        let excel: any = new test.type['Excel'](gridObj, gridObj.filterSettings, gridObj.serviceLocator, customOperators);
        excel.updateModel({
            type: 'string', field: 'ShipCountry', displayName: 'ShipCountry',
            dataSource: gridObj.dataSource,
            filteredColumns: gridObj.filterSettings.columns, target: gridObj.element,
            query: gridObj.query,
            handler: test.filterHandler.bind(test), localizedStrings: {},
        });
        excel.filterByColumn('ShipCountry', 'notequal', value, 'and', true);
    });

    it('EJ2-7598-Excel Contains Filter Not Working Properly', (done: Function) => {
        let actionComplete: any = (args: any) => {
            expect((<string>gridObj.currentViewData[0]['ShipCountry']).toLowerCase()).toBe('france');
            done();
        };
        gridObj.actionComplete = actionComplete;
        let test: any = <any>gridObj.filterModule;
        gridObj.filterSettings.columns.pop();
        test.column = gridObj.getColumnByField('ShipCountry');
        let excel: any = new test.type['Excel'](gridObj, gridObj.filterSettings, gridObj.serviceLocator, customOperators);
        excel.updateModel({
            type: 'string', field: 'ShipCountry', displayName: 'ShipCountry',
            dataSource: gridObj.dataSource,
            filteredColumns: gridObj.filterSettings.columns, target: gridObj.element,
            query: gridObj.query,
            handler: test.filterHandler.bind(test), localizedStrings: {},
        });
        excel.filterByColumn('ShipCountry', 'contains', 'fra', 'and', false);
    });

    it('EJ2-7601-Excel Filter For Starts With Not Working', (done: Function) => {
        let actionComplete: any = (args: any) => {
            expect((<string>gridObj.currentViewData[0]['ShipCountry']).toLowerCase()).toBe('france');
            done();
        };
        gridObj.actionComplete = actionComplete;
        let test: any = <any>gridObj.filterModule;
        gridObj.filterSettings.columns.pop();
        test.column = gridObj.getColumnByField('ShipCountry');
        let excel: any = new test.type['Excel'](gridObj, gridObj.filterSettings, gridObj.serviceLocator, customOperators);
        excel.updateModel({
            type: 'string', field: 'ShipCountry', displayName: 'ShipCountry',
            dataSource: gridObj.dataSource,
            filteredColumns: gridObj.filterSettings.columns, target: gridObj.element,
            query: gridObj.query,
            handler: test.filterHandler.bind(test), localizedStrings: {},
        });
        excel.filterByColumn('ShipCountry', 'startswith', 'fra', 'and', false);
    });

    afterAll(() => {
        destroy(gridObj);
    });
    describe('EJ2-6702 Script Error throws If we Check the match case and then click ok button', () => {
        let l10n: L10n;
        let grid: Grid;
        let filterElement: HTMLInputElement;
        let orderIDElement: HTMLInputElement;
        let numOptr: Object[] = [
            { value: 'equal', text: 'Equal' },
            { value: 'greaterThan', text: 'GreaterThan' },
            { value: 'greaterThanOrEqual', text: 'GreaterThanOrEqual' },
            { value: 'lessThan', text: 'LessThan' },
            { value: 'lessThanOrEqual', text: 'LessThanOrEqual' },
            { value: 'notEqual', text: 'NotEqual' }
        ];
        let customOperators: Object = {
            stringOperator: [
                { value: 'startsWith', text: 'StartsWith' },
                { value: 'endsWith', text: 'EndsWith' },
                { value: 'contains', text: 'Contains' },
                { value: 'equal', text: 'Equal' }, { value: 'notEqual', text: 'NotEqual' }],
            numberOperator: numOptr,
            dateOperator: numOptr,
            datetimeOperator: numOptr,
            booleanOperator: [
                { value: 'equal', text: 'Equal' }, { value: 'notEqual', text: 'NotEqual' }
            ]
        };
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: false,
                    filterSettings: {
                        type: 'Excel',
                        columns: [
                            {
                                field: "ShipCountry",
                                operator: "contains",
                                predicate: "or",
                                matchCase: true,
                            }
                        ]
                    },
                    columns: [
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number' },
                        { field: 'Freight', format: 'C2', type: 'number' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean' },
                        { field: 'ShipName', allowFiltering: false },
                        { field: 'ShipCountry', type: 'string' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false }
                    ],
                },
                done
            );
        });

        it('EJ2-6702 Script Error throws If we Check the match case and then click ok button', () => {
            expect(grid.filterSettings.columns[0].value).toBe(undefined);
        });

        it('EJ2-7609-Excel Filter For Equal Date Is Not Working', (done: Function) => {
            let actionComplete = (args: any) => {
                expect(grid.currentViewData[0]['OrderID']).toBe(10251);
                expect(grid.currentViewData.length).toBe(1);
                done();
            };
            grid.actionComplete = actionComplete;
            let test: any = <any>grid.filterModule;
            grid.filterSettings.columns.pop();
            test.column = grid.getColumnByField('OrderDate');
            let excel: any = new test.type['Excel'](grid, grid.filterSettings, grid.serviceLocator, customOperators);
            excel.updateModel({
                type: 'datetime', field: 'OrderDate', displayName: 'OrderDate',
                dataSource: grid.dataSource,
                filteredColumns: grid.filterSettings.columns, target: grid.element,
                query: grid.query,
                handler: test.filterHandler.bind(test), localizedStrings: {},
            });
            excel.filterByColumn('OrderDate', 'equal', '7/8/1996', 'and', false);
        });

        it('EJ2-7255-Not equal filter on date column not working properly', (done: Function) => {
            let actionComplete = (args: any) => {
                expect(grid.currentViewData[0]['OrderID']).not.toBe(10248);
                done();
            };
            grid.actionComplete = actionComplete;
            let test: any = <any>grid.filterModule;
            grid.filterSettings.columns.pop();
            test.column = grid.getColumnByField('OrderDate');
            let excel: any = new test.type['Excel'](grid, grid.filterSettings, grid.serviceLocator, customOperators);
            excel.updateModel({
                type: 'datetime', field: 'OrderDate', displayName: 'OrderDate',
                dataSource: grid.dataSource,
                filteredColumns: grid.filterSettings.columns, target: grid.element,
                query: grid.query,
                handler: test.filterHandler.bind(test), localizedStrings: {},
            });
            excel.filterByColumn('OrderDate', 'notequal', '7/12/1996', 'and', false);
        });

        afterAll(() => {
            destroy(grid);
        });
    });
});