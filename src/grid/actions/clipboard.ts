import { Browser, createElement, KeyboardEventArgs, remove } from '@syncfusion/ej2-base';
import { IGrid, IAction, BeforeCopyEventArgs } from '../base/interface';
import { Column } from '../models/column';
import * as events from '../base/constant';


/**
 * `Clipboard` module is used to handle clipboard copy action.
 */
export class Clipboard implements IAction {
    //Internal variables 
    private clipBoardTextArea: HTMLInputElement;
    private copyContent: string = '';
    private isSelect: boolean = false;
    //Module declarations
    private parent: IGrid;

    /**
     * Constructor for the Grid clipboard module
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.contentReady, this.initialEnd, this);
        this.parent.on(events.keyPressed, this.keyDownHandler, this);
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.keyPressed, this.keyDownHandler);
    }

    private initialEnd(): void {
        this.parent.off(events.contentReady, this.initialEnd);
        this.clipBoardTextArea = createElement('textarea', {
            className: 'e-clipboard',
            styles: 'opacity: 0',
            attrs: { readonly: 'true' }
        }) as HTMLInputElement;
        this.parent.element.appendChild(this.clipBoardTextArea);
    }

    private keyDownHandler(e: KeyboardEventArgs): void {
        if (e.action === 'ctrlPlusC') {
            this.copy();
        } else if (e.action === 'ctrlShiftPlusH') {
            this.copy(true);
        }
    }

    private setCopyData(withHeader?: boolean): void {
        if (window.getSelection().toString() === '') {
            this.clipBoardTextArea.value = this.copyContent = '';
            if (this.parent.selectionSettings.mode !== 'cell') {
                let rows: Element[] = this.parent.getRows();
                let selectedIndexes: Object[] = this.parent.getSelectedRowIndexes().sort((a: number, b: number) => { return a - b; });
                if (withHeader) {
                    this.getCopyData([].slice.call(this.parent.element.querySelectorAll('.e-headercell')), false, '\t', withHeader);
                    this.copyContent += '\n';
                }
                for (let i: number = 0; i < selectedIndexes.length; i++) {
                    if (i > 0) {
                        this.copyContent += '\n';
                    }
                    this.getCopyData(
                        [].slice.call(rows[selectedIndexes[i] as number].querySelectorAll('.e-rowcell')), false, '\t', withHeader);
                }
            } else {
                this.getCopyData([].slice.call(this.parent.element.querySelectorAll('.e-cellselectionbackground')), true, '\n', withHeader);
            }
            let args: BeforeCopyEventArgs = {
                data: this.copyContent,
                cancel: false,
            };
            this.parent.trigger(events.beforeCopy, args);
            if (args.cancel) {
                return;
            }
            this.clipBoardTextArea.value = this.copyContent = args.data;
            if (!Browser.userAgent.match(/ipad|ipod|iphone/i)) {
                this.clipBoardTextArea.select();
            } else {
                this.clipBoardTextArea.setSelectionRange(0, this.clipBoardTextArea.value.length);
            }
            this.isSelect = true;
        }
    }

    private getCopyData(cells: HTMLElement[], isCell: boolean, splitKey: string, withHeader?: boolean): void {
        for (let j: number = 0; j < cells.length; j++) {
            if (withHeader && isCell) {
                this.copyContent += (this.parent.getVisibleColumns() as Column[])
                [parseInt(cells[j].getAttribute('aria-colindex'), 10)].headerText + '\n';
            }
            this.copyContent += cells[j].textContent;
            if (j < cells.length - 1) {
                this.copyContent += splitKey;
            }
        }
    }

    /**
     * Copy selected rows or cells data into clipboard.
     * @param {boolean} withHeader - Specifies whether the column header data need to be copied or not.
     */
    public copy(withHeader?: boolean): void {
        if (document.queryCommandSupported('copy')) {
            this.setCopyData(withHeader);
            document.execCommand('copy');
            this.clipBoardTextArea.blur();
        }
        if (this.isSelect) {
            window.getSelection().removeAllRanges();
            this.isSelect = false;
        }
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'clipboard';
    }

    /**
     * To destroy the clipboard 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        remove(this.clipBoardTextArea);
    }
}
