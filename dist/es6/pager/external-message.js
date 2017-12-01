import { createElement, remove } from '@syncfusion/ej2-base';
/**
 * `ExternalMessage` module is used to display user provided message.
 */
var ExternalMessage = /** @class */ (function () {
    /**
     * Constructor for externalMessage module
     * @param  {Pager} pagerModule?
     * @returns defaultType
     * @hidden
     */
    function ExternalMessage(pagerModule) {
        this.pagerModule = pagerModule;
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    ExternalMessage.prototype.getModuleName = function () {
        return 'externalMessage';
    };
    /**
     * The function is used to render pager externalMessage
     * @hidden
     */
    ExternalMessage.prototype.render = function () {
        this.element = createElement('div', { className: 'e-pagerexternalmsg', attrs: { 'aria-label': 'Pager external message' } });
        this.pagerModule.element.appendChild(this.element);
        this.refresh();
    };
    /**
     * Refreshes the external message of Pager.
     */
    ExternalMessage.prototype.refresh = function () {
        if (this.pagerModule.externalMessage && this.pagerModule.externalMessage.toString().length) {
            this.showMessage();
            this.element.innerHTML = this.pagerModule.externalMessage;
        }
        else {
            this.hideMessage();
        }
    };
    /**
     * Hides the external message of Pager.
     */
    ExternalMessage.prototype.hideMessage = function () {
        this.element.style.display = 'none';
    };
    /**
     * Shows the external message of the Pager.
     */
    ExternalMessage.prototype.showMessage = function () {
        this.element.style.display = '';
    };
    /**
     * To destroy the PagerMessage
     * @method destroy
     * @return {void}
     * @hidden
     */
    ExternalMessage.prototype.destroy = function () {
        remove(this.element);
    };
    return ExternalMessage;
}());
export { ExternalMessage };
