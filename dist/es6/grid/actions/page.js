import { extend } from '@syncfusion/ej2-base';
import { remove, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Pager } from '../../pager/pager';
import { PagerDropDown } from '../../pager/pager-dropdown';
import { ExternalMessage } from '../../pager/external-message';
import { extend as gridExtend, getActualProperties, isActionPrevent } from '../base/util';
import * as events from '../base/constant';
Pager.Inject(ExternalMessage, PagerDropDown);
/**
 * `Page` module is used to render pager and handle paging action.
 */
var Page = /** @class */ (function () {
    /**
     * Constructor for the Grid paging module
     * @hidden
     */
    function Page(parent, pageSettings) {
        this.parent = parent;
        this.pageSettings = pageSettings;
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Page.prototype.getModuleName = function () {
        return 'pager';
    };
    /**
     * The function used to render pager from grid pageSettings
     * @return {void}
     * @hidden
     */
    Page.prototype.render = function () {
        var gObj = this.parent;
        var pagerObj;
        this.pagerDestroy();
        if (!isNullOrUndefined(this.parent.pagerTemplate)) {
            this.pageSettings.template = this.parent.pagerTemplate;
        }
        this.element = createElement('div', { className: 'e-gridpager' });
        pagerObj = gridExtend({}, extend({}, getActualProperties(this.pageSettings)), {
            click: this.clickHandler.bind(this),
            dropDownChanged: this.onSelect.bind(this),
            enableRtl: gObj.enableRtl, locale: gObj.locale,
            created: this.addAriaAttr.bind(this)
        }, ['parentObj', 'propName']);
        this.pagerObj = new Pager(pagerObj);
    };
    Page.prototype.onSelect = function (e) {
        this.pageSettings.pageSize = e.pageSize;
        this.pageSettings.currentPage = 1;
    };
    Page.prototype.addAriaAttr = function () {
        var _this = this;
        if (!(this.pageSettings.template)) {
            var numericContainer = this.element.querySelector('.e-numericcontainer');
            var links = numericContainer.querySelectorAll('a');
            for (var i = 0; i < links.length; i++) {
                if (this.parent.getContentTable()) {
                    links[i].setAttribute('aria-owns', this.parent.getContentTable().id);
                }
            }
            var classList = ['.e-mfirst', '.e-mprev', '.e-first', '.e-prev', '.e-next', '.e-last', '.e-mnext', '.e-mlast'];
            classList.forEach(function (value) {
                var element = _this.element.querySelector(value);
                if (_this.parent.getContentTable()) {
                    element.setAttribute('aria-owns', _this.parent.getContentTable().id);
                }
            });
        }
    };
    Page.prototype.dataReady = function (e) {
        this.updateModel(e);
    };
    /**
     * Refreshes the page count, pager information and external message.
     * @return {void}
     */
    Page.prototype.refresh = function () {
        this.pagerObj.refresh();
    };
    /**
     * Navigate to target page by given number.
     * @param  {number} pageNo - Defines the page number to navigate.
     * @return {void}
     */
    Page.prototype.goToPage = function (pageNo) {
        this.pagerObj.goToPage(pageNo);
    };
    /**
     * The function used to update pageSettings model
     * @return {void}
     * @hidden
     */
    Page.prototype.updateModel = function (e) {
        this.parent.pageSettings.totalRecordsCount = e.count;
        this.parent.dataBind();
    };
    /**
     * The function used to trigger onActionComplete
     * @return {void}
     * @hidden
     */
    Page.prototype.onActionComplete = function (e) {
        this.parent.trigger(events.actionComplete, extend(e, {
            currentPage: this.parent.pageSettings.currentPage, requestType: 'paging',
            type: events.actionComplete
        }));
    };
    /**
     * @hidden
     */
    Page.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName()) {
            return;
        }
        var newProp = e.properties;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            this.pagerObj[prop] = newProp[prop];
        }
        this.pagerObj.dataBind();
    };
    Page.prototype.clickHandler = function (e) {
        var gObj = this.parent;
        if (this.isForceCancel || isActionPrevent(gObj)) {
            if (!this.isForceCancel) {
                gObj.notify(events.preventBatch, { instance: this, handler: this.goToPage, arg1: e.currentPage });
                this.isForceCancel = true;
                this.pagerObj.currentPage = gObj.pageSettings.currentPage;
                this.pagerObj.dataBind();
            }
            else {
                this.isForceCancel = false;
            }
            e.cancel = true;
            return;
        }
        var prevPage = this.pageSettings.currentPage;
        this.pageSettings.currentPage = e.currentPage;
        this.parent.notify(events.modelChanged, {
            requestType: 'paging',
            previousPage: prevPage,
            currentPage: e.currentPage,
            type: events.actionBegin
        });
    };
    Page.prototype.keyPressHandler = function (e) {
        if (this.canSkipAction(e.action)) {
            return;
        }
        if (e.action in keyActions) {
            e.preventDefault();
            this.element.querySelector(keyActions[e.action]).click();
        }
    };
    Page.prototype.canSkipAction = function (action) {
        var page = {
            pageUp: function (el) { return el.scrollTop !== 0; },
            pageDown: function (el) { return !(el.scrollTop >= el.scrollHeight - el.clientHeight); }
        };
        var activeElement = document.activeElement;
        if (activeElement.classList.contains('e-content') &&
            activeElement.isEqualNode(this.parent.getContent().firstElementChild) && ['pageUp', 'pageDown'].indexOf(action) !== -1) {
            return page[action](this.parent.getContent().firstChild);
        }
        return false;
    };
    /**
     * Defines the text of external message.
     * @param  {string} message - Defines the message to update.
     * @return {void}
     */
    Page.prototype.updateExternalMessage = function (message) {
        if (!this.pagerObj.enableExternalMessage) {
            this.pagerObj.enableExternalMessage = true;
            this.pagerObj.dataBind();
        }
        this.pagerObj.externalMessage = message;
        this.pagerObj.dataBind();
    };
    Page.prototype.appendToElement = function (e) {
        this.parent.element.appendChild(this.element);
        this.parent.setGridPager(this.element);
        this.pagerObj.appendTo(this.element);
    };
    Page.prototype.enableAfterRender = function (e) {
        if (e.module === this.getModuleName() && e.enable) {
            this.render();
            this.appendToElement();
        }
    };
    /**
     * @hidden
     */
    Page.prototype.addEventListener = function () {
        this.handlers = {
            load: this.render,
            end: this.appendToElement,
            ready: this.dataReady,
            complete: this.onActionComplete,
            updateLayout: this.enableAfterRender,
            inboundChange: this.onPropertyChanged,
            keyPress: this.keyPressHandler
        };
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initialLoad, this.handlers.load, this);
        this.parent.on(events.initialEnd, this.handlers.end, this); //For initial rendering
        this.parent.on(events.dataReady, this.handlers.ready, this);
        this.parent.on(events.pageComplete, this.handlers.complete, this);
        this.parent.on(events.uiUpdate, this.handlers.updateLayout, this);
        this.parent.on(events.inBoundModelChanged, this.handlers.inboundChange, this);
        this.parent.on(events.keyPressed, this.handlers.keyPress, this);
    };
    /**
     * @hidden
     */
    Page.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.initialLoad, this.handlers.load);
        this.parent.off(events.initialEnd, this.handlers.end); //For initial rendering
        this.parent.off(events.dataReady, this.handlers.ready);
        this.parent.off(events.pageComplete, this.handlers.complete);
        this.parent.off(events.uiUpdate, this.handlers.updateLayout);
        this.parent.off(events.inBoundModelChanged, this.handlers.inboundChange);
        this.parent.off(events.keyPressed, this.handlers.keyPress);
    };
    /**
     * To destroy the pager
     * @return {void}
     * @hidden
     */
    Page.prototype.destroy = function () {
        this.removeEventListener();
        this.pagerDestroy();
    };
    Page.prototype.pagerDestroy = function () {
        if (this.pagerObj && !this.pagerObj.isDestroyed) {
            this.pagerObj.destroy();
            remove(this.element);
        }
    };
    return Page;
}());
export { Page };
/**
 * @hidden
 */
var keyActions = {
    pageUp: '.e-prev',
    pageDown: '.e-next',
    ctrlAltPageDown: '.e-last',
    ctrlAltPageUp: '.e-first',
    altPageUp: '.e-pp',
    altPageDown: '.e-np'
};
