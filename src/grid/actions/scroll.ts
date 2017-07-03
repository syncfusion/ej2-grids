import { Browser, EventHandler } from '@syncfusion/ej2-base';
import { remove, createElement, addClass, removeClass } from '@syncfusion/ej2-base/dom';
import { formatUnit, isNullOrUndefined } from '@syncfusion/ej2-base/util';
import { IGrid, IAction, NotifyArgs } from '../base/interface';
import { scroll, contentReady, uiUpdate } from '../base/constant';
import { ColumnWidthService } from '../services/width-controller';

/**
 * `Scroll` module is used to handle scrolling behaviour.
 */
export class Scroll implements IAction {
    private parent: IGrid;
    private lastScrollTop: number = 0;
    //To maintain scroll state on grid actions.
    private previousValues: { top: number, left: number } = { top: 0, left: 0 };
    private oneTimeReady: boolean = true;
    private content: HTMLDivElement;
    private header: HTMLDivElement;
    private widthService: ColumnWidthService;

    /**
     * Constructor for the Grid scrolling.
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        this.widthService = new ColumnWidthService(parent);
        this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'scroll';
    }
    /**
     * @hidden
     */
    public setWidth(): void {
        this.parent.element.style.width = formatUnit(this.parent.width);
    }
    /**
     * @hidden
     */
    public setHeight(): void {
        let content: HTMLElement = (<HTMLElement>this.parent.getContent().firstChild);
        content.style.height = formatUnit(this.parent.height);
        this.ensureOverflow(content);
    }
    /**
     * @hidden
     */
    public setPadding(): void {
        let content: HTMLElement = <HTMLElement>this.parent.getHeaderContent();
        let scrollWidth: number = Scroll.getScrollBarWidth() - this.getThreshold();

        let cssProps: ScrollCss = this.getCssProperties();
        (<HTMLElement>content.firstChild).style[cssProps.border] = scrollWidth > 0 ? '1px' : '0px';

        content.style[cssProps.padding] = scrollWidth > 0 ? scrollWidth + 'px' : '0px';
    }
    /**
     * @hidden
     */
    public removePadding(rtl?: boolean): void {
        let cssProps: ScrollCss = this.getCssProperties(rtl);
        (<HTMLDivElement>this.parent.getHeaderContent().firstChild).style[cssProps.border] = '';
        (<HTMLDivElement>this.parent.getHeaderContent().firstChild).parentElement.style[cssProps.padding] = '';
    }
    /**
     * Refresh makes the Grid to adopt with height of parent container. 
     * > The `height` must be set to 100%. 
     * @return
     */
    public refresh(): void {
        if (this.parent.height !== '100%') {
            return;
        }

        let content: HTMLElement = <HTMLElement>this.parent.getContent();
        this.parent.element.style.height = '100%';

        let height: number = this.widthService.getSiblingsHeight(content);
        content.style.height = 'calc(100% - ' + height + 'px)'; //Set the height to the '.e-gridcontent';
    }

    private getThreshold(): number {
        /* Some browsers places the scroller outside the content, 
         * hence the padding should be adjusted.*/
        let appName: string = Browser.info.name;
        if (appName === 'mozilla') {
            return 0.5;
        }
        return 1;
    }
    /**
     * @hidden
     */
    public addEventListener(): void {
        this.parent.on(contentReady, this.wireEvents, this);
        this.parent.on(uiUpdate, this.onPropertyChanged, this);
    }
    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(contentReady, this.wireEvents);
        this.parent.off(uiUpdate, this.onPropertyChanged);
    }

    private onContentScroll(scrollTarget: HTMLElement): Function {
        let element: HTMLElement = scrollTarget;
        let isHeader: boolean = element.classList.contains('e-headercontent');
        return (e: Event) => {
            if (this.content.querySelector('tbody') === null) {
                return;
            }

            let target: HTMLElement = (<HTMLElement>e.target);
            let left: number = target.scrollLeft;
            let sLimit: number = target.scrollWidth;

            if (this.previousValues.left === left) {
                this.previousValues.top = !isHeader ? this.previousValues.top : target.scrollTop;
                return;
            }

            element.scrollLeft = left;
            this.previousValues.left = left;
        };
    }

    private wireEvents(): void {
        if (this.oneTimeReady) {
            this.content = <HTMLDivElement>this.parent.getContent().firstChild;
            this.header = <HTMLDivElement>this.parent.getHeaderContent().firstChild;
            EventHandler.add(this.content, 'scroll', this.onContentScroll(this.header), this);
            EventHandler.add(this.header, 'scroll', this.onContentScroll(this.content), this);
            this.refresh();
            this.oneTimeReady = false;
        }
        let table: Element = this.parent.getContentTable();
        if (table.scrollHeight < this.parent.getContent().clientHeight) {
            addClass(table.querySelectorAll('tr:last-child td'), 'e-lastrowcell');
        }
        this.content.scrollTop = this.previousValues.top;
        this.content.scrollLeft = this.previousValues.left;
    }
    /** 
     * @hidden
     */
    public getCssProperties(rtl?: boolean): ScrollCss {
        let css: ScrollCss = {};
        let enableRtl: boolean = isNullOrUndefined(rtl) ? this.parent.enableRtl : rtl;
        css.border = enableRtl ? 'borderLeftWidth' : 'borderRightWidth';
        css.padding = enableRtl ? 'paddingLeft' : 'paddingRight';
        return css;
    }

    private ensureOverflow(content: HTMLElement): void {
        content.style.overflowY = this.parent.height === 'auto' ? 'auto' : 'scroll';
    }

    private onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        this.setPadding();
        this.oneTimeReady = true;
        if (this.parent.height === 'auto') {
            this.removePadding();
        }
        this.wireEvents();
        this.setHeight();
        this.setWidth();
    }
    /**
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();

        //Remove padding
        this.removePadding();
        removeClass([<HTMLDivElement>this.parent.getHeaderContent().firstChild], 'e-headercontent');
        removeClass([<HTMLDivElement>this.parent.getContent().firstChild], 'e-content');

        //Remove height
        (<HTMLDivElement>this.parent.getContent().firstChild).style.height = '';

        //Remove width
        this.parent.element.style.width = '';

        //Remove Dom event
        EventHandler.remove(<HTMLDivElement>this.parent.getContent().firstChild, 'scroll', this.onContentScroll);
    }

    /**
     * Function to get the scrollbar width of the browser.
     * @return {number} 
     * @hidden
     */
    public static getScrollBarWidth(): number {
        let divNode: HTMLDivElement = document.createElement('div');
        let value: number = 0;
        divNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
        document.body.appendChild(divNode);
        value = (divNode.offsetWidth - divNode.clientWidth) | 0;
        document.body.removeChild(divNode);
        return value;
    }
}

/**
 * @hidden
 */
export interface ScrollCss {
    padding?: string;
    border?: string;
}
