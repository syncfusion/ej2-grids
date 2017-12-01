import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { iterateArrayOrObject } from '../base/util';
import * as events from '../base/constant';
/**
 * `ShowHide` module is used to control column visibility.
 */
var ShowHide = /** @class */ (function () {
    /**
     * Constructor for the show hide module.
     * @hidden
     */
    function ShowHide(parent) {
        this.parent = parent;
    }
    /**
     * Shows a column by column name.
     * @param  {string|string[]} columnName - Defines a single or collection of column names to show.
     * @param  {string} showBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    ShowHide.prototype.show = function (columnName, showBy) {
        var keys = this.getToggleFields(columnName);
        var columns = this.getColumns(keys, showBy);
        columns.forEach(function (value) {
            value.visible = true;
        });
        this.setVisible(columns);
    };
    /**
     * Hides a column by column name.
     * @param  {string|string[]} columnName - Defines a single or collection of column names to hide.
     * @param  {string} hideBy - Defines the column key either as field name or header text.
     * @return {void}
     */
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
    /**
     * Shows or hides columns by given column collection.
     * @private
     * @param  {Column[]} columns - Specifies the columns.
     * @return {void}
     */
    ShowHide.prototype.setVisible = function (columns) {
        columns = isNullOrUndefined(columns) ? this.parent.getColumns() : columns;
        this.parent.notify(events.columnVisibilityChanged, columns);
    };
    return ShowHide;
}());
export { ShowHide };
