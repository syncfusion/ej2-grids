import { EventHandler, getValue, KeyboardEventArgs, closest, isNullOrUndefined, addClass, removeClass } from '@syncfusion/ej2-base';
import { IGrid, IFocus, FocusInfo, FocusedContainer, IIndex } from '../base/interface';
import { CellType } from '../base/enum';
import * as event from '../base/constant';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { Column } from '../models/column';

/**
 * FocusStrategy class
 * @hidden
 */
export class FocusStrategy {
    public parent: IGrid;
    public currentInfo: FocusInfo = {};
    public oneTime: boolean = true;
    public swap: boolean;
    public content: IFocus; public header: IFocus; public active: IFocus;
    private forget: boolean = true;
    private skipFocus: boolean = false;
    private prevIndexes: IIndex = {};
    constructor(parent: IGrid) {
        this.parent = parent;
        this.addEventListener();
    }

    protected focusCheck(e: Event): void {
        let target: HTMLElement = <HTMLElement>e.target;
        this.skipFocus = closest(target, 'e-pager') !== null;
    }

    protected onFocus(): void {
        if (this.parent.isDestroyed) { return; }
        this.setActive(true);
        let current: number[] = this.getContent().matrix.get(0, -1, [0, 1], null, this.getContent().validator());
        this.getContent().matrix.select(current[0], current[1]);
        if (this.skipFocus) {
            this.focus();
            this.skipFocus = false;
        }
    }

    public onClick(e: Event | { target: Element }, force?: boolean): void {
        let isContent: boolean = !isNullOrUndefined(closest(<HTMLElement>e.target, '.e-gridcontent'));
        if (!isContent && isNullOrUndefined(closest(<HTMLElement>e.target, '.e-gridheader'))) { return; }
        this.setActive(isContent);
        let returnVal: boolean = this.getContent().onClick(e, force);
        if (returnVal === false) { return; }
        this.focus();
    }

    protected onKeyPress(e: KeyboardEventArgs): void {
        if (this.skipOn(e)) {
            return;
        }
        let bValue: number[] = this.getContent().matrix.current;
        this.currentInfo.outline = true;
        this.swap = this.getContent().jump(e.action, bValue);
        if (this.swap) {
            let isHeader: boolean = this.header === this.getContent();
            this.setActive(isHeader); let rowInitVal: number = isHeader ? -1 : this.header.matrix.matrix.length;
            let current: number[] = this.getContent().matrix.get(rowInitVal, bValue[1], [0, 0], e.action, this.getContent().validator());
            this.getContent().matrix.current = [rowInitVal, current[1]];
            this.prevIndexes = {};
        }
        e.preventDefault();
        this.getContent().onKeyPress(e);
        this.focus(e);
    }

    private skipOn(e: KeyboardEventArgs): boolean {
        let target: HTMLElement = <HTMLElement>e.target; if (!target) { return false; }
        return (this.parent.editSettings.mode !== 'batch' && (this.parent.isEdit || ['insert', 'f2', 'delete'].indexOf(e.action) > -1)
        || (closest(document.activeElement, '.e-filterbarcell') !== null && ['leftArrow', 'rightArrow'].indexOf(e.action) > -1)
        || (closest(target, '.e-gridcontent') === null && closest(target, '.e-gridheader') === null)
        || (e.action === 'space' && (!target.classList.contains('e-gridchkbox') && closest(target, '.e-gridchkbox') === null
        && closest(target, '.e-headerchkcelldiv') === null)));
    }

    public getFocusedElement(): HTMLElement {
        return this.currentInfo.elementToFocus;
    }

    public getContent(): IFocus {
        return this.active || this.content;
    }

    public setActive(content: boolean): void {
        this.active = content ? this.content : this.header;
    }

    public setFocusedElement(element: HTMLElement): void {
        this.currentInfo.elementToFocus = element;
        setTimeout(() => this.currentInfo.elementToFocus.focus(), 0);
    }

    public focus(e?: KeyboardEventArgs): void {
        this.removeFocus();
        this.addFocus(this.getContent().getFocusInfo(), e);
    }

    protected removeFocus(): void {
        if (!this.currentInfo.element) { return; }
        removeClass([this.currentInfo.element, this.currentInfo.elementToFocus], ['e-focused', 'e-focus']);
        this.currentInfo.elementToFocus.tabIndex = -1;
    }

