define(["require", "exports", "@syncfusion/ej2-base/util", "../base/enum"], function (require, exports, util_1, enum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RendererFactory = (function () {
        function RendererFactory() {
            this.rendererMap = {};
        }
        RendererFactory.prototype.addRenderer = function (name, type) {
            var rName = util_1.getEnumValue(enum_1.RenderType, name);
            if (util_1.isNullOrUndefined(this.rendererMap[rName])) {
                this.rendererMap[rName] = type;
            }
        };
        RendererFactory.prototype.getRenderer = function (name) {
            var rName = util_1.getEnumValue(enum_1.RenderType, name);
            if (util_1.isNullOrUndefined(this.rendererMap[rName])) {
                throw "The renderer " + rName + " is not found";
            }
            else {
                return this.rendererMap[rName];
            }
        };
        return RendererFactory;
    }());
    exports.RendererFactory = RendererFactory;
});
