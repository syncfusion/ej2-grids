import { getRowHeight } from '../base/util';
import { initialLoad } from '../base/constant';
import { RenderType } from '../base/enum';
import { VirtualContentRenderer, VirtualHeaderRenderer } from '../renderer/virtual-content-renderer';
import * as events from '../base/constant';
/**
 * Virtual Scrolling class
 */
var VirtualScroll = /** @class */ (function () {
    function VirtualScroll(parent, locator) {
        this.parent = parent;
        this.locator = locator;
        this.addEventListener();
    }
    VirtualScroll.prototype.getModuleName = function () {
        return 'virtualscroll';
    };
    VirtualScroll.prototype.instantiateRenderer = function () {
        var renderer = this.locator.getService('rendererFactory');
        if (this.parent.enableColumnVirtualization) {
            renderer.addRenderer(RenderType.Header, new VirtualHeaderRenderer(this.parent, this.locator));
        }
        renderer.addRenderer(RenderType.Content, new VirtualContentRenderer(this.parent, this.locator));
        this.ensurePageSize();
    };
    VirtualScroll.prototype.ensurePageSize = function () {
        var rowHeight = getRowHeight(this.parent.element);
        this.blockSize = ~~(this.parent.height / rowHeight);
        var height = this.blockSize * 2;
        var size = this.parent.pageSettings.pageSize;
        this.parent.setProperties({ pageSettings: { pageSize: size < height ? height : size } }, true);
    };
    VirtualScroll.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(initialLoad, this.instantiateRenderer, this);
        this.parent.on(events.columnWidthChanged, this.refreshVirtualElement, this);
    };
    VirtualScroll.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(initialLoad, this.instantiateRenderer);
        this.parent.off(events.columnWidthChanged, this.refreshVirtualElement);
    };
    VirtualScroll.prototype.refreshVirtualElement = function (args) {
        if (this.parent.enableColumnVirtualization && args.module === 'resize') {
            var renderer = this.locator.getService('rendererFactory');
            renderer.getRenderer(RenderType.Content).refreshVirtualElement();
        }
    };
    VirtualScroll.prototype.destroy = function () {
        this.removeEventListener();
    };
    return VirtualScroll;
}());
export { VirtualScroll };