    protected addFocus(info: FocusInfo, e?: KeyboardEventArgs): void {
        this.currentInfo = info; this.currentInfo.outline = info.outline && !isNullOrUndefined(e);
        if (!info.element) { return; }
        let isFocused: boolean = info.elementToFocus.classList.contains('e-focus');
        if (isFocused) { return; }
        if (this.currentInfo.outline) {
            addClass([info.element], ['e-focused']);
        }
        addClass([info.elementToFocus], ['e-focus']);
        info.element.tabIndex = 0;
        if (!isFocused) {
            this.setFocusedElement(info.elementToFocus);
        }
        this.parent.notify(event.cellFocused, {
            element: info.elementToFocus,
            parent: info.element,
            indexes: this.getContent().matrix.current,
            byKey: !isNullOrUndefined(e),
            byClick: isNullOrUndefined(e),
            keyArgs: e,
            isJump: this.swap,
            container: this.getContent().getInfo(e),
            outline: !isNullOrUndefined(e)
        });
        let [rowIndex, cellIndex]: number[] = this.getContent().matrix.current;
        this.prevIndexes = { rowIndex, cellIndex };
    }

    protected refreshMatrix(content?: boolean): Function {
        return (e: { rows: Row<Column>[], args?: { requestType?: string } }) => {
            if (content && !this.content) {
                this.content = new ContentFocus(this.parent);
            }
            if (!content && !this.header) {
                this.header = new HeaderFocus(this.parent);
            }
            let cFocus: IFocus = content ? this.content : this.header;
            cFocus.matrix.generate(e.rows, cFocus.selector);
            cFocus.generateRows(e.rows);
            let actions: string[] = ['paging', 'grouping'];
            if (e.args && actions.indexOf(e.args.requestType) > -1) {
                this.onFocus();
            }
        };
    }

    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        EventHandler.add(this.parent.element, 'mousedown', this.focusCheck, this);
        EventHandler.add(this.parent.element, 'focus', this.onFocus, this);
        this.parent.on(event.keyPressed, this.onKeyPress, this);
        this.parent.on(event.click, this.onClick, this);
        this.parent.on(event.contentReady, this.refreshMatrix(true), this);
        this.parent.on(event.headerRefreshed, this.refreshMatrix(), this);
        this.parent.on('close-edit', this.restoreFocus, this);
        ['start-edit', 'start-add'].forEach((evt: string) => this.parent.on(evt, this.clearOutline, this));
        ['sorting'].forEach((action: string) => this.parent.on(`${action}-complete`, this.restoreFocus, this));
        this.parent.on(event.batchAdd, this.refreshMatrix(true), this);
        this.parent.on(event.batchDelete, this.refreshMatrix(true), this);
        this.parent.on(event.detailDataBound, this.refreshMatrix(true), this);
        this.parent.on(event.onEmpty, this.refreshMatrix(true), this);
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        EventHandler.remove(this.parent.element, 'mousedown', this.focusCheck);
        EventHandler.remove(this.parent.element, 'focus', this.onFocus);
        this.parent.off(event.keyPressed, this.onKeyPress);
        this.parent.off(event.click, this.onClick);
        this.parent.off(event.contentReady, this.refreshMatrix(true));
        this.parent.off(event.headerRefreshed, this.refreshMatrix());
        this.parent.off('close-edit', this.restoreFocus);
        ['start-edit', 'start-add'].forEach((evt: string) => this.parent.off(evt, this.clearOutline));
        ['sorting'].forEach((action: string) => this.parent.off(`${action}-complete`, this.restoreFocus));
        this.parent.off(event.batchAdd, this.refreshMatrix(true));
        this.parent.off(event.batchDelete, this.refreshMatrix(true));
        this.parent.off(event.detailDataBound, this.refreshMatrix(true));
        this.parent.off(event.onEmpty, this.refreshMatrix(true));
    }

    public destroy(): void {
        this.removeEventListener();
    }

    public restoreFocus(): void {
        this.addFocus(this.getContent().getFocusInfo());
    }

    public clearOutline(): void {
        this.getContent().matrix.current = this.getContent().matrix.get(0, -1, [0, 1], 'downArrow', this.getContent().validator());
        if (!this.currentInfo.element || !this.currentInfo.elementToFocus) { return; }
        removeClass([this.currentInfo.element, this.currentInfo.elementToFocus], ['e-focus', 'e-focused']);
    }

    public getPrevIndexes(): IIndex {
        let forget: boolean = this.forget; this.forget = false;
        return forget ? { rowIndex: null, cellIndex: null } : this.prevIndexes;
    }

    public forgetPrevious(): void {
        this.forget = true;
    }
}

