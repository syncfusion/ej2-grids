define(["require", "exports", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base", "../services/value-formatter", "../base/util"], function (require, exports, util_1, ej2_base_1, value_formatter_1, util_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Column = (function () {
        function Column(options) {
            this.allowSorting = true;
            this.allowFiltering = true;
            this.allowGrouping = true;
            util_1.merge(this, options);
            this.uid = util_2.getUid('grid-column');
            var valueFormatter = new value_formatter_1.ValueFormatter();
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
                        this.templateFn = ej2_base_1.compile(document.querySelector(this.template).innerHTML.trim());
                    }
                }
                catch (e) {
                    this.templateFn = ej2_base_1.compile(this.template);
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
    exports.Column = Column;
});
