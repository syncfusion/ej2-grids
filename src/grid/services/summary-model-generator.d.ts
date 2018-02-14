import { IModelGenerator, IGrid } from '../base/interface';
import { Row } from '../models/row';
import { AggregateColumnModel, AggregateRowModel } from '../models/aggregate-model';
import { AggregateColumn } from '../models/aggregate';
import { Column } from '../models/column';
import { Group } from '@syncfusion/ej2-data';
import { CellType } from '../base/enum';
import { Cell } from '../models/cell';
/**
 * Summary row model generator
 * @hidden
 */
export declare class SummaryModelGenerator implements IModelGenerator<AggregateColumnModel> {
    protected parent: IGrid;
    /**
     * Constructor for Summary row model generator
     */
    constructor(parent?: IGrid);
    getData(): Object;
    columnSelector(column: AggregateColumnModel): boolean;
    getColumns(start?: number, end?: number): Column[];
    generateRows(input: Object[] | Group, args?: Object, start?: number, end?: number): Row<AggregateColumnModel>[];
    getGeneratedRow(summaryRow: AggregateRowModel, data: Object, raw: number, start: number, end: number): Row<AggregateColumnModel>;
    getGeneratedCell(column: Column, summaryRow: AggregateRowModel, cellType?: CellType, indent?: string): Cell<AggregateColumnModel>;
    private buildSummaryData(data, args?);
    protected getIndentByLevel(data?: number): string[];
    protected setTemplate(column: AggregateColumn, data: Object[], single: Object | Group): Object;
    protected getCellType(): CellType;
}
export declare class GroupSummaryModelGenerator extends SummaryModelGenerator implements IModelGenerator<AggregateColumnModel> {
    columnSelector(column: AggregateColumnModel): boolean;
    protected getIndentByLevel(level?: number): string[];
    protected getCellType(): CellType;
}
export declare class CaptionSummaryModelGenerator extends SummaryModelGenerator implements IModelGenerator<AggregateColumnModel> {
    columnSelector(column: AggregateColumnModel): boolean;
    getData(): Object;
    isEmpty(): boolean;
    protected getCellType(): CellType;
}
