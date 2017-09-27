import { KeyboardEventArgs, Browser, EventHandler, MouseEventArgs } from '@syncfusion/ej2-base';
import { isNullOrUndefined, isUndefined } from '@syncfusion/ej2-base';
import { remove, createElement, closest, classList } from '@syncfusion/ej2-base';
import { IGrid, IAction, IIndex, ISelectedCell, IPosition, IRenderer } from '../base/interface';
import { SelectionSettings } from '../base/grid';
import { setCssInGridPopUp, getPosition, parentsUntil } from '../base/util';
import * as events from '../base/constant';
import { RenderType } from '../base/enum';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';

/**
 * `Selection` module is used to handle cell and row selection.
 */
export class Selection implements IAction {
    //Internal variables       
    /**
     * @hidden
     */
    public selectedRowIndexes: number[] = [];
    /**
     * @hidden
     */
    public selectedRowCellIndexes: ISelectedCell[] = [];
    /**
     * @hidden
     */
    public selectedRecords: Element[] = [];
    /**
     * @hidden
     */
    public isRowSelected: boolean;
    /**
     * @hidden
     */
    public isCellSelected: boolean;
    private selectionSettings: SelectionSettings;
    private prevRowIndex: number;
    private prevCIdxs: IIndex;
    private prevECIdxs: IIndex;
    private selectedRowIndex: number;
    private isMultiShiftRequest: boolean = false;
    private isMultiCtrlRequest: boolean = false;
    private enableSelectMultiTouch: boolean = false;
    private element: HTMLElement;
    private startIndex: number;
    private currentIndex: number;
    private isDragged: boolean;
    private x: number;
    private y: number;
    private target: Element;
    private preSelectedCellIndex: IIndex;
    private factory: RendererFactory;
    private contentRenderer: IRenderer;
    //Module declarations
    private parent: IGrid;

    /**
     * Constructor for the Grid selection module
     * @hidden
     */
    constructor(parent?: IGrid, selectionSettings?: SelectionSettings, locator?: ServiceLocator) {
        this.parent = parent;
        this.selectionSettings = selectionSettings;
        this.factory = locator.getService<RendererFactory>('rendererFactory');
        this.addEventListener();
    }

    private initializeSelection(): void {
        EventHandler.add(this.parent.getContent(), 'mousedown', this.mouseDownHandler, this);
    }

    /**
     * The function used to trigger onActionBegin
     * @return {void}
     * @hidden
     */
    public onActionBegin(args: Object, type: string): void {
        this.parent.trigger(<string>type, args);
    }

    /**
     * The function used to trigger onActionComplete
     * @return {void}
     * @hidden
     */
    public onActionComplete(args: Object, type: string): void {
        this.parent.trigger(<string>type, args);
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'selection';
    }

    /**
     * To destroy the selection 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.hidePopUp();
        this.clearSelection();
        this.removeEventListener();
        EventHandler.remove(this.parent.getContent(), 'mousedown', this.mouseDownHandler);
    }

    private isEditing(): boolean {
        return this.parent.editSettings.mode !== 'batch' && this.parent.isEdit;
    }


    /** 
     * Selects a row by given index. 
     * @param  {number} index - Defines the row index. 
     * @return {void} 
     */
    public selectRow(index: number): void {
        let gObj: IGrid = this.parent;
        let selectedRow: Element = gObj.getRowByIndex(index);
        let selectData: Object = gObj.getCurrentViewRecords()[index];
        if (!this.isRowType() || !selectedRow || this.isEditing()) {
            // if (this.isEditing()) {
            //     gObj.selectedRowIndex = index;
            // }
            return;
        }
        let isRowSelected: boolean = selectedRow.hasAttribute('aria-selected');
        let isToogle: boolean = index === this.prevRowIndex && isRowSelected;
        if (!isToogle) {
            this.onActionBegin(
                {
                    data: selectData, rowIndex: index, isCtrlPressed: this.isMultiCtrlRequest,
                    isShiftPressed: this.isMultiShiftRequest, row: selectedRow, previousRow: gObj.getRows()[this.prevRowIndex],
                    previousRowIndex: this.prevRowIndex, target: this.target
                },
                events.rowSelecting);
        }
        this.clearRow();
        if (!isToogle) {
            this.updateRowSelection(selectedRow, index);
            this.parent.selectedRowIndex = index;
        }
        this.updateRowProps(index);
        if (!isToogle) {
            this.onActionComplete(
                {
                    data: selectData, rowIndex: index,
                    row: selectedRow, previousRow: gObj.getRows()[this.prevRowIndex],
                    previousRowIndex: this.prevRowIndex, target: this.target
                },
                events.rowSelected);
        }
    }

    /** 
     * Selects a range of rows from start and end row index. 
     * @param  {number} startIndex - Specifies the start row index. 
     * @param  {number} endIndex - Specifies the end row index. 
     * @return {void} 
     */
    public selectRowsByRange(startIndex: number, endIndex?: number): void {
        this.selectRows(this.getCollectionFromIndexes(startIndex, endIndex));
        this.parent.selectedRowIndex = endIndex;
    }

    /** 
     * Selects a collection of rows by indexes. 
     * @param  {number[]} rowIndexes - Specifies the row indexes.
     * @return {void} 
     */
    public selectRows(rowIndexes: number[]): void {
        let gObj: IGrid = this.parent;
        let selectedRow: Element = gObj.getRowByIndex(rowIndexes[0]);
        let selectedData: Object = gObj.getCurrentViewRecords()[rowIndexes[0]];
        if (this.isSingleSel() || !this.isRowType() || this.isEditing()) {
            return;
        }
        this.onActionBegin(
            {
                rowIndexes: rowIndexes, row: selectedRow, rowIndex: rowIndexes[0], target: this.target,
                prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
                data: selectedData
            },
            events.rowSelecting);
        this.clearRow();
        for (let rowIndex of rowIndexes) {
            this.updateRowSelection(gObj.getRowByIndex(rowIndex), rowIndex);
        }
        this.updateRowProps(rowIndexes[0]);
        this.onActionComplete(
            {
                rowIndexes: rowIndexes, row: selectedRow, rowIndex: rowIndexes[0], target: this.target,
                prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex,
                data: selectedData
            },
            events.rowSelected);
    }

