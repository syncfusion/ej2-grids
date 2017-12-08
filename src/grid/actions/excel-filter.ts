import { extend, createElement, EventHandler, remove, Browser } from '@syncfusion/ej2-base';
import { FilterSettings } from '../base/grid';
import { parentsUntil } from '../base/util';
import { IGrid, IFilterArgs, EJ2Intance } from '../base/interface';
import { ContextMenu, MenuItemModel, ContextMenuModel, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { ServiceLocator } from '../services/service-locator';
import { CheckBoxFilter } from '../actions/checkbox-filter';
import { isNullOrUndefined, L10n, } from '@syncfusion/ej2-base';
import { PredicateModel } from '../base/grid-model';
import { Internationalization } from '@syncfusion/ej2-base';
import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';
import { Dialog } from '@syncfusion/ej2-popups';
import { DropDownList, AutoComplete } from '@syncfusion/ej2-dropdowns';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { RadioButton, CheckBox } from '@syncfusion/ej2-buttons';
import { distinctStringValues } from '../base/util';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { OffsetPosition } from '@syncfusion/ej2-popups';
/**
 * @hidden
 * `ExcelFilter` module is used to handle filtering action.
 */
export class ExcelFilter extends CheckBoxFilter {
    //Internal variables            
    private datePicker: DatePicker;
    private actObj: AutoComplete;
    private numericTxtObj: NumericTextBox;
    private dlgDiv: HTMLElement;
    private l10n: L10n;
    private dlgObj: Dialog;
    private menuEle: HTMLUListElement;
    private customFilterOperators: Object;
    private dropOptr: DropDownList;
    private optrData: Object;
    private menuItem: MenuItemModel;
    private menu: Element;
    private cmenu: HTMLUListElement;
    protected menuObj: ContextMenu;
    private isCMenuOpen: boolean;
    private localeConstants: Object = {
        ClearFilter: 'Clear Filter',
        NumberFilter: 'Number Filters',
        TextFilter: 'Text Filters',
        DateFilter: 'Date Filters',
        MatchCase: 'Match Case',
        Equal: 'Equal',
        NotEqual: 'Not Equal',
        LessThan: 'Less Than',
        LessThanOrEqual: 'Less Than Or Equal',
        GreaterThan: 'Greater Than',
        GreaterThanOrEqual: 'Greater Than Or Equal',
        Between: 'Between',
        CustomFilter: 'Custom Filter',
        StartsWith: 'Starts With',
        EndsWith: 'Ends With',
        Contains: 'Contains',
        OK: 'OK',
        Cancel: 'Cancel',
        CustomFilterPlaceHolder: 'Enter the value',
        CustomFilterDatePlaceHolder: 'Choose a date',
        AND: 'AND',
        OR: 'OR',
        ShowRowsWhere: 'Show rows where:'
    };

    /**
     * Constructor for excel filtering module
     * @hidden
     */
    constructor(parent?: IGrid, filterSettings?: FilterSettings, serviceLocator?: ServiceLocator, customFltrOperators?: Object) {
        super(parent, filterSettings, serviceLocator);
        this.customFilterOperators = customFltrOperators;
        extend(this.defaultConstants, this.localeConstants);
        this.isExcel = true;
        this.initLocale(this.defaultConstants);
    }

    private getCMenuDS(type: string, operator?: string): MenuItemModel[] {
        let options: { number?: string[], date?: string[], string?: string[], datetime?: string[] } = {
            number: ['Equal', 'NotEqual', '', 'LessThan', 'LessThanOrEqual', 'GreaterThan',
                'GreaterThanOrEqual', 'Between', '', 'CustomFilter'],
            string: ['Equal', 'NotEqual', '', 'StartsWith', 'EndsWith', '', 'Contains', '', 'CustomFilter'],
        };
        options.date = options.number;
        options.datetime = options.number;
        let model: MenuItemModel[] = [];
        for (let i: number = 0; i < options[type].length; i++) {
            if (options[type][i].length) {
                if (operator) {
                    model.push({
                        text: this.getLocalizedLabel(options[type][i]) + '...',
                        iconCss: 'e-icons e-icon-check ' + (operator === options[type][i] ? '' : 'e-emptyicon')
                    });
                } else {
                    model.push({
                        text: this.getLocalizedLabel(options[type][i]) + '...'
                    });
                }
            } else {
                model.push({ separator: true });
            }
        }
        return model;
    }

    /** 
     * To destroy the filter bar. 
     * @return {void} 
     * @hidden
     */
    public destroy(): void {
        if (this.dlg) {
            super.destroy();
            this.unwireExEvents();
        }
        remove(this.cmenu);
    }

    private createMenu(type: string, isFiltered: boolean, isCheckIcon: boolean): void {
        let options: Object = { string: 'TextFilter', date: 'DateFilter', datetime: 'DateFilter', number: 'NumberFilter' };
        this.menu = createElement('div', { className: 'e-contextmenu-wrapper' });
        let ul: Element = createElement('ul');
        let icon: string = isFiltered ? 'e-icon-filter e-filtered' : 'e-icon-filter';
        ul.appendChild(this.createMenuElem(this.getLocalizedLabel('ClearFilter'), isFiltered ? '' : 'e-disabled', icon));
        if (type !== 'boolean') {
            ul.appendChild(this.createMenuElem(
                this.getLocalizedLabel(options[type]), 'e-submenu',
                isCheckIcon ? 'e-icon-check' : icon + ' e-emptyicon', true));
        }
        this.menu.appendChild(ul);
    }

    private createMenuElem(val: string, className?: string, iconName?: string, isSubMenu?: boolean): Element {
        let li: Element = createElement('li', { className: className + ' e-menu-item' });
        li.innerHTML = val;
        li.insertBefore(createElement('span', { className: 'e-menu-icon e-icons ' + iconName }), li.firstChild);
        if (isSubMenu) {
            li.appendChild(createElement('span', { className: 'e-icons e-caret' }));
        }
        return li;
    }

    private wireExEvents(): void {
        EventHandler.add(this.dlg, 'mouseover', this.hoverHandler, this);
        EventHandler.add(this.dlg, 'click', this.clickExHandler, this);
    }

    private unwireExEvents(): void {
        EventHandler.remove(this.dlg, 'mouseover', this.hoverHandler);
        EventHandler.remove(this.dlg, 'click', this.clickExHandler);
    }

    private clickExHandler(e: MouseEvent): void {
        let menuItem: HTMLElement = parentsUntil(e.target as Element, 'e-menu-item') as HTMLElement;
        if (menuItem && this.getLocalizedLabel('ClearFilter') === menuItem.innerText) {
            this.clearFilter();
            this.closeDialog();
        }
    }


    private destroyCMenu(): void {
        if (this.menuObj && !this.menuObj.isDestroyed) {
            this.menuObj.destroy();
        }
    }
    private hoverHandler(e: MouseEvent): void {
        let target: Element = (e.target as Element).querySelector('.e-contextmenu');
        let li: Element = parentsUntil(e.target as Element, 'e-menu-item');
        let focused: Element = this.menu.querySelector('.e-focused');
        let isSubMenu: boolean;
        if (focused) {
            focused.classList.remove('e-focused');
        }
        if (li) {
            li.classList.add('e-focused');
            isSubMenu = li.classList.contains('e-submenu');
        }
        if (target) {
            return;
        }
        if (!isSubMenu) {
            let submenu: Element = this.menu.querySelector('.e-submenu');
            submenu.classList.remove('e-selected');
            this.isCMenuOpen = false;
            this.destroyCMenu();
        }
        let selectedMenu: string;
        let predicates: PredicateModel[] = this.getExistingPredicate(this.options.field);
        if (predicates.length === 2) {
            if (predicates[0].operator === 'greaterThanOrEqual' && predicates[1].operator === 'lessThanOrEqual') {
                selectedMenu = 'Between';
            } else {
                selectedMenu = 'CustomFilter';
            }
        } else {
            if (predicates.length === 1) {
                this.optrData = this.customFilterOperators[this.options.type + 'Operator'];
                selectedMenu = this.getSelectedText(predicates[0].operator);
            }
        }

        if (!this.isCMenuOpen && isSubMenu) {
            li.classList.add('e-selected');
            this.isCMenuOpen = true;
            let menuOptions: ContextMenuModel = {
                items: this.getCMenuDS(this.options.type, selectedMenu ? selectedMenu.replace(/\s/g, '') : undefined),
                select: this.selectHandler.bind(this),
                onClose: this.destroyCMenu.bind(this)
            };
            this.parent.element.appendChild(this.cmenu);
            this.menuObj = new ContextMenu(menuOptions, this.cmenu);
            let client: ClientRect = this.menu.querySelector('.e-submenu').getBoundingClientRect();
            let pos: OffsetPosition = { top: 0, left: 0 };
            if (Browser.isDevice) {
                let contextRect: ClientRect = this.getContextBounds(this.menuObj);
                pos.top = (window.innerHeight - contextRect.height) / 2;
                pos.left = (window.innerWidth - contextRect.width) / 2;
                this.closeDialog();
            } else {
                pos.top = client.top;
                pos.left = this.getCMenuYPosition(this.dlg, this.menuObj);
            }
            this.menuObj.open(pos.top, pos.left);
        }
    }
    private getContextBounds(context: ContextMenu): ClientRect {
        let elementVisible: string = this.menuObj.element.style.display;
        this.menuObj.element.style.display = 'block';
        return this.menuObj.element.getBoundingClientRect();
    }
    private getCMenuYPosition(target: Element, context: ContextMenu): number {
        let contextWidth: number = this.getContextBounds(context).width;
        let targetPosition: ClientRect = target.getBoundingClientRect();
        let leftPos: number = targetPosition.right + contextWidth - this.parent.element.clientWidth;
        return (leftPos < 1) ? (targetPosition.right + 1) : (targetPosition.left - contextWidth - 1);
    }

    public openDialog(options: IFilterArgs): void {
        this.updateModel(options);
        this.getAndSetChkElem(options);
        this.showDialog(options);
        this.dialogObj.dataBind();
        let filterLength: number = this.getExistingPredicate(options.field).length;
        this.createMenu(options.type, filterLength > 0, (filterLength === 1 || filterLength === 2));
        this.dlg.insertBefore(this.menu, this.dlg.firstChild);
        this.dlg.classList.add('e-excelfilter');
        this.dlg.classList.remove('e-checkboxfilter');
        this.cmenu = createElement('ul', { className: 'e-excel-menu' }) as HTMLUListElement;
        this.wireExEvents();
    }

    public closeDialog(): void {
        super.closeDialog();
    }

    private selectHandler(e: MenuEventArgs): void {
        if (e.item) {
            this.menuItem = e.item;
            this.renderDialogue(e);
        }
    }
    private renderDialogue(e: MenuEventArgs): void {
        let target: HTMLElement = e.element as HTMLElement;
        let column: string = this.options.field;
        let mainDiv: HTMLElement = createElement('div', { className: 'e-xlfl-maindiv', id: column + '-xlflmenu' });
        this.dlgDiv = createElement('div', { className: 'e-xlflmenu', id: column + '-xlfldlg' });
        this.parent.element.appendChild(this.dlgDiv);
        this.dlgObj = new Dialog({
            header: 'Custom Filter',
            isModal: true,
            overlayClick: this.removeDialog.bind(this),
            showCloseIcon: true,
            closeOnEscape: false,
            target: document.body,
            // target: this.parent.element,
            visible: false,
            enableRtl: this.parent.enableRtl,
            close: this.removeDialog.bind(this),
            created: this.createdDialog.bind(this, target, column),
            buttons: [{
                click: this.filterBtnClick.bind(this, column),
                buttonModel: {
                    content: this.getLocalizedLabel('OK'), isPrimary: true, cssClass: 'e-xlfl-okbtn'
                }
            },
            {
                click: this.removeDialog.bind(this),
                buttonModel: { content: this.getLocalizedLabel('Cancel'), cssClass: 'e-xlfl-cancelbtn' }
            }],
            content: mainDiv,
            width: 370,
            animationSettings: { effect: 'None' },
        });
        this.dlgObj.appendTo(this.dlgDiv);
    }
    private removeDialog(): void {
        this.removeObjects([this.dropOptr, this.datePicker, this.actObj, this.numericTxtObj, this.dlgObj]);
        remove(this.dlgDiv);
    }
    private clearBtnClick(field: string): void {
        this.clearFilter();
        this.removeDialog();
    }
    private createdDialog(target: Element, column: string): void {
        this.renderCustomFilter(target, column);
        this.dlgObj.element.style.left = '0px';
        this.dlgObj.element.style.top = '0px';
        this.dlgObj.show();
    }
    private renderCustomFilter(target: Element, column: string): void {
        let dlgConetntEle: Element = this.dlgObj.element.querySelector('.e-xlfl-maindiv');

        /* tslint:disable-next-line:max-line-length */
        let dlgFields: HTMLElement = createElement('div', { innerHTML: this.getLocalizedLabel('ShowRowsWhere'), className: 'e-xlfl-dlgfields' });
        dlgConetntEle.appendChild(dlgFields);

        //column name
        let fieldSet: HTMLElement = createElement('div', { innerHTML: column, className: 'e-xlfl-fieldset' });
        dlgConetntEle.appendChild(fieldSet);

        this.renderFilterUI(column, dlgConetntEle);
    }
    private filterBtnClick(col: string): void {
        let fValue: NumericTextBox = (<EJ2Intance>this.dlgDiv.querySelector('#' + col + '-xlfl-frstvalue')).ej2_instances[0];
        let fOperator: DropDownList = (<EJ2Intance>this.dlgDiv.querySelector('#' + col + '-xlfl-frstoptr')).ej2_instances[0];
        let sValue: NumericTextBox = (<EJ2Intance>this.dlgDiv.querySelector('#' + col + '-xlfl-secndvalue')).ej2_instances[0];
        let sOperator: DropDownList = (<EJ2Intance>this.dlgDiv.querySelector('#' + col + '-xlfl-secndoptr')).ej2_instances[0];
        let checkBoxValue: boolean;
        if (this.options.type === 'string') {
            let checkBox: CheckBox = (<EJ2Intance>this.dlgDiv.querySelector('#' + col + '-xlflmtcase')).ej2_instances[0];
            checkBoxValue = checkBox.checked;
        }
        let andRadio: CheckBox = (<EJ2Intance>this.dlgDiv.querySelector('#' + col + 'e-xlfl-frstpredicate')).ej2_instances[0];
        let orRadio: CheckBox = (<EJ2Intance>this.dlgDiv.querySelector('#' + col + 'e-xlfl-secndpredicate')).ej2_instances[0];
        let predicate: string = (andRadio.checked ? 'and' : 'or');
        if (sValue.value === null) {
            predicate = 'or';
        }
        this.filterByColumn(
            this.options.field, fOperator.value as string, fValue.value ? fValue.value : fValue.getText(), predicate,
            checkBoxValue, sOperator.value as string, sValue.value);
        this.removeDialog();
    }
    /**
     * Filters grid row by column name with given options.
     * @param {string} fieldName - Defines the field name of the filter column.
     * @param {string} firstOperator - Defines the first operator by how to filter records.
     * @param {string | number | Date | boolean} firstValue - Defines the first value which is used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query with another by using AND or OR predicate.
     * @param {boolean} ignoreCase - If ignore case set to true, then filter records with exact match or else
     * filter records with case insensitive(uppercase and lowercase letters treated as same).
     * @param {string} secondOperator - Defines the second operator by how to filter records.
     * @param {string | number | Date | boolean} secondValue - Defines the first value which is used to filter records.
     */
    private filterByColumn(
        fieldName: string, firstOperator: string, firstValue: string | number | Date | boolean, predicate?: string,
        ignoreCase?: boolean, secondOperator?: string, secondValue?: string | number | Date | boolean): void {

        let fColl: PredicateModel[] = [];
        let mPredicate: Predicate;
        if (firstValue) {
            fColl.push({
                field: this.options.field,
                predicate: 'or',
                matchcase: ignoreCase,
                operator: firstOperator as string,
                value: firstValue,
                type: this.options.type
            });
            mPredicate = new Predicate(this.options.field, firstOperator.toLowerCase(), firstValue, ignoreCase);
        }
        if (secondValue) {
            fColl.push({
                field: this.options.field,
                predicate: predicate,
                matchcase: ignoreCase,
                operator: secondOperator as string,
                value: secondValue,
                type: this.options.type
            });
            /* tslint:disable-next-line:max-line-length */
            mPredicate = (mPredicate as Object)[predicate](this.options.field, secondOperator.toLowerCase(), secondValue as string, ignoreCase);
        }
        let args: Object = {
            action: 'filtering', filterCollection: fColl, field: this.options.field,
            ejpredicate: mPredicate
        };
        this.options.handler(args);
    }
    /* tslint:disable-next-line:max-line-length */
    private renderOperatorUI(column: string, table: HTMLElement, elementID: string, predicates: PredicateModel[], isFirst?: boolean): { fieldElement: HTMLElement, operator: string } {

        let fieldElement: HTMLElement = createElement('tr', { className: 'e-xlfl-fields' });
        table.appendChild(fieldElement);

        let xlfloptr: HTMLElement = createElement('td', { className: 'e-xlfl-optr' });
        fieldElement.appendChild(xlfloptr);

        let optrDiv: HTMLElement = createElement('div', { className: 'e-xlfl-optrdiv' });

        let optrInput: HTMLElement = createElement('input', { id: column + elementID });

        optrDiv.appendChild(optrInput);
        xlfloptr.appendChild(optrDiv);
        let optr: string = this.options.type + 'Operator';
        let dropDatasource: { [key: string]: Object }[] = this.customFilterOperators[optr];
        this.optrData = dropDatasource;
        let selectedValue: string = this.dropSelectedVal(column, predicates, isFirst);

        //Trailing three dots are sliced.
        let menuText: string = '';
        if (this.menuItem) {
            menuText = this.menuItem.text.slice(0, -3);
            if (menuText !== this.getLocalizedLabel('CustomFilter')) {
                selectedValue = isFirst ? menuText : undefined;
            }
            if (menuText === this.getLocalizedLabel('Between')) {
                selectedValue = this.getLocalizedLabel(isFirst ? 'GreaterThanOrEqual' : 'LessThanOrEqual');
            }
        }

        this.dropOptr = new DropDownList({
            dataSource: dropDatasource,
            fields: { text: 'text', value: 'value' },
            text: selectedValue,
            enableRtl: this.parent.enableRtl
        });
        this.dropOptr.appendTo(optrInput);
        let operator: string = this.getSelectedValue(selectedValue);
        return { fieldElement, operator };
    }
    private getSelectedValue(text: string): string {
        let selectedField: Object = new DataManager(this.optrData).executeLocal(
            new Query().where('text', 'equal', text));
        return !isNullOrUndefined(selectedField[0]) ? selectedField[0].value : '';
    }
    private dropSelectedVal(col: string, predicates: PredicateModel[], isFirst?: boolean): string {
        let operator: string;
        if (predicates.length > 0) {
            operator = predicates.length === 2 ?
                (isFirst ? predicates[0].operator : predicates[1].operator) :
                (isFirst ? predicates[0].operator : undefined);
        } else {
            operator = isFirst ? 'equal' : undefined;
        }
        return this.getSelectedText(operator);
    }
    private getSelectedText(operator: string): string {
        let selectedField: Object = new DataManager(this.optrData).executeLocal(
            new Query().where('value', 'equal', operator));
        return !isNullOrUndefined(selectedField[0]) ? selectedField[0].text : '';
    }

    private getExistingPredicate(column: string): PredicateModel[] {
        let cols: PredicateModel[] = (CheckBoxFilter.getDistinct(this.options.filteredColumns, 'field') as { records: Object[] }).records;
        let collection: PredicateModel[];
        return (new DataManager(this.options.filteredColumns as JSON[]).executeLocal(
            new Query().where('field', 'equal', column)) as PredicateModel[]);
    }
    private renderFilterUI(column: string, dlgConetntEle: Element): void {
        let predicates: PredicateModel[] = this.getExistingPredicate(column);
        let table: HTMLElement = createElement('table', { className: 'e-xlfl-tabel' });
        dlgConetntEle.appendChild(table);

        //Renders first dropdown
        /* tslint:disable-next-line:max-line-length */
        let optr: { fieldElement: HTMLElement, operator: string } = this.renderOperatorUI(column, table, '-xlfl-frstoptr', predicates, true);

        //Renders first value
        this.renderFlValueUI(column, optr, '-xlfl-frstvalue', predicates, true);

        let predicate: HTMLElement = createElement('tr', { className: 'e-xlfl-predicate' });
        table.appendChild(predicate);

        //Renders first radion button
        this.renderRadioButton(column, predicate, predicates);

        if (this.options.type === 'string') {
            this.renderMatchCase(column, predicate, '-xlflmtcase', predicates);
        }

        //Renders second dropdown
        optr = this.renderOperatorUI(column, table, '-xlfl-secndoptr', predicates, false);
        //Renders second text box
        this.renderFlValueUI(column, optr, '-xlfl-secndvalue', predicates, false);
    }
    private renderRadioButton(column: string, tr: HTMLElement, predicates: PredicateModel[]): void {

        let td: HTMLElement = createElement('td', { className: 'e-xlfl-radio' });
        tr.appendChild(td);

        let radioDiv: HTMLElement = createElement('div', { className: 'e-xlfl-radiodiv' });

        /* tslint:disable-next-line:max-line-length */
        let frstpredicate: HTMLInputElement = createElement('input', { id: column + 'e-xlfl-frstpredicate', attrs: { 'type': 'radio' } }) as HTMLInputElement;

        /* tslint:disable-next-line:max-line-length */
        let secndpredicate: HTMLInputElement = createElement('input', { id: column + 'e-xlfl-secndpredicate', attrs: { 'type': 'radio' } }) as HTMLInputElement;

        //appends into div
        radioDiv.appendChild(frstpredicate);
        radioDiv.appendChild(secndpredicate);
        td.appendChild(radioDiv);

        // Initialize AND RadioButton component.
        /* tslint:disable-next-line:max-line-length */
        let andRadio: RadioButton = new RadioButton({ label: this.getLocalizedLabel('AND'), name: 'default', cssClass: 'e-xlfl-radio-and', checked: true, enableRtl: this.parent.enableRtl });

        // Initialize OR RadioButton component.
        /* tslint:disable-next-line:max-line-length */
        let orRadio: RadioButton = new RadioButton({ label: this.getLocalizedLabel('OR'), name: 'default', cssClass: 'e-xlfl-radio-or', enableRtl: this.parent.enableRtl });

        let flValue: string = predicates.length === 2 ? predicates[1].predicate as string : 'and';
        if (flValue === 'and') {
            andRadio.checked = true;
            orRadio.checked = false;
        } else {
            orRadio.checked = true;
            andRadio.checked = false;
        }

        // Render initialized RadioButton.
        andRadio.appendTo(frstpredicate);
        orRadio.appendTo(secndpredicate);
    }
    /* tslint:disable-next-line:no-any */
    private removeObjects(elements: any[]): void {
        for (let obj of elements) {
            if (obj && !obj.isDestroyed) {
                obj.destroy();
            }
        }
    }

    /* tslint:disable-next-line:max-line-length */
    private renderFlValueUI(column: string, optr: { fieldElement: HTMLElement, operator: string }, elementId: string, predicates: PredicateModel[], isFirst?: boolean): void {

        let value: HTMLElement = createElement('td', { className: 'e-xlfl-value' });
        optr.fieldElement.appendChild(value);

        let valueDiv: HTMLElement = createElement('div', { className: 'e-xlfl-valuediv' });
        let valueInput: Element = createElement('input', { id: column + elementId });

        valueDiv.appendChild(valueInput);
        value.appendChild(valueDiv);

        let flValue: string | number | Date | boolean;
        let predicate: PredicateModel;
        if (predicates.length > 0) {
            predicate = predicates.length === 2 ?
                (isFirst ? predicates[0] : predicates[1]) :
                (isFirst ? predicates[0] : undefined);

            flValue = (predicate && predicate.operator === optr.operator) ? predicate.value : undefined;
        }
        let types: Object = {
            'string': this.renderAutoComplete.bind(this),
            'number': this.renderNumericTextBox.bind(this),
            'date': this.renderDate.bind(this),
            'datetime': this.renderDate.bind(this)
        };
        types[this.options.type](this.options, column, valueInput, flValue, this.parent.enableRtl);
    }
    private renderMatchCase(column: string, tr: HTMLElement, elementId: string, predicates: PredicateModel[]): void {
        let matchCase: HTMLElement = createElement('td', { className: 'e-xlfl-mtcase' });
        tr.appendChild(matchCase);

        let matchCaseDiv: HTMLElement = createElement('div', { className: 'e-xlfl-matchcasediv' });

        let matchCaseInput: HTMLInputElement = createElement(
            'input',
            { id: column + elementId, attrs: { 'type': 'checkbox' } }
        ) as HTMLInputElement;

        matchCaseDiv.appendChild(matchCaseInput);
        matchCase.appendChild(matchCaseDiv);

        let flValue: boolean = predicates.length > 0 ?
            (predicates.length === 2 ? predicates[1].matchcase : predicates[0].matchcase) :
            false;

        // Initialize Match Case check box.
        let checkbox: CheckBox = new CheckBox({ label: 'Match Case', enableRtl: this.parent.enableRtl, checked: flValue });

        // Render initialized CheckBox.
        checkbox.appendTo(matchCaseInput);
    }

    /* tslint:disable-next-line:max-line-length */
    private renderDate(options: IFilterArgs, column: string, inputValue: HTMLElement, fValue: string | number | Date | boolean, isRtl: boolean): void {
        let intl: Internationalization = new Internationalization();
        let format: string = intl.getDatePattern({ type: 'date', skeleton: options.format }, false);
        this.datePicker = new DatePicker({
            format: format,
            cssClass: 'e-popup-flmenu',
            placeholder: this.getLocalizedLabel('CustomFilterDatePlaceHolder'),
            width: '100%',
            enableRtl: isRtl,
            value: new Date(fValue as string),
        });
        this.datePicker.appendTo(inputValue);
    }

    private completeAction(e: { result: string[] }): void {
        e.result = distinctStringValues(e.result);
    }

    /* tslint:disable-next-line:max-line-length */
    private renderNumericTextBox(options: IFilterArgs, column: string, inputValue: HTMLElement, fValue: string | number | Date | boolean, isRtl: boolean): void {
        this.numericTxtObj = new NumericTextBox({
            format: options.format as string,
            placeholder: this.getLocalizedLabel('CustomFilterPlaceHolder'),
            enableRtl: isRtl,
            value: fValue as number
        });
        this.numericTxtObj.appendTo(inputValue);
    }

    /* tslint:disable-next-line:max-line-length */
    private renderAutoComplete(options: IFilterArgs, column: string, inputValue: HTMLElement, fValue: string | number | Date | boolean, isRtl: boolean): void {
        let actObj: AutoComplete = new AutoComplete({
            dataSource: options.dataSource instanceof DataManager ?
                options.dataSource : new DataManager(options.dataSource as object),
            fields: { value: column },
            sortOrder: 'Ascending',
            autofill: true,
            focus: () => {
                actObj.filterType = ((<EJ2Intance>this.dlgDiv.querySelector('#' + column +
                    (inputValue.id === (column + '-xlfl-frstvalue') ?
                        '-xlfl-frstoptr' :
                        '-xlfl-secndoptr')
                )).ej2_instances[0] as DropDownList).value as 'StartsWith' | 'Contains' | 'EndsWith';
                actObj.ignoreCase = options.type === 'string' ?
                    !((<EJ2Intance>this.dlgDiv.querySelector('#' + column + '-xlflmtcase')).ej2_instances[0] as CheckBox).checked :
                    true;
            },
            placeholder: this.getLocalizedLabel('CustomFilterPlaceHolder'),
            enableRtl: isRtl,
            actionComplete: (e: { result: { [key: string]: Object; }[] }) => {
                e.result = e.result.filter((obj: { [key: string]: Object; }, index: number, arr: { [key: string]: Object; }[]) => {
                    return arr.map((mapObject: Object) => {
                        return mapObject[actObj.fields.value];
                    }).indexOf(obj[this.actObj.fields.value]) === index;
                });
            },
            value: fValue as string
        });
        actObj.appendTo(inputValue);
        this.actObj = actObj;
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'excelFilter';
    }

}
