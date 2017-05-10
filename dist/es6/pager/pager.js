var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, L10n } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base/dom';
import { isNullOrUndefined } from '@syncfusion/ej2-base/util';
import { Property, Event, NotifyPropertyChanges } from '@syncfusion/ej2-base';
import { NumericContainer } from './numeric-container';
import { PagerMessage } from './pager-message';
var Pager = (function (_super) {
    __extends(Pager, _super);
    function Pager(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.defaultConstants = {
            currentPageInfo: '{0} of {1} pages',
            totalItemsInfo: '({0} items)',
            firstPageTooltip: 'Go to first page',
            lastPageTooltip: 'Go to last page',
            nextPageTooltip: 'Go to next page',
            previousPageTooltip: 'Go to previous page',
            nextPagerTooltip: 'Go to next pager',
            previousPagerTooltip: 'Go to previous pager'
        };
        _this.containerModule = new NumericContainer(_this);
        _this.pagerMessageModule = new PagerMessage(_this);
        return _this;
    }
    Pager.prototype.requiredModules = function () {
        var modules = [];
        if (this.enableExternalMessage) {
            modules.push({
                member: 'externalMessage',
                args: [this]
            });
        }
        return modules;
    };
    Pager.prototype.preRender = function () {
    };
    Pager.prototype.render = function () {
        this.initLocalization();
        this.updateRTL();
        this.totalRecordsCount = this.totalRecordsCount || 0;
        this.renderFirstPrevDivForDevice();
        this.containerModule.render();
        if (this.enablePagerMessage) {
            this.pagerMessageModule.render();
        }
        this.renderNextLastDivForDevice();
        if (this.enableExternalMessage && this.externalMessageModule) {
            this.externalMessageModule.render();
        }
        this.refresh();
        this.trigger('created', { 'currentPage': this.currentPage, 'totalRecordsCount': this.totalRecordsCount });
    };
    Pager.prototype.getPersistData = function () {
        var keyEntity = ['enableExternalMessage', 'enablePagerMessage', 'currentPage',
            'pageSize', 'pageCount', 'totalRecordsCount', 'externalMessage', 'customText', 'click', 'created'];
        return this.addOnPersist(keyEntity);
    };
    Pager.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.containerModule.destroy();
        this.pagerMessageModule.destroy();
        this.element.innerHTML = '';
    };
    Pager.prototype.getModuleName = function () {
        return 'pager';
    };
    Pager.prototype.onPropertyChanged = function (newProp, oldProp) {
        if (this.isDestroyed) {
            return;
        }
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
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
                    }
                    else {
                        this.pagerMessageModule.hideMessage();
                    }
                    break;
            }
        }
    };
    Pager.prototype.getLocalizedLabel = function (key) {
        return this.localeObj.getConstant(key);
    };
    Pager.prototype.goToPage = function (pageNo) {
        if (this.checkGoToPage(pageNo)) {
            this.currentPage = pageNo;
            this.dataBind();
        }
    };
    Pager.prototype.checkGoToPage = function (newPageNo, oldPageNo) {
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
    };
    Pager.prototype.currentPageChanged = function () {
        if (this.enableQueryString) {
            this.updateQueryString(this.currentPage);
        }
        this.trigger('click', { 'currentPage': this.currentPage });
        this.refresh();
    };
    Pager.prototype.refresh = function () {
        this.updateRTL();
        this.containerModule.refresh();
        if (this.enablePagerMessage) {
            this.pagerMessageModule.refresh();
        }
        if (this.enableExternalMessage && this.externalMessageModule) {
            this.externalMessageModule.refresh();
        }
    };
    Pager.prototype.updateRTL = function () {
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        }
        else {
            this.element.classList.remove('e-rtl');
        }
    };
    Pager.prototype.initLocalization = function () {
        this.localeObj = new L10n(this.getModuleName(), this.defaultConstants, this.locale);
    };
    Pager.prototype.updateQueryString = function (value) {
        var updatedUrl = this.getUpdatedURL(window.location.href, 'page', value.toString());
        window.history.pushState({ path: updatedUrl }, '', updatedUrl);
    };
    Pager.prototype.getUpdatedURL = function (uri, key, value) {
        var regx = new RegExp('([?|&])' + key + '=.*?(&|#|$)', 'i');
        if (uri.match(regx)) {
            return uri.replace(regx, '$1' + key + '=' + value + '$2');
        }
        else {
            var hash = '';
            if (uri.indexOf('#') !== -1) {
                hash = uri.replace(/.*#/, '#');
                uri = uri.replace(/#.*/, '');
            }
            return uri + (uri.indexOf('?') !== -1 ? '&' : '?') + key + '=' + value + hash;
        }
    };
    Pager.prototype.renderFirstPrevDivForDevice = function () {
        this.element.appendChild(createElement('div', {
            className: 'e-mfirst e-icons e-icon-first',
            attrs: { title: this.getLocalizedLabel('firstPageTooltip'), 'aria-label': this.getLocalizedLabel('firstPageTooltip') }
        }));
        this.element.appendChild(createElement('div', {
            className: 'e-mprev e-icons e-icon-prev',
            attrs: { title: this.getLocalizedLabel('previousPageTooltip'), 'aria-label': this.getLocalizedLabel('previousPageTooltip') }
        }));
    };
    Pager.prototype.renderNextLastDivForDevice = function () {
        this.element.appendChild(createElement('div', {
            className: 'e-mnext e-icons e-icon-next',
            attrs: { title: this.getLocalizedLabel('nextPageTooltip'), 'aria-label': this.getLocalizedLabel('nextPageTooltip') }
        }));
        this.element.appendChild(createElement('div', {
            className: 'e-mlast e-icons e-icon-last',
            attrs: { title: this.getLocalizedLabel('lastPageTooltip'), 'aria-label': this.getLocalizedLabel('lastPageTooltip') }
        }));
    };
    return Pager;
}(Component));
__decorate([
    Property(false)
], Pager.prototype, "enableQueryString", void 0);
__decorate([
    Property(false)
], Pager.prototype, "enableExternalMessage", void 0);
__decorate([
    Property(true)
], Pager.prototype, "enablePagerMessage", void 0);
__decorate([
    Property(12)
], Pager.prototype, "pageSize", void 0);
__decorate([
    Property(10)
], Pager.prototype, "pageCount", void 0);
__decorate([
    Property(1)
], Pager.prototype, "currentPage", void 0);
__decorate([
    Property()
], Pager.prototype, "totalRecordsCount", void 0);
__decorate([
    Property()
], Pager.prototype, "externalMessage", void 0);
__decorate([
    Property('')
], Pager.prototype, "customText", void 0);
__decorate([
    Event()
], Pager.prototype, "click", void 0);
__decorate([
    Event()
], Pager.prototype, "created", void 0);
Pager = __decorate([
    NotifyPropertyChanges
], Pager);
export { Pager };
