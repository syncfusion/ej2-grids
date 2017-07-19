import { compile } from '@syncfusion/ej2-base';
import { getEnumValue } from '@syncfusion/ej2-base/util';
import { CustomSummaryType } from '../base/type';
import { AggregateType, CellType } from '../base/enum';
import { Property, Collection, ChildProperty, NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';
import { AggregateColumnModel } from './aggregate-model';
import { ValueFormatter } from '../services/value-formatter';


/**
 * Configures the Grid aggregate column.
 */
export class AggregateColumn extends ChildProperty<AggregateColumn> {

    private formatFn: Function;
    private templateFn: { [x: string]:  Function } = {};

    /**
     * Defines the aggregate type of a particular column.
     * To use multiple aggregates for single column, specify the `type` as array.
     * Types of aggregate are,
     * * sum
     * * average
     * * max
     * * min
     * * count
     * * truecount
     * * falsecount
     * * custom
     * > Specify the `type` value as `custom` to use custom aggregation.
     * 
     * @default null
     */
    @Property()
    public type: AggregateType | AggregateType[] | string;

    /**
     * Defines the column name to perform aggregation.
     * @default null
     */
    @Property()
    public field: string;

    /**
     * Defines the column name to display the aggregate value.
     * If `columnName` is not defined, then `field` name value will be assigned to the `columnName` property.
     * @default null
     */
    @Property()
    public columnName: string;

    /**    
     * The format is applied to the calculated value before it is displayed. 
     * Gets the format from the user which can be standard or custom 
     * [`number`](http://ej2.syncfusion.com/documentation/base/intl.html#number-formatter-and-parser) 
     * and [`date`](http://ej2.syncfusion.com/documentation/base/intl.html#date-formatter-and-parser) formats.  
     * @default null    
     */
    @Property()
    public format: string | NumberFormatOptions | DateFormatOptions;

    /**
     * Defines the footer cell template as a string for the aggregate column.
     * The `type` name must be used to access aggregate values inside the template.
     * ```html 
     * <div id="Grid"></div>
     * <script>  
     *  var gridObj = new Grid({
     *                  dataSource: filterData, 
     *                  columns: [ 
     *                      { field: 'OrderID', headerText: 'Order ID' }, 
     *                      { field: 'Freight', format: 'c2' }
     *                  ],
     *                  aggregates: [{
     *                       columns: [{ 
     *                           type: ['min', 'max'], 
     *                           field: 'Freight', 
     *                           footerTemplate: 'Min: ${min} Max: ${max}'
     *                      }]
     *                  }]
     *  }); 
     *  gridObj.appendTo('#Grid'); 
     * </script>
     * ```
     * @default null
     */
    @Property()
    public footerTemplate: string;

    /**
     * Defines the group footer cell template as a string for the aggregate column. 
     * The `type` name must be used to access aggregate values inside the template.
     * Additionally, the following fields can be accessed in the template.
     * * **field**  - The current grouped field.
     * * **key**    - The current grouped value.
     * ```html 
     * <div id="Grid"></div>   
     * <script>
     *  var gridObj = new Grid({
     *                  dataSource: filterData, 
     *                  allowGrouping: true,
     *                  columns: [ 
     *                      { field: 'OrderID', headerText: 'Order ID' }, 
     *                      { field: 'Freight', format: 'c2' }
     *                  ],
     *                  aggregates: [{
     *                       columns: [{ 
     *                           type: ['min', 'max'], 
     *                           field: 'Freight', 
     *                           groupFooterTemplate: '${field} - Min: ${min} Max: ${max}'
     *                      }]
     *                  }]
     *  }); 
     *  gridObj.appendTo('#Grid'); 
     * </script>
     * ```
     * @default null
     */
    @Property()
    public groupFooterTemplate: string;

    /**
     * Defines the group caption cell template as a string for the aggregate column.
     * The `type` name must be used to access aggregate values inside the template.
     * Additionally, the following fields can be accessed in the template.
     * * **field**  - The current grouped field name.
     * * **key**    - The current grouped field value.
     * ```html 
     * <div id="Grid"></div>
     * <script>  
     *  var gridObj = new Grid({
     *                  dataSource: filterData, 
     *                  allowGrouping: true,
     *                  columns: [ 
     *                      { field: 'OrderID', headerText: 'Order ID' }, 
     *                      { field: 'Freight', format: 'c2' }
     *                  ],
     *                  aggregates: [{
     *                       columns: [{ 
     *                           type: ['min', 'max'], 
     *                           field: 'Freight', 
     *                           groupCaptionTemplate: '${field} - Min: ${min} Max: ${max}'
     *                      }]
     *                  }]
     *  }); 
     *  gridObj.appendTo('#Grid'); 
     * </script>
     * ```
     * @default null
     */
    @Property()
    public groupCaptionTemplate: string;

    /**
     * Defines a function to calculate custom aggregate value.
     * The `type` value should be set as `custom` to use custom aggregation.
     * To use custom aggregate value in the template, we need to use the key as `${custom}`.      
     * * **Total aggregation** - the custom function will be called with whole data and the current `AggregateColumn` object.
     * * **Group aggregation** - it will be called with current group details and the `AggregateColumn` object.
     * ```html 
     * <div id="Grid"></div>  
     * <script>
     *  var customFn = function(data, column){ return data.length };
     *  var gridObj = new Grid({ 
     *                  dataSource: filterData, 
     *                  allowGrouping: true,
     *                  columns: [ 
     *                      { field: 'OrderID', headerText: 'Order ID' }, 
     *                      { field: 'Freight', format: 'c2' }
     *                  ],
     *                  aggregates: [{
     *                      columns: [{ 
     *                          type: 'custom', 
     *                          columnName: 'OrderID', 
     *                          customAggregate: customFn, 
     *                          footerTemplate: 'Total count: ${custom}' 
     *                      }]
     *                  }]   
     *  }); 
     *  gridObj.appendTo('#Grid'); 
     * </script>
     * ```
     * 
     * @default null
     */
    @Property()
    public customAggregate: CustomSummaryType;
    /**
     * @hidden
     */
    public setFormatter(): void {
        let valueFormatter: ValueFormatter = new ValueFormatter();
        if (this.format && ((<DateFormatOptions>this.format).skeleton || (<DateFormatOptions>this.format).format)) {
            this.formatFn = valueFormatter.getFormatFunction(this.format as DateFormatOptions);
        }
    }
    /**
     * @hidden
     */
    public getFormatter(): Function {
        return this.formatFn;
    }
    /**
     * @hidden
     */
    public setTemplate(helper: Object = {}): void {
        if (this.footerTemplate !== undefined) {
            this.templateFn[getEnumValue(CellType, CellType.Summary)] = compile(this.footerTemplate, helper);
        }
        if (this.groupFooterTemplate !== undefined) {
            this.templateFn[getEnumValue(CellType, CellType.GroupSummary)] = compile(this.groupFooterTemplate, helper);
        }
        if (this.groupCaptionTemplate !== undefined) {
            this.templateFn[getEnumValue(CellType, CellType.CaptionSummary)] = compile(this.groupCaptionTemplate, helper);
        }
    }
    /**
     * @hidden
     */
    public getTemplate(type: CellType): Function {
        return this.templateFn[getEnumValue(CellType, type)];
    }
}

/**
 * Configures the aggregate row. 
 */
export class AggregateRow extends ChildProperty<AggregateRow> {

    /**
     * Configures the aggregate columns. 
     * @default []
     */
    @Collection<AggregateColumnModel>([], AggregateColumn)
    public columns: AggregateColumnModel[];

}

