/**
 * Grid Resize spec document
 */
import { Browser, EventHandler, EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { SortDirection } from '../../../src/grid/base/enum';
import { DataManager } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { Column } from '../../../src/grid/models/column';
import { Sort } from '../../../src/grid/actions/sort';
import { Filter } from '../../../src/grid/actions/filter';
import { Group } from '../../../src/grid/actions/group';
import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Resize } from '../../../src/grid/actions/resize';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
Grid.Inject(Sort, Page, Filter, Reorder, Group,Resize,Selection);

describe('Resize module', () => {
 describe('Resize functionalities for columns', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let headers: any;
        let columns: Column[];
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    allowReordering:true,
                    columns: [{ field: 'OrderID',headerText: 'OrderID',width:150 }, { field: 'CustomerID', headerText: 'CustomerID' },
                     { field: 'EmployeeID', headerText: 'EmployeeID', width:150  }, { field: 'Freight', headerText: 'Freight',width:200  },
                    { field: 'ShipCity', headerText: 'ShipCity', width:180  }],
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
    });
    it('Resize for particular column when width is specified',()=>{
            gridObj.autoFitColumns('OrderID');
            headers = gridObj.getColumns()[0] as Column;
            expect(headers.width).not.toEqual('150px')
    });
    it('Resize OrderID except CustomerID all fields have width',()=>{
            gridObj.autoFitColumns('OrderID');
            headers =(<HTMLElement> gridObj.getHeaderTable()).style.width
            expect(headers).toBeFalsy();
    });
    it('Resize CustomerID except CustomerID all fields have width',()=>{
            gridObj.autoFitColumns('CustomerID');
            headers =(<HTMLElement> gridObj.getHeaderTable()).style.width
            expect(headers).toBeTruthy();
    });
    it('Auto fit with Reorder',()=>{
            gridObj.reorderColumns('EmployeeID', 'Freight');
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[3].querySelector('.e-headercelldiv').textContent).toEqual('EmployeeID');
            headers = gridObj.getColumns()[3] as Column;
            expect(headers.width).toEqual(150)
    });
      afterAll(() => {
            remove(elem);
});
});
 describe('Resize functionalities for all columns', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let headers: any;
        let columns: Column[];
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID',headerText: 'OrderID',width:150 }, { field: 'CustomerID', headerText: 'CustomerID' },
                     { field: 'EmployeeID', headerText: 'EmployeeID' },{ field: 'Freight', headerText: 'Freight',width:200  },
                     { field: 'ShipCity', headerText: 'ShipCity' }],
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
    });
     it('More than one columns to be Autofit',()=>{
           gridObj.autoFitColumns(['OrderID','CustomerID','EmployeeID']);
            headers = gridObj.getColumns()[0] as Column;
            expect(headers.width).toBeTruthy();
            headers = gridObj.getColumns()[1] as Column;
            expect(headers.width).toBeTruthy();
            headers = gridObj.getColumns()[2] as Column;
            expect(headers.width).toBeTruthy();
            headers =(<HTMLElement> gridObj.getHeaderTable()).style.width
            expect(headers).toBeFalsy();
    });
    it('Resize all columns',()=>{
            gridObj.autoFitColumns('');
            headers = gridObj.getColumns()[0] as Column;
            expect(headers.width).toBeTruthy();
            headers = gridObj.getColumns()[1] as Column;
            expect(headers.width).toBeTruthy();
            headers = gridObj.getColumns()[2] as Column;
            expect(headers.width).toBeTruthy();
            headers = gridObj.getColumns()[3] as Column;
            expect(headers.width).toBeTruthy();
            headers = gridObj.getColumns()[4] as Column;
            expect(headers.width).toBeTruthy();
            headers =(<HTMLElement> gridObj.getHeaderTable()).style.width
            expect(headers).toBeTruthy();
    });
      afterAll(() => {
            remove(elem);
});
});
describe('Resize functionalities for Hidden columns', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let headers: any;
        let columns: Column[];
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    allowReordering:true,
                    allowGrouping:true,
                    columns: [{ field: 'OrderID',headerText: 'OrderID',width:150 }, { field: 'CustomerID', headerText: 'CustomerID' },
                     { field: 'EmployeeID', headerText: 'EmployeeID',  }, { field: 'Freight', headerText: 'Freight',width:200  },
                    { field: 'ShipCity', headerText: 'ShipCity', width:180, visible:false  }],
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
    });
    it('Resize for Hidden column',()=>{
            gridObj.autoFitColumns('ShipCity');
            headers = (<HTMLElement> gridObj.getHeaderTable()).style.width;
            expect(headers).toBeFalsy();
    });
    it('grouping with resize all column ',()=>{
            gridObj.groupModule.groupColumn('EmployeeID');
            gridObj.autoFitColumns('');
            headers = (<HTMLElement> gridObj.getHeaderTable()).style.width;
            expect(headers).toBeFalsy();
    });
      afterAll(() => {
            remove(elem);
});
});
});
