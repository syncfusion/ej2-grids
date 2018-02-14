import { IModelGenerator, IGrid, VirtualInfo, NotifyArgs } from '../base/interface';
import { Row } from '../models/row';
import { Column } from '../models/column';
/**
 * Content module is used to render grid content
 */
export declare class VirtualRowModelGenerator implements IModelGenerator<Column> {
    private model;
    rowModelGenerator: IModelGenerator<Column>;
    parent: IGrid;
    cOffsets: {
        [x: number]: number;
    };
    cache: {
        [x: number]: Row<Column>[];
    };
    data: {
        [x: number]: Object[];
    };
    groups: {
        [x: number]: Object;
    };
    constructor(parent: IGrid);
    generateRows(data: Object[], notifyArgs?: NotifyArgs): Row<Column>[];
    getBlockIndexes(page: number): number[];
    getPage(block: number): number;
    isBlockAvailable(value: number): boolean;
    getData(): VirtualInfo;
    private getStartIndex(blk, data, full?);
    getColumnIndexes(content?: HTMLElement): number[];
    checkAndResetCache(action: string): boolean;
    refreshColOffsets(): void;
    updateGroupRow(current: Row<Column>[], block: number): Row<Column>[];
    private iterateGroup(current, rows);
    getRows(): Row<Column>[];
}
