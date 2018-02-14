import { IModelGenerator, IGrid } from '../base/interface';
import { Row } from '../models/row';
import { Column } from '../models/column';
import { RowModelGenerator } from '../services/row-model-generator';
/**
 * GroupModelGenerator is used to generate group caption rows and data rows.
 * @hidden
 */
export declare class GroupModelGenerator extends RowModelGenerator implements IModelGenerator<Column> {
    private rows;
    private index;
    private summaryModelGen;
    private captionModelGen;
    constructor(parent?: IGrid);
    generateRows(data: {
        length: number;
    }, args?: Object): Row<Column>[];
    private getGroupedRecords(index, data, raw?);
    private getCaptionRowCells(field, indent, data);
    private generateCaptionRow(data, indent);
    private getForeignKeyData(row);
    private generateDataRows(data, indent);
    private generateIndentCell();
    refreshRows(input?: Row<Column>[]): Row<Column>[];
}
export interface GroupedData {
    GroupGuid?: string;
    items?: GroupedData;
    field?: string;
    isDataRow?: boolean;
    level?: number;
    key?: string;
    foreignKey?: string;
    count?: number;
}
