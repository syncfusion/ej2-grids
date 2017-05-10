define(["require", "exports", "@syncfusion/ej2-base/util"], function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ServiceLocator = (function () {
        function ServiceLocator() {
            this.services = {};
        }
        ServiceLocator.prototype.register = function (name, type) {
            if (util_1.isNullOrUndefined(this.services[name])) {
                this.services[name] = type;
            }
        };
        ServiceLocator.prototype.getService = function (name) {
            if (util_1.isNullOrUndefined(this.services[name])) {
                throw "The service " + name + " is not registered";
            }
            return this.services[name];
        };
        return ServiceLocator;
    }());
    exports.ServiceLocator = ServiceLocator;
});
