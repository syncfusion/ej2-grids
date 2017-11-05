import { Browser, EventHandler, MouseEventArgs } from '@syncfusion/ej2-base';
import { isNullOrUndefined, isUndefined } from '@syncfusion/ej2-base';
import { remove, createElement, closest, classList } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { IGrid, IAction, IIndex, ISelectedCell, IPosition, IRenderer, EJ2Intance, NotifyArgs, CellFocusArgs } from '../base/interface';
import { SelectionSettings } from '../base/grid';
import { setCssInGridPopUp, getPosition, parentsUntil, addRemoveActiveClasses } from '../base/util';
import * as events from '../base/constant';
import { RenderType } from '../base/enum';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { Data } from '../actions/data';
import { ReturnType } from '../base/type';
import { FocusStrategy } from '../services/focus-strategy';


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
    private preventFocus: boolean = false;
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
    private isChkSelection: boolean;
    private chkAllBox: HTMLInputElement;
    private checkedTarget: HTMLInputElement;
    private persistSelection: boolean = false;
    private primaryKey: string;
    private chkField: string;
    private selectedRowState: { [key: number]: boolean } = {};
    private chkAllObj: EJ2Intance;
    private isBatchEdit: boolean = false;
    private prevKey: number = 0;
    private totalRecordsCount: number = 0;
    private isChkAll: boolean = false;
    private isUnChkAll: boolean = false;
    private chkAllCollec: Object[] = [];
    private isCheckedOnAdd: boolean = false;
    private persistSelectedData: Object[] = [];
    private selectionRequest: boolean = false;
    //Module declarations
    private parent: IGrid;
    private focus: FocusStrategy;

    /**
     * Constructor for the Grid selection module
     * @hidden
     */
    constructor(parent?: IGrid, selectionSettings?: SelectionSettings, locator?: ServiceLocator) {
        this.parent = parent;
        this.selectionSettings = selectionSettings;
        this.factory = locator.getService<RendererFactory>('rendererFactory');
        this.focus = locator.getService<FocusStrategy>('focus');
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
        return this.parent.editSettings.mode !== 'batch' && this.parent.isEdit && !this.persistSelection;
    }


    /** 
     * Selects a row by given index. 
     * @param  {number} index - Defines the row index. 
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void} 
     */
    public selectRow(index: number, isToggle?: boolean): void {
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
        isToggle = !isToggle ? isToggle : index === this.prevRowIndex && isRowSelected;
        if (!isToggle) {
            this.onActionBegin(
                {
                    data: selectData, rowIndex: index, isCtrlPressed: this.isMultiCtrlRequest,
                    isShiftPressed: this.isMultiShiftRequest, row: selectedRow, previousRow: gObj.getRows()[this.prevRowIndex],
                    previousRowIndex: this.prevRowIndex, target: this.target
                },
                events.rowSelecting);
        }
        this.clearRow();
        if (!isToggle) {
            this.updateRowSelection(selectedRow, index);
            this.parent.selectedRowIndex = index;
        }
        this.updateRowProps(index);
        if (!isToggle) {
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

    private updatePersistCollection(selectedRow: Element, chkState: boolean): void {
        if (this.persistSelection && !isNullOrUndefined(selectedRow)) {
            let rowObj: Row<Column> = this.parent.getRowObjectFromUID(selectedRow.getAttribute('data-uid'));
            let pKey: string = rowObj ? rowObj.data[this.primaryKey] : null;
            if (pKey === null) { return; }
            rowObj.isSelected = chkState;
            if (chkState) {
                this.selectedRowState[pKey] = chkState;
                if (this.selectionRequest && this.persistSelectedData.indexOf(rowObj.data) < 0) {
                    this.persistSelectedData.push(rowObj.data);
                }
            } else {
                delete (this.selectedRowState[pKey]);
                if (this.selectionRequest && this.persistSelectedData.indexOf(rowObj.data) >= 0) {
                    this.persistSelectedData.splice(this.persistSelectedData.indexOf(rowObj.data), 1);
                }
            }
        }
    }

    private updateCheckBoxes(row: Element, chkState?: boolean): void {
        if (!isNullOrUndefined(row)) {
            let chkBox: HTMLInputElement = row.querySelector('.e-checkselect') as HTMLInputElement;
            if (!isNullOrUndefined(chkBox) && this.checkedTarget !== chkBox) {
                ((chkBox as HTMLElement) as EJ2Intance).ej2_instances[0].setProperties({ checked: chkState });
                if (isNullOrUndefined(this.checkedTarget) || (!isNullOrUndefined(this.checkedTarget)
                    && !this.checkedTarget.classList.contains('e-checkselectall'))) {
                    this.setCheckAllState();
                }
            }
        }
    }

    private updateRowSelection(selectedRow: Element, startIndex: number): void {
        if (!selectedRow) {
            return;
        }
        this.selectedRowIndexes.push(startIndex);
        this.selectedRecords.push(selectedRow);
        selectedRow.setAttribute('aria-selected', 'true');
        this.updatePersistCollection(selectedRow, true);
        this.updateCheckBoxes(selectedRow, true);
        this.addRemoveClassesForRow(selectedRow, true, null, 'e-selectionbackground', 'e-active');
        if (!this.preventFocus) {
            let target: Element = this.focus.getPrevIndexes().cellIndex ?
                (<HTMLTableRowElement>selectedRow).cells[this.focus.getPrevIndexes().cellIndex] :
                selectedRow.querySelector('.e-selectionbackground:not(.e-hide)');
            if (!target) { return; }
            this.focus.onClick({ target }, true);
        }
    }

    /** 
     * Deselects the current selected rows and cells.
     * @return {void} 
     */
    public clearSelection(): void {
        if (!this.persistSelection || (this.persistSelection && !this.parent.isEdit) ||
            (!isNullOrUndefined(this.checkedTarget) && this.checkedTarget.classList.contains('e-checkselectall'))) {
            let span: Element = this.parent.element.querySelector('.e-gridpopup').querySelector('span');
            if (span.classList.contains('e-rowselect')) {
                span.classList.remove('e-spanclicked');
            }
            this.clearRowSelection();
            this.clearCellSelection();
            this.enableSelectMultiTouch = false;
        }
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
                this.updatePersistCollection(row, false);
                this.updateCheckBoxes(row);
            }
            this.selectedRowIndexes = [];
            this.selectedRecords = [];
            this.isRowSelected = false;
            this.parent.selectedRowIndex = undefined;
            this.rowDeselect(events.rowDeselected, rowIndex, data, row);
        }
    }

    private rowDeselect(type: string, rowIndex: number[], data: Object, row: Element[]): void {
        this.updatePersistCollection(row[0], false);
        this.parent.trigger(type, {
            rowIndex: rowIndex, data: data, row: row
        });
        this.updateCheckBoxes(row[0]);
    }

    /**
     * Selects a cell by given index.
     * @param  {IIndex} cellIndex - Defines the row and column index. 
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    public selectCell(cellIndex: IIndex, isToggle?: boolean): void {
        if (!this.isCellType()) { return; }
        let gObj: IGrid = this.parent;
        let selectedCell: Element = gObj.getCellFromIndex(cellIndex.rowIndex, this.getColIndex(cellIndex.rowIndex, cellIndex.cellIndex));
        this.currentIndex = cellIndex.rowIndex;
        let selectedData: Object = gObj.getCurrentViewRecords()[this.currentIndex];
        if (!this.isCellType() || !selectedCell || this.isEditing()) {
            return;
        }
        let isCellSelected: boolean = selectedCell.classList.contains('e-cellselectionbackground');
        isToggle = !isToggle ? isToggle : !(!isUndefined(this.prevCIdxs) &&
            cellIndex.rowIndex === this.prevCIdxs.rowIndex && cellIndex.cellIndex === this.prevCIdxs.cellIndex &&
            isCellSelected);

        if (isToggle) {
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
        if (isToggle) {
            this.updateCellSelection(selectedCell, cellIndex.rowIndex, cellIndex.cellIndex);
        }
        this.updateCellProps(cellIndex, cellIndex);
        if (isToggle) {
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
                max = i === endIndex.rowIndex ? (endIndex.cellIndex) : this.getLastColIndex(i);
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
        let selectedCell: Element = gObj.getCellFromIndex(
            cellIndexes[0].rowIndex, this.getColIndex(cellIndexes[0].rowIndex, cellIndexes[0].cellIndex));
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

    private getColIndex(rowIndex: number, index: number): number {
        let cells: NodeListOf<Element> = this.parent.getDataRows()[rowIndex].querySelectorAll('td.e-rowcell');
        for (let m: number = 0; m < cells.length; m++) {
            let colIndex: number = parseInt(cells[m].getAttribute('aria-colindex'), 10);
            if (colIndex === index) {
                return m;
            }
        }
        return -1;
    }

    private getLastColIndex(rowIndex: number): number {
        let cells: NodeListOf<Element> = this.parent.getDataRows()[rowIndex].querySelectorAll('td.e-rowcell');
        return parseInt(cells[cells.length - 1].getAttribute('aria-colindex'), 10);
    }

    private clearCell(): void {
        this.clearCellSelection();
    }

    private cellDeselect(type: string, cellIndexes: ISelectedCell[], data: Object, cells: Element[]): void {
        if (cells[0] && cells[0].classList.contains('e-gridchkbox')) {
            this.updateCheckBoxes(closest(cells[0], 'tr'));
        }
        this.parent.trigger(type, {
            cells: cells, data: data, cellIndexes: cellIndexes
        });
    }

    private updateCellSelection(selectedCell: Element, rowIndex?: number, cellIndex?: number): void {
        if (!isNullOrUndefined(rowIndex)) {
            this.addRowCellIndex({ rowIndex: rowIndex, cellIndex: cellIndex });
        }
        selectedCell.classList.add('e-cellselectionbackground');
        if (selectedCell.classList.contains('e-gridchkbox')) {
            this.updateCheckBoxes(closest(selectedCell, 'tr'), true);
        }
        this.addAttribute(selectedCell);
    }

    private addAttribute(cell: Element): void {
        this.target = cell;
        cell.setAttribute('aria-selected', 'true');
        if (!this.preventFocus) {
            this.focus.onClick({ target: cell }, true);
        }
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
        if (e.requestType !== 'virtualscroll' && !this.persistSelection) {
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
        this.parent.on(events.cellFocused, this.onCellFocused, this);
        this.parent.on(events.dataReady, this.dataReady, this);
        this.parent.on(events.dataReady, this.clearSelAfterRefresh, this);
        this.parent.on(events.columnPositionChanged, this.clearSelection, this);
        this.parent.on(events.contentReady, this.initialEnd, this);
        this.parent.addEventListener(events.dataBound, this.onDataBound.bind(this));
        this.parent.addEventListener(events.actionBegin, this.actionBegin.bind(this));
        this.parent.addEventListener(events.actionComplete, this.actionComplete.bind(this));
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
        this.parent.off(events.cellFocused, this.onCellFocused);
        this.parent.off(events.dataReady, this.dataReady);
        this.parent.off(events.dataReady, this.clearSelAfterRefresh);
        this.parent.off(events.columnPositionChanged, this.clearSelection);
        this.parent.removeEventListener(events.dataBound, this.onDataBound);
        this.parent.removeEventListener(events.actionBegin, this.actionBegin);
        this.parent.removeEventListener(events.actionComplete, this.actionComplete);
    }

    public dataReady(e: { requestType: string }): void {
        if (e.requestType !== 'virtualscroll' && !this.persistSelection) {
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
        this.checkBoxSelectionChanged();
    }

    private hidePopUp(): void {
        if (this.parent.element.querySelector('.e-gridpopup').querySelectorAll('.e-rowselect').length) {
            (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        }
    }

    private initialEnd(): void {
        this.parent.off(events.contentReady, this.initialEnd);
        this.selectRow(this.parent.selectedRowIndex);
        this.checkBoxSelectionChanged();
    }

    private checkBoxSelectionChanged(): void {
        let isCheckColumn: boolean = false;
        for (let col of this.parent.columns as Column[]) {
            if (col.type === 'checkbox') {
                this.isChkSelection = true;
                this.parent.selectionSettings.type = 'multiple';
                this.chkField = col.field;
                this.totalRecordsCount = this.parent.pageSettings.totalRecordsCount;
                if (isNullOrUndefined(this.totalRecordsCount)) {
                    this.totalRecordsCount = this.parent.getCurrentViewRecords().length;
                }
                this.chkAllBox = this.parent.element.querySelector('.e-checkselectall') as HTMLInputElement;
                this.chkAllObj = ((this.chkAllBox as HTMLElement) as EJ2Intance);
                isCheckColumn = true;
                this.parent.element.classList.add('e-checkboxselection');
                break;
            }
        }
        if (!isCheckColumn) {
            this.isChkSelection = false;
            this.chkField = '';
            this.chkAllBox = this.chkAllObj = null;
            this.parent.element.classList.remove('e-checkboxselection');
        }
        if (this.parent.selectionSettings.persistSelection && this.parent.getPrimaryKeyFieldNames().length > 0) {
            this.persistSelection = true;
            this.parent.element.classList.add('e-persistselection');
            this.primaryKey = this.parent.getPrimaryKeyFieldNames()[0];
            if (!this.parent.enableVirtualization && this.chkField && Object.keys(this.selectedRowState).length === 0) {
                let data: Data = this.parent.getDataModule();
                let query: Query = new Query().where(this.chkField, 'equal', true);
                let dataManager: Promise<Object> = data.getData({} as NotifyArgs, query);
                let proxy: Selection = this;
                this.parent.showSpinner();
                dataManager.then((e: ReturnType) => {
                    proxy.dataSuccess(e.result);
                    proxy.refreshPersistSelection();
                    proxy.parent.hideSpinner();
                });
            }
        } else {
            this.persistSelection = false;
            this.parent.element.classList.remove('e-persistselection');
            this.selectedRowState = {};
        }
    }

    private dataSuccess(res: Object[]): void {
        for (let i: number = 0; i < res.length; i++) {
            if (isNullOrUndefined(this.selectedRowState[res[i][this.primaryKey]]) && res[i][this.chkField]) {
                this.selectedRowState[res[i][this.primaryKey]] = res[i][this.chkField];
            }
        }
        this.persistSelectedData = res;
    }

    private refreshPersistSelection(): void {
        this.chkAllBox = this.parent.element.querySelector('.e-checkselectall') as HTMLInputElement;
        this.chkAllObj = ((this.chkAllBox as HTMLElement) as EJ2Intance);
        let rows: Element[] = this.parent.getRows();
        if (rows.length > 0 && (this.persistSelection || this.chkField)) {
            let indexes: number[] = [];
            for (let j: number = 0; j < rows.length; j++) {
                let rowObj: Row<Column> = this.parent.getRowObjectFromUID(rows[j].getAttribute('data-uid'));
                let pKey: string = rowObj ? rowObj.data[this.primaryKey] : null; if (pKey === null) { return; }
                let checkState: boolean;
                if (this.selectedRowState[pKey] || (this.isChkAll && this.chkAllCollec.indexOf(pKey) < 0)
                    || (this.isUnChkAll && this.chkAllCollec.indexOf(pKey) > 0) || (this.chkField && rowObj.data[this.chkField])) {
                    indexes.push(parseInt(rows[j].getAttribute('aria-rowindex'), 10));
                    checkState = true;
                } else {
                    let chkBox: HTMLElement = (rows[j].querySelector('.e-checkselect') as HTMLElement);
                    checkState = false;
                    if (this.checkedTarget !== chkBox && this.isChkSelection) {
                        (chkBox as EJ2Intance).ej2_instances[0].setProperties({ checked: checkState });
                    }
                }
                this.updatePersistCollection(rows[j], checkState);
            }
            if (this.selectionSettings.type === 'multiple') {
                this.selectRows(indexes);
            } else {
                this.clearSelection();
                if (indexes.length > 0) {
                    this.selectRow(indexes[0], true);
                }
            }
        }
        if (this.isChkSelection) {
            this.setCheckAllState();
        }
    }


    private actionBegin(e: { requestType: string }): void {
        if (e.requestType === 'save' && this.persistSelection) {
            let editChkBox: HTMLInputElement = this.parent.element.querySelector('.e-edit-checkselect') as HTMLInputElement;
            if (!isNullOrUndefined(editChkBox)) {
                let row: HTMLElement = closest(editChkBox, '.e-editedrow') as HTMLElement;
                if (row) {
                    if (this.parent.editSettings.mode === 'dialog') {
                        row = this.parent.element.querySelector('.e-dlgeditrow') as HTMLElement;
                    }
                    let rowObj: Row<Column> = this.parent.getRowObjectFromUID(row.getAttribute('data-uid'));
                    if (!rowObj) { return; }
                    this.selectedRowState[rowObj.data[this.primaryKey]] = rowObj.isSelected = editChkBox.checked;
                } else {
                    this.isCheckedOnAdd = editChkBox.checked;
                }
            }
        }
    }

    private actionComplete(e: { requestType: string, action: string, selectedRow: number }): void {
        if (e.requestType === 'save' && this.persistSelection) {
            if (e.action === 'add' && this.isCheckedOnAdd) {
                let rowObj: Row<Column> = this.parent.getRowObjectFromUID(this.parent.getRows()[e.selectedRow].getAttribute('data-uid'));
                this.selectedRowState[rowObj.data[this.primaryKey]] = rowObj.isSelected = this.isCheckedOnAdd;
            }
            this.refreshPersistSelection();
        }
    }

    private onDataBound(): void {
        if (this.persistSelection || this.chkField) {
            if (this.parent.enableVirtualization) {
                let records: Object[] = this.parent.getCurrentViewRecords();
                this.dataSuccess(records);
            }
            this.refreshPersistSelection();
        }
    }

    private checkSelectAllAction(checkState: boolean): void {
        let editForm: HTMLFormElement = this.parent.element.querySelector('.e-gridform') as HTMLFormElement;
        this.checkedTarget = this.chkAllBox;
        if (checkState) {
            this.selectRowsByRange(0, this.parent.getCurrentViewRecords().length);
            this.isChkAll = true;
            this.isUnChkAll = false;
        } else {
            this.clearSelection();
            this.isUnChkAll = true;
            this.isChkAll = false;
        }
        this.chkAllCollec = [];
        if (this.persistSelection) {
            let rows: Element[] = this.parent.getRows();
            for (let i: number = 0; i < rows.length; i++) {
                this.updatePersistCollection(rows[i], checkState);
            }
            if (this.isUnChkAll) {
                this.selectedRowState = {};
                this.persistSelectedData = [];
            }
        }
        if (!isNullOrUndefined(editForm)) {
            let editChkBox: HTMLElement = editForm.querySelector('.e-edit-checkselect') as HTMLElement;
            (editChkBox as EJ2Intance).ej2_instances[0].setProperties({ checked: checkState });
        }
    }

    private checkSelectAll(checkBox: HTMLInputElement): void {
        let checkObj: EJ2Intance = ((checkBox as HTMLElement) as EJ2Intance);
        this.checkSelectAllAction(checkBox.checked);
        this.target = null;
        this.triggerChkChangeEvent(checkBox, checkBox.checked);
    }

    private checkSelect(checkBox: HTMLInputElement): void {
        let target: HTMLElement = closest(this.checkedTarget, '.e-rowcell') as HTMLElement;
        let checkObj: EJ2Intance = ((checkBox as HTMLElement) as EJ2Intance);
        this.isMultiCtrlRequest = true;
        let rIndex: number = parseInt(target.parentElement.getAttribute('aria-rowindex'), 10);
        if (this.persistSelection && this.parent.element.querySelectorAll('.e-addedrow').length > 0) {
            ++rIndex;
        }
        this.rowCellSelectionHandler(rIndex, parseInt(target.getAttribute('aria-colindex'), 10));
        this.moveIntoUncheckCollection(closest(target, '.e-row') as HTMLElement);
        this.setCheckAllState();
        this.isMultiCtrlRequest = false;
        this.triggerChkChangeEvent(checkBox, checkBox.checked);
    }

    private moveIntoUncheckCollection(row: HTMLElement): void {
        if (this.isChkAll || this.isUnChkAll) {
            let rowObj: Row<Column> = this.parent.getRowObjectFromUID(row.getAttribute('data-uid'));
            let pKey: string = rowObj ? rowObj.data[this.primaryKey] : null;
            if (!pKey) { return; }
            if (this.chkAllCollec.indexOf(pKey) < 0) {
                this.chkAllCollec.push(pKey);
            } else {
                this.chkAllCollec.splice(this.chkAllCollec.indexOf(pKey), 1);
            }
        }
    }

    private triggerChkChangeEvent(checkBox: HTMLInputElement, checkState: boolean): void {
        this.parent.trigger(events.checkBoxChange, {
            checked: checkState, selectedRowIndexes: this.parent.getSelectedRowIndexes(),
            target: checkBox
        });
        if (!this.parent.isEdit) {
            this.checkedTarget = null;
        }
    }

    private setCheckAllState(): void {
        if (this.isChkSelection) {
            let checkedLen: number = Object.keys(this.selectedRowState).length;
            if (!this.persistSelection) {
                checkedLen = this.selectedRecords.length;
                this.totalRecordsCount = this.parent.getCurrentViewRecords().length;
            }
            if (checkedLen === this.totalRecordsCount || (this.persistSelection && this.parent.allowPaging
                && this.isChkAll && this.chkAllCollec.length === 0)) {
                this.chkAllObj.ej2_instances[0].setProperties({ checked: true });
            } else if (checkedLen === 0 || this.parent.getCurrentViewRecords().length === 0) {
                this.chkAllObj.ej2_instances[0].setProperties({ indeterminate: false, checked: false });
            } else {
                this.chkAllObj.ej2_instances[0].setProperties({ indeterminate: true });
            }
        }
    }

    private clickHandler(e: MouseEvent): void {
        let target: HTMLElement = e.target as HTMLElement;
        this.isMultiCtrlRequest = e.ctrlKey || this.enableSelectMultiTouch;
        this.isMultiShiftRequest = e.shiftKey;
        this.popUpClickHandler(e);
        let chkSelect: boolean = false;
        this.preventFocus = true;
        let checkBox: HTMLInputElement;
        this.selectionRequest = true;
        if (target.classList.contains('e-checkselect') || target.classList.contains('e-checkselectall')) {
            checkBox = target as HTMLInputElement;
            chkSelect = true;
        }
        if (target && (target.classList.contains('e-rowcell') && !this.parent.selectionSettings.checkboxOnly) || chkSelect) {
            if (this.isChkSelection) {
                this.isMultiCtrlRequest = true;
            }
            this.target = target;
            if (!isNullOrUndefined(checkBox)) {
                this.checkedTarget = checkBox;
                if (checkBox.classList.contains('e-checkselectall')) {
                    this.checkSelectAll(checkBox);
                } else {
                    this.checkSelect(checkBox);
                    this.target = closest(target, '.e-rowcell');
                }
            } else {
                let rIndex: number = parseInt(target.parentElement.getAttribute('aria-rowindex'), 10);
                if (this.persistSelection && this.parent.element.querySelectorAll('.e-addedrow').length > 0) {
                    ++rIndex;
                }
                this.rowCellSelectionHandler(rIndex, parseInt(target.getAttribute('aria-colindex'), 10));
                if (this.isChkSelection) {
                    this.moveIntoUncheckCollection(closest(target, '.e-row') as HTMLElement);
                    this.setCheckAllState();
                }
            }
            if (!this.isChkSelection && Browser.isDevice && this.parent.selectionSettings.type === 'multiple') {
                this.showPopup(e);
            }
        }
        this.isMultiCtrlRequest = false;
        this.isMultiShiftRequest = false;
        this.selectionRequest = false;
        this.preventFocus = false;
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
                this.selectRow(rowIndex, true);
            }
            this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, true);
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

    private onCellFocused(e: CellFocusArgs): void {
        let clear: boolean = ((e.container.isHeader && e.isJump) || (e.container.isContent && !e.container.isSelectable)) &&
            !(e.byKey && e.keyArgs.action === 'space');
        let headerAction: boolean = e.container.isHeader && !(e.byKey && e.keyArgs.action === 'space');
        if (!e.byKey || clear) {
            if (clear) { this.clearSelection(); }
            return;
        }
        let [rowIndex, cellIndex]: number[] = e.container.isContent ? e.container.indexes : e.indexes;
        let prev: IIndex = this.focus.getPrevIndexes();
        if (headerAction || (['ctrlPlusA', 'escape'].indexOf(e.keyArgs.action) === -1 && e.keyArgs.action !== 'space' &&
            rowIndex === prev.rowIndex && cellIndex === prev.cellIndex)) { return; }
        this.preventFocus = true;
        switch (e.keyArgs.action) {
            case 'downArrow':
            case 'upArrow':
            case 'enter':
            case 'shiftEnter':
                this.applyDownUpKey(rowIndex, cellIndex);
                break;
            case 'rightArrow':
            case 'leftArrow':
                this.applyRightLeftKey(rowIndex, cellIndex);
                break;
            case 'shiftDown':
            case 'shiftUp':
                this.shiftDownKey(rowIndex, cellIndex);
                break;
            case 'shiftLeft':
            case 'shiftRight':
                this.applyShiftLeftRightKey(rowIndex, cellIndex);
                break;
            case 'home':
            case 'end':
                this.applyHomeEndKey(rowIndex, cellIndex);
                break;
            case 'ctrlHome':
            case 'ctrlEnd':
                this.applyCtrlHomeEndKey(rowIndex, cellIndex);
                break;
            case 'escape':
                this.clearSelection();
                break;
            case 'ctrlPlusA':
                this.ctrlPlusA();
                break;
            case 'space':
                this.selectionRequest = true;
                let target: HTMLElement = (e.element as HTMLElement);
                if (target.classList.contains('e-checkselectall')) {
                    this.checkedTarget = target as HTMLInputElement;
                    this.checkSelectAll(this.checkedTarget);
                } else {
                    if (target.classList.contains('e-checkselect')) {
                        this.checkedTarget = target as HTMLInputElement;
                        this.checkSelect(this.checkedTarget);
                    }
                }
                this.selectionRequest = false;
                break;
        }
        this.preventFocus = false;
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

    private applyDownUpKey(rowIndex?: number, cellIndex?: number): void {
        let gObj: IGrid = this.parent;
        if (this.isRowType()) {
            this.selectRow(rowIndex, true);
            this.applyUpDown(gObj.selectedRowIndex);
        }
        if (this.isCellType()) {
            this.selectCell({ rowIndex, cellIndex }, true);
        }
    }

    private applyUpDown(rowIndex: number): void {
        if (rowIndex < 0) { return; }
        if (!this.target) {
            this.target = this.parent.getRows()[0].children[this.parent.groupSettings.columns.length || 0];
        }
        let cIndex: number = parseInt(this.target.getAttribute('aria-colindex'), 10);
        this.target = this.contentRenderer.getRowByIndex(rowIndex).querySelectorAll('.e-rowcell')[cIndex];
        this.addAttribute(this.target);
    }

    private applyRightLeftKey(rowIndex?: number, cellIndex?: number): void {
        let gObj: IGrid = this.parent;
        if (this.isCellType()) {
            this.selectCell({ rowIndex, cellIndex }, true);
            this.addAttribute(this.target);
        }
    }

    private applyHomeEndKey(rowIndex?: number, cellIndex?: number): void {
        if (this.isCellType()) {
            this.selectCell({ rowIndex, cellIndex }, true);
        } else {
            this.addAttribute(this.parent.getCellFromIndex(rowIndex, cellIndex));
        }
    }

    /**
     * Apply shift+down key selection
     * @return {void}
     * @hidden
     */
    public shiftDownKey(rowIndex?: number, cellIndex?: number): void {
        let gObj: IGrid = this.parent;
        this.isMultiShiftRequest = true;
        if (this.isRowType() && !this.isSingleSel()) {
            if (!isUndefined(this.prevRowIndex)) {
                this.selectRowsByRange(this.prevRowIndex, rowIndex);
                this.applyUpDown(rowIndex);
            } else {
                this.selectRow(0, true);
            }
        }
        if (this.isCellType() && !this.isSingleSel()) {
            this.selectCellsByRange(this.prevCIdxs || { rowIndex: 0, cellIndex: 0 }, { rowIndex, cellIndex });
        }
        this.isMultiShiftRequest = false;
    }

    private applyShiftLeftRightKey(rowIndex?: number, cellIndex?: number): void {
        let gObj: IGrid = this.parent;
        this.isMultiShiftRequest = true;
        this.selectCellsByRange(this.prevCIdxs, { rowIndex, cellIndex });
        this.isMultiShiftRequest = false;
    }

    private applyCtrlHomeEndKey(rowIndex: number, cellIndex: number): void {
        if (this.isRowType()) {
            this.selectRow(rowIndex, true);
            this.addAttribute(this.parent.getCellFromIndex(rowIndex, cellIndex));
        }
        if (this.isCellType()) {
            this.selectCell({ rowIndex, cellIndex }, true);
        }
    }


    private addRemoveClassesForRow(row: Element, isAdd: boolean, clearAll: boolean, ...args: string[]): void {
        if (row) {
            let cells: Element[] = [].slice.call(row.querySelectorAll('.e-rowcell'));
            let cell: Element = row.querySelector('.e-detailrowcollapse') || row.querySelector('.e-detailrowexpand');
            if (cell) {
                cells.push(cell);
            }
            addRemoveActiveClasses(cells, isAdd, ...args);
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

    private getRenderer(): IRenderer {
        if (isNullOrUndefined(this.contentRenderer)) {
            this.contentRenderer = this.factory.getRenderer(RenderType.Content);
        }
        return this.contentRenderer;
    }

    /**
     * Gets the collection of selected records. 
     * @return {Object[]}
     */
    public getSelectedRecords(): Object[] {
        let selectedData: Object[] = [];
        if (!this.selectionSettings.persistSelection) {
            selectedData = (<Row<Column>[]>this.parent.getRowsObject()).filter((row: Row<Column>) => row.isSelected)
                .map((m: Row<Column>) => m.data);
        } else {
            selectedData = this.persistSelectedData;
        }
        return selectedData;
    }

}
