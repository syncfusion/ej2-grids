import { createElement, remove } from '@syncfusion/ej2-base';
import { Pager } from './pager';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';

/**
 * IPager interface
 * @hidden
 */
export interface IPager {
    newProp: {
        value: number | string | boolean
    };
}
/**
 * `PagerDropDown` module handles selected pageSize from DropDownList. 
 */
export class PagerDropDown {
    //Internal variables    
    private pagerCons: HTMLElement;
    private dropDownListObject: DropDownList;
    private pagerDropDownDiv: HTMLElement;
    //Module declarations
    private pagerModule: Pager;
    /**
     * Constructor for pager module
     * @hidden
     */
    constructor(pagerModule?: Pager) {
        this.pagerModule = pagerModule;
    }

    /**
     * For internal use only - Get the module name. 
     * @private
     * @hidden
     */
    protected getModuleName(): string {
        return 'pagerdropdown';
    }

    /**
     * The function is used to render pager dropdown
     * @hidden
     */
    public render(): void {
        let pagerObj: Pager = this.pagerModule;
        this.pagerDropDownDiv = createElement('div', { className: 'e-pagesizes' });
        let dropDownDiv: Element = createElement('div', { className: 'e-pagerdropdown' });
        let defaultTextDiv: Element = createElement('div', { className: 'e-pagerconstant' });
        let input: HTMLElement = createElement('input', { attrs: { type: 'text', tabindex: '1' } });
        this.pagerCons = createElement('span', { className: 'e-constant', innerHTML: this.pagerModule.getLocalizedLabel('pagerDropDown') });
        dropDownDiv.appendChild(input);
        defaultTextDiv.appendChild(this.pagerCons);
        this.pagerDropDownDiv.appendChild(dropDownDiv);
        this.pagerDropDownDiv.appendChild(defaultTextDiv);
        this.pagerModule.element.appendChild(this.pagerDropDownDiv);
        let pageSizesModule: boolean | (number | string)[] = this.pagerModule.pageSizes;
        let pageSizesArray: string[] = ((<string[]>pageSizesModule).length ? this.convertValue(pageSizesModule as string[]) :
            ['5', '10', '12', '20', 'All']) as string[];
        let defaultValue: Number | String = (pageSizesArray).indexOf(this.pagerModule.pageSize.toString()) > -1 ? this.pagerModule.pageSize
            : (pageSizesArray[0] === 'All' ? this.pagerModule.totalRecordsCount : parseInt(pageSizesArray[0], 10));
        this.dropDownListObject = new DropDownList({
            dataSource: pageSizesArray,
            value: defaultValue.toString() as string,
            change: this.onChange.bind(this)
        });
        this.dropDownListObject.appendTo(input);
        pagerObj.pageSize = defaultValue as number;
        pagerObj.dataBind();
        pagerObj.trigger('dropDownChanged', { pageSize: defaultValue });
        this.addEventListener();
    }
    /**
     * For internal use only - Get the pagesize. 
     * @private
     * @hidden
     */
    private onChange(e: ChangeEventArgs): void {
        if (this.dropDownListObject.value === 'All') {
            this.pagerModule.pageSize = this.pagerModule.totalRecordsCount;
            this.pagerCons.innerHTML = this.pagerModule.getLocalizedLabel('pagerAllDropDown');
            e.value = this.pagerModule.pageSize;
        } else {
            this.pagerModule.pageSize = parseInt(this.dropDownListObject.value as string, 10);
            if (this.pagerCons.innerHTML !== this.pagerModule.getLocalizedLabel('pagerDropDown')) {
                this.pagerCons.innerHTML = this.pagerModule.getLocalizedLabel('pagerDropDown');
            }
        }
        this.pagerModule.dataBind();
        this.pagerModule.trigger('dropDownChanged', { pageSize: this.dropDownListObject.value });
    }

    private beforeValueChange(prop: IPager): void {
        if (typeof prop.newProp.value === 'number') {
            let val: string = prop.newProp.value.toString();
            prop.newProp.value = val;
        }
    }
    private convertValue(pageSizeValue: (number | string)[]): (number | string)[] {
        let item: (number | string)[] = pageSizeValue;
        for (let i: number = 0; i < item.length; i++) {
            item[i] = typeof item[i] === 'number' ? item[i].toString() : item[i];
        }
        return item as string[];
    }

    public setDropDownValue(prop: string, value: string | number | Object | boolean): void {
        if (this.dropDownListObject) {
            this.dropDownListObject[prop] = value;
        }
    }
    public addEventListener(): void {
        this.dropDownListObject.on('beforeValueChange', this.beforeValueChange, this);
    }
    public removeEventListener(): void {
        this.dropDownListObject.off('beforeValueChange', this.beforeValueChange);
    }

    /**
     * To destroy the Pagerdropdown
     * @method destroy
     * @return {void} 
     * @hidden 
     */
    public destroy(args?: { requestType: string }): void {
        if (this.dropDownListObject && !this.dropDownListObject.isDestroyed) {
            this.removeEventListener();
            this.dropDownListObject.destroy();
            remove(this.pagerDropDownDiv);
        }
    }
}