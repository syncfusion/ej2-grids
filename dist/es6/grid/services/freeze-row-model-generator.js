import { RowModelGenerator } from '../services/row-model-generator';
/**
 * FreezeRowModelGenerator is used to generate grid data rows with freeze row and column.
 * @hidden
 */
var FreezeRowModelGenerator = /** @class */ (function () {
    function FreezeRowModelGenerator(parent) {
        this.isFrzLoad = 1;
        this.parent = parent;
        this.rowModelGenerator = new RowModelGenerator(this.parent);
    }
    FreezeRowModelGenerator.prototype.generateRows = function (data, notifyArgs) {
        var row = this.rowModelGenerator.generateRows(data, notifyArgs);
        if (this.parent.frozenColumns) {
            for (var i = 0, len = row.length; i < len; i++) {
                if (this.isFrzLoad % 2 === 0) {
                    row[i].cells = row[i].cells.slice(this.parent.frozenColumns, row[i].cells.length);
                }
                else {
                    row[i].cells = row[i].cells.slice(0, this.parent.frozenColumns);
                }
            }
        }
        this.isFrzLoad++;
        return row;
    };
    return FreezeRowModelGenerator;
}());
export { FreezeRowModelGenerator };
