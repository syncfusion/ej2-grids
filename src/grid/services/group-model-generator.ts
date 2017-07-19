import { IModelGenerator, IRow, IGrid } from '../base/interface';
import { Row } from '../models/row';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base/util';
import { Group } from '@syncfusion/ej2-data';
import { Column } from '../models/column';
import { CellType } from '../base/enum';
import { Cell } from '../models/cell';
import { RowModelGenerator } from '../services/row-model-generator';
import { GroupSummaryModelGenerator, CaptionSummaryModelGenerator } from '../services/summary-model-generator';
/**
 * GroupModelGenerator is used to generate group caption rows and data rows.
 * @hidden
 */
export class GroupModelGenerator extends RowModelGenerator implements IModelGenerator<Column> {

    private rows: Row<Column>[] = [];
    private index: number = 0;

    private summaryModelGen: GroupSummaryModelGenerator;
    private captionModelGen: CaptionSummaryModelGenerator;

    constructor(parent?: IGrid) {
        super(parent);
        this.parent = parent;
        this.summaryModelGen = new GroupSummaryModelGenerator(parent);
        this.captionModelGen = new CaptionSummaryModelGenerator(parent);
    }

    public generateRows(data: { length: number }): Row<Column>[] {

        for (let i: number = 0, len: number = data.length; i < len; i++) {
            this.getGroupedRecords(0, data[i], (<Group>data).level);
        }
        this.index = 0;
        return this.rows;
    }

    private getGroupedRecords(index: number, data: GroupedData, raw?: Object): void {
        let level: number = <number>raw;
        if (isNullOrUndefined(data.items)) {
            if (isNullOrUndefined(data.GroupGuid)) {
                this.rows = this.rows.concat(this.generateDataRows((data as Object[]), index));
            } else {
                for (let j: number = 0, len: number = (data as Object[]).length; j < len; j++) {
                    this.getGroupedRecords(index, data[j], data.level);
                }
            }
        } else {
            this.rows = this.rows.concat(this.generateCaptionRow(data, index));
            if (data.items && (data.items as Object[]).length) {
                this.getGroupedRecords(index + 1, data.items, data.items.level);
            }
            if (this.parent.aggregates.length) {
                this.rows.push(...(<Row<Column>[]>this.summaryModelGen.generateRows(<Object>data, { level: level })));
            }
        }
    }

    private getCaptionRowCells(field: string, indent: number, data: Object): Cell<Column>[] {
        let cells: Cell<Column>[] = []; let indx: number = 0; let visibles: Cell<Column>[] = [];
        let groupedLen: number = this.parent.groupSettings.columns.length; let gObj: IGrid = this.parent;
        for (let i: number = 0; i < indent; i++) {
            cells.push(this.generateIndentCell());
        }
        cells.push(this.generateCell({} as Column, null, CellType.Expand));

        indent = (this.parent.getVisibleColumns().length + groupedLen + (gObj.detailTemplate || gObj.childGrid ? 1 : 0) -
            indent + (this.parent.getVisibleColumns().length ? -1 : 0));
        //Captionsummary cells will be added here.    
        if (this.parent.aggregates.length && !this.captionModelGen.isEmpty()) {
            let captionCells: Row<Column> = <Row<Column>>this.captionModelGen.generateRows(data)[0];
            extend(data, captionCells.data);
            visibles = captionCells.cells.filter((cell: Cell<Column>) => cell.visible);
            visibles = visibles.slice(groupedLen + 1, visibles.length);
            indent = indent - visibles.length;
        }

        cells.push(this.generateCell(this.parent.getColumnByField(field), null, CellType.GroupCaption, indent));
        cells.push(...visibles);

        return cells;
    }

    private generateCaptionRow(data: GroupedData, indent: number): Row<Column> {
        let options: IRow<Column> = {};
        let tmp: Cell<Column>[] = [];

        options.data = extend({}, data);
        (<GroupedData>options.data).field = this.parent.getColumnByField(data.field).headerText;
        options.isDataRow = false;

        let row: Row<Column> = new Row<Column>(<{ [x: string]: Object }>options);
        row.cells = this.getCaptionRowCells(data.field, indent, row.data);
        return row;
    }

    private generateDataRows(data: Object[], indent: number): Row<Column>[] {
        let rows: Row<Column>[] = [];
        for (let i: number = 0, len: number = data.length; i < len; i++) {
            rows[i] = this.generateRow(data[i], this.index, i ? undefined : 'e-firstchildrow');
            for (let j: number = 0; j < indent; j++) {
                rows[i].cells.unshift(this.generateIndentCell());
            }
            this.index++;
        }
        return rows;
    }

    private generateIndentCell(): Cell<Column> {
        return this.generateCell({} as Column, null, CellType.Indent) as Cell<Column>;
    }

}

interface GroupedData {
    GroupGuid?: string;
    items?: GroupedData;
    field?: string;
    isDataRow?: boolean;
    level?: number;
}