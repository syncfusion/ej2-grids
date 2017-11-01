/**
 * Grid Inline edit spec document
 */
import { EventHandler, ChildProperty, EmitType } from '@syncfusion/ej2-base';
import { extend, getValue } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Edit } from '../../../src/grid/actions/edit';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { DetailRow } from '../../../src/grid/actions/detail-row';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Page } from '../../../src/grid/actions/page';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { CellType } from '../../../src/grid/base/enum';
import { ValueFormatter } from '../../../src/grid/services/value-formatter';
import { Column } from '../../../src/grid/models/column';
import { Selection } from '../../../src/grid/actions/selection';
import { NumericEditCell } from '../../../src/grid/renderer/numeric-edit-cell';
import { DropDownEditCell } from '../../../src/grid/renderer/dropdown-edit-cell';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Filter, Page, Selection, Group, Edit, Sort, Reorder, Toolbar, DetailRow);

describe('Editing module', () => {

    let dataSource: Function = (): Object[] => {
        let datasrc: Object[] = [];
        for (let i = 0; i < 11; i++) {
            datasrc.push(extend({}, data[i]));
        }
        return datasrc;
    };


    describe('Inline editing render', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('Edit start - args.cancel', (done: Function) => {
            actionBegin = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    args.cancel = true;
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };
            gridObj.actionBegin = actionBegin;
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });


        it('Edit start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    let cells = gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
                    expect(cells.length).toBe(gridObj.getVisibleColumns().length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
                    // allow Editing false
                    expect(cells[2].querySelectorAll('input.e-disabled').length).toBe(1);
                    // isIdentity check
                    expect(cells[6].querySelectorAll('input.e-disabled').length).toBe(1);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'CustomerID');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(2);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('Edit complete - args.cancel', (done: Function) => {
            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    args.cancel = true;
                    done();
                }
            };
            gridObj.actionBegin = actionBegin;
            (gridObj.editModule as any).editModule.endEdit();
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);

                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('Add start - args.cancel', (done: Function) => {
            //form destroy check for last action
            expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
            actionBegin = (args?: any): void => {
                if (args.requestType === 'add') {
                    args.cancel = true;
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };
            gridObj.actionBegin = actionBegin;
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    let cells = gridObj.element.querySelector('.e-addedrow').querySelectorAll('.e-rowcell');
                    expect(cells.length).toBe(gridObj.getVisibleColumns().length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(0);
                    // allow Editing false
                    expect(cells[2].querySelectorAll('input.e-disabled').length).toBe(1);
                    // isIdentity check
                    expect(cells[6].querySelectorAll('input.e-disabled').length).toBe(0);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'OrderID');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check for last action
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(2);
            //edited class check for last action
            expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(0);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add complete - args.cancel', (done: Function) => {
            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    args.cancel = true;
                    done();
                }
            };
            gridObj.actionBegin = actionBegin;
            (gridObj.element.querySelector('#GridOrderID') as any).value = 10247;
            (gridObj.element.querySelector('#GridCustomerID') as any).value = 'updated';
            (gridObj.editModule as any).editModule.endEdit();
        });

        it('Add complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);

                    //form destroy check
                    expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).OrderID).toBe(10247);
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(12);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(12);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };

            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });


        it('Delete action', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(2);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'delete') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check for last action
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(2);
            //added class check for last action
            expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(0);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });

        it('Edit-cancel start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(2);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('Edit-cancel complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);

                    //form destroy check
                    expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).CustomerID).not.toBe('updatednew');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            (gridObj.element.querySelector('#GridCustomerID') as any).value = 'updatednew';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_cancel' } });
        });

        it('Add-cancel start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    expect(gridObj.isEdit).toBeTruthy();
                    //for coverage
                    (gridObj.editModule as any).editModule.addRecord();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(2);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add-cancel complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);

                    //form destroy check
                    expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).OrderID).not.toBe(10247);
                    expect((gridObj.currentViewData[0] as any).CustomerID).not.toBe('updatednew');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };

            actionBegin = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            (gridObj.element.querySelector('#GridOrderID') as any).value = 10247;
            (gridObj.element.querySelector('#GridCustomerID') as any).value = 'updatednew';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_cancel' } });
        });

        it('toolbar status check', () => {
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(2);
            //for coverage
            (gridObj.element.querySelector('.e-rowcell') as any).click();
        });

        it('dbl edit start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = null;
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].firstElementChild });
        });

        it('click another row edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.currentViewData[1] as any).CustomerID).toBe('updated');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            (gridObj.element.querySelectorAll('.e-row')[2] as any).click();
        });

        it('Add complete method with data testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(12);
                //record count check
                expect(gridObj.currentViewData.length).toBe(12);
                done();
            };

            gridObj.actionComplete = actionComplete;
            (<any>gridObj.editModule).editModule.addRecord({ OrderID: 10246, CustomerID: 'updated' });
        });

        it('dbl edit false testing', () => {
            gridObj.editSettings.allowEditOnDblClick = false;
            gridObj.dataBind();
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].firstElementChild });
            expect(gridObj.isEdit).toBeFalsy();
        });

        it('end edit method call after editing completed', () => {
            (gridObj.editModule as any).editModule.endEdit();
            expect(gridObj.isEdit).toBeFalsy();
        });


        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            gridObj.destroy();
            elem.remove();
            if (document.getElementById('Grid')) {
                document.getElementById('Grid').remove();
            }
        });
    });


    // describe('Keyboard shortcuts', () => {
    //     let gridObj: Grid;
    //     let elem: HTMLElement = createElement('div', { id: 'Grid' });
    //     let preventDefault: Function = new Function();
    //     let actionBegin: () => void;
    //     let actionComplete: () => void;
    //     beforeAll((done: Function) => {
    //         let dataBound: EmitType<Object> = () => { done(); };
    //         document.body.appendChild(elem);
    //         gridObj = new Grid(
    //             {
    //                 dataSource: dataSource(),
    //                 allowFiltering: true,
    //                 allowGrouping: false,
    //                 editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
    //                 toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
    //                 allowPaging: false,
    //                 columns: [
    //                     { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
    //                     { field: 'CustomerID', type: 'string' },
    //                     { field: 'EmployeeID', type: 'number', allowEditing: false },
    //                     { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
    //                     { field: 'ShipCity' },
    //                     { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
    //                     { field: 'ShipName', isIdentity: true },
    //                     { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
    //                     { field: 'ShipRegion', type: 'string' },
    //                     { field: 'ShipAddress', allowFiltering: true, visible: false },
    //                     { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
    //                 ],
    //                 actionBegin: actionBegin,
    //                 actionComplete: actionComplete,
    //                 dataBound: dataBound
    //             });
    //         gridObj.appendTo('#Grid');
    //     });

    //     it('Edit start', (done: Function) => {
    //         actionComplete = (args?: any): void => {
    //             if (args.requestType === 'beginEdit') {
    //                 expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
    //                 expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
    //                 done();
    //             }
    //         };
    //         gridObj.actionComplete = actionComplete;
    //         //toolbar status check
    //         expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(2);
    //         gridObj.clearSelection();
    //         gridObj.selectRow(0, true);
    //         gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
    //     });

    //     it('Edit complete', (done: Function) => {
    //         actionComplete = (args?: any): void => {
    //             if (args.requestType === 'save') {
    //                 expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
    //                 done();
    //             }
    //         };
    //         gridObj.actionComplete = actionComplete;
    //         (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
    //         gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
    //     });

    //     it('Add start', (done: Function) => {
    //         actionComplete = (args?: any): void => {
    //             if (args.requestType === 'add') {
    //                 expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
    //                 expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
    //                 done();
    //             }
    //         };
    //         gridObj.actionComplete = actionComplete;
    //         gridObj.clearSelection();
    //         gridObj.selectRow(0, true);
    //         gridObj.keyboardModule.keyAction({ action: 'insert', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
    //     });

    //     it('Add complete', (done: Function) => {
    //         actionComplete = (args?: any): void => {
    //             if (args.requestType === 'save') {
    //                 expect((gridObj.currentViewData[0] as any).OrderID).toBe(10247);
    //                 expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
    //                 done();
    //             }
    //         };
    //         gridObj.actionComplete = actionComplete;
    //         (gridObj.element.querySelector('#GridOrderID') as any).value = 10247;
    //         (gridObj.element.querySelector('#GridCustomerID') as any).value = 'updated';
    //         gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
    //     });


    //     it('Delete action', (done: Function) => {
    //         actionComplete = (args?: any): void => {
    //             if (args.requestType === 'delete') {
    //                 //row count check
    //                 expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
    //                 //record count check
    //                 expect(gridObj.currentViewData.length).toBe(11);
    //                 done();
    //             }
    //         };
    //         gridObj.actionComplete = actionComplete;
    //         gridObj.clearSelection();
    //         gridObj.selectRow(0, true);
    //         gridObj.keyboardModule.keyAction({ action: 'delete', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
    //     });

    //     it('Edit-cancel start', (done: Function) => {
    //         actionComplete = (args?: any): void => {
    //             if (args.requestType === 'beginEdit') {
    //                 expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
    //                 done();
    //             }
    //         };
    //         gridObj.actionComplete = actionComplete;
    //         gridObj.clearSelection();
    //         gridObj.selectRow(0, true);
    //         gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
    //     });

    //     it('Edit-cancel complete', (done: Function) => {
    //         actionComplete = (args?: any): void => {
    //             if (args.requestType === 'cancel') {
    //                 expect((gridObj.currentViewData[0] as any).CustomerID).not.toBe('updatednew');
    //                 done();
    //             }
    //         };
    //         gridObj.actionComplete = actionComplete;
    //         (gridObj.element.querySelector('#GridCustomerID') as any).value = 'updatednew';
    //         gridObj.keyboardModule.keyAction({ action: 'escape', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
    //     });

    //     it('For coverage', () => {
    //         let promise = {
    //             promise: {
    //                 then: (args: any) => {
    //                     args.call(this, { result: [{}, {}] });
    //                     return {
    //                         catch: (args: any) => {
    //                             args.call(this, { result: [{}, {}] });
    //                         }
    //                     }
    //                 }
    //             }
    //         };
    //         (gridObj.editModule as any).getBatchChanges();
    //         (gridObj.editModule as any).editModule.refreshRow = () => { };
    //         gridObj.trigger = () => { };
    //         gridObj.notify = () => { };
    //         (gridObj.editModule as any).editModule.editHandler(promise);
    //         (gridObj.editModule as any).tapEvent({});
    //         (gridObj.editModule as any).getUserAgent();
    //         (gridObj.editModule as any).timeoutHandler();
    //         (gridObj.editModule as any).getUserAgent = () => { return true; };
    //         (gridObj.editModule as any).tapEvent({});
    //     });


    //     it('For coverage', () => {
    //         (gridObj.editModule as any).timeoutHandler();
    //         (gridObj.editModule as any).tapped = true;
    //         (gridObj.editModule as any).tapEvent({});
    //         (gridObj.editModule as any).valErrorPlacement();
    //         (gridObj.editModule as any).getValueFromType({ type: 'number' }, undefined);
    //         (gridObj.editModule as any).getValueFromType({ type: 'boolean', editType: 'booleanedit1' }, false);
    //         (gridObj.editModule as any).getValueFromType({ type: 'date', editType: 'datepicker' }, false);
    //         (gridObj.editModule as any).editFormValidate();
    //     });

    //     afterAll(() => {
    //         gridObj.notify('tooltip-destroy', {});
    //         gridObj.isDestroyed = true;
    //         (gridObj.editModule as any).editModule.removeEventListener();
    //         gridObj.editModule.removeEventListener();
    //         gridObj.isDestroyed = false;
    //         gridObj.editModule.removeEventListener();
    //         elem.remove();
    //         if (document.getElementById('Grid')) {
    //             document.getElementById('Grid').remove();
    //         }
    //     });
    // });

    describe('Disable editing, edit mode change and delete alert', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let preventDefault: Function = new Function();
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', textAlign: 'right' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', textAlign: 'center' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', textAlign: 'left' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('editing disable testing', () => {
            gridObj.editSettings.allowAdding = false;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.editSettings.allowDeleting = false;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
            gridObj.editSettings.allowEditing = false;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(5);
            expect(gridObj.editModule).toBeUndefined();
            gridObj.editSettings.allowEditing = true;
            gridObj.dataBind();
            expect(gridObj.editModule).not.toBeUndefined();
        });

        it('adding disable testing', () => {
            gridObj.editModule.addRecord();
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
        });

        it('deleting disable testing', () => {
            gridObj.clearSelection();
            gridObj.selectRow(3, true);
            gridObj.editModule.deleteRecord();
            expect((gridObj.editModule as any).editModule.editRowIndex).not.toBe(3);
            gridObj.editSettings.showDeleteConfirmDialog = true;
            gridObj.editSettings.allowDeleting = true;
            gridObj.dataBind();
        });

        it('deleting - no record alert', () => {
            gridObj.clearSelection();
            gridObj.deleteRecord();
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditAlert').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditAlert').querySelector('button').click();
        });

        it('deleting - delete confirm - cancel', () => {
            gridObj.clearSelection();
            gridObj.selectRow(3, true);
            gridObj.deleteRecord();
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('deleting - delete confirm - ok', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    done();
                }
            };
            gridObj.clearSelection();
            gridObj.selectRow(3, true);
            gridObj.actionComplete = actionComplete;
            gridObj.deleteRecord();
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
            gridObj.editSettings.allowAdding = true;
            gridObj.dataBind();
            gridObj.editSettings.allowEditing = true;
            gridObj.dataBind();
        });

        it('edit mode change', () => {
            gridObj.editSettings.mode = 'batch';
            gridObj.dataBind();
            expect((gridObj.editModule as any).editModule.saveCell).not.toBeUndefined();
            gridObj.editSettings.mode = 'dialog';
            gridObj.dataBind();
            gridObj.editSettings.mode = 'inline';
            gridObj.dataBind();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            elem.remove();
            if (document.getElementById('Grid')) {
                document.getElementById('Grid').remove();
            }
        });
    });


    describe('Group, and text align', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let preventDefault: Function = new Function();
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', textAlign: 'right' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', textAlign: 'center' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', textAlign: 'left' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('text align check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    let row: Element = gridObj.element.querySelectorAll('.e-editedrow')[0];
                    expect((row.querySelector('#' + gridObj.element.id + 'CustomerID') as any).style.textAlign).toBe('right');
                    expect((row.querySelector('#' + gridObj.element.id + 'ShipCity') as any).style.textAlign).toBe('center');
                    expect((row.querySelector('#' + gridObj.element.id + 'ShipRegion') as any).style.textAlign).toBe('left');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('group column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ShipCity');
        });

        it('group cell indent check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-indentcell').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.getCurrentViewRecords()[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('ungroup column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ShipCity');
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            elem.remove();
            if (document.getElementById('Grid')) {
                document.getElementById('Grid').remove();
            }
        });
    });

    describe('detail row editing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let preventDefault: Function = new Function();
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    detailTemplate: '<div></div>',
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', textAlign: 'right' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', textAlign: 'center' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', textAlign: 'left' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('detail row edit check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-detailrowcollapse').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.getCurrentViewRecords()[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            elem.remove();
            if (document.getElementById('Grid')) {
                document.getElementById('Grid').remove();
            }
        });
    });

    describe('cell edit template', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let preventDefault: Function = new Function();
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            let datePickerObj: DatePicker;
            gridObj = new Grid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', textAlign: 'right' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        {
                            field: 'ShipCity', textAlign: 'center', edit: {
                                create: () => {
                                    return '<input>';
                                }
                            }
                        },
                        { field: 'Verified', type: 'boolean' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        {
                            field: 'ShipRegion', type: 'string', textAlign: 'left', edit: {
                                create: () => {
                                    elem = document.createElement('div').appendChild(document.createElement('input'));
                                    return elem;
                                }
                            }
                        },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        {
                            field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', edit: {
                                create: () => {
                                    elem = document.createElement('input');
                                    return elem;
                                },
                                read: () => {
                                    return datePickerObj.value;
                                },
                                destroy: () => {
                                    datePickerObj.destroy();
                                },
                                write: (args: any) => {
                                    datePickerObj = new DatePicker({
                                        value: new Date(args.rowData[args.column.field]),
                                        floatLabelType: 'Never'
                                    });
                                    datePickerObj.appendTo(elem);
                                }
                            }
                        }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('cell template edit check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.getCurrentViewRecords()[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            elem.remove();
            if (document.getElementById('Grid')) {
                document.getElementById('Grid').remove();
            }
        });
    });


    describe('validation testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let preventDefault: Function = new Function();
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', textAlign: 'right', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', textAlign: 'center' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', textAlign: 'left' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('edit row check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('Edit with invalid data', () => {
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = '';
            expect(gridObj.editModule.editFormValidate()).toBeFalsy();
            expect(document.querySelectorAll('.e-griderror').length).toBeGreaterThan(0);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.getCurrentViewRecords()[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('Add start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add with invalid data', () => {
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
            expect(document.querySelectorAll('.e-griderror').length).toBeGreaterThan(0);
        });

        it('Add complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(12);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(12);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#GridOrderID') as any).value = 10247;
            (gridObj.element.querySelector('#GridCustomerID') as any).value = 'updated';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('for coverage', () => {
            (gridObj.renderModule.data.dataManager as any).remove=()=>{};
            (gridObj.renderModule.data.dataManager as any).insert=()=>{};
            (gridObj.renderModule.data.dataManager as any).executeQuery=()=>{};
            (gridObj.renderModule.data.dataManager as any).ready=false;
            (gridObj.renderModule.data as any).getData();
            (gridObj.renderModule.data as any).getData({data:[{}], foreignKeyData :'df', requestType:''});
            (gridObj.renderModule.data as any).getData({data:[{}], foreignKeyData :'', requestType:'delete'});
            (gridObj.renderModule.data as any).getData({data:[{}], foreignKeyData :'', requestType:'save'});
            
        });

        afterAll((done) => {
            gridObj.notify('tooltip-destroy', {});
            elem.remove();
            if (document.getElementById('Grid')) {
                document.getElementById('Grid').remove();
            }
            setTimeout(function () {
                done();
            }, 1000);
    
        });
    });


});
