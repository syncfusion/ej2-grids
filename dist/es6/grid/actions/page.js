import { extend } from '@syncfusion/ej2-base/util';
import { remove, createElement } from '@syncfusion/ej2-base/dom';
import { Pager } from '../../pager/pager';
import { ExternalMessage } from '../../pager/external-message';
import { extend as gridExtend, getActualProperties } from '../base/util';
import * as events from '../base/constant';
Pager.Inject(ExternalMessage);
var Page = (function () {
    function Page(parent, pageSettings) {
        this.parent = parent;
        this.pageSettings = pageSettings;
        this.addEventListener();
    }
    Page.prototype.getModuleName = function () {
        return 'pager';
    };
    Page.prototype.render = function () {
        var gObj = this.parent;
        var pagerObj;
        this.element = createElement('div', { className: 'e-gridpager' });
        pagerObj = gridExtend({}, extend({}, getActualProperties(this.pageSettings)), {
            click: this.clickHandler.bind(this),
            enableRtl: gObj.enableRtl, locale: gObj.locale
        }, ['parentObj', 'propName']);
        this.pagerObj = new Pager(pagerObj);
    };
    Page.prototype.dataReady = function (e) {
        this.updateModel(e);
    };
    Page.prototype.refresh = function () {
        this.pagerObj.refresh();
    };
    Page.prototype.goToPage = function (pageNo) {
        this.pagerObj.goToPage(pageNo);
    };
    Page.prototype.updateModel = function (e) {
        this.parent.pageSettings.totalRecordsCount = e.count;
        this.parent.dataBind();
    };
    Page.prototype.onActionComplete = function (e) {
        this.parent.trigger(events.actionComplete, extend(e, {
            currentPage: this.parent.pageSettings.currentPage, requestType: 'paging',
            type: events.actionComplete
        }));
    };
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
        this.parent.on(events.initialEnd, this.handlers.end, this);
        this.parent.on(events.dataReady, this.handlers.ready, this);
        this.parent.on(events.pageComplete, this.handlers.complete, this);
        this.parent.on(events.uiUpdate, this.handlers.updateLayout, this);
        this.parent.on(events.inBoundModelChanged, this.handlers.inboundChange, this);
        this.parent.on(events.keyPressed, this.handlers.keyPress, this);
    };
    Page.prototype.removeEventListener = function () {
        this.parent.off(events.initialLoad, this.handlers.load);
        this.parent.off(events.initialEnd, this.handlers.end);
        this.parent.off(events.dataReady, this.handlers.ready);
        this.parent.off(events.pageComplete, this.handlers.complete);
        this.parent.off(events.uiUpdate, this.handlers.updateLayout);
        this.parent.off(events.inBoundModelChanged, this.handlers.inboundChange);
        this.parent.off(events.keyPressed, this.handlers.keyPress);
    };
    Page.prototype.destroy = function () {
        this.removeEventListener();
        this.pagerObj.destroy();
        remove(this.element);
    };
    return Page;
}());
export { Page };
var keyActions = {
    pageUp: '.e-prev',
    pageDown: '.e-next',
    ctrlAltPageDown: '.e-last',
    ctrlAltPageUp: '.e-first',
    altPageUp: '.e-pp',
    altPageDown: '.e-np'
};
