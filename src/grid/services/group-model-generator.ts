import { IModelGenerator, IRow, IGrid } from '../base/interface';
import { Row } from '../models/row';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base/util';
import { Column } from '../models/column';
import { CellType } from '../base/enum';
import { Cell } from '../models/cell';
import { RowModelGenerator } from '../services/row-model-generator';

/**
 * GroupModelGenerator is used to generate group caption rows and data rows.
 * @hidden
 */
export class GroupModelGenerator extends RowModelGenerator implements IModelGenerator {

    private rows: Row[] = [];
    private index: number = 0;

    public generateRows(data: { length: number }): Row[] {

        for (let i: number = 0, len: number = data.length; i < len; i++) {
            this.getGroupedRecords(0, data[i]);
        }
        this.index = 0;
        return this.rows;
    }

    private getGroupedRecords(index: number, data: GroupedData): void {
        if (isNullOrUndefined(data.items)) {
            if (isNullOrUndefined(data.GroupGuid)) {
                this.rows = this.rows.concat(this.generateDataRows((data as Object[]), index));
            } else {
                for (let j: number = 0, len: number = (data as Object[]).length; j < len; j++) {
                    this.getGroupedRecords(index, data[j]);
                }
                //To do: generate summary row here
            }
        } else {
            this.rows = this.rows.concat(this.generateCaptionRow(data, index));
            if (data.items && (data.items as Object[]).length) {
                this.getGroupedRecords(index + 1, data.items);
            }
        }
    }

    private getCaptionRowCells(field: string, indent: number): Cell[] {
        let gObj: IGrid = this.parent;
        let cells: Cell[] = [];
        for (let i: number = 0; i < indent; i++) {
            cells.push(this.generateIndentCell());
        }
        cells.push(this.generateCell({} as Column, null, CellType.Expand));
        cells.push(
            this.generateCell(
                gObj.getColumnByField(field), null, CellType.GroupCaption,
                gObj.getVisibleColumns().length + gObj.groupSettings.columns.length + (gObj.detailsTemplate || gObj.childGrid ? 1 : 0) -
                indent + (gObj.getVisibleColumns().length ? -1 : 0))
        );
        return cells;
    }

    private generateCaptionRow(data: GroupedData, indent: number): Row {
        let options: IRow = {};
        let tmp: Cell[] = [];

        options.data = extend({}, data);
        (<GroupedData>options.data).field = this.parent.getColumnByField(data.field).headerText;
        options.isDataRow = false;

        let row: Row = new Row(<{ [x: string]: Object }>options);
        row.cells = this.getCaptionRowCells(data.field, indent);
        return row;
    }

    private generateDataRows(data: Object[], indent: number): Row[] {
        let rows: Row[] = [];
        for (let i: number = 0, len: number = data.length; i < len; i++) {
            rows[i] = this.generateRow(data[i], this.index, i ? undefined : 'e-firstchildrow');
            for (let j: number = 0; j < indent; j++) {
                rows[i].cells.unshift(this.generateIndentCell());
            }
            this.index++;
        }
        return rows;
    }

    private generateIndentCell(): Cell {
        return this.generateCell({} as Column, null, CellType.Indent) as Cell;
    }

}

interface GroupedData {
    GroupGuid?: string;
    items?: GroupedData;
    field?: string;
    isDataRow?: boolean;
}