    /** 
     * Select rows with existing row selection by passing row indexes. 
     * @param  {number} startIndex - Specifies the row indexes. 
     * @return {void} 
     * @hidden
     */
    public addRowsToSelection(rowIndexes: number[]): void {
        let gObj: IGrid = this.parent;
        let selectedRow: Element = gObj.getRowByIndex(rowIndexes[0]);
        if (this.isSingleSel() || !this.isRowType() || this.isEditing()) {
            return;
        }
        for (let rowIndex of rowIndexes) {
            let data: Object = gObj.getCurrentViewRecords()[rowIndex];
            let isUnSelected: boolean = this.selectedRowIndexes.indexOf(rowIndex) > -1;
            gObj.selectedRowIndex = rowIndex;
            if (isUnSelected) {
                this.rowDeselect(events.rowDeselecting, [rowIndex], data, [selectedRow]);
                this.selectedRowIndexes.splice(this.selectedRowIndexes.indexOf(rowIndex), 1);
                this.selectedRecords.splice(this.selectedRecords.indexOf(selectedRow), 1);
                selectedRow.removeAttribute('aria-selected');
                this.addRemoveClassesForRow(selectedRow, false, null, 'e-selectionbackground', 'e-active');
                this.rowDeselect(events.rowDeselecting, [rowIndex], data, [selectedRow]);
            } else {
                this.onActionBegin(
                    {
                        data: data, rowIndex: rowIndex, row: selectedRow, target: this.target,
                        prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex,
                        isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest
                    },
                    events.rowSelecting);
                this.updateRowSelection(selectedRow, rowIndex);
            }
            this.updateRowProps(rowIndex);
            if (!isUnSelected) {
                this.onActionComplete(
                    {
                        data: data, rowIndex: rowIndex, row: selectedRow, target: this.target,
                        prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex
                    },
                    events.rowSelected);
            }
        }
    }

    private getCollectionFromIndexes(startIndex: number, endIndex: number): number[] {
        let indexes: number[] = [];
        let { i, max }: { i: number, max: number } = (startIndex < endIndex) ?
            { i: startIndex, max: endIndex } : { i: endIndex, max: startIndex };
        for (; i <= max; i++) {
            indexes.push(i);
        }
        if (startIndex > endIndex) {
            indexes.reverse();
        }
        return indexes;
    }

    private clearRow(): void {
        this.clearRowSelection();
        this.selectedRowIndexes = [];
        this.selectedRecords = [];
        this.parent.selectedRowIndex = -1;
    }

    private updateRowProps(startIndex: number): void {
        this.prevRowIndex = startIndex;
        this.isRowSelected = this.selectedRowIndexes.length && true;
    }

    private updateRowSelection(selectedRow: Element, startIndex: number): void {
        if (!selectedRow) {
            return;
        }
        this.selectedRowIndexes.push(startIndex);
        this.selectedRecords.push(selectedRow);
        selectedRow.setAttribute('aria-selected', 'true');
        this.addRemoveClassesForRow(selectedRow, true, null, 'e-selectionbackground', 'e-active');
    }

    /** 
     * Deselects the current selected rows and cells.
     * @return {void} 
     */
    public clearSelection(): void {
        let span: Element = this.parent.element.querySelector('.e-gridpopup').querySelector('span');
        if (span.classList.contains('e-rowselect')) {
            span.classList.remove('e-spanclicked');
        }
        this.clearRowSelection();
        this.clearCellSelection();
        this.enableSelectMultiTouch = false;
    }

    /** 
     * Deselects the current selected rows.
     * @return {void} 
     */
    public clearRowSelection(): void {
        if (this.isRowSelected) {
            let rows: Element[] = this.parent.getDataRows();
            let data: Object[] = [];
            let row: Element[] = [];
            let rowIndex: number[] = [];
            let currentViewData: Object[] = this.parent.getCurrentViewRecords();

            for (let i: number = 0, len: number = this.selectedRowIndexes.length; i < len; i++) {
                data.push(currentViewData[this.selectedRowIndexes[i]]);
                row.push(this.parent.getRows()[this.selectedRowIndexes[i]]);
                rowIndex.push(this.selectedRowIndexes[i]);
            }
            this.rowDeselect(events.rowDeselecting, rowIndex, data, row);
            for (let i: number = 0, len: number = this.selectedRowIndexes.length; i < len; i++) {
                let row: Element = this.parent.getRowByIndex(this.selectedRowIndexes[i]);
                if (row) { row.removeAttribute('aria-selected'); }
                this.addRemoveClassesForRow(row, false, true, 'e-selectionbackground', 'e-active');
            }
            this.selectedRowIndexes = [];
            this.selectedRecords = [];
            this.isRowSelected = false;
            this.parent.selectedRowIndex = undefined;
            this.rowDeselect(events.rowDeselected, rowIndex, data, row);
        }
    }

    private rowDeselect(type: string, rowIndex: number[], data: Object, row: Element[]): void {
        this.parent.trigger(type, {
            rowIndex: rowIndex, data: data, row: row
        });
    }

