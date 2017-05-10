/**
 * Grid Row Reordering spec document
 */
import { Browser, EventHandler, EmitType } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base/util';
import { createElement, remove } from '@syncfusion/ej2-base/dom';
import { SortDirection, SelectionType, SelectionMode } from '../../../src/grid/base/enum';
import { DataManager } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { Column } from '../../../src/grid/models/column';
import { Sort } from '../../../src/grid/actions/sort';
import { Data } from '../../../src/grid/actions/data';
import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { RowDD } from '../../../src/grid/actions/row-reorder';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Page, Sort, Selection, RowDD);

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

function setMouseCordinates(eventarg: any, x: number, y: number): Object {
    eventarg.pageX = x;
    eventarg.pageY = y;
    eventarg.clientX = x;
    eventarg.clientY = y;
    return eventarg;
}

describe('Row Drag and Drop module', () => {
    describe('Reorder row functionalities', () => {
        let gridObj: Grid;
        let gridObj1: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let elem1: HTMLElement = createElement('div', { id: 'Grid1' });
        let dataBound: EmitType<Object>;
        let actionComplete: (e?: Object) => void;
        let dataBound1: EmitType<Object>;
        let actionComplete1: (e?: Object) => void;
        let rows: any;
        let rows1: any;
        window['browserDetails'].isIE = false;

        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: JSON.parse(JSON.stringify(<any>data)),
                    allowRowDragAndDrop: true,
                    rowDropSettings: { targetID: undefined },
                    allowSelection: true,
                    selectionSettings: { type: 'multiple', mode: 'row' },
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    allowSorting: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 6, currentPage: 1 },
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');

            document.body.appendChild(elem1);
            gridObj1 = new Grid(
                {
                    dataSource: [],
                    allowRowDragAndDrop: true,
                    rowDropSettings: { targetID: 'Grid' },
                    allowSelection: true,
                    selectionSettings: { type: 'multiple', mode: 'row' },
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    allowSorting: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 6, currentPage: 1 },
                    actionComplete: actionComplete1,
                    dataBound: dataBound1
                });
            gridObj1.appendTo('#Grid1');
        });

        it('Reorder box selection simulate testing', () => {
            rows = gridObj.getContent().querySelectorAll('tr.e-row');

            let mousedown: any = getEventObject('MouseEvents', 'mousedown', rows[0].querySelectorAll('.e-rowcell')[0], 15, 10);
            EventHandler.trigger(<any>gridObj.getContent(), 'mousedown', mousedown);

            let mousemove: any = getEventObject('MouseEvents', 'mousemove', rows[1].querySelectorAll('.e-rowcell')[0], 15, 29);
            EventHandler.trigger(<any>gridObj.getContent(), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 2, 2);
            mousemove.srcElement = mousemove.target = mousemove.toElement = rows[0].querySelectorAll('.e-rowcell')[0];
            EventHandler.trigger(<any>gridObj.getContent(), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = rows[1].querySelectorAll('.e-rowcell')[0];
            mousemove = setMouseCordinates(mousemove, 15, 29);
            EventHandler.trigger(<any>gridObj.getContent(), 'mousemove', mousemove);

            let mouseup: any = getEventObject('MouseEvents', 'mouseup', rows[1].querySelectorAll('.e-rowcell')[0]);
            EventHandler.trigger(<any>(document.body), 'mouseup', mouseup);

            expect(gridObj.selectionModule.selectedRowIndexes.length).toEqual(2);
            expect(gridObj.selectionModule.selectedRowIndexes.indexOf(0) > -1).toEqual(true);
            expect(gridObj.selectionModule.selectedRowIndexes.indexOf(1) > -1).toEqual(true);

        });

        it('Reorder Row within grid return testing', () => {
            rows = gridObj.getContent().querySelectorAll('tr.e-row');

            let mousedown: any = getEventObject('MouseEvents', 'mousedown', rows[0].querySelectorAll('.e-rowcell')[0], 15, 10);
            EventHandler.trigger(<any>gridObj.getContent(), 'mousedown', mousedown);

            let mousemove: any = getEventObject('MouseEvents', 'mousemove', rows[0].querySelectorAll('.e-rowcell')[0], 15, 70);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = rows[3].querySelectorAll('.e-rowcell')[0];
            mousemove = setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);

            let mouseup: any = getEventObject('MouseEvents', 'mouseup', rows[3].querySelectorAll('.e-rowcell')[0]);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            rows = gridObj.getContent().querySelectorAll('tr.e-row');
            expect(rows[0].querySelector('.e-rowcell').textContent).toEqual('10248');
        });

        // it('Reorder drag with dragarea testing', () => {
        //     rows = gridObj.getContent().querySelectorAll('tr.e-row');
        //     gridObj.element.appendChild(createElement('div', { className: 'e-griddragarea' }));
        //     let mousedown: any = getEventObject('MouseEvents', 'mousedown', rows[0].querySelectorAll('.e-rowcell')[0], 15, 10);
        //     EventHandler.trigger(<any>gridObj.getContent(), 'mousedown', mousedown);

        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', rows[0].querySelectorAll('.e-rowcell')[0], 15, 70);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element.querySelector('.e-cloneproperties');
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = rows[3].querySelectorAll('.e-rowcell')[0];
        //     mousemove = setMouseCordinates(mousemove, 15, 75);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);

        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', rows[3].querySelectorAll('.e-rowcell')[0]);
        //     mouseup.type = 'mouseup';
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        //     rows = gridObj.getContent().querySelectorAll('tr.e-row');
        //     expect(rows[0].querySelector('.e-rowcell').textContent).toEqual('10248');
        //     remove(gridObj.element.querySelector('.e-griddragarea'));
        // });


        it('Reorder Row simulate grid to grid with undefined id testing', () => {
            rows = gridObj.getContent().querySelectorAll('tr.e-row');

            let mousedown: any = getEventObject('MouseEvents', 'mousedown', rows[0].querySelectorAll('.e-rowcell')[0], 15, 10);
            EventHandler.trigger(<any>gridObj.getContent(), 'mousedown', mousedown);

            rows1 = gridObj1.element.querySelector('.e-emptyrow');
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', rows[0].querySelectorAll('.e-rowcell')[0], 15, 70);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element; //not-allowed cursor
            mousemove = setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = rows1;
            mousemove = setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);

            let mouseup: any = getEventObject('MouseEvents', 'mouseup', rows1, 15, 75);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);

            expect(rows[0].querySelector('.e-rowcell').textContent).toEqual('10248');
            expect(rows[1].querySelector('.e-rowcell').textContent).toEqual('10249');
        });

        it('Reorder Row simulate grid to grid testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                rows = gridObj1.getContent().querySelectorAll('tr.e-row');
                expect(rows[0].querySelector('.e-rowcell').textContent).toEqual('10248');
                expect(rows[1].querySelector('.e-rowcell').textContent).toEqual('10249');

                rows = gridObj.getContent().querySelectorAll('tr.e-row');
                expect(rows[0].querySelector('.e-rowcell').textContent).toEqual('10250');
                expect(rows[1].querySelector('.e-rowcell').textContent).toEqual('10251');
                //for coverage
                gridObj.allowRowDragAndDrop = false;
                gridObj.dataBind();
                gridObj.allowRowDragAndDrop = true;
                gridObj.dataBind();
                (<any>gridObj.rowDragAndDropModule).enableAfterRender({ module: 'sort' });
                (<any>gridObj.rowDragAndDropModule).columnDrop({ droppedElement: createElement('div', { attrs: { 'action': 'grouping' } }) });

                (<any>gridObj.renderModule).data.removeRows({ indexes: [2, 1] });

                //for coverage
                gridObj.element.appendChild(createElement('div', { className: 'e-griddragarea' }));
                (<any>gridObj.getContent()).ej2_instances[2].trigger('dragStart', {}); //draggable instance  
                gridObj.element.appendChild(createElement('div', { className: 'e-cloneproperties' }));
                (<any>gridObj.getContent()).ej2_instances[2].trigger('dragStop', { target: gridObj.element, helper: gridObj.element.querySelector('.e-cloneproperties'), event: { clientX: 15, clientY: 15 } }); //draggable instance
                let target = createElement('div', { id: 'Grid', attrs: { 'action': 'grouping1' } });
                gridObj.element.appendChild(target);
                (<any>gridObj.rowDragAndDropModule).columnDrop({ target: gridObj.element, droppedElement: target });

                 //for coverage
                 gridObj1.allowPaging=false;
                 gridObj1.dataBind();                                
                target = createElement('div', { id: 'Grid', attrs: { 'action': 'grouping1' } });
                gridObj.element.appendChild(target);
                (<any>gridObj1.rowDragAndDropModule).columnDrop({ target: gridObj1.element.querySelector('.e-row'), droppedElement: target });

                gridObj.isDestroyed = true;
                gridObj.rowDragAndDropModule = new RowDD(gridObj);

                gridObj.rowDragAndDropModule.destroy();
                done();
            };
            gridObj.rowDropSettings.targetID = 'Grid1';
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            rows = gridObj.getContent().querySelectorAll('tr.e-row');

            let mousedown: any = getEventObject('MouseEvents', 'mousedown', rows[0].querySelectorAll('.e-rowcell')[0], 15, 10);
            EventHandler.trigger(<any>gridObj.getContent(), 'mousedown', mousedown);

            rows1 = gridObj1.element.querySelector('.e-emptyrow');
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', rows[0].querySelectorAll('.e-rowcell')[0], 15, 70);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element;
            mousemove = setMouseCordinates(mousemove, 0, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element;
            let obj: any = gridObj1.element.getElementsByClassName('e-emptyrow')[0].getBoundingClientRect();
            mousemove = setMouseCordinates(mousemove, obj.left + 2, obj.top + 2);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = rows1;
            mousemove = setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);

            let mouseup: any = getEventObject('MouseEvents', 'mouseup', rows1, 15, 75);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);

        });

        afterAll(() => {
            remove(elem);
            remove(elem1);
        });
    });

});

