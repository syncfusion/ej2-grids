import { IModelGenerator, IRow, IGrid } from '../base/interface';
import { Row } from '../models/row';
import { CellType } from '../base/enum';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
/**
 * RowModelGenerator is used to generate grid data rows.
 * @hidden
 */
export declare class RowModelGenerator implements IModelGenerator<Column> {
    protected parent: IGrid;
    /**
     * Constructor for header renderer module
     */
    constructor(parent?: IGrid);
    generateRows(data: Object, args?: {
        startIndex?: number;
    }): Row<Column>[];
    protected ensureColumns(): Cell<Column>[];
    protected generateRow(data: Object, index: number, cssClass?: string, indent?: number): Row<Column>;
    protected refreshForeignKeyRow(options: IRow<Column>): void;
    protected generateCells(options: IRow<Column>): Cell<Column>[];
    protected generateCell(column: Column, rowId?: string, cellType?: CellType, colSpan?: number, oIndex?: number, foreignKeyData?: Object): Cell<Column>;
    refreshRows(input?: Row<Column>[]): Row<Column>[];
}
