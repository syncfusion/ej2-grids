import { createElement, remove } from '@syncfusion/ej2-base';
import { IGrid, IRenderer, IModelGenerator } from '../base/interface';
import { Column } from '../models/column';
import { HeaderRender } from './header-renderer';
import { ContentRender } from './content-renderer';
import { ServiceLocator } from '../services/service-locator';
import { FreezeRowModelGenerator } from '../services/freeze-row-model-generator';
import * as events from '../base/constant';

/**
 * Freeze module is used to render grid content with frozen rows and columns
 * @hidden
 */
export class FreezeContentRender extends ContentRender implements IRenderer {
    private frozenContent: Element;
    private movableContent: Element;

    constructor(parent?: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
    }

    public renderPanel(): void {
        super.renderPanel();
        if (this.parent.frozenColumns) {
            let fDiv: Element = createElement('div', { className: 'e-frozencontent' });
            let mDiv: Element = createElement('div', { className: 'e-movablecontent' });
            this.getPanel().firstChild.appendChild(fDiv);
            this.getPanel().firstChild.appendChild(mDiv);
            this.setFrozenContent(fDiv);
            this.setMovableContent(mDiv);
        }
    }

    public renderEmpty(tbody: HTMLElement): void {
        super.renderEmpty(tbody);
        if (this.parent.frozenColumns) {
            this.getMovableContent().querySelector('tbody').innerHTML = '<tr><td></td></tr>';
            if (this.parent.frozenRows) {
                this.parent.getHeaderContent().querySelector('.e-frozenheader').querySelector('tbody').innerHTML = '';
                this.parent.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody').innerHTML = '';
            }
        } else if (this.parent.frozenRows) {
            this.parent.getHeaderContent().querySelector('tbody').innerHTML = '';
        }
    }

    private setFrozenContent(ele: Element): void {
        this.frozenContent = ele;
    }

    private setMovableContent(ele: Element): void {
        this.movableContent = ele;
    }

    public getFrozenContent(): Element {
        return this.frozenContent;
    }

    public getMovableContent(): Element {
        return this.movableContent;
    }

    public getModelGenerator(): IModelGenerator<Column> {
        return new FreezeRowModelGenerator(this.parent);
    }

    public renderTable(): void {
        super.renderTable();
        if (this.parent.frozenColumns) {
            this.getFrozenContent().appendChild(this.getTable());
            let mTbl: Element = this.getTable().cloneNode(true) as Element;
            this.getMovableContent().appendChild(mTbl);
        }
        if (this.parent.frozenRows) {
            (this.parent.getHeaderContent().firstChild as Element).classList.add('e-frozenhdrcont');
        }
    }
}

export class FreezeRender extends HeaderRender implements IRenderer {
    private frozenHeader: Element;
    private movableHeader: Element;

    constructor(parent?: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.addEventListener();
    }

    public addEventListener(): void {
        this.parent.on(events.freezeRender, this.refreshFreeze, this);
    }

    public renderTable(): void {
        super.renderTable();
        this.rfshMovable();
    }

    public renderPanel(): void {
        super.renderPanel();
        let fDiv: Element = createElement('div', { className: 'e-frozenheader' });
        let mDiv: Element = createElement('div', { className: 'e-movableheader' });
        this.getPanel().firstChild.appendChild(fDiv);
        this.getPanel().firstChild.appendChild(mDiv);
        this.setFrozenHeader(fDiv);
        this.setMovableHeader(mDiv);
    }

    public refreshUI(): void {
        this.getMovableHeader().innerHTML = '';
        super.refreshUI();
        this.rfshMovable();
        let mTable: Element = this.getMovableHeader().querySelector('table');
        remove(this.getMovableHeader().querySelector('colgroup'));
        mTable.insertBefore(this.renderMovable(this.getFrozenHeader().querySelector('colgroup')), mTable.querySelector('thead'));
    }

    private rfshMovable(): void {
        this.getFrozenHeader().appendChild(this.getTable());
        this.getMovableHeader().appendChild(this.createTable());
        this.refreshFreeze({ case: 'filter' });
        this.parent.notify(events.freezeRefresh, {});
    }

