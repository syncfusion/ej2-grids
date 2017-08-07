import { Component, ModuleDeclaration, ChildProperty, compile as templateComplier, Browser } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base/util';
import { createElement, addClass, removeClass, append, remove, classList } from '@syncfusion/ej2-base/dom';
import { Property, Collection, Complex, Event, NotifyPropertyChanges, INotifyPropertyChanged, L10n } from '@syncfusion/ej2-base';
import { EventHandler, KeyboardEvents, KeyboardEventArgs, EmitType } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { GridModel } from './grid-model';
import { iterateArrayOrObject, prepareColumns, parentsUntil } from './util';
import * as events from '../base/constant';
import { IRenderer, IValueFormatter, IFilterOperator, IIndex, RowDataBoundEventArgs, QueryCellInfoEventArgs } from './interface';
import { CellDeselectEventArgs, CellSelectEventArgs, CellSelectingEventArgs, ParentDetails } from './interface';
import { FailureEventArgs, FilterEventArgs, ColumnDragEventArgs, GroupEventArgs, PrintEventArgs } from './interface';
import { RowDeselectEventArgs, RowSelectEventArgs, RowSelectingEventArgs, PageEventArgs, RowDragEventArgs } from './interface';
import { DetailDataBoundEventArgs } from './interface';
import { SearchEventArgs, SortEventArgs, ISelectedCell, EJ2Intance } from './interface';
import { Render } from '../renderer/render';
import { Column, ColumnModel } from '../models/column';
import { Action, SelectionType, GridLine, RenderType, SortDirection, SelectionMode, PrintMode, FilterType, FilterBarMode } from './enum';
import { Data } from '../actions/data';
import { CellRendererFactory } from '../services/cell-render-factory';
import { ServiceLocator } from '../services/service-locator';
import { ValueFormatter } from '../services/value-formatter';
import { RendererFactory } from '../services/renderer-factory';
import { ColumnWidthService } from '../services/width-controller';
import { AriaService } from '../services/aria-service';
import { SortSettingsModel, SelectionSettingsModel, FilterSettingsModel, SearchSettingsModel } from './grid-model';
import { SortDescriptorModel, PredicateModel, RowDropSettingsModel, GroupSettingsModel } from './grid-model';
import { PageSettingsModel, AggregateRowModel } from '../models/models';
import { PageSettings } from '../models/page-settings';
import { Sort } from '../actions/sort';
import { Page } from '../actions/page';
import { Selection } from '../actions/selection';
import { Filter } from '../actions/filter';
import { Search } from '../actions/search';
import { Reorder } from '../actions/reorder';
import { RowDD } from '../actions/row-reorder';
import { ShowHide } from '../actions/show-hide';
import { Scroll } from '../actions/scroll';
import { Group } from '../actions/group';
import { Print } from '../actions/print';
import { DetailRow } from '../actions/detail-row';
import { Toolbar } from '../actions/toolbar';
import { AggregateRow } from '../models/aggregate';

/** 
 * Represents the field name and direction of sort column. 
 */
export class SortDescriptor extends ChildProperty<SortDescriptor> {
    /** 
     * Defines the field name of sort column. 
     */
    @Property()
    public field: string;

    /** 
     * Defines the direction of sort column. 
     */
    @Property()
    public direction: SortDirection;

}

/** 
 * Configures the sorting behavior of Grid. 
 */
export class SortSettings extends ChildProperty<SortSettings> {
    /** 
     * Specifies the columns to sort at initial rendering of Grid.
     * Also user can get current sorted columns. 
     */
    @Collection<SortDescriptorModel>([], SortDescriptor)
    public columns: SortDescriptorModel[];
}

/**  
 * Represents the predicate for filter column.  
 */
export class Predicate extends ChildProperty<Predicate> {

    /**  
     * Defines the field name of filter column.  
     */
    @Property()
    public field: string;

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
    @Property()
    public operator: string;

    /**  
     * Defines the value which is used to filter records. 
     */
    @Property()
    public value: string | number | Date | boolean;

    /**  
     * If match case set to true, then filter records with exact match or else  
     * filter records with case insensitive(uppercase and lowercase letters treated as same).  
     */
    @Property()
    public matchCase: boolean;

    /**   
     * Defines the relationship between one filter query with another by using AND or OR predicate.   
     */
    @Property()
    public predicate: string;

    /**  
     * @hidden 
     * Defines the actual filter value for the filter column.  
     */
    @Property({})
    public actualFilterValue: Object;

    /**  
     * @hidden 
     * Defines the actual filter operator for the filter column.  
     */
    @Property({})
    public actualOperator: Object;
}

/**  
 * Configures the filtering behavior of Grid..  
 */
export class FilterSettings extends ChildProperty<FilterSettings> {
    /**  
     * Specifies the columns to filter at initial rendering of Grid.  
     * Also user can get current filtered columns. 
     */
    @Collection<PredicateModel[]>([], Predicate)
    public columns: PredicateModel[];

    /**  
     * @hidden 
     * Defines options for filtering type. The available options are      
     * * excel - Specifies the filter type as excel. 
     * * filterbar - Specifies the filter type as filterbar.  
     * @default filterbar 
     */
    @Property('filterbar')
    public type: FilterType;

    /**  
     * Defines the filter bar modes. The available options are  
     * * onenter - Initiate filter operation after Enter key is pressed. 
     * * immediate -  Initiate filter operation after certain time interval. By default time interval is 1500 ms. 
     * @default onenter 
     */
    @Property()
    public mode: FilterBarMode;

    /**  
     * Shows or hides the filtered status message in the pager.  
     * @default true 
     */
    @Property(true)
    public showFilterBarStatus: boolean;

    /**  
     * Defines the delay (in milliseconds) to filter records when the `Immediate` mode of filter bar is set. 
     * @default 1500 
     */
    @Property(1500)
    public immediateModeDelay: number;
}

/** 
 * Configures the selection behavior of Grid. 
 */
export class SelectionSettings extends ChildProperty<SelectionSettings> {
    /**  
     * Grid supports row, cell and both(row and cell) selection mode. 
     * @default row
     */
    @Property('row')
    public mode: SelectionMode;

    /** 
     * The cell selection modes are flow and box. It requires the selection 
     * [`mode`](http://ej2.syncfusion.com/documentation/grid/api-selectionSettings.html#mode-selectionmode) 
     * to be either cell or both.
     * * flow - Select range of cells between the start index and end index which includes in between cells of rows.
     * * box - Select range of cells within the start and end column indexes which includes in between cells of rows within the range.
     * @default flow
     */
    @Property('flow')
    public cellSelectionMode: string;

    /**  
     * Defines options for selection type. They are 
     * * single - Allows user to select only a row or cell. 
     * * multiple - Allows user to select multiple rows or cells. 
     * @default single 
     */
    @Property('single')
    public type: SelectionType;
}

/**    
 * Configures the search behavior of Grid.    
 */
export class SearchSettings extends ChildProperty<SearchSettings> {
    /**     
     * Specifies the collection of fields which is included in search operation. By default, bounded columns of the Grid are included.  
     */
    @Property([])
    public fields: string[];

    /**    
     * Specifies the key value to search Grid records at initial rendering.  
     * Also user can get current search key.
     */
    @Property('')
    public key: string;

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
    @Property('contains')
    public operator: string;

    /**  
     * If `ignoreCase` set to false, then search records with exact match or else  
     * search records with case insensitive(uppercase and lowercase letters treated as same).  
     * @default true 
     */
    @Property(true)
    public ignoreCase: boolean;
}

/**   
 * Configures the row drop settings of the Grid.   
 */
export class RowDropSettings extends ChildProperty<RowDropSettings> {
    /**   
     * Defines the ID of droppable component on which row drop should occur.   
     */
    @Property()
    public targetID: string;

}
/**   
 * Configures the group behavior of the Grid.    
 */
