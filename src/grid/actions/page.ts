import { KeyboardEventArgs } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base/util';
import { remove, createElement } from '@syncfusion/ej2-base/dom';
import { Pager } from '../../pager/pager';
import { ExternalMessage } from '../../pager/external-message';
import { PageSettingsModel } from '../models/page-settings-model';
import { IGrid, IAction, NotifyArgs } from '../base/interface';
import { extend as gridExtend, getActualProperties } from '../base/util';
import * as events from '../base/constant';
Pager.Inject(ExternalMessage);

/**
 * `Page` module is used to render pager and handle paging action.
 */
export class Page implements IAction {
    //Internal variables          
    private element: HTMLElement;
    private pageSettings: PageSettingsModel;

    //Module declarations
    private parent: IGrid;
    private pagerObj: Pager;
    private handlers: {
        load: Function,
        end: Function,
        inboundChange?: Function,
        ready: Function,
        updateLayout: Function,
        complete: Function,
        keyPress: Function
    };

    /**
     * Constructor for the Grid paging module
     * @hidden
     */
    constructor(parent?: IGrid, pageSettings?: PageSettingsModel) {
        this.parent = parent;
        this.pageSettings = pageSettings;
        this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'pager';
    }

    /**
     * The function used to render pager from grid pageSettings
     * @return {void}
     * @hidden
     */
    public render(): void {
        let gObj: IGrid = this.parent;
        let pagerObj: Pager;
        this.element = createElement('div', { className: 'e-gridpager' });
        pagerObj = <Pager>gridExtend(
            {},
            extend({}, getActualProperties(this.pageSettings)),
            {
                click: this.clickHandler.bind(this),
                enableRtl: gObj.enableRtl, locale: gObj.locale
            },
            ['parentObj', 'propName']);
        this.pagerObj = new Pager(pagerObj);
    }

    private dataReady(e?: NotifyArgs): void {
        this.updateModel(e);
    }

    /** 
     * Refreshes the page count, pager information and external message. 
     * @return {void} 
     */
    public refresh(): void {
        this.pagerObj.refresh();
    }

    /** 
     * Navigate to target page by given number. 
     * @param  {number} pageNo - Defines the page number to navigate. 
     * @return {void} 
     */
    public goToPage(pageNo: number): void {
        this.pagerObj.goToPage(pageNo);
    }

    /**
     * The function used to update pageSettings model
     * @return {void}
     * @hidden
     */
    public updateModel(e?: NotifyArgs): void {
        this.parent.pageSettings.totalRecordsCount = e.count;
        this.parent.dataBind();
    }

    /**
     * The function used to trigger onActionComplete
     * @return {void}
     * @hidden
     */
    public onActionComplete(e: NotifyArgs): void {
        this.parent.trigger(events.actionComplete, extend(e, {
            currentPage: this.parent.pageSettings.currentPage, requestType: 'paging',
            type: events.actionComplete
        }));
    }
    /**
     * @hidden
     */
    public onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName()) {
            return;
        }

        let newProp: Object = e.properties;
        for (let prop of Object.keys(newProp)) {
            this.pagerObj[prop] = newProp[prop];
        }
        this.pagerObj.dataBind();
    }

    private clickHandler(e: Pager): void {
        let gObj: IGrid = this.parent;
        let prevPage: number = this.pageSettings.currentPage;
        this.pageSettings.currentPage = e.currentPage;
        this.parent.notify(events.modelChanged, {
            requestType: 'paging',
            previousPage: prevPage,
            currentPage: e.currentPage,
            type: events.actionBegin
        });
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        if (this.canSkipAction(e.action)) {
            return;
        }

        if (e.action in keyActions) {
            e.preventDefault();
            (this.element.querySelector(keyActions[e.action]) as HTMLElement).click();
        }
    }

    private canSkipAction(action: string): boolean {
        let page: { [x: string]: Function } = {
            pageUp: (el: HTMLElement) => el.scrollTop !== 0,
            pageDown: (el: HTMLElement) => !(el.scrollTop >= el.scrollHeight - el.clientHeight)
        };
        let activeElement: Element = document.activeElement;
        if (activeElement.classList.contains('e-content') &&
            activeElement.isEqualNode(this.parent.getContent().firstElementChild) && ['pageUp', 'pageDown'].indexOf(action) !== -1) {
            return page[action](this.parent.getContent().firstChild);
        }

        return false;
    }

    /** 
     * Defines the text of external message.
     * @param  {string} message - Defines the message to update. 
     * @return {void} 
     */
    public updateExternalMessage(message: string): void {
        if (!this.pagerObj.enableExternalMessage) {
            this.pagerObj.enableExternalMessage = true;
            this.pagerObj.dataBind();
        }
        this.pagerObj.externalMessage = message;
        this.pagerObj.dataBind();
    }

    private appendToElement(e?: NotifyArgs): void {
        this.parent.element.appendChild(this.element);
        this.parent.setGridPager(this.element);
        this.pagerObj.appendTo(this.element);
    }

    private enableAfterRender(e?: NotifyArgs): void {
        if (e.module === this.getModuleName() && e.enable) {
            this.render();
            this.appendToElement();
        }
    }
    /**
     * @hidden
     */
    public addEventListener(): void {
        this.handlers = {
            load: this.render,
            end: this.appendToElement,
            ready: this.dataReady,
            complete: this.onActionComplete,
            updateLayout: this.enableAfterRender,
            inboundChange: this.onPropertyChanged,
            keyPress: this.keyPressHandler
        };
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initialLoad, this.handlers.load, this);
        this.parent.on(events.initialEnd, this.handlers.end, this); //For initial rendering
        this.parent.on(events.dataReady, this.handlers.ready, this);
        this.parent.on(events.pageComplete, this.handlers.complete, this);
        this.parent.on(events.uiUpdate, this.handlers.updateLayout, this);
        this.parent.on(events.inBoundModelChanged, this.handlers.inboundChange, this);
        this.parent.on(events.keyPressed, this.handlers.keyPress, this);
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initialLoad, this.handlers.load);
        this.parent.off(events.initialEnd, this.handlers.end); //For initial rendering
        this.parent.off(events.dataReady, this.handlers.ready);
        this.parent.off(events.pageComplete, this.handlers.complete);
        this.parent.off(events.uiUpdate, this.handlers.updateLayout);
        this.parent.off(events.inBoundModelChanged, this.handlers.inboundChange);
        this.parent.off(events.keyPressed, this.handlers.keyPress);
    }

    /**
     * To destroy the pager 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        this.pagerObj.destroy();
        remove(this.element);
    }

}

/**
 * @hidden
 */
const keyActions: {
    pageDown: string;
    pageUp: string;
    ctrlAltPageDown: string;
    ctrlAltPageUp: string;
    altPageUp: string;
    altPageDown: string;
} = {
        pageUp: '.e-prev',
        pageDown: '.e-next',
        ctrlAltPageDown: '.e-last',
        ctrlAltPageUp: '.e-first',
        altPageUp: '.e-pp',
        altPageDown: '.e-np'
    };