/**
 * Create matrix from row collection which act as mental model for cell navigation
 * @hidden
 */
export class Matrix {
    public matrix: number[][] = [];
    public current: number[] = [];
    public columns: number;
    public rows: number;

    public set(rowIndex: number, columnIndex: number, allow?: boolean): void {
        rowIndex = Math.max(0, Math.min(rowIndex, this.rows));
        columnIndex = Math.max(0, Math.min(columnIndex, this.columns));
        this.matrix[rowIndex] = this.matrix[rowIndex] || [];
        this.matrix[rowIndex][columnIndex] = allow ? 1 : 0;
    }

    public get(rowIndex: number, columnIndex: number, navigator: number[], action?: string, validator?: Function): number[] {
        let tmp: number = columnIndex; if (rowIndex + navigator[0] < 0) { return [rowIndex, columnIndex]; }
        rowIndex = Math.max(0, Math.min(rowIndex + navigator[0], this.rows));
        columnIndex = Math.max(0, Math.min(columnIndex + navigator[1], this.matrix[rowIndex].length - 1));
        let first: number = this.first(this.matrix[rowIndex], columnIndex, navigator, true, action);
        columnIndex = first === null ? tmp : first; //console.log(`${rowIndex} ${columnIndex}`);
        let val: number = getValue(`${rowIndex}.${columnIndex}`, this.matrix);
        return this.inValid(val) || !validator(rowIndex, columnIndex, action) ?
            this.get(rowIndex, tmp, navigator, action, validator) : [rowIndex, columnIndex];
    }

    public first(vector: number[], index: number, navigator: number[], moveTo?: boolean, action?: string): number {
        if (((index < 0 || index === vector.length) && this.inValid(vector[index])
            && (action !== 'upArrow' && action !== 'downArrow')) || !vector.some((v: number) => v === 1)) {
            return null;
        }
        return !this.inValid(vector[index]) ? index :
            this.first(
                vector,
                (['upArrow', 'downArrow', 'shiftUp', 'shiftDown'].indexOf(action) !== -1) ? moveTo ? 0 : ++index : index + navigator[1],
                navigator, false, action);
    }

    public select(rowIndex: number, columnIndex: number): void {
        rowIndex = Math.max(0, Math.min(rowIndex, this.rows));
        columnIndex = Math.max(0, Math.min(columnIndex, this.matrix[rowIndex].length - 1));
        this.current = [rowIndex, columnIndex];
    }

    public generate(rows: Row<Column>[], selector: Function): number[][] {
        this.rows = rows.length - 1; this.matrix = [];
        rows.forEach((row: Row<Column>, rIndex: number) => {
            let cells: Cell<Column>[] = row.cells.filter((c: Cell<Column>) => c.isSpanned !== true);
            this.columns = Math.max(cells.length - 1, this.columns | 0);
            cells.forEach((cell: Cell<Column>, cIndex: number) => {
                this.set(rIndex, cIndex, selector(row, cell));
            });
        });
        return this.matrix;
    }

    public inValid(value: number): boolean {
        return value === 0 || value === undefined;
    }
}
/**
 * @hidden
 */
