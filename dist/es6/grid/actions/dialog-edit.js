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
import { NormalEdit } from './normal-edit';
var DialogEdit = (function (_super) {
    __extends(DialogEdit, _super);
    function DialogEdit(parent, serviceLocator, renderer) {
        var _this = _super.call(this, parent, serviceLocator) || this;
        _this.parent = parent;
        _this.serviceLocator = serviceLocator;
        _this.renderer = renderer;
        return _this;
    }
    DialogEdit.prototype.closeEdit = function () {
        _super.prototype.closeEdit.call(this);
    };
    DialogEdit.prototype.addRecord = function (data) {
        _super.prototype.addRecord.call(this, data);
    };
    DialogEdit.prototype.endEdit = function () {
        _super.prototype.endEdit.call(this);
    };
    DialogEdit.prototype.deleteRecord = function (fieldname, data) {
        _super.prototype.deleteRecord.call(this, fieldname, data);
    };
    DialogEdit.prototype.startEdit = function (tr) {
        _super.prototype.startEdit.call(this, tr);
    };
    return DialogEdit;
}(NormalEdit));
export { DialogEdit };
