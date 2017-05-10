import { isNullOrUndefined } from '@syncfusion/ej2-base/util';
import { iterateArrayOrObject } from '../base/util';
import * as events from '../base/constant';
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
        var columns = iterateArrayOrObject(keys, function (key, index) {
            return iterateArrayOrObject(_this.parent.getColumns(), function (item, index) {
                if (item[getKeyBy] === key) {
                    return item;
                }
                return undefined;
            })[0];
        });
        return columns;
    };
    ShowHide.prototype.setVisible = function (columns) {
        columns = isNullOrUndefined(columns) ? this.parent.getColumns() : columns;
        this.parent.notify(events.columnVisibilityChanged, columns);
    };
    return ShowHide;
}());
export { ShowHide };
