define(["require", "exports", "@syncfusion/ej2-base/util", "../base/util", "../base/constant"], function (require, exports, util_1, util_2, events) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShowHide = (function () {
        function ShowHide(parent) {
            this.parent = parent;
        }
        ShowHide.prototype.show = function (columnName, showBy) {
            var keys = this.getToggleFields(columnName);
            var columns = this.getColumns(keys, showBy);
            columns.forEach(function (value) {
                value.visible = true;
            });
            this.setVisible(columns);
        };
        ShowHide.prototype.hide = function (columnName, hideBy) {
            var keys = this.getToggleFields(columnName);
            var columns = this.getColumns(keys, hideBy);
            columns.forEach(function (value) {
                value.visible = false;
            });
            this.setVisible(columns);
        };
        ShowHide.prototype.getToggleFields = function (key) {
            var finalized = [];
            if (typeof key === 'string') {
                finalized = [key];
            }
            else {
                finalized = key;
            }
            return finalized;
        };
        ShowHide.prototype.getColumns = function (keys, getKeyBy) {
            var _this = this;
            var columns = util_2.iterateArrayOrObject(keys, function (key, index) {
                return util_2.iterateArrayOrObject(_this.parent.getColumns(), function (item, index) {
                    if (item[getKeyBy] === key) {
                        return item;
                    }
                    return undefined;
                })[0];
            });
            return columns;
        };
        ShowHide.prototype.setVisible = function (columns) {
            columns = util_1.isNullOrUndefined(columns) ? this.parent.getColumns() : columns;
            this.parent.notify(events.columnVisibilityChanged, columns);
        };
        return ShowHide;
    }());
    exports.ShowHide = ShowHide;
});
