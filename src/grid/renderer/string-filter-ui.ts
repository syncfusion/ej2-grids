import { IGrid, EJ2Intance, IFilterMUI } from '../base/interface';
import { Column } from '../models/column';
import { L10n, } from '@syncfusion/ej2-base';
import { FilterSettings } from '../base/grid';
import { PredicateModel } from '../base/grid-model';
import { AutoComplete } from '@syncfusion/ej2-dropdowns';
import { DataManager } from '@syncfusion/ej2-data';
import { createElement } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../services/service-locator';
import { Filter } from '../actions/filter';
import { FlMenuOptrUI } from './filter-menu-operator';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import { getZIndexCalcualtion } from '../base/util';

/**
 * `string filterui` render string column.
 * @hidden
 */

export class StringFilterUI implements IFilterMUI {

    private parent: IGrid;
    protected serLocator: ServiceLocator;
    private instance: HTMLElement;
    private value: string;
    public actObj: AutoComplete;
    private filterSettings: FilterSettings;
    private filter: Filter;
    private dialogObj: Dialog;
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, filterSettings?: FilterSettings) {
        this.parent = parent;
        this.serLocator = serviceLocator;
        this.filterSettings = filterSettings;
    }
    public create(args: {
        column: Column, target: HTMLElement,
        getOptrInstance: FlMenuOptrUI, localizeText: L10n, dialogObj: Dialog
    }): void {
        let data: DataManager | Object[];
        let floptr: 'Contains' | 'StartsWith' | 'EndsWith';
        this.instance = createElement('input', { className: 'e-flmenu-input', id: 'strui-' + args.column.uid });
        args.target.appendChild(this.instance);
        this.dialogObj = args.dialogObj;
        this.actObj = new AutoComplete({
            dataSource: this.parent.dataSource instanceof DataManager ?
                this.parent.dataSource : new DataManager(this.parent.dataSource),
            fields: { value: args.column.field },
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            sortOrder: 'Ascending',
            open: this.openPopup.bind(this),
            cssClass: 'e-popup-flmenu',
            focus: () => {
                this.actObj.filterType = args.getOptrInstance.getFlOperator() as 'StartsWith' | 'Contains' | 'EndsWith';
            },
            autofill: true,
            placeholder: args.localizeText.getConstant('EnterValue'),
            actionComplete: (e: { result: { [key: string]: Object; }[] }) => {
                e.result = e.result.filter((obj: { [key: string]: Object; }, index: number, arr: { [key: string]: Object; }[]) => {
                    return arr.map((mapObj: Object) => {
                        return mapObj[this.actObj.fields.value];
                    }).indexOf(obj[this.actObj.fields.value]) === index;
                });
            }
        });
        this.actObj.appendTo(this.instance);
    }

    public write(args: { column: Column, target: Element, parent: IGrid, filteredValue: number | string | Date | boolean }): void {
        let columns: PredicateModel[] = this.filterSettings.columns;
        if (args.filteredValue !== '') {
            let struiObj: AutoComplete = (<EJ2Intance>document.querySelector('#strui-' + args.column.uid)).ej2_instances[0];
            struiObj.value = args.filteredValue as string;
        }
    }

    public read(element: Element, column: Column, filterOptr: string, filterObj: Filter): void {
        let actuiObj: AutoComplete = (<EJ2Intance>document.querySelector('#strui-' + column.uid)).ej2_instances[0];
        let filterValue: string | number = actuiObj.value;
        filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', false);
    }

    private openPopup(args: { popup: Popup }): void {
        getZIndexCalcualtion(args, this.dialogObj);
    }

}