export class ContentFocus implements IFocus {
    public matrix: Matrix = new Matrix();
    public parent: IGrid;
    public keyActions: { [x: string]: number[] };
    public indexesByKey: (action: string) => number[];
    constructor(parent: IGrid) {
        this.parent = parent;
        this.keyActions = {
            'rightArrow': [0, 1],
            'tab': [0, 1],
            'leftArrow': [0, -1],
            'shiftTab': [0, -1],
            'upArrow': [-1, 0],
            'downArrow': [1, 0],
            'shiftUp': [-1, 0],
            'shiftDown': [1, 0],
            'shiftRight': [0, 1],
            'shiftLeft': [0, -1],
            'enter': [1, 0],
            'shiftEnter': [-1, 0]
        };
        this.indexesByKey = (action: string) => {
            let opt: Object = {
                'home': [this.matrix.current[0], -1, 0, 1],
                'end': [this.matrix.current[0], this.matrix.columns + 1, 0, -1],
                'ctrlHome': [0, -1, 0, 1],
                'ctrlEnd': [this.matrix.rows, this.matrix.columns + 1, 0, -1]
            };
            return opt[action] || null;
        };
    }
    public onKeyPress(e: KeyboardEventArgs): void {
        let navigator: number[] = this.keyActions[e.action];
        let current: number[] = this.getCurrentFromAction(e.action, navigator, e.action in this.keyActions, e);
        if (!current) { return; }
        this.matrix.select(current[0], current[1]);
    }

    public getCurrentFromAction(action: string, navigator: number[] = [0, 0], isPresent?: boolean, e?: KeyboardEventArgs): number[] {
        if (!isPresent && !this.indexesByKey(action)) { return null; }
        if (!this.shouldFocusChange(e)) { return this.matrix.current; }
        let [rowIndex, cellIndex, rN, cN]: number[] = this.indexesByKey(action) || [...this.matrix.current, ...navigator];
        let current: number[] = this.matrix.get(rowIndex, cellIndex, [rN, cN], action, this.validator());
        return current;
    }

    public onClick(e: Event, force?: boolean): void | boolean {
        let target: HTMLTableCellElement = <HTMLTableCellElement>e.target;
        target = <HTMLTableCellElement>(target.classList.contains('e-rowcell') ? target : closest(target, 'td'));
        if (!target) { return; }
        let [rowIndex, cellIndex]: number[] = [(<HTMLTableRowElement>target.parentElement).rowIndex, target.cellIndex];
        let [oRowIndex, oCellIndex]: number[] = this.matrix.current;
        let val: number = getValue(`${rowIndex}.${cellIndex}`, this.matrix.matrix);
        if (this.matrix.inValid(val) || (!force && oRowIndex === rowIndex && oCellIndex === cellIndex)) { return false; }
        this.matrix.select(rowIndex, cellIndex);
    }

    public getFocusInfo(): FocusInfo {
        let info: FocusInfo = {}; let [rowIndex = 0, cellIndex = 0]: number[] = this.matrix.current;
        this.matrix.current = [rowIndex, cellIndex];
        info.element = (<HTMLTableElement>this.parent.getContentTable())
            .rows[rowIndex].cells[cellIndex];
        info.elementToFocus = this.getFocusable(info.element);
        info.outline = !info.element.classList.contains('e-detailcell');
        return info;
    }

    protected getFocusable(element: HTMLElement): HTMLElement {
        let child: HTMLElement[] = [].slice
            .call(element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]'));

        /* Select the first focusable child element
         * if no child found then select the cell itself.
         */
        return child.length ? child[0] : element;
    }

    public selector(row: Row<Column>, cell: Cell<Column>): boolean {
        let types: CellType[] = [CellType.Expand, CellType.GroupCaption, CellType.CaptionSummary, CellType.GroupSummary];
        return ((row.isDataRow && cell.visible && (cell.isDataCell || cell.isTemplate))
            || (row.isDataRow && cell.cellType === CellType.DetailExpand)
            || (!row.isDataRow && types.indexOf(cell.cellType) > -1)
            || (cell.column && cell.column.type === 'checkbox'))
            && !(row.edit === 'delete' && row.isDirty);
    }

    public jump(action: string, current: number[]): boolean {
        return action === 'upArrow' && current[0] === 0;
    }

    public generateRows(rows?: Row<Column>[]): void {
        //extend in headerFocus 
    }

