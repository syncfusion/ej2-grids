import { merge } from '@syncfusion/ej2-base/util';
import { CellType } from '../base/enum';
import { Column } from './column';
/**
 * Cell
 * @hidden
 */
export class Cell {

    public colSpan: number;

    public rowSpan: number;

    public cellType: CellType;

    public visible: boolean;

    public isTemplate: boolean;

    public isDataCell: boolean;

    public column: Column;

    public rowID: string;

    public index: number;

    public colIndex: number;

    public className: string;

    public attributes: { [a: string]: Object };

    constructor(options: { [x: string]: Object }) {
        merge(this, options);
    }

}