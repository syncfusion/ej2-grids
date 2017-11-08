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
            this.getMovableContent().querySelector('tbody').innerHTML = '';
            (this.getMovableContent() as HTMLElement).style.overflow = 'hidden';
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
            this.parent.getHeaderTable().querySelector('tbody').classList.remove('e-hide');
        }
    }
}

export class FreezeRender extends HeaderRender implements IRenderer {
    private frozenHeader: Element;
    private movableHeader: Element;

    constructor(parent?: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
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
        let filterRow: Element;
        this.getFrozenHeader().appendChild(this.getTable());
        this.getMovableHeader().appendChild(this.createTable());
        if (this.parent.frozenRows) {
            this.getFrozenHeader().querySelector('tbody').classList.remove('e-hide');
            this.getMovableHeader().querySelector('tbody').classList.remove('e-hide');
        }
        filterRow = this.getTable().querySelector('.e-filterbar');
        if (this.parent.allowFiltering && filterRow) {
            this.getMovableHeader().querySelector('thead')
                .appendChild(this.renderMovable(filterRow));
        }
        this.parent.notify(events.freezeRefresh, {});
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