import { Browser, EventHandler } from '@syncfusion/ej2-base';
import { addClass, removeClass } from '@syncfusion/ej2-base';
import { formatUnit, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getScrollBarWidth } from '../base/util';
import { scroll, contentReady, uiUpdate } from '../base/constant';
import { ColumnWidthService } from '../services/width-controller';
/**
 * `Scroll` module is used to handle scrolling behaviour.
 */
var Scroll = /** @class */ (function () {
    /**
     * Constructor for the Grid scrolling.
     * @hidden
     */
    function Scroll(parent) {
        this.lastScrollTop = 0;
        //To maintain scroll state on grid actions.
        this.previousValues = { top: 0, left: 0 };
        this.oneTimeReady = true;
        this.parent = parent;
        this.widthService = new ColumnWidthService(parent);
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Scroll.prototype.getModuleName = function () {
        return 'scroll';
    };
    /**
     * @hidden
     */
    Scroll.prototype.setWidth = function () {
        this.parent.element.style.width = formatUnit(this.parent.width);
        if (this.parent.toolbarModule && this.parent.toolbarModule.toolbar &&
            this.parent.toolbarModule.toolbar.element) {
            this.parent.toolbarModule.toolbar.refreshOverflow();
        }
    };
    /**
     * @hidden
     */
    Scroll.prototype.setHeight = function () {
        var mHdrHeight = 0;
        var content = this.parent.getContent().firstChild;
        if (this.parent.frozenRows) {
            mHdrHeight =
                this.parent.getHeaderContent().querySelector('tbody').offsetHeight;
            content.style.height = formatUnit(this.parent.height - mHdrHeight);
        }
        else {
            content.style.height = formatUnit(this.parent.height);
        }
        this.ensureOverflow(content);
    };
    /**
     * @hidden
     */
    Scroll.prototype.setPadding = function () {
        var content = this.parent.getHeaderContent();
        var scrollWidth = Scroll.getScrollBarWidth() - this.getThreshold();
        var cssProps = this.getCssProperties();
        content.firstChild.style[cssProps.border] = scrollWidth > 0 ? '1px' : '0px';
        content.style[cssProps.padding] = scrollWidth > 0 ? scrollWidth + 'px' : '0px';
    };
    /**
     * @hidden
     */
    Scroll.prototype.removePadding = function (rtl) {
        var cssProps = this.getCssProperties(rtl);
        this.parent.getHeaderContent().firstChild.style[cssProps.border] = '';
        this.parent.getHeaderContent().firstChild.parentElement.style[cssProps.padding] = '';
    };
    /**
     * Refresh makes the Grid to adopt with height of parent container.
     * > The `height` must be set to 100%.
     * @return
     */
    Scroll.prototype.refresh = function () {
        if (this.parent.height !== '100%') {
            return;
        }
        var content = this.parent.getContent();
        this.parent.element.style.height = '100%';
        var height = this.widthService.getSiblingsHeight(content);
        content.style.height = 'calc(100% - ' + height + 'px)'; //Set the height to the '.e-gridcontent';
    };
    Scroll.prototype.getThreshold = function () {
        /* Some browsers places the scroller outside the content,
         * hence the padding should be adjusted.*/
        var appName = Browser.info.name;
        if (appName === 'mozilla') {
            return 0.5;
        }
        return 1;
    };
    /**
     * @hidden
     */
    Scroll.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(contentReady, this.wireEvents, this);
        this.parent.on(uiUpdate, this.onPropertyChanged, this);
    };
    /**
     * @hidden
     */
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
    Scroll.prototype.onFreezeContentScroll = function (scrollTarget) {
        var _this = this;
        var element = scrollTarget;
        return function (e) {
            if (_this.content.querySelector('tbody') === null) {
                return;
            }
            var target = e.target;
            var top = target.scrollTop;
            if (_this.previousValues.top === top) {
                return;
            }
            element.scrollTop = top;
            _this.previousValues.top = top;
            if (_this.parent.isDestroyed) {
                return;
            }
        };
    };
    Scroll.prototype.onWheelScroll = function (scrollTarget) {
        var _this = this;
        var element = scrollTarget;
        return function (e) {
            if (_this.content.querySelector('tbody') === null) {
                return;
            }
            var top = element.scrollTop + e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
            if (_this.previousValues.top === top) {
                return;
            }
            e.preventDefault();
            _this.parent.getContent().querySelector('.e-frozencontent').scrollTop = top;
            element.scrollTop = top;
            _this.previousValues.top = top;
        };
    };
    Scroll.prototype.onTouchScroll = function (scrollTarget) {
        var _this = this;
        var element = scrollTarget;
        return function (e) {
            if (e.pointerType === 'mouse') {
                return;
            }
            var cont;
            var mHdr;
            var pageXY = _this.getPointXY(e);
            var top = element.scrollTop + (_this.pageXY.y - pageXY.y);
            var left = element.scrollLeft + (_this.pageXY.x - pageXY.x);
            if (_this.parent.getHeaderContent().contains(e.target)) {
                mHdr = _this.parent.frozenColumns ?
                    _this.parent.getHeaderContent().querySelector('.e-movableheader') : _this.parent.getHeaderContent().firstChild;
                if (_this.previousValues.left === left || (left < 0 || (mHdr.scrollWidth - mHdr.clientWidth) < left)) {
                    return;
                }
                e.preventDefault();
                mHdr.scrollLeft = left;
                element.scrollLeft = left;
                _this.pageXY.x = pageXY.x;
                _this.previousValues.left = left;
            }
            else {
                cont = _this.parent.getContent().querySelector('.e-frozencontent');
                if (_this.previousValues.top === top || (top < 0 || (cont.scrollHeight - cont.clientHeight) < top)) {
                    return;
                }
                e.preventDefault();
                cont.scrollTop = top;
                element.scrollTop = top;
                _this.pageXY.y = pageXY.y;
                _this.previousValues.top = top;
            }
        };
    };
    Scroll.prototype.setPageXY = function () {
        var _this = this;
        return function (e) {
            if (e.pointerType === 'mouse') {
                return;
            }
            _this.pageXY = _this.getPointXY(e);
        };
    };
    Scroll.prototype.getPointXY = function (e) {
        var pageXY = { x: 0, y: 0 };
        if (e.touches && e.touches.length) {
            pageXY.x = e.touches[0].pageX;
            pageXY.y = e.touches[0].pageY;
        }
        else {
            pageXY.x = e.pageX;
            pageXY.y = e.pageY;
        }
        return pageXY;
    };
    Scroll.prototype.wireEvents = function () {
        if (this.oneTimeReady) {
            this.content = this.parent.getContent().firstChild;
            this.header = this.parent.getHeaderContent().firstChild;
            var mCont = this.content.querySelector('.e-movablecontent');
            var fCont = this.content.querySelector('.e-frozencontent');
            var mHdr = this.header.querySelector('.e-movableheader');
            if (this.parent.frozenRows) {
                EventHandler.add(this.parent.frozenColumns ? mHdr : this.header, 'touchstart pointerdown', this.setPageXY(), this);
                EventHandler.add(this.parent.frozenColumns ? mHdr : this.header, 'touchmove pointermove', this.onTouchScroll(this.parent.frozenColumns ? mCont : this.content), this);
            }
            if (this.parent.frozenColumns) {
                EventHandler.add(mCont, 'scroll', this.onContentScroll(mHdr), this);
                EventHandler.add(mCont, 'scroll', this.onFreezeContentScroll(fCont), this);
                EventHandler.add(fCont, 'scroll', this.onFreezeContentScroll(mCont), this);
                EventHandler.add(mHdr, 'scroll', this.onContentScroll(mCont), this);
                EventHandler.add(fCont, 'wheel', this.onWheelScroll(mCont), this);
                EventHandler.add(fCont, 'touchstart pointerdown', this.setPageXY(), this);
                EventHandler.add(fCont, 'touchmove pointermove', this.onTouchScroll(mCont), this);
            }
            else {
                EventHandler.add(this.content, 'scroll', this.onContentScroll(this.header), this);
                EventHandler.add(this.header, 'scroll', this.onContentScroll(this.content), this);
            }
            if (this.parent.aggregates.length) {
                EventHandler.add(this.parent.getFooterContent().firstChild, 'scroll', this.onContentScroll(this.content), this);
            }
            this.refresh();
            this.oneTimeReady = false;
        }
        var table = this.parent.getContentTable();
        if (table.scrollHeight < this.parent.getContent().clientHeight) {
            addClass(table.querySelectorAll('tr:last-child td'), 'e-lastrowcell');
            if (this.parent.frozenColumns) {
                addClass(this.parent.getContent().querySelector('.e-movablecontent').querySelectorAll('tr:last-child td'), 'e-lastrowcell');
            }
        }
        if (!this.parent.enableVirtualization) {
            this.content.scrollLeft = this.previousValues.left;
            this.content.scrollTop = this.previousValues.top;
        }
        if (!this.parent.enableColumnVirtualization) {
            this.content.scrollLeft = this.previousValues.left;
        }
    };
    /**
     * @hidden
     */
    Scroll.prototype.getCssProperties = function (rtl) {
        var css = {};
        var enableRtl = isNullOrUndefined(rtl) ? this.parent.enableRtl : rtl;
        css.border = enableRtl ? 'borderLeftWidth' : 'borderRightWidth';
        css.padding = enableRtl ? 'paddingLeft' : 'paddingRight';
        return css;
    };
    Scroll.prototype.ensureOverflow = function (content) {
        if (this.parent.frozenColumns) {
            content.querySelector('.e-movablecontent').style.overflowY = this.parent.height === 'auto' ? 'auto' : 'scroll';
        }
        else {
            content.style.overflowY = this.parent.height === 'auto' ? 'auto' : 'scroll';
        }
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
    /**
     * @hidden
     */
    Scroll.prototype.destroy = function () {
        this.removeEventListener();
        //Remove padding
        this.removePadding();
        removeClass([this.parent.getHeaderContent().firstChild], 'e-headercontent');
        removeClass([this.parent.getContent().firstChild], 'e-content');
        //Remove height
        this.parent.getContent().firstChild.style.height = '';
        //Remove width
        this.parent.element.style.width = '';
        //Remove Dom event
        EventHandler.remove(this.parent.getContent().firstChild, 'scroll', this.onContentScroll);
    };
    /**
     * Function to get the scrollbar width of the browser.
     * @return {number}
     * @hidden
     */
    Scroll.getScrollBarWidth = function () {
        return getScrollBarWidth();
    };
    return Scroll;
}());
export { Scroll };
