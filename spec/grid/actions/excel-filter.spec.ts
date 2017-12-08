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
        let dataBound: EmitType<Object> = () => { done(); };
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: filterData,
                allowFiltering: true,
                allowPaging: false,
                filterSettings: {
                    type: 'excel',
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
        expect(getString(gridObj.filterSettings.columns)).toBe('[{"field":"ShipCountry","operator":"contains","value":"a","predicate":"or","matchCase":false,"actualFilterValue":{},"actualOperator":{}}]');
        done();
    });
    it('or-predicate', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(58);
            expect(getString(gridObj.filterSettings.columns)).toBe('[{"field":"ShipCountry","operator":"contains","value":"a","predicate":"or","matchCase":false,"actualFilterValue":{},"actualOperator":{}},{"field":"OrderID","predicate":"or","matchcase":false,"operator":"greaterthan","value":10249,"type":"number"},{"field":"OrderID","predicate":"or","matchcase":false,"operator":"lessthan","value":10280,"type":"number"}]');
            done();
        };

        
        let test = (<any>gridObj.filterModule);
        test.filterSettings = gridObj.filterSettings; //, gridObj.serviceLocator);
        let excel: any = new (<any>gridObj.filterModule).type['excel'](
            gridObj, gridObj.filterSettings, gridObj.serviceLocator,
            customOperators);
        excel.updateModel({
            type: 'number', field: 'OrderID', displayName: 'Order ID',
            dataSource: gridObj.dataSource,
            filteredColumns: gridObj.filterSettings.columns, target: gridObj.element,
            query: gridObj.query,
            handler: test.filterHandler.bind(test), localizedStrings: {},
        });
        excel.filterByColumn('OrderID', 'greaterthan', 10249, 'or', false, 'lessthan', 10280);
        gridObj.dataBind();
        gridObj.actionComplete = actionComplete;
    });

    it('and-predicate', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(55);
            expect(getString(gridObj.filterSettings.columns)).toBe('[{"field":"ShipCountry","operator":"contains","value":"a","predicate":"or","matchCase":false,"actualFilterValue":{},"actualOperator":{}},{"field":"OrderID","predicate":"or","matchcase":false,"operator":"greaterthan","value":10249,"type":"number"},{"field":"OrderID","predicate":"and","matchcase":false,"operator":"notequal","value":10250,"type":"number"}]');
            done();
        };

        let test = (<any>gridObj.filterModule);
        test.filterSettings = gridObj.filterSettings; //, gridObj.serviceLocator);
        let excel: any = new (<any>gridObj.filterModule).type['excel'](
            gridObj, gridObj.filterSettings, gridObj.serviceLocator,
            customOperators);
        excel.updateModel({
            type: 'number', field: 'OrderID', displayName: 'Order ID',
            dataSource: gridObj.dataSource,
            filteredColumns: gridObj.filterSettings.columns, target: gridObj.element,
            query: gridObj.query,
            handler: test.filterHandler.bind(test), localizedStrings: {},
        });
        excel.filterByColumn('OrderID', 'greaterthan', 10249, 'and', false, 'notequal', 10250);
        gridObj.dataBind();
        gridObj.actionComplete = actionComplete;
    });

    it('first value', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(56);
            expect(getString(gridObj.filterSettings.columns)).toBe('[{"field":"ShipCountry","operator":"contains","value":"a","predicate":"or","matchCase":false,"actualFilterValue":{},"actualOperator":{}},{"field":"OrderID","predicate":"or","matchcase":false,"operator":"greaterthan","value":10249,"type":"number"}]');
            done();
        };

        let test = (<any>gridObj.filterModule);
        test.filterSettings = gridObj.filterSettings; //, gridObj.serviceLocator);
        let excel: any = new (<any>gridObj.filterModule).type['excel'](
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

    afterAll(() => {
        remove(elem);
    });
});