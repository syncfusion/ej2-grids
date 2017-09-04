import { createElement, formatUnit } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { IGrid } from '../base/interface';
import { ColumnWidthService } from '../services/width-controller';

/**
 * `Resize` module is used to handle Resize to fit for columns.
 * @hidden
 * @private
 */
export class Resize {
    //Internal variable    
    private content: HTMLDivElement;
    private header: HTMLDivElement;
    //Module declarations
    private parent: IGrid;
    private widthService: ColumnWidthService;

    /**
     * Constructor for the Grid resize module
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        if (this.parent.isDestroyed) { return; }
        this.widthService = new ColumnWidthService(parent);
    }

    /** 
     * Resize by field names. 
     * @param  {string|string[]} fName - Defines the field name.  
     * @return {void} 
     */
    public autoFitColumns(fName: string | string[]): void {
        let columnName: string[] = (fName === undefined || fName === null || fName.length <= 0) ?
            this.parent.getColumns().map((x: Column) => x.field) : (typeof fName === 'string') ? [fName] : fName;
        this.findColumn(columnName);
    }
    private resizeColumn(fName: string, index: number): void {
        let gObj: IGrid = this.parent;
        let tWidth: number = 0;
        let headerTable: Element = this.parent.getHeaderTable();
        let contentTable: Element = this.parent.getContentTable();
        let headerDivTag: string = 'e-gridheader';
        let contentDivTag: string = 'e-gridcontent';
        let indentWidthClone: NodeListOf<Element> = gObj.getHeaderTable().querySelector('tr').querySelectorAll('.e-grouptopleftcell');
        let indentWidth: number = 0;
        if (indentWidthClone.length > 0) {
            for (let i: number = 0; i < indentWidthClone.length; i++) {
                indentWidth += (<HTMLElement>indentWidthClone[i]).offsetWidth;
            }
        }
        let uid: string = this.parent.getUidByColumnField(fName);
        let columnIndex: number = this.parent.getNormalizedColumnIndex(uid);
        let headerTextClone: Element = (<HTMLElement>headerTable.querySelectorAll('th')[columnIndex].cloneNode(true));
        let headerText: Element[] = [headerTextClone];
        let contentTextClone: NodeListOf<Element> = contentTable.querySelectorAll(`td:nth-child(${columnIndex + 1})`);
        let contentText: Element[] = [];
        for (let i: number = 0; i < contentTextClone.length; i++) {
            contentText[i] = contentTextClone[i].cloneNode(true) as Element;
        }
        let wHeader: number = this.createTable(headerTable, headerText, headerDivTag);
        let wContent: number = this.createTable(contentTable, contentText, contentDivTag);
        let columnbyindex: Column = gObj.getColumns()[index];
        let result: Boolean;
        let width: string = (wHeader > wContent) ? columnbyindex.width = formatUnit(wHeader) : columnbyindex.width = formatUnit(wContent);
        this.widthService.setColumnWidth(gObj.getColumns()[index] as Column);
        result = gObj.getColumns().some((x: Column) => x.width === null || x.width === undefined || (x.width as string).length <= 0);
        if (result === false) {
            (gObj.getColumns() as Column[]).forEach((element: Column) => {
                tWidth = tWidth + parseInt(element.width as string, 10);
            });
        }
        let contentwidth: number = (gObj.getContent().scrollWidth);
        let tableWidth: number = tWidth + indentWidth;
        if (tWidth > 0) {
            (<HTMLTableElement>headerTable).style.width = formatUnit(tableWidth);
            (<HTMLTableElement>contentTable).style.width = formatUnit(tableWidth);
        }
        if (contentwidth > tableWidth) {
            headerTable.classList.add('e-tableborder');
            contentTable.classList.add('e-tableborder');
        } else {
            headerTable.classList.remove('e-tableborder');
            contentTable.classList.remove('e-tableborder');
        }
    }

    /**
     * To destroy the resize 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.widthService = null;
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'resize';
    }
    private findColumn(fName: string[]): void {
        fName.forEach((element: string) => {
            let fieldName: string = element as string;
            let columnIndex: number = this.parent.getColumnIndexByField(fieldName);
            if (this.parent.getColumns()[columnIndex].visible === true) {
                this.resizeColumn(fieldName, columnIndex);
            }
        });
    }
    /**
     * To create table for autofit 
     * @hidden
     */
    protected createTable(table: Element, text: Element[], tag: string): number {
        let myTableDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        myTableDiv.className = this.parent.element.className;
        myTableDiv.style.cssText = 'display: inline-block;visibility:hidden;position:absolute';
        let mySubDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        mySubDiv.className = tag;
        let myTable: HTMLTableElement = createElement('table') as HTMLTableElement;
        myTable.className = table.className;
        myTable.style.cssText = 'table-layout: auto;width: auto';
        let myTr: HTMLTableRowElement = createElement('tr') as HTMLTableRowElement;
        text.forEach((element: Element) => {
            let tr: HTMLTableRowElement = myTr.cloneNode() as HTMLTableRowElement;
            tr.className = table.querySelector('tr').className;
            tr.appendChild(element);
            myTable.appendChild(tr);
        });
        mySubDiv.appendChild(myTable);
        myTableDiv.appendChild(mySubDiv);
        document.body.appendChild(myTableDiv);
        let offsetWidthValue: number = myTable.getBoundingClientRect().width;
        document.body.removeChild(myTableDiv);
        return Math.ceil(offsetWidthValue);
    }
}
