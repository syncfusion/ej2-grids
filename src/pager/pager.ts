import { Component, ModuleDeclaration, L10n, EmitType, Browser } from '@syncfusion/ej2-base';
import { createElement, remove, classList } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Property, Event, NotifyPropertyChanges, INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { PagerModel } from './pager-model';
import { NumericContainer } from './numeric-container';
import { PagerMessage } from './pager-message';
import { ExternalMessage } from './external-message';

/** @hidden */
export interface IRender {
    render(): void;
    refresh(): void;
}

/**
 * Represents the `Pager` component. 
 * ```html
 * <div id="pager"/>
 * ```
 * ```typescript
 * <script>
 *   var pagerObj = new Pager({ totalRecordsCount: 50, pageSize:10 });
 *   pagerObj.appendTo("#pager");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Pager extends Component<HTMLElement> implements INotifyPropertyChanged {
    //Internal variables     
    /*** @hidden */
    public totalPages: number;
    /*** @hidden */
    public previousPageNo: number;
    private defaultConstants: Object = {
        currentPageInfo: '{0} of {1} pages',
        totalItemsInfo: '({0} items)',
        firstPageTooltip: 'Go to first page',
        lastPageTooltip: 'Go to last page',
        nextPageTooltip: 'Go to next page',
        previousPageTooltip: 'Go to previous page',
        nextPagerTooltip: 'Go to next pager',
        previousPagerTooltip: 'Go to previous pager'
    };

    //Module declarations
    /*** @hidden */
    public localeObj: L10n;
    /**
     * `containerModule` is used to manipulate numeric container behavior of Pager.
     */
    public containerModule: NumericContainer = new NumericContainer(this);
    /**
     * `pagerMessageModule` is used to manipulate pager message of Pager.
     */
    public pagerMessageModule: PagerMessage = new PagerMessage(this);
    /**
     * `externalMessageModule` is used to manipulate external message of Pager.
     */
    public externalMessageModule: ExternalMessage;

    //Pager Options    
    /**   
     * If `enableQueryString` set to true,   
     * then it pass current page information as a query string along with the URL while navigating to other page.  
     * @default false  
     */
    @Property(false)
    public enableQueryString: boolean;

    /**  
     * If `enableExternalMessage` set to true, then it adds the message to Pager.  
     * @default false  
     */
    @Property(false)
    public enableExternalMessage: boolean;

    /**  
     * If `enablePagerMessage` set to true, then it adds the pager information.  
     * @default true  
     */
    @Property(true)
    public enablePagerMessage: boolean;

    /**  
     * Defines the records count of visible page.  
     * @default 12  
     */
    @Property(12)
    public pageSize: number;

    /**  
     * Defines the number of pages to display in pager container.   
     * @default 10  
     */
    @Property(10)
    public pageCount: number;

    /**  
     * Defines the current page number of pager.   
     * @default 1  
     */
    @Property(1)
    public currentPage: number;

    /**  
     * Gets or Sets the total records count which is used to render numeric container.   
     * @default null  
     */
    @Property()
    public totalRecordsCount: number;

    /**  
     * Defines the external message of Pager.  
     * @default null  
     */
    @Property()
    public externalMessage: string;

    /**  
     * Defines the customized text to append with numeric items.  
     * @default null  
     */
    @Property('')
    public customText: string;

    /**  
     * Triggers when click on the numeric items.   
     * @default null  
     */
    @Event()
    public click: EmitType<Object>;

    /**  
     * Triggers when Pager is created.   
     * @default null  
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Constructor for creating the component.
     * @hidden
     */
    constructor(options?: PagerModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * To provide the array of modules needed for component rendering
     * @hidden
     */
    protected requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        if (this.enableExternalMessage) {
            modules.push({
                member: 'externalMessage',
                args: [this]
            });
        }
        return modules;
    }


    /**
     * Initialize the event handler
     * @hidden
     */
    protected preRender(): void {
        //preRender
    }

    /**
     * To Initialize the component rendering
     */
    protected render(): void {
        this.initLocalization();
        this.updateRTL();
        this.totalRecordsCount = this.totalRecordsCount || 0;
        this.renderFirstPrevDivForDevice();
        this.containerModule.render();
        if (this.enablePagerMessage) {
            this.pagerMessageModule.render();
        }
        this.renderNextLastDivForDevice();
        this.addAriaLabel();
        if (this.enableExternalMessage && this.externalMessageModule) {
            this.externalMessageModule.render();
        }
        this.refresh();
        this.trigger('created', { 'currentPage': this.currentPage, 'totalRecordsCount': this.totalRecordsCount });
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @hidden
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['enableExternalMessage', 'enablePagerMessage', 'currentPage', 'enableQueryString',
            'pageSize', 'pageCount', 'totalRecordsCount', 'externalMessage', 'customText', 'click', 'created'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * To destroy the Pager component.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        super.destroy();
        this.containerModule.destroy();
        this.pagerMessageModule.destroy();
        this.element.innerHTML = '';
    }

    /**
     * For internal use only - Get the module name. 
     * @private
     */
    protected getModuleName(): string {
        return 'pager';
    }

    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    public onPropertyChanged(newProp: PagerModel, oldProp: PagerModel): void {
        if (this.isDestroyed) { return; }
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'pageCount':
                    this.containerModule.refreshNumericLinks();
                    this.containerModule.refresh();
                    break;
                case 'currentPage':
                    if (this.checkGoToPage(newProp.currentPage, oldProp.currentPage)) {
                        this.currentPageChanged();
                    }
                    break;
                case 'pageSize':
                case 'totalRecordsCount':
                case 'customText':
                    this.refresh();
                    break;
                case 'locale':
                    this.initLocalization();
                    this.refresh();
                    break;
                case 'enableExternalMessage':
                    if (this.enableExternalMessage) {
                        this.externalMessageModule.render();
                    }
                    break;
                case 'externalMessage':
                    if (this.externalMessageModule) {
                        this.externalMessageModule.refresh();
                    }
                    break;
                case 'enableRtl':
                    this.updateRTL();
                    break;
                case 'enablePagerMessage':
                    if (this.enablePagerMessage) {
                        this.pagerMessageModule.showMessage();
                    } else {
                        this.pagerMessageModule.hideMessage();
                    }
                    break;
            }
        }
    }

    /** 
     * Gets the localized label by locale keyword. 
     * @param  {string} key  
     * @return {string}  
     */
    public getLocalizedLabel(key: string): string {
        return this.localeObj.getConstant(key);
    }

    /**  
     * Navigate to target page by given number.  
     * @param  {number} pageNo - Defines page number.  
     * @return {void}  
     */
    public goToPage(pageNo: number): void {
        if (this.checkGoToPage(pageNo)) {
            this.currentPage = pageNo;
            this.dataBind();
        }
    }

    private checkGoToPage(newPageNo: number, oldPageNo?: number): boolean {
        if (newPageNo !== this.currentPage) {
            this.previousPageNo = this.currentPage;
        }
        if (!isNullOrUndefined(oldPageNo)) {
            this.previousPageNo = oldPageNo;
        }
        if (this.previousPageNo !== newPageNo && (newPageNo >= 1 && newPageNo <= this.totalPages)) {
            return true;
        }
        return false;
    }

    private currentPageChanged(): void {
        if (this.enableQueryString) {
            this.updateQueryString(this.currentPage);
        }
        let args: { currentPage: number, cancel: boolean } = { currentPage: this.currentPage, cancel: false };
        this.trigger('click', args);
        if (!args.cancel) {
            this.refresh();
        }
    }

    /** 
     * Refreshes page count, pager information and external message.  
     * @return {void} 
     */
    public refresh(): void {
        this.updateRTL();
        this.containerModule.refresh();
        if (this.enablePagerMessage) {
            this.pagerMessageModule.refresh();
        }
        if (this.enableExternalMessage && this.externalMessageModule) {
            this.externalMessageModule.refresh();
        }
    }

    private updateRTL(): void {
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        } else {
            this.element.classList.remove('e-rtl');
        }
    }

    private initLocalization(): void {
        this.localeObj = new L10n(this.getModuleName(), this.defaultConstants, this.locale);
    }

    private updateQueryString(value: number): void {
        let updatedUrl: string = this.getUpdatedURL(window.location.href, 'page', value.toString());
        window.history.pushState({ path: updatedUrl }, '', updatedUrl);
    }

    private getUpdatedURL(uri: string, key: string, value: string): string {
        let regx: RegExp = new RegExp('([?|&])' + key + '=.*?(&|#|$)', 'i');
        if (uri.match(regx)) {
            return uri.replace(regx, '$1' + key + '=' + value + '$2');
        } else {
            let hash: string = '';
            if (uri.indexOf('#') !== -1) {
                hash = uri.replace(/.*#/, '#');
                uri = uri.replace(/#.*/, '');
            }
            return uri + (uri.indexOf('?') !== -1 ? '&' : '?') + key + '=' + value + hash;
        }
    }

    private renderFirstPrevDivForDevice(): void {
        this.element.appendChild(createElement(
            'div', {
                className: 'e-mfirst e-icons e-icon-first',
                attrs: { title: this.getLocalizedLabel('firstPageTooltip'), tabindex: '-1' }
            }));
        this.element.appendChild(createElement(
            'div', {
                className: 'e-mprev e-icons e-icon-prev',
                attrs: { title: this.getLocalizedLabel('previousPageTooltip'), tabindex: '-1' }
            }));
    }

    private renderNextLastDivForDevice(): void {
        this.element.appendChild(createElement(
            'div', {
                className: 'e-mnext e-icons e-icon-next',
                attrs: { title: this.getLocalizedLabel('nextPageTooltip'), tabindex: '-1' }
            }));
        this.element.appendChild(createElement(
            'div', {
                className: 'e-mlast e-icons e-icon-last',
                attrs: { title: this.getLocalizedLabel('lastPageTooltip'), tabindex: '-1' }
            }));
    }

    private addAriaLabel(): void {
        let classList: string[] = ['.e-mfirst', '.e-mprev', '.e-mnext', '.e-mlast'];
        if (!Browser.isDevice) {
            classList.forEach((value: string) => {
                let element: Element = this.element.querySelector(value);
                element.setAttribute('aria-label', element.getAttribute('title'));
            });
        }
    }

}
