define(["require", "exports", "@syncfusion/ej2-base/util", "../base/enum"], function (require, exports, util_1, enum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CellRendererFactory = (function () {
        function CellRendererFactory() {
            this.cellRenderMap = {};
        }
        CellRendererFactory.prototype.addCellRenderer = function (name, type) {
            name = typeof name === 'string' ? name : util_1.getEnumValue(enum_1.CellType, name);
            if (util_1.isNullOrUndefined(this.cellRenderMap[name])) {
                this.cellRenderMap[name] = type;
            }
        };
        CellRendererFactory.prototype.getCellRenderer = function (name) {
            name = typeof name === 'string' ? name : util_1.getEnumValue(enum_1.CellType, name);
            if (util_1.isNullOrUndefined(this.cellRenderMap[name])) {
                throw "The cellRenderer " + name + " is not found";
            }
            else {
                return this.cellRenderMap[name];
            }
        };
        return CellRendererFactory;
    }());
    exports.CellRendererFactory = CellRendererFactory;
});
