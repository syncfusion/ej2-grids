import { isNullOrUndefined, getEnumValue } from '@syncfusion/ej2-base';
import { RenderType } from '../base/enum';
/**
 * RendererFactory
 * @hidden
 */
var RendererFactory = /** @class */ (function () {
    function RendererFactory() {
        this.rendererMap = {};
    }
    RendererFactory.prototype.addRenderer = function (name, type) {
        var rName = getEnumValue(RenderType, name);
        if (isNullOrUndefined(this.rendererMap[rName])) {
            this.rendererMap[rName] = type;
        }
    };
    RendererFactory.prototype.getRenderer = function (name) {
        var rName = getEnumValue(RenderType, name);
        if (isNullOrUndefined(this.rendererMap[rName])) {
            throw "The renderer " + rName + " is not found";
        }
        else {
            return this.rendererMap[rName];
        }
    };
    return RendererFactory;
}());
export { RendererFactory };
