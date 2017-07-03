import { isNullOrUndefined } from '@syncfusion/ej2-base/util';
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
export class RowModelGenerator implements IModelGenerator {

    //Module declarations
    protected parent: IGrid;

    /**
     * Constructor for header renderer module
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    public generateRows(data: Object): Row[] {
        let rows: Row[] = [];
        for (let i: number = 0, len: number = Object.keys(data).length; i < len; i++) {
            rows[i] = this.generateRow(data[i], i);
        }
        return rows;
    }

    protected ensureColumns(): Cell[] {
        //TODO: generate dummy column for group, detail here;
        let cols: Cell[] = [];

        if (this.parent.detailTemplate || this.parent.childGrid) {
            cols.push(this.generateCell({} as Column, null, CellType.DetailExpand));
        }

        return cols;

    }

    protected generateRow(data: Object, index: number, cssClass?: string): Row {
        let options: IRow = {};
        let tmp: Cell[] = [];

        options.uid = getUid('grid-row');
        options.data = data;
        options.index = index;
        options.isDataRow = true;
        options.cssClass = cssClass;
        options.isAltRow = this.parent.enableAltRow ? index % 2 !== 0 : false;

        let cells: Cell[] = this.ensureColumns();

        let dummies: Column[] = this.parent.getColumns() as Column[];

        for (let dummy of dummies) {
            tmp.push(this.generateCell(dummy, <string>options.uid));
        }

        let row: Row = new Row(<{ [x: string]: Object }>options);
        row.cells = cells.concat(tmp);
        return row;
    }

    protected generateCell(column: Column, rowId?: string, cellType?: CellType, colSpan?: number): Cell {
        let opt: ICell = {
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

        return new Cell(<{ [x: string]: Object }>opt);
    }
}