export class GroupSettings extends ChildProperty<GroupSettings> {
    /**   
     * If `showDropArea` set to true, then the group drop area element will be visible at the top of Grid.     
     * @default true 
     */
    @Property(true)
    public showDropArea: boolean;

    /**   
     * If `showToggleButton` set to true, then the toggle button will be showed in the column headers which can be used to group
     * or ungroup columns by clicking them.
     * @default false   
     */
    @Property(false)
    public showToggleButton: boolean;

    /**   
     * If `showGroupedColumn` set to false, then it hides the grouped column after group.  
     * @default false  
     */
    @Property(false)
    public showGroupedColumn: boolean;

    /**   
     * If `showUngroupButton` set to false, then ungroup button is hidden in dropped element.  
     * It can be used to ungroup the grouped column when click on ungroup button. 
     * @default true 
     */
    @Property(true)
    public showUngroupButton: boolean;

    /**
     * If `disablePageWiseAggregates` set to true, then the group aggregate value will
     * be calculated from the whole data instead of paged data and two requests will be made for each page
     * when Grid bound with remote service.
     * @default false
     */
    @Property(false)
    public disablePageWiseAggregates: boolean;

    /**   
     * Specifies the column names to group at initial rendering of Grid.  
     * Also user can get current grouped columns.     
     */
    @Property([])
    public columns: string[];

}


