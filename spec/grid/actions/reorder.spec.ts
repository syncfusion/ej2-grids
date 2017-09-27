/**
 * Grid Reordering spec document
 */
import { Browser, EventHandler, EmitType } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { SortDirection } from '../../../src/grid/base/enum';
import { DataManager } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { getActualProperties, parentsUntil } from '../../../src/grid/base/util';
import { Column } from '../../../src/grid/models/column';
import { Sort } from '../../../src/grid/actions/sort';
import { Filter } from '../../../src/grid/actions/filter';
import { Group } from '../../../src/grid/actions/group';
import { Page } from '../../../src/grid/actions/page';
import { Reorder } from '../../../src/grid/actions/reorder';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Sort, Page, Filter, Reorder, Group);

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

describe('Reorder module', () => {

    describe('Reorder functionalities', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let dataBound: Function;
        let actionComplete: (e?: Object) => void;
        let headers: any;
        let columns: Column[];
        window['browserDetails'].isIE = false;

        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    allowSorting: true,
                    allowReordering: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    allowFiltering: true,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('Reorder Column method testing', (done: Function) => {
            let dataBound = (args: Object): void => {
                columns = gridObj.getColumns() as Column[];
                headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
                expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
                expect(headers[2].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
                expect(columns[0].field).toBe('EmployeeID');
                expect(columns[1].field).toBe('OrderID');
                expect(columns[2].field).toBe('CustomerID');
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.dataBind();
            gridObj.reorderColumns('EmployeeID', 'OrderID');
        });

        it('Reorder Invalid Column testing', () => {
            gridObj.reorderColumns('EmployeeID', 'EmployeeID1');
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
            expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
            expect(columns[0].field).toBe('EmployeeID');
            expect(columns[1].field).toBe('OrderID');
        });

        it('Reorder same Column testing', () => {
            gridObj.reorderColumns('EmployeeID', 'EmployeeID');
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
            expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
            expect(columns[0].field).toBe('EmployeeID');
            expect(columns[1].field).toBe('OrderID');
        });

        // it('Reorder Column simulate testing', (done: Function) => {
        //     let dataBound = (args: Object): void => {
        //         columns = gridObj.getColumns() as Column[];
        //         headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
        //         expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
        //         expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
        //         expect(columns[0].field).toBe('OrderID');
        //         expect(columns[1].field).toBe('EmployeeID');
        //         done();
        //     };
        //     gridObj.dataBound = dataBound;
        //     gridObj.dataBind();

        //     let mousedown: any = getEventObject('MouseEvents', 'mousedown', headers[0].querySelector('.e-headercelldiv'), 13, 13);
        //     EventHandler.trigger(gridObj.getHeaderContent().querySelector('.e-columnheader') as HTMLElement, 'mousedown', mousedown);

        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', headers[0], 27, 14);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.getContentTable(); //cursor testing
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = document.body; //outside move testing
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = headers[1];
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', headers[1], 198, 13);
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        // });

        it('Reorder Column simulate testing', (done: Function) => {
            let dataBound = (args: Object): void => {
                columns = gridObj.getColumns() as Column[];
                headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
                expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
                expect(columns[0].field).toBe('OrderID');
                expect(columns[1].field).toBe('EmployeeID');
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.dataBind();
            let dropClone = createElement('div', { attrs: { 'e-mappinguid': gridObj.getUidByColumnField('OrderID') } });
            document.body.appendChild(dropClone);
            (gridObj.headerModule as any).helper({ target: gridObj.getHeaderTable().querySelector('tr'), sender: { clientX: 10, clientY: 10, target: gridObj.getColumnHeaderByField('OrderID') } });
            (gridObj.headerModule as any).dragStart({ target: gridObj.getColumnHeaderByField('OrderID').children[0], event: { clientX: 10, clientY: 10, target: gridObj.getColumnHeaderByField('OrderID').children[0] } });
            (gridObj.headerModule as any).dragStart({ target: gridObj.getColumnHeaderByField('OrderID'), event: { clientX: 10, clientY: 10, target: gridObj.getColumnHeaderByField('OrderID').children[0] } });
            (gridObj.headerModule as any).drag({ target: gridObj.getColumnHeaderByField('EmployeeID'), event: { clientX: 10, clientY: 10, target: gridObj.getColumnHeaderByField('EmployeeID').children[0] } });
            (gridObj.headerModule as any).dragStop({
                target: gridObj.getColumnHeaderByField('EmployeeID'),
                element: gridObj.getHeaderTable().querySelector('tr'), helper: dropClone, event: { clientX: 10, clientY: 10, target: gridObj.getColumnHeaderByField('EmployeeID').children[0] }
            });

            (gridObj.reorderModule as any).element = gridObj.getColumnHeaderByField('OrderID');
            (gridObj.headerModule as any).drop({ target: gridObj.getColumnHeaderByField('EmployeeID'), droppedElement: dropClone });
        });

        it('Reorder disable and enable testing', (done: Function) => {
            let dataBound = (args: Object): void => {
                columns = gridObj.getColumns() as Column[];
                headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
                expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('ShipCity');
                expect(headers[2].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
                expect(headers[4].querySelector('.e-headercelldiv').textContent).toBe('Freight');
                expect(columns[0].field).toBe('OrderID');
                expect(columns[1].field).toBe('ShipCity');
                expect(columns[2].field).toBe('EmployeeID');
                expect(columns[4].field).toBe('Freight');
                //for coverage
                getActualProperties({});
                parentsUntil(headers[0], 'e-headercell', false);
                parentsUntil(headers[0], 'Grid', true);
                done();
            };
            gridObj.allowReordering = false;
            gridObj.dataBind();
            gridObj.allowReordering = true;
            gridObj.dataBind();
            gridObj.dataBound = dataBound;
            gridObj.dataBind();
            gridObj.reorderColumns('ShipCity', 'EmployeeID');
        });

        it('Reorder disable and enable testing and coverage', () => {

            gridObj.allowReordering = false;
            gridObj.dataBind();
            (gridObj.headerModule as any).helper();
            gridObj.allowReordering = true;
            gridObj.dataBind();
            (gridObj.headerModule as any).helper({ sender: { target: gridObj.getColumnHeaderByField('OrderID').children[0] } });
            (gridObj.headerModule as any).helper({ sender: { target: gridObj.element } });
            (gridObj.headerModule as any).drag({ target: undefined });

            (<any>gridObj.reorderModule).enableAfterRender({ module: 'sort' });
            headers[3].classList.add('e-reorderindicate');
            gridObj.element.appendChild(createElement('div', { className: 'e-cloneproperties' }));
           (<any>gridObj.getHeaderContent()).ej2_instances[0].trigger('drop', { target: createElement('div'), 
            droppedElement: gridObj.element.querySelector('.e-cloneproperties') }); //droppable instance
            gridObj.element.appendChild(createElement('div', { className: 'e-cloneproperties' }));
            gridObj.width = 300;
            gridObj.dataBind();
            (<any>gridObj.reorderModule).updateScrollPostion({ clientX: 10, clientY: 10 });
            (<any>gridObj.reorderModule).updateScrollPostion({ clientX: gridObj.element.getBoundingClientRect().right - 20, clientY: 10 });
            (<any>gridObj.reorderModule).updateScrollPostion({ changedTouches: [{ clientX: 10, clientY: 10 }] });
            (<any>gridObj.reorderModule).dragStop({ cancel: true, target: headers[0], column: gridObj.getColumnByField('OrderID') });
            gridObj.allowGrouping = true;
            let header: any = headers[2];
            (<any>gridObj.reorderModule).element = header.parentElement;
            (<any>gridObj.reorderModule).drag({ target: header, event: { clientX: 55, clientY: 10 } });
            gridObj.isDestroyed = true;
            gridObj.reorderModule.destroy();
            gridObj.reorderModule = new Reorder(gridObj);
            expect(1).toBe(1);
            let cols = [];
            cols.push(gridObj.columns[0]);
            cols.push(gridObj.columns[1]);
            cols[1]['columns'] = gridObj.columns[2];
            (<any>gridObj.reorderModule).getColumnsModel(cols);
        });

        afterAll(() => {
            remove(elem);
        });
    });

    // //reOrder stacked header 
    // describe('Stacked header Reordering', () => {
    //     let gridObj: Grid;
    //     let elem: HTMLElement = createElement('div', { id: 'Grid' });
    //     let actionComplete: (e?: Object) => void;
    //     beforeAll((done: Function) => {
    //         let dataBound: EmitType<Object> = () => { done(); };
    //         document.body.appendChild(elem);
    //         gridObj = new Grid(
    //             {
    //                 dataSource: data, allowPaging: false,
    //                 columns: [
    //                     {
    //                         headerText: 'Order Details', toolTip: 'Order Details',
    //                         columns: [{ field: 'OrderID', headerText: 'Order ID' },
    //                         { field: 'OrderDate', headerText: 'Order Date', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }]
    //                     },
    //                     { field: 'CustomerID', headerText: 'Customer ID' },
    //                     { field: 'EmployeeID', headerText: 'Employee ID' },
    //                     {
    //                         headerText: 'Ship Details',
    //                         columns: [
    //                             { field: 'ShipCity', headerText: 'Ship City' },
    //                             { field: 'ShipCountry', headerText: 'Ship Country' },
    //                             {
    //                                 headerText: 'Ship Name Verified', columns: [{ field: 'ShipName', headerText: 'Ship Name' },
    //                                 { field: 'Verified', headerText: 'Verified' }]
    //                             },
    //                         ],
    //                     }
    //                 ],
    //                 allowGrouping: true,
    //                 allowSorting: true,
    //                 allowReordering: true,
    //                 dataBound: dataBound,
    //                 actionComplete: actionComplete
    //             });
    //         gridObj.appendTo('#Grid');
    //     });

    //     it('Reordering the stackedheadercolumn', (done: Function) => { // reorder stacked header with grouping enabled
    //         let headers = gridObj.getHeaderContent().querySelectorAll('.e-stackedheadercell');
    //         actionComplete = () => {
    //             headers = gridObj.getHeaderContent().querySelectorAll('.e-stackedheadercell');
    //             expect(headers[1].innerHTML).toBe('Order Details');
    //             expect(headers[0].innerHTML).toBe('Ship Details');
    //             expect(gridObj.element.querySelectorAll('.e-cloneproperties').length).toBe(0);
    //             done();
    //         };
    //         expect(headers[0].innerHTML).toBe('Order Details');
    //         expect(headers[1].innerHTML).toBe('Ship Details');
    //         let mousedown: any = getEventObject('MouseEvents', 'mousedown', headers[0], 50, 70);
    //         EventHandler.trigger(gridObj.getHeaderContent().querySelector('.e-columnheader') as HTMLElement, 'mousedown', mousedown);

    //         let mousemove: any = getEventObject('MouseEvents', 'mousemove', headers[0], 87, 74);
    //         EventHandler.trigger(<any>(document), 'mousemove', mousemove);
    //         let mouseup: any = getEventObject('MouseEvents', 'mouseup', headers[1], 198, 72);
    //         EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    //         gridObj.actionComplete = actionComplete;
    //     });
    //     afterAll(() => {
    //         elem.remove();
    //     });
    // });


});
