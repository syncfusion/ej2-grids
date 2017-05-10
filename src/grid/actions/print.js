define(["require", "exports", "@syncfusion/ej2-base/dom", "@syncfusion/ej2-base/util", "../base/util", "../base/constant"], function (require, exports, dom_1, util_1, util_2, events) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Print = (function () {
        function Print(parent, scrollModule) {
            this.parent = parent;
            this.parent.on(events.contentReady, this.contentReady.bind(this));
            this.scrollModule = scrollModule;
        }
        Print.prototype.print = function () {
            var gObj = this.parent;
            this.isPrinting = true;
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
                    util_2.removeElement(this.element, '.e-grouptopleftcell');
                    util_2.removeElement(this.element, '.e-recordpluscollapse');
                    util_2.removeElement(this.element, '.e-indentcell');
                    util_2.removeElement(this.element, '.e-recordplusexpand');
                }
            }
            if (gObj.allowFiltering && gObj.filterSettings.type === 'filterbar') {
                this.element.querySelector('.e-filterbar').style.display = 'none';
            }
            if (gObj.allowSelection) {
                dom_1.removeClass(this.element.querySelectorAll('.e-active'), 'e-active');
                dom_1.removeClass(this.element.querySelectorAll('.e-cellselection1background'), 'e-cellselection1background');
            }
            var args = {
                requestType: 'print', element: this.element,
                selectedRows: gObj.getContentTable().querySelectorAll('tr[aria-selected="true"]')
            };
            gObj.trigger(events.beforePrint, args);
            util_1.print(this.element, this.printWindow);
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
        Print.prototype.destroy = function () {
        };
        Print.prototype.getModuleName = function () {
            return 'print';
        };
        return Print;
    }());
    exports.Print = Print;
});