    /**
     * Selects a cell by given index.
     * @param  {IIndex} cellIndex - Defines the row and column index. 
     * @return {void}
     */
    public selectCell(cellIndex: IIndex): void {
        if (!this.isCellType()) { return; }
        let gObj: IGrid = this.parent;
        let selectedCell: Element = gObj.getCellFromIndex(cellIndex.rowIndex, cellIndex.cellIndex);
        this.currentIndex = cellIndex.rowIndex;
        let selectedData: Object = gObj.getCurrentViewRecords()[this.currentIndex];
        if (!this.isCellType() || !selectedCell || this.isEditing()) {
            return;
        }
        let isCellSelected: boolean = selectedCell.classList.contains('e-cellselectionbackground');
        let isUpdate: boolean = !(!isUndefined(this.prevCIdxs) &&
            cellIndex.rowIndex === this.prevCIdxs.rowIndex && cellIndex.cellIndex === this.prevCIdxs.cellIndex &&
            isCellSelected);

        if (isUpdate) {
            this.onActionBegin(
                {
                    data: selectedData, cellIndex: cellIndex, currentCell: selectedCell,
                    isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
                    previousRowCell: this.prevECIdxs ?
                        gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
                },
                events.cellSelecting);
        }
        this.clearCell();
        if (isUpdate) {
            this.updateCellSelection(selectedCell, cellIndex.rowIndex, cellIndex.cellIndex);
        }
        this.updateCellProps(cellIndex, cellIndex);
        if (isUpdate) {
            this.onActionComplete(
                {
                    data: selectedData, cellIndex: cellIndex, currentCell: selectedCell,
                    previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes,
                    previousRowCell: this.prevECIdxs ?
                        gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
                },
                events.cellSelected);
        }
    }

    /**
     * Selects a range of cells from start and end index. 
     * @param  {IIndex} startIndex - Specifies the row and column index of start index.
     * @param  {IIndex} endIndex - Specifies the row and column index of end index.
     * @return {void}
     */
    public selectCellsByRange(startIndex: IIndex, endIndex?: IIndex): void {
        if (!this.isCellType()) { return; }
        let gObj: IGrid = this.parent;
        let selectedCell: Element = gObj.getCellFromIndex(startIndex.rowIndex, startIndex.cellIndex);
        let min: number;
        let max: number;
        let stIndex: IIndex = startIndex;
        let edIndex: IIndex = endIndex = endIndex ? endIndex : startIndex;
        let cellIndexes: number[];
        this.currentIndex = startIndex.rowIndex;
        let selectedData: Object = gObj.getCurrentViewRecords()[this.currentIndex];
        if (this.isSingleSel() || !this.isCellType() || this.isEditing()) {
            return;
        }
        this.onActionBegin(
            {
                data: selectedData, cellIndex: startIndex, currentCell: selectedCell,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
                previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            },
            events.cellSelecting);
        this.clearCell();
        if (startIndex.rowIndex > endIndex.rowIndex) {
            let temp: IIndex = startIndex;
            startIndex = endIndex;
            endIndex = temp;
        }
        for (let i: number = startIndex.rowIndex; i <= endIndex.rowIndex; i++) {
            if (this.selectionSettings.cellSelectionMode !== 'box') {
                min = i === startIndex.rowIndex ? (startIndex.cellIndex) : 0;
                max = i === endIndex.rowIndex ? (endIndex.cellIndex) : gObj.getColumns().length - 1;
            } else {
                min = startIndex.cellIndex;
                max = endIndex.cellIndex;
            }
            cellIndexes = [];
            for (let j: number = min < max ? min : max, len: number = min > max ? min : max; j <= len; j++) {
                selectedCell = gObj.getCellFromIndex(i, j);
                if (!selectedCell) {
                    continue;
                }
                cellIndexes.push(j);
                this.updateCellSelection(selectedCell);
                this.addAttribute(selectedCell);
            }
            this.selectedRowCellIndexes.push({ rowIndex: i, cellIndexes: cellIndexes });
        }
        this.updateCellProps(stIndex, edIndex);
        this.onActionComplete(
            {
                data: selectedData, cellIndex: startIndex, currentCell: selectedCell,
                previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes,
                previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            },
            events.cellSelected);
    }

    /**
     * Selects a collection of cells by row and column indexes. 
     * @param  {{ rowIndex: number, cellIndexes: number[] }[]} rowCellIndexes - Specifies the row and column indexes.
     * @return {void}
     */
    public selectCells(rowCellIndexes: ISelectedCell[]): void {
        if (!this.isCellType()) { return; }
        let gObj: IGrid = this.parent;
        let selectedCell: Element = gObj.getCellFromIndex(rowCellIndexes[0].rowIndex, rowCellIndexes[0].cellIndexes[0]);
        this.currentIndex = rowCellIndexes[0].rowIndex;
        let selectedData: Object = gObj.getCurrentViewRecords()[this.currentIndex];
        if (this.isSingleSel() || !this.isCellType() || this.isEditing()) {
            return;
        }
        this.onActionBegin(
            {
                data: selectedData, cellIndex: rowCellIndexes[0].cellIndexes[0],
                currentCell: selectedCell, isCtrlPressed: this.isMultiCtrlRequest,
                isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
                previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            },
            events.cellSelecting);
        for (let i: number = 0, len: number = rowCellIndexes.length; i < len; i++) {
            for (let j: number = 0, cellLen: number = rowCellIndexes[i].cellIndexes.length; j < cellLen; j++) {
                selectedCell = gObj.getCellFromIndex(rowCellIndexes[i].rowIndex, rowCellIndexes[i].cellIndexes[j]);
                if (!selectedCell) {
                    continue;
                }
                this.updateCellSelection(selectedCell);
                this.addAttribute(selectedCell);
                this.addRowCellIndex({ rowIndex: rowCellIndexes[i].rowIndex, cellIndex: rowCellIndexes[i].cellIndexes[j] });
            }
        }
        this.updateCellProps(
            { rowIndex: rowCellIndexes[0].rowIndex, cellIndex: rowCellIndexes[0].cellIndexes[0] },
            { rowIndex: rowCellIndexes[0].rowIndex, cellIndex: rowCellIndexes[0].cellIndexes[0] });
        this.onActionComplete(
            {
                data: selectedData, cellIndex: rowCellIndexes[0].cellIndexes[0],
                currentCell: selectedCell,
                previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes,
                previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            },
            events.cellSelected);
    }

