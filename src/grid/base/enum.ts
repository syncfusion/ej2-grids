/** 
 * Defines Actions of the Grid. They are
 * * paging
 * * refresh
 * * sorting
 * * filtering
 * * selection
 * * rowdraganddrop
 * * reorder
 * * grouping
 * * ungrouping
 */
export type Action =
    /**  Defines current Action as Paging */
    'paging' |
    /**  Defines current Action as Refresh */
    'refresh' |
    /**  Defines current Action as Sorting */
    'sorting' |
    /**  Defines current Action as Selection */
    'selection' |
    /**  Defines current Action as Filtering */
    'filtering' |
    /**  Defines current Action as Searching */
    'searching' |
    /**  Defines current Action as Row Drag and Drop */
    'rowdraganddrop' |
    /**  Defines current Action as Reorder */
    'reorder' |
    /**  Defines current Action as Grouping */
    'grouping' |
    /**  Defines current Action as UnGrouping */
    'ungrouping' |
    /**  Defines current Action as Batch Save */
    'batchsave' |
    /** Defines current Action as Virtual Scroll */
    'virtualscroll';


/** 
 * Defines directions of Sorting. They are
 * * ascending
 * * descending 
 */
export type SortDirection =
    /**  Defines SortDirection as Ascending */
    'ascending' |
    /**  Defines SortDirection as Descending */
    'descending';


/** 
 * Defines types of Selection. They are
 * * single - Allows user to select a row or cell.
 * * multiple - Allows user to select multiple rows or cells. 
 */
export type SelectionType =
    /**  Defines Single selection in the Grid */
    'single' |
    /**  Defines multiple selections in the Grid */
    'multiple';


/** 
 * Defines alignments of text, they are
 * * left
 * * right
 * * center
 * * justify 
 */
export type TextAlign =
    /**  Defines Left alignment */
    'left' |
    /**  Defines Right alignment */
    'right' |
    /**  Defines Center alignment */
    'center' |
    /**  Defines Justify alignment */
    'justify';

/** 
 * Defines types of Cell 
 * @hidden
 */
export enum CellType {
    /**  Defines CellType as Data */
    Data,
    /**  Defines CellType as Header */
    Header,
    /**  Defines CellType as Summary */
    Summary,
    /**  Defines CellType as GroupSummary */
    GroupSummary,
    /**  Defines CellType as CaptionSummary */
    CaptionSummary,
    /**  Defines CellType as Filter */
    Filter,
    /**  Defines CellType as Indent */
    Indent,
    /**  Defines CellType as GroupCaption */
    GroupCaption,
    /**  Defines CellType as GroupCaptionEmpty */
    GroupCaptionEmpty,
    /**  Defines CellType as Expand */
    Expand,
    /**  Defines CellType as HeaderIndent */
    HeaderIndent,
    /**  Defines CellType as StackedHeader */
    StackedHeader,
    /**  Defines CellType as DetailHeader */
    DetailHeader,
    /**  Defines CellType as DetailExpand */
    DetailExpand,
    /**  Defines CellType as CommandColumn */
    CommandColumn
}

/** 
 * Defines modes of GridLine, They are 
 * * both - Displays both the horizontal and vertical grid lines. 
 * * none - No grid lines are displayed.
 * * horizontal - Displays the horizontal grid lines only. 
 * * vertical - Displays the vertical grid lines only. 
 * * default - Displays grid lines based on the theme.
 */
export type GridLine =
    /** Show both the vertical and horizontal line in the Grid  */
    'both' |
    /** Hide both the vertical and horizontal line in the Grid  */
    'none' |
    /** Shows the horizontal line only in the Grid */
    'horizontal' |
    /** Shows the vertical line only in the Grid  */
    'vertical' |
    /** Shows the grid lines based on the theme  */
    'default';

/** 
 * Defines types of Render 
 * @hidden
 */
export enum RenderType {
    /**  Defines RenderType as Header */
    Header,
    /**  Defines RenderType as Content */
    Content,
    /**  Defines RenderType as Summary */
    Summary
}

/** 
 * Defines modes of Selection, They are 
 * * row  
 * * cell  
 * * both 
 */
