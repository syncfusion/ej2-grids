/**
 * Grid Filtering spec document
 */
import { EventHandler, ChildProperty, EmitType } from '@syncfusion/ej2-base';
import { extend, getValue } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Group } from '../../../src/grid/actions/group';
import { Page } from '../../../src/grid/actions/page';
import { CellType } from '../../../src/grid/base/enum';
import { ValueFormatter } from '../../../src/grid/services/value-formatter';
import { Column } from '../../../src/grid/models/column';
import { Selection } from '../../../src/grid/actions/selection';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { filterData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Filter, Page, Selection, Group);

describe('Filter menu renderer module', () => {
    let css: string = ".e-spinner-pane::after { content: 'Material'; display: none;} ";
    let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
    let styleNode: Node = style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);

    describe('grid content element testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    allowPaging: true,
                    allowFiltering: true,
                    filterSettings: {
                        type: 'menu',
                        operators: {
                            stringOperator: [
                                { value: 'startsWith', text: 'starts with' },
                                { value: 'endsWith', text: 'ends with' }, { value: 'contains', text: 'contains' },
                                { value: 'equal', text: 'equal' }],
                        }
                    },
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'right', filter: {
                                ui: {
                                    create: (args: { target: Element, column: Object }) => {
                                        let db: Object = new DataManager(filterData as JSON[]);
                                        let flValInput: HTMLElement = createElement('input', { className: 'e-flmenu-input' });
                                        args.target.appendChild(flValInput);
                                        this.dropInstance = new DropDownList({
                                            dataSource: new DataManager(filterData as JSON[]),
                                            fields: { text: 'OrderID', value: 'OrderID' },
                                            placeholder: 'Select a value',
                                            popupHeight: '200px'
                                        });
                                        this.dropInstance.appendTo(flValInput);
                                    },
                                    write: (args: {
                                        column: Object, target: Element, parent: any,
                                        filteredValue: number | string
                                    }) => {
                                        this.dropInstance.value = args.filteredValue;
                                        this.dropInstance.dataBind();
                                    },
                                    read: (args: { target: Element, column: any, operator: string, fltrObj: Filter }) => {
                                        args.fltrObj.filterByColumn(args.column.field, args.operator, this.dropInstance.value);

                                    }
                                }
                            }
                        },
                        { field: 'CustomerID', headerText: 'Customer Name', width: 150, allowFiltering: false },
                        { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'right' },
                        { field: 'Freight', width: 120, format: 'C2', textAlign: 'right', editType: 'numericedit' },
                        {
                            field: 'ShipCity', headerText: 'Ship City', width: 140
                        },
                        {
                            field: 'ShipCountry', headerText: 'Ship Country', filter: {
                                type: 'excel'
                            }, width: 150
                        },
                        {
                            field: 'Verified', headerText: 'Verified', width: 120, filter: {
                                type: 'menu'
                            }
                        }
                    ],
                    dataBound: dataBound,
                    actionComplete: actionComplete,
                });
            gridObj.appendTo('#Grid');
        });

        it('Filter template column', (done: Function) => {
            actionComplete = (args?: Object): void => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            let e: any = {};
            let ele: Element = (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[0]);
            e = { target: ele };
            (<any>gridObj).filterModule.filterIconClickHandler(e);
            expect((<Column>gridObj.columns[1]).allowFiltering).toBeFalsy();
            (<HTMLInputElement>document.querySelector('.e-flmenu-valuediv input')).value = '10249';
            (<any>gridObj).filterModule.filterModule.filterBtnClick(gridObj.columns[0]);
            (<any>gridObj).filterModule.filterIconClickHandler(e);
            (<any>gridObj).filterModule.filterModule.clearBtnClick(gridObj.columns[0])
        });

        it('Filter date column', (done: Function) => {
            actionComplete = (args?: Object): void => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            let e: any = {};
            let ele: Element = (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[1]);
            e = { target: ele };
            (<any>gridObj).filterModule.filterIconClickHandler(e);
            expect((<Column>gridObj.columns[1]).allowFiltering).toBeFalsy();
            (<HTMLInputElement>document.querySelector('.e-flmenu-valuediv input')).value = '7/4/1996';
            (<any>gridObj).filterModule.filterModule.filterBtnClick(gridObj.columns[2]);
            (<any>gridObj).filterModule.filterIconClickHandler(e);
            (<any>gridObj).filterModule.filterModule.clearBtnClick(gridObj.columns[2]);
        });


        it('Filter number column', (done: Function) => {
            actionComplete = (args?: Object): void => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            let e: any = {};
            let ele: Element = (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[2]);
            e = { target: ele };
            (<any>gridObj).filterModule.filterIconClickHandler(e);
            expect((<Column>gridObj.columns[1]).allowFiltering).toBeFalsy();
            (<HTMLInputElement>document.querySelector('.e-flmenu-valuediv input')).value = '32.38';
            (<any>gridObj).filterModule.filterModule.filterBtnClick(gridObj.columns[3]);
            (<any>gridObj).filterModule.filterIconClickHandler(e);
            (<any>gridObj).filterModule.filterModule.clearBtnClick(gridObj.columns[3]);
        });

        it('Filter string column', (done: Function) => {
            actionComplete = (args?: Object): void => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            let e: any = {};
            let ele: Element = (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[3]);
            e = { target: ele };
            (<any>gridObj).filterModule.filterIconClickHandler(e);
            expect((<Column>gridObj.columns[1]).allowFiltering).toBeFalsy();
            (<HTMLInputElement>document.querySelector('.e-flmenu-valuediv input')).value = 'reims';
            (<any>gridObj).filterModule.filterModule.filterBtnClick(gridObj.columns[4]);
            (<any>gridObj).filterModule.filterIconClickHandler(e);
            (<any>gridObj).filterModule.filterModule.clearBtnClick(gridObj.columns[4])
        });

        it('Filter boolean column', (done: Function) => {
            actionComplete = (args?: Object): void => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            let e: any = {};
            let ele: Element = (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[5]);
            e = { target: ele };
            (<any>gridObj).filterModule.filterIconClickHandler(e);
            expect((<Column>gridObj.columns[1]).allowFiltering).toBeFalsy();
            (<HTMLInputElement>document.querySelector('.e-flmenu-valuediv input')).value = 'true';
            (<any>gridObj).filterModule.filterModule.filterBtnClick(gridObj.columns[6]);
            (<any>gridObj).filterModule.filterIconClickHandler(e);
            (<any>gridObj).filterModule.filterModule.clearBtnClick(gridObj.columns[6])
        });
        afterAll(() => {
            remove(elem);
        });

    });

    // describe('grid content element testing', () => {
    //     let gridObj: Grid;
    //     let elem: HTMLElement = createElement('div', { id: 'Grid' });
    //     let actionComplete: () => void;
    //     beforeAll((done: Function) => {
    //         let dataBound: EmitType<Object> = () => { done(); };
    //         document.body.appendChild(elem);
    //         gridObj = new Grid(
    //             {
    //                 dataSource: filterData,
    //                 allowPaging: true,
    //                 allowFiltering: true,
    //                 filterSettings: {
    //                     type: 'menu',
    //                     operators: {
    //                         stringOperator: [
    //                             { value: 'startsWith', text: 'starts with' },
    //                             { value: 'endsWith', text: 'ends with' }, { value: 'contains', text: 'contains' },
    //                             { value: 'equal', text: 'equal' }],
    //                     }
    //                 },
    //                 columns: [
    //                     {
    //                         field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'right', filter: {
    //                             ui: {
    //                                 create: (args: { target: Element, column: Object }) => {
    //                                     let db: Object = new DataManager(filterData);
    //                                     let flValInput: HTMLElement = createElement('input', { className: 'e-flmenu-input' });
    //                                     args.target.appendChild(flValInput);
    //                                     this.dropInstance = new DropDownList({
    //                                         dataSource: new DataManager(filterData),
    //                                         fields: { text: 'OrderID', value: 'OrderID' },
    //                                         placeholder: 'Select a value',
    //                                         popupHeight: '200px'
    //                                     });
    //                                     this.dropInstance.appendTo(flValInput);
    //                                 },
    //                                 write: (args: {
    //                                     column: Object, target: Element, parent: any,
    //                                     filteredValue: number | string
    //                                 }) => {
    //                                     this.dropInstance.value = args.filteredValue;
    //                                     this.dropInstance.dataBind();
    //                                 },
    //                                 read: (args: { target: Element, column: any, operator: string, fltrObj: Filter }) => {
    //                                     args.fltrObj.filterByColumn(args.column.field, args.operator, this.dropInstance.value);

    //                                 }
    //                             }
    //                         }
    //                     },
    //                     { field: 'CustomerID', headerText: 'Customer Name', width: 150, allowFiltering: false },
    //                     { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'right' },
    //                     { field: 'Freight', width: 120, format: 'C2', textAlign: 'right', editType: 'numericedit' },
    //                     {
    //                         field: 'ShipCity', headerText: 'Ship City', width: 140
    //                     },
    //                     {
    //                         field: 'ShipCountry', headerText: 'Ship Country', filter: {
    //                             type: 'excel'
    //                         }, width: 150
    //                     },
    //                     {
    //                         field: 'Verified', headerText: 'Verified', width: 120, filter: {
    //                             type: 'menu'
    //                         }
    //                     }
    //                 ],
    //                 dataBound: dataBound,
    //                 actionComplete: actionComplete,
    //             });
    //         gridObj.appendTo('#Grid');
    //     });

    //     it('date ui testing', (done: Function) => {
    //         actionComplete = (args?: Object): void => {
    //             done();
    //         };
    //         gridObj.actionComplete = actionComplete;
    //         let e: any = {};
    //         let ele: Element = (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[1]);
    //         e = { target: ele };
    //         (<any>gridObj).filterModule.clickHandler(e);
    //         let dtEle: Element = document.querySelector('.e-date-icon');
    //         (<HTMLElement>dtEle).click();
    //         (<HTMLElement>document.querySelector('.e-day')).click();
    //         (<HTMLElement>document.body).click();
    //         (<any>gridObj).filterModule.clickHandler(e);
    //         (<HTMLInputElement>document.querySelector('.e-flmenu-valuediv input')).value = '7/4/1996';
    //         (<any>gridObj).filterModule.filterModule.filterBtnClick(gridObj.columns[2]);
    //         (<any>gridObj).filterModule.clickHandler(e);
    //         (<any>gridObj).filterModule.filterModule.clearBtnClick(gridObj.columns[3]);
    //         let ele1: Element = (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[1]);
    //         e = { target: ele1 };
    //         (<any>gridObj).filterModule.clickHandler(e);
    //         (<HTMLElement>document.body).click();
    //     });

    //     afterAll(() => {
    //         remove(elem);
    //     });

    // });

    // describe('grid content element testing', () => {
    //     let gridObj: Grid;
    //     let elem: HTMLElement = createElement('div', { id: 'Grid' });
    //     let actionComplete: () => void;
    //     beforeAll((done: Function) => {
    //         let dataBound: EmitType<Object> = () => { done(); };
    //         document.body.appendChild(elem);
    //         gridObj = new Grid(
    //             {
    //                 dataSource: new DataManager(filterData),
    //                 allowPaging: true,
    //                 allowFiltering: true,
    //                 filterSettings: {
    //                     type: 'menu',
    //                     operators: {
    //                         stringOperator: [
    //                             { value: 'startsWith', text: 'starts with' },
    //                             { value: 'endsWith', text: 'ends with' }, { value: 'contains', text: 'contains' },
    //                             { value: 'equal', text: 'equal' }],
    //                     }
    //                 },
    //                 columns: [
    //                     {
    //                         field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'right', filter: {
    //                             ui: {
    //                                 create: (args: { target: Element, column: Object }) => {
    //                                     let db: Object = new DataManager(filterData);
    //                                     let flValInput: HTMLElement = createElement('input', { className: 'e-flmenu-input' });
    //                                     args.target.appendChild(flValInput);
    //                                     this.dropInstance = new DropDownList({
    //                                         dataSource: new DataManager(filterData),
    //                                         fields: { text: 'OrderID', value: 'OrderID' },
    //                                         placeholder: 'Select a value',
    //                                         popupHeight: '200px'
    //                                     });
    //                                     this.dropInstance.appendTo(flValInput);
    //                                 },
    //                                 write: (args: {
    //                                     column: Object, target: Element, parent: any,
    //                                     filteredValue: number | string
    //                                 }) => {
    //                                     this.dropInstance.value = args.filteredValue;
    //                                     this.dropInstance.dataBind();
    //                                 },
    //                                 read: (args: { target: Element, column: any, operator: string, fltrObj: Filter }) => {
    //                                     args.fltrObj.filterByColumn(args.column.field, args.operator, this.dropInstance.value);

    //                                 }
    //                             }
    //                         }
    //                     },
    //                     { field: 'CustomerID', headerText: 'Customer Name', width: 150, allowFiltering: false },
    //                     { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'right' },
    //                     { field: 'Freight', width: 120, format: 'C2', textAlign: 'right', editType: 'numericedit' },
    //                     {
    //                         field: 'ShipCity', headerText: 'Ship City', width: 140
    //                     },
    //                     {
    //                         field: 'ShipCountry', headerText: 'Ship Country', filter: {
    //                             type: 'excel'
    //                         }, width: 150
    //                     },
    //                     {
    //                         field: 'Verified', headerText: 'Verified', width: 120, filter: {
    //                             type: 'menu'
    //                         }
    //                     }
    //                 ],
    //                 dataBound: dataBound,
    //                 actionComplete: actionComplete,
    //             });
    //         gridObj.appendTo('#Grid');
    //     });

    //     it('string boolean ui column', (done: Function) => {
    //         actionComplete = (args?: Object): void => {
    //             done();
    //         };
    //         gridObj.actionComplete = actionComplete;
    //         let e: any = {};
    //         let ele: Element = (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[5]);
    //         e = { target: ele };
    //         (<any>gridObj).filterModule.clickHandler(e);
    //         expect((<Column>gridObj.columns[1]).allowFiltering).toBeFalsy();
    //         (<HTMLInputElement>document.querySelector('.e-flmenu-valuediv input')).value = 'true';
    //         (<any>gridObj).filterModule.filterModule.filterBtnClick(gridObj.columns[6]);
    //         (<any>gridObj).filterModule.clickHandler(e);
    //         (<any>gridObj).filterModule.filterModule.clearBtnClick(gridObj.columns[6]);
    //         let ele1: Element = (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[3]);
    //         e = { target: ele1 };
    //         (<any>gridObj).filterModule.clickHandler(e);
    //         expect((<Column>gridObj.columns[1]).allowFiltering).toBeFalsy();
    //         (<HTMLInputElement>document.querySelector('.e-flmenu-valuediv input')).value = 'reims';
    //         (<any>gridObj).filterModule.filterModule.filterBtnClick(gridObj.columns[4]);
    //         (<any>gridObj).filterModule.clickHandler(e);
    //         (<any>gridObj).filterModule.filterModule.clearBtnClick(gridObj.columns[4])
    //     });

    //     afterAll(() => {
    //         remove(elem);
    //     });

    // });


    // describe('device testing', () => {
    //     let gridObj: Grid;
    //     let elem: HTMLElement = createElement('div', { id: 'Grid' });
    //     let actionComplete: () => void;
    //     beforeAll((done: Function) => {
    //         let dataBound: EmitType<Object> = () => { done(); };
    //         document.body.appendChild(elem);
    //         gridObj = new Grid(
    //             {
    //                 dataSource: new DataManager(filterData),
    //                 allowPaging: true,
    //                 allowFiltering: true,
    //                 filterSettings: {
    //                     type: 'menu',
    //                     operators: {
    //                         stringOperator: [
    //                             { value: 'startsWith', text: 'starts with' },
    //                             { value: 'endsWith', text: 'ends with' }, { value: 'contains', text: 'contains' },
    //                             { value: 'equal', text: 'equal' }],
    //                     }
    //                 },
    //                 columns: [
    //                     {
    //                         field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'right', filter: {
    //                             ui: {
    //                                 create: (args: { target: Element, column: Object }) => {
    //                                     let db: Object = new DataManager(filterData);
    //                                     let flValInput: HTMLElement = createElement('input', { className: 'e-flmenu-input' });
    //                                     args.target.appendChild(flValInput);
    //                                     this.dropInstance = new DropDownList({
    //                                         dataSource: new DataManager(filterData),
    //                                         fields: { text: 'OrderID', value: 'OrderID' },
    //                                         placeholder: 'Select a value',
    //                                         popupHeight: '200px'
    //                                     });
    //                                     this.dropInstance.appendTo(flValInput);
    //                                 },
    //                                 write: (args: {
    //                                     column: Object, target: Element, parent: any,
    //                                     filteredValue: number | string
    //                                 }) => {
    //                                     this.dropInstance.value = args.filteredValue;
    //                                     this.dropInstance.dataBind();
    //                                 },
    //                                 read: (args: { target: Element, column: any, operator: string, fltrObj: Filter }) => {
    //                                     args.fltrObj.filterByColumn(args.column.field, args.operator, this.dropInstance.value);

    //                                 }
    //                             }
    //                         }
    //                     },
    //                     { field: 'CustomerID', headerText: 'Customer Name', width: 150, allowFiltering: false },
    //                     { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'right' },
    //                     { field: 'Freight', width: 120, format: 'C2', textAlign: 'right', editType: 'numericedit' },
    //                     {
    //                         field: 'ShipCity', headerText: 'Ship City', width: 140
    //                     },
    //                     {
    //                         field: 'ShipCountry', headerText: 'Ship Country', filter: {
    //                             type: 'excel'
    //                         }, width: 150
    //                     },
    //                     {
    //                         field: 'Verified', headerText: 'Verified', width: 120, filter: {
    //                             type: 'menu'
    //                         }
    //                     }
    //                 ],
    //                 dataBound: dataBound,
    //                 actionComplete: actionComplete,
    //             });
    //         gridObj.appendTo('#Grid');
    //     });

    //     it('device testing', (done: Function) => {
    //         actionComplete = (args?: Object): void => {
    //             done();
    //         };
    //         gridObj.actionComplete = actionComplete;
    //         gridObj.element.classList.add('e-device');
    //         let e: any = {};
    //         let ele: Element = (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[5]);
    //         e = { target: ele };
    //         (<any>gridObj).filterModule.clickHandler(e);
    //         expect((<Column>gridObj.columns[1]).allowFiltering).toBeFalsy();
    //         (<HTMLInputElement>document.querySelector('.e-flmenu-valuediv input')).value = 'true';
    //         (<any>gridObj).filterModule.filterModule.filterBtnClick(gridObj.columns[6]);
    //         (<any>gridObj).filterModule.clickHandler(e);
    //         (<any>gridObj).filterModule.filterModule.clearBtnClick(gridObj.columns[6]);
    //     });

    //     afterAll(() => {
    //         remove(elem);
    //     });

    // });

    // describe('initial filter testing', () => {
    //     let gridObj: Grid;
    //     let elem: HTMLElement = createElement('div', { id: 'Grid' });
    //     let actionComplete: () => void;
    //     beforeAll((done: Function) => {
    //         let dataBound: EmitType<Object> = () => { done(); };
    //         document.body.appendChild(elem);
    //         gridObj = new Grid(
    //             {
    //                 dataSource: new DataManager(filterData),
    //                 allowPaging: true,
    //                 allowFiltering: true,
    //                 filterSettings: {
    //                     type: 'menu',
    //                     operators: {
    //                         stringOperator: [
    //                             { value: 'startsWith', text: 'starts with' },
    //                             { value: 'endsWith', text: 'ends with' }, { value: 'contains', text: 'contains' },
    //                             { value: 'equal', text: 'equal' }],
    //                     },
    //                     columns: [{ field: 'ShipCity', matchCase: false, operator: 'startswith', predicate: 'and', value: 'reims' },
    //                     { field: 'Verified', matchCase: false, operator: 'equal', predicate: 'and', value: 'true' }]
    //                 },
    //                 columns: [
    //                     {
    //                         field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'right', filter: {
    //                             ui: {
    //                                 create: (args: { target: Element, column: Object }) => {
    //                                     let db: Object = new DataManager(filterData);
    //                                     let flValInput: HTMLElement = createElement('input', { className: 'e-flmenu-input' });
    //                                     args.target.appendChild(flValInput);
    //                                     this.dropInstance = new DropDownList({
    //                                         dataSource: new DataManager(filterData),
    //                                         fields: { text: 'OrderID', value: 'OrderID' },
    //                                         placeholder: 'Select a value',
    //                                         popupHeight: '200px'
    //                                     });
    //                                     this.dropInstance.appendTo(flValInput);
    //                                 },
    //                                 write: (args: {
    //                                     column: Object, target: Element, parent: any,
    //                                     filteredValue: number | string
    //                                 }) => {
    //                                     this.dropInstance.value = args.filteredValue;
    //                                     this.dropInstance.dataBind();
    //                                 },
    //                                 read: (args: { target: Element, column: any, operator: string, fltrObj: Filter }) => {
    //                                     args.fltrObj.filterByColumn(args.column.field, args.operator, this.dropInstance.value);

    //                                 }
    //                             }
    //                         }
    //                     },
    //                     { field: 'CustomerID', headerText: 'Customer Name', width: 150, allowFiltering: false },
    //                     { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'right' },
    //                     { field: 'Freight', width: 120, format: 'C2', textAlign: 'right', editType: 'numericedit' },
    //                     {
    //                         field: 'ShipCity', headerText: 'Ship City', width: 140
    //                     },
    //                     {
    //                         field: 'ShipCountry', headerText: 'Ship Country', filter: {
    //                             type: 'excel'
    //                         }, width: 150
    //                     },
    //                     {
    //                         field: 'Verified', headerText: 'Verified', width: 120, filter: {
    //                             type: 'menu'
    //                         }
    //                     }
    //                 ],
    //                 dataBound: dataBound,
    //                 actionComplete: actionComplete,
    //             });
    //         gridObj.appendTo('#Grid');
    //     });

    //     it('initial filter column', (done: Function) => {
    //         actionComplete = (args?: Object): void => {
    //             done();
    //         };
    //         gridObj.actionComplete = actionComplete;
    //         let e: any = {};
    //         let ele: Element = (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[5]);
    //         e = { target: ele };
    //         (<any>gridObj).filterModule.clickHandler(e);
    //         (<any>gridObj).filterModule.filterModule.clearBtnClick(gridObj.columns[6]);
    //         let ele1: Element = (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[3]);
    //         e = { target: ele1 };
    //         (<any>gridObj).filterModule.clickHandler(e);
    //         (<any>gridObj).filterModule.filterModule.filterBtnClick(gridObj.columns[4]);
    //         (<any>gridObj).filterModule.clickHandler(e);
    //         (<any>gridObj).filterModule.filterModule.clearBtnClick(gridObj.columns[4]);
    //         (<any>gridObj).filterModule.clickHandler(e);
    //         (<HTMLInputElement>document.querySelector('.e-flmenu-valuediv input')).value = '';
    //         (<any>gridObj).filterModule.filterModule.filterBtnClick(gridObj.columns[4]);
    //         (<any>gridObj).filterModule.clickHandler(e);
    //         (<any>gridObj).filterModule.filterModule.clearBtnClick(gridObj.columns[4]);
    //     });

    //     afterAll(() => {
    //         remove(elem);
    //     });

    // });
});