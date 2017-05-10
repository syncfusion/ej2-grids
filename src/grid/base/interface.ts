import { Component, NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { Column, ColumnModel } from '../models/column';
import { SortSettingsModel, SelectionSettingsModel, FilterSettingsModel, SearchSettingsModel } from './grid-model';
import { PageSettingsModel } from '../models/models';
import { RowDropSettingsModel, GroupSettingsModel } from './grid-model';
import { Cell } from '../models/cell';
import { Row } from '../models/row';
import { GridLine, Action, CellType, SortDirection, PrintMode } from './enum';
import { PredicateModel } from './grid-model';

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
     * Specifies whether the paging is enable or not.
     * @default null
     */
    allowPaging?: boolean;

    /**
     * Specifies the pageSettings for Grid.
     * @default PageSettings
     */
    pageSettings?: PageSettingsModel;

    /**
     * Specifies whether the sorting is enable or not.
     * @default null
     */
    allowSorting?: boolean;

    /**
     * Specifies the sortSettings for Grid.
     * @default []
     */
    sortSettings?: SortSettingsModel;

    /**
     * Specifies whether the selection is enable or not.
     * @default null
     */
    allowSelection?: boolean;

    /**   
     * It is used to select the row while initializing the grid.
     * @default -1       
     */
    selectedRowIndex: number;

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
    allowRowDragAndDrop: boolean;

    /**
     * Specifies whether the gridLines mode
     * @default null
     */
    gridLines?: GridLine;

    /**
     * Specifies rowTemplate     
     */
    rowTemplate: string;

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
    //public methods
    getHeaderContent(): Element;
    setGridHeaderContent(value: Element): void;
    getContentTable(): Element;
    setGridContentTable(value: Element): void;
    getContent(): Element;
    setGridContent(value: Element): void;
    getHeaderTable(): Element;
    setGridHeaderTable(value: Element): void;
    getPager(): Element;
    setGridPager(value: Element): void;
    getRowByIndex(index: number): Element;
    getColumnHeaderByIndex(index: number): Element;
    getColumnByField(field: string): Column;
    getColumnIndexByField(field: string): number;
    getColumnByUid(uid: string): Column;
    getColumnIndexByUid(uid: string): number;
    getUidByColumnField(field: string): string;
    getNormalizedColumnIndex(uid: string): number;
    getRows(): Element[];
    getCellFromIndex(rowIndex: number, columnIndex: number): Element;
    getColumnFieldNames(): string[];
    getSelectedRows(): Element[];
    getSelectedRecords(): Object[];
    getSelectedRowIndexes(): number[];
    selectRows(indexes: number[]): void;
    clearSelection(): void;
    updateExternalMessage(message: string): void;
    getColumns(isRefresh?: boolean): Column[];
    getRowTemplate(): Function;
    sortColumn(columnName: string, sortDirection: SortDirection, isMultiSort?: boolean): void;
    removeSortColumn(field: string): void;
    getColumnHeaderByUid(uid: string): Element;
    getColumnHeaderByField(field: string): Element;
    showColumns(keys: string | string[], showBy?: string): void;
    hideColumns(keys: string | string[], hideBy?: string): void;
    getVisibleColumns?(): Column[];
    refreshHeader?(): void;
}

/** @hidden */
export interface IRenderer {
    renderPanel(): void;
    renderTable(): void;
    setPanel(panel: Element): void;
    setTable(table: Element): void;
    getPanel(): Element;
    getTable(): Element;
    getRows?(): Row[] | HTMLCollectionOf<HTMLTableRowElement>;
    refreshUI?(): void;
    setVisible?(column?: Column[]): void;
    addEventListener?(): void;
    removeEventListener?(): void;
    getRowElements?(): Element[];
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
    getData(query: Query): Promise<Object>;
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
export interface IEditorUI {
    create(): Element;
    read(): Object;
    write(): void;
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
export interface ICellRenderer {
    element?: Element;
    getGui?(): string | Element;
    format?(column: Column, value: Object, data: Object): string;
    setStyleAndAttributes?(node: Element, attributes: { [key: string]: Object }): void;
    render(cell: Cell, data: Object, attributes?: { [x: string]: string }): Element;
    appendHtml?(node: Element, innerHtml: string | Element): Element;
    refresh?(cell: Cell, node: Element): Element;
}
/**
 * @hidden
 */
export interface IRowRenderer {
    element?: Element;
    render(row: Row, column: Column[], attributes?: { [x: string]: string }, rowTemplate?: string): Element;
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
}

/**
 * @hidden
 */
export interface ICell {
    colSpan?: number;

    rowSpan?: number;

    cellType?: CellType;

    visible?: boolean;

    isTemplate?: boolean;

    isDataCell?: boolean;

    column?: Column;

    rowID?: string;

    index?: number;

    colIndex?: number;

    className?: string;

}
/**
 * @hidden
 */
export interface IRow {
    uid?: string;

    data?: Object;

    isSelected?: boolean;

    isReadOnly?: boolean;

    isAltRow?: boolean;

    isDataRow?: boolean;

    rowSpan?: number;

    cells?: Cell[];

    index?: number;

    subRowDetails?: Object;

    height?: string;
}
/**
 * @hidden
 */
export interface IModelGenerator {
    generateRows(data: Object): Row[];
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
    /** Defines the current filter object. */
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

/**
 * @hidden
 */
export interface EJ2Intance extends HTMLElement {
    ej2_instances: Object;
}

/**
 * @hidden
 */
export interface IPosition {
    x: number;
    y: number;
}