define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CellType;
    (function (CellType) {
        CellType[CellType["Data"] = 0] = "Data";
        CellType[CellType["Header"] = 1] = "Header";
        CellType[CellType["Summary"] = 2] = "Summary";
        CellType[CellType["Filter"] = 3] = "Filter";
        CellType[CellType["Indent"] = 4] = "Indent";
        CellType[CellType["GroupCaption"] = 5] = "GroupCaption";
        CellType[CellType["Expand"] = 6] = "Expand";
        CellType[CellType["HeaderIndent"] = 7] = "HeaderIndent";
        CellType[CellType["StackedHeader"] = 8] = "StackedHeader";
    })(CellType = exports.CellType || (exports.CellType = {}));
    var RenderType;
    (function (RenderType) {
        RenderType[RenderType["Header"] = 0] = "Header";
        RenderType[RenderType["Content"] = 1] = "Content";
        RenderType[RenderType["Summary"] = 2] = "Summary";
    })(RenderType = exports.RenderType || (exports.RenderType = {}));
});
