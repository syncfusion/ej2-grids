import { isNullOrUndefined, getEnumValue } from '@syncfusion/ej2-base';
import { CellType } from '../base/enum';
/**
 * CellRendererFactory
 * @hidden
 */
var CellRendererFactory = /** @class */ (function () {
    function CellRendererFactory() {
        this.cellRenderMap = {};
    }
    CellRendererFactory.prototype.addCellRenderer = function (name, type) {
        name = typeof name === 'string' ? name : getEnumValue(CellType, name);
        if (isNullOrUndefined(this.cellRenderMap[name])) {
            this.cellRenderMap[name] = type;
        }
    };
    CellRendererFactory.prototype.getCellRenderer = function (name) {
        name = typeof name === 'string' ? name : getEnumValue(CellType, name);
        if (isNullOrUndefined(this.cellRenderMap[name])) {
            throw "The cellRenderer " + name + " is not found";
        }
        else {
            return this.cellRenderMap[name];
        }
    };
    return CellRendererFactory;
}());
export { CellRendererFactory };
