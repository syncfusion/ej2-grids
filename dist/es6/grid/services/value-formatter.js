import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Internationalization, setCulture } from '@syncfusion/ej2-base';
var ValueFormatter = (function () {
    function ValueFormatter(cultureName) {
        this.intl = new Internationalization();
        if (!isNullOrUndefined(cultureName)) {
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
        if (!isNullOrUndefined(format) && !isNullOrUndefined(value)) {
            result = format(value);
        }
        return result;
    };
    ValueFormatter.prototype.setCulture = function (cultureName) {
        if (!isNullOrUndefined(cultureName)) {
            setCulture(cultureName);
        }
    };
    return ValueFormatter;
}());
export { ValueFormatter };
