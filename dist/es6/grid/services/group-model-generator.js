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
import { Row } from '../models/row';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base/util';
import { CellType } from '../base/enum';
import { RowModelGenerator } from '../services/row-model-generator';
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
        if (isNullOrUndefined(data.items)) {
            if (isNullOrUndefined(data.GroupGuid)) {
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
        var gObj = this.parent;
        var cells = [];
        for (var i = 0; i < indent; i++) {
            cells.push(this.generateIndentCell());
        }
        cells.push(this.generateCell({}, null, CellType.Expand));
        cells.push(this.generateCell(gObj.getColumnByField(field), null, CellType.GroupCaption, gObj.getVisibleColumns().length + gObj.groupSettings.columns.length + (gObj.detailsTemplate || gObj.childGrid ? 1 : 0) -
            indent + (gObj.getVisibleColumns().length ? -1 : 0)));
        return cells;
    };
    GroupModelGenerator.prototype.generateCaptionRow = function (data, indent) {
        var options = {};
        var tmp = [];
        options.data = extend({}, data);
        options.data.field = this.parent.getColumnByField(data.field).headerText;
        options.isDataRow = false;
        var row = new Row(options);
        row.cells = this.getCaptionRowCells(data.field, indent);
        return row;
    };
    GroupModelGenerator.prototype.generateDataRows = function (data, indent) {
        var rows = [];
        for (var i = 0, len = data.length; i < len; i++) {
            rows[i] = this.generateRow(data[i], this.index, i ? undefined : 'e-firstchildrow');
            for (var j = 0; j < indent; j++) {
                rows[i].cells.unshift(this.generateIndentCell());
            }
            this.index++;
        }
        return rows;
    };
    GroupModelGenerator.prototype.generateIndentCell = function () {
        return this.generateCell({}, null, CellType.Indent);
    };
    return GroupModelGenerator;
}(RowModelGenerator));
export { GroupModelGenerator };
