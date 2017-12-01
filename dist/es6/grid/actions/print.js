import { removeClass } from '@syncfusion/ej2-base';
import { print as printWindow } from '@syncfusion/ej2-base';
import { removeElement } from '../base/util';
import * as events from '../base/constant';
/**
 *
 * `Print` module is used to handle the print action.
 */
var Print = /** @class */ (function () {
    /**
     * Constructor for the Grid print module
     * @hidden
     */
    function Print(parent, scrollModule) {
        this.parent = parent;
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.contentReady, this.contentReady.bind(this));
        this.scrollModule = scrollModule;
    }
    /**
     * By default, it prints all the pages of Grid and hides pager.
     * > Customize print options using [`printMode`](http://ej2.syncfusion.com/documentation/grid/api-grid.html#printmode-string).
     * @return {void}
     */
    Print.prototype.print = function () {
        var gObj = this.parent;
        this.isPrinting = true;
        //Todo: close dialog if opened
        this.element = gObj.element.cloneNode(true);
        this.printWindow = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        this.printWindow.moveTo(0, 0);
        this.printWindow.resizeTo(screen.availWidth, screen.availHeight);
        if (gObj.allowPaging) {
            if (gObj.printMode === 'currentpage') {
                this.element.querySelector('.e-gridpager').style.display = 'none';
                this.contentReady();
            }
            else {
                this.isPagerDisabled = true;
                gObj.allowPaging = false;
                gObj.dataBind();
            }
        }
        else {
            this.contentReady();
        }
    };
    Print.prototype.contentReady = function () {
        var gObj = this.parent;
        if (!this.isPrinting) {
            return;
        }
        if (this.isPagerDisabled) {
            this.element = gObj.element.cloneNode(true);
            this.isPagerDisabled = false;
            gObj.allowPaging = true;
            //  gObj.dataBind();
        }
        if (gObj.height !== 'auto') {
            var cssProps = this.scrollModule.getCssProperties();
            var contentDiv = this.element.querySelector('.e-content');
            var headerDiv = this.element.querySelector('.e-gridheader');
            contentDiv.style.height = 'auto';
            contentDiv.style.overflowY = 'auto';
            headerDiv.style[cssProps.padding] = '';
            headerDiv.firstElementChild.style[cssProps.border] = '';
        }
        if (gObj.allowGrouping) {
            if (!gObj.groupSettings.columns.length) {
                this.element.querySelector('.e-groupdroparea').style.display = 'none';
            }
            else {
                this.removeColGroup(gObj.groupSettings.columns.length);
                removeElement(this.element, '.e-grouptopleftcell');
                removeElement(this.element, '.e-recordpluscollapse');
                removeElement(this.element, '.e-indentcell');
                removeElement(this.element, '.e-recordplusexpand');
            }
        }
        //Todo: consider scrolling, toolbar     
        if (gObj.toolbar) {
            this.element.querySelector('.e-toolbar').style.display = 'none';
        }
        if (gObj.allowFiltering && gObj.filterSettings.type === 'filterbar') {
            this.element.querySelector('.e-filterbar').style.display = 'none';
        }
        if (gObj.allowSelection) {
            removeClass(this.element.querySelectorAll('.e-active'), 'e-active');
            removeClass(this.element.querySelectorAll('.e-cellselection1background'), 'e-cellselection1background');
        }
        var args = {
            requestType: 'print', element: this.element,
            selectedRows: gObj.getContentTable().querySelectorAll('tr[aria-selected="true"]')
        };
        gObj.trigger(events.beforePrint, args);
        printWindow(this.element, this.printWindow);
        this.isPrinting = false;
        gObj.trigger(events.printComplete, args);
    };
    Print.prototype.removeColGroup = function (depth) {
        var groupCaption = this.element.querySelectorAll('.e-groupcaption');
        var colSpan = groupCaption[depth - 1].getAttribute('colspan');
        for (var i = 0; i < groupCaption.length; i++) {
            groupCaption[i].setAttribute('colspan', colSpan);
        }
        var colGroups = this.element.querySelectorAll('colgroup');
        for (var i = 0; i < colGroups.length; i++) {
            for (var j = 0; j < depth; j++) {
                colGroups[i].childNodes[j].style.display = 'none';
            }
        }
    };
    /**
     * To destroy the print
     * @return {void}
     * @hidden
     */
    Print.prototype.destroy = function () {
        //destroy
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Print.prototype.getModuleName = function () {
        return 'print';
    };
    return Print;
}());
export { Print };
