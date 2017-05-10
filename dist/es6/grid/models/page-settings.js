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
import { Property, ChildProperty } from '@syncfusion/ej2-base';
var PageSettings = (function (_super) {
    __extends(PageSettings, _super);
    function PageSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PageSettings;
}(ChildProperty));
export { PageSettings };
__decorate([
    Property(12)
], PageSettings.prototype, "pageSize", void 0);
__decorate([
    Property(8)
], PageSettings.prototype, "pageCount", void 0);
__decorate([
    Property(1)
], PageSettings.prototype, "currentPage", void 0);
__decorate([
    Property()
], PageSettings.prototype, "totalRecordsCount", void 0);
__decorate([
    Property(false)
], PageSettings.prototype, "enableQueryString", void 0);
