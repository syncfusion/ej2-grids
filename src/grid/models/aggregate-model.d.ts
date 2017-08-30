import { compile } from '@syncfusion/ej2-base';import { getEnumValue } from '@syncfusion/ej2-base';import { CustomSummaryType } from '../base/type';import { AggregateType, CellType } from '../base/enum';import { Property, Collection, ChildProperty, NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';import { ValueFormatter } from '../services/value-formatter';

/**
 * Interface for a class AggregateColumn
 */
export interface AggregateColumnModel {

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
    type?: AggregateType | AggregateType[] | string;

    /**
     * Defines the column name to perform aggregation.
     * @default null
     */
    field?: string;

    /**
     * Defines the column name to display the aggregate value.
     * If `columnName` is not defined, then `field` name value will be assigned to the `columnName` property.
     * @default null
     */
    columnName?: string;

    /**
     * The format is applied to the calculated value before it is displayed. 
     * Gets the format from the user which can be standard or custom 
     * [`number`](http://ej2.syncfusion.com/documentation/base/intl.html#number-formatter-and-parser) 
     * and [`date`](http://ej2.syncfusion.com/documentation/base/intl.html#date-formatter-and-parser) formats.  
     * @default null    
     */
    format?: string | NumberFormatOptions | DateFormatOptions;

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
    footerTemplate?: string;

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
    groupFooterTemplate?: string;

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
    groupCaptionTemplate?: string;

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
    customAggregate?: CustomSummaryType;

}

/**
 * Interface for a class AggregateRow
 */
export interface AggregateRowModel {

    /**
     * Configures the aggregate columns. 
     * @default []
     */
    columns?: AggregateColumnModel[];

}