    /**
     * Select cells with existing cell selection by passing row and column index. 
     * @param  {IIndex} startIndex - Defines the collection of row and column index.
     * @return {void}
     * @hidden
     */
    public addCellsToSelection(cellIndexes: IIndex[]): void {
        if (!this.isCellType()) { return; }
        let gObj: IGrid = this.parent;
        let selectedCell: Element = gObj.getCellFromIndex(cellIndexes[0].rowIndex, cellIndexes[0].cellIndex);
        let index: number;
        this.currentIndex = cellIndexes[0].rowIndex;
        let selectedData: Object = gObj.getCurrentViewRecords()[this.currentIndex];
        if (this.isSingleSel() || !this.isCellType() || this.isEditing()) {
            return;
        }
        for (let cellIndex of cellIndexes) {
            for (let i: number = 0, len: number = this.selectedRowCellIndexes.length; i < len; i++) {
                if (this.selectedRowCellIndexes[i].rowIndex === cellIndex.rowIndex) {
                    index = i;
                    break;
                }
            }
            let args: Object = {
                data: selectedData, cellIndex: cellIndexes[0],
                isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
                currentCell: selectedCell, isCtrlPressed: this.isMultiCtrlRequest,
                previousRowCell: this.prevECIdxs ?
                    gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            };
            let isUnSelected: boolean = index > -1;
            if (isUnSelected) {
                let selectedCellIdx: number[] = this.selectedRowCellIndexes[index].cellIndexes;
                if (selectedCellIdx.indexOf(cellIndex.cellIndex) > -1) {
                    this.cellDeselect(
                        events.cellDeselecting, [{ rowIndex: cellIndex.rowIndex, cellIndexes: [cellIndex.cellIndex] }],
                        selectedData, [selectedCell]);
                    selectedCellIdx.splice(selectedCellIdx.indexOf(cellIndex.cellIndex), 1);
                    selectedCell.classList.remove('e-cellselectionbackground');
                    selectedCell.removeAttribute('aria-selected');
                    this.cellDeselect(
                        events.cellDeselected, [{ rowIndex: cellIndex.rowIndex, cellIndexes: [cellIndex.cellIndex] }],
                        selectedData, [selectedCell]);
                } else {
                    isUnSelected = false;
                    this.onActionBegin(args, events.cellSelecting);
                    this.addRowCellIndex({ rowIndex: cellIndex.rowIndex, cellIndex: cellIndex.cellIndex });
                    this.updateCellSelection(selectedCell);
                    this.addAttribute(selectedCell);
                }
            } else {
                this.onActionBegin(args, events.cellSelecting);
                this.updateCellSelection(selectedCell, cellIndex.rowIndex, cellIndex.cellIndex);
            }
            this.updateCellProps(cellIndex, cellIndex);
            if (!isUnSelected) {
                this.onActionComplete(
                    {
                        data: selectedData, cellIndex: cellIndexes[0], currentCell: selectedCell,
                        previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) :
                            undefined, previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes
                    },
                    events.cellSelected);
            }
        }
    }

    private clearCell(): void {
        this.clearCellSelection();
    }

    private cellDeselect(type: string, cellIndexes: ISelectedCell[], data: Object, cells: Element[]): void {
        this.parent.trigger(type, {
            cells: cells, data: data, cellIndexes: cellIndexes
        });
    }

    private updateCellSelection(selectedCell: Element, rowIndex?: number, cellIndex?: number): void {
        if (!isNullOrUndefined(rowIndex)) {
            this.addRowCellIndex({ rowIndex: rowIndex, cellIndex: cellIndex });
        }
        selectedCell.classList.add('e-cellselectionbackground');
        this.addAttribute(selectedCell);
    }

    private addAttribute(cell: Element): void {
        this.target = cell;
        cell.setAttribute('aria-selected', 'true');
        (<HTMLElement>cell).focus();
    }

    private updateCellProps(startIndex: IIndex, endIndex: IIndex): void {
        this.prevCIdxs = startIndex;
        this.prevECIdxs = endIndex;
        this.isCellSelected = this.selectedRowCellIndexes.length && true;
    }

    private addRowCellIndex(rowCellIndex: IIndex): void {
        let isRowAvail: boolean;
        let index: number;
        for (let i: number = 0, len: number = this.selectedRowCellIndexes.length; i < len; i++) {
            if (this.selectedRowCellIndexes[i].rowIndex === rowCellIndex.rowIndex) {
                isRowAvail = true;
                index = i;
                break;
            }
        }
        if (isRowAvail) {
            if (this.selectedRowCellIndexes[index].cellIndexes.indexOf(rowCellIndex.cellIndex) < 0) {
                this.selectedRowCellIndexes[index].cellIndexes.push(rowCellIndex.cellIndex);
            }
        } else {
            this.selectedRowCellIndexes.push({ rowIndex: rowCellIndex.rowIndex, cellIndexes: [rowCellIndex.cellIndex] });
        }

    }

    /** 
     * Deselects the current selected cells.
     * @return {void} 
     */
    public clearCellSelection(): void {
        if (this.isCellSelected) {
            let gObj: IGrid = this.parent;
            let selectedCells: Element[] = this.getSelectedCellsElement();
            let rowCell: ISelectedCell[] = this.selectedRowCellIndexes;
            let data: Object[] = [];
            let cells: Element[] = [];
            let currentViewData: Object[] = gObj.getCurrentViewRecords();

            for (let i: number = 0, len: number = rowCell.length; i < len; i++) {
                data.push(currentViewData[rowCell[i].rowIndex]);
                for (let j: number = 0, cLen: number = rowCell.length; j < cLen; j++) {
                    cells.push(this.parent.getCellFromIndex(rowCell[i].rowIndex, rowCell[i].cellIndexes[j]));
                }
            }
            this.cellDeselect(events.cellDeselecting, rowCell, data, cells);

            for (let i: number = 0, len: number = selectedCells.length; i < len; i++) {
                selectedCells[i].classList.remove('e-cellselectionbackground');
                selectedCells[i].removeAttribute('aria-selected');
            }
            this.selectedRowCellIndexes = [];
            this.isCellSelected = false;
            this.cellDeselect(events.cellDeselected, rowCell, data, cells);
        }
    }

    private getSelectedCellsElement(): Element[] {
        let rows: Element[] = this.parent.getDataRows();
        let cells: Element[] = [];
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            cells = cells.concat([].slice.call(rows[i].querySelectorAll('.e-cellselectionbackground')));
        }
        return cells;
    }

    private mouseMoveHandler(e: MouseEventArgs): void {
        e.preventDefault();
        let gBRect: ClientRect = this.parent.element.getBoundingClientRect();
        let x1: number = this.x;
        let y1: number = this.y;
        let position: IPosition = getPosition(e);
        let x2: number = position.x - gBRect.left;
        let y2: number = position.y - gBRect.top;
        let tmp: number;
        let target: Element = closest(e.target as Element, 'tr');
        this.isDragged = true;
        if (!target) {
            target = closest(document.elementFromPoint(this.parent.element.offsetLeft + 2, e.clientY), 'tr');
        }
        if (x1 > x2) {
            tmp = x2;
            x2 = x1;
            x1 = tmp;
        }
        if (y1 > y2) {
            tmp = y2;
            y2 = y1;
            y1 = tmp;
        }
        this.element.style.left = x1 + 'px';
        this.element.style.top = y1 + 'px';
        this.element.style.width = x2 - x1 + 'px';
        this.element.style.height = y2 - y1 + 'px';
        if (target && !e.ctrlKey && !e.shiftKey) {
            let rowIndex: number = parseInt(target.getAttribute('aria-rowindex'), 10);
            this.selectRowsByRange(this.startIndex, rowIndex);
        }
    }

    private mouseUpHandler(e: MouseEventArgs): void {
        document.body.classList.remove('e-disableuserselect');
        remove(this.element);
        EventHandler.remove(this.parent.getContent(), 'mousemove', this.mouseMoveHandler);
        EventHandler.remove(document.body, 'mouseup', this.mouseUpHandler);
        this.isDragged = false;
    }

    private mouseDownHandler(e: MouseEventArgs): void {
        let target: Element = e.target as Element;
        let gridElement: Element = parentsUntil(target, 'e-grid');
        if (gridElement && gridElement.id !== this.parent.element.id) {
            return;
        }
        if (e.shiftKey || e.ctrlKey) {
            e.preventDefault();
        }
        if (this.parent.allowRowDragAndDrop && target.classList.contains('e-rowcell') && !e.shiftKey && !e.ctrlKey) {
            if (!this.isRowType() || this.isSingleSel() || closest(target, 'td').classList.contains('e-selectionbackground')) {
                this.isDragged = false;
                return;
            }
            document.body.classList.add('e-disableuserselect');
            let tr: Element = closest(e.target as Element, 'tr');
            let gBRect: ClientRect = this.parent.element.getBoundingClientRect();
            let postion: IPosition = getPosition(e);
            this.startIndex = parseInt(tr.getAttribute('aria-rowindex'), 10);
            this.x = postion.x - gBRect.left;
            this.y = postion.y - gBRect.top;
            this.element = createElement('div', { className: 'e-griddragarea' });
            this.parent.getContent().appendChild(this.element);
            EventHandler.add(this.parent.getContent(), 'mousemove', this.mouseMoveHandler, this);
            EventHandler.add(document.body, 'mouseup', this.mouseUpHandler, this);
        }
    }

    private clearSelAfterRefresh(e: { requestType: string }): void {
        if (e.requestType !== 'virtualscroll') {
            this.clearSelection();
        }
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initialEnd, this.initializeSelection, this);
        this.parent.on(events.rowSelectionComplete, this.onActionComplete, this);
        this.parent.on(events.cellSelectionComplete, this.onActionComplete, this);
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.keyPressed, this.keyPressHandler, this);
        this.parent.on(events.dataReady, this.dataReady, this);
        this.parent.on(events.dataReady, this.clearSelAfterRefresh, this);
        this.parent.on(events.columnPositionChanged, this.clearSelection, this);
        this.parent.on(events.contentReady, this.initialEnd, this);
    }
    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initialEnd, this.initializeSelection);
        this.parent.off(events.rowSelectionComplete, this.onActionComplete);
        this.parent.off(events.cellSelectionComplete, this.onActionComplete);
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.keyPressed, this.keyPressHandler);
        this.parent.off(events.dataReady, this.dataReady);
        this.parent.off(events.dataReady, this.clearSelAfterRefresh);
        this.parent.off(events.columnPositionChanged, this.clearSelection);
    }

    public dataReady(e: { requestType: string }): void {
        if (e.requestType !== 'virtualscroll') {
            this.clearSelection();
        }
    };


    private onPropertyChanged(e: { module: string, properties: SelectionSettings }): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        let gObj: IGrid = this.parent;
        if (!isNullOrUndefined(e.properties.type) && this.selectionSettings.type === 'single') {
            if (this.selectedRowCellIndexes.length > 1) {
                this.clearCellSelection();
            }
            if (this.selectedRowIndexes.length > 1) {
                this.clearRowSelection();
            }
            this.enableSelectMultiTouch = false;
            this.hidePopUp();
        }

        if (!isNullOrUndefined(e.properties.mode) ||
            !isNullOrUndefined(e.properties.cellSelectionMode)) {
            this.clearSelection();
        }
    }

    private hidePopUp(): void {
        if (this.parent.element.querySelector('.e-gridpopup').querySelectorAll('.e-rowselect').length) {
            (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        }
    }

    private initialEnd(): void {
        this.parent.off(events.contentReady, this.initialEnd);
        this.selectRow(this.parent.selectedRowIndex);
    }

    private clickHandler(e: MouseEvent): void {
        let target: HTMLElement = e.target as HTMLElement;
        this.isMultiCtrlRequest = e.ctrlKey || this.enableSelectMultiTouch;
        this.isMultiShiftRequest = e.shiftKey;
        this.popUpClickHandler(e);
        if (target.classList.contains('e-rowcell')) {
            this.target = target;
            this.rowCellSelectionHandler(
                parseInt(target.parentElement.getAttribute('aria-rowindex'), 10), parseInt(target.getAttribute('aria-colindex'), 10));
            if (Browser.isDevice && this.parent.selectionSettings.type === 'multiple') {
                this.showPopup(e);
            }
        }
        this.isMultiCtrlRequest = false;
        this.isMultiShiftRequest = false;
    }

    private popUpClickHandler(e: MouseEvent): void {
        let target: Element = e.target as Element;
        if (closest(target, '.e-headercell') || (e.target as HTMLElement).classList.contains('e-rowcell') ||
            closest(target, '.e-gridpopup')) {
            if (target.classList.contains('e-rowselect')) {
                if (!target.classList.contains('e-spanclicked')) {
                    target.classList.add('e-spanclicked');
                    this.enableSelectMultiTouch = true;
                } else {
                    target.classList.remove('e-spanclicked');
                    this.enableSelectMultiTouch = false;
                    (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
                }
            }
        } else {
            (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        }
    }

    private showPopup(e: MouseEvent): void {
        setCssInGridPopUp(
            <HTMLElement>this.parent.element.querySelector('.e-gridpopup'), e,
            'e-rowselect e-icons e-icon-rowselect' +
            (this.selectionSettings.type === 'multiple' &&
                (this.selectedRecords.length > 1 || this.selectedRowCellIndexes.length > 1) ? ' e-spanclicked' : ''));
    }

    private rowCellSelectionHandler(rowIndex: number, cellIndex: number): void {
        if (!this.isMultiCtrlRequest && !this.isMultiShiftRequest) {
            if (!this.isDragged) {
                this.selectRow(rowIndex);
            }
            this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex });
        } else if (this.isMultiShiftRequest) {
            this.selectRowsByRange(isUndefined(this.prevRowIndex) ? rowIndex : this.prevRowIndex, rowIndex);
            this.selectCellsByRange(
                isUndefined(this.prevCIdxs) ? { rowIndex: rowIndex, cellIndex: cellIndex } : this.prevCIdxs,
                { rowIndex: rowIndex, cellIndex: cellIndex });
        } else {
            this.addRowsToSelection([rowIndex]);
            this.addCellsToSelection([{ rowIndex: rowIndex, cellIndex: cellIndex }]);
        }
        this.isDragged = false;
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        let checkScroll: boolean;
        let preventDefault: boolean;
        switch (e.action) {
            case 'downArrow':
                checkScroll = true;
                this.downArrowKey();
                break;
            case 'upArrow':
                checkScroll = true;
                this.upArrowKey();
                break;
            case 'rightArrow':
                preventDefault = true;
                this.rightArrowKey();
                break;
            case 'leftArrow':
                preventDefault = true;
                this.leftArrowKey();
                break;
            case 'home':
                preventDefault = true;
                this.homeKey();
                break;
            case 'end':
                preventDefault = true;
                this.endKey();
                break;
            case 'ctrlHome':
                preventDefault = true;
                this.ctrlHomeKey();
                break;
            case 'ctrlEnd':
                preventDefault = true;
                this.ctrlEndKey();
                break;
            case 'shiftDown':
                this.shiftDownKey();
                break;
            case 'shiftUp':
                this.shiftUpKey();
                break;
            case 'shiftRight':
                this.shiftRightKey();
                break;
            case 'shiftLeft':
                this.shiftLeftKey();
                break;
            case 'escape':
                preventDefault = true;
                this.clearSelection();
                break;
            case 'ctrlPlusA':
                preventDefault = true;
                this.ctrlPlusA();
                break;
        }
        if (checkScroll) {
            let scrollElem: Element = this.parent.getContent().firstElementChild;
            if (this.selectedRecords.length || this.selectedRowCellIndexes.length) {
                let row: HTMLTableRowElement = this.selectedRecords.length ? (this.selectedRecords[0] as HTMLTableRowElement) :
                    this.parent.getRowByIndex(this.selectedRowCellIndexes[0].rowIndex) as HTMLTableRowElement;
                let height: number = row.offsetHeight;
                let rowIndex: number = row.rowIndex;
                scrollElem.scrollTop = scrollElem.scrollTop + (e.action === 'downArrow' ? height : height * -1);
                if (this.checkVisible(row) &&
                    rowIndex !== 0 && this.parent.getContentTable().querySelector('tbody').children.length !== rowIndex + 1) {
                    e.preventDefault();
                }
            }
        }
        if (preventDefault) {
            e.preventDefault();
        }
    }

    private checkVisible(element: HTMLElement): boolean {
        let st: number = window.scrollY;
        let y: number = element.getBoundingClientRect().top + st;
        return y + 36 < (window.innerHeight + st) - this.getRowHeight(element) && y > (st - element.offsetHeight) +
            this.getRowHeight(element);
    }

    private getRowHeight(element: HTMLElement): number {
        return element.getBoundingClientRect().height;
    }

    /**
     * Apply ctrl + A key selection
     * @return {void}
     * @hidden
     */
    public ctrlPlusA(): void {
        if (this.isRowType() && !this.isSingleSel()) {
            this.selectRowsByRange(0, this.parent.getRows().length - 1);
        }
        if (this.isCellType() && !this.isSingleSel()) {
            this.selectCellsByRange(
                { rowIndex: 0, cellIndex: 0 },
                { rowIndex: this.parent.getRows().length - 1, cellIndex: this.parent.getColumns().length - 1 });
        }
    }

    /**
     * Apply downArrow key selection
     * @return {void}
     * @hidden
     */
    public downArrowKey(): void {
        this.applyDownUpKey(
            1,
            !isUndefined(this.parent.selectedRowIndex) && this.parent.selectedRowIndex + 1 < this.parent.getRows().length,
            !isUndefined(this.prevECIdxs) &&
            this.prevECIdxs.rowIndex + 1 < this.parent.getRows().length);
    }

    /**
     * Apply upArrow key selection
     * @return {void}
     * @hidden
     */
    public upArrowKey(): void {
        this.applyDownUpKey(
            -1,
            !isUndefined(this.parent.selectedRowIndex) && this.parent.selectedRowIndex - 1 > -1,
            !isUndefined(this.prevECIdxs) && this.prevECIdxs.rowIndex - 1 > -1);
    }

    private applyDownUpKey(key: number, cond1: boolean, cond2: boolean): void {
        let gObj: IGrid = this.parent;
        if (this.isRowType() && cond1) {
            this.selectRow(gObj.selectedRowIndex + key);
            this.applyUpDown(gObj.selectedRowIndex);
        }
        if (this.isCellType() && cond2) {
            this.selectCell({ rowIndex: this.prevECIdxs.rowIndex + key, cellIndex: this.prevECIdxs.cellIndex });
        }
    }

    private applyUpDown(rowIndex: number): void {
        let cIndex: number = parseInt(this.target.getAttribute('aria-colindex'), 10);
        this.target = this.contentRenderer.getRowByIndex(rowIndex).querySelectorAll('.e-rowcell')[cIndex];
        this.addAttribute(this.target);
    }

    /**
     * Apply rightArrow key selection
     * @return {void}
     * @hidden
     */
    public rightArrowKey(): void {
        this.preSelectedCellIndex = this.prevECIdxs;
        this.applyRightLeftKey(
            1, 0, !isUndefined(this.prevECIdxs) && this.prevECIdxs.cellIndex + 1 < this.parent.getColumns().length);
    }

    /**
     * Apply leftArrow key selection
     * @return {void}
     * @hidden
     */
    public leftArrowKey(): void {
        this.preSelectedCellIndex = this.prevECIdxs;
        this.applyRightLeftKey(
            -1,
            this.parent.getColumns().length - 1,
            !isUndefined(this.prevECIdxs) && this.prevECIdxs.cellIndex - 1 > -1
        );
    }

    private applyRightLeftKey(key1: number, key2: number, cond: boolean): void {
        let gObj: IGrid = this.parent;
        let cellIndex: number;
        let rowIndex: number;
        if (!isNullOrUndefined(this.prevECIdxs)) {
            cellIndex = this.prevECIdxs.cellIndex;
            rowIndex = this.prevECIdxs.rowIndex;
        }
        if (this.isCellType()) {
            if (cond && this.prevECIdxs.cellIndex + key1 > -1 &&
                this.prevECIdxs.cellIndex + key1 < this.parent.getColumns().length) {
                cellIndex = this.prevECIdxs.cellIndex + key1;
                rowIndex = this.prevECIdxs.rowIndex;
                this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex });
            } else if (this.prevECIdxs.rowIndex + key1 > -1 &&
                this.prevECIdxs.rowIndex + key1 < this.parent.getRows().length) {
                cellIndex = key2;
                rowIndex = this.prevECIdxs.rowIndex + key1;
                this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex });
            }
            if (this.isCellHide({ rowIndex: rowIndex, cellIndex: cellIndex })) {
                if (!((cellIndex === 0 && rowIndex === 0) ||
                    (cellIndex === gObj.getColumns().length - 1 && rowIndex === gObj.getRows().length - 1))) {
                    this.applyRightLeftKey(key1, key2, cond);
                } else {
                    this.selectCell(this.preSelectedCellIndex);
                }
            }
        } else if (this.isRowType()) {
            let cellIndex: number = parseInt(this.target.getAttribute('aria-colindex'), 10);
            let rowElement: Element = closest(this.target, 'tr');
            if (cellIndex + key1 > -1 && cellIndex + key1 < this.parent.getColumns().length) {
                let cell: Element = (<HTMLTableRowElement>rowElement).querySelectorAll('.e-rowcell')[cellIndex + key1];
                if (cell) {
                    if (!cell.classList.contains('e-hide')) {
                        this.addAttribute(cell);
                    } else {
                        key1 += key1;
                        this.applyRightLeftKey(key1, key2, cond);
                    }
                }
            } else {
                this.addAttribute(this.target);
            }
        }
    }

    /**
     * Apply home key selection
     * @return {void}
     * @hidden
     */
    public homeKey(): void {
        this.applyHomeEndKey({ rowIndex: this.currentIndex || 0, cellIndex: 0 });
    }

    /**
     * Apply end key selection
     * @return {void}
     * @hidden
     */
    public endKey(): void {
        this.applyHomeEndKey(
            { rowIndex: this.currentIndex || 0, cellIndex: this.parent.getColumns().length - 1 });
    }

    private applyHomeEndKey(key: IIndex): void {
        if (this.isCellType()) {
            this.selectCell(key);
            if (this.isCellHide(key)) {
                if (key.cellIndex > 0) {
                    this.applyRightLeftKey(-1, this.parent.getColumns().length - 1, true);
                } else {
                    this.applyRightLeftKey(1, 0, true);
                }
            }
        } else {
            this.addAttribute(this.parent.getCellFromIndex(key.rowIndex, key.cellIndex));
        }
    }

    /**
     * Apply shift+down key selection
     * @return {void}
     * @hidden
     */
    public shiftDownKey(): void {
        let gObj: IGrid = this.parent;
        this.isMultiShiftRequest = true;
        if (this.isRowType() && !this.isSingleSel()) {
            if (!isUndefined(this.prevRowIndex)) {
                let endIndex: number = isUndefined(gObj.selectedRowIndex) ? this.prevRowIndex + 1 :
                    (gObj.selectedRowIndex + 1 < this.parent.getRows().length ?
                        gObj.selectedRowIndex + 1 : gObj.selectedRowIndex);
                if (endIndex < this.parent.getRows().length) {
                    this.selectRowsByRange(this.prevRowIndex, endIndex);
                    this.applyUpDown(endIndex);
                }
            } else {
                this.selectRow(0);
            }
        }
        if (this.isCellType() && !this.isSingleSel()) {
            if (!isUndefined(this.prevCIdxs)) {
                if (this.prevECIdxs.rowIndex + 1 < this.parent.getRows().length) {
                    this.selectCellsByRange(
                        this.prevCIdxs,
                        { rowIndex: this.prevECIdxs.rowIndex + 1, cellIndex: this.prevECIdxs.cellIndex });
                }
            } else {
                this.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: 1, cellIndex: 0 });
            }
        }
        this.isMultiShiftRequest = false;
    }

    /**
     * Apply shift+up key selection
     * @return {void}
     * @hidden
     */
    public shiftUpKey(): void {
        let gObj: IGrid = this.parent;
        this.isMultiShiftRequest = true;
        if (this.isRowType() && !isUndefined(this.prevRowIndex) && !this.isSingleSel()) {
            let endIndex: number = isUndefined(gObj.selectedRowIndex) ? (this.prevRowIndex - 1 > -1 ? (this.prevRowIndex - 1) : 0) :
                ((gObj.selectedRowIndex - 1) > -1 ? gObj.selectedRowIndex - 1 : gObj.selectedRowIndex);
            this.selectRowsByRange(this.prevRowIndex, endIndex);
            this.applyUpDown(endIndex);
        }
        if (this.isCellType() && !isUndefined(this.prevECIdxs) && (this.prevECIdxs.rowIndex - 1) > -1 && !this.isSingleSel()) {
            this.selectCellsByRange(
                this.prevCIdxs, { rowIndex: this.prevECIdxs.rowIndex - 1, cellIndex: this.prevECIdxs.cellIndex });
        }
        this.isMultiShiftRequest = false;
    }

    /**
     * Apply shift+left key selection
     * @return {void}
     * @hidden
     */
    public shiftLeftKey(): void {
        this.applyShiftLeftRightKey(-1, !isUndefined(this.prevCIdxs) && this.prevECIdxs.cellIndex - 1 > -1);
    }

    /**
     * Apply shift+right key selection
     * @return {void}
     * @hidden
     */
    public shiftRightKey(): void {
        this.applyShiftLeftRightKey(
            1, !isUndefined(this.prevCIdxs) && this.prevECIdxs.cellIndex + 1 < this.parent.getColumns().length);
    }

    private applyShiftLeftRightKey(key: number, cond: boolean): void {
        let gObj: IGrid = this.parent;
        let cellIndex: IIndex;
        this.isMultiShiftRequest = true;
        if (this.isCellType() && !this.isSingleSel()) {
            if (cond) {
                cellIndex = { rowIndex: this.prevECIdxs.rowIndex, cellIndex: this.prevECIdxs.cellIndex + key };
                this.selectCellsByRange(
                    this.prevCIdxs, {
                        rowIndex: this.prevECIdxs.rowIndex, cellIndex: this.prevECIdxs.cellIndex + key
                    });
            } else if (!this.isSingleSel()) {
                if (this.selectionSettings.cellSelectionMode === 'flow' &&
                    (key > 0 ? this.prevECIdxs.rowIndex + 1 < this.parent.pageSettings.pageSize : this.prevECIdxs.rowIndex - 1 > -1)) {
                    cellIndex = { rowIndex: this.prevECIdxs.rowIndex + key, cellIndex: key > 0 ? 0 : gObj.getColumns().length - 1 };
                    this.selectCellsByRange(
                        this.prevCIdxs, {
                            rowIndex: this.prevECIdxs.rowIndex + key, cellIndex: key > 0 ? 0 : gObj.getColumns().length - 1
                        });
                }
            }
            if (!isNullOrUndefined(cellIndex) && this.isCellHide(cellIndex) && !((cellIndex.rowIndex === 0 && cellIndex.cellIndex === 0) ||
                (cellIndex.rowIndex === gObj.getRows().length - 1 && cellIndex.cellIndex === gObj.getColumns().length))) {
                this.applyShiftLeftRightKey(key, cellIndex.cellIndex > 0);
            }
        }
        this.isMultiShiftRequest = false;
    }

    /**
     * Apply ctrl+home key selection
     * @return {void}
     * @hidden
     */
    public ctrlHomeKey(): void {
        this.applyCtrlHomeEndKey(0, 0);
    }

    /**
     * Apply ctrl+end key selection
     * @return {void}
     * @hidden
     */
    public ctrlEndKey(): void {
        this.applyCtrlHomeEndKey(this.parent.getRows().length - 1, this.parent.getColumns().length - 1);
    }

    private applyCtrlHomeEndKey(rowIndex: number, colIndex: number): void {
        if (this.isRowType()) {
            this.selectRow(rowIndex);
            this.addAttribute(this.parent.getCellFromIndex(rowIndex, colIndex));
        }
        if (this.isCellType()) {
            this.selectCell({ rowIndex: rowIndex, cellIndex: colIndex });
            if (this.isCellHide({ rowIndex: rowIndex, cellIndex: colIndex })) {
                if (colIndex > 0) {
                    this.applyRightLeftKey(-1, this.parent.getColumns().length - 1, true);
                } else {
                    this.applyRightLeftKey(1, 0, true);
                }
            }
        }
    }

    private addRemoveClassesForRow(row: Element, isAdd: boolean, clearAll: boolean, ...args: string[]): void {
        if (row) {
            let cells: Element[] = [].slice.call(row.querySelectorAll('.e-rowcell'));
            let cell: Element = row.querySelector('.e-detailrowcollapse') || row.querySelector('.e-detailrowexpand');
            if (cell) {
                cells.push(cell);
            }
            for (let i: number = 0, len: number = cells.length; i < len; i++) {
                if (isAdd) {
                    classList(cells[i], [...args], []);
                    cells[i].setAttribute('aria-selected', 'true');
                } else {
                    classList(cells[i], [], [...args]);
                    cells[i].removeAttribute('aria-selected');
                }
            }
        }
        this.getRenderer().setSelection(row ? row.getAttribute('data-uid') : null, isAdd, clearAll);
    }

    private isRowType(): boolean {
        return this.selectionSettings.mode === 'row' || this.selectionSettings.mode === 'both';
    }

    private isCellType(): boolean {
        return this.selectionSettings.mode === 'cell' || this.selectionSettings.mode === 'both';
    }

    private isSingleSel(): boolean {
        return this.selectionSettings.type === 'single';
    }

    private isCellHide(cellIndex: IIndex): boolean {
        return !this.parent.getColumns()[cellIndex.cellIndex].visible;
    }

    private getRenderer(): IRenderer {
        if (isNullOrUndefined(this.contentRenderer)) {
            this.contentRenderer = this.factory.getRenderer(RenderType.Content);
        }
        return this.contentRenderer;
    }

}
