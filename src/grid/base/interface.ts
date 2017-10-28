import { Component, NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { Column, ColumnModel } from '../models/column';
import {
    SortSettingsModel, TextWrapSettingsModel, SelectionSettingsModel,
    FilterSettingsModel, SearchSettingsModel
} from './grid-model';
import { PageSettingsModel, AggregateRowModel } from '../models/models';
import { RowDropSettingsModel, GroupSettingsModel, GridModel, EditSettingsModel } from './grid-model';
import { Cell } from '../models/cell';
import { Row } from '../models/row';
import { GridLine, Action, CellType, SortDirection, PrintMode, ToolbarItems } from './enum';
import { PredicateModel } from './grid-model';
import { SentinelType, Offsets } from './type';
import { Edit } from '../actions/edit';
import { DropDownListModel } from '@syncfusion/ej2-dropdowns';
import { NumericTextBoxModel } from '@syncfusion/ej2-inputs';
import { FormValidator } from '@syncfusion/ej2-inputs';
import { Data } from '../actions/data';
import { DatePickerModel } from '@syncfusion/ej2-calendars';

/**
 * Specifies grid interfaces.
 * @hidden
 */
export interface IGrid extends Component<HTMLElement> {

    //public properties    
    currentViewData?: Object[];

    /**
     * Specifies the columns for Grid.
     * @default []
     */
    columns?: Column[] | string[] | ColumnModel[];

    /**
     * Specifies whether the enableAltRow is enable or not.
     * @default null
     */
    enableAltRow?: boolean;

    /**
     * Specifies whether the enable row hover is enable or not.
     * @default null
     */
    enableHover?: boolean;

    /**
     * Specifies the allowKeyboard Navigation for the Grid.
     * @default null
     */
    allowKeyboard?: boolean;

    /**
     * Specifies whether the allowTextWrap is enabled or not.
     * @default null
     */
    allowTextWrap?: boolean;

    /**
     * Specifies the 'textWrapSettings' for Grid.
     * @default []
     */
    textWrapSettings?: TextWrapSettingsModel;

    /**
     * Specifies whether the paging is enable or not.
     * @default null
     */
    allowPaging?: boolean;

    /**
     * Specifies the pageSettings for Grid.
     * @default PageSettings
     */
    pageSettings?: PageSettingsModel;

    enableVirtualization: boolean;

    enableColumnVirtualization: boolean;

    /**
     * Specifies whether the sorting is enable or not.
     * @default null
     */
    allowSorting?: boolean;

    /**
     * Specifies whether the multi-sorting is enable or not.
     * @default null
     */
    allowMultiSorting?: boolean;

    /**
     * Specifies the sortSettings for Grid.
     * @default []
     */
    sortSettings?: SortSettingsModel;

    /**
     * Specifies whether the Excel exporting is enable or not.
     * @default null
     */
    allowExcelExport?: boolean;
    /**
     * Specifies whether the Pdf exporting is enable or not.
     * @default null
     */
    allowPdfExport?: boolean;

    /**
     * Specifies whether the selection is enable or not.
     * @default null
     */
    allowSelection?: boolean;

    /**   
     * It is used to select the row while initializing the grid.
     * @default -1       
     */
    selectedRowIndex?: number;

    /**
     * Specifies the selectionSettings for Grid.
     * @default []
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Specifies whether the reordering is enable or not.
     * @default null
     */
    allowReordering?: boolean;

    /**    
     * If `allowResizing` set to true, then the Grid columns can be resized.      
     * @default false    
     */
    allowResizing?: boolean;

    /**
     * Specifies whether the filtering is enable or not.
     * @default null
     */
    allowFiltering?: boolean;

    /**
     * Specifies the filterSettings for Grid.
     * @default []
     */
    filterSettings?: FilterSettingsModel;

    /**
     * Specifies whether the grouping is enable or not.
     * @default null
     */
    allowGrouping?: boolean;

    /**
     * Specifies the groupSettings for Grid.
     * @default []
     */
    groupSettings?: GroupSettingsModel;

    /**
     * if showColumnChooser is true, then column chooser will be enabled in Grid.
     * @default false
     */
    showColumnChooser?: boolean;

    /**
     * Specifies the editSettings for Grid.
     * @default []
     */
    editSettings?: EditSettingsModel;

    /**
     * Specifies the summaryRows for Grid.
     * @default []
     */
    aggregates?: AggregateRowModel[];


    /**
     * Specifies scrollable height of the grid content.
     * @default auto
     */
    height?: string | number;
    /**
     * Specifies scrollable width of the grid content.
     * @default auto
     */
    width?: string | number;

    /**
     * Specifies the searchSettings for Grid.
     * @default []
     */
    searchSettings?: SearchSettingsModel;

    /**
     * Specifies the rowDropSettings for Grid.
     * @default []
     */
    rowDropSettings?: RowDropSettingsModel;

    /**
     * Specifies whether the allowRowDragAndDrop is enable or not.
     * @default false
     */
    allowRowDragAndDrop?: boolean;

    /**
     * Specifies whether the gridLines mode
     * @default null
     */
    gridLines?: GridLine;

    /**
     * Specifies rowTemplate     
     */
    rowTemplate?: string;

    /**
     * Specifies detailTemplate     
     */
    detailTemplate?: string;

    /**    
     * Defines the child Grid to add inside the data rows of the parent Grid with expand/collapse options.       
     */
    childGrid?: GridModel;


    /**    
     * Defines the relation between parent and child grid.       
     */
    queryString?: string;


    /**
     * Specifies the printMode
     */
    printMode?: PrintMode;


    /**
     * Specifies the dataSource for Grid.
     * @default []
     */
    dataSource?: Object | DataManager;

    /**
     * Specifies the query for Grid.
     * @default []
     */
    query?: Query;

    /**
     * @hidden
     * Specifies the toolbar for Grid.
     * @default null
     */
    toolbar?: ToolbarItems[] | string[] | ItemModel[];

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

    isEdit?: boolean;

    editModule?: Edit;

    //public methods
    getHeaderContent?(): Element;
    setGridHeaderContent?(value: Element): void;
    getContentTable?(): Element;
    setGridContentTable?(value: Element): void;
    getContent?(): Element;
    setGridContent?(value: Element): void;
    getHeaderTable?(): Element;
    setGridHeaderTable?(value: Element): void;
    getFooterContent?(): Element;
    getFooterContentTable?(): Element;
    getPager?(): Element;
    setGridPager?(value: Element): void;
    getRowByIndex?(index: number): Element;
    selectRow?(index: number, isToggle?: boolean): void;
    getColumnHeaderByIndex?(index: number): Element;
    getColumnByField?(field: string): Column;
    getColumnIndexByField?(field: string): number;
    getColumnByUid?(uid: string): Column;
    getColumnIndexByUid?(uid: string): number;
    getUidByColumnField?(field: string): string;
    getNormalizedColumnIndex?(uid: string): number;
    getColumnIndexesInView(): number[];
    setColumnIndexesInView(indexes?: number[]): void;
    getRows?(): Element[];
    getCellFromIndex?(rowIndex: number, columnIndex: number): Element;
    getColumnFieldNames?(): string[];
    getSelectedRows?(): Element[];
    getSelectedRecords?(): Object[];
    getSelectedRowIndexes?(): number[];
    getCurrentViewRecords(): Object[];
    selectRows?(indexes: number[]): void;
    clearSelection?(): void;
    updateExternalMessage?(message: string): void;
    getColumns?(isRefresh?: boolean): Column[];
    getRowTemplate?(): Function;
    getDetailTemplate?(): Function;
    sortColumn?(columnName: string, sortDirection: SortDirection, isMultiSort?: boolean): void;
    removeSortColumn?(field: string): void;
    getColumnHeaderByUid?(uid: string): Element;
    getColumnHeaderByField?(field: string): Element;
    showColumns?(keys: string | string[], showBy?: string): void;
    hideColumns?(keys: string | string[], hideBy?: string): void;
    showSpinner?(): void;
    hideSpinner?(): void;
    getVisibleColumns?(): Column[];
    refreshHeader?(): void;
    getDataRows?(): Element[];
    getPrimaryKeyFieldNames?(): string[];
    print(): void;
    /* tslint:disable-next-line:no-any */
    excelExport(exportProperties?: any, isMultipleExport?: boolean, workbook?: any): Promise<any>;
    /* tslint:disable-next-line:no-any */
    csvExport(exportProperties?: any, isMultipleExport?: boolean, workbook?: any): Promise<any>;
    /* tslint:disable-next-line:no-any */
    pdfExport(exportProperties?: any, isMultipleExport?: boolean, pdfDoc?: Object): Promise<Object>;
    search(searchString: string): void;
    deleteRecord?(fieldname?: string, data?: Object): void;
    startEdit?(): void;
    endEdit?(): void;
    closeEdit?(): void;
    addRecord?(data?: Object): void;
    deleteRow?(tr: HTMLTableRowElement): void;
    getRowObjectFromUID?(uid: string): Row<Column>;
    createColumnchooser(x: number, y: number, target: Element): void;
    getDataModule?(): Data;
    refreshTooltip?(): void;
}

/** @hidden */
export interface IRenderer {
    renderPanel(): void;
    renderTable(): void;
    setPanel(panel: Element): void;
    setTable(table: Element): void;
    getPanel(): Element;
    getTable(): Element;
    getRows?(): Row<{}>[] | HTMLCollectionOf<HTMLTableRowElement>;
    refreshUI?(): void;
    setVisible?(column?: Column[]): void;
    addEventListener?(): void;
    removeEventListener?(): void;
    getRowElements?(): Element[];
    setSelection?(uid: string, set: boolean, clearAll: boolean): void;
    getRowByIndex?(index: number): Element;
}

/**
 * IAction interface
 * @hidden
 */
export interface IAction {
    updateModel?(): void;
    onActionBegin?(args?: Object, type?: string): void;
    onActionComplete?(args?: Object, type?: string): void;
    addEventListener?() : void;
    removeEventListener?(): void;
}
/**
 * @hidden
 */
export interface IDataProcessor {
    generateQuery(): Query;
    getData(args: Object, query: Query): Promise<Object>;
    processData?(): void;
}
/**
 * @hidden
 */
export interface IValueFormatter {
    fromView(value: string, format: Function, target?: string): string | number | Date;
    toView(value: number | Date, format: Function): string | Object;
    setCulture?(cultureName: string): void;
    getFormatFunction?(format: NumberFormatOptions | DateFormatOptions): Function;
    getParserFunction?(format: NumberFormatOptions | DateFormatOptions): Function;
}
/**
 * @hidden
 */
export interface ITemplateRender {
    compiled: { [x: string]: Function };
    compile(key: string, template: string): Function;
    render(key: string, data: Object, params?: { [p: string]: Object }): string;
}
/**
 * @hidden
 */
export interface IEditCell {
    create?: Element | Function;
    read?: Object | Function;
    write?: void | Function;
    params?: DatePickerModel | NumericTextBoxModel | DropDownListModel;
    destroy?: Function;
}
/**
 * @hidden
 */
export interface IFilterUI {
    create?: Element | Function;
    read?: Object | Function;
    write?: void | Function;
}
/**
 * @hidden
 */
export interface ICellRenderer<T> {
    element?: Element;
    getGui?(): string | Element;
    format?(column: T, value: Object, data: Object): string;
    evaluate?(node: Element, column: Cell<T>, data: Object, attributes?: Object): boolean;
    setStyleAndAttributes?(node: Element, attributes: { [key: string]: Object }): void;
    render(cell: Cell<T>, data: Object, attributes?: { [x: string]: string }): Element;
    appendHtml?(node: Element, innerHtml: string | Element): Element;
    refresh?(cell: Cell<T>, node: Element): Element;
}
/**
 * @hidden
 */
export interface IRowRenderer<T> {
    element?: Element;
    render(row: Row<T>, column: Column[], attributes?: { [x: string]: string }, rowTemplate?: string): Element;
}

export interface ICellFormatter {
    getValue(column: Column, data: Object): Object;
}
/**
 * @hidden
 */
export interface IIndex {
    rowIndex: number;
    cellIndex: number;
}
/**
 * @hidden
 */
export interface ISelectedCell {
    rowIndex: number;
    cellIndexes: number[];
}

/**
 * @hidden
 */
export interface IFilterOperator {
    contains: string;
    endsWith: string;
    equal: string;
    greaterThan: string;
    greaterThanOrEqual: string;
    lessThan: string;
    lessThanOrEqual: string;
    notEqual: string;
    startsWith: string;
}

export interface NotifyArgs {
    records?: Object[];
    count?: number;
    requestType?: Action;
    module?: string;
    enable?: boolean;
    properties?: Object;
    virtualInfo?: VirtualInfo;
    cancel?: boolean;
}

/**
 * @hidden
 */
export interface ICell<T> {
    colSpan?: number;

    rowSpan?: number;

    cellType?: CellType;

    visible?: boolean;

    isTemplate?: boolean;

    isDataCell?: boolean;

    column?: T;

    rowID?: string;

    index?: number;

    colIndex?: number;

    className?: string;

}
/**
 * @hidden
 */
export interface IRow<T> {
    uid?: string;

    data?: Object;

    isSelected?: boolean;

    isReadOnly?: boolean;

    isAltRow?: boolean;

    isDataRow?: boolean;

    rowSpan?: number;

    cells?: Cell<T>[];

    index?: number;

    indent?: number;

    subRowDetails?: Object;

    height?: string;

    cssClass?: string;
}
/**
 * @hidden
 */
export interface IModelGenerator<T> {
    generateRows(data: Object, args?: Object): Row<T>[];
    refreshRows?(input?: Row<T>[]): Row<T>[];
}

export interface ActionEventArgs {
    /** Defines the current action. */
    requestType?: Action;
    /** Defines the type of event. */
    type?: string;
}

export interface FailureEventArgs {
    /** Defines the error information */
    error?: Error;
}

export interface FilterEventArgs extends ActionEventArgs {
    /** Defines the current filtered object. */
    currentFilterObject?: PredicateModel;
    /** Defines the current filtered column name. */
    currentFilteringColumn?: string;
    /** Defines the collection of filtered columns. */
    columns?: PredicateModel[];
}

export interface GroupEventArgs extends ActionEventArgs {
    /** Defines the field name of current grouped column. */
    columnName?: string;
}

export interface PageEventArgs extends ActionEventArgs {
    /** Defines the previous page number. */
    previousPage?: string;
    /** Defines the current page number. */
    currentPage?: string;
}

export interface SortEventArgs extends ActionEventArgs {
    /** Defines the field name of current sorted column. */
    columnName?: string;
    /** Defines the direction of sort column. */
    direction?: SortDirection;
}

export interface SearchEventArgs extends ActionEventArgs {
    /** Defines the string value to search. */
    searchString?: string;
}

export interface PrintEventArgs extends ActionEventArgs {
    /** Defines the Grid element. */
    element?: Element;
    /** Defines the current selected rows. */
    selectedRows?: NodeListOf<Element>;
}

export interface DetailDataBoundEventArgs extends ActionEventArgs {
    /** Defines the Details row element. */
    detailElement?: Element;
    /** Defines the selected row data. */
    data?: Object;
}

export interface ColumnChooserEventArgs {
    /** Defines the parent element. */
    element?: Element;
    /** Defines the  display columns of column chooser. */
    columns?: Column[];
    /** Defines the selected row data. */
    dialogInstance?: Object;
}

export interface RowDeselectEventArgs {
    /** Defines the current selected/deselected row data. */
    data?: Object;
    /** Defines the selected/deselected row index. */
    rowIndex?: number;
    /** Defines the selected/deselected row. */
    row?: Element;
}

export interface RowSelectEventArgs extends RowDeselectEventArgs {
    /** Defines the previously selected row index. */
    previousRowIndex?: number;
    /** Defines the previously selected row. */
    previousRow?: Element;
    /** Defines the target element for selection. */
    target?: Element;
}

export interface RowSelectingEventArgs extends RowSelectEventArgs {
    /** Defines whether CTRL key is pressed. */
    isCtrlPressed?: boolean;
    /** Defines whether SHIFT key is pressed. */
    isShiftPressed?: boolean;
}

export interface CellDeselectEventArgs {
    /** Defines the current selected/deselected row data. */
    data?: Object;
    /** Defines the current selected/deselected cell indexes. */
    cellIndexes?: ISelectedCell[];
    /** Defines the current selected/deselected cells. */
    cells?: Element[];
}

export interface CellSelectEventArgs extends CellDeselectEventArgs {
    /** Defines the current selected cell index. */
    cellIndex?: IIndex;
    /** Defines the previously selected cell index. */
    previousRowCellIndex?: number;
    /** Defines the element. */
    currentCell: Element;
    /** Defines the previously selected cell element. */
    previousRowCell?: Element;
}

export interface CellSelectingEventArgs extends CellSelectEventArgs {
    /** Defines whether CTRL key is pressed. */
    isCtrlPressed?: boolean;
    /** Defines whether SHIFT key is pressed. */
    isShiftPressed?: boolean;
}

export interface ColumnDragEventArgs {
    /** Defines the target element from which drag starts. */
    target?: Element;
    /** Defines the type of the element dragged. */
    draggableType?: string;
    /** Defines the column object which is dragged. */
    column?: Column;
}
export interface RowDataBoundEventArgs {
    /** Defines the current row data. */
    data?: Object;
    /** Defines the row element. */
    row?: Element;
}

export interface QueryCellInfoEventArgs {
    /** Defines the row data associated with this cell. */
    data?: Object;
    /** Defines the cell element. */
    cell?: Element;
    /** Defines the column object associated with this cell. */
    column?: Column;
}

export interface PdfQueryCellInfoEventArgs {
    /** Defines the column of the current cell. */
    column?: Column;
    /** Defines the style of the current cell. */
    /* tslint:disable:no-any */
    style?: any;
    /** Defines the value of the current cell. */
    /* tslint:disable:no-any */
    value?: any;
}

export interface ExcelQueryCellInfoEventArgs {
    /** Defines the column of the current cell. */
    /* tslint:disable:no-any */
    column: any;
    /** Defines the value of the current cell. */
    /* tslint:disable:no-any */
    value?: any;
    /** Defines the style of the current cell. */
    /* tslint:disable:no-any */
    style?: any;
}

export interface RowDragEventArgs {
    /** Defines the selected rows element. */
    rows?: Element;
    /** Defines the target element from which drag starts. */
    target?: Element;
    /** Defines the type of the element dragged. */
    draggableType?: string;
    /** Defines the selected row data. */
    data?: Object[];
}

/**
 * @hidden
 */
export interface EJ2Intance extends HTMLElement {
    ej2_instances: Object | Object[];
}

/**
 * @hidden
 */
export interface IPosition {
    x: number;
    y: number;
}

/**
 * @hidden
 */
export interface ParentDetails {
    parentID?: string;
    parentPrimaryKeys?: string[];
    parentKeyField?: string;
    parentKeyFieldValue?: string;
    parentRowData?: Object;
}

/**
 * @hidden
 */
export interface VirtualInfo {
    data?: boolean;
    event?: string;
    block?: number;
    page?: number;
    currentPage?: number;
    direction?: string;
    blockIndexes?: number[];
    columnIndexes?: number[];
    columnBlocks?: number[];
    loadSelf?: boolean;
    loadNext?: boolean;
    nextInfo?: { page?: number };
    sentinelInfo?: SentinelType;
    offsets?: Offsets;
}
/**
 * @hidden
 */
export interface InterSection {
    container?: HTMLElement;
    pageHeight?: number;
    debounceEvent?: boolean;
    axes?: string[];
}

/**
 * @hidden
 */
export interface ICancel {
    /** Defines the cancel option value. */
    cancel?: boolean;
}

/**
 * @hidden
 */
export interface IPrimaryKey {
    /** Defines the primaryKey. */
    primaryKey?: string[];
}

/**
 * @hidden
 */
export interface BeforeBatchAddArgs extends ICancel, IPrimaryKey {
    /** Defines the default data object. */
    defaultData?: Object;

}

/**
 * @hidden
 */
export interface BatchDeleteArgs extends IPrimaryKey {
    /** Defines the deleted data. */
    rowData?: Object;
    /** Defines the row index. */
    rowIndex?: number;
}

/**
 * @hidden
 */
export interface BeforeBatchDeleteArgs extends BatchDeleteArgs, ICancel {
    /** Defines the row element. */
    row?: Element;
}

/**
 * @hidden
 */
export interface BeforeBatchSaveArgs extends ICancel {
    /** Defines the changed record object. */
    batchChanges?: Object;
}

/**
 * @hidden
 */
export interface ResizeArgs extends ICancel {
    /** Event argument of point or touch action. */
    e?: MouseEvent | TouchEvent;
    /** Defines the resizing column details */
    column?: Column;
}

/**
 * @hidden
 */
export interface BatchAddArgs extends ICancel, IPrimaryKey {
    /** Defines the added data. */
    defaultData?: Object;
    /** Defines the column index. */
    columnIndex?: number;
    /** Defines the row element. */
    row?: Element;
    /** Defines the cell element. */
    cell?: Element;
    /** Defines the column object. */
    columnObject?: Column;
}


/**
 * @hidden
 */
export interface BeginEditArgs extends ICancel, IPrimaryKey {
    /** Defines the edited data. */
    rowData?: Object;
    /** Defines the edited row index. */
    rowIndex?: number;
    /** Defines the current edited row. */
    row?: Element;
    /** Defines the name of the event. */
    type?: string;
    /** Defines the primary key value. */
    primaryKeyValue?: string[];
}

export interface DeleteEventArgs {
    /** Defines the cancel option value. */
    cancel?: boolean;
    /** Defines the request type. */
    requestType?: string;
    /** Defines the foreign key record object (JSON). @hidden */
    foreignKeyData?: Object;
    /** Defines the record objects. */
    data?: Object[];
    /** Defines the selected rows for delete. */
    tr?: Element[];
    /** Defines the name of the event. */
    type?: string;
}

export interface AddEventArgs {
    /** Defines the cancel option value. */
    cancel?: boolean;
    /** Defines the request type. */
    requestType?: string;
    /** Defines the foreign key record object (JSON). @hidden */
    foreignKeyData?: Object;
    /** Defines the record objects. */
    data?: Object;
    /** Defines the name of the event. */
    type?: string;
    /** Defines the previous data. */
    previousData?: Object;
    /** Defines the added row. */
    row?: Object;
}

export interface SaveEventArgs extends AddEventArgs {
    /** Defines the previous data. */
    previousData?: Object;
    /** Defines the selected row index. */
    selectedRow?: number;
    /** Defines the current action. */
    action?: string;
}

export interface EditEventArgs extends BeginEditArgs {
    /** Defines the request type. */
    requestType?: string;
}


/**
 * @hidden
 */
export interface CellEditSameArgs extends ICancel {
    /** Defines the row data object. */
    rowData?: Object;
    /** Defines the column name. */
    columnName?: string;
    /** Defines the cell object. */
    cell?: Element;
    /** Defines the column object. */
    columnObject?: Column;
    /** Defines the cell value. */
    value?: string;
    /** Defines isForeignKey option value. */
    isForeignKey?: boolean;

}
/**
 * @hidden
 */
export interface CellEditArgs extends CellEditSameArgs, IPrimaryKey {
    /** Defines the current row. */
    row?: Element;
    /** Defines the validation rules. */
    validationRules?: Object;
    /** Defines the name of the event. */
    type?: string;
}

/**
 * @hidden
 */
export interface CellSaveArgs extends CellEditSameArgs {
    /** Defines the previous value of the cell. */
    previousValue?: string;
}

/**
 * @hidden
 */
export interface BeforeDataBoundArgs {
    /** Defines the data. */
    result?: Object[];
    /** Defines the data count. */
    count?: number;
}

/**
 * @hidden
 */
export interface IEdit {
    formObj?: FormValidator;
    destroy?: Function;
    closeEdit?(): void;
    deleteRecord?(fieldname?: string, data?: Object): void;
    startEdit?(tr?: Element): void;
    endEdit?(): void;
    closeEdit?(): void;
    addRecord?(data?: Object): void;
    deleteRow?(tr: HTMLTableRowElement): void;
    endEdit?(data?: Object): void;
    batchSave?(): void;
    getBatchChanges?(): Object;
    removeRowObjectFromUID?(uid: string): void;
    addRowObject?(row: Row<Column>): void;
    editCell?(index: number, field: string, isAdd?: boolean): void;
    updateCell?(rowIndex: number, field: string, value: string | number | boolean | Date): void;
    updateRow?(index: number, data: Object): void;
    saveCell?(isForceSave?: boolean): void;
}
