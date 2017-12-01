/**
 * Defines types of Cell
 * @hidden
 */
export var CellType;
(function (CellType) {
    /**  Defines CellType as Data */
    CellType[CellType["Data"] = 0] = "Data";
    /**  Defines CellType as Header */
    CellType[CellType["Header"] = 1] = "Header";
    /**  Defines CellType as Summary */
    CellType[CellType["Summary"] = 2] = "Summary";
    /**  Defines CellType as GroupSummary */
    CellType[CellType["GroupSummary"] = 3] = "GroupSummary";
    /**  Defines CellType as CaptionSummary */
    CellType[CellType["CaptionSummary"] = 4] = "CaptionSummary";
    /**  Defines CellType as Filter */
    CellType[CellType["Filter"] = 5] = "Filter";
    /**  Defines CellType as Indent */
    CellType[CellType["Indent"] = 6] = "Indent";
    /**  Defines CellType as GroupCaption */
    CellType[CellType["GroupCaption"] = 7] = "GroupCaption";
    /**  Defines CellType as GroupCaptionEmpty */
    CellType[CellType["GroupCaptionEmpty"] = 8] = "GroupCaptionEmpty";
    /**  Defines CellType as Expand */
    CellType[CellType["Expand"] = 9] = "Expand";
    /**  Defines CellType as HeaderIndent */
    CellType[CellType["HeaderIndent"] = 10] = "HeaderIndent";
    /**  Defines CellType as StackedHeader */
    CellType[CellType["StackedHeader"] = 11] = "StackedHeader";
    /**  Defines CellType as DetailHeader */
    CellType[CellType["DetailHeader"] = 12] = "DetailHeader";
    /**  Defines CellType as DetailExpand */
    CellType[CellType["DetailExpand"] = 13] = "DetailExpand";
    /**  Defines CellType as CommandColumn */
    CellType[CellType["CommandColumn"] = 14] = "CommandColumn";
})(CellType || (CellType = {}));
/**
 * Defines types of Render
 * @hidden
 */
export var RenderType;
(function (RenderType) {
    /**  Defines RenderType as Header */
    RenderType[RenderType["Header"] = 0] = "Header";
    /**  Defines RenderType as Content */
    RenderType[RenderType["Content"] = 1] = "Content";
    /**  Defines RenderType as Summary */
    RenderType[RenderType["Summary"] = 2] = "Summary";
})(RenderType || (RenderType = {}));
/**
 * Defines Predefined toolbar items.
 */
export var ToolbarItem;
(function (ToolbarItem) {
    ToolbarItem[ToolbarItem["Add"] = 0] = "Add";
    ToolbarItem[ToolbarItem["Edit"] = 1] = "Edit";
    ToolbarItem[ToolbarItem["Update"] = 2] = "Update";
    ToolbarItem[ToolbarItem["Delete"] = 3] = "Delete";
    ToolbarItem[ToolbarItem["Cancel"] = 4] = "Cancel";
    ToolbarItem[ToolbarItem["Print"] = 5] = "Print";
    ToolbarItem[ToolbarItem["Search"] = 6] = "Search";
    ToolbarItem[ToolbarItem["ColumnChooser"] = 7] = "ColumnChooser";
    ToolbarItem[ToolbarItem["PdfExport"] = 8] = "PdfExport";
    ToolbarItem[ToolbarItem["ExcelExport"] = 9] = "ExcelExport";
    ToolbarItem[ToolbarItem["CsvExport"] = 10] = "CsvExport";
    ToolbarItem[ToolbarItem["WordExport"] = 11] = "WordExport";
})(ToolbarItem || (ToolbarItem = {}));
