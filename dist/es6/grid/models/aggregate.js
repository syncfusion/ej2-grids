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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { compile } from '@syncfusion/ej2-base';
import { getEnumValue } from '@syncfusion/ej2-base';
import { CellType } from '../base/enum';
import { Property, Collection, ChildProperty } from '@syncfusion/ej2-base';
import { ValueFormatter } from '../services/value-formatter';
/**
 * Configures the Grid aggregate column.
 */
var AggregateColumn = /** @class */ (function (_super) {
    __extends(AggregateColumn, _super);
    function AggregateColumn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.templateFn = {};
        return _this;
    }
    /**
     * @hidden
     */
    AggregateColumn.prototype.setFormatter = function () {
        var valueFormatter = new ValueFormatter();
        if (this.format && (this.format.skeleton || this.format.format)) {
            this.formatFn = valueFormatter.getFormatFunction(this.format);
        }
    };
    /**
     * @hidden
     */
    AggregateColumn.prototype.getFormatter = function () {
        return this.formatFn;
    };
    /**
     * @hidden
     */
    AggregateColumn.prototype.setTemplate = function (helper) {
        if (helper === void 0) { helper = {}; }
        if (this.footerTemplate !== undefined) {
            this.templateFn[getEnumValue(CellType, CellType.Summary)] = { fn: compile(this.footerTemplate, helper),
                property: 'footerTemplate' };
        }
        if (this.groupFooterTemplate !== undefined) {
            this.templateFn[getEnumValue(CellType, CellType.GroupSummary)] = { fn: compile(this.groupFooterTemplate, helper),
                property: 'groupFooterTemplate' };
        }
        if (this.groupCaptionTemplate !== undefined) {
            this.templateFn[getEnumValue(CellType, CellType.CaptionSummary)] = { fn: compile(this.groupCaptionTemplate, helper),
                property: 'groupCaptionTemplate' };
        }
    };
    /**
     * @hidden
     */
    AggregateColumn.prototype.getTemplate = function (type) {
        return this.templateFn[getEnumValue(CellType, type)];
    };
    __decorate([
        Property()
    ], AggregateColumn.prototype, "type", void 0);
    __decorate([
        Property()
    ], AggregateColumn.prototype, "field", void 0);
    __decorate([
        Property()
    ], AggregateColumn.prototype, "columnName", void 0);
    __decorate([
        Property()
    ], AggregateColumn.prototype, "format", void 0);
    __decorate([
        Property()
    ], AggregateColumn.prototype, "footerTemplate", void 0);
    __decorate([
        Property()
    ], AggregateColumn.prototype, "groupFooterTemplate", void 0);
    __decorate([
        Property()
    ], AggregateColumn.prototype, "groupCaptionTemplate", void 0);
    __decorate([
        Property()
    ], AggregateColumn.prototype, "customAggregate", void 0);
    return AggregateColumn;
}(ChildProperty));
export { AggregateColumn };
/**
 * Configures the aggregate row.
 */
var AggregateRow = /** @class */ (function (_super) {
    __extends(AggregateRow, _super);
    function AggregateRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Collection([], AggregateColumn)
    ], AggregateRow.prototype, "columns", void 0);
    return AggregateRow;
}(ChildProperty));
export { AggregateRow };
