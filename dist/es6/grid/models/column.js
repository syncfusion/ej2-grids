import { merge } from '@syncfusion/ej2-base';
import { ValueFormatter } from '../services/value-formatter';
import { getUid, templateCompiler } from '../base/util';
var Column = (function () {
    function Column(options) {
        this.allowSorting = true;
        this.allowResizing = true;
        this.allowFiltering = true;
        this.allowGrouping = true;
        this.allowEditing = true;
        this.showInColumnChooser = true;
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
            this.templateFn = templateCompiler(this.template);
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