    private refreshFreeze(obj: { case: string, isModeChg?: boolean }): void {
        if (obj.case === 'filter') {
            let filterRow: Element = this.getTable().querySelector('.e-filterbar');
            if (this.parent.allowFiltering && filterRow && this.getMovableHeader().querySelector('thead')) {
                this.getMovableHeader().querySelector('thead')
                    .appendChild(this.renderMovable(filterRow));
            }
        } else if (obj.case === 'textwrap') {
            let fRows: NodeListOf<HTMLElement>;
            let mRows: NodeListOf<HTMLElement>;
            let wrapMode: string = this.parent.textWrapSettings.wrapMode;
            if (wrapMode !== 'header' || obj.isModeChg) {
                fRows = this.parent.getContent()
                    .querySelector('.e-frozencontent').querySelectorAll('tr') as NodeListOf<HTMLElement>;
                mRows = this.parent.getContent()
                    .querySelector('.e-movablecontent').querySelectorAll('tr') as NodeListOf<HTMLElement>;
                this.setWrapHeight(fRows, mRows, obj.isModeChg, true);
            }
            if (this.parent.frozenRows) {
                if (wrapMode === 'content' && this.parent.allowTextWrap) {
                    (this.parent.getHeaderContent().firstChild as Element).classList.add('e-wrap');
                } else {
                    (this.parent.getHeaderContent().firstChild as Element).classList.remove('e-wrap');
                }
                if (wrapMode === 'both' || obj.isModeChg) {
                    fRows = this.getFrozenHeader().querySelectorAll('tr') as NodeListOf<HTMLElement>;
                    mRows = this.getMovableHeader().querySelectorAll('tr') as NodeListOf<HTMLElement>;
                } else {
                    fRows = this.getFrozenHeader().querySelector(wrapMode === 'content' ? 'tbody' : 'thead')
                        .querySelectorAll('tr') as NodeListOf<HTMLElement>;
                    mRows = this.getMovableHeader().querySelector(wrapMode === 'content' ? 'tbody' : 'thead')
                        .querySelectorAll('tr') as NodeListOf<HTMLElement>;
                }
                this.setWrapHeight(fRows, mRows, obj.isModeChg);
            }
        }
    }

    private setWrapHeight(fRows: NodeListOf<HTMLElement>, mRows: NodeListOf<HTMLElement>, isModeChg: boolean, isContReset?: boolean): void {
        let fRowHgt: number;
        let mRowHgt: number;
        let isWrap: boolean = this.parent.allowTextWrap;
        let wrapMode: string = this.parent.textWrapSettings.wrapMode;
        let tHead: Element = this.parent.getHeaderContent().querySelector('thead');
        let tBody: Element = this.parent.getHeaderContent().querySelector('tbody');
        for (let i: number = 0, len: number = fRows.length; i < len; i++) {
            if (isModeChg && ((wrapMode === 'header' && isContReset) || ((wrapMode === 'content' && tHead.contains(fRows[i]))
                || (wrapMode === 'header' && tBody.contains(fRows[i]))))) {
                fRows[i].style.height = null;
                mRows[i].style.height = null;
            }
            fRowHgt = fRows[i].offsetHeight;
            mRowHgt = mRows[i].offsetHeight;
            if ((isWrap && fRowHgt < mRowHgt) || (!isWrap && fRowHgt > mRowHgt)) {
                fRows[i].style.height = mRowHgt + 'px';
            } else if ((isWrap && fRowHgt > mRowHgt) || (!isWrap && fRowHgt < mRowHgt)) {
                mRows[i].style.height = fRowHgt + 'px';
            }
        }
    }

    private setFrozenHeader(ele: Element): void {
        this.frozenHeader = ele;
    }

    private setMovableHeader(ele: Element): void {
        this.movableHeader = ele;
    }

    public getFrozenHeader(): Element {
        return this.frozenHeader;
    }

    public getMovableHeader(): Element {
        return this.movableHeader;
    }

    private renderMovable(ele: Element): Element {
        let mEle: Element = ele.cloneNode(true) as Element;
        for (let i: number = 0; i < this.parent.frozenColumns; i++) {
            mEle.removeChild(mEle.children[0]);
        }
        for (let i: number = this.parent.frozenColumns, len: number = ele.childElementCount; i < len; i++) {
            ele.removeChild(ele.children[ele.childElementCount - 1]);
        }
        return mEle;
    }
}