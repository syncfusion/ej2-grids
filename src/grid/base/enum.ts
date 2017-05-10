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
    'ungrouping';


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
    /**  Defines CellType as Filter */
    Filter,
    /**  Defines CellType as Indent */
    Indent,
    /**  Defines CellType as GroupCaption */
    GroupCaption,
    /**  Defines CellType as Expand */
    Expand,
    /**  Defines CellType as HeaderIndent */
    HeaderIndent,
    /**  Defines CellType as StackedHeader */
    StackedHeader
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