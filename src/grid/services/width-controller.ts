import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { IGrid } from '../base/interface';
import { formatUnit } from '@syncfusion/ej2-base';
import { columnWidthChanged } from '../base/constant';
import { Column } from '../models/column';

/**
 * ColumnWidthService
 * @hidden
 */
export class ColumnWidthService {
    private parent: IGrid;

    constructor(parent: IGrid) {
        this.parent = parent;
    }

    public setWidthToColumns(): void {
        let i: number = 0; let indexes: number[] = this.parent.getColumnIndexesInView(); let wFlag: boolean = true;
        if (this.parent.allowGrouping) {
            for (let len: number = this.parent.groupSettings.columns.length; i < len; i++) {
                if (this.parent.enableColumnVirtualization && indexes.indexOf(i) === -1) { wFlag = false; continue; }
                this.setColumnWidth(new Column({ width: '30px' }), i);
            }
        }
        if (this.parent.detailTemplate || this.parent.childGrid) {
            this.setColumnWidth(new Column({ width: '30px' }), i);
        }
        (<Column[]>this.parent.getColumns()).forEach((column: Column, index: number) => {
            this.setColumnWidth(column, wFlag ? undefined : index);
        });
    }

    public setColumnWidth(column: Column, index?: number, module?: string): void {
        let columnIndex: number = isNullOrUndefined(index) ? this.parent.getNormalizedColumnIndex(column.uid) : index;
        let cWidth: string | number = this.getWidth(column);
        if (cWidth !== null) {
            this.setWidth(cWidth, columnIndex);
            if (this.parent.allowResizing) { this.setWidthToTable(); }
            this.parent.notify(columnWidthChanged, { index: columnIndex, width: cWidth, column: column, module: module });
        }
    }

    private setWidth(width: string | number, index: number): void {
        let header: Element = this.parent.getHeaderTable();
        let content: Element = this.parent.getContentTable();
        let fWidth: string = formatUnit(width);
        let headerCol: HTMLTableColElement = (<HTMLTableColElement>header.querySelector('colgroup').children[index]);
        if (headerCol) {
            headerCol.style.width = fWidth;
            (<HTMLTableColElement>content.querySelector('colgroup').children[index]).style.width = fWidth;
        }
        let edit: HTMLTableElement = <HTMLTableElement>content.querySelector('.e-table.e-inline-edit');
        if (edit) {
            (<HTMLTableColElement>edit.querySelector('colgroup').children[index]).style.width = fWidth;
        }
    }

    public getSiblingsHeight(element: HTMLElement): number {
        let previous: number = this.getHeightFromDirection(element, 'previous');
        let next: number = this.getHeightFromDirection(element, 'next');
        return previous + next;
    }

    private getHeightFromDirection(element: HTMLElement, direction: string): number {
        let sibling: HTMLElement = element[direction + 'ElementSibling'];
        let result: number = 0;

        while (sibling) {
            result += sibling.offsetHeight;
            sibling = sibling[direction + 'ElementSibling'];
        }

        return result;
    }

    public getWidth(column: Column): string | number {
        if (isNullOrUndefined(column.width) && this.parent.allowResizing) {
            column.width = 200;
        }
        if (!column.width) { return null; }
        let width: number = parseInt(column.width.toString(), 10);
        if (column.minWidth && width < parseInt(column.minWidth.toString(), 10)) {
            return column.minWidth;
        } else if ( (column.maxWidth && width > parseInt(column.maxWidth.toString(), 10)) ) {
            return column.maxWidth;
        } else {
            return column.width;
        }
    }

    private getTableWidth(columns: Column[]): number {
        let tWidth: number = 0;
        for (let column of columns){
           let cWidth: string | number = this.getWidth(column);
           if (column.visible !== false && cWidth !== null) {
                tWidth += parseInt(cWidth.toString(), 10);
           }
        }
        return tWidth;
    }

    private setWidthToTable(): void {
        let tWidth: string = formatUnit(this.getTableWidth(<Column[]>this.parent.getColumns()));
        (this.parent.getHeaderTable() as HTMLTableElement).style.width = tWidth;
        (this.parent.getContentTable() as HTMLTableElement).style.width = tWidth;
        let edit: HTMLTableElement = <HTMLTableElement>this.parent.element.querySelector('.e-table.e-inline-edit');
        if (edit) {
            edit.style.width = tWidth;
        }
    }
}