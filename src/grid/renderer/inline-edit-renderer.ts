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
        let mTbody: Element;
        let tbody: Element;
        if (this.parent.frozenRows) {
            tbody = this.parent.getHeaderContent().querySelector('tbody');
        } else {
            tbody = this.parent.getContentTable().querySelector('tbody');
        }
        args.row = createElement('tr', { className: 'e-row e-addedrow' });
        if (tbody.querySelector('.e-emptyrow')) {
            tbody.querySelector('.e-emptyrow').classList.add('e-hide');
        }
        tbody.insertBefore(args.row, tbody.firstChild);
        args.row.appendChild(this.getEditElement(elements, false));
        if (this.parent.getFrozenColumns()) {
            let mEle: Element = this.renderMovableform(args.row);
            if (this.parent.frozenRows) {
                mTbody = this.parent.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody');
            } else {
                mTbody = this.parent.getContent().querySelector('.e-movablecontent').querySelector('tbody');
            }
            mTbody.insertBefore(mEle, mTbody.firstChild);
            args.row.querySelector('.e-normaledit').setAttribute('colspan', this.parent.getFrozenColumns() + '');
            mEle.setAttribute('colspan', '' + (this.parent.getColumns().length - this.parent.getFrozenColumns()));
        }
    }

    private renderMovableform(ele: Element): Element {
        let mEle: Element = ele.cloneNode(true) as Element;
        this.renderMovable(ele, mEle);
        mEle.querySelector('colgroup').innerHTML = this.parent.getHeaderContent()
            .querySelector('.e-movableheader').querySelector('colgroup').innerHTML;
        return mEle;
    }

    private updateFreezeEdit(row: Element, td: HTMLElement[]): HTMLElement[] {
        if (this.parent.getFrozenColumns()) {
            let idx: number = parseInt(row.getAttribute('aria-rowindex'), 10);
            let fCont: Element = this.parent.getContent().querySelector('.e-frozencontent').querySelector('tbody');
            let mCont: Element = this.parent.getContent().querySelector('.e-movablecontent').querySelector('tbody');
            let fHdr: Element = this.parent.getHeaderContent().querySelector('.e-frozenheader').querySelector('tbody');
            let mHdr: Element = this.parent.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody');
            if (this.parent.frozenRows && idx >= this.parent.frozenRows) {
                idx -= this.parent.frozenRows;
            }
            if (fCont.contains(row)) {
                td = td.concat([].slice.call(mCont.children[idx].querySelectorAll('td.e-rowcell')));
            } else if (mCont.contains(row)) {
                td = td.concat([].slice.call(fCont.children[idx].querySelectorAll('td.e-rowcell')));
            } else if (fHdr.contains(row)) {
                td = td.concat([].slice.call(mHdr.children[idx].querySelectorAll('td.e-rowcell')));
            } else if (mHdr.contains(row)) {
                td = td.concat([].slice.call(fHdr.children[idx].querySelectorAll('td.e-rowcell')));
            }
        }
        return td;
    }

    public update(elements: Object, args: { row?: Element }): void {
        let tdElement: HTMLElement[] = [].slice.call(args.row.querySelectorAll('td.e-rowcell'));
        args.row.innerHTML = '';
        tdElement = this.updateFreezeEdit(args.row, tdElement);
        args.row.appendChild(this.getEditElement(elements, true, tdElement));
        args.row.classList.add('e-editedrow');
        this.refreshFreezeEdit(args.row);
    }

    private refreshFreezeEdit(row: Element): void {
        let td: Element = row.firstChild as Element;
        let fCls: string;
        let cont: Element;
        let idx: number = parseInt(row.getAttribute('aria-rowindex'), 10);
        if (this.parent.getFrozenColumns()) {
            if (idx < this.parent.frozenRows) {
                cont = this.parent.getHeaderContent();
                fCls = '.e-frozenheader';
            } else {
                cont = this.parent.getContent();
                fCls = '.e-frozencontent';
            }
            let mTd: Element = td.cloneNode(true) as Element;
            let fRows: Element;
            if (cont.querySelector(fCls).contains(row)) {
                fRows = this.parent.getMovableRowByIndex(idx);
                this.updateFrozenCont(fRows, td, mTd);
            } else {
                fRows = this.parent.getRowByIndex(idx);
                this.updateFrozenCont(fRows, mTd, td);
            }
            fRows.appendChild(mTd);
            fRows.classList.add('e-editedrow');
        }
    }

    private updateFrozenCont(row: Element, ele: Element, mEle: Element): void {
        row.innerHTML = '';
        this.renderMovable(ele, mEle);
        mEle.querySelector('colgroup').innerHTML = this.parent.getHeaderContent()
            .querySelector('.e-movableheader').querySelector('colgroup').innerHTML;
        ele.setAttribute('colspan', this.parent.getFrozenColumns() + '');
        mEle.setAttribute('colspan', this.parent.getColumns().length - this.parent.getFrozenColumns() + '');
    }

    private renderMovable(ele: Element, mEle: Element): void {
        let frzCols: number = this.parent.getFrozenColumns();
        for (let i: number = 0; i < frzCols; i++) {
            mEle.querySelector('tr').removeChild(mEle.querySelector('tr').children[0]);
        }
        for (let i: number = frzCols, len: number = ele.querySelector('tr').childElementCount; i < len; i++) {
            ele.querySelector('tr').removeChild(ele.querySelector('tr').children[ele.querySelector('tr').childElementCount - 1]);
        }
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
            let td: HTMLElement = createElement(
                'td',
                {
                    className: 'e-rowcell', attrs:
                        { style: 'text-align:' + (col.textAlign ? col.textAlign : ''), 'colspan': span ? span : '' }
                });
            if (col.visible) {
                td.appendChild(elements[col.uid]);
                if (col.editType === 'booleanedit') {
                    td.classList.add('e-boolcell');
                } else if (col.commands || col.commandsTemplate) {
                    addClass([td], 'e-unboundcell');
                }
            } else {
                td.classList.add('e-hide');
            }
            tr.appendChild(td);
            i = span ? i + parseInt(span, 10) : i + 1;
            m++;
        }
        tbody.appendChild(tr);
        table.appendChild(tbody);
        form.appendChild(table);
        td.appendChild(form);
        return td;
    }

    public removeEventListener(): void {
        //To destroy the renderer
    }
}

