var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../models/row", "@syncfusion/ej2-base/util", "../base/enum", "../services/row-model-generator"], function (require, exports, row_1, util_1, enum_1, row_model_generator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GroupModelGenerator = (function (_super) {
        __extends(GroupModelGenerator, _super);
        function GroupModelGenerator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.rows = [];
            _this.index = 0;
            return _this;
        }
        GroupModelGenerator.prototype.generateRows = function (data) {
            for (var i = 0, len = data.length; i < len; i++) {
                this.getGroupedRecords(0, data[i]);
            }
            this.index = 0;
            return this.rows;
        };
        GroupModelGenerator.prototype.getGroupedRecords = function (index, data) {
            if (util_1.isNullOrUndefined(data.items)) {
                if (util_1.isNullOrUndefined(data.GroupGuid)) {
                    this.rows = this.rows.concat(this.generateDataRows(data, index));
                }
                else {
                    for (var j = 0, len = data.length; j < len; j++) {
                        this.getGroupedRecords(index, data[j]);
                    }
                }
            }
            else {
                this.rows = this.rows.concat(this.generateCaptionRow(data, index));
                if (data.items && data.items.length) {
                    this.getGroupedRecords(index + 1, data.items);
                }
            }
        };
        GroupModelGenerator.prototype.getCaptionRowCells = function (field, indent) {
            var cells = [];
            for (var i = 0; i < indent; i++) {
                cells.push(this.generateIndentCell());
            }
            cells.push(this.generateCell({}, null, enum_1.CellType.Expand));
            cells.push(this.generateCell(this.parent.getColumnByField(field), null, enum_1.CellType.GroupCaption, this.parent.getVisibleColumns().length + this.parent.groupSettings.columns.length -
                indent + (this.parent.getVisibleColumns().length ? -1 : 0)));
            return cells;
        };
        GroupModelGenerator.prototype.generateCaptionRow = function (data, indent) {
            var options = {};
            var tmp = [];
            options.data = util_1.extend({}, data);
            options.data.field = this.parent.getColumnByField(data.field).headerText;
            options.isDataRow = false;
            var row = new row_1.Row(options);
            row.cells = this.getCaptionRowCells(data.field, indent);
            return row;
        };
        GroupModelGenerator.prototype.generateDataRows = function (data, indent) {
            var rows = [];
            for (var i = 0, len = data.length; i < len; i++) {
                rows[i] = this.generateRow(data[i], this.index);
                for (var j = 0; j < indent; j++) {
                    rows[i].cells.unshift(this.generateIndentCell());
                }
                this.index++;
            }
            return rows;
        };
        GroupModelGenerator.prototype.generateIndentCell = function () {
            return this.generateCell({}, null, enum_1.CellType.Indent);
        };
        return GroupModelGenerator;
    }(row_model_generator_1.RowModelGenerator));
    exports.GroupModelGenerator = GroupModelGenerator;
});
