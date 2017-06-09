/**
 * Grid Filtering spec document
 */
import { EventHandler, ChildProperty, EmitType } from '@syncfusion/ej2-base';
import { extend, getValue } from '@syncfusion/ej2-base/util';
import { createElement, remove } from '@syncfusion/ej2-base/dom';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Group } from '../../../src/grid/actions/group';
import { Page } from '../../../src/grid/actions/page';
import { CellType } from '../../../src/grid/base/enum';
import { ValueFormatter } from '../../../src/grid/services/value-formatter';
import { Column } from '../../../src/grid/models/column';
import { Selection } from '../../../src/grid/actions/selection';
import { filterData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Filter, Page, Selection, Group);

function getEventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = extend({}, tempEvent);
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

describe('Filtering module', () => {

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

    describe('Filterbar functionalities', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let filterElement: HTMLInputElement;
        let orderIDElement: HTMLInputElement;
        let keyup: any = getEventObject('KeyboardEvent', 'keyup');
        keyup.keyCode = 13;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: false,
                    filterSettings: { type: 'filterbar', showFilterBarStatus: true },
                    columns: [{ field: 'OrderID', type: 'number', visible: true }, { field: 'CustomerID', type: 'string' },
                    { field: 'EmployeeID', type: 'number' }, { field: 'Freight', format: 'C2', type: 'number' },
                    { field: 'ShipCity' }, { field: 'Verified', type: 'boolean' }, { field: 'ShipName', allowFiltering: false },
                    { field: 'ShipCountry', type: 'string' }, { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' },
                    { field: 'ShipAddress', allowFiltering: true, visible: false }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('Filter string column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(3);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"CustomerID","operator":"startswith","value":"VINET","predicate":"and","matchCase":false,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = gridObj.element.querySelector('#CustomerID_filterBarcell') as HTMLInputElement;
            orderIDElement = gridObj.element.querySelector('#OrderID_filterBarcell') as HTMLInputElement;
            filterElement.value = 'VINET';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('empty filter value testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(71);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = gridObj.element.querySelector('#CustomerID_filterBarcell') as HTMLInputElement;
            filterElement.value = '';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('skip input filter string value testing', (done: Function) => {
            filterElement = gridObj.element.querySelector('#CustomerID_filterBarcell') as HTMLInputElement;
            filterElement.value = '<';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
            setTimeout(() => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(71);
                done();
            }, 500);
        });

        it('skip input filter number value testing', (done: Function) => {
            filterElement = orderIDElement;
            filterElement.value = '!';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
            setTimeout(() => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(71);
                done();
            }, 500);
        });

        it('column allowFiltering false testing', (done: Function) => {
            filterElement = gridObj.element.querySelector('#ShipName_filterBarcell') as HTMLInputElement;
            filterElement.value = 'Lyon';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
            keyup.keyCode = 8;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
            keyup.keyCode = 13;
            setTimeout(() => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(71);
                done();
            }, 500);
        });

        it('Filter undefined type column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(3);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"ShipCountry","operator":"startswith","value":"UK","predicate":"and","matchCase":false,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = gridObj.element.querySelector('#ShipCountry_filterBarcell') as HTMLInputElement;
            filterElement.value = 'UK';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(filterData.length);
                expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('Filter number column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"OrderID","operator":"equal","value":10249,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = orderIDElement;
            filterElement.value = '10249';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(filterData.length);
                expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('Filter number column string value testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = orderIDElement;
            filterElement.value = '102i49i';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(filterData.length);
                expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('Filter date column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                //expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                expect(gridObj.filterSettings.columns.length).toEqual(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = gridObj.element.querySelector('#OrderDate_filterBarcell') as HTMLInputElement;
            let valueFormatter: ValueFormatter = new ValueFormatter();
            filterElement.value = valueFormatter.toView(new Date(8364186e5), (gridObj.getColumns()[8] as Column).getFormatter()).toString();
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(filterData.length);
                expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('Filter number format column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"Freight","operator":"equal","value":32.38,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = gridObj.element.querySelector('#Freight_filterBarcell') as HTMLInputElement;
            filterElement.value = '32.38';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(filterData.length);
                expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('Filter number format with formated value testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"Freight","operator":"equal","value":32.38,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = gridObj.element.querySelector('#Freight_filterBarcell') as HTMLInputElement;
            filterElement.value = '$32.38';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(filterData.length);
                expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('Filter number with < operator testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(4);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"OrderID","operator":"lessthan","value":10252,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = orderIDElement;
            filterElement.value = '<10252';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(filterData.length);
                expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('Filter number with > operator testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(66);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"OrderID","operator":"greaterthan","value":10252,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = orderIDElement;
            filterElement.value = '>10252';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(filterData.length);
                expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('Filter number with < operator testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(5);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"OrderID","operator":"lessthanorequal","value":10252,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = orderIDElement;
            filterElement.value = '<=10252';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(filterData.length);
                expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('Filter number with >= operator testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(67);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"OrderID","operator":"greaterthanorequal","value":10252,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = orderIDElement;
            filterElement.value = '>=10252';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(filterData.length);
                expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('Filter number with = operator testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"OrderID","operator":"equal","value":10252,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = orderIDElement;
            filterElement.value = '=10252';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(filterData.length);
                expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('Filter number with ! operator testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(filterData.length - 1);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"OrderID","operator":"notequal","value":10252,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = orderIDElement;
            filterElement.value = '!10252';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(filterData.length);
                expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('Filter string with * operator testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(4);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"CustomerID","operator":"startswith","value":"v","predicate":"and","matchCase":false,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = gridObj.element.querySelector('#CustomerID_filterBarcell') as HTMLInputElement;
            filterElement.value = '*v';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(filterData.length);
                expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('Filter string with % first operator testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"CustomerID","operator":"endswith","value":"v","predicate":"and","matchCase":false,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = gridObj.element.querySelector('#CustomerID_filterBarcell') as HTMLInputElement;
            filterElement.value = '%v';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(filterData.length);
                expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('Filter string with % last operator testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(5);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"CustomerID","operator":"startswith","value":"b","predicate":"and","matchCase":false,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = gridObj.element.querySelector('#CustomerID_filterBarcell') as HTMLInputElement;
            filterElement.value = 'b%';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(filterData.length);
                expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('Filter boolean format true column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(35);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"Verified","operator":"equal","value":true,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = gridObj.element.querySelector('#Verified_filterBarcell') as HTMLInputElement;
            filterElement.value = 'true';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('Filter boolean format 0 column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(36);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"Verified","operator":"equal","value":false,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = gridObj.element.querySelector('#Verified_filterBarcell') as HTMLInputElement;
            filterElement.value = '0';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('Filter boolean format 1 column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(35);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"Verified","operator":"equal","value":true,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = gridObj.element.querySelector('#Verified_filterBarcell') as HTMLInputElement;
            filterElement.value = '1';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });


        it('Filter boolean format false column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(36);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"Verified","operator":"equal","value":false,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = gridObj.element.querySelector('#Verified_filterBarcell') as HTMLInputElement;
            filterElement.value = 'false';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('Filter boolean format invalid value testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = gridObj.element.querySelector('#Verified_filterBarcell') as HTMLInputElement;
            filterElement.value = 'VINET';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(filterData.length);
                expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('Filter undefined format column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"ShipCity","operator":"startswith","value":"Lyon","predicate":"and","matchCase":false,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterElement = gridObj.element.querySelector('#ShipCity_filterBarcell') as HTMLInputElement;
            filterElement.value = 'Lyon';
            filterElement.focus();
            keyup.target = filterElement;
            EventHandler.trigger(gridObj.getHeaderContent() as HTMLElement, 'keyup', keyup);
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(filterData.length);
                expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('filterByColumn method testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"OrderID","operator":"equal","value":10248,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', true);
            expect(orderIDElement.disabled).toEqual(false);
        });

        it('check already filtered column testing', (done: Function) => {
            gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', true);
            expect(orderIDElement.disabled).toEqual(false);
            setTimeout(() => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                expect(getString(gridObj.filterSettings.columns) ===
                    '[{"field":"OrderID","operator":"equal","value":10248,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                done();
                done();
            }, 500);
        });

        it('removeFilteredColsByField false testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(orderIDElement.value).toEqual('');
                (<any>gridObj.filterModule).generateCell(gridObj.getColumns()[1], CellType.Filter);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.removeFilteredColsByField('OrderID1', false); //for coverage
            gridObj.removeFilteredColsByField('OrderID', true); //for coverage

        });

        it('allowfiltering false testing', () => {
            gridObj.allowFiltering = false;
            gridObj.dataBind();
            gridObj.actionComplete = undefined;
            expect(gridObj.element.querySelectorAll('.e-filterbar').length).toEqual(0);
        });

        it('allowfiltering true testing', () => {
            gridObj.allowFiltering = true;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-filterbar').length).toEqual(1);
        });

        it('filter clear button testing', () => {
            orderIDElement.value = '10248';
            (<any>gridObj.filterModule).updateSpanClass({ type: 'mousedown', target: orderIDElement.nextElementSibling, preventDefault: ()=>{} });
            expect(orderIDElement.value).toEqual('');
            orderIDElement.focus();
            gridObj.element.focus(); //for coverage    
            (<any>gridObj.filterModule).column = gridObj.getColumnByField('ShipCity');
            (<any>gridObj.filterModule).column.type = undefined;
            (<any>gridObj.filterModule).validateFilterValue('AD');
            (<any>gridObj.filterModule).generateCells();
            gridObj.groupSettings.columns = ['OrderID'];
            (<any>gridObj.filterModule).generateCells();
            gridObj.columns = [];
            (<any>gridObj.filterModule).render();
        });

        afterAll(() => {
            remove(elem);
        });
    });

    describe('Filterbar template with paging', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let filterElement: HTMLInputElement;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    pageSettings: { currentPage: 1 },
                    filterSettings: { type: 'filterbar', columns: [], showFilterBarStatus: true },
                    columns: [
                        { field: 'OrderID', type: 'number', visible: true }, { field: 'CustomerID', type: 'string' },
                        { field: 'Freight', format: 'C2', type: 'number' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean' }, { field: 'ShipName', allowFiltering: false },
                        { field: 'OrderDate', format: 'yMd', type: 'date' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('showFilterBarStatus testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect((gridObj.element.querySelector('.e-pagerexternalmsg') as HTMLElement).style.display).toEqual('none');
                //for coverage
                gridObj.filterSettings.showFilterBarStatus = false;
                gridObj.dataBind();
                gridObj.filterSettings.showFilterBarStatus = true;
                gridObj.dataBind();
                gridObj.isDestroyed = true;
                gridObj.filterModule.addEventListener();
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterSettings.showFilterBarStatus = false;
            gridObj.dataBind();
            gridObj.filterByColumn('OrderID', 'equal', '10248', 'and', false);
        });

        afterAll(() => {
            remove(elem);
        });
    });

    describe('Filterbar template', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let filterElement: HTMLInputElement;
        let keyup: any = getEventObject('KeyboardEvent', 'keyup');
        keyup.keyCode = 13;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    pageSettings: { currentPage: 1 },
                    filterSettings: { type: 'filterbar', columns: [] },
                    columns: [
                        { field: 'OrderID', type: 'number', visible: true }, { field: 'CustomerID', type: 'string' },
                        {
                            field: 'EmployeeID', filterBarTemplate: {
                                create: function (args: { element: Element, column: Column }) {
                                    let input: Element = document.createElement('input');
                                    (input as HTMLInputElement).type = "text";
                                    return input;
                                },
                                write: function (args: { element: Element, column: Column }) {
                                    args.element.addEventListener('input', args.column.filterBarTemplate.read as EventListener);
                                },
                                read: function (args: { element: Element, columnIndex: number, column: Column }) {
                                    this.filterByColumn(args.column.field, "equal", (args.element as HTMLInputElement).value, "and", true);
                                }
                            }
                        },
                        { field: 'Freight', format: 'C2', type: 'number' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean' }, { field: 'ShipName', allowFiltering: false },
                        { field: 'OrderDate', format: 'yMd', type: 'date' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('allowfiltering true testing', () => {
            gridObj.allowFiltering = true;
            gridObj.dataBind();
            expect((gridObj.element.querySelector('#OrderID_filterBarcell') as HTMLInputElement).disabled).toEqual(false);
        });

        afterAll(() => {
            remove(elem);
        });
    });

    describe('Filterbar template without create testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let filterElement: HTMLInputElement;
        let keyup: any = getEventObject('KeyboardEvent', 'keyup');
        let filterModule: Filter;
        keyup.keyCode = 13;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    pageSettings: { currentPage: 1 },
                    filterSettings: { type: 'filterbar', columns: [] },
                    columns: [{ field: 'OrderID', type: 'number', visible: true }, { field: 'CustomerID', type: 'string' },
                    {
                        field: 'EmployeeID', filterBarTemplate: {
                            write: function (args: { element: Element, column: Column }) {
                                args.element.addEventListener('input', args.column.filterBarTemplate.read as EventListener);
                            },
                            read: function (args: { element: Element, column: Column }) {
                                this.filterByColumn(args.column.field, "equal", (args.element as HTMLInputElement).value, "and", true);
                            }
                        }
                    },
                    { field: 'Freight', format: 'C2', type: 'number' },
                    { field: 'ShipCity' }, { field: 'Verified', type: 'boolean' }, { field: 'ShipName', allowFiltering: false },
                    { field: 'OrderDate', format: 'yMd', type: 'date' },
                    { field: 'ShipAddress', allowFiltering: true, visible: false }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('allowfiltering true testing', () => {
            gridObj.allowFiltering = true;
            gridObj.dataBind();
            let element: HTMLInputElement = gridObj.element.querySelector('#OrderID_filterBarcell') as HTMLInputElement;
            expect(element.disabled).toEqual(false);
            (<any>gridObj.filterModule).column = 'OrderID';
            gridObj.filterSettings.columns = [{ field: 'OrderID', operator: 'equal', value: '10248', predicate: 'and', matchCase: true }]; //for coverage
            gridObj.dataBind();
            //for coverage
            (<any>gridObj.filterModule).lastFilterElement = element;
            (<any>gridObj.filterModule).isSpanClicked = false;
            (<any>gridObj.filterModule).updateSpanClass({ type: 'focusin', target: gridObj.element, preventDefault: ()=>{ }});
            (<any>gridObj.filterModule).isSpanClicked = true;
            (<any>gridObj.filterModule).updateSpanClass({ type: 'focusin', target: gridObj.element, preventDefault: ()=>{ }});
        });

        afterAll(() => {
            remove(gridObj.element);
        });
    });

    describe('Filter a column and clear fitering', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let filterElement: HTMLInputElement;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    allowGrouping: true,
                    pageSettings: { currentPage: 1 },
                    filterSettings: { type: 'filterbar', columns: [{ field: 'EmployeeID', operator: 'equal', value: 5, matchCase: true }], showFilterBarStatus: true },
                    columns: [
                        { field: 'OrderID', type: 'number', visible: true }, { field: 'EmployeeID', type: 'number' },
                        { field: 'Freight', format: 'C2', type: 'number' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean' }, { field: 'ShipName', allowFiltering: false },
                        { field: 'OrderDate', format: 'yMd', type: 'date' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });
        // test initial filtering scenario
        it('showFilterBarStatus testing initial filter', () => {
            expect((<any>gridObj.getHeaderContent().querySelectorAll('#EmployeeID_filterBarcell')[0]).value).toEqual('5');
            expect(gridObj.currentViewData.length).toEqual(4);
            expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].innerHTML).toEqual('EmployeeID: 5');
        });

        it('showFilterBarStatus testing with aditional filter', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect((<any>gridObj.getHeaderContent().querySelectorAll('#OrderID_filterBarcell')[0]).value).toEqual('10248');
                expect((<any>gridObj.getHeaderContent().querySelectorAll('#EmployeeID_filterBarcell')[0]).value).toEqual('5');
                expect(gridObj.currentViewData.length).toEqual(1);
                expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].innerHTML).toEqual('EmployeeID: 5 &amp;&amp; OrderID: 10248');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('OrderID', 'equal', '10248', 'and', false);
            gridObj.dataBind();
        });
        it('group a column', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toEqual(1);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending').length).toEqual(1);
                expect((<any>gridObj.getHeaderContent().querySelectorAll('#OrderID_filterBarcell')[0]).value).toEqual('10248');
                expect((<any>gridObj.getHeaderContent().querySelectorAll('#EmployeeID_filterBarcell')[0]).value).toEqual('5');
                expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].innerHTML).toEqual('EmployeeID: 5 &amp;&amp; OrderID: 10248');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('EmployeeID');
            gridObj.dataBind();
        });
        it('ungroup a column', (done: Function) => {
            actionComplete = (args?: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toEqual(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toEqual(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toEqual(0);
                expect((<any>gridObj.getHeaderContent().querySelectorAll('#OrderID_filterBarcell')[0]).value).toEqual('10248');
                expect((<any>gridObj.getHeaderContent().querySelectorAll('#EmployeeID_filterBarcell')[0]).value).toEqual('5');
                expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].innerHTML).toEqual('EmployeeID: 5 &amp;&amp; OrderID: 10248');
                done();
            }
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('EmployeeID');
            gridObj.dataBind();
        });

        //check scenario- group a column then filter a column to empty record and then ungroup a column - check ungroup done with empty grid

        it('group a column', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toEqual(1);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending').length).toEqual(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('OrderID');
            gridObj.dataBind();
        });
        it('Filter a column', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.currentViewData.length).toEqual(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('Freight', 'lessthan', '0', 'and', true);
            gridObj.dataBind();
        });
        it('Clear grouping', (done: Function) => {
            actionComplete = (args?: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toEqual(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell').length).toEqual(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('OrderID');
            gridObj.dataBind();
        });

        afterAll(() => {
            remove(elem);
        });
    });


});
