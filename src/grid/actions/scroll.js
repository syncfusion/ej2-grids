define(["require", "exports", "@syncfusion/ej2-base", "@syncfusion/ej2-base/dom", "@syncfusion/ej2-base/util", "../base/constant", "../services/width-controller"], function (require, exports, ej2_base_1, dom_1, util_1, constant_1, width_controller_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Scroll = (function () {
        function Scroll(parent) {
            this.lastScrollTop = 0;
            this.previousValues = { top: 0, left: 0 };
            this.oneTimeReady = true;
            this.parent = parent;
            this.widthService = new width_controller_1.ColumnWidthService(parent);
            this.addEventListener();
        }
        Scroll.prototype.getModuleName = function () {
            return 'scroll';
        };
        Scroll.prototype.setWidth = function () {
            this.parent.element.style.width = util_1.formatUnit(this.parent.width);
        };
        Scroll.prototype.setHeight = function () {
            var content = this.parent.getContent().firstChild;
            content.style.height = util_1.formatUnit(this.parent.height);
            this.ensureOverflow(content);
        };
        Scroll.prototype.setPadding = function () {
            var content = this.parent.getHeaderContent();
            var scrollWidth = Scroll.getScrollBarWidth() - this.getThreshold();
            var cssProps = this.getCssProperties();
            content.firstChild.style[cssProps.border] = scrollWidth > 0 ? '1px' : '0px';
            content.style[cssProps.padding] = scrollWidth > 0 ? scrollWidth + 'px' : '0px';
        };
        Scroll.prototype.removePadding = function (rtl) {
            var cssProps = this.getCssProperties(rtl);
            this.parent.getHeaderContent().firstChild.style[cssProps.border] = '';
            this.parent.getHeaderContent().firstChild.parentElement.style[cssProps.padding] = '';
        };
        Scroll.prototype.refresh = function () {
            if (this.parent.height !== '100%') {
                return;
            }
            var content = this.parent.getContent();
            this.parent.element.style.height = '100%';
            var height = this.widthService.getSiblingsHeight(content);
            content.style.height = 'calc(100% - ' + height + 'px)';
        };
        Scroll.prototype.getThreshold = function () {
            var appName = ej2_base_1.Browser.info.name;
            if (appName === 'mozilla') {
                return 0.5;
            }
            return 1;
        };
        Scroll.prototype.addEventListener = function () {
            this.parent.on(constant_1.contentReady, this.wireEvents, this);
            this.parent.on(constant_1.uiUpdate, this.onPropertyChanged, this);
        };
        Scroll.prototype.removeEventListener = function () {
            this.parent.off(constant_1.contentReady, this.wireEvents);
            this.parent.off(constant_1.uiUpdate, this.onPropertyChanged);
        };
        Scroll.prototype.onContentScroll = function (scrollTarget) {
            var _this = this;
            var element = scrollTarget;
            var isHeader = element.classList.contains('e-headercontent');
            return function (e) {
                if (_this.content.querySelector('tbody') === null) {
                    return;
                }
                var target = e.target;
                var left = target.scrollLeft;
                var sLimit = target.scrollWidth;
                if (_this.previousValues.left === left) {
                    _this.previousValues.top = !isHeader ? _this.previousValues.top : target.scrollTop;
                    return;
                }
                element.scrollLeft = left;
                _this.previousValues.left = left;
            };
        };
        Scroll.prototype.wireEvents = function () {
            if (this.oneTimeReady) {
                this.content = this.parent.getContent().firstChild;
                this.header = this.parent.getHeaderContent().firstChild;
                ej2_base_1.EventHandler.add(this.content, 'scroll', this.onContentScroll(this.header), this);
                ej2_base_1.EventHandler.add(this.header, 'scroll', this.onContentScroll(this.content), this);
                this.refresh();
                this.oneTimeReady = false;
            }
            var table = this.parent.getContentTable();
            if (table.scrollHeight < this.parent.getContent().clientHeight) {
                dom_1.addClass(table.querySelectorAll('tr:last-child td'), 'e-lastrowcell');
            }
            this.content.scrollTop = this.previousValues.top;
            this.content.scrollLeft = this.previousValues.left;
        };
        Scroll.prototype.getCssProperties = function (rtl) {
            var css = {};
            var enableRtl = util_1.isNullOrUndefined(rtl) ? this.parent.enableRtl : rtl;
            css.border = enableRtl ? 'borderLeftWidth' : 'borderRightWidth';
            css.padding = enableRtl ? 'paddingLeft' : 'paddingRight';
            return css;
        };
        Scroll.prototype.ensureOverflow = function (content) {
            content.style.overflowY = this.parent.height === 'auto' ? 'auto' : 'scroll';
        };
        Scroll.prototype.onPropertyChanged = function (e) {
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
        };
        Scroll.prototype.destroy = function () {
            this.removeEventListener();
            this.removePadding();
            dom_1.removeClass([this.parent.getHeaderContent().firstChild], 'e-headercontent');
            dom_1.removeClass([this.parent.getContent().firstChild], 'e-content');
            this.parent.getContent().firstChild.style.height = '';
            this.parent.element.style.width = '';
            ej2_base_1.EventHandler.remove(this.parent.getContent().firstChild, 'scroll', this.onContentScroll);
        };
        Scroll.getScrollBarWidth = function () {
            var divNode = document.createElement('div');
            var value = 0;
            divNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
            document.body.appendChild(divNode);
            value = (divNode.offsetWidth - divNode.clientWidth) | 0;
            document.body.removeChild(divNode);
            return value;
        };
        return Scroll;
    }());
    exports.Scroll = Scroll;
});
