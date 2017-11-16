export var CellType;
(function (CellType) {
    CellType[CellType["Data"] = 0] = "Data";
    CellType[CellType["Header"] = 1] = "Header";
    CellType[CellType["Summary"] = 2] = "Summary";
    CellType[CellType["GroupSummary"] = 3] = "GroupSummary";
    CellType[CellType["CaptionSummary"] = 4] = "CaptionSummary";
    CellType[CellType["Filter"] = 5] = "Filter";
    CellType[CellType["Indent"] = 6] = "Indent";
    CellType[CellType["GroupCaption"] = 7] = "GroupCaption";
    CellType[CellType["GroupCaptionEmpty"] = 8] = "GroupCaptionEmpty";
    CellType[CellType["Expand"] = 9] = "Expand";
    CellType[CellType["HeaderIndent"] = 10] = "HeaderIndent";
    CellType[CellType["StackedHeader"] = 11] = "StackedHeader";
    CellType[CellType["DetailHeader"] = 12] = "DetailHeader";
    CellType[CellType["DetailExpand"] = 13] = "DetailExpand";
    CellType[CellType["CommandColumn"] = 14] = "CommandColumn";
})(CellType || (CellType = {}));
export var RenderType;
(function (RenderType) {
    RenderType[RenderType["Header"] = 0] = "Header";
    RenderType[RenderType["Content"] = 1] = "Content";
    RenderType[RenderType["Summary"] = 2] = "Summary";
})(RenderType || (RenderType = {}));
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
