import * as events from '../base/constant';
import { RenderType } from '../base/enum';
import { FreezeRender, FreezeContentRender } from '../renderer/freeze-renderer';
/**
 * `Freeze` module is used to handle Frozen rows and columns.
 * @hidden
 */
var Freeze = /** @class */ (function () {
    function Freeze(parent, locator) {
        this.parent = parent;
        this.locator = locator;
        this.addEventListener();
    }
    Freeze.prototype.getModuleName = function () {
        return 'freeze';
    };
    Freeze.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initialLoad, this.instantiateRenderer, this);
    };
    Freeze.prototype.instantiateRenderer = function () {
        var renderer = this.locator.getService('rendererFactory');
        if (this.parent.frozenColumns) {
            renderer.addRenderer(RenderType.Header, new FreezeRender(this.parent, this.locator));
            renderer.addRenderer(RenderType.Content, new FreezeContentRender(this.parent, this.locator));
        }
        if (this.parent.frozenRows && !this.parent.frozenColumns) {
            renderer.addRenderer(RenderType.Content, new FreezeContentRender(this.parent, this.locator));
        }
    };
    Freeze.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.initialLoad, this.instantiateRenderer);
    };
    Freeze.prototype.destroy = function () {
        this.removeEventListener();
    };
    return Freeze;
}());
export { Freeze };
