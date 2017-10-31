import { merge } from '@syncfusion/ej2-base';
import { CellType } from '../base/enum';
/**
 * Cell
 * @hidden
 */
export class Cell<T> {

    public colSpan: number;

    public rowSpan: number;

    public cellType: CellType;

    public visible: boolean;

    public isTemplate: boolean;

    public isDataCell: boolean;

    public isSelected: boolean;

    public column: T;

    public rowID: string;

    public index: number;

    public colIndex: number;

    public className: string;

    public attributes: { [a: string]: Object };

    public isSpanned: boolean = false;

    public cellSpan: number;

    public spanText: string | number | boolean | Date;

    constructor(options: { [x: string]: Object }) {
        merge(this, options);
    }

}