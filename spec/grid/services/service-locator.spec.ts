/**
 * Service Locator spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base/dom';
import { Grid } from '../../../src/grid/base/grid';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

describe('ServiceLocator module', () => {
    let servFunc: Function = () => {
        return 'hi';
    };
    describe('Register and get service', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data, allowPaging: false,
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
            gridObj.serviceLocator.register('servFunc', servFunc);
        });

        it('Register and getService testing', () => {
            let fn: Function = gridObj.serviceLocator.getService<Function>('servFunc');
            expect(fn()).toBe('hi');
        });

        it('Register and getService testing', () => {
            gridObj.serviceLocator.register('servFunc', servFunc);
            let fn: Function = gridObj.serviceLocator.getService<Function>('servFunc');
            expect(fn()).toBe('hi');
        });

        it('Check fallback', () => {
            expect(() => gridObj.serviceLocator.getService<Function>('mock')).toThrow('The service mock is not registered');
        });

        afterAll(() => {
           remove(elem);
        });
    });

});