/**
 * Represents the Grid component. 
 * ```html
 * <div id="grid"></div>
 * <script>
 *  var gridObj = new Grid({ allowPaging: true });
 *  gridObj.appendTo("#grid");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Grid extends Component<HTMLElement> implements INotifyPropertyChanged {
    // Internal variables  
    private gridPager: Element;
    private isInitial: boolean = true;
    private columnModel: Column[];
    private rowTemplateFn: Function;
    private detailTemplateFn: Function;
    private sortedColumns: string[] = [];
    private footerElement: Element;

    /** @hidden */
    public recordsCount: number;
    /**
     * Gets the current visible records of Grid.
     */
    public currentViewData: Object[];
    /** @hidden */
    public parentDetails: ParentDetails;
    /** @hidden */
    public currentAction: Action;
    /** @hidden */
    public filterOperators: IFilterOperator = {
        contains: 'contains', endsWith: 'endswith', equal: 'equal', greaterThan: 'greaterthan', greaterThanOrEqual: 'greaterthanorequal',
        lessThan: 'lessthan', lessThanOrEqual: 'lessthanorequal', notEqual: 'notequal', startsWith: 'startswith'
    };
    /** @hidden */
    public localeObj: L10n;
    private defaultLocale: Object = {
        EmptyRecord: 'No records to display',
        True: 'true',
        False: 'false',
        InvalidFilterMessage: 'Invalid Filter Data',
        GroupDropArea: 'Drag a column header here to group its column',
        UnGroup: 'Click here to ungroup',
        GroupDisable: 'Grouping is disabled for this column',
        FilterbarTitle: '\'s filter bar cell',
        EmptyDataSourceError:
        'DataSource must not be empty at initial load since columns are generated from dataSource in AutoGenerate Column Grid',
        // Toolbar Items
        Add: 'Add',
        Edit: 'Edit',
        Cancel: 'Cancel',
        Update: 'Update',
        Delete: 'Delete',
        Print: 'Print',
        Pdfexport: 'PDF Export',
        Excelexport: 'Excel Export',
        Wordexport: 'Word Export',
        Search: 'Search',
        Item: 'item',
        Items: 'items'

    };
    private keyConfigs: { [key: string]: string } = {
        downArrow: 'downarrow',
        upArrow: 'uparrow',
        rightArrow: 'rightarrow',
        leftArrow: 'leftarrow',
        shiftDown: 'shift+downarrow',
        shiftUp: 'shift+uparrow',
        shiftRight: 'shift+rightarrow',
        shiftLeft: 'shift+leftarrow',
        home: 'home',
        end: 'end',
        escape: 'escape',
        ctrlHome: 'ctrl+home',
        ctrlEnd: 'ctrl+end',
        pageUp: 'pageup',
        pageDown: 'pagedown',
        ctrlAltPageUp: 'ctrl+alt+pageup',
        ctrlAltPageDown: 'ctrl+alt+pagedown',
        altPageUp: 'alt+pageup',
        altPageDown: 'alt+pagedown',
        altDownArrow: 'alt+downarrow',
        altUpArrow: 'alt+uparrow',
        ctrlDownArrow: 'ctrl+downarrow',
        ctrlUpArrow: 'ctrl+uparrow',
        ctrlPlusA: 'ctrl+A',
         ctrlPlusP: 'ctrl+P'

    };

    //Module Declarations
    /**
     * @hidden
     */
    public renderModule: Render;
    /**
     * @hidden
     */
    public headerModule: IRenderer;
    /**
     * @hidden
     */
    public contentModule: IRenderer;
    /**
     * @hidden
     */
    public valueFormatterService: IValueFormatter;
    /**
     * @hidden
     */
    public serviceLocator: ServiceLocator;
    /**
     * @hidden
     */
    public ariaService: AriaService;
    /**
     * `keyboardModule` is used to manipulate keyboard interactions in the Grid.
     */
    public keyboardModule: KeyboardEvents;
    /**
     * @hidden
     */
    public widthService: ColumnWidthService;

    /**
     * `rowDragAndDropModule` is used to manipulate row reordering in the Grid.
     */
    public rowDragAndDropModule: RowDD;
    /**
     * `pagerModule` is used to manipulate paging in the Grid.
     */
    public pagerModule: Page;
    /**
     * `sortModule` is used to manipulate sorting in the Grid.
     */
    public sortModule: Sort;
    /**
     * `filterModule` is used to manipulate filtering in the Grid.
     */
    public filterModule: Filter;
    /**
     * `selectionModule` is used to manipulate selection behavior in the Grid.
     */
    public selectionModule: Selection;
    /**
     * `showHiderModule` is used to manipulate column show/hide operation in the Grid.
     */
    public showHider: ShowHide;
    /**
     * `searchModule` is used to manipulate searching in the Grid.
     */
    public searchModule: Search;
    /**
     * `scrollModule` is used to manipulate scrolling in the Grid.
     */
    public scrollModule: Scroll;
    /**
     * `reorderModule` is used to manipulate reordering in the Grid.
     */
    public reorderModule: Reorder;
    /**
     * `groupModule` is used to manipulate grouping behavior from the Grid.
     */
    public groupModule: Group;
    /**
     * `printModule` is used to manipulate printing feature in the Grid.
     */
    public printModule: Print;

    /**
     * `detailRowModule` is used to handle detail rows rendering in the Grid.
     * @hidden
     */
    public detailRowModule: DetailRow;

    /**     
     * `toolbarModule` is used to manipulate toolbar items in the Grid.
     */
    public toolbarModule: Toolbar;


    //Grid Options    

    /**     
     * Defines the schema of dataSource. 
     * If the `columns` declaration is empty or undefined then the `columns` are automatically generated from data source.     
     * @default []   
     */
    @Property([])
    public columns: Column[] | string[] | ColumnModel[];

    /**     
     * If `enableAltRow` set to true, then grid renders row with alternate row styling.   
     * @default true     
     */
    @Property(true)
    public enableAltRow: boolean;

    /**     
     * If `enableHover` set to true, then the row hover will be enabled in Grid.
     * @default true     
     */
    @Property(true)
    public enableHover: boolean;

    /**    
     * Enables or disables the key board interaction of Grid.     
     * @default true     
     * @hidden 
     */
    @Property(true)
    public allowKeyboard: boolean;

    /**   
     * If `allowTextWrap` set to true,  
     * then text content will wrap to the next line when its text content exceeds the width of the Column Cells. 
     * @default false     
     */
    @Property(false)
    public allowTextWrap: boolean;

    /**    
     * If `allowPaging` set to true, then the pager renders at the footer of Grid. It is used to handle page navigation in Grid.   
     * @default false     
     */
    @Property(false)
    public allowPaging: boolean;

    /**     
     * Configures the pager in the Grid.  
     * @default PageSettings{currentPage: 1, pageSize: 12, pageCount: 8, enableQueryString: false}     
     */
    @Complex<PageSettingsModel>({}, PageSettings)
    public pageSettings: PageSettingsModel;

    /**    
     * Configures the search behavior in the Grid. 
     * @default SearchSettings{ ignoreCase: true, fields: [], operator: 'contains', key: '' }    
     */
    @Complex<SearchSettingsModel>({}, SearchSettings)
    public searchSettings: SearchSettingsModel;

    /**    
     * If `allowSorting` set to true, then it will allow the user to sort grid records when click on the column header.  
     * @default false    
     */
    @Property(false)
    public allowSorting: boolean;

    /**    
     * Configures the sort settings.  
     * @default {columns:[]}    
     */
    @Complex<SortSettingsModel>({}, SortSettings)
    public sortSettings: SortSettingsModel;

    /**    
     * If `allowSelection` set to true, then it will allow the user to select(highlight row) Grid records by click on it.  
     * @default true        
     */
    @Property(true)
    public allowSelection: boolean;

    /**    
     * `selectedRowIndex` allows the user to select a row at initial rendering. 
     * Also, user can get the current selected row index.
     * @default -1        
     */
    @Property()
    public selectedRowIndex: number;

    /**    
     * Configures the selection settings.  
     * @default {mode: 'row', cellSelectionMode: 'flow', type: 'single'}    
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;

    /**    
     * If `allowFiltering` set to true the filter bar will be displayed. 
     * If set to false the filter bar will not be displayed. 
     * Filter bar allows the user to filter grid records with required criteria.        
     * @default false    
     */
    @Property(false)
    public allowFiltering: boolean;

    /**    
     * If `allowReordering` set to true, then the Grid columns can be reordered. 
     * Reordering can be done by drag and drop the particular column from one index to another index.
     * > If Grid rendered with stacked headers, then reordering allows only in same level of column headers.  
     * @default false    
     */
    @Property(false)
    public allowReordering: boolean;

    /**    
     * If `allowRowDragAndDrop` set to true, then it will allow the user to drag grid rows and drop to another grid.    
     * @default false    
     */
    @Property(false)
    public allowRowDragAndDrop: boolean;

    /**   
     * Configures the row drop settings.  
     * @default {targetID: ''}   
     */
    @Complex<RowDropSettingsModel>({}, RowDropSettings)
    public rowDropSettings: RowDropSettingsModel;

    /**    
     * Configures the filter settings of Grid.  
     * @default {columns: [], type: 'filterbar', mode: 'immediate', showFilterBarStatus: true, immediateModeDelay: 1500}    
     */
    @Complex<FilterSettingsModel>({}, FilterSettings)
    public filterSettings: FilterSettingsModel;

    /**    
     * If `allowGrouping` set to true, then it will allow the user to dynamically group or ungroup columns.  
     * Grouping can be done by drag and drop columns from column header to group drop area. 
     * @default false    
     */
    @Property(false)
    public allowGrouping: boolean;

    /**    
     * Configures the group settings. 
     * @default {showDropArea: true, showToggleButton: false, showGroupedColumn: false, showUngroupButton: true, columns: []}    
     */
    @Complex<GroupSettingsModel>({}, GroupSettings)
    public groupSettings: GroupSettingsModel;

    /**
     * Configures the Grid aggregate rows.
     * @default []
     */
    @Collection<AggregateRowModel>([], AggregateRow)
    public aggregates: AggregateRowModel[];

    /**    
     * Defines the scrollable height of the grid content.    
     * @default auto    
     */
    @Property('auto')
    public height: string | number;

    /**    
     * Defines the scrollable width of the grid content.    
     * @default auto    
     */
    @Property('auto')
    public width: string | number;

    /**   
     * Defines the grid lines mode. The available modes are   
     * * `both` - Displays both the horizontal and vertical grid lines. 
     * * `none` - No grid lines are displayed.
     * * `horizontal` - Displays the horizontal grid lines only. 
     * * `vertical` - Displays the vertical grid lines only.
     * * `default` - Displays grid lines based on the theme.
     * @default default
     */
    @Property('default')
    public gridLines: GridLine;

    /**    
     * The Row template which renders customized rows from given template. 
     * By default, Grid renders a table row for every data source item.
     * > * It accepts either [template string](http://ej2.syncfusion.com/documentation/base/template-engine.html) or HTML element ID.   
     * > * The row template must be a table row.  
     */
    @Property()
    public rowTemplate: string;

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
    @Property()
    public detailTemplate: string;

    /**    
     * Defines Grid options to render child Grid. 
     * It requires the [`queryString`](http://ej2.syncfusion.com/documentation/grid/api-grid.html#querystring-string) for parent 
     * and child relationship.
     */
    @Property()
    public childGrid: GridModel;

    /**
     * Defines the relationship between parent and child datasource. It acts as a foreign key for parent datasource.     
     */
    @Property()
    public queryString: string;

    /**   
     * Defines the print modes. The available print modes are   
     * * `allpages` - Print all pages records of the Grid. 
     * * `currentpage` - Print current page records of the Grid.
     * @default allpages
     */
    @Property('allpages')
    public printMode: PrintMode;

    /**    
     * It is used to render grid table rows. 
     * If the `dataSource` is an array of JavaScript objects, 
     * then Grid will create instance of [`DataManager`](http://ej2.syncfusion.com/documentation/data/api-dataManager.html) 
     * from this `dataSource`. 
     * If the `dataSource` is an existing [`DataManager`](http://ej2.syncfusion.com/documentation/data/api-dataManager.html),
     *  the Grid will not initialize a new one. 
     * @default []    
     */
    @Property([])
    public dataSource: Object | DataManager;

    /**    
     * Defines the external [`Query`](http://ej2.syncfusion.com/documentation/data/api-query.html) 
     * which will execute along with data processing.    
     * @default null    
     */
    @Property()
    public query: Query;

    /**    
     * `toolbar` defines toolbar items for grid. It contains built-in and custom toolbar items. 
     * If a string value is assigned to the `toolbar` option, it will be treated as a single string template for the whole Grid Toolbar.
     * If an Array value is assigned, it will be treated as the list of built-in and custom toolbar items in the Grid's Toolbar. 
     * <br><br>     
     * The available built-in toolbar items are  
     * * search - Searches records by given key.
     * * print - Print the Grid.<br><br>
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
    @Property()
    public toolbar: string | string[] | ItemModel[];

    /** 
     * Triggers when the component is created.
     * @event 
     */
    @Event()
    public created: EmitType<Object>;

    /** 
     * Triggers when the component is destroyed. 
     * @event 
     */
    @Event()
    public destroyed: EmitType<Object>;

    /** 
     * This allows any customization of Grid properties before rendering. 
     * @event 
     */
    @Event()
    public load: EmitType<Object>;
    /** 
     * Triggered every time a request is made to access row information, element and data. 
     * This will be triggered before the row element is appended to the Grid element.
     * @event 
     */
    @Event()
    public rowDataBound: EmitType<RowDataBoundEventArgs>;

    /** 
     * Triggered every time a request is made to access cell information, element and data.
     * This will be triggered before the cell element is appended to the Grid element.
     * @event 
     */
    @Event()
    public queryCellInfo: EmitType<QueryCellInfoEventArgs>;
    /** 
     * Triggers when Grid actions such as Sorting, Filtering, Paging and Grouping etc., starts. 
     * @event
     */
    @Event()
    public actionBegin: EmitType<PageEventArgs | GroupEventArgs | FilterEventArgs | SearchEventArgs | SortEventArgs>;

    /** 
     * Triggers when Grid actions such as Sorting, Filtering, Paging and Grouping etc., completed. 
     * @event 
     */
    @Event()
    public actionComplete: EmitType<PageEventArgs | GroupEventArgs | FilterEventArgs | SearchEventArgs | SortEventArgs>;

    /** 
     * Triggers when any Grid actions failed to achieve desired results. 
     * @event 
     */
    @Event()
    public actionFailure: EmitType<FailureEventArgs>;

    /** 
     * Triggers when data source is populated in the Grid.
     * @event 
     */
    @Event()
    public dataBound: EmitType<Object>;

    /** 
     * Triggers before any row selection occurs.
     * @event 
     */
    @Event()
    public rowSelecting: EmitType<RowSelectingEventArgs>;

    /** 
     * Triggers after any row is selected.
     * @event 
     */
    @Event()
    public rowSelected: EmitType<RowSelectEventArgs>;

    /** 
     * Triggers before any particular selected row is deselecting.
     * @event 
     */
    @Event()
    public rowDeselecting: EmitType<RowDeselectEventArgs>;

    /** 
     * Triggers when any particular selected row is deselected.
     * @event 
     */
    @Event()
    public rowDeselected: EmitType<RowDeselectEventArgs>;

    /** 
     * Triggers before any cell selection occurs.
     * @event 
     */
    @Event()
    public cellSelecting: EmitType<CellSelectingEventArgs>;

    /** 
     * Triggers after any cell is selected.
     * @event 
     */
    @Event()
    public cellSelected: EmitType<CellSelectEventArgs>;

    /** 
     * Triggers before any particular selected cell is deselecting.
     * @event 
     */
    @Event()
    public cellDeselecting: EmitType<CellDeselectEventArgs>;

    /** 
     * Triggers when any particular selected cell is deselected.
     * @event 
     */
    @Event()
    public cellDeselected: EmitType<CellDeselectEventArgs>;

    /**  
     * Triggers when a column header element is drag(move) started. 
     * @event  
     */
    @Event()
    public columnDragStart: EmitType<ColumnDragEventArgs>;

    /**  
     * Triggers when a column header element is dragged (moved) continuously. 
     * @event  
     */
    @Event()
    public columnDrag: EmitType<ColumnDragEventArgs>;

    /**  
     * Triggers when a column header element is dropped on target column. 
     * @event  
     */
    @Event()
    public columnDrop: EmitType<ColumnDragEventArgs>;

    /** 
     * Triggers after print action completed.  
     * @event 
     */
    @Event()
    public printComplete: EmitType<PrintEventArgs>;

    /** 
     * Triggers before the print action starts.  
     * @event 
     */
    @Event()
    public beforePrint: EmitType<PrintEventArgs>;

    /** 
     * Triggers after detail row expanded.
     * > This event triggers at initial expand. 
     * @event 
     */
    @Event()
    public detailDataBound: EmitType<DetailDataBoundEventArgs>;

    /**  
     * Triggers when row elements is drag(move) started. 
     * @event  
     */
    @Event()
    public rowDragStart: EmitType<RowDragEventArgs>;

    /**  
     * Triggers when row elements is dragged (moved) continuously. 
     * @event  
     */
    @Event()
    public rowDrag: EmitType<RowDragEventArgs>;

    /**  
     * Triggers when row elements is dropped on target row. 
     * @event  
     */
    @Event()
    public rowDrop: EmitType<RowDragEventArgs>;

    /**      
     * Triggers when toolbar item is clicked.
     * @event
     */
    @Event()
    public toolbarClick: EmitType<ClickEventArgs>;

    /**
     * Constructor for creating the component
     * @hidden
     */
    constructor(options?: GridModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     * @hidden
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['allowPaging', 'pageSettings', 'allowSorting', 'sortSettings', 'allowSelection',
            'selectionSettings', 'allowFiltering', 'filterSettings', 'gridLines',
            'created', 'destroyed', 'load', 'actionBegin', 'actionComplete', 'actionFailure', 'rowSelecting', 'rowSelected',
            'columnSelecting', 'columnSelected', 'cellSelecting', 'cellSelected', 'dataBound', 'groupSettings', 'columns', 'allowKeyboard',
            'enableAltRow', 'enableHover', 'allowTextWrap', 'searchSettings', 'selectedRowIndex', 'allowReordering',
            'allowRowDragAndDrop', 'rowDropSettings', 'allowGrouping', 'height', 'width', 'rowTemplate', 'printMode',
            'rowDataBound', 'queryCellInfo', 'rowDeselecting', 'rowDeselected', 'cellDeselecting', 'cellDeselected',
            'columnDragStart', 'columnDrag', 'columnDrop', 'printComplete', 'beforePrint', 'detailDataBound', 'detailTemplate',
            'childGrid', 'queryString', 'toolbar', 'toolbarClick'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        if (this.allowFiltering) {
            modules.push({
                member: 'filter',
                args: [this, this.filterSettings, this.serviceLocator]
            });
        }
        if (this.allowSorting) {
            modules.push({
                member: 'sort',
                args: [this, this.sortSettings, this.sortedColumns]
            });
        }
        if (this.allowPaging) {
            modules.push({
                member: 'pager',
                args: [this, this.pageSettings]
            });
        }
        if (this.allowSelection) {
            modules.push({
                member: 'selection',
                args: [this, this.selectionSettings]
            });
        }
        if (this.allowReordering) {
            modules.push({
                member: 'reorder',
                args: [this]
            });
        }
        if (this.allowRowDragAndDrop) {
            modules.push({
                member: 'rowDragAndDrop',
                args: [this]
            });
        }
        if (this.allowGrouping) {
            modules.push({
                member: 'group',
                args: [this, this.groupSettings, this.sortedColumns, this.serviceLocator]
            });
        }
        if (this.aggregates.length) {
            modules.push({ member: 'aggregate', args: [this, this.serviceLocator] });
        }
        if (this.isDetail()) {
            modules.push({
                member: 'detailRow',
                args: [this]
            });
        }
        if (this.toolbar) {
            modules.push({
                member: 'toolbar',
                args: [this, this.serviceLocator]
            });
        }

        return modules;
    }

    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    protected preRender(): void {
        this.serviceLocator = new ServiceLocator;
    }

    /**
     * For internal use only - To Initialize the component rendering.
     * @private
     */
    protected render(): void {
        this.initializeServices();
        this.ariaService.setOptions(this.element, { role: 'grid' });
        this.renderModule = new Render(this, this.serviceLocator);
        this.searchModule = new Search(this);
        this.scrollModule = new Scroll(this);
        this.notify(events.initialLoad, {});
        this.trigger(events.load);
        prepareColumns(this.columns as Column[]);
        this.getColumns();
        this.processModel();
        this.gridRender();
        this.wireEvents();
        this.addListener();
        this.updateDefaultCursor();
        this.notify(events.initialEnd, {});
    }

    /**
     * For internal use only - Initialize the event handler
     * @private
     */
    protected eventInitializer(): void {
        //eventInitializer
    }

    /**
     * To destroy the component(Detaches/removes all event handlers, attributes, classes and empty the component element).
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        this.unwireEvents();
        this.removeListener();
        this.notify(events.destroy, {});
        this.destroyDependentModules();
        super.destroy();
        this.element.innerHTML = '';
        classList(this.element, [], ['e-rtl', 'e-gridhover', 'e-responsive', 'e-default', 'e-device']);
    }

    private destroyDependentModules(): void {
        this.scrollModule.destroy();
        this.keyboardModule.destroy();
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'grid';
    }

    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    public onPropertyChanged(newProp: GridModel, oldProp: GridModel): void {
        let requireRefresh: boolean = false;
        let checkCursor: boolean;
        let args: Object = { requestType: 'refresh' };
        if (this.isDestroyed) { return; }
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'enableHover':
                    let action: Function = newProp.enableHover ? addClass : removeClass;
                    (<Function>action)([this.element], 'e-gridhover');
                    break;
                case 'dataSource':
                    this.notify(events.dataSourceModified, {});
                    this.renderModule.refresh();
                    break;
                case 'allowPaging':
                    this.notify(events.uiUpdate, { module: 'pager', enable: this.allowPaging });
                    requireRefresh = true;
                    break;
                case 'pageSettings':
                    this.notify(events.inBoundModelChanged, { module: 'pager', properties: newProp.pageSettings });
                    if (isNullOrUndefined(newProp.pageSettings.currentPage) && isNullOrUndefined(newProp.pageSettings.totalRecordsCount)) {
                        requireRefresh = true;
                    }
                    break;
                case 'locale':
                    this.localeObj.setLocale(newProp.locale);
                    this.valueFormatterService.setCulture(newProp.locale);
                    requireRefresh = true;
                    if (this.toolbar) {
                        this.notify(events.uiUpdate, { module: 'toolbar' });
                    }
                    break;
                case 'allowSorting':
                    this.notify(events.uiUpdate, { module: 'sort', enable: this.allowSorting });
                    requireRefresh = true;
                    checkCursor = true;
                    break;
                case 'allowFiltering':
                    this.notify(events.uiUpdate, { module: 'filter', enable: this.allowFiltering });
                    requireRefresh = true;
                    break;
                case 'height':
                case 'width':
                    this.notify(events.uiUpdate, {
                        module: 'scroll',
                        properties: { width: newProp.width, height: newProp.height }
                    });
                    break;
                case 'allowReordering':
                    this.notify(events.uiUpdate, { module: 'reorder', enable: this.allowReordering });
                    checkCursor = true;
                    break;
                case 'allowRowDragAndDrop':
                    this.notify(events.uiUpdate, { module: 'rowDragAndDrop', enable: this.allowRowDragAndDrop });
                    break;
                case 'rowTemplate':
                    this.rowTemplateFn = this.templateComplier(this.rowTemplate);
                    requireRefresh = true;
                    break;
                case 'detailTemplate':
                    this.detailTemplateFn = this.templateComplier(this.detailTemplate);
                    requireRefresh = true;
                    break;
                case 'allowGrouping':
                    this.notify(events.uiUpdate, { module: 'group', enable: this.allowGrouping });
                    this.headerModule.refreshUI();
                    requireRefresh = true;
                    checkCursor = true;
                    break;
                case 'childGrid':
                    requireRefresh = true;
                    break;
                case 'toolbar':
                    this.notify(events.uiUpdate, { module: 'toolbar' });
                    break;
                case 'groupSettings':
                    if (!(isNullOrUndefined(newProp.groupSettings.showDropArea))) {
                        this.headerModule.refreshUI();
                        requireRefresh = true;
                        checkCursor = true;
                    }
                    this.notify(events.inBoundModelChanged, { module: 'group', properties: newProp.groupSettings });
                    break;

                case 'aggregates':
                    this.notify(events.uiUpdate, { module: 'aggregate', properties: newProp });
                    break;
                default:
                    this.extendedPropertyChange(prop, newProp);
            }
        }
        if (checkCursor) {
            this.updateDefaultCursor();
        }
        if (requireRefresh) {
            this.notify(events.modelChanged, args);
            requireRefresh = false;
        }

    }

    private extendedPropertyChange(prop: string, newProp: GridModel): void {
        switch (prop) {
            case 'enableRtl':
                this.updateRTL();
                if (this.allowPaging) {
                    (<EJ2Intance>this.element.querySelector('.e-gridpager')).ej2_instances[0].enableRtl = newProp.enableRtl;
                    (<EJ2Intance>this.element.querySelector('.e-gridpager')).ej2_instances[0].dataBind();
                }
                if (this.height !== 'auto') {
                    this.scrollModule.removePadding(!newProp.enableRtl);
                    this.scrollModule.setPadding();
                }
                if (this.toolbar) {
                    (<EJ2Intance>this.toolbarModule.getToolbar()).ej2_instances[0].enableRtl = newProp.enableRtl;
                    (<EJ2Intance>this.toolbarModule.getToolbar()).ej2_instances[0].dataBind();
                }
                break;
            case 'enableAltRow':
                this.renderModule.refresh();
                break;
            case 'gridLines':
                this.updateGridLines();
                break;
            case 'filterSettings':
                this.notify(events.inBoundModelChanged, { module: 'filter', properties: newProp.filterSettings });
                break;
            case 'searchSettings':
                this.notify(events.inBoundModelChanged, { module: 'search', properties: newProp.searchSettings });
                break;
            case 'sortSettings':
                this.notify(events.inBoundModelChanged, { module: 'sort' });
                break;
            case 'selectionSettings':
                this.notify(events.inBoundModelChanged, { module: 'selection', properties: newProp.selectionSettings });
                break;
            case 'allowTextWrap':
                if (this.allowTextWrap) {
                    this.applyTextWrap();
                } else {
                    this.removeTextWrap();
                }
                break;
        }
    }

    private updateDefaultCursor(): void {
        let headerRows: Element[] = [].slice.call(this.element.querySelectorAll('.e-columnheader'));
        for (let row of headerRows) {
            if (this.allowSorting || this.allowGrouping || this.allowReordering) {
                row.classList.remove('e-defaultcursor');
            } else {
                row.classList.add('e-defaultcursor');
            }
        }
    }

    private updateColumnModel(columns: Column[]): void {
        for (let i: number = 0, len: number = columns.length; i < len; i++) {
            if (columns[i].columns) {
                this.updateColumnModel(columns[i].columns as Column[]);
            } else {
                this.columnModel.push(columns[i] as Column);
            }
        }
    }

    /**
     * Gets the columns from Grid.
     * @return {Column[]} 
     */
    public getColumns(): Column[] {
        this.columnModel = [];
        this.updateColumnModel(this.columns as Column[]);
        return this.columnModel;
    }

    /**
     * Gets the visible columns from Grid.
     * @return {Column[]} 
     */
    public getVisibleColumns(): Column[] {
        let cols: Column[] = [];
        for (let col of this.columnModel) {
            if (col.visible) {
                cols.push(col);
            }
        }
        return cols;
    }

    /**
     * Gets the header div of Grid. 
     * @return {Element} 
     */
    public getHeaderContent(): Element {
        return this.headerModule.getPanel();
    }

    /**
     * Sets the header div of Grid to replace the old header.
     * @param  {Element} element - Specifies the Grid header.
     * @return {void}
     */
    public setGridHeaderContent(element: Element): void {
        this.headerModule.setPanel(element);
    }

    /**
     * Gets the content table of Grid.
     * @return {Element} 
     */
    public getContentTable(): Element {
        return this.contentModule.getTable();
    }

    /**
     * Sets the content table of Grid to replace old content table.
     * @param  {Element} element - Specifies the Grid content table.
     * @return {void}
     */
    public setGridContentTable(element: Element): void {
        this.contentModule.setTable(element);
    }

    /**
     * Gets the content div of Grid.
     * @return {Element} 
     */
    public getContent(): Element {
        return this.contentModule.getPanel();
    }

    /**
     * Sets the content div of Grid to replace the old Grid content.
     * @param  {Element} element - Specifies the Grid content.
     * @return {void}
     */
    public setGridContent(element: Element): void {
        this.contentModule.setPanel(element);
    }

    /**
     * Gets the header table element of Grid.
     * @return {Element} 
     */
    public getHeaderTable(): Element {
        return this.headerModule.getTable();
    }

    /**
     * Sets the header table of Grid to replace old header table.
     * @param  {Element} element - Specifies the Grid header table.
     * @return {void}
     */
    public setGridHeaderTable(element: Element): void {
        this.headerModule.setTable(element);
    }

    /**
     * Gets the footer div of Grid.
     * @return {Element} 
     */
    public getFooterContent(): Element {
        if (isNullOrUndefined(this.footerElement)) {
            this.footerElement = this.element.getElementsByClassName('e-gridfooter')[0];
        }

        return this.footerElement;
    }

    /**
     * Gets the footer table element of Grid.
     * @return {Element} 
     */
    public getFooterContentTable(): Element {
        if (isNullOrUndefined(this.footerElement)) {
            this.footerElement = this.element.getElementsByClassName('e-gridfooter')[0];
        }

        return <Element>this.footerElement.firstChild.firstChild;
    }


    /**
     * Gets the pager of Grid.
     * @return {Element} 
     */
    public getPager(): Element {
        return this.gridPager; //get element from pager
    }

    /**
     * Sets the pager of Grid to replace old pager.
     * @param  {Element} element - Specifies the Grid pager.
     * @return {void}
     */
    public setGridPager(element: Element): void {
        this.gridPager = element;
    }

    /**
     * Gets a row by index.
     * @param  {number} index - Specifies the row index.
     * @return {Element} 
     */
    public getRowByIndex(index: number): Element {
        return this.getDataRows()[index];
    }

    /**
     * Gets all the Grid's content rows.
     * @return {Element[]} 
     */
    public getRows(): Element[] {
        return this.contentModule.getRowElements();
    }

    /**
     * Gets all the Grid's data rows.
     * @return {Element[]} 
     */
    public getDataRows(): Element[] {
        let rows: NodeList = this.getContentTable().querySelector('tbody').children;
        let dataRows: Element[] = [];
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            if ((rows[i] as Element).classList.contains('e-row')) {
                dataRows.push(rows[i] as Element);
            }
        }
        return dataRows;
    }

    /**
     * Gets a cell by row and column index.
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @return {Element} 
     */
    public getCellFromIndex(rowIndex: number, columnIndex: number): Element {
        return this.getDataRows()[rowIndex].querySelectorAll('.e-rowcell')[columnIndex];
    }

    /**
     * Gets a column header by column index.
     * @param  {number} index - Specifies the column index.
     * @return {Element} 
     */
    public getColumnHeaderByIndex(index: number): Element {
        return this.getHeaderTable().querySelectorAll('.e-headercell')[index];
    }

    /**
     * Gets a column header by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Element} 
     */
    public getColumnHeaderByField(field: string): Element {
        return this.getColumnHeaderByUid(this.getColumnByField(field).uid);
    }

    /**
     * Gets a column header by uid.
     * @param  {string} field - Specifies the column uid.
     * @return {Element} 
     */
    public getColumnHeaderByUid(uid: string): Element {
        return this.getHeaderContent().querySelector('[e-mappinguid=' + uid + ']').parentElement;
    }

    /**
     * Gets a Column by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Column}
     */
    public getColumnByField(field: string): Column {
        return iterateArrayOrObject<Column, Column>(<Column[]>this.getColumns(), (item: Column, index: number) => {
            if (item.field === field) {
                return item;
            }
            return undefined;
        })[0];
    }

    /**
     * Gets a column index by column name.
     * @param  {string} field - Specifies the column name.
     * @return {number}
     */
    public getColumnIndexByField(field: string): number {
        let index: number = iterateArrayOrObject<number, Column>(
            <Column[]>this.getColumns(), (item: Column, index: number) => {
                if (item.field === field) {
                    return index;
                }
                return undefined;
            })[0];

        return !isNullOrUndefined(index) ? index : -1;
    }

    /**
     * Gets a column by uid.
     * @param  {string} uid - Specifies the column uid.
     * @return {Column}
     */
    public getColumnByUid(uid: string): Column {
        return iterateArrayOrObject<Column, Column>(<Column[]>this.getColumns(), (item: Column, index: number) => {
            if (item.uid === uid) {
                return item;
            }
            return undefined;
        })[0];
    }

    /**
     * Gets a column index by uid.
     * @param  {string} uid - Specifies the column uid.
     * @return {number}
     */
    public getColumnIndexByUid(uid: string): number {
        let index: number = iterateArrayOrObject<number, Column>
            (<Column[]>this.getColumns(), (item: Column, index: number) => {
                if (item.uid === uid) {
                    return index;
                }
                return undefined;
            })[0];

        return !isNullOrUndefined(index) ? index : -1;
    }

    /**
     * Gets uid by column name.
     * @param  {string} field - Specifies the column name.
     * @return {string}
     */
    public getUidByColumnField(field: string): string {
        return iterateArrayOrObject<string, Column>(<Column[]>this.getColumns(), (item: Column, index: number) => {
            if (item.field === field) {
                return item.uid;
            }
            return undefined;
        })[0];
    }

    /**
     * Gets TH index by column uid value.
     * @private
     * @param  {string} uid - Specifies the column uid.
     * @return {number}
     */
    public getNormalizedColumnIndex(uid: string): number {
        let index: number = this.getColumnIndexByUid(uid);

        if (this.allowGrouping) {
            index += this.groupSettings.columns.length;
        }

        if (this.isDetail()) {
            index++;
        }
        /**
         * TODO: index normalization based on the stacked header, grouping and detailTemplate 
         * and frozen should be handled here 
         */
        return index;
    }

    /**
     * Gets the collection of column fields.     
     * @return {string[]}
     */
    public getColumnFieldNames(): string[] {
        let columnNames: string[] = [];
        let column: Column;
        for (let i: number = 0, len: number = this.getColumns().length; i < len; i++) {
            column = this.getColumns()[i] as Column;
            if (column.visible) {
                columnNames.push(column.field);
            }
        }
        return columnNames;
    }

    /**
     * Gets a compiled row template.
     * @return {Function}
     * @private
     */
    public getRowTemplate(): Function {
        return this.rowTemplateFn;
    }

    /**
     * Gets a compiled detail row template.
     * @private
     * @return {Function}
     */
    public getDetailTemplate(): Function {
        return this.detailTemplateFn;
    }

    /**
     * Gets the collection of primary keys.
     * @private
     * @return {Function}
     */
    public getPrimaryKeyFieldNames(): string[] {
        let keys: string[] = [];
        for (let key: number = 0, col: Column[] | string[] | ColumnModel[] = this.columns, cLen: number = col.length; key < cLen; key++) {
            if ((col[key] as Column).isPrimaryKey) {
                keys.push((col[key] as Column).field);
            }
        }
        return keys;
    }

    /**
     * Refreshes the Grid header and content.
     */
    public refresh(): void {
        this.headerModule.refreshUI();
        this.renderModule.refresh();
    }

    /**
     * Refreshes the Grid header.
     */
    public refreshHeader(): void {
        this.headerModule.refreshUI();
    }

    /**
     * Gets the collection of selected rows.
     * @return {Element[]}
     */
    public getSelectedRows(): Element[] {
        return this.selectionModule ? this.selectionModule.selectedRecords : [];
    }

    /**
     * Gets the collection of selected row indexes.
     * @return {number[]}
     */
    public getSelectedRowIndexes(): number[] {
        return this.selectionModule.selectedRowIndexes;
    }

    /**
     * Gets the collection of selected row and cell indexes.
     * @return {number[]}
     */
    public getSelectedRowCellIndexes(): ISelectedCell[] {
        return this.selectionModule.selectedRowCellIndexes;
    }

    /**
     * Gets the collection of selected records. 
     * @return {Object[]}
     */
    public getSelectedRecords(): Object[] {
        let records: Object[] = [];
        let key: string = 'records';

        let currentViewData: Object[] = this.allowGrouping && this.groupSettings.columns.length ?
            this.currentViewData[key] : this.currentViewData;

        for (let i: number = 0, len: number = this.selectionModule.selectedRowIndexes.length; i < len; i++) {
            records.push(currentViewData[this.selectionModule.selectedRowIndexes[i]]);
        }
        return records;
    }

    /** 
     * Shows a column by column name. 
     * @param  {string|string[]} keys - Defines a single or collection of column names. 
     * @param  {string} showBy - Defines the column key either as field name or header text. 
     * @return {void} 
     */
    public showColumns(keys: string | string[], showBy?: string): void {
        showBy = showBy ? showBy : 'headerText';
        this.showHider.show(keys, showBy);
    }

    /** 
     * Hides a column by column name. 
     * @param  {string|string[]} keys - Defines a single or collection of column names. 
     * @param  {string} hideBy - Defines the column key either as field name or header text. 
     * @return {void} 
     */
    public hideColumns(keys: string | string[], hideBy?: string): void {
        hideBy = hideBy ? hideBy : 'headerText';
        this.showHider.hide(keys, hideBy);
    }

    /** 
     * Navigate to target page by given number. 
     * @param  {number} pageNo - Defines the page number to navigate. 
     * @return {void} 
     */
    public goToPage(pageNo: number): void {
        this.pagerModule.goToPage(pageNo);
    }

    /** 
     * Defines the text of external message.
     * @param  {string} message - Defines the message to update. 
     * @return {void} 
     */
    public updateExternalMessage(message: string): void {
        this.pagerModule.updateExternalMessage(message);
    }

    /** 
     * Sorts a column with given options. 
     * @param {string} columnName - Defines the column name to sort.  
     * @param {SortDirection} direction - Defines the direction of sorting for field.  
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns to be maintained. 
     * @return {void} 
     */
    public sortColumn(columnName: string, direction: SortDirection, isMultiSort?: boolean): void {
        this.sortModule.sortColumn(columnName, direction, isMultiSort);
    }

    /**  
     * Clears all the sorted columns of Grid.  
     * @return {void} 
     */
    public clearSorting(): void {
        this.sortModule.clearSorting();
    }

    /** 
     * Remove sorted column by field name. 
     * @param {string} field - Defines the column field name to remove sort.  
     * @return {void} 
     * @hidden
     */
    public removeSortColumn(field: string): void {
        this.sortModule.removeSortColumn(field);
    }

    /** 
     * Filters grid row by column name with given options. 
     * @param  {string} fieldName - Defines the field name of the filter column. 
     * @param  {string} filterOperator - Defines the operator by how to filter records.
     * @param  {string | number | Date | boolean} filterValue - Defines the value which is used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query with another by using AND or OR predicate.   
     * @param  {boolean} matchCase - If match case set to true, then filter records with exact match or else  
     * filter records with case insensitive(uppercase and lowercase letters treated as same).
     * @param  {string} actualFilterValue - Defines the actual filter value for the filter column. 
     * @param  {string} actualOperator - Defines the actual filter operator for the filter column. 
     * @return {void} 
     */
    public filterByColumn(
        fieldName: string, filterOperator: string, filterValue: string | number | Date | boolean, predicate?: string, matchCase?: boolean,
        actualFilterValue?: string, actualOperator?: string): void {
        this.filterModule.filterByColumn(fieldName, filterOperator, filterValue, predicate, matchCase, actualFilterValue, actualOperator);
    }

    /** 
     * Clears all the filtered rows of Grid.
     * @return {void} 
     */
    public clearFiltering(): void {
        this.filterModule.clearFiltering();
    }

    /** 
     * Removes filtered column by field name. 
     * @param  {string} field - Defines column field name to remove filter. 
     * @param  {boolean} isClearFilterBar -  Specifies whether the filter bar value needs to be cleared.     
     * @return {void} 
     * @hidden
     */
    public removeFilteredColsByField(field: string, isClearFilterBar?: boolean): void {
        this.filterModule.removeFilteredColsByField(field, isClearFilterBar);
    }

    /** 
     * Selects a row by given index. 
     * @param  {number} index - Defines the row index. 
     * @return {void} 
     */
    public selectRow(index: number): void {
        this.selectionModule.selectRow(index);
    }

    /** 
     * Selects a collection of rows by indexes. 
     * @param  {number[]} rowIndexes - Specifies the row indexes.
     * @return {void} 
     */
    public selectRows(rowIndexes: number[]): void {
        this.selectionModule.selectRows(rowIndexes);
    }

    /** 
     * Deselects the current selected rows and cells.
     * @return {void} 
     */
    public clearSelection(): void {
        this.selectionModule.clearSelection();
    }

    /**
     * Selects a cell by given index.
     * @param  {IIndex} cellIndex - Defines the row and column index. 
     * @return {void}
     */
    public selectCell(cellIndex: IIndex): void {
        this.selectionModule.selectCell(cellIndex);
    }

    /** 
     * Searches Grid records by given key.  
     * @param  {string} searchString - Defines the key.
     * @return {void} 
     */
    public search(searchString: string): void {
        this.searchModule.search(searchString);
    }

    /**
     * By default, it prints all the pages of Grid and hides pager.  
     * > Customize print options using [`printMode`](http://ej2.syncfusion.com/documentation/grid/api-grid.html#printmode-string).
     * @return {void}
     */
    public print(): void {
        this.printModule.print();
    }

    /**    
     * @hidden
     */
    public recalcIndentWidth(): void {
        if (!this.getHeaderTable().querySelector('.e-emptycell')) {
            return;
        }
        if ((!this.groupSettings.columns.length && !this.isDetail()) ||
            this.getHeaderTable().querySelector('.e-emptycell').getAttribute('indentRefreshed') ||
            !this.getContentTable()) {
            return;
        }
        let indentWidth: number = (this.getHeaderTable().querySelector('.e-emptycell').parentElement as HTMLElement).offsetWidth;
        let headerCol: HTMLElement[] = [].slice.call(this.getHeaderTable().querySelector('colgroup').childNodes);
        let contentCol: HTMLElement[] = [].slice.call(this.getContentTable().querySelector('colgroup').childNodes);
        let perPixel: number = indentWidth / 30;
        let i: number = 0;
        if (perPixel >= 1) {
            indentWidth = (30 / perPixel);
        }
        while (i < this.groupSettings.columns.length) {
            headerCol[i].style.width = indentWidth + 'px';
            contentCol[i].style.width = indentWidth + 'px';
            this.notify(events.columnWidthChanged, { index: i, width: indentWidth });
            i++;
        }
        if (this.isDetail()) {
            headerCol[i].style.width = indentWidth + 'px';
            contentCol[i].style.width = indentWidth + 'px';
            this.notify(events.columnWidthChanged, { index: i, width: indentWidth });
        }
        this.getHeaderTable().querySelector('.e-emptycell').setAttribute('indentRefreshed', 'true');
    }


    /** 
     * Changes the Grid column positions by field names. 
     * @param  {string} fromFName - Defines the origin field name. 
     * @param  {string} toFName - Defines the destination field name. 
     * @return {void} 
     */
    public reorderColumns(fromFName: string, toFName: string): void {
        this.reorderModule.reorderColumns(fromFName, toFName);
    }


    private initializeServices(): void {
        this.serviceLocator.register('widthService', this.widthService = new ColumnWidthService(this));
        this.serviceLocator.register('cellRendererFactory', new CellRendererFactory);
        this.serviceLocator.register('rendererFactory', new RendererFactory);
        this.serviceLocator.register('localization', this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale));
        this.serviceLocator.register('valueFormatter', this.valueFormatterService = new ValueFormatter(this.locale));
        this.serviceLocator.register('showHideService', this.showHider = new ShowHide(this));
        this.serviceLocator.register('ariaService', this.ariaService = new AriaService());
    }

    private processModel(): void {
        let gCols: string[] = this.groupSettings.columns;
        let sCols: SortDescriptorModel[] = this.sortSettings.columns;
        let flag: boolean;
        let j: number;
        if (this.allowGrouping) {
            for (let i: number = 0, len: number = gCols.length; i < len; i++) {
                j = 0;
                for (let sLen: number = sCols.length; j < sLen; j++) {
                    if (sCols[j].field === gCols[i]) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    sCols.push({ field: gCols[i], direction: 'ascending' });
                } else {
                    if (this.allowSorting) {
                        this.sortedColumns.push(sCols[j].field);
                    } else {
                        sCols[j].direction = 'ascending';
                    }
                }
                if (!this.groupSettings.showGroupedColumn) {
                    this.getColumnByField(gCols[i]).visible = false;
                }
            }
        }
        this.rowTemplateFn = this.templateComplier(this.rowTemplate);
        this.detailTemplateFn = this.templateComplier(this.detailTemplate);
        if (!isNullOrUndefined(this.parentDetails)) {
            let value: string = isNullOrUndefined(this.parentDetails.parentKeyFieldValue) ? 'undefined' :
                this.parentDetails.parentKeyFieldValue;
            this.query.where(this.queryString, 'equal', value, true);
        }
    }

    private templateComplier(template: string): Function {
        if (template) {
            let e: Object;
            try {
                if (document.querySelectorAll(template).length) {
                    return templateComplier(document.querySelector(template).innerHTML.trim());
                }
            } catch (e) {
                return templateComplier(template);
            }
        }
        return undefined;
    }

    private gridRender(): void {
        this.updateRTL();
        if (this.enableHover) {
            this.element.classList.add('e-gridhover');
        }
        if (Browser.isDevice) {
            this.element.classList.add('e-device');
        }
        classList(this.element, ['e-responsive', 'e-default'], []);
        let rendererFactory: RendererFactory = this.serviceLocator.getService<RendererFactory>('rendererFactory');
        this.headerModule = rendererFactory.getRenderer(RenderType.Header);
        this.contentModule = rendererFactory.getRenderer(RenderType.Content);
        this.printModule = new Print(this, this.scrollModule);
        this.renderModule.render();
        this.eventInitializer();
        this.createGridPopUpElement();
        this.widthService.setWidthToColumns();
        this.updateGridLines();
        this.applyTextWrap();
    }

    private dataReady(): void {
        this.scrollModule.setWidth();
        this.scrollModule.setHeight();
        if (this.height !== 'auto') {
            this.scrollModule.setPadding();
        }
    }

    private updateRTL(): void {
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        } else {
            this.element.classList.remove('e-rtl');
        }
    }

    private createGridPopUpElement(): void {
        let popup: Element = createElement('div', { className: 'e-gridpopup', styles: 'display:none;' });
        let content: Element = createElement('div', { className: 'e-content', attrs: { tabIndex: '-1' } });
        append([content, createElement('div', { className: 'e-uptail e-tail' })], popup);
        content.appendChild(createElement('span'));
        append([content, createElement('div', { className: 'e-downtail e-tail' })], popup);
        this.element.appendChild(popup);
    }

    private updateGridLines(): void {
        classList(this.element, [], ['e-verticallines', 'e-horizontallines', 'e-hidelines', 'e-bothlines']);
        switch (this.gridLines) {
            case 'horizontal':
                this.element.classList.add('e-horizontallines');
                break;
            case 'vertical':
                this.element.classList.add('e-verticallines');
                break;
            case 'none':
                this.element.classList.add('e-hidelines');
                break;
            case 'both':
                this.element.classList.add('e-bothlines');
                break;
        }
    }

    /**
     * The function is used to apply text wrap
     * @return {void}
     * @hidden
     */
    public applyTextWrap(): void {
        if (this.allowTextWrap) {
            this.element.classList.add('e-wrap');
        }
    }

    /**
     * The function is used to remove text wrap
     * @return {void}
     * @hidden
     */
    public removeTextWrap(): void {
        this.element.classList.remove('e-wrap');
    }

    /**
     * Binding events to the element while component creation.
     * @hidden
     */
    public wireEvents(): void {
        EventHandler.add(this.element, 'click', this.mouseClickHandler, this);
        EventHandler.add(this.element, 'touchend', this.mouseClickHandler, this);
        EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
        if (this.allowKeyboard) {
            this.element.tabIndex = this.element.tabIndex === -1 ? 0 : this.element.tabIndex;
        }
        this.keyboardModule = new KeyboardEvents(
            this.element,
            {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            });
    }

    /**
     * Unbinding events from the element while component destroy.
     * @hidden
     */
    public unwireEvents(): void {
        EventHandler.remove(this.element, 'click', this.mouseClickHandler);
        EventHandler.remove(this.element, 'touchend', this.mouseClickHandler);
        EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
    }
    /**
     * @hidden
     */
    public addListener(): void {
        if (this.isDestroyed) { return; }
        this.on(events.dataReady, this.dataReady, this);
        this.on(events.contentReady, this.recalcIndentWidth, this);
        this.on(events.headerRefreshed, this.recalcIndentWidth, this);
    }
    /**
     * @hidden
     */
    public removeListener(): void {
        if (this.isDestroyed) { return; }
        this.off(events.dataReady, this.dataReady);
        this.off(events.contentReady, this.recalcIndentWidth);
        this.off(events.headerRefreshed, this.recalcIndentWidth);
    }

    /** 
     * Get current visible data of grid.
     * @return {Object[]}
     * @hidden
     */
    public getCurrentViewRecords(): Object[] {
        return (this.allowGrouping && this.groupSettings.columns.length) ?
           (this.currentViewData as Object[] & { records: Object[] }).records : this.currentViewData;

    }

    private mouseClickHandler(e: MouseEvent & TouchEvent): void {
        if (this.isChildGrid(e) || (parentsUntil(e.target as Element, 'e-gridpopup') && e.touches) ||
            this.element.querySelectorAll('.e-cloneproperties').length) {
            return;
        }
        if (((!this.allowRowDragAndDrop && parentsUntil(e.target as Element, 'e-gridcontent')) ||
            (!(this.allowGrouping || this.allowReordering) && parentsUntil(e.target as Element, 'e-gridheader'))) && e.touches) {
            return;
        }
        if (parentsUntil(e.target as Element, 'e-gridheader') && this.allowRowDragAndDrop) {
            e.preventDefault();
        }
        this.notify(events.click, e);
    }

    private focusOutHandler(e: MouseEvent): void {
        if (this.isChildGrid(e)) {
            return;
        }
        if (!parentsUntil(e.target as Element, 'e-grid')) {
            (this.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        }
        let filterClear: Element = this.element.querySelector('.e-cancel:not(.e-hide)');
        if (filterClear) {
            filterClear.classList.add('e-hide');
        }
    }

    private isChildGrid(e: MouseEvent | KeyboardEvent | TouchEvent): boolean {
        let gridElement: Element = parentsUntil((e.target as HTMLElement), 'e-grid');
        if (gridElement && gridElement.id !== this.element.id) {
            return true;
        }
        return false;
    }

    private isDetail(): boolean {
        return !isNullOrUndefined(this.detailTemplate) || !isNullOrUndefined(this.childGrid);
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        if (this.isChildGrid(e)) {
            return;
        }
        if (this.allowKeyboard) {
            if (e.action === 'ctrlPlusP') {
                e.preventDefault();
                this.print();
            }
            this.notify(events.keyPressed, e);
        }
    }
}
