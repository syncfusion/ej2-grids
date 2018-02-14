import { IModelGenerator, IGrid, NotifyArgs } from '../base/interface';
import { Column } from '../models/column';
import { Row } from '../models/row';
/**
 * FreezeRowModelGenerator is used to generate grid data rows with freeze row and column.
 * @hidden
 */
export declare class FreezeRowModelGenerator implements IModelGenerator<Column> {
    private rowModelGenerator;
    private parent;
    private isFrzLoad;
    constructor(parent: IGrid);
    generateRows(data: Object, notifyArgs?: NotifyArgs): Row<Column>[];
}
