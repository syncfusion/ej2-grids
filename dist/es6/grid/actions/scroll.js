import { Browser, EventHandler } from '@syncfusion/ej2-base';
import { addClass, removeClass } from '@syncfusion/ej2-base';
import { formatUnit, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getScrollBarWidth } from '../base/util';
import { scroll, contentReady, uiUpdate } from '../base/constant';
import { ColumnWidthService } from '../services/width-controller';
var Scroll = (function () {
    function Scroll(parent) {
        this.lastScrollTop = 0;
        this.previousValues = { top: 0, left: 0 };
        this.oneTimeReady = true;
        this.parent = parent;
        this.widthService = new ColumnWidthService(parent);
        this.addEventListener();
    }
    Scroll.prototype.getModuleName = function () {
        return 'scroll';
    };
    Scroll.prototype.setWidth = function () {
        this.parent.element.style.width = formatUnit(this.parent.width);
        if (this.parent.toolbarModule && this.parent.toolbarModule.toolbar.element) {
            this.parent.toolbarModule.toolbar.refreshOverflow();
        }
    };
    Scroll.prototype.setHeight = function () {
        var content = this.parent.getContent().firstChild;
        content.style.height = formatUnit(this.parent.height);
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
        var appName = Browser.info.name;
        if (appName === 'mozilla') {
            return 0.5;
        }
        return 1;
    };
    Scroll.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(contentReady, this.wireEvents, this);
        this.parent.on(uiUpdate, this.onPropertyChanged, this);
    };
    Scroll.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(contentReady, this.wireEvents);
        this.parent.off(uiUpdate, this.onPropertyChanged);
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
            var isFooter = target.classList.contains('e-summarycontent');
            if (_this.previousValues.left === left) {
                _this.previousValues.top = !isHeader ? _this.previousValues.top : target.scrollTop;
                return;
            }
            element.scrollLeft = left;
            if (isFooter) {
                _this.header.scrollLeft = left;
            }
            _this.previousValues.left = left;
            _this.parent.notify(scroll, { left: left });
        };
    };
    Scroll.prototype.wireEvents = function () {
        if (this.oneTimeReady) {
            this.content = this.parent.getContent().firstChild;
            this.header = this.parent.getHeaderContent().firstChild;
            EventHandler.add(this.content, 'scroll', this.onContentScroll(this.header), this);
            EventHandler.add(this.header, 'scroll', this.onContentScroll(this.content), this);
            if (this.parent.aggregates.length) {
                EventHandler.add(this.parent.getFooterContent().firstChild, 'scroll', this.onContentScroll(this.content), this);
            }
            this.refresh();
            this.oneTimeReady = false;
        }
        var table = this.parent.getContentTable();
        if (table.scrollHeight < this.parent.getContent().clientHeight) {
            addClass(table.querySelectorAll('tr:last-child td'), 'e-lastrowcell');
        }
        if (!this.parent.enableVirtualization) {
            this.content.scrollLeft = this.previousValues.left;
            this.content.scrollTop = this.previousValues.top;
        }
        if (!this.parent.enableColumnVirtualization) {
            this.content.scrollLeft = this.previousValues.left;
        }
    };
    Scroll.prototype.getCssProperties = function (rtl) {
        var css = {};
        var enableRtl = isNullOrUndefined(rtl) ? this.parent.enableRtl : rtl;
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
        removeClass([this.parent.getHeaderContent().firstChild], 'e-headercontent');
        removeClass([this.parent.getContent().firstChild], 'e-content');
        this.parent.getContent().firstChild.style.height = '';
        this.parent.element.style.width = '';
        EventHandler.remove(this.parent.getContent().firstChild, 'scroll', this.onContentScroll);
    };
    Scroll.getScrollBarWidth = function () {
        return getScrollBarWidth();
    };
    return Scroll;
}());
export { Scroll };
