import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { AggregateColumnModel } from '../models/models';
import { Cell } from '../models/cell';
import { AggregateColumn } from '../models/aggregate';
import { ICellRenderer } from '../base/interface';
import { appendChildren } from '../base/util';
import { CellRenderer } from './cell-renderer';

/**
 * SummaryCellRenderer class which responsible for building summary cell content. 
 * @hidden
 */
export class SummaryCellRenderer extends CellRenderer implements ICellRenderer<AggregateColumnModel> {

    public element: HTMLElement = createElement('TD', { className: 'e-summarycell', attrs: { role: 'gridcell', tabindex: '-1' } });

    public getValue(field: string, data: Object, column: AggregateColumnModel): Object {
        let key: string;
        key = !isNullOrUndefined(column.type) ? column.field + ' - ' + (column.type) : column.columnName;
        return data[column.columnName] ? data[column.columnName][key] : '';
    }

    public evaluate(node: Element, cell: Cell<AggregateColumnModel>, data: Object, attributes?: Object): boolean {
        let column: AggregateColumn = <AggregateColumn>cell.column;
        if (!(column.footerTemplate || column.groupFooterTemplate || column.groupCaptionTemplate)) {
            return true;
        }
        let tempObj: { fn: Function, property: string } = column.getTemplate(cell.cellType);
        appendChildren(node, tempObj.fn(data[column.columnName], this.parent, tempObj.property));
        return false;
    }
}