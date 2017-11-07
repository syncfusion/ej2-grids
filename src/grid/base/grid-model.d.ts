import { Component, ModuleDeclaration, ChildProperty, Browser, closest } from '@syncfusion/ej2-base';import { isNullOrUndefined } from '@syncfusion/ej2-base';import { createElement, addClass, removeClass, append, remove, classList } from '@syncfusion/ej2-base';import { Property, Collection, Complex, Event, NotifyPropertyChanges, INotifyPropertyChanged, L10n } from '@syncfusion/ej2-base';import { EventHandler, KeyboardEvents, KeyboardEventArgs, EmitType } from '@syncfusion/ej2-base';import { Query, DataManager } from '@syncfusion/ej2-data';import { ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';import { createSpinner, hideSpinner, showSpinner, Tooltip } from '@syncfusion/ej2-popups';import { iterateArrayOrObject, prepareColumns, parentsUntil, wrap, templateCompiler } from './util';import * as events from '../base/constant';import { IRenderer, IValueFormatter, IFilterOperator, IIndex, RowDataBoundEventArgs, QueryCellInfoEventArgs } from './interface';import { CellDeselectEventArgs, CellSelectEventArgs, CellSelectingEventArgs, ParentDetails, ContextMenuItemModel } from './interface';import { PdfQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs, ColumnMenuOpenEventArgs  } from './interface';import { FailureEventArgs, FilterEventArgs, ColumnDragEventArgs, GroupEventArgs, PrintEventArgs, ICustomOptr } from './interface';import { RowDeselectEventArgs, RowSelectEventArgs, RowSelectingEventArgs, PageEventArgs, RowDragEventArgs } from './interface';import { BeforeBatchAddArgs, BeforeBatchDeleteArgs, BeforeBatchSaveArgs, ResizeArgs, ColumnMenuItemModel } from './interface';import { BatchAddArgs, BatchDeleteArgs, BeginEditArgs, CellEditArgs, CellSaveArgs, BeforeDataBoundArgs } from './interface';import { DetailDataBoundEventArgs, ColumnChooserEventArgs, AddEventArgs, SaveEventArgs, EditEventArgs, DeleteEventArgs } from './interface';import { SearchEventArgs, SortEventArgs, ISelectedCell, EJ2Intance, BeforeCopyEventArgs, CheckBoxChangeEventArgs } from './interface';import { Render } from '../renderer/render';import { Column, ColumnModel } from '../models/column';import { Action, SelectionType, GridLine, RenderType, SortDirection, SelectionMode, PrintMode, FilterType, FilterBarMode } from './enum';import { WrapMode, ToolbarItems, ContextMenuItem, ColumnMenuItem } from './enum';import { Data } from '../actions/data';import { CellRendererFactory } from '../services/cell-render-factory';import { ServiceLocator } from '../services/service-locator';import { ValueFormatter } from '../services/value-formatter';import { RendererFactory } from '../services/renderer-factory';import { ColumnWidthService } from '../services/width-controller';import { AriaService } from '../services/aria-service';import { FocusStrategy } from '../services/focus-strategy';import { PageSettingsModel, AggregateRowModel } from '../models/models';import { PageSettings } from '../models/page-settings';import { Sort } from '../actions/sort';import { Page } from '../actions/page';import { Selection } from '../actions/selection';import { Filter } from '../actions/filter';import { Search } from '../actions/search';import { Resize } from '../actions/resize';import { Reorder } from '../actions/reorder';import { RowDD } from '../actions/row-reorder';import { ShowHide } from '../actions/show-hide';import { Scroll } from '../actions/scroll';import { Group } from '../actions/group';import { Print } from '../actions/print';import { DetailRow } from '../actions/detail-row';import { Toolbar } from '../actions/toolbar';import { AggregateRow } from '../models/aggregate';import { Edit } from '../actions/edit';import { Row } from '../models/row';import { ColumnChooser } from '../actions/column-chooser';import { ExcelExport } from '../actions/excel-export';import { PdfExport } from '../actions/pdf-export';import { Clipboard } from '../actions/clipboard';import { CommandColumn } from '../actions/command-column';import { ContextMenu } from '../actions/context-menu';import { BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';import { ColumnMenu } from '../actions/column-menu';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class SortDescriptor
 */
export interface SortDescriptorModel {

    /**
     * Defines the field name of sort column. 
     */
    field?: string;

    /**
     * Defines the direction of sort column. 
     */
    direction?: SortDirection;

}

/**
 * Interface for a class SortSettings
 */
export interface SortSettingsModel {

    /**
     * Specifies the columns to sort at initial rendering of Grid.
     * Also user can get current sorted columns. 
     */
    columns?: SortDescriptorModel[];

    /**
     * If set to false the user can not get the grid in unsorted state by clicking the sorted column header.
     * @default true
     */
    allowUnsort?: boolean;

}

/**
 * Interface for a class Predicate
 */
export interface PredicateModel {

    /**
     * Defines the field name of filter column.  
     */
    field?: string;

    /**
     * Defines the operator by how to filter records. The available operators and its supported data types are 
     * <table> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * Operator<br/></td><td colspan=1 rowspan=1> 
     * Description<br/></td><td colspan=1 rowspan=1> 
     * Supported Types<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * startsWith<br/></td><td colspan=1 rowspan=1> 
     * Checks whether a value begins with the specified value.<br/></td><td colspan=1 rowspan=1> 
     * String<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * endsWith<br/></td><td colspan=1 rowspan=1> 
     * Checks whether a value ends with specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>String<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * contains<br/></td><td colspan=1 rowspan=1> 
     * Checks whether a value contains with specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>String<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * equal<br/></td><td colspan=1 rowspan=1> 
     * Checks whether a value equal to specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>String | Number | Boolean | Date<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * notEqual<br/></td><td colspan=1 rowspan=1> 
     * Checks whether a value not equal to specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>String | Number | Boolean | Date<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * greaterThan<br/></td><td colspan=1 rowspan=1> 
     * Checks whether a value is greater than with specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * Number | Date<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * greaterThanOrEqual<br/></td><td colspan=1 rowspan=1> 
     * Checks whether a value is greater than or equal with specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>Number | Date<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * lessThan<br/></td><td colspan=1 rowspan=1> 
     * Checks whether a value is less than with specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>Number | Date<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * lessThanOrEqual<br/></td><td colspan=1 rowspan=1> 
     * Checks whether a value is less than or equal with specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>Number | Date<br/></td></tr> 
     * </table> 
     */
    operator?: string;

    /**
     * Defines the value which is used to filter records. 
     */
    value?: string | number | Date | boolean;

    /**
     * If match case set to true, then filter records with exact match or else  
     * filter records with case insensitive(uppercase and lowercase letters treated as same).  
     */
    matchCase?: boolean;

    /**
     * Defines the relationship between one filter query with another by using AND or OR predicate.   
     */
    predicate?: string;

    /**
     * @hidden 
     * Defines the actual filter value for the filter column.  
     */
    actualFilterValue?: Object;

    /**
     * @hidden 
     * Defines the actual filter operator for the filter column.  
     */
    actualOperator?: Object;

    /**
     * @hidden 
     * Defines the type of the filter column.  
     */
    type?: string;

    /**
     * @hidden 
     * Defines the predicate of filter column.  
     */
    ejpredicate?: Object;

    /**
     * @hidden 
     * Defines the matchcase of filter column.  
     */
    matchcase?: boolean;

    /**
     * @hidden 
     * Defines the ignoreCase of filter column.  
     */
    ignoreCase?: boolean;

}

/**
 * Interface for a class FilterSettings
 */
export interface FilterSettingsModel {

    /**
     * Specifies the columns to filter at initial rendering of Grid.  
     * Also user can get current filtered columns. 
     */
    columns?: PredicateModel[];

    /**
     * @hidden 
     * Defines options for filtering type. The available options are      
     * * `excel` - Specifies the filter type as excel. 
     * * `filterbar` - Specifies the filter type as filterbar.  
     * @default filterbar 
     */
    type?: FilterType;

    /**
     * Defines the filter bar modes. The available options are  
     * * `onenter` - Initiate filter operation after Enter key is pressed. 
     * * `immediate` -  Initiate filter operation after certain time interval. By default time interval is 1500 ms. 
     * @default onenter 
     */
    mode?: FilterBarMode;

    /**
     * Shows or hides the filtered status message in the pager.  
     * @default true 
     */
    showFilterBarStatus?: boolean;

    /**
     * Defines the delay (in milliseconds) to filter records when the `Immediate` mode of filter bar is set. 
     * @default 1500 
     */
    immediateModeDelay?: number;

    /**
     * Defines the custom operator for Menu filter.
     * @default null
     */
    operators?: ICustomOptr;

}

/**
 * Interface for a class SelectionSettings
 */
export interface SelectionSettingsModel {

    /**
     * Grid supports row, cell and both(row and cell) selection mode. 
     * @default row
     */
    mode?: SelectionMode;

    /**
     * The cell selection modes are flow and box. It requires the selection 
     * [`mode`](http://ej2.syncfusion.com/documentation/grid/api-selectionSettings.html#mode-selectionmode) 
     * to be either cell or both.
     * * `flow` - Select range of cells between the start index and end index which includes in between cells of rows.
     * * `box` - Select range of cells within the start and end column indexes which includes in between cells of rows within the range.
     * @default flow
     */
    cellSelectionMode?: string;

    /**
     * Defines options for selection type. They are 
     * * `single` - Allows user to select only a row or cell. 
     * * `multiple` - Allows user to select multiple rows or cells. 
     * @default single 
     */
    type?: SelectionType;

    /**
     * If 'checkboxOnly' set to true, then the Grid selection is allowed only through checkbox when checkbox type column has been enabled.
     * @default false 
     */
    checkboxOnly?: boolean;

    /**
     * If 'persistSelection' set to true, then the Grid selection is persisted on all operations.
     * For persisting selection on the Grid, any one of the column should be enabled as a primary key.
     * @default false 
     */
    persistSelection?: boolean;

}

/**
 * Interface for a class SearchSettings
 */
export interface SearchSettingsModel {

    /**
     * Specifies the collection of fields which is included in search operation. By default, bounded columns of the Grid are included.  
     */
    fields?: string[];

    /**
     * Specifies the key value to search Grid records at initial rendering.  
     * Also user can get current search key.
     */
    key?: string;

    /**
     * Defines the operator by how to search records. The available operators are 
     * <table> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * Operator<br/></td><td colspan=1 rowspan=1> 
     * Description<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * startsWith<br/></td><td colspan=1 rowspan=1> 
     * Checks whether a string begins with the specified string.<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * endsWith<br/></td><td colspan=1 rowspan=1> 
     * Checks whether a string ends with specified string.<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * contains<br/></td><td colspan=1 rowspan=1> 
     * Checks whether a string contains with specified string. <br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * equal<br/></td><td colspan=1 rowspan=1> 
     * Checks whether a string equal to specified string.<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * notEqual<br/></td><td colspan=1 rowspan=1> 
     * Checks whether a string not equal to specified string. <br/></td></tr> 
     * </table> 
     * @default contains 
     */
    operator?: string;

    /**
     * If `ignoreCase` set to false, then search records with exact match or else  
     * search records with case insensitive(uppercase and lowercase letters treated as same).  
     * @default true 
     */
    ignoreCase?: boolean;

}

/**
 * Interface for a class RowDropSettings
 */
export interface RowDropSettingsModel {

    /**
     * Defines the ID of droppable component on which row drop should occur.   
     */
    targetID?: string;

}

/**
 * Interface for a class TextWrapSettings
 */
export interface TextWrapSettingsModel {

    /**
     * Defines the `wrapMode` of grid. The available modes are   
     * * `both` - Wraps both header and content. 
     * * `content` -Wraps  header alone.
     * * `header` - Wraps  content alone. 
     * @default both
     */
    wrapMode?: WrapMode;

}

/**
 * Interface for a class GroupSettings
 */
export interface GroupSettingsModel {

    /**
     * If `showDropArea` set to true, then the group drop area element will be visible at the top of Grid.     
     * @default true 
     */
    showDropArea?: boolean;

    /**
     * If `showToggleButton` set to true, then the toggle button will be showed in the column headers which can be used to group
     * or ungroup columns by clicking them.
     * @default false   
     */
    showToggleButton?: boolean;

    /**
     * If `showGroupedColumn` set to false, then it hides the grouped column after group.  
     * @default false  
     */
    showGroupedColumn?: boolean;

    /**
     * If `showUngroupButton` set to false, then ungroup button is hidden in dropped element.  
     * It can be used to ungroup the grouped column when click on ungroup button. 
     * @default true 
     */
    showUngroupButton?: boolean;

    /**
     * If `disablePageWiseAggregates` set to true, then the group aggregate value will
     * be calculated from the whole data instead of paged data and two requests will be made for each page
     * when Grid bound with remote service.
     * @default false
     */
    disablePageWiseAggregates?: boolean;

    /**
     * Specifies the column names to group at initial rendering of Grid.  
     * Also user can get current grouped columns.     
     */
    columns?: string[];

    /**
     * The Caption Template allows user to display the string or HTML element in group caption.
     */
    captionTemplate?: string;

}

/**
 * Interface for a class EditSettings
 */
export interface EditSettingsModel {

    /**
     * If `allowAdding` set to true, then you can able to add new record in grid.     
     * @default false 
     */
    allowAdding?: boolean;

    /**
     * If `allowEditing` set to true, then you can able to update values in the existing record.     
     * @default false 
     */
    allowEditing?: boolean;

    /**
     * If `allowDeleting` set to true, then the user can able to delete existing record in the Grid.     
     * @default false 
     */
    allowDeleting?: boolean;

    /**
     * Defines the mode to perform CRUD operations. The available modes are 
     * * Inline
     * * Dialog
     * * Batch        
     * @default normal 
     */
    mode?: string;

    /**
     * If `allowEditOnDblClick` set to false, then Grid will not allow to edit record on double click. 
     * @default true 
     */
    allowEditOnDblClick?: boolean;

    /**
     * If showConfirmDialog set to false, then the confirm dialog does not show while save or discard the batch changes.
     * @default true 
     */
    showConfirmDialog?: boolean;

    /**
     * If `showDeleteConfirmDialog` set to true, then confirm dialog will show at delete action. you can cancel delete command.
     * @default false 
     */
    showDeleteConfirmDialog?: boolean;

}

/**
 * Interface for a class Grid
 */
export interface GridModel extends ComponentModel{

    /**
     * Defines the schema of dataSource. 
     * If the `columns` declaration is empty or undefined then the `columns` are automatically generated from data source.     
     * @default []   
     */
    columns?: Column[] | string[] | ColumnModel[];

    /**
     * If `enableAltRow` set to true, then grid renders row with alternate row styling.   
     * @default true     
     */
    enableAltRow?: boolean;

    /**
     * If `enableHover` set to true, then the row hover will be enabled in Grid.
     * @default true     
     */
    enableHover?: boolean;

    /**
     * Enables or disables the key board interaction of Grid.     
     * @default true     
     * @hidden 
     */
    allowKeyboard?: boolean;

    /**
     * If `allowTextWrap` set to true,  
     * then text content will wrap to the next line when its text content exceeds the width of the Column Cells. 
     * @default false     
     */
    allowTextWrap?: boolean;

    /**
     * Configures the text wrap in the Grid.  
     * @default {wrapMode:"both"}     
     */
    textWrapSettings?: TextWrapSettingsModel;

    /**
     * If `allowPaging` set to true, then the pager renders at the footer of Grid. It is used to handle page navigation in Grid.   
     * @default false     
     */
    allowPaging?: boolean;

    /**
     * Configures the pager in the Grid.  
     * @default {currentPage: 1, pageSize: 12, pageCount: 8, enableQueryString: false, pageSizes: false, template: null}     
     */
    pageSettings?: PageSettingsModel;

    /**
     * If `enableVirtualization` set to true, then the Grid will render only the rows visible within the view-port
     * and load subsequent rows on vertical scrolling. This helps to load large dataset in Grid.
     * @default false
     */
    enableVirtualization?: boolean;

    /**
     * If `enableColumnVirtualization` set to true, then the Grid will render only the columns visible within the view-port
     * and load subsequent columns on horizontal scrolling. This helps to load large dataset of columns in Grid.
     * @default false
     */
    enableColumnVirtualization?: boolean;

    /**
     * Configures the search behavior in the Grid. 
     * @default { ignoreCase: true, fields: [], operator: 'contains', key: '' }    
     */
    searchSettings?: SearchSettingsModel;

    /**
     * If `allowSorting` set to true, then it will allow the user to sort grid records when click on the column header.  
     * @default false    
     */
    allowSorting?: boolean;

    /**
     * If `allowMultiSorting` set to true, then it will allow the user to sort multiple column in the grid.
     * > `allowSorting` should be true.
     * @default false
     */
    allowMultiSorting?: boolean;

    /**
     * If `allowExcelExport` set to true, then it will allow the user to export grid to Excel file.
     * @default false    
     */
    allowExcelExport?: boolean;

    /**
     * If `allowPdfExport` set to true, then it will allow the user to export grid to Pdf file.
     * @default false    
     */
    allowPdfExport?: boolean;

    /**
     * Configures the sort settings.  
     * @default {columns:[]}    
     */
    sortSettings?: SortSettingsModel;

    /**
     * If `allowSelection` set to true, then it will allow the user to select(highlight row) Grid records by click on it.  
     * @default true        
     */
    allowSelection?: boolean;

    /**
     * `selectedRowIndex` allows the user to select a row at initial rendering. 
     * Also, user can get the current selected row index.
     * @default -1        
     */
    selectedRowIndex?: number;

    /**
     * Configures the selection settings.  
     * @default {mode: 'row', cellSelectionMode: 'flow', type: 'single'}    
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * If `allowFiltering` set to true the filter bar will be displayed. 
     * If set to false the filter bar will not be displayed. 
     * Filter bar allows the user to filter grid records with required criteria.        
     * @default false    
     */
    allowFiltering?: boolean;

    /**
     * If `allowReordering` set to true, then the Grid columns can be reordered. 
     * Reordering can be done by drag and drop the particular column from one index to another index.
     * > If Grid rendered with stacked headers, then reordering allows only in same level of column headers.  
     * @default false    
     */
    allowReordering?: boolean;

    /**
     * If `allowResizing` set to true, then the Grid columns can be resized.      
     * @default false    
     */
    allowResizing?: boolean;

    /**
     * If `allowRowDragAndDrop` set to true, then it will allow the user to drag grid rows and drop to another grid.    
     * @default false    
     */
    allowRowDragAndDrop?: boolean;

    /**
     * Configures the row drop settings.  
     * @default {targetID: ''}   
     */
    rowDropSettings?: RowDropSettingsModel;

    /**
     * Configures the filter settings of Grid.  
     * @default {columns: [], type: 'filterbar', mode: 'immediate', showFilterBarStatus: true, immediateModeDelay: 1500, operators: {}}    
     */
    filterSettings?: FilterSettingsModel;

    /**
     * If `allowGrouping` set to true, then it will allow the user to dynamically group or ungroup columns.  
     * Grouping can be done by drag and drop columns from column header to group drop area. 
     * @default false    
     */
    allowGrouping?: boolean;

    /**
     * If `showColumnMenu` set to true, then it will enable the column menu options in each columns.  
     * @default false    
     */
    showColumnMenu?: boolean;

    /**
     * Configures the group settings. 
     * @default {showDropArea: true, showToggleButton: false, showGroupedColumn: false, showUngroupButton: true, columns: []}    
     */
    groupSettings?: GroupSettingsModel;

    /**
     * Configures the edit settings. 
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, mode:'normal',
     * allowEditOnDblClick: true, showConfirmDialog: true, showDeleteConfirmDialog: false }    
     */
    editSettings?: EditSettingsModel;

    /**
     * Configures the Grid aggregate rows.
     * @default []
     */
    aggregates?: AggregateRowModel[];

    /**
     * If `showColumnChooser` set to true, then you can dynamically show or hide columns.  
     * @default false    
     */
    showColumnChooser?: boolean;

    /**
     * Defines the scrollable height of the grid content.    
     * @default auto    
     */
    height?: string | number;

    /**
     * Defines the scrollable width of the grid content.    
     * @default auto    
     */
    width?: string | number;

    /**
     * Defines the grid lines mode. The available modes are   
     * * `both` - Displays both the horizontal and vertical grid lines. 
     * * `none` - No grid lines are displayed.
     * * `horizontal` - Displays the horizontal grid lines only. 
     * * `vertical` - Displays the vertical grid lines only.
     * * `default` - Displays grid lines based on the theme.
     * @default default
     */
    gridLines?: GridLine;

    /**
     * The Row template which renders customized rows from given template. 
     * By default, Grid renders a table row for every data source item.
     * > * It accepts either [template string](http://ej2.syncfusion.com/documentation/base/template-engine.html) or HTML element ID.   
     * > * The row template must be a table row.  
     */
    rowTemplate?: string;

    /**
     * The Detail Template allows user to show or hide additional information about a particular row. 
     * > * It accepts either [template string](http://ej2.syncfusion.com/documentation/base/template-engine.html) or HTML element ID.
     * > * The Detail Template content cannot be wider than the total width of parent Grid, unless the Detail Template is scrollable.
     * 
     * ```html 
     * <script id='detailTemplate'>
     *    <table width="100%" >
     *        <tbody>
     *            <tr>
     *                <td>
     *                    <span style="font-weight: 500;">First Name: </span> ${FirstName}
     *                </td>
     *                <td>
     *                    <span style="font-weight: 500;">Postal Code: </span> ${PostalCode}
     *                </td>
     *            </tr>
     *            <tr>                  
     *                <td>
     *                    <span style="font-weight: 500;">Last Name: </span> ${LastName}
     *                </td>
     *                <td>
     *                    <span style="font-weight: 500;">City: </span> ${City}
     *                </td>
     *            </tr>
     *        </tbody>
     *    </table>
     *  </script>  
     * 
     * <div id="Grid"></div>  
     * ``` 
     * 
     * ```typescript   
     * let grid: Grid = new Grid({
     *  dataSource: employeeData,
     *  detailTemplate: '#detailTemplate',
     *  columns: [
     *   { field: 'FirstName', headerText: 'First Name', width: 110 },
     *   { field: 'LastName', headerText: 'Last Name', width: 110 },
     *   { field: 'Title', headerText: 'Title', width: 150 },
     *   { field: 'Country', headerText: 'Country', width: 110 }
     *  ],
     *  height: 315
     * });
     * grid.appendTo('#Grid');
     * ```               
     */
    detailTemplate?: string;

    /**
     * Defines Grid options to render child Grid. 
     * It requires the [`queryString`](http://ej2.syncfusion.com/documentation/grid/api-grid.html#querystring-string) for parent 
     * and child relationship.
     */
    childGrid?: GridModel;

    /**
     * Defines the relationship between parent and child datasource. It acts as a foreign key for parent datasource.     
     */
    queryString?: string;

    /**
     * Defines the print modes. The available print modes are   
     * * `allpages` - Print all pages records of the Grid. 
     * * `currentpage` - Print current page records of the Grid.
     * @default allpages
     */
    printMode?: PrintMode;

    /**
     * It is used to render grid table rows. 
     * If the `dataSource` is an array of JavaScript objects, 
     * then Grid will create instance of [`DataManager`](http://ej2.syncfusion.com/documentation/data/api-dataManager.html) 
     * from this `dataSource`. 
     * If the `dataSource` is an existing [`DataManager`](http://ej2.syncfusion.com/documentation/data/api-dataManager.html),
     *  the Grid will not initialize a new one. 
     * @default []    
     */
    dataSource?: Object | DataManager;

    /**
     * Defines the row height for Grid rows.
     * @default null
     */
    rowHeight?: number;

    /**
     * Defines the external [`Query`](http://ej2.syncfusion.com/documentation/data/api-query.html) 
     * which will execute along with data processing.    
     * @default null    
     */
    query?: Query;

    /**
     * `toolbar` defines toolbar items for grid. It contains built-in and custom toolbar items. 
     * If a string value is assigned to the `toolbar` option, it will be considered as a template for the whole Grid Toolbar.
     * If an Array value is assigned, it will be considered as the list of built-in and custom toolbar items in the Grid's Toolbar.  
     * <br><br>     
     * The available built-in toolbar items are
     * * add - Add a new record.
     * * edit - Edit the selected record.
     * * update - Update the edited record.
     * * delete - Delete the selected record.
     * * cancel - Cancel the edit state.
     * * search - Searches records by given key.
     * * print - Print the Grid.
     * * excelexport - Export the Grid to Excel(excelExport() method manually to make export.)
     * * pdfexport - Export the Grid to PDF(pdfExport() method manually to make export.)
     * * csvexport - Export the Grid to CSV(csvExport() method manually to make export.)<br><br>
     * The following code example implements the custom toolbar items.
     * ```html
     * <style type="text/css" class="cssStyles">
     * .refreshicon:before
     * {
     *    content:"\e898";
     * }
     * </style>
     * <div id="grid"></div>
     * <script>
     * var gridObj = new Grid({
     * datasource: window.gridData,
     * toolbar : ['Expand', {text: 'Refresh', tooltipText: 'Refresh', prefixIcon: 'refreshicon'}]});
     * //Expand - To display button with Expand label
     * //Refresh - To display button with prefixIcon and text
     * gridObj.appendTo("#grid");
     * </script>
     * ```
     * @default null
     */
    toolbar?: ToolbarItems[] | string[] | ItemModel[];

    /**
     * `contextMenuItems` defines both built-in and custom context menu items.
     * <br><br> 
     * The available default items are   
     * * `autoFitAll` - Auto fit the size of all columns. 
     * * `autoFit` - Auto fit the current column.
     * * `group` - Group by current column. 
     * * `ungroup` - Ungroup by current column.
     * * `edit` - Edit the current record.
     * * `delete` - Delete the current record.
     * * `save` - Save the edited record.
     * * `cancel` - Cancel the edited state.
     * * `copy` - Copy the selected records.
     * * `pdfExport` - Export the grid as Pdf format.
     * * `excelExport` - Export the grid as Excel format.
     * * `csvExport` - Export the grid as CSV format.
     * * `sortAscending` - Sort the current column in ascending order.
     * * `sortDescending` - Sort the current column in descending order.
     * * `firstPage` - Go to the first page.
     * * `prevPage` - Go to the previous page.
     * * `lastPage` - Go to the last page.
     * * `nextPage` - Go to the next page.
     * @default null
     */
    contextMenuItems?: ContextMenuItem[] | ContextMenuItemModel[];

    /**
     * `columnMenuItems` defines both built-in and custom column menu items.
     * <br><br> 
     * The available default items are   
     * * `autoFitAll` - Auto fit the size of all columns. 
     * * `autoFit` - Auto fit the current column.
     * * `group` - Group by current column. 
     * * `ungroup` - Ungroup by current column.
     * * `sortAscending` - Sort the current column in ascending order.
     * * `sortDescending` - Sort the current column in descending order.
     * * `filter` - Filter options will show based on filterSettings property like checkbox filter, excel filter
     * @default null
     */
    columnMenuItems?: ColumnMenuItem[] | ColumnMenuItemModel[];

    /**
     * @hidden
     * It used to render toolbar template
     * @default null
     */
    toolbarTemplate?: string;

    /**
     * @hidden
     * It used to render pager template
     * @default null
     */
    pagerTemplate?: string;

    /**
     * Triggers when the component is created.
     * @event 
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the component is destroyed. 
     * @event 
     */
    destroyed?: EmitType<Object>;

    /**
     * This allows any customization of Grid properties before rendering. 
     * @event 
     */
    load?: EmitType<Object>;

    /**
     * Triggered every time a request is made to access row information, element and data. 
     * This will be triggered before the row element is appended to the Grid element.
     * @event 
     */
    rowDataBound?: EmitType<RowDataBoundEventArgs>;

    /**
     * Triggered every time a request is made to access cell information, element and data.
     * This will be triggered before the cell element is appended to the Grid element.
     * @event 
     */
    queryCellInfo?: EmitType<QueryCellInfoEventArgs>;

    /**
     * Triggers when Grid actions such as Sorting, Filtering, Paging and Grouping etc., starts. 
     * @event
     */
    actionBegin?: EmitType<PageEventArgs | GroupEventArgs | FilterEventArgs | SearchEventArgs | SortEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs>;

    /**
     * Triggers when Grid actions such as Sorting, Filtering, Paging and Grouping etc., completed. 
     * @event 
     */
    actionComplete?: EmitType<PageEventArgs | GroupEventArgs | FilterEventArgs | SearchEventArgs | SortEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs>;

    /**
     * Triggers when any Grid actions failed to achieve desired results. 
     * @event 
     */
    actionFailure?: EmitType<FailureEventArgs>;

    /**
     * Triggers when data source is populated in the Grid.
     * @event 
     */
    dataBound?: EmitType<Object>;

    /**
     * Triggers before any row selection occurs.
     * @event 
     */
    rowSelecting?: EmitType<RowSelectingEventArgs>;

    /**
     * Triggers after any row is selected.
     * @event 
     */
    rowSelected?: EmitType<RowSelectEventArgs>;

    /**
     * Triggers before any particular selected row is deselecting.
     * @event 
     */
    rowDeselecting?: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers when any particular selected row is deselected.
     * @event 
     */
    rowDeselected?: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers before any cell selection occurs.
     * @event 
     */
    cellSelecting?: EmitType<CellSelectingEventArgs>;

    /**
     * Triggers after any cell is selected.
     * @event 
     */
    cellSelected?: EmitType<CellSelectEventArgs>;

    /**
     * Triggers before any particular selected cell is deselecting.
     * @event 
     */
    cellDeselecting?: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers when any particular selected cell is deselected.
     * @event 
     */
    cellDeselected?: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers when a column header element is drag(move) started. 
     * @event  
     */
    columnDragStart?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when a column header element is dragged (moved) continuously. 
     * @event  
     */
    columnDrag?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when a column header element is dropped on target column. 
     * @event  
     */
    columnDrop?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers after print action completed.  
     * @event 
     */
    printComplete?: EmitType<PrintEventArgs>;

    /**
     * Triggers before the print action starts.  
     * @event 
     */
    beforePrint?: EmitType<PrintEventArgs>;

    /**
     * Triggers before exporting each cell to PDF document.
     * @event 
     */
    pdfQueryCellInfo?: EmitType<PdfQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each cell to Excel file.
     * @event
     */
    excelQueryCellInfo?: EmitType<ExcelQueryCellInfoEventArgs>;

    /**
     * Triggers after detail row expanded.
     * > This event triggers at initial expand. 
     * @event 
     */
    detailDataBound?: EmitType<DetailDataBoundEventArgs>;

    /**
     * Triggers when row elements is drag(move) started. 
     * @event  
     */
    rowDragStart?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row elements is dragged (moved) continuously. 
     * @event  
     */
    rowDrag?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row elements is dropped on target row. 
     * @event  
     */
    rowDrop?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when toolbar item is clicked.
     * @event
     */
    toolbarClick?: EmitType<ClickEventArgs>;

    /**
     * Triggers before the columnChooser open.
     * @event
     */
    beforeOpenColumnChooser?: EmitType<ColumnChooserEventArgs>;

    /**
     * Triggers when record added in batch mode.    
     * @event
     */
    batchAdd?: EmitType<BatchAddArgs>;

    /**
     * Triggers when record deleted in batch mode.
     * @event
     */
    batchDelete?: EmitType<BatchDeleteArgs>;

    /**
     * Triggers before record add in batch mode.
     * @event
     */
    beforeBatchAdd?: EmitType<BeforeBatchAddArgs>;

    /**
     * Triggers before record delete in batch mode.
     * @event
     */
    beforeBatchDelete?: EmitType<BeforeBatchDeleteArgs>;

    /**
     * Triggers before records save in batch mode.
     * @event
     */
    beforeBatchSave?: EmitType<BeforeBatchSaveArgs>;

    /**
     * Triggers before the record is going to be edit.
     * @event
     */
    beginEdit?: EmitType<BeginEditArgs>;

    /**
     * Triggers when cell edit.
     * @event
     */
    cellEdit?: EmitType<CellEditArgs>;

    /**
     * Triggers when record cell save.
     * @event
     */
    cellSave?: EmitType<CellSaveArgs>;

    /**
     * Triggers when column resize starts.
     * @event
     */
    resizeStart?: EmitType<ResizeArgs>;

    /**
     * Triggers while column resizing
     * @event
     */
    onResize?: EmitType<ResizeArgs>;

    /**
     * Triggers when column resize ends
     * @event
     */
    resizeStop?: EmitType<ResizeArgs>;

    /**
     * Triggers before data bound to Grid.
     * @event
     */
    beforeDataBound?: EmitType<BeforeDataBoundArgs>;

    /**
     * Triggers before context menu opens.
     * @event
     */
    contextMenuOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers when click on context menu.
     * @event
     */
    contextMenuClick?: EmitType<MenuEventArgs>;

    /**
     * Triggers before column menu opens.
     * @event
     */
    columnMenuOpen?: EmitType<ColumnMenuOpenEventArgs>;

    /**
     * Triggers when click on column menu.
     * @event
     */
    columnMenuClick?: EmitType<MenuEventArgs>;

    /**
     * Triggers when the check box in checkbox type column is changed.
     * @event
     */
    checkBoxChange?: EmitType<CheckBoxChangeEventArgs>;

    /**
     * Triggers before Grid copy action.
     * @event
     */
    beforeCopy?: EmitType<BeforeCopyEventArgs>;

}