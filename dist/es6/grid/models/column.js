import { merge } from '@syncfusion/ej2-base/util';
import { compile as templateCompiler } from '@syncfusion/ej2-base';
import { ValueFormatter } from '../services/value-formatter';
import { getUid } from '../base/util';
var Column = (function () {
    function Column(options) {
        this.allowSorting = true;
        this.allowFiltering = true;
        this.allowGrouping = true;
        merge(this, options);
        this.uid = getUid('grid-column');
        var valueFormatter = new ValueFormatter();
        if (options.format && (options.format.skeleton || options.format.format)) {
            this.setFormatter(valueFormatter.getFormatFunction(options.format));
            this.setParser(valueFormatter.getParserFunction(options.format));
        }
        if (!this.field) {
            this.allowFiltering = false;
            this.allowGrouping = false;
            this.allowSorting = false;
        }
        if (this.template) {
            var e = void 0;
            try {
                if (document.querySelectorAll(this.template).length) {
                    this.templateFn = templateCompiler(document.querySelector(this.template).innerHTML.trim());
                }
            }
            catch (e) {
                this.templateFn = templateCompiler(this.template);
            }
        }
    }
    Column.prototype.getFormatter = function () {
        return this.formatFn;
    };
    Column.prototype.setFormatter = function (value) {
        this.formatFn = value;
    };
    Column.prototype.getParser = function () {
        return this.parserFn;
    };
    Column.prototype.setParser = function (value) {
        this.parserFn = value;
    };
    Column.prototype.getColumnTemplate = function () {
        return this.templateFn;
    };
    Column.prototype.getDomSetter = function () {
        return this.disableHtmlEncode ? 'textContent' : 'innerHTML';
    };
    return Column;
}());
export { Column };
