import { createElement, remove, classList, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { Column } from '../models/column';
import { EventHandler, L10n } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../services/service-locator';
import { IGrid, IAction } from '../base/interface';
import * as events from '../base/constant';
import { ShowHide } from './show-hide';
import { Dialog, calculateRelativeBasedPosition } from '@syncfusion/ej2-popups';

/**
 * 
 * `ColumnChooser` module is used to show or hide the columns dynamically.
 */
export class ColumnChooser implements IAction {
    // internal variables
    private dataManager: DataManager;
    private column: Column;
    private parent: IGrid;
    private serviceLocator: ServiceLocator;
    private l10n: L10n;
    private dlgObj: Dialog;
    private searchValue: string;
    private flag: boolean;
    private timer: number;
    public getShowHideService: ShowHide;
    private showColumn: string[] = [];
    private hideColumn: string[] = [];
    private mainDiv: HTMLElement;
    private innerDiv: HTMLElement;
    private ulElement: HTMLElement;
    private isDlgOpen: boolean = false;
    private dlghide: boolean = false;
    private initialOpenDlg: boolean = true;
    private stateChangeColumns: Column[] = [];
    private dlgDiv: HTMLElement;
    private isInitialOpen: boolean = false;

    /**
     * Constructor for the Grid ColumnChooser module
     * @hidden
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }

    private destroy(): void {
        this.removeEventListener();
        this.unWireEvents();
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.initialEnd, this.render, this);
        this.parent.addEventListener(events.dataBound, this.hideDialog.bind(this));
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.initialEnd, this.render);
    }

    private render(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        this.renderDlgContent();
        this.getShowHideService = this.serviceLocator.getService<ShowHide>('showHideService');
    }

    private clickHandler(e: MouseEvent): void {
        let targetElement: Element = e.target as Element;
        if (targetElement.classList.contains('e-cctbn-icon') || targetElement.classList.contains('e-cc-toolbar')) {
            if ((this.initialOpenDlg && this.dlgObj.visible) || !this.isDlgOpen) {
                this.isDlgOpen = true;
                //this.initialOpenDlg = false;
                return;
            } else {
                if (this.isDlgOpen) {
                    this.initialOpenDlg = false;
                    this.hideDialog();
                }
            }

        } else if (targetElement.classList.contains('e-cc-cancel')) {
            (<HTMLInputElement>targetElement.parentElement.querySelector('.e-ccsearch')).value = '';
            this.columnChooserSearch('');
            this.removeCancelIcon();
        }
    }

    private hideDialog(): void {
        if (!isNullOrUndefined(this.dlgObj) && this.dlgObj.visible) {
            this.dlgObj.hide();
            this.isDlgOpen = false;
        }
    }

    /** 
     * To render columnChooser when showColumnChooser enabled. 
     * @return {void}  
     * @hidden
     */
    public renderColumnChooser(x?: number, y?: number, target?: Element): void {
        if (!this.dlgObj.visible) {
            let pos: { X: number, Y: number } = { X: null, Y: null };
            let args1: { requestType: string, element?: Element, columns?: Column[] } = {
                requestType: 'beforeOpenColumnChooser', element: this.parent.element,
                columns: this.parent.getColumns() as Column[]
            };
            this.parent.trigger(events.beforeOpenColumnChooser, args1);
            this.refreshCheckboxState();
            //  this.dlgObj.content = this.renderChooserList();
            this.dlgObj.dataBind();
            this.dlgObj.element.style.top = y + 'px';
            this.dlgObj.element.style.maxHeight = '350px';
            let dis: string = this.dlgObj.element.style.display;
            this.dlgObj.element.style.display = 'block';
            let newpos: { top: number, left: number } = calculateRelativeBasedPosition
                ((<HTMLElement>target.parentElement), this.dlgObj.element);
            this.dlgObj.element.style.display = dis;
            this.dlgObj.element.style.top = newpos.top + target.getBoundingClientRect().height + 'px';
            let dlgWidth: number = 250;
            if (this.parent.element.classList.contains('e-device')) {
                this.dlgObj.position = { X: 'center', Y: 'center' };
                this.dlgObj.refreshPosition();
            } else {
                if (this.parent.enableRtl) {
                    this.dlgObj.element.style.left = (<HTMLElement>target).offsetLeft + 'px';
                } else {
                    this.dlgObj.element.style.left = (newpos.left - dlgWidth) + 42 + 'px';
                }
            }
            this.removeCancelIcon();
            this.dlgObj.show();
            this.wireEvents();

        } else {
            this.unWireEvents();
            this.hideDialog();
            this.addcancelIcon();
        }
    }

    /** 
     * Open ColumnChooser menu dynamically. 
     * @param  {X: number, Y: number}  .  
     * @return {void} 
     */
    public openColumnChooser(X?: number, Y?: number): void {
        if (this.dlgObj.visible) {
            this.hideDialog();
            return;
        }
        if (!this.isInitialOpen) {
            this.dlgObj.content = this.renderChooserList();
        } else {
            this.refreshCheckboxState();
        }

        this.dlgObj.dataBind();
        this.dlgObj.position = { X: 'center', Y: 'center' };
        if (isNullOrUndefined(X)) {
            this.dlgObj.position = { X: 'center', Y: 'center' };
            this.dlgObj.refreshPosition();
        } else {
            this.dlgObj.element.style.top = '';
            this.dlgObj.element.style.left = '';
            this.dlgObj.element.style.top = Y + 'px';
            this.dlgObj.element.style.left = X + 'px';
        }
        this.dlgObj.show();
        this.isInitialOpen = true;
        this.wireEvents();
    }

    private renderDlgContent(): void {
        let y: number;
        this.dlgDiv = createElement('div', { className: 'e-ccdlg e-cc', id: this.parent.element.id + '_ccdlg' });
        document.body.appendChild(this.dlgDiv);
        let xpos: number = this.parent.element.getBoundingClientRect().width - 250;
        let dialoPos: string = this.parent.enableRtl ? 'left' : 'right';
        let tarElement: Element = this.parent.element.querySelector('.e-ccdiv');
        if (!isNullOrUndefined(tarElement)) {
            y = tarElement.getBoundingClientRect().top;
        }
        let pos: { X: number, Y: number } = { X: null, Y: null };
        this.dlgObj = new Dialog({
            header: this.l10n.getConstant('ChooseColumns'),
            showCloseIcon: false,
            closeOnEscape: false,
            locale: this.parent.locale,
            visible: false,
            enableRtl: this.parent.enableRtl,
            target: document.getElementById(this.parent.element.id),
            buttons: [{
                click: this.confirmDlgBtnClick.bind(this),
                buttonModel: {
                    content: this.l10n.getConstant('OKButton'),
                    cssClass: 'e-flat e-cc e-cc_okbtn', isPrimary: true
                }
            },
            {
                click: this.clearActions.bind(this),
                buttonModel: { cssClass: 'e-flat e-cc e-cc-cnbtn', content: this.l10n.getConstant('CancelButton') }
            }],
            content: this.renderChooserList(),
            width: 250,
            height: '350px',
            animationSettings: { effect: 'None' },
        });
        this.dlgObj.appendTo(this.dlgDiv);
    }

    private renderChooserList(): HTMLElement {
        this.mainDiv = createElement('div', { className: 'e-main-div e-cc' });
        let searchDiv: HTMLElement = createElement('div', { className: 'e-cc-searchdiv e-cc e-input-group' });
        let ccsearchele: HTMLElement = createElement('input', {
            className: 'e-ccsearch e-cc e-input',
            attrs: { placeholder: this.l10n.getConstant('Search') }
        });
        let ccsearchicon: HTMLElement = createElement('span', { className: 'e-ccsearch-icon e-icons e-cc e-input-group-icon' });
        let conDiv: HTMLElement = createElement('div', { className: 'e-cc-contentdiv' });
        this.innerDiv = createElement('div', { className: 'e-innerdiv e-cc' });
        searchDiv.appendChild(ccsearchele);
        searchDiv.appendChild(ccsearchicon);
        ccsearchele.addEventListener('focus', () => {
            ccsearchele.parentElement.classList.add('e-input-focus');
        });
        ccsearchele.addEventListener('blur', () => {
            ccsearchele.parentElement.classList.remove('e-input-focus');
        });
        let innerDivContent: HTMLElement | string[] | string = this.refreshCheckboxList(this.parent.getColumns() as Column[]);
        this.innerDiv.appendChild((innerDivContent as Element));
        conDiv.appendChild(this.innerDiv);
        this.mainDiv.appendChild(searchDiv);
        this.mainDiv.appendChild(conDiv);
        return this.mainDiv;
    }

    private confirmDlgBtnClick(args: Object): void {
        this.stateChangeColumns = [];
        if (!isNullOrUndefined(args)) {
            if (this.hideColumn.length) {
                this.columnStateChange(this.hideColumn, false);
            }
            if (this.showColumn.length) {
                this.columnStateChange(this.showColumn, true);
            }
            let params: { requestType: string, element?: Element, position?: Object, columns?: Column[], dialogInstance: Dialog } = {
                requestType: 'columnstate', element: this.parent.element,
                columns: this.stateChangeColumns as Column[], dialogInstance: this.dlgObj
            };
            this.parent.trigger(events.actionComplete, params);
            this.getShowHideService.setVisible(this.stateChangeColumns);
            this.clearActions();
        }
    }

    private columnStateChange(stateColumns: string[], state: boolean): void {
        for (let index: number = 0; index < stateColumns.length; index++) {
            let colUid: string = stateColumns[index].replace('e-cc', '');
            let currentCol: Column = this.parent.getColumnByUid(colUid);
            currentCol.visible = state;
            this.stateChangeColumns.push(currentCol);
        }
    }

    private clearActions(): void {
        this.hideColumn = [];
        this.showColumn = [];
        this.unWireEvents();
        this.hideDialog();
        this.addcancelIcon();
    }

    private checkstatecolumn(e: MouseEvent): void {
        let targetEle: HTMLInputElement = e.target as HTMLInputElement;
        let uncheckColumn: string = targetEle.id;
        if (targetEle.checked) {
            if (this.hideColumn.indexOf(uncheckColumn) !== -1) {
                this.hideColumn.splice(this.hideColumn.indexOf(uncheckColumn), 1);
            }
            if (this.showColumn.indexOf(uncheckColumn) === -1) {
                this.showColumn.push(uncheckColumn);
            }
        } else {
            if (this.showColumn.indexOf(uncheckColumn) !== -1) {
                this.showColumn.splice(this.showColumn.indexOf(uncheckColumn), 1);
            }
            if (this.hideColumn.indexOf(uncheckColumn) === -1) {
                this.hideColumn.push(uncheckColumn);
            }
        }
    }

    private columnChooserSearch(searchVal: string): void {
        let clearSearch: boolean = false;
        let fltrCol: Column[];
        if (searchVal === '') {
            this.removeCancelIcon();
            fltrCol = this.parent.getColumns() as Column[];
            clearSearch = true;

        } else {
            fltrCol = new DataManager(this.parent.getColumns()).executeLocal(new Query()
                .where('headerText', 'startswith', searchVal, true)) as Column[];
        }

        if (fltrCol.length) {
            this.innerDiv.innerHTML = ' ';
            this.innerDiv.classList.remove('e-ccnmdiv');
            this.innerDiv.appendChild(<HTMLElement>this.refreshCheckboxList(fltrCol, searchVal));
            if (!clearSearch) {
                this.addcancelIcon();
            }

        } else {
            let nMatchele: HTMLElement = createElement('span', { className: 'e-cc e-nmatch' });
            nMatchele.innerHTML = this.l10n.getConstant('Matchs');
            this.innerDiv.innerHTML = ' ';
            this.innerDiv.appendChild(nMatchele);
            this.innerDiv.classList.add('e-ccnmdiv');
        }
        this.flag = true;
        this.stopTimer();
    }

    private wireEvents(): void {
        let searchElement: Element = (this.dlgObj.content as Element).querySelector('input.e-ccsearch');
        EventHandler.add(searchElement, 'keyup', this.columnChooserManualSearch, this);
    }

    private unWireEvents(): void {
        let searchElement: Element = (this.dlgObj.content as Element).querySelector('input.e-ccsearch');
        EventHandler.remove(searchElement, 'keyup', this.columnChooserManualSearch);
    }

    private refreshCheckboxList(gdCol: Column[], searchVal?: string): HTMLElement {
        this.ulElement = createElement('ul', { className: 'e-ccul-ele e-cc' });
        for (let i: number = 0; i < gdCol.length; i++) {
            let columns: Column = (gdCol[i] as Column);
            this.renderCheckbox(columns);
        }
        return this.ulElement;
    }

    private refreshCheckboxState(): void {
        for (let i: number = 0; i < this.parent.element.querySelectorAll('.e-cc-chbox').length; i++) {
            let element: HTMLInputElement = this.parent.element.querySelectorAll('.e-cc-chbox')[i] as HTMLInputElement;
            let column: Column = this.parent.getColumnByUid(element.id.replace('e-cc', ''));
            if (column.visible) {
                element.checked = true;
            } else {
                element.checked = false;
            }
        }

    }

    private renderCheckbox(column: Column): void {
        let cclist: HTMLElement;
        let hideColState: boolean;
        let showColState: boolean;
        if (column.showInColumnChooser) {
            cclist = createElement('li', { className: 'e-cclist e-cc', styles: 'list-style:None', id: 'e-ccli_' + column.uid });
            let cclabe: HTMLElement = createElement('label', { className: 'e-cc' });
            let cccheckboxlist: HTMLInputElement = document.createElement('input');
            cccheckboxlist.type = 'CheckBox';
            cccheckboxlist.className = 'e-cc e-cc-chbox ';
            cccheckboxlist.id = 'e-cc' + column.uid;
            cccheckboxlist.onchange = this.checkstatecolumn.bind(this);
            let labElement: HTMLElement = createElement('label', { className: 'e-cc e-cc-lab-name', attrs: { for: 'e-cc' + column.uid } });
            labElement.textContent = column.headerText;
            cclabe.appendChild(cccheckboxlist);
            cclabe.appendChild(labElement);
            hideColState = this.hideColumn.indexOf('e-cc' + column.uid) === -1 ? false : true;
            showColState = this.showColumn.indexOf('e-cc' + column.uid) === -1 ? false : true;

            if ((column.visible && !hideColState) || showColState) {
                cccheckboxlist.checked = true;
            } else {
                cccheckboxlist.checked = false;
            }
            cclist.appendChild(cclabe);
            this.ulElement.appendChild(cclist);
        }
    }

    private columnChooserManualSearch(e: MouseEvent & TouchEvent & KeyboardEvent): void {
        this.addcancelIcon();
        this.searchValue = (<HTMLInputElement>e.target).value;
        let proxy: ColumnChooser = this;
        this.stopTimer();
        this.startTimer(e);
    }

    private startTimer(e: MouseEvent & TouchEvent & KeyboardEvent): void {
        let proxy: ColumnChooser = this;
        let interval: number = !proxy.flag && e.keyCode !== 13 ? 500 : 0;
        this.timer = window.setInterval(
            () => { proxy.columnChooserSearch(proxy.searchValue); }, interval);
    }

    private stopTimer(): void {
        window.clearInterval(this.timer);
    }

    private addcancelIcon(): void {
        this.dlgDiv.querySelector('.e-cc.e-ccsearch-icon').classList.add('e-cc-cancel');
    }

    private removeCancelIcon(): void {
        this.dlgDiv.querySelector('.e-cc.e-ccsearch-icon').classList.remove('e-cc-cancel');
    }

    // internally use
    private getModuleName(): string {
        return 'ColumnChooser';
    }
}