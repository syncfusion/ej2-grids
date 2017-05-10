define(["require", "exports", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base"], function (require, exports, util_1, ej2_base_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValueFormatter = (function () {
        function ValueFormatter(cultureName) {
            this.intl = new ej2_base_1.Internationalization();
            if (!util_1.isNullOrUndefined(cultureName)) {
                this.intl.culture = cultureName;
            }
        }
        ValueFormatter.prototype.getFormatFunction = function (format) {
            if (format.type) {
                return this.intl.getDateFormat(format);
            }
            else {
                return this.intl.getNumberFormat(format);
            }
        };
        ValueFormatter.prototype.getParserFunction = function (format) {
            if (format.type) {
                return this.intl.getDateParser(format);
            }
            else {
                return this.intl.getNumberParser(format);
            }
        };
        ValueFormatter.prototype.fromView = function (value, format, type) {
            if (type === 'date' || type === 'datetime' || type === 'number') {
                return format(value);
            }
            else {
                return value;
            }
        };
        ValueFormatter.prototype.toView = function (value, format) {
            var result = value;
            if (!util_1.isNullOrUndefined(format) && !util_1.isNullOrUndefined(value)) {
                result = format(value);
            }
            return result;
        };
        ValueFormatter.prototype.setCulture = function (cultureName) {
            if (!util_1.isNullOrUndefined(cultureName)) {
                ej2_base_1.setCulture(cultureName);
            }
        };
        return ValueFormatter;
    }());
    exports.ValueFormatter = ValueFormatter;
});
