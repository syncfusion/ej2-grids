import { removeClass } from '@syncfusion/ej2-base/dom';
import { print as printWindow } from '@syncfusion/ej2-base/util';
import { IGrid, IAction } from '../base/interface';
import { removeElement } from '../base/util';
import { Scroll, ScrollCss } from '../actions/scroll';
import * as events from '../base/constant';

/**
 * 
 * `Print` module is used to handle the print action.
 */
export class Print implements IAction {

    //Internal variables
    private element: Element; //grid cloned element
    private isPrinting: boolean;
    private isPagerDisabled: boolean;
    private printWindow: Window;
    //Module declarations
    private parent: IGrid;
    private scrollModule: Scroll;

    /**
     * Constructor for the Grid print module
     * @hidden
     */
    constructor(parent?: IGrid, scrollModule?: Scroll) {
        this.parent = parent;
        this.parent.on(events.contentReady, this.contentReady.bind(this));
        this.scrollModule = scrollModule;
    }

    /**
     * By default, it prints all the pages of Grid and hides pager.  
     * @return {void}
     */
    public print(): void {
        let gObj: IGrid = this.parent;
        this.isPrinting = true;
        //Todo: close dialog if opened
        this.element = gObj.element.cloneNode(true) as Element;
        this.printWindow = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        this.printWindow.moveTo(0, 0);
        this.printWindow.resizeTo(screen.availWidth, screen.availHeight);
        if (gObj.allowPaging) {
            if (gObj.printMode === 'currentpage') {
                (this.element.querySelector('.e-gridpager') as HTMLElement).style.display = 'none';
                this.contentReady();
            } else {
                this.isPagerDisabled = true;
                gObj.allowPaging = false;
                gObj.dataBind();
            }
        } else {
            this.contentReady();
        }
    }

    private contentReady(): void {
        let gObj: IGrid = this.parent;
        if (!this.isPrinting) {
            return;
        }
        if (this.isPagerDisabled) {
            this.element = gObj.element.cloneNode(true) as Element;
            this.isPagerDisabled = false;
            gObj.allowPaging = true;
            //  gObj.dataBind();
        }
        if (gObj.height !== 'auto') { // if scroller enabled
            let cssProps: ScrollCss = this.scrollModule.getCssProperties();
            let contentDiv: HTMLElement = (this.element.querySelector('.e-content') as HTMLElement);
            let headerDiv: HTMLElement = (<HTMLElement>this.element.querySelector('.e-gridheader'));
            contentDiv.style.height = 'auto';
            contentDiv.style.overflowY = 'auto';
            headerDiv.style[cssProps.padding] = '';
            (headerDiv.firstElementChild as HTMLElement).style[cssProps.border] = '';
        }
        if (gObj.allowGrouping) {
            if (!gObj.groupSettings.columns.length) {
                (this.element.querySelector('.e-groupdroparea') as HTMLElement).style.display = 'none';
            } else {
                this.removeColGroup(gObj.groupSettings.columns.length);
                removeElement(this.element, '.e-grouptopleftcell');
                removeElement(this.element, '.e-recordpluscollapse');
                removeElement(this.element, '.e-indentcell');
                removeElement(this.element, '.e-recordplusexpand');
            }
        }
        //Todo: consider scrolling, toolbar                       
        if (gObj.allowFiltering && gObj.filterSettings.type === 'filterbar') {
            (this.element.querySelector('.e-filterbar') as HTMLElement).style.display = 'none';
        }
        if (gObj.allowSelection) {
            removeClass(this.element.querySelectorAll('.e-active'), 'e-active');
            removeClass(this.element.querySelectorAll('.e-cellselection1background'), 'e-cellselection1background');
        }
        let args: { requestType: string, element?: Element, selectedRows?: NodeListOf<Element> } = {
            requestType: 'print', element: this.element,
            selectedRows: gObj.getContentTable().querySelectorAll('tr[aria-selected="true"]')
        };
        gObj.trigger(events.beforePrint, args);
        printWindow(this.element, this.printWindow);
        this.isPrinting = false;
        gObj.trigger(events.printComplete, args);
    }

    private removeColGroup(depth: number): void {
        let groupCaption: NodeList = this.element.querySelectorAll('.e-groupcaption');
        let colSpan: string = (<HTMLElement>groupCaption[depth - 1]).getAttribute('colspan');
        for (let i: number = 0; i < groupCaption.length; i++) {
            (<HTMLElement>groupCaption[i]).setAttribute('colspan', colSpan);
        }
        let colGroups: NodeList = this.element.querySelectorAll('colgroup');
        for (let i: number = 0; i < colGroups.length; i++) {
            for (let j: number = 0; j < depth; j++) {
                (<HTMLElement>colGroups[i].childNodes[j]).style.display = 'none';
            }
        }
    }

    /**
     * To destroy the print 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        //destroy
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'print';
    }

}

