define(["require", "exports", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/util", "../base/constant", "../models/column"], function (require, exports, util_1, util_2, constant_1, column_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ColumnWidthService = (function () {
        function ColumnWidthService(parent) {
            this.parent = parent;
        }
        ColumnWidthService.prototype.setWidthToColumns = function () {
            var _this = this;
            if (this.parent.allowGrouping) {
                for (var i = 0, len = this.parent.groupSettings.columns.length; i < len; i++) {
                    this.setColumnWidth(new column_1.Column({ width: '30px' }), i);
                }
            }
            this.parent.getColumns().forEach(function (column) {
                _this.setColumnWidth(column);
            });
        };
        ColumnWidthService.prototype.setColumnWidth = function (column, index) {
            var columnIndex = util_1.isNullOrUndefined(index) ? this.parent.getNormalizedColumnIndex(column.uid) : index;
            var cWidth = column.width;
            if (!util_1.isNullOrUndefined(cWidth)) {
                this.setWidth(cWidth, columnIndex);
                this.parent.notify(constant_1.columnWidthChanged, { index: columnIndex, width: cWidth, column: column });
            }
        };
        ColumnWidthService.prototype.setWidth = function (width, index) {
            var header = this.parent.getHeaderTable();
            var content = this.parent.getContentTable();
            var fWidth = util_2.formatUnit(width);
            header.querySelector('colgroup').children[index].style.width = fWidth;
            content.querySelector('colgroup').children[index].style.width = fWidth;
        };
        ColumnWidthService.prototype.getSiblingsHeight = function (element) {
            var previous = this.getHeightFromDirection(element, 'previous');
            var next = this.getHeightFromDirection(element, 'next');
            return previous + next;
        };
        ColumnWidthService.prototype.getHeightFromDirection = function (element, direction) {
            var sibling = element[direction + 'ElementSibling'];
            var result = 0;
            while (sibling) {
                result += sibling.offsetHeight;
                sibling = sibling[direction + 'ElementSibling'];
            }
            return result;
        };
        return ColumnWidthService;
    }());
    exports.ColumnWidthService = ColumnWidthService;
});
