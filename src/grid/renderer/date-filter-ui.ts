import { IGrid, EJ2Intance, IFilterMUI } from '../base/interface';
import { Column } from '../models/column';
import { FilterSettings } from '../base/grid';
import { PredicateModel } from '../base/grid-model';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { createElement } from '@syncfusion/ej2-base';
import { Internationalization } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../services/service-locator';
import { Filter } from '../actions/filter';
import { FlMenuOptrUI } from './filter-menu-operator';
import { L10n, } from '@syncfusion/ej2-base';
/**
 * `datefilterui` render date column.
 * @hidden
 */

export class DateFilterUI implements IFilterMUI {

    private parent: IGrid;
    protected locator: ServiceLocator;
    private inputElem: HTMLElement;
    private value: string;
    private datePickerObj: DatePicker;
    private fltrSettings: FilterSettings;

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, filterSettings?: FilterSettings) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.fltrSettings = filterSettings;
    }

    public create(args: { column: Column, target: HTMLElement, getOptrInstance: FlMenuOptrUI, localizeText: L10n }): void {
        let intl: Internationalization = new Internationalization();
        let colFormat: string = args.column.format as string;
        let format: string = intl.getDatePattern({ type: 'date', skeleton: colFormat }, false);

        this.inputElem = createElement('input', { className: 'e-flmenu-input', id: 'dateui-' + args.column.uid });
        args.target.appendChild(this.inputElem);
        this.datePickerObj = new DatePicker({
            format: format,
            cssClass: 'e-popup-flmenu',
            placeholder: args.localizeText.getConstant('ChooseDate'),
            width: '100%',
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
        });
        this.datePickerObj.appendTo(this.inputElem);
    }

    public write(args: { column: Column, target: Element, parent: IGrid, filteredValue: number | string | Date | boolean }): void {
        let columns: PredicateModel[] = this.fltrSettings.columns;
        let dateuiObj: DatePicker = (<EJ2Intance>document.querySelector('#dateui-' + args.column.uid)).ej2_instances[0];
        dateuiObj.value = args.filteredValue as Date;
    }

    public read(element: Element, column: Column, filterOptr: string, filterObj: Filter): void {
        let dateuiObj: DatePicker = (<EJ2Intance>document.querySelector('#dateui-' + column.uid)).ej2_instances[0];
        let filterValue: Date = dateuiObj.value;
        filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', true);
    }
}