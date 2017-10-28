/**
 * Data spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { Query, DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { extend } from '../../../src/grid/base/util';
import { Page } from '../../../src/grid/actions/page';
import { Data } from '../../../src/grid/actions/data';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Page);

describe('Data module', () => {

    describe('Locale data testing', () => {

        type MockAjaxReturn = { promise: Promise<Object>, request: JasmineAjaxRequest };
        type ResponseType = { result: Object[], count: number | string };

        let mockAjax: Function = (d: { data: { [o: string]: Object | Object[] } | Object[], dm?: DataManager }, query: Query | Function, response?: Object):
            MockAjaxReturn => {
            jasmine.Ajax.install();
            let dataManager = d.dm || new DataManager({
                url: '/api/Employees',
            });
            let prom: Promise<Object> = dataManager.executeQuery(query);
            let request: JasmineAjaxRequest;
            let defaults: Object = {
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify(d.data)
            };
            let responses: Object = {};
            request = jasmine.Ajax.requests.mostRecent();
            extend(responses, defaults, response);
            request.respondWith(responses);
            return {
                promise: prom,
                request: request
            }
        };

        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    query: new Query().take(5), allowPaging: false, dataBound: dataBound,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                });
            gridObj.appendTo('#Grid');
        });

        it('TR generated testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(5);
        });

        afterAll(() => {
            remove(elem);
            jasmine.Ajax.uninstall();
        });

    });

    describe('Remote data without columns testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let resquest: JasmineAjaxRequest;
        let dataManager: DataManager;
        let query: Query = new Query().take(5);
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: 'service/Orders/'
            });
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataManager, dataBound: dataBound,
                    query: query, allowPaging: true,
                });
            gridObj.appendTo('#Grid');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: data, __count: 15 })
            });
        });

        it('TR generated testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(15);
        });

        it('Column count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-headercell').length).toBe(12);
        });

        afterAll(() => {
            remove(gridObj.element);
            jasmine.Ajax.uninstall();
        });
    });

    describe('actionFailure after control destroyed', () => {
        let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let gridObj: Grid;
        beforeAll(() => {
            jasmine.Ajax.install();
            document.body.appendChild(elem);
            gridObj = new Grid({
                dataSource: new DataManager({
                    url: '/test/db',
                    adaptor: new ODataV4Adaptor
                }),
                columns: [
                    { headerText: 'OrderID', field: 'OrderID' },
                    { headerText: 'CustomerID', field: 'CustomerID' },
                    { headerText: 'EmployeeID', field: 'EmployeeID' },
                    { headerText: 'ShipCountry', field: 'ShipCountry' },
                    { headerText: 'ShipCity', field: 'ShipCity' },
                ],
                actionFailure: actionFailedFunction
            });
            gridObj.appendTo('#Grid');
        });
        beforeEach((done: Function) => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 404,
                'contentType': 'application/json',
                'responseText': 'Page not found'
            });
            setTimeout(() => { done(); }, 100);
        });
        it('actionFailure testing', () => {
            expect(actionFailedFunction).toHaveBeenCalled();
        });

        afterAll(() => {
            remove(elem);
            jasmine.Ajax.uninstall();
        });
    });

    describe('Grid with empty datasource', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: null, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('Row count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(0);
            //for coverage
            gridObj.isDestroyed = true;
            let data = new Data(gridObj);
            (gridObj.renderModule as any).data.destroy();
            gridObj.isDestroyed = false;
        });

        afterAll(() => {
            remove(elem);
        });

    });

    describe('datamanager offline - success testing', () => {
        let gridObj: Grid;
        let dataManager: any = new DataManager(data as JSON[]);
        dataManager.ready = {
            then: (args: any) => {
                args.call(this, { result: data.slice(0, 5) });
                return {
                    catch: (args: any) => {
                        {
                        }
                    }
                };
            }
        };
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataManager, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    dataBound: dataBound,
                    actionComplete: actionComplete,
                });
            gridObj.appendTo('#Grid');
        });

        it('Row count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(5);
        });

        afterAll(() => {
            remove(elem);
        });

    });

    describe('datamanager offline - failure testing', () => {
        let gridObj: Grid;
        let dataManager: any = new DataManager(data as JSON[]);
        dataManager.ready = {
            then: (args: any) => {
                return {
                    catch: (args: any) => {
                        {
                            args.call(this, {});
                        }
                    }
                };
            }
        };
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            let actionFailure: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataManager, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    dataBound: dataBound,
                    actionComplete: actionComplete,
                    actionFailure: actionFailure
                });
            gridObj.appendTo('#Grid');
        });

        it('Row count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(0);
        });

        afterAll(() => {
            remove(elem);
        });

    });

    describe('datamanager offline - success testing', () => {
        let gridObj: Grid;
        let dataManager: any = new DataManager(data as JSON[]);
        dataManager.ready = {
            then: (args: any) => {
                args.call(this, { result: data.slice(0, 5) });
                return {
                    catch: (args: any) => {
                        {
                        }
                    }
                };
            }
        };
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataManager, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    dataBound: dataBound,
                    actionComplete: actionComplete,
                });
            gridObj.appendTo('#Grid');
        });

        it('Row count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(5);
        });

        afterAll(() => {
            remove(elem);
        });

    });

    describe('datamanager offline - failure testing', () => {
        let gridObj: Grid;
        let dataManager: any = new DataManager(data as JSON[]);
        dataManager.ready = {
            then: (args: any) => {
                return {
                    catch: (args: any) => {
                        {
                            args.call(this, {});
                        }
                    }
                };
            }
        };
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            let actionFailure: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataManager, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    dataBound: dataBound,
                    actionComplete: actionComplete,
                    actionFailure: actionFailure
                });
            gridObj.appendTo('#Grid');
        });

        it('Row count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(0);
        });

        afterAll(() => {
            remove(elem);
        });

    });


});