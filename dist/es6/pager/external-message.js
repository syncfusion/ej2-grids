import { createElement, remove } from '@syncfusion/ej2-base';
var ExternalMessage = (function () {
    function ExternalMessage(pagerModule) {
        this.pagerModule = pagerModule;
    }
    ExternalMessage.prototype.getModuleName = function () {
        return 'externalMessage';
    };
    ExternalMessage.prototype.render = function () {
        this.element = createElement('div', { className: 'e-pagerexternalmsg', attrs: { 'aria-label': 'Pager external message' } });
        this.pagerModule.element.appendChild(this.element);
        this.refresh();
    };
    ExternalMessage.prototype.refresh = function () {
        if (this.pagerModule.externalMessage && this.pagerModule.externalMessage.toString().length) {
            this.showMessage();
            this.element.innerHTML = this.pagerModule.externalMessage;
        }
        else {
            this.hideMessage();
        }
    };
    ExternalMessage.prototype.hideMessage = function () {
        this.element.style.display = 'none';
    };
    ExternalMessage.prototype.showMessage = function () {
        this.element.style.display = '';
    };
    ExternalMessage.prototype.destroy = function () {
        remove(this.element);
    };
    return ExternalMessage;
}());
export { ExternalMessage };