    public getInfo(e?: KeyboardEventArgs): FocusedContainer {
        let info: FocusInfo = this.getFocusInfo(); let [rIndex, cIndex]: number[] = this.matrix.current;
        let isData: boolean = info.element.classList.contains('e-rowcell');
        let isSelectable: boolean = isData || (e && e.action !== 'enter' && (info.element.classList.contains('e-detailrowcollapse')
            || info.element.classList.contains('e-detailrowexpand')));
        let [rowIndex, cellIndex]: number[] = [Math.min(parseInt(info.element.parentElement.getAttribute('aria-rowindex'), 10), rIndex),
        Math.min(parseInt(info.element.getAttribute('aria-colindex'), 10), cIndex)];
        return { isContent: true, isDataCell: isData, indexes: [rowIndex, cellIndex], isSelectable: isSelectable };
    }

    public validator(): Function {
        let table: HTMLTableElement = (<HTMLTableElement>this.parent.getContentTable());
        return (rowIndex: number, cellIndex: number, action?: string) => {
            let cell: HTMLElement = table.rows[rowIndex].cells[cellIndex];
            if (action === 'enter' || action === 'shiftEnter') {
                return cell.classList.contains('e-rowcell');
            }
            if ((action === 'shiftUp' || action === 'shiftDown') && cell.classList.contains('e-rowcell')) {
                return true;
            } else if (action !== 'shiftUp' && action !== 'shiftDown') {
                return cell.getBoundingClientRect().width !== 0;
            }
            return false;
        };
    }

    protected shouldFocusChange(e: KeyboardEventArgs): boolean {
        let [rIndex = -1, cIndex = -1]: number[] = this.matrix.current;
        if (rIndex < 0 || cIndex < 0) { return true; }
        let cell: Element = (<HTMLTableElement>this.parent.getContentTable()).rows[rIndex].cells[cIndex];
        return e.action === 'enter' || e.action === 'shiftEnter' ? cell.classList.contains('e-rowcell') : true;
    }
}
/**
 * @hidden
 */
export class HeaderFocus extends ContentFocus implements IFocus {
    constructor(parent: IGrid) {
        super(parent);
    }

    public onClick(e: Event): void | boolean {
        let target: HTMLTableCellElement = <HTMLTableCellElement>e.target;
        target = <HTMLTableCellElement>(target.classList.contains('e-headercell') ? target : closest(target, 'th'));
        let [rowIndex, cellIndex]: number[] = [(<HTMLTableRowElement>target.parentElement).rowIndex, target.cellIndex];
        let val: number = getValue(`${rowIndex}.${cellIndex}`, this.matrix.matrix);
        if (this.matrix.inValid(val)) { return false; }
        this.matrix.select((<HTMLTableRowElement>target.parentElement).rowIndex, target.cellIndex);
    }

    public getFocusInfo(): FocusInfo {
        let info: FocusInfo = {}; let [rowIndex = 0, cellIndex = 0]: number[] = this.matrix.current;
        info.element = (<HTMLTableElement>this.parent.getHeaderTable())
            .rows[rowIndex].cells[cellIndex];
        info.elementToFocus = this.getFocusable(info.element);
        info.outline = !info.element.classList.contains('e-filterbarcell');
        return info;
    }

    public selector(row: Row<Column>, cell: Cell<Column>): boolean {
        return (cell.visible && (cell.column.field !== undefined || cell.isTemplate)) || cell.column.type === 'checkbox';
    }

    public jump(action: string, current: number[]): boolean {
        return action === 'downArrow' && current[0] === this.matrix.matrix.length - 1;
    }

    public generateRows(rows?: Row<Column>[]): void {
        let length: number = this.matrix.matrix.length;
        if (this.parent.allowFiltering && this.parent.filterSettings.type === 'filterbar') {
            this.matrix.rows = ++this.matrix.rows;
            rows[0].cells.forEach((cell: Cell<Column>, cIndex: number) =>
                this.matrix.set(length, cIndex, cell.visible && cell.column.allowFiltering !== false));
        }
    }

    public getInfo(): FocusedContainer {
        return { isContent: false, isHeader: true };
    }

    public validator(): Function {
        return () => true;
    }
    protected shouldFocusChange(e: KeyboardEventArgs): boolean {
        let [rIndex, cIndex]: number[] = this.matrix.current;
        if (rIndex < 0 || cIndex < 0) { return true; }
        let cell: Element = (<HTMLTableElement>this.parent.getHeaderTable()).rows[rIndex].cells[cIndex];
        return e.action === 'enter' ? !cell.classList.contains('e-headercell') : true;
    }
}
