import { Browser } from '@syncfusion/ej2-base';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base/util';
import { remove, createElement, closest, classList } from '@syncfusion/ej2-base/dom';
import { SortSettings } from '../base/grid';
import { Column } from '../models/column';
import { IGrid, IAction, NotifyArgs } from '../base/interface';
import { SortDirection } from '../base/enum';
import { setCssInGridPopUp, getActualPropFromColl } from '../base/util';
import * as events from '../base/constant';
import { SortDescriptorModel } from '../base/grid-model';
import { AriaService } from '../services/aria-service';

/**
 * 
 * `Sort` module is used to handle sorting action.
 */
export class Sort implements IAction {
    //Internal variables   
    private columnName: string;
    private direction: SortDirection;
    private isMultiSort: boolean;
    private lastSortedCol: string;
    private sortSettings: SortSettings;
    private enableSortMultiTouch: boolean;
    private contentRefresh: boolean = true;
    private isRemove: boolean;
    private sortedColumns: string[];
    private isModelChanged: boolean = true;
    private aria: AriaService = new AriaService();

    //Module declarations   
    private parent: IGrid;

    /**
     * Constructor for Grid sorting module
     * @hidden
     */
    constructor(parent?: IGrid, sortSettings?: SortSettings, sortedColumns?: string[], ) {
        this.parent = parent;
        this.sortSettings = sortSettings;
        this.sortedColumns = sortedColumns;
        this.addEventListener();
    }

    /**
     * The function used to update sortSettings 
     * @return {void}
     * @hidden
     */
    public updateModel(): void {
        let sortedColumn: SortDescriptorModel = { field: this.columnName, direction: this.direction };
        let index: number;
        let gCols: string[] = this.parent.groupSettings.columns;
        let flag: boolean = false;
        if (!this.isMultiSort) {
            if (!gCols.length) {
                this.sortSettings.columns = [sortedColumn];
            } else {
                let sortedCols: SortDescriptorModel[] = [];
                for (let i: number = 0, len: number = gCols.length; i < len; i++) {
                    index = this.getSortedColsIndexByField(gCols[i], sortedCols);
                    if (this.columnName === gCols[i]) {
                        flag = true;
                        sortedCols.push(sortedColumn);
                    } else {
                        let sCol: SortDescriptorModel = this.getSortColumnFromField(gCols[i]);
                        sortedCols.push({ field: sCol.field, direction: sCol.direction });
                    }
                }
                if (!flag) {
                    sortedCols.push(sortedColumn);
                }
                this.sortSettings.columns = sortedCols;
            }
        } else {
            index = this.getSortedColsIndexByField(this.columnName);
            if (index > -1) {
                this.sortSettings.columns[index] = sortedColumn;
            } else {
                this.sortSettings.columns.push(sortedColumn);
            }
            this.sortSettings.columns = this.sortSettings.columns;
        }
        this.parent.dataBind();
        this.lastSortedCol = this.columnName;
    }

    /**
     * The function used to trigger onActionComplete
     * @return {void}
     * @hidden
     */
    public onActionComplete(e: NotifyArgs): void {
        let args: Object = !this.isRemove ? {
            columnName: this.columnName, direction: this.direction, requestType: 'sorting', type: events.actionComplete
        } : { requestType: 'sorting', type: events.actionComplete };
        this.isRemove = false;
        this.parent.trigger(events.actionComplete, extend(e, args));
    }

    /** 
     * Sorts a column with given options. 
     * @param {string} columnName - Defines the column name to sort.  
     * @param {SortDirection} direction - Defines the direction of sorting for field.  
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns to be maintained. 
     * @return {void} 
     */
    public sortColumn(columnName: string, direction: SortDirection, isMultiSort?: boolean): void {
        if (this.parent.getColumnByField(columnName).allowSorting === false) {
            return;
        }
        this.columnName = columnName;
        this.direction = direction;
        this.isMultiSort = isMultiSort;
        this.removeSortIcons();
        let column: Element = this.parent.getColumnHeaderByField(columnName);
        this.updateSortedCols(columnName, isMultiSort);
        this.updateModel();
    }

