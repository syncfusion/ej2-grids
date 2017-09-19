import { IGrid } from '../base/interface';
import { Column } from '../models/column';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Edit render module is used to render grid edit row.
 * @hidden
 */
export class InlineEditRender {
    //Internal variables              

    //Module declarations
    private parent: IGrid;

    /**
     * Constructor for render module
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    public addNew(elements: Object, args: { row?: Element }): void {
        let tbody: Element = this.parent.getContentTable().querySelector('tbody');
        args.row = createElement('tr', { className: 'e-row e-addedrow' });
        tbody.insertBefore(args.row, tbody.firstChild);
        args.row.appendChild(this.getEditElement(elements, false));
    }

    public update(elements: Object, args: { row?: Element }): void {
        args.row.innerHTML = '';
        args.row.appendChild(this.getEditElement(elements, true));
        args.row.classList.add('e-editedrow');
    }

    private getEditElement(elements?: Object, isEdit?: boolean): Element {
        let gObj: IGrid = this.parent;
        let gLen: number = 0;
        let isDetail: number = !isNullOrUndefined(gObj.detailTemplate) || !isNullOrUndefined(gObj.childGrid) ? 1 : 0;
        if (gObj.allowGrouping) {
            gLen = gObj.groupSettings.columns.length;
        }
        let td: HTMLTableCellElement = createElement('td', {
            className: 'e-editcell e-normaledit',
            attrs: { colspan: (gObj.getVisibleColumns().length + gLen + isDetail).toString() }
        }) as HTMLTableCellElement;
        let form: HTMLFormElement = createElement('form', { id: gObj.element.id + 'EditForm', className: 'e-gridform' }) as HTMLFormElement;
        let table: Element = createElement('table', { className: 'e-table e-inline-edit', attrs: { cellspacing: '0.25' } });
        table.appendChild(gObj.getContentTable().querySelector('colgroup').cloneNode(true));
        let tbody: Element = createElement('tbody');
        let tr: Element = createElement('tr');
        let i: number = 0;
        if (isDetail) {
            tr.insertBefore(createElement('td', { className: 'e-detailrowcollapse' }), tr.firstChild);
        }
        while (i < gLen) {
            tr.appendChild(createElement('td', { className: 'e-indentcell' }));
            i++;
        }
        for (let col of gObj.columns as Column[]) {
            if (!col.visible) {
                continue;
            }
            let td: HTMLElement = createElement(
                'td',
                {
                    className: 'e-rowcell', attrs:
                    { style: 'text-align:' + (col.textAlign ? col.textAlign : '') }
                });
            td.appendChild(elements[col.uid]);
            if (col.editType === 'booleanedit') {
                td.classList.add('e-boolcell');
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
        table.appendChild(tbody);
        form.appendChild(table);
        td.appendChild(form);
        return td;
    }

}

