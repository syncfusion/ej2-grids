import { createElement, remove } from '@syncfusion/ej2-base';
import { Pager } from './pager';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
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
        let pageSizesModule: boolean | number[] = this.pagerModule.pageSizes;
        let pageSizesArray: number[] = ((<number[]>pageSizesModule).length ? pageSizesModule : [5, 10, 12, 20]) as number[];
        let defaultValue: Number = (pageSizesArray).indexOf(this.pagerModule.pageSize) > -1 ? this.pagerModule.pageSize : pageSizesArray[0];
        this.dropDownListObject = new DropDownList({
            dataSource: pageSizesArray,
            value: defaultValue as number,
            change: this.onChange.bind(this)
        });
        this.dropDownListObject.appendTo(input);
        pagerObj.pageSize = defaultValue as number;
        pagerObj.dataBind();
        pagerObj.trigger('dropDownChanged', { pageSize: defaultValue });
    }
    /**
     * For internal use only - Get the pagesize. 
     * @private
     * @hidden
     */
    private onChange(e: Event): void {
        this.pagerModule.pageSize = this.dropDownListObject.value as number;
        this.pagerModule.dataBind();
        this.pagerModule.trigger('dropDownChanged', { pageSize: this.dropDownListObject.value });
    }

    /**
     * To destroy the Pagerdropdown
     * @method destroy
     * @return {void} 
     * @hidden 
     */
    public destroy(args?: { requestType: string }): void {
        if (this.dropDownListObject && !this.dropDownListObject.isDestroyed) {
            this.dropDownListObject.destroy();
            remove(this.pagerDropDownDiv);
        }
    }
}