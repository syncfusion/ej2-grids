import { merge } from '@syncfusion/ej2-base';
import { Cell } from './cell';

/**
 * Row
 * @hidden
 */
export class Row<T> {

    public uid: string;

    public data: Object;

    public isSelected: boolean;

    public isReadOnly: boolean;

    public isAltRow: boolean;

    public isDataRow: boolean;

    public rowSpan: number;

    public cells: Cell<T>[];

    public index: number;

    public indent: number;

    public subRowDetails: Object;

    public height: string;

    public visible: boolean;

    public attributes: { [x: string]: Object };

    public cssClass: string;

    constructor(options: { [x: string]: Object }) {
        merge(this, options);
    }
}