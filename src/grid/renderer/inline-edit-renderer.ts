import { IGrid } from '../base/interface';
import { Column } from '../models/column';
import { createElement, isNullOrUndefined, addClass } from '@syncfusion/ej2-base';

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
        let tdElement: HTMLElement[] = [].slice.call(args.row.querySelectorAll('td.e-rowcell'));
        args.row.innerHTML = '';
        args.row.appendChild(this.getEditElement(elements, true, tdElement));
        args.row.classList.add('e-editedrow');
    }

    private getEditElement(elements?: Object, isEdit?: boolean, tdElement?: HTMLElement[]): Element {
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
        let m: number = 0;
        i = 0;
        while ((isEdit && m < tdElement.length && i < gObj.getColumns().length) || i < gObj.getColumns().length) {
            let span: string = isEdit ? tdElement[m].getAttribute('colspan') : null;
            let col: Column = gObj.getColumns()[i] as Column;
            if (col.visible) {
                let td: HTMLElement = createElement(
                    'td',
                    {
                        className: 'e-rowcell', attrs:
                        { style: 'text-align:' + (col.textAlign ? col.textAlign : ''), 'colspan': span ? span : '' }
                    });
                td.appendChild(elements[col.uid]);
                if (col.editType === 'booleanedit') {
                    td.classList.add('e-boolcell');
                } else if (col.commands || col.commandsTemplate) {
                    addClass([td], 'e-unboundcell');
                }
                tr.appendChild(td);
            }
            i = span ? i + parseInt(span, 10) : i + 1;
            m++;
        }
        tbody.appendChild(tr);
        table.appendChild(tbody);
        form.appendChild(table);
        td.appendChild(form);
        return td;
    }

}