export type SelectionMode =
    /**  Defines SelectionMode as Cell */
    'cell' |
    /**  Defines SelectionMode as Row */
    'row' |
    /**  Defines SelectionMode as Both */
    'both';

/** 
 * Print mode options are
 * * allpages - Print all pages records of the Grid. 
 * * currentpage - Print current page records of the Grid.
 */
export type PrintMode =
    /**  Defines PrintMode as AllPages */
    'allpages' |
    /**  Defines PrintMode as CurrentPage */
    'currentpage';

/** 
 * Defines types of Filter 
 * * menu - Specifies the filter type as menu. 
 * * excel - Specifies the filter type as excel. 
 * * filterbar - Specifies the filter type as filterbar.  
 */
export type FilterType =
    /**  Defines FilterType as filterbar */
    'filterbar' |
    /**  Defines FilterType as excel */
    'excel' |
    /**  Defines FilterType as menu */
    'menu';

/** 
 * Filter bar mode options are 
 * * onenter - Initiate filter operation after Enter key is pressed. 
 * * immediate -  Initiate filter operation after certain time interval. By default time interval is 1500 ms.    
 */
export type FilterBarMode =
    /**  Defines FilterBarMode as onenter */
    'onenter' |
    /**  Defines FilterBarMode  as immediate */
    'immediate';

/**
 * Defines the aggregate types. 
 */
export type AggregateType =
    /** Defines sum aggregate type */
    'sum' |
    /** Specifies average aggregate type */
    'average' |
    /** Specifies maximum aggregate type */
    'max' |
    /** Specifies minimum aggregate type */
    'min' |
    /** Specifies count aggregate type */
    'count' |
    /** Specifies true count aggregate type */
    'truecount' |
    /** Specifies false count aggregate type */
    'falsecount' |
    /** Specifies custom aggregate type */
    'custom';

/**
 * Defines the wrap mode.
 * * both -  Wraps both header and content.
 * * header - Wraps header alone.
 * * content - Wraps content alone.
 */
export type WrapMode =
    /** Wraps both header and content */
    'both' |
    /** Wraps  header alone */
    'header' |
    /** Wraps  content alone */
    'content';

/**
 * Defines Multiple Export Type.
 */
export type MultipleExportType =
/**  Multiple Grids are exported to same Worksheet. */
'appendtosheet' |
/**  Multiple Grids are exported to separate Worksheet. */
'newsheet';

/**
 * Defines Predefined toolbar items.
 */
export type ToolbarItems =
/** Add new record */
'add' |
/** Delete selected record */
'delete' |
/** Update edited record */
'update' |
/** Cancel the edited state */
'cancel' |
/** Edit the selected record */
'edit' |
/** Searches the grid records by given key */
'search' |
/** ColumnChooser used show/gird columns */
'columnchooser' |
/** Print the Grid */
'print' |
/** Export the Grid to PDF format */
'pdfexport' |
/** Export the Grid to Excel format */
'excelexport' |
/** Export the Grid to CSV format */
'csvexport' |
/** Export the Grid to word fromat */
'wordexport';

/** 
 * Defines the cell content's overflow mode. The available modes are   
 * * `clip` -  Truncates the cell content when it overflows its area. 
 * * `ellipsis` -  Displays ellipsis when the cell content overflows its area.
 * * `ellipsiswithtooltip` - Displays ellipsis when the cell content overflows its area 
 * also it will display tooltip while hover on ellipsis applied cell.
 */
export type ClipMode =
    /**  Truncates the cell content when it overflows its area */
    'clip' |
    /** Displays ellipsis when the cell content overflows its area */
    'ellipsis' |
    /** Displays ellipsis when the cell content overflows its area also it will display tooltip while hover on ellipsis applied cell. */
    'ellipsiswithtooltip';

/**
 * Defines the Command Buttons type.
 * * edit -  Edit the current record.
 * * delete - Delete the current record.
 * * save - Save the current edited record.
 * * cancel - Cancel the edited state.
 */
export type CommandButtonType =
/** Edit the current row */
'edit' |
/** Delete the current row */
'delete' |
/** Save the current edited row */
'save' |
/**  Cancel the edited state */
'cancel';
