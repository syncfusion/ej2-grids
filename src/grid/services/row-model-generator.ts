import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { IModelGenerator, ICell, IRow, IGrid } from '../base/interface';
import { Row } from '../models/row';
import { CellType } from '../base/enum';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { getUid } from '../base/util';

/**
 * RowModelGenerator is used to generate grid data rows.
 * @hidden
 */
export class RowModelGenerator implements IModelGenerator<Column> {

    //Module declarations
    protected parent: IGrid;

    /**
     * Constructor for header renderer module
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    public generateRows(data: Object, args?: { startIndex?: number }): Row<Column>[] {
        let rows: Row<Column>[] = [];
        let startIndex: number = this.parent.enableVirtualization ? args.startIndex : 0;
        for (let i: number = 0, len: number = Object.keys(data).length; i < len; i++ , startIndex++) {
            rows[i] = this.generateRow(data[i], startIndex);
        }
        return rows;
    }

    protected ensureColumns(): Cell<Column>[] {
        //TODO: generate dummy column for group, detail here;
        let cols: Cell<Column>[] = [];

        if (this.parent.detailTemplate || this.parent.childGrid) {
            cols.push(this.generateCell({} as Column, null, CellType.DetailExpand));
        }

        return cols;

    }

    protected generateRow(data: Object, index: number, cssClass?: string, indent?: number): Row<Column> {
        let options: IRow<Column> = {};
        let tmp: Cell<Column>[] = [];

        options.uid = getUid('grid-row');
        options.data = data;
        options.index = index;
        options.indent = indent;
        options.isDataRow = true;
        options.cssClass = cssClass;
        options.isAltRow = this.parent.enableAltRow ? index % 2 !== 0 : false;
        options.isSelected = this.parent.getSelectedRowIndexes().indexOf(index) > -1;

        let cells: Cell<Column>[] = this.ensureColumns();
        let row: Row<Column> = new Row<Column>(<{ [x: string]: Object }>options);
        row.cells =  cells.concat(this.generateCells(options));

        return row;
    }

    protected generateCells(options: IRow<Column>): Cell<Column>[] {
        let dummies: Column[] = this.parent.getColumns() as Column[];
        let tmp: Cell<Column>[] = [];

        dummies.forEach((dummy: Column, index: number) =>
            tmp.push(this.generateCell(
                dummy, <string>options.uid, undefined, null, index)));
        return tmp;
    }

    protected generateCell(column: Column, rowId?: string, cellType?: CellType, colSpan?: number, oIndex?: number): Cell<Column> {
        let opt: ICell<Column> = {
            'visible': column.visible,
            'isDataCell': !isNullOrUndefined(column.field || column.template),
            'isTemplate': !isNullOrUndefined(column.template),
            'rowID': rowId,
            'column': column,
            'cellType': !isNullOrUndefined(cellType) ? cellType : CellType.Data,
            'colSpan': colSpan
        };

        if (opt.isDataCell) {
            opt.index = this.parent.getColumnIndexByField(column.field);
        }

        return new Cell<Column>(<{ [x: string]: Object }>opt);
    }

    public refreshRows(input?: Row<Column>[]): Row<Column>[] {
        input.forEach((row: Row<Column>) => row.cells = this.generateCells(row));
        return input;
    }
}