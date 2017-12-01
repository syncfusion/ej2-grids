import { merge } from '@syncfusion/ej2-base';
import { ValueFormatter } from '../services/value-formatter';
import { getUid, templateCompiler } from '../base/util';
/**
 * Represents Grid `Column` model class.
 */
var Column = /** @class */ (function () {
    function Column(options) {
        /**
         * If `allowSorting` set to false, then it disables sorting option of a particular column.
         * By default all columns are sortable.
         * @default true
         */
        this.allowSorting = true;
        /**
         * If `allowResizing` set to false, then it disables resize option of a particular column.
         * By default all columns can be resized.
         * @default true
         */
        this.allowResizing = true;
        /**
         * If `allowFiltering` set to false, then it disables filtering option and filter bar element of a particular column.
         * By default all columns are filterable.
         * @default true
         */
        this.allowFiltering = true;
        /**
         * If `allowGrouping` set to false, then it disables grouping of a particular column.
         * By default all columns are groupable.
         * @default true
         */
        this.allowGrouping = true;
        /**
         * If `showColumnMenu` set to false, then it disable the column menu of a particular column.
         * By default column menu will show for all columns
         * @default true
         */
        this.showColumnMenu = true;
        /**
         * If `enableGroupByFormat` set to true, then it groups the particular column by formatted values.
         * @default true
         */
        this.enableGroupByFormat = false;
        /**
         * If `allowEditing` set to false, then it disables editing of a particular column.
         * By default all columns are editable.
         * @default true
         */
        this.allowEditing = true;
        /**
         *  It is used to customize the default filter options for a specific columns.
         * * type -  Specifies the filter type as menu or checkbox.
         * * ui - to render custom component for specific column it has following functions.
         * * create – It is used for creating custom components.
         * * read -  It is used for read the value from the component.
         * * write - It is used to apply component model as dynamically.
         *
         *  ``` html
         * <div id="Grid"></div>
         * ```
         * ```typescript
         * let gridObj: Grid = new Grid({
         * dataSource: filterData,
         * allowFiltering: true,
         * filterSettings: { type: 'menu'},
         *  columns: [
         *      {
         *          field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'right', filter: {
         *              ui: {
         *                  create: (args: { target: Element, column: Object }) => {
         *                      let db: Object = new DataManager(data);
         *                      let flValInput: HTMLElement = createElement('input', { className: 'flm-input' });
         *                      args.target.appendChild(flValInput);
         *                      this.dropInstance = new DropDownList({
         *                          dataSource: new DataManager(data),
         *                          fields: { text: 'OrderID', value: 'OrderID' },
         *                          placeholder: 'Select a value',
         *                          popupHeight: '200px'
         *                      });
         *                      this.dropInstance.appendTo(flValInput);
         *                  },
         *                  write: (args: {
         *                      column: Object, target: Element, parent: any,
         *                      filteredValue: number | string
         *                  }) => {
         *                      this.dropInstance.value = args.filteredValue;
         *                  },
         *                  read: (args: { target: Element, column: any, operator: string, fltrObj: Filter }) => {
         *                      args.fltrObj.filterByColumn(args.column.field, args.operator, this.dropInstance.value);
         *
         *                  }
         *              }
         *          }
         *      },
         *      { field: 'CustomerID', headerText: 'Customer Name', width: 150 },
         *      { field: 'EmployeeID', headerText: 'Employee ID', width: 150 },
         *      {
         *          field: 'ShipCountry', headerText: 'Ship Country', filter: {
         *              type: 'checkbox'
         *          }, width: 150
         *      }
         *  ]
         * });
         * gridObj.appendTo('#Grid');
         * ```
         *
         *  @default null
         */
        this.filter = {};
        /**
         * If `showInColumnChooser` set to false, then hide the particular column in column chooser.
         *  By default all columns are displayed in column Chooser.
         * @default true
         */
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
        if (this.commands && !this.textAlign) {
            this.textAlign = 'right';
        }
        if (this.template || this.commandsTemplate) {
            this.templateFn = templateCompiler(this.template || this.commandsTemplate);
        }
        if (this.filter.itemTemplate) {
            this.fltrTemplateFn = templateCompiler(this.filter.itemTemplate);
        }
    }
    /** @hidden */
    Column.prototype.getFormatter = function () {
        return this.formatFn;
    };
    /** @hidden */
    Column.prototype.setFormatter = function (value) {
        this.formatFn = value;
    };
    /** @hidden */
    Column.prototype.getParser = function () {
        return this.parserFn;
    };
    /** @hidden */
    Column.prototype.setParser = function (value) {
        this.parserFn = value;
    };
    /** @hidden */
    Column.prototype.getColumnTemplate = function () {
        return this.templateFn;
    };
    /** @hidden */
    Column.prototype.getFilterItemTemplate = function () {
        return this.fltrTemplateFn;
    };
    /** @hidden */
    Column.prototype.getDomSetter = function () {
        return this.disableHtmlEncode ? 'textContent' : 'innerHTML';
    };
    return Column;
}());
export { Column };
