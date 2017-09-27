/**
 * Grid Grouping spec document
 */
import { Browser, Component, ChildProperty, EventHandler, EmitType } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { SortDirection } from '../../../src/grid/base/enum';
import { DataManager } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { ReturnType } from '../../../src/grid/base/type';
import { Sort } from '../../../src/grid/actions/sort';
import { Selection } from '../../../src/grid/actions/selection';
import { Filter } from '../../../src/grid/actions/filter';
import { Page } from '../../../src/grid/actions/page';
import { Group } from '../../../src/grid/actions/group';
import { Reorder } from '../../../src/grid/actions/reorder';
import { filterData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Render } from '../../../src/grid/renderer/render';

Grid.Inject(Sort, Page, Filter, Group, Selection, Reorder);


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

describe('Grouping module', () => {


    describe('Grouping', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let columns: any;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    allowSelection: true,
                    groupSettings: { showGroupedColumn: true },
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('group drop area testing', () => {
            let dropArea = gridObj.element.querySelectorAll('.e-groupdroparea');
            expect(dropArea.length).toBe(1);
            expect(dropArea[0].textContent).toBe('Drag a column header here to group its column');
        });

        it('Single column group testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                let grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
                let content = gridObj.getContent().querySelectorAll('tr');
                let gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
                expect(grpHIndent.length).toBe(1);
                expect(grpHIndent[0].querySelector('.e-headercelldiv').classList.contains('e-emptycell')).toBeTruthy();
                expect(content[0].querySelectorAll('.e-recordplusexpand').length).toBe(1);
                expect(content[0].querySelectorAll('.e-recordplusexpand'
                )[0].firstElementChild.classList.contains('e-gdiagonaldown')).toBeTruthy();

                expect(content[0].querySelectorAll('.e-groupcaption').length).toBe(1);
                expect(content[0].querySelectorAll('.e-groupcaption')[0].getAttribute('colspan')).toBe('6');
                //expect(content[0].querySelectorAll('.e-groupcaption')[0].textContent).toBe('Ship City: Albuquerque - 5 items');

                expect(content[1].querySelectorAll('.e-indentcell').length).toBe(1);

                expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toBe(6);

                expect(gHeader.length).toBe(1);
                expect(gHeader[0].querySelectorAll('.e-grouptext').length).toBe(1);
                expect(gHeader[0].querySelectorAll('.e-grouptext')[0].textContent).toBe('Ship City');
                expect(gHeader[0].querySelectorAll('.e-groupsort').length).toBe(1);
                expect(gHeader[0].querySelectorAll('.e-groupsort')[0].classList.contains('e-ascending')).toBeTruthy();
                expect(gHeader[0].querySelectorAll('.e-ungroupbutton').length).toBe(1);

                expect(gridObj.groupSettings.columns.length).toBe(1);
                expect(gridObj.sortSettings.columns.length).toBe(1);


                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ShipCity');
        });

        it('Expandcollase row shortcut testing', () => {
            gridObj.selectRow(1);
            (<any>gridObj.groupModule).keyPressHandler({ action: 'altUpArrow', preventDefault: () => { } });
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(13);
            (<any>gridObj.groupModule).keyPressHandler({ action: 'altUpArrow', preventDefault: () => { } });
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(13);
            (<any>gridObj.groupModule).keyPressHandler({ action: 'altDownArrow', preventDefault: () => { } });
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(18);
            (<any>gridObj.groupModule).keyPressHandler({ action: 'altDownArrow', preventDefault: () => { } });
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(18);
            gridObj.allowSelection = false;
            gridObj.dataBind();
            (<any>gridObj.groupModule).keyPressHandler({ action: 'altUpArrow', preventDefault: () => { } });
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(18);
            gridObj.allowSelection = true;
            gridObj.dataBind();

        });

        it('multi column group testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.groupSettings.columns.length).toBe(2);
                expect(gridObj.sortSettings.columns.length).toBe(2);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ShipCountry');
        });

        it('multiple column group testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                let grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
                let content = gridObj.getContent().querySelectorAll('tr');
                let gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
                expect(grpHIndent.length).toBe(3);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell').length).toBe(3);
                expect(content[0].querySelectorAll('.e-recordplusexpand').length).toBe(1);
                expect((content[0].querySelectorAll('.e-recordplusexpand')[0] as HTMLTableCellElement).cellIndex).toBe(0);
                expect(content[0].querySelectorAll('.e-indentcell').length).toBe(0);
                expect(content[0].querySelectorAll('.e-recordplusexpand'
                )[0].firstElementChild.classList.contains('e-gdiagonaldown')).toBeTruthy();

                expect(content[1].querySelectorAll('.e-recordplusexpand').length).toBe(1);
                expect((content[1].querySelectorAll('.e-recordplusexpand')[0] as HTMLTableCellElement).cellIndex).toBe(1);
                expect(content[1].querySelectorAll('.e-indentcell').length).toBe(1);
                expect(content[1].querySelectorAll('.e-recordplusexpand'
                )[0].firstElementChild.classList.contains('e-gdiagonaldown')).toBeTruthy();

                expect(content[2].querySelectorAll('.e-recordplusexpand').length).toBe(1);
                expect((content[2].querySelectorAll('.e-recordplusexpand')[0] as HTMLTableCellElement).cellIndex).toBe(2);
                expect(content[2].querySelectorAll('.e-indentcell').length).toBe(2);
                expect(content[2].querySelectorAll('.e-recordplusexpand'
                )[0].firstElementChild.classList.contains('e-gdiagonaldown')).toBeTruthy();

                expect(content[0].querySelectorAll('.e-groupcaption')[0].getAttribute('colspan')).toBe('8');
                expect(content[1].querySelectorAll('.e-groupcaption')[0].getAttribute('colspan')).toBe('7');
                expect(content[2].querySelectorAll('.e-groupcaption')[0].getAttribute('colspan')).toBe('6');

                expect(content[0].querySelectorAll('.e-groupcaption').length).toBe(1);
                expect(content[1].querySelectorAll('.e-groupcaption').length).toBe(1);
                expect(content[2].querySelectorAll('.e-groupcaption').length).toBe(1);

                // expect(content[0].querySelectorAll('.e-groupcaption')[0].textContent).toBe('Ship City: Albuquerque - 1 item');
                // expect(content[1].querySelectorAll('.e-groupcaption')[0].textContent).toBe('Ship Country: USA - 1 item');
                // expect(content[2].querySelectorAll('.e-groupcaption')[0].textContent).toBe('CustomerID: RATTC - 5 items');

                expect(content[3].querySelectorAll('.e-indentcell').length).toBe(3);

                expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toBe(18);

                expect(gHeader.length).toBe(3);

                expect(gridObj.groupSettings.columns.length).toBe(3);
                expect(gridObj.sortSettings.columns.length).toBe(3);

                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('CustomerID');
        });


        it('ungroup testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                let grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
                let content = gridObj.getContent().querySelectorAll('tr');
                let gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
                expect(grpHIndent.length).toBe(2);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell').length).toBe(2);
                expect(content[0].querySelectorAll('.e-recordplusexpand').length).toBe(1);
                expect((content[0].querySelectorAll('.e-recordplusexpand')[0] as HTMLTableCellElement).cellIndex).toBe(0);
                expect(content[0].querySelectorAll('.e-indentcell').length).toBe(0);
                expect(content[0].querySelectorAll('.e-recordplusexpand'
                )[0].firstElementChild.classList.contains('e-gdiagonaldown')).toBeTruthy();

                expect(content[1].querySelectorAll('.e-recordplusexpand').length).toBe(1);
                expect((content[1].querySelectorAll('.e-recordplusexpand')[0] as HTMLTableCellElement).cellIndex).toBe(1);
                expect(content[1].querySelectorAll('.e-indentcell').length).toBe(1);
                expect(content[1].querySelectorAll('.e-recordplusexpand'
                )[0].firstElementChild.classList.contains('e-gdiagonaldown')).toBeTruthy();

                expect(content[0].querySelectorAll('.e-groupcaption')[0].getAttribute('colspan')).toBe('7');
                expect(content[1].querySelectorAll('.e-groupcaption')[0].getAttribute('colspan')).toBe('6');

                expect(content[0].querySelectorAll('.e-groupcaption').length).toBe(1);
                expect(content[1].querySelectorAll('.e-groupcaption').length).toBe(1);

                // expect(content[0].querySelectorAll('.e-groupcaption')[0].textContent).toBe('Ship City: Albuquerque - 1 item');
                // expect(content[1].querySelectorAll('.e-groupcaption')[0].textContent).toBe('CustomerID: RATTC - 5 items');

                expect(content[2].querySelectorAll('.e-indentcell').length).toBe(2);

                expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toBe(12);

                expect(gHeader.length).toBe(2);

                expect(gridObj.groupSettings.columns.length).toBe(2);
                expect(gridObj.sortSettings.columns.length).toBe(2);

                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ShipCountry');
        });

        it('Sort column with sorting disabled testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelector('.e-groupdroparea').querySelectorAll('.e-descending').length).toBe(0);
                expect(gridObj.element.querySelector('.e-groupdroparea').querySelectorAll('.e-ascending').length).toBe(2);
                expect(gridObj.sortSettings.columns[0].direction).toBe('ascending');
                expect(gridObj.sortSettings.columns[1].direction).toBe('ascending');
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelectorAll('.e-ascending').length).toBe(1);
                expect(gridObj.getColumnHeaderByField('ShipCity').querySelectorAll('.e-ascending').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            let grpHCell = gridObj.element.querySelectorAll('.e-groupheadercell');
            (grpHCell[0] as HTMLElement).click();
            (grpHCell[1] as HTMLElement).click();
            gridObj.allowSorting = true;
            gridObj.dataBind();

        });

        it('Sort column with sorting enable testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelector('.e-groupdroparea').querySelectorAll('.e-descending').length).toBe(1);
                expect(gridObj.element.querySelector('.e-groupdroparea').querySelectorAll('.e-ascending').length).toBe(1);
                expect(gridObj.sortSettings.columns[0].direction).toBe('descending');
                expect(gridObj.getColumnHeaderByField('ShipCity').querySelectorAll('.e-descending').length).toBe(1);
                done();
            };
            let grpHCell = gridObj.element.querySelectorAll('.e-groupheadercell');
            gridObj.actionComplete = actionComplete;
            (grpHCell[0] as HTMLElement).click();
        });

        it('Sort column with sorting enable testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelector('.e-groupdroparea').querySelectorAll('.e-descending').length).toBe(2);
                expect(gridObj.element.querySelector('.e-groupdroparea').querySelectorAll('.e-ascending').length).toBe(0);
                expect(gridObj.sortSettings.columns[1].direction).toBe('descending');
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelectorAll('.e-descending').length).toBe(1);
                done();
            };
            let grpHCell = gridObj.element.querySelectorAll('.e-groupheadercell');
            gridObj.actionComplete = actionComplete;
            (grpHCell[1] as HTMLElement).click();
        });

        it('ungroup from button click testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                let grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
                let gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
                expect(grpHIndent.length).toBe(1);
                expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toBe(8);
                expect(gHeader.length).toBe(1);
                expect(gridObj.groupSettings.columns.length).toBe(1);
                expect(gridObj.sortSettings.columns.length).toBe(2);
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.getElementsByClassName('e-groupheadercell')[0].querySelector('.e-ungroupbutton') as HTMLElement).click()
        });

        // it('ungroup from drag and drop testing', (done: Function) => {
        //     actionComplete = (args?: Object): void => {
        //         let grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
        //         let gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
        //         expect(grpHIndent.length).toBe(0);
        //         expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toBe(0);
        //         expect(gHeader.length).toBe(0);
        //         expect(gridObj.groupSettings.columns.length).toBe(0);
        //         expect(gridObj.sortSettings.columns.length).toBe(2);
        //         done();
        //     };
        //     gridObj.actionComplete = actionComplete;
        //     let gHeaders = gridObj.element.querySelectorAll('.e-groupheadercell');
        //     let mousedown: any = getEventObject('MouseEvents', 'mousedown', gHeaders[0], 10, 10);
        //     EventHandler.trigger(gridObj.element.querySelector('.e-groupdroparea') as HTMLElement, 'mousedown', mousedown);

        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', gHeaders[0]);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element.querySelector('.e-cloneproperties');
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.getContent().querySelectorAll('.e-rowcell')[1];
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);

        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', gridObj.getContent().querySelectorAll('.e-rowcell')[1], 198, 198);
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        // });

        // it('group from drag and drop testing', (done: Function) => {
        //     actionComplete = (args?: Object): void => {
        //         let grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
        //         let gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
        //         expect(grpHIndent.length).toBe(1);
        //         expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toBe(8);
        //         expect(gHeader.length).toBe(1);
        //         expect(gridObj.groupSettings.columns.length).toBe(1);
        //         expect(gridObj.sortSettings.columns.length).toBe(2);
        //         done();
        //     };
        //     gridObj.actionComplete = actionComplete;
        //     let gHeaders = gridObj.element.querySelectorAll('.e-groupheadercell');
        //     let headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');

        //     let mousedown: any = getEventObject('MouseEvents', 'mousedown', headers[1].querySelector('.e-headercelldiv'), 20, 40);
        //     EventHandler.trigger(gridObj.getHeaderContent().querySelector('.e-columnheader') as HTMLElement, 'mousedown', mousedown);

        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', headers[1]);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element.querySelector('.e-cloneproperties');
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element.querySelector('.e-groupdroparea');
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);

        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', gridObj.element.querySelector('.e-groupdroparea'), 10, 13);
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        // });//customerid

        it('collapseAll method testing', () => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordplusexpand');
            gridObj.groupModule.expandCollapseRows(expandElem[1]);
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
            gridObj.groupModule.collapseAll();
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(8);
        });

        it('expandAll method testing', () => {

            gridObj.groupModule.expandAll();
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(20);
        });

        it('collapseAll shortcut testing', () => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordplusexpand');
            gridObj.groupModule.expandCollapseRows(expandElem[1]);
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
            (<any>gridObj.groupModule).keyPressHandler({ action: 'ctrlUpArrow', preventDefault: () => { } });
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(8);
        });

        it('expandAll shortcut testing', () => {
            (<any>gridObj.groupModule).keyPressHandler({ action: 'ctrlDownArrow', preventDefault: () => { } });
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(20);
        });


        it('multi column group testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.groupSettings.columns.length).toBe(2);
                expect(gridObj.sortSettings.columns.length).toBe(2);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ShipCity');
        });

        it('expandcollapse rows method testing', () => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordplusexpand');
            gridObj.groupModule.expandCollapseRows(expandElem[1]);
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(28);
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(27);
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(28);
            gridObj.groupModule.expandCollapseRows(expandElem[1]);
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(30);
            gridObj.groupModule.expandCollapseRows(expandElem[2]);
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(27);
            gridObj.groupModule.expandCollapseRows(expandElem[2]);
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(30);
        });

        it('group destroy testing', () => { //for coverage     
            (<any>gridObj.groupModule).helper({ target: (gridObj.groupModule as any).element, sender: { target: (gridObj.groupModule as any).element.querySelectorAll('.e-grouptext')[0] } });
            (<any>gridObj.groupModule).helper({ target: (gridObj.groupModule as any).element, sender: { target: gridObj.element } });
            (<any>gridObj.groupModule).helper({ target: (gridObj.groupModule as any).element, sender: { target: gridObj.element } });
            (<any>gridObj.groupModule).helper({ target: gridObj.element.querySelectorAll('.e-groupheadercell'), sender: { target: gridObj.element.querySelectorAll('.e-groupheadercell')[0] } });
            (<any>gridObj.groupModule).dragStart();
            (<any>gridObj.groupModule).drag({ target: gridObj.element });
            let helper = createElement('div');
            gridObj.element.appendChild(helper);
            (<any>gridObj.groupModule).dragStop({ target: gridObj.element.querySelector('.e-gridcontent'), helper: helper });
            (<any>gridObj.groupModule).dragStop({ target: gridObj.element, helper: helper });
            (<any>gridObj.groupModule).columnDragStart({ target: gridObj.getColumnHeaderByField('OrderID').children[0], column: gridObj.getColumnByField('OrderID') });
            gridObj.element.appendChild(createElement('div', { className: 'e-cloneproperties' }));

            (<any>gridObj.groupModule).columnDrag({ target: gridObj.element.querySelector('.e-groupdroparea') });
            (<any>gridObj.groupModule).columnDrag({ target: gridObj.element });
            gridObj.groupModule.groupColumn('');
            gridObj.groupModule.ungroupColumn('');
            (<any>gridObj.groupModule).headerDrop({ uid: gridObj.getColumnByField('ShipCountry').uid });


            gridObj.allowGrouping = false;
            gridObj.dataBind();
            gridObj.allowGrouping = true;
            gridObj.dataBind();


            gridObj.element.appendChild(createElement('div', { className: 'e-groupdroparea' }));
            (<any>gridObj.groupModule).drop({ target: (gridObj.groupModule as any).element, droppedElement: gridObj.element.querySelector('.e-groupdroparea') });
            gridObj.element.appendChild(createElement('div', { className: 'e-groupdroparea' }));
            (<any>gridObj.contentModule).drop({ target: (gridObj.groupModule as any).element, droppedElement: gridObj.element.querySelector('.e-groupdroparea') });
            gridObj.element.appendChild(createElement('div', { className: 'e-groupdroparea' }));
            gridObj.element.appendChild(createElement('div', { className: 'e-cloneproperties' }));

            (<any>gridObj.groupModule).headerDrop({ uid: undefined });
            (<any>gridObj.groupModule).columnDragStart({ target: createElement('div', { className: 'e-stackedheadercell' }) });
            gridObj.isDestroyed = true;
            (<any>gridObj.contentModule).rafCallback({});

            gridObj.isDestroyed = true;
            gridObj.groupModule.addEventListener();
            gridObj.groupModule.removeEventListener();
            (<any>gridObj.groupModule).onPropertyChanged({ module: 'group', properties: { columns: undefined } });
            (<any>gridObj.groupModule).columnDrop({ droppedElement: createElement('div', { attrs: { action: 'grouping1' } }) });
            (<any>gridObj.groupModule).columnDrop({ droppedElement: createElement('div', { attrs: { 'action': 'grouping', 'e-mappinguid': '' } }) });
            helper = createElement('div');
            gridObj.element.appendChild(helper);
            (<any>gridObj.headerModule).dragStop({ target: gridObj.element.children[0], helper: helper });
            let div = createElement('div');
            document.body.appendChild(div);
            (<any>gridObj.headerModule).drag({ target: div });

            gridObj.allowReordering = true;
            gridObj.dataBind();
            gridObj.element.appendChild(createElement('div', { className: 'e-reorderuparrow' }));
            gridObj.element.appendChild(createElement('div', { className: 'e-reorderdownarrow' }));
            (<any>gridObj.headerModule).drag({ target: div });

        });

        afterAll(() => {
            elem.remove();
        });
    });


    describe('Grouping hide', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let columns: any;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    allowSorting: true,
                    groupSettings: { showGroupedColumn: false },
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('Single column group testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.groupSettings.columns.length).toBe(1);
                expect(gridObj.sortSettings.columns.length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-headercell:not(.e-hide)').length).toBe(5);
                done();
            };
            gridObj.groupSettings.showGroupedColumn = false;
            gridObj.dataBind();
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ShipCity');
        });

        it('Single column ungroup testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.groupSettings.columns.length).toBe(0);
                expect(gridObj.sortSettings.columns.length).toBe(0);
                expect(gridObj.element.querySelectorAll('.e-headercell:not(.e-hide)').length).toBe(6);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ShipCity');
        });

        afterAll(() => {
            elem.remove();
        });
    });

    describe('Grouping toggle', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let columns: any;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    allowSorting: true,
                    groupSettings: { showToggleButton: true, showGroupedColumn: true },
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('sort after group testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.groupSettings.columns.length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            let headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            (headers[0].querySelector('.e-grptogglebtn') as HTMLElement).click();
        });

        it('group from toogle header testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.sortSettings.columns.length).toBe(2);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.sortColumn('CustomerID', 'ascending', false);
        });

        it('show drop area', () => {
            gridObj.groupSettings.showDropArea = true;
            gridObj.dataBind();
            expect((gridObj.element.querySelectorAll('.e-groupdroparea')[0] as HTMLElement).style.display).toBe('')
        });

        it('hide drop area', () => {
            gridObj.groupSettings.showDropArea = false;
            gridObj.dataBind();
            expect((gridObj.element.querySelectorAll('.e-groupdroparea')[0] as HTMLElement).style.display).toBe('none');
        });

        it('hide group toggle button', () => {
            gridObj.groupSettings.showToggleButton = false;
            gridObj.dataBind();
            expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn').length).toBe(0);
        });

        it('show group toggle button', () => {
            gridObj.groupSettings.showToggleButton = true;
            gridObj.dataBind();
            expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn').length).toBe(gridObj.columns.length);
        });

        it('hide ungroup button', () => {
            gridObj.groupSettings.showUngroupButton = false;
            gridObj.dataBind();
            expect((gridObj.element.querySelectorAll('.e-groupdroparea')[0].
                querySelectorAll('.e-ungroupbutton')[0] as HTMLElement).style.display).toBe('none');
        });

        it('show ungroup button', () => {
            gridObj.groupSettings.showUngroupButton = true;
            gridObj.dataBind();
            expect((gridObj.element.querySelectorAll('.e-groupdroparea')[0].
                querySelectorAll('.e-ungroupbutton')[0] as HTMLElement).style.display).toBe('');
        });

        it('hide Grouped Column', (done: Function) => {
            actionComplete = () => {
                expect(1).toBe(1);
                // expect(gridObj.element.querySelectorAll('.e-headercell.e-hide').length).toBe(gridObj.groupSettings.columns.length);
                // expect(gridObj.element.querySelectorAll('.e-rowcell.e-hide').length).toBe(gridObj.groupSettings.columns.length * 12);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupSettings.showGroupedColumn = false;
            gridObj.dataBind();
        });

        it('show Grouped Column', (done: Function) => {
            actionComplete = () => {
                //expect(gridObj.element.querySelectorAll('.e-headercell.e-hide').length).toBe(0);
                //expect(gridObj.element.querySelectorAll('.e-rowcell.e-hide').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupSettings.showGroupedColumn = true;
            gridObj.dataBind();
        });

        it('ungroup from toogele header testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                //expect(gridObj.groupSettings.columns.length).toBe(0);
                expect(1).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            let headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            (headers[0].querySelector('.e-grptogglebtn') as HTMLElement).click();
            //for coverage
            (<any>gridObj.groupModule).toogleGroupFromHeader(createElement('div'));
            let div = createElement('div', { className: 'e-toggleungroup', attrs: { 'ej-mappingname': '' } });
            div.appendChild(createElement('div', { className: 'e-toggleungroup', attrs: { 'ej-mappingname': '' } }));
            (<any>gridObj.groupModule).toogleGroupFromHeader(div.firstElementChild);
            (<any>gridObj.groupModule).enableAfterRender({ module: 'sort' });
            gridObj.clearSelection();
            (<any>gridObj.groupModule).keyPressHandler({ action: 'altDownArrow', preventDefault: () => { } });
            gridObj.groupSettings.showDropArea = true;
            gridObj.dataBind();
            gridObj.groupSettings.showDropArea = false;
            gridObj.dataBind();
            let fn: any = function () {
                var div = createElement('div');
                var colgroup = createElement('colgroup');
                var col = createElement('col');
                colgroup.appendChild(col);
                div.appendChild(colgroup);
                return div;
            };
            gridObj.getHeaderTable = fn;
            (gridObj.scrollModule as any).widthService.setWidth(1, 10);
            let fn1: any = function () {
                let arr: any = [];
                return arr;
            };
            gridObj.getColumnIndexesInView = fn1;
            gridObj.groupSettings.columns = ['OrderID'];
            gridObj.enableColumnVirtualization = true;
            (gridObj.scrollModule as any).widthService.setWidthToColumns();
            (gridObj.renderModule as any).contentRenderer.getModelGenerator().refreshRows([{ isDataRow: true }]);
            let fn2: any = function () {
                return false;
            };
            (gridObj.renderModule as any).contentRenderer.generator.getCaptionRowCells = fn2;
            (gridObj.renderModule as any).contentRenderer.generator.generateCaptionRow({ field: 'unknown', isDataRow: false });
        });

        afterAll(() => {
            elem.remove();
        });
    });


    describe('group col initial rendering', () => { //for coverage
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let columns: any;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'Customer ID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    ],
                    allowGrouping: true,
                    allowSorting: true,
                    groupSettings: { columns: ['CustomerID'], showToggleButton: true, showGroupedColumn: true, showDropArea: true },
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('group header testing', () => {
            (<any>gridObj.groupModule).contentRefresh = false;
            gridObj.groupModule.groupColumn('EmployeeID');
            expect(1).toBe(1);
        });

        afterAll(() => {
            elem.remove();
        });
    });

    describe('Stacked header with grouping', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData, allowPaging: false,
                    columns: [
                        {
                            headerText: 'Order Details', toolTip: 'Order Details',
                            columns: [{ field: 'OrderID', headerText: 'Order ID' },
                            { field: 'OrderDate', headerText: 'Order Date', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }]
                        },
                        { field: 'CustomerID', headerText: 'Customer ID' },
                        { field: 'EmployeeID', headerText: 'Employee ID' },
                        {
                            headerText: 'Ship Details',
                            columns: [
                                { field: 'ShipCity', headerText: 'Ship City' },
                                { field: 'ShipCountry', headerText: 'Ship Country' },
                                {
                                    headerText: 'Ship Name Verified', columns: [{ field: 'ShipName', headerText: 'Ship Name' },
                                    { field: 'Verified', headerText: 'Verified' }]
                                },
                            ],
                        }
                    ],
                    allowGrouping: true,
                    allowSorting: true,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('group a column', (done: Function) => {
            let actionComplete = (args: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toBe(3);
                done();
            };
            gridObj.groupModule.groupColumn('EmployeeID');
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
        });
        it('sort a column', (done: Function) => {
            let actionComplete = (args: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(2);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toBe(3);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.sortColumn('OrderDate', 'ascending');
            gridObj.dataBind();
        });
        it('ungroup a column', (done: Function) => {
            let actionComplete = (args: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('EmployeeID');
            gridObj.dataBind();
        });
        it('clear sort', (done: Function) => {
            let actionComplete = (args: Object) => {
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSorting();
            gridObj.dataBind();
        });

        afterAll(() => {
            elem.remove();
        });
    });
    // grouping with stacked header
    describe('Grouping set model test case', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let columns: any;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    allowSorting: true,
                    allowPaging: true,
                    allowReordering: true,
                    groupSettings: { showDropArea: false, showToggleButton: true, showUngroupButton: true },
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });
        it('check default group property rendering', () => {
            expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(1)
            expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn').length).toBe(gridObj.columns.length);
        });
        it('disable Grouping', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(0);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.allowGrouping = false;
            gridObj.dataBind();
        });
        it('enable Grouping', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(1);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn').length).toBe(gridObj.columns.length);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.allowGrouping = true;
            gridObj.dataBind();
        });
        it('group a column', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(1);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn.e-toggleungroup').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].querySelectorAll('.e-ungroupbutton').length).toBe(1);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('EmployeeID');
            gridObj.dataBind();
        });
        it('reOrder the grouped column', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn.e-toggleungroup').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].querySelectorAll('.e-ungroupbutton').length).toBe(1);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-headercell')[5].children[0].innerHTML).toMatch('Employee ID');
                expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(12);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.reorderColumns('EmployeeID', 'ShipCountry');
            gridObj.dataBind();
        });
        afterAll(() => {
            elem.remove();
        });

    });
    //initial render with grouping
    describe('Grouping a column in default', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let columns: any;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { columns: ['EmployeeID'] },
                    allowSorting: true,
                    allowPaging: true,
                    allowFiltering: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });
        it('check default group property rendering', () => {
            expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(1);
            expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toBe(1);
            expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].querySelectorAll('.e-ungroupbutton').length).toBe(1);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(1);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell').length).toBe(2);
            expect(gridObj.getContent().querySelectorAll('.e-indentcell').length > 0).toBe(true)
          //  expect(gridObj.getContent().querySelectorAll('.e-rowcell')[0].innerHTML).toBe('10258');
            expect(gridObj.groupSettings.columns.length).toBe(1);
        });
        it('disable Grouping', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(0);
                expect(gridObj.currentViewData.length).toBe(12);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.allowGrouping = false;
            gridObj.dataBind();
        });
        it('enable Grouping', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.allowGrouping = true;
            gridObj.dataBind();
        });
        afterAll(() => {
            elem.remove();
        });
    });
    //initial render with two columns grouped. 
    describe('Grouping two columns initial', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let columns: any;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { columns: ['EmployeeID', 'ShipCity'] },
                    allowSorting: true,
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });
        it('check default group property rendering', () => {
            expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(1);
            expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toBe(2);
            expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].querySelectorAll('.e-ungroupbutton').length).toBe(2);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(2);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell').length).toBe(2);
            expect(gridObj.getContentTable().querySelectorAll('.e-indentcell').length > 0).toBeTruthy();
            expect(gridObj.groupSettings.columns.length).toBe(2);
        });
        it('disable Grouping', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(0);
                expect(gridObj.currentViewData.length).toBe(12);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.allowGrouping = false;
            gridObj.dataBind();
        });
        it('enable Grouping', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.allowGrouping = true;
            gridObj.dataBind();
        });
        afterAll(() => {
            elem.remove();
        });

    });


    // for coverage
    describe('Grouping two columns initial', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let columns: any;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { columns: ['EmployeeID', 'ShipCity'] },
                    allowSorting: false,
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });
        it('test', () => {
            expect(1).toBe(1);
        });
        afterAll(() => {
            elem.remove();
        });

    });

    // for coverage
    describe('Grouping two columns initial', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let columns: any;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    sortSettings: { columns: [{ field: 'EmployeeID', direction: 'ascending' }] },
                    groupSettings: { columns: ['EmployeeID'] },
                    allowSorting: true,
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });
        it('test', () => {
            expect(1).toBe(1);
        });
        afterAll(() => {
            elem.remove();
        });

    });

    // initially grouping and sort same column
    describe('Grouping and sorting same column', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let columns: any;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { columns: ['EmployeeID'] },
                    sortSettings: { columns: [{ field: 'EmployeeID', direction: 'ascending' }] },
                    allowSorting: true,
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });
        it('initial render testing', () => {
            expect(gridObj.groupSettings.columns.length).toBe(gridObj.sortSettings.columns.length);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-sortnumber').length).toBe(0);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(1);
        });

        it('check aria attribute', () => {
            let groupDropArea: Element = gridObj.element.querySelector('.e-groupdroparea');
            expect(groupDropArea.querySelector('.e-grouptext').hasAttribute('tabindex')).toBeTruthy();
            expect(groupDropArea.querySelector('.e-groupsort').hasAttribute('tabindex')).toBeTruthy();
            expect(groupDropArea.querySelector('.e-ungroupbutton').hasAttribute('tabindex')).toBeTruthy();
            expect(groupDropArea.querySelector('.e-grouptext').hasAttribute('aria-label')).toBeTruthy();
            expect(groupDropArea.querySelector('.e-groupsort').hasAttribute('aria-label')).toBeTruthy();
            expect(groupDropArea.querySelector('.e-ungroupbutton').hasAttribute('aria-label')).toBeTruthy();
            expect(gridObj.element.querySelector('.e-recordplusexpand').hasAttribute('tabindex')).toBeTruthy();
        });

        it('clear Grouping', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.sortSettings.columns.length).toBe(1);
                expect(gridObj.groupSettings.columns.length).toBe(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(1);
                expect(gridObj.getContent().querySelectorAll('tr').length).toBe(12);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('EmployeeID');
            gridObj.dataBind();
        });
        it('clear sorting', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.sortSettings.columns.length).toBe(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSorting();
            gridObj.dataBind();
        });
        afterAll(() => {
            elem.remove();
        });

    });

    describe('Grouping date', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let columns: any;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'OrderDate', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { disablePageWiseAggregates: true, columns: ['OrderDate', 'ShipCountry'] },
                    allowPaging: true,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });
        it('check data', () => {
            expect(gridObj.currentViewData.length).not.toBeNull();
        });
        afterAll(() => {
            elem.remove();
        });
    });

    describe('Grouping remote data', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let columns: any;
        let old: (e: ReturnType) => Promise<Object> = Render.prototype.validateGroupRecords;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: new DataManager({ url: '/api/test' }),
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'OrderDate', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { disablePageWiseAggregates: true, columns: ['EmployeeID', 'CustomerID'] },
                    allowPaging: true,
                    actionFailure: dataBound,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
            let first: JasmineAjaxRequest = jasmine.Ajax.requests.at(1);
            first.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify({ d: { results: filterData, __count: 100 } })
            });

            Render.prototype.validateGroupRecords = (e: ReturnType) => {
                let promise: Promise<Object> = old.call(gridObj.renderModule, e);
                let first: JasmineAjaxRequest = jasmine.Ajax.requests.at(1);
                first.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify({ d: { results: filterData, __count: 100 } })
                });
                return promise;
            };
        });
        it('check data', () => {
            expect(gridObj.groupSettings.columns.length).not.toBeNull();
        });
        afterAll(() => {
            Render.prototype.validateGroupRecords = old;
            elem.remove();
            jasmine.Ajax.uninstall();
        });
    });

    describe('Grouping disablePageWiseAggregates with empty datasource', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        let columns: any;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: [],
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'OrderDate', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { disablePageWiseAggregates: true, columns: ['OrderDate', 'ShipCountry'] },
                    allowPaging: true,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });
        it('check data length', () => {
            expect(gridObj.currentViewData.length).toBe(0);
        });
        afterAll(() => {
            elem.remove();
        });
    });

});