    private updateSortedCols(columnName: string, isMultiSort: boolean): void {
        if (!isMultiSort) {
            if (this.parent.allowGrouping) {
                for (let i: number = 0, len: number = this.sortedColumns.length; i < len; i++) {
                    if (this.parent.groupSettings.columns.indexOf(this.sortedColumns[i]) < 0) {
                        this.sortedColumns.splice(i, 1);
                        len--;
                        i--;
                    }
                }
            } else {
                this.sortedColumns.splice(0, this.sortedColumns.length);
            }
        }
        if (this.sortedColumns.indexOf(columnName) < 0) {
            this.sortedColumns.push(columnName);
        }
    }

    /**
     * @hidden
     */
    public onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        if (this.contentRefresh) {
            let args: Object = this.sortSettings.columns.length ? {
                columnName: this.columnName, direction: this.direction, requestType: 'sorting', type: events.actionBegin
            } : { requestType: 'sorting', type: events.actionBegin };
            this.parent.notify(events.modelChanged, args);
        }
        this.removeSortIcons();
        this.addSortIcons();
    }

    /**  
     * Clears all the sorted columns of Grid.  
     * @return {void} 
     */
    public clearSorting(): void {
        let cols: SortDescriptorModel[] = getActualPropFromColl(this.sortSettings.columns);
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            this.removeSortColumn(cols[i].field);
        }
    }

    /** 
     * Remove sorted column by field name. 
     * @param {string} field - Defines the column field name to remove sort.  
     * @return {void} 
     * @hidden
     */
    public removeSortColumn(field: string): void {
        let gObj: IGrid = this.parent;
        let cols: SortDescriptorModel[] = this.sortSettings.columns;
        this.removeSortIcons();
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            if (cols[i].field === field) {
                if (gObj.allowGrouping && gObj.groupSettings.columns.indexOf(cols[i].field) > -1) {
                    continue;
                }
                this.sortedColumns.splice(this.sortedColumns.indexOf(cols[i].field), 1);
                cols.splice(i, 1);
                this.isRemove = true;
                if (this.isModelChanged) {
                    this.parent.notify(events.modelChanged, {
                        requestType: 'sorting', type: events.actionBegin
                    });
                }
                break;
            }
        }
        this.addSortIcons();
    }

    private getSortedColsIndexByField(field: string, sortedColumns?: SortDescriptorModel[]): number {
        let cols: SortDescriptorModel[] = sortedColumns ? sortedColumns : this.sortSettings.columns;
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            if (cols[i].field === field) {
                return i;
            }
        }
        return -1;
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'sort';
    }

    private initialEnd(): void {
        this.parent.off(events.contentReady, this.initialEnd);
        if (this.parent.getColumns().length && this.sortSettings.columns.length) {
            let gObj: IGrid = this.parent;
            this.contentRefresh = false;
            this.isMultiSort = this.sortSettings.columns.length > 1;
            for (let col of gObj.sortSettings.columns) {
                if (this.sortedColumns.indexOf(col.field) > -1) {
                    this.sortColumn(col.field, col.direction, true);
                }
            }
            this.isMultiSort = false;
            this.contentRefresh = true;
        }
    }
    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.contentReady, this.initialEnd, this);
        this.parent.on(events.sortComplete, this.onActionComplete, this);
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.headerRefreshed, this.refreshSortIcons, this);
    }
    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.sortComplete, this.onActionComplete);
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.headerRefreshed, this.refreshSortIcons);
    }

    /**
     * To destroy the sorting 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.isModelChanged = false;
        if (this.parent.element.querySelector('.e-gridpopup').querySelectorAll('.e-sortdirect').length) {
            (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        }
        this.clearSorting();
        this.isModelChanged = true;
        this.removeEventListener();
    }

    private clickHandler(e: MouseEvent): void {
        this.popUpClickHandler(e);
        let target: Element = closest(e.target as Element, '.e-headercell');
        if (target && !(e.target as Element).classList.contains('e-grptogglebtn') &&
            !(e.target as Element).classList.contains('e-stackedheadercell')) {
            let gObj: IGrid = this.parent;
            let field: string = gObj.getColumnByUid(target.querySelector('.e-headercelldiv').getAttribute('e-mappinguid')).field;
            let direction: SortDirection = !target.querySelectorAll('.e-ascending').length ? 'ascending' :
                'descending';
            if (!e.shiftKey) {
                this.sortColumn(field, direction, e.ctrlKey || this.enableSortMultiTouch);
            } else {
                this.removeSortColumn(field);
            }
            if (Browser.isDevice) {
                this.showPopUp(e);
            }
        }
    }

    private showPopUp(e: MouseEvent): void {
        let target: HTMLElement = closest(e.target as Element, '.e-headercell') as HTMLElement;
        if (!isNullOrUndefined(target)) {
            setCssInGridPopUp(
                <HTMLElement>this.parent.element.querySelector('.e-gridpopup'), e,
                'e-sortdirect e-icons e-icon-sortdirect' + (this.sortedColumns.length > 1 ? ' e-spanclicked' : ''));
        }
    }

    private popUpClickHandler(e: MouseEvent): void {
        let target: Element = e.target as Element;
        if (closest(target, '.e-headercell') || (e.target as HTMLElement).classList.contains('e-rowcell') ||
            closest(target, '.e-gridpopup')) {
            if (target.classList.contains('e-sortdirect')) {
                if (!target.classList.contains('e-spanclicked')) {
                    target.classList.add('e-spanclicked');
                    this.enableSortMultiTouch = true;
                } else {
                    target.classList.remove('e-spanclicked');
                    this.enableSortMultiTouch = false;
                    (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
                }
            }
        } else {
            (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        }
    }

    private addSortIcons(): void {
        let gObj: IGrid = this.parent;
        let header: Element;
        let filterElement: Element;
        let cols: SortDescriptorModel[] = this.sortSettings.columns;
        let fieldNames: string[] = this.parent.getColumns().map((c: Column) => c.field);
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            if (fieldNames.indexOf(cols[i].field) === -1) { continue; }
            header = gObj.getColumnHeaderByField(cols[i].field);
            this.aria.setSort(<HTMLElement>header, cols[i].direction);
            if (this.isMultiSort && cols.length > 1) {
                header.querySelector('.e-headercelldiv').insertBefore(
                    createElement('span', { className: 'e-sortnumber', innerHTML: (i + 1).toString() }),
                    header.querySelector('.e-headertext'));
            }
            filterElement = header.querySelector('.e-sortfilterdiv');
            if (cols[i].direction === 'ascending') {
                classList(filterElement, ['e-ascending', 'e-icon-ascending'], []);
            } else {
                classList(filterElement, ['e-descending', 'e-icon-descending'], []);
            }
        }
    }

    private removeSortIcons(position?: number): void {
        let gObj: IGrid = this.parent;
        let header: Element;
        let cols: SortDescriptorModel[] = this.sortSettings.columns;
        let fieldNames: string[] = this.parent.getColumns().map((c: Column) => c.field);
        for (let i: number = position ? position : 0,
            len: number = !isNullOrUndefined(position) ? position + 1 : cols.length; i < len; i++) {
            if (gObj.allowGrouping && gObj.groupSettings.columns.indexOf(cols[i].field) > -1) {
                continue;
            }
            if (fieldNames.indexOf(cols[i].field) === -1) { continue; }
            header = gObj.getColumnHeaderByField(cols[i].field);
            this.aria.setSort(<HTMLElement>header, 'none');
            classList(
                header.querySelector('.e-sortfilterdiv'), [], ['e-descending', 'e-icon-descending', 'e-ascending', 'e-icon-ascending']);
            if (header.querySelector('.e-sortnumber')) {
                header.querySelector('.e-headercelldiv').removeChild(header.querySelector('.e-sortnumber'));
            }
        }
    }

    private getSortColumnFromField(field: string): SortDescriptorModel {
        for (let i: number = 0, len: number = this.sortSettings.columns.length; i < len; i++) {
            if (this.sortSettings.columns[i].field === field) {
                return this.sortSettings.columns[i];
            }
        }
        return false as SortDescriptorModel;
    }

    private updateAriaAttr(): void {
        let fieldNames: string[] = this.parent.getColumns().map((c: Column) => c.field);
        for (let col of this.sortedColumns) {
            if (fieldNames.indexOf(col) === -1) { continue; }
            let header: Element = this.parent.getColumnHeaderByField(col);
            this.aria.setSort(<HTMLElement>header, this.getSortColumnFromField(col).direction);
        }
    }

    private refreshSortIcons(): void {
        this.removeSortIcons();
        this.isMultiSort = true;
        this.removeSortIcons();
        this.addSortIcons();
        this.isMultiSort = false;
        this.updateAriaAttr();
    }


}