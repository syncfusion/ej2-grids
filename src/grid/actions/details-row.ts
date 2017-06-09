import { KeyboardEventArgs } from '@syncfusion/ej2-base';
import { createElement, closest, classList } from '@syncfusion/ej2-base/dom';
import { IGrid, IAction } from '../base/interface';
import { Grid } from '../base/grid';
import { parents, getUid } from '../base/util';
import * as events from '../base/constant';
import { AriaService } from '../services/aria-service';

/**
 * Detail template module is used to handle the rendering detail rows.
 * @hidden
 */
export class DetailsRow implements IAction {

    //Internal variables
    private aria: AriaService = new AriaService();

    //Module declarations
    private parent: IGrid;

    /**
     * Constructor for the Grid detail template module
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.keyPressed, this.keyPressHandler, this);
    }

    private clickHandler(e: MouseEvent): void {
        this.toogleExpandcollapse(closest(e.target as Element, 'td'));
    }

    private toogleExpandcollapse(target: Element): void {
        let gObj: IGrid = this.parent;
        let parent: string = 'parentDetails';
        if (target && (target.classList.contains('e-detailsrowcollapse') || target.classList.contains('e-detailsrowexpand'))) {
            let tr: HTMLTableRowElement = target.parentElement as HTMLTableRowElement;
            let nextRow: HTMLElement =
                this.parent.getContentTable().querySelector('tbody').children[tr.rowIndex + 1] as HTMLElement;
            if (target.classList.contains('e-detailsrowcollapse')) {
                let key: string = 'records';
                let currentViewData: Object[] = gObj.allowGrouping && gObj.groupSettings.columns.length ?
                    gObj.currentViewData[key] : gObj.currentViewData;
                let data: Object = currentViewData[tr.getAttribute('aria-rowindex')];
                if (this.isDetailRow(nextRow)) {
                    nextRow.style.display = '';
                } else if (gObj.getDetailTemplate() || gObj.childGrid) {
                    let detailRow: Element = createElement('tr', { className: 'e-detailrow' });
                    let detailCell: Element = createElement('td', { className: 'e-detailcell' });
                    detailCell.setAttribute('colspan', this.parent.getVisibleColumns().length.toString());
                    for (let i: number = 0, len: number = gObj.groupSettings.columns.length; i < len; i++) {
                        detailRow.appendChild(createElement('td', { className: 'e-indentcell' }));
                    }
                    detailRow.appendChild(createElement('td', { className: 'e-detailindentcell' }));
                    if (gObj.detailsTemplate) {
                        detailCell.innerHTML = gObj.getDetailTemplate()(data);
                    } else {
                        gObj.childGrid[parent] = {
                            parentID: gObj.element.id,
                            parentPrimaryKeys: gObj.getPrimaryKeyFieldNames(),
                            parentKeyField: gObj.childGrid.queryString,
                            parentKeyFieldValue: data[gObj.childGrid.queryString],
                            parentRowData: data
                        };
                        let grid: Grid = new Grid(gObj.childGrid);
                        let gridElem: HTMLElement = createElement('div', {
                            id: 'child' + parents(tr, 'e-grid').length +
                            '_grid' + tr.rowIndex + getUid('')
                        });
                        grid.appendTo(gridElem);
                        detailCell.appendChild(gridElem);
                    }
                    detailRow.appendChild(detailCell);
                    tr.parentNode.insertBefore(detailRow, tr.nextSibling);
                    gObj.getRows().splice(tr.rowIndex + 1, 0, detailRow);
                    gObj.trigger(events.detailsDataBound, { detailsElement: detailCell, data: data });
                }
                classList(target, ['e-detailsrowexpand'], ['e-detailsrowcollapse']);
                classList(target.firstElementChild, ['e-dtdiagonaldown', 'e-icon-gdownarrow'], ['e-dtdiagonalright', 'e-icon-grightarrow']);
                this.aria.setExpand(target as HTMLElement, true);
            } else {
                if (this.isDetailRow(nextRow)) {
                    nextRow.style.display = 'none';
                }
                classList(target, ['e-detailsrowcollapse'], ['e-detailsrowexpand']);
                classList(target.firstElementChild, ['e-dtdiagonalright', 'e-icon-grightarrow'], ['e-dtdiagonaldown', 'e-icon-gdownarrow']);
                this.aria.setExpand(target as HTMLElement, false);
            }
        }
    }

    private isDetailRow(row: Element): boolean {
        return row && row.classList.contains('e-detailrow');
    }

    private destroy(): void {
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.keyPressed, this.keyPressHandler);
    }

    private getTDfromIndex(index: number, className: string): Element {
        let tr: Element = this.parent.getDataRows()[index];
        if (tr && tr.querySelector(className)) {
            return tr.querySelector(className);
        }
        return null;
    }

    /** 
     * Expands a detail row with the given target.          
     * @return {void} 
     */
    public expand(target: number | Element): void {
        if (!isNaN(target as number)) {
            target = this.getTDfromIndex(target as number, '.e-detailsrowcollapse');
        }
        if (target && (target as Element).classList.contains('e-detailsrowcollapse')) {
            this.toogleExpandcollapse(target as Element);
        }
    }

    /** 
     * Collapses a detail row with the given target.     
     * @return {void} 
     */
    public collapse(target: number | Element): void {
        if (!isNaN(target as number)) {
            target = this.getTDfromIndex(target as number, '.e-detailsrowexpand');
        }
        if (target && (target as Element).classList.contains('e-detailsrowexpand')) {
            this.toogleExpandcollapse(target as Element);
        }
    }

    /** 
     * Expands all the detail rows of Grid.          
     * @return {void} 
     */
    public expandAll(): void {
        this.expandCollapse(true);
    }

    /** 
     * Collapses all the detail rows of Grid.         
     * @return {void} 
     */
    public collapseAll(): void {
        this.expandCollapse(false);
    }

    private expandCollapse(isExpand: boolean): void {
        let td: Element;
        let rows: Element[] = this.parent.getDataRows();
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            td = rows[i].querySelector('.e-detailsrowcollapse, .e-detailsrowexpand');
            isExpand ? this.expand(td) : this.collapse(td);
        }
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        let gObj: IGrid = this.parent;
        switch (e.action) {
            case 'ctrlDownArrow':
                this.expandAll();
                break;
            case 'ctrlUpArrow':
                this.collapseAll();
                break;
            case 'altUpArrow':
            case 'altDownArrow':
                let selected: number[] = gObj.allowSelection ? gObj.getSelectedRowIndexes() : [];
                if (selected.length) {
                    let dataRow: HTMLTableRowElement = gObj.getDataRows()[selected[selected.length - 1]] as HTMLTableRowElement;
                    let td: Element = dataRow.querySelector('.e-detailsrowcollapse, .e-detailsrowexpand');
                    e.action === 'altDownArrow' ? this.expand(td) : this.collapse(td);
                }
                break;
        }
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'detailsRow';
    }

}

