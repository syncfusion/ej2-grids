import { merge } from '@syncfusion/ej2-base/util';
import { Cell } from './cell';

/**
 * Row
 * @hidden
 */
export class Row {

    public uid: string;

    public data: Object;

    public isSelected: boolean;

    public isReadOnly: boolean;

    public isAltRow: boolean;

    public isDataRow: boolean;

    public rowSpan: number;

    public cells: Cell[];

    public index: number;

    public subRowDetails: Object;

    public height: string;

    constructor(options: { [x: string]: Object }) {
        merge(this, options);
    }
}