import { createElement, addClass, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { EventHandler, closest } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { Dialog, calculateRelativeBasedPosition } from '@syncfusion/ej2-popups';
import { changeButtonType, createCboxWithWrap, toogleCheckbox, parentsUntil } from '../base/util';
import { createCheckBox } from '@syncfusion/ej2-buttons';
/**
 *
 * `ColumnChooser` module is used to show or hide the columns dynamically.
 */
var ColumnChooser = /** @class */ (function () {
    /**
     * Constructor for the Grid ColumnChooser module
     * @hidden
     */
    function ColumnChooser(parent, serviceLocator) {
        this.showColumn = [];
        this.hideColumn = [];
        this.isDlgOpen = false;
        this.dlghide = false;
        this.initialOpenDlg = true;
        this.stateChangeColumns = [];
        this.isInitialOpen = false;
        this.isCustomizeOpenCC = false;
        this.cBoxTrue = createCheckBox(true, { checked: true, label: ' ' });
        this.cBoxFalse = createCheckBox(true, { checked: false, label: ' ' });
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
        this.cBoxTrue.insertBefore(createElement('input', {
            className: 'e-chk-hidden e-cc e-cc-chbox', attrs: { type: 'checkbox' }
        }), this.cBoxTrue.firstChild);
        this.cBoxFalse.insertBefore(createElement('input', {
            className: 'e-chk-hidden e-cc e-cc-chbox', attrs: { 'type': 'checkbox' }
        }), this.cBoxFalse.firstChild);
        this.cBoxFalse.querySelector('.e-frame').classList.add('e-uncheck');
        if (this.parent.enableRtl) {
            addClass([this.cBoxTrue, this.cBoxFalse], ['e-rtl']);
        }
    }
    ColumnChooser.prototype.destroy = function () {
        this.removeEventListener();
        this.unWireEvents();
        if (!isNullOrUndefined(this.dlgObj) && this.dlgObj.element) {
            this.dlgObj.destroy();
        }
    };
    /**
     * @hidden
     */
    ColumnChooser.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.initialEnd, this.render, this);
        this.parent.addEventListener(events.dataBound, this.hideDialog.bind(this));
        this.parent.on(events.destroy, this.destroy, this);
    };
    /**
     * @hidden
     */
    ColumnChooser.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.initialEnd, this.render);
        this.parent.off(events.destroy, this.destroy);
    };
    ColumnChooser.prototype.render = function () {
        this.l10n = this.serviceLocator.getService('localization');
        this.renderDlgContent();
        this.getShowHideService = this.serviceLocator.getService('showHideService');
    };
    ColumnChooser.prototype.clickHandler = function (e) {
        var targetElement = e.target;
        if (!this.isCustomizeOpenCC) {
            if (!isNullOrUndefined(closest(targetElement, '.e-cc')) || !isNullOrUndefined(closest(targetElement, '.e-cc-toolbar'))) {
                if (targetElement.classList.contains('e-columnchooser-btn') || targetElement.classList.contains('e-cc-toolbar')) {
                    if ((this.initialOpenDlg && this.dlgObj.visible) || !this.isDlgOpen) {
                        this.isDlgOpen = true;
                        return;
                    }
                }
                else if (targetElement.classList.contains('e-cc-cancel')) {
                    targetElement.parentElement.querySelector('.e-ccsearch').value = '';
                    this.columnChooserSearch('');
                    this.removeCancelIcon();
                }
            }
            else {
                if (!isNullOrUndefined(this.dlgObj) && this.dlgObj.visible && !targetElement.classList.contains('e-toolbar-items')) {
                    this.dlgObj.hide();
                    // this.unWireEvents();
                    this.isDlgOpen = false;
                }
            }
        }
    };
    ColumnChooser.prototype.hideDialog = function () {
        if (!isNullOrUndefined(this.dlgObj) && this.dlgObj.visible) {
            this.dlgObj.hide();
            // this.unWireEvents();
            this.isDlgOpen = false;
        }
    };
    /**
     * To render columnChooser when showColumnChooser enabled.
     * @return {void}
     * @hidden
     */
    ColumnChooser.prototype.renderColumnChooser = function (x, y, target) {
        if (!this.dlgObj.visible) {
            var pos = { X: null, Y: null };
            var args1 = {
                requestType: 'beforeOpenColumnChooser', element: this.parent.element,
                columns: this.parent.getColumns()
            };
            this.parent.trigger(events.beforeOpenColumnChooser, args1);
            this.refreshCheckboxState();
            this.dlgObj.dataBind();
            this.dlgObj.element.style.maxHeight = '430px';
            var elementVisible = this.dlgObj.element.style.display;
            this.dlgObj.element.style.display = 'block';
            var newpos = calculateRelativeBasedPosition(closest(target, '.e-toolbar-item'), this.dlgObj.element);
            this.dlgObj.element.style.display = elementVisible;
            this.dlgObj.element.style.top = newpos.top + closest(target, '.e-cc-toolbar').getBoundingClientRect().height + 'px';
            var dlgWidth = 250;
            if (!isNullOrUndefined(closest(target, '.e-bigger'))) {
                this.dlgObj.width = 253;
            }
            if (Browser.isDevice) {
                this.dlgObj.target = document.body;
                this.dlgObj.position = { X: 'center', Y: 'center' };
                this.dlgObj.refreshPosition();
                this.dlgObj.open = this.mOpenDlg.bind(this);
            }
            else {
                if (this.parent.enableRtl) {
                    this.dlgObj.element.style.left = target.offsetLeft + 'px';
                }
                else {
                    this.dlgObj.element.style.left = ((newpos.left - dlgWidth) + closest(target, '.e-cc-toolbar').clientWidth) + 2 + 'px';
                }
            }
            this.removeCancelIcon();
            this.dlgObj.show();
        }
        else {
            // this.unWireEvents();
            this.hideDialog();
            this.addcancelIcon();
        }
    };
    /**
     * Column chooser can be displayed on screen by given position(X and Y axis).
     * @param  {number} X - Defines the X axis.
     * @param  {number} Y - Defines the Y axis.
     * @return {void}
     */
    ColumnChooser.prototype.openColumnChooser = function (X, Y) {
        this.isCustomizeOpenCC = true;
        if (this.dlgObj.visible) {
            this.hideDialog();
            return;
        }
        if (!this.isInitialOpen) {
            this.dlgObj.content = this.renderChooserList();
        }
        else {
            this.refreshCheckboxState();
        }
        this.dlgObj.dataBind();
        this.dlgObj.position = { X: 'center', Y: 'center' };
        if (isNullOrUndefined(X)) {
            this.dlgObj.position = { X: 'center', Y: 'center' };
            this.dlgObj.refreshPosition();
        }
        else {
            this.dlgObj.element.style.top = '';
            this.dlgObj.element.style.left = '';
            this.dlgObj.element.style.top = Y + 'px';
            this.dlgObj.element.style.left = X + 'px';
        }
        this.dlgObj.beforeOpen = this.customDialogOpen.bind(this);
        this.dlgObj.show();
        this.isInitialOpen = true;
        this.dlgObj.beforeClose = this.customDialogClose.bind(this);
    };
    ColumnChooser.prototype.customDialogOpen = function () {
        var searchElement = this.dlgObj.content.querySelector('input.e-ccsearch');
        EventHandler.add(searchElement, 'keyup', this.columnChooserManualSearch, this);
    };
    ColumnChooser.prototype.customDialogClose = function () {
        var searchElement = this.dlgObj.content.querySelector('input.e-ccsearch');
        EventHandler.remove(searchElement, 'keyup', this.columnChooserManualSearch);
    };
    ColumnChooser.prototype.renderDlgContent = function () {
        var y;
        this.dlgDiv = createElement('div', { className: 'e-ccdlg e-cc', id: this.parent.element.id + '_ccdlg' });
        this.parent.element.appendChild(this.dlgDiv);
        var xpos = this.parent.element.getBoundingClientRect().width - 250;
        var dialoPos = this.parent.enableRtl ? 'left' : 'right';
        var tarElement = this.parent.element.querySelector('.e-ccdiv');
        if (!isNullOrUndefined(tarElement)) {
            y = tarElement.getBoundingClientRect().top;
        }
        var pos = { X: null, Y: null };
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
                        content: this.l10n.getConstant('OKButton'), isPrimary: true,
                        cssClass: 'e-cc e-cc_okbtn',
                    }
                },
                {
                    click: this.clearActions.bind(this),
                    buttonModel: { cssClass: 'e-flat e-cc e-cc-cnbtn', content: this.l10n.getConstant('CancelButton') }
                }],
            content: this.renderChooserList(),
            width: 250,
            cssClass: 'e-cc',
            animationSettings: { effect: 'None' },
        });
        this.dlgObj.appendTo(this.dlgDiv);
        changeButtonType(this.dlgObj.element);
        this.wireEvents();
    };
    ColumnChooser.prototype.renderChooserList = function () {
        this.mainDiv = createElement('div', { className: 'e-main-div e-cc' });
        var searchDiv = createElement('div', { className: 'e-cc-searchdiv e-cc e-input-group' });
        var ccsearchele = createElement('input', {
            className: 'e-ccsearch e-cc e-input',
            attrs: { placeholder: this.l10n.getConstant('Search') }
        });
        var ccsearchicon = createElement('span', { className: 'e-ccsearch-icon e-icons e-cc e-input-group-icon' });
        var conDiv = createElement('div', { className: 'e-cc-contentdiv' });
        this.innerDiv = createElement('div', { className: 'e-innerdiv e-cc' });
        searchDiv.appendChild(ccsearchele);
        searchDiv.appendChild(ccsearchicon);
        ccsearchele.addEventListener('focus', this.searchFocus.bind(this, ccsearchele));
        ccsearchele.addEventListener('blur', this.searchBlur.bind(this, ccsearchele));
        var innerDivContent = this.refreshCheckboxList(this.parent.getColumns());
        this.innerDiv.appendChild(innerDivContent);
        conDiv.appendChild(this.innerDiv);
        this.mainDiv.appendChild(searchDiv);
        this.mainDiv.appendChild(conDiv);
        return this.mainDiv;
    };
    ColumnChooser.prototype.searchFocus = function (targt) {
        targt.parentElement.classList.add('e-input-focus');
    };
    ColumnChooser.prototype.searchBlur = function (targt) {
        targt.parentElement.classList.remove('e-input-focus');
    };
    ColumnChooser.prototype.confirmDlgBtnClick = function (args) {
        this.stateChangeColumns = [];
        if (!isNullOrUndefined(args)) {
            if (this.hideColumn.length) {
                this.columnStateChange(this.hideColumn, false);
            }
            if (this.showColumn.length) {
                this.columnStateChange(this.showColumn, true);
            }
            var params = {
                requestType: 'columnstate', element: this.parent.element,
                columns: this.stateChangeColumns, dialogInstance: this.dlgObj
            };
            this.parent.trigger(events.actionComplete, params);
            this.getShowHideService.setVisible(this.stateChangeColumns);
            this.clearActions();
        }
    };
    ColumnChooser.prototype.columnStateChange = function (stateColumns, state) {
        for (var index = 0; index < stateColumns.length; index++) {
            var colUid = stateColumns[index];
            var currentCol = this.parent.getColumnByUid(colUid);
            currentCol.visible = state;
            this.stateChangeColumns.push(currentCol);
        }
    };
    ColumnChooser.prototype.clearActions = function () {
        this.hideColumn = [];
        this.showColumn = [];
        // this.unWireEvents();
        this.hideDialog();
        this.addcancelIcon();
    };
    ColumnChooser.prototype.checkstatecolumn = function (isChecked, coluid) {
        if (isChecked) {
            if (this.hideColumn.indexOf(coluid) !== -1) {
                this.hideColumn.splice(this.hideColumn.indexOf(coluid), 1);
            }
            if (this.showColumn.indexOf(coluid) === -1) {
                this.showColumn.push(coluid);
            }
        }
        else {
            if (this.showColumn.indexOf(coluid) !== -1) {
                this.showColumn.splice(this.showColumn.indexOf(coluid), 1);
            }
            if (this.hideColumn.indexOf(coluid) === -1) {
                this.hideColumn.push(coluid);
            }
        }
    };
    ColumnChooser.prototype.columnChooserSearch = function (searchVal) {
        var clearSearch = false;
        var fltrCol;
        if (searchVal === '') {
            this.removeCancelIcon();
            fltrCol = this.parent.getColumns();
            clearSearch = true;
        }
        else {
            fltrCol = new DataManager(this.parent.getColumns()).executeLocal(new Query()
                .where('headerText', 'startswith', searchVal, true));
        }
        if (fltrCol.length) {
            this.innerDiv.innerHTML = ' ';
            this.innerDiv.classList.remove('e-ccnmdiv');
            this.innerDiv.appendChild(this.refreshCheckboxList(fltrCol, searchVal));
            if (!clearSearch) {
                this.addcancelIcon();
            }
        }
        else {
            var nMatchele = createElement('span', { className: 'e-cc e-nmatch' });
            nMatchele.innerHTML = this.l10n.getConstant('Matchs');
            this.innerDiv.innerHTML = ' ';
            this.innerDiv.appendChild(nMatchele);
            this.innerDiv.classList.add('e-ccnmdiv');
        }
        this.flag = true;
        this.stopTimer();
    };
    ColumnChooser.prototype.wireEvents = function () {
        EventHandler.add(this.dlgObj.element, 'click', this.checkBoxClickHandler, this);
        var searchElement = this.dlgObj.content.querySelector('input.e-ccsearch');
        EventHandler.add(searchElement, 'keyup', this.columnChooserManualSearch, this);
    };
    ColumnChooser.prototype.unWireEvents = function () {
        if (this.dlgObj.element) {
            EventHandler.remove(this.dlgObj.element, 'click', this.checkBoxClickHandler);
        }
        var searchElement = this.dlgObj.content.querySelector('input.e-ccsearch');
        EventHandler.remove(searchElement, 'keyup', this.columnChooserManualSearch);
    };
    ColumnChooser.prototype.checkBoxClickHandler = function (e) {
        var checkstate;
        var elem = parentsUntil(e.target, 'e-checkbox-wrapper');
        if (elem) {
            toogleCheckbox(elem.parentElement);
            elem.querySelector('.e-chk-hidden').focus();
            if (elem.querySelector('.e-check')) {
                checkstate = true;
            }
            else if (elem.querySelector('.e-uncheck')) {
                checkstate = false;
            }
            else {
                return;
            }
            var columnUid = parentsUntil(elem, 'e-ccheck').getAttribute('uid');
            this.checkstatecolumn(checkstate, columnUid);
        }
    };
    ColumnChooser.prototype.refreshCheckboxList = function (gdCol, searchVal) {
        this.ulElement = createElement('ul', { className: 'e-ccul-ele e-cc' });
        for (var i = 0; i < gdCol.length; i++) {
            var columns = gdCol[i];
            this.renderCheckbox(columns);
        }
        return this.ulElement;
    };
    ColumnChooser.prototype.refreshCheckboxState = function () {
        this.dlgObj.element.querySelector('.e-cc.e-input').value = '';
        this.columnChooserSearch('');
        for (var i = 0; i < this.parent.element.querySelectorAll('.e-cc-chbox').length; i++) {
            var element = this.parent.element.querySelectorAll('.e-cc-chbox')[i];
            var columnUID = parentsUntil(element, 'e-ccheck').getAttribute('uid');
            var column = this.parent.getColumnByUid(columnUID);
            if (column.visible) {
                element.checked = true;
            }
            else {
                element.checked = false;
            }
        }
    };
    ColumnChooser.prototype.createCheckBox = function (label, checked, uid) {
        var cbox = checked ? this.cBoxTrue.cloneNode(true) : this.cBoxFalse.cloneNode(true);
        cbox.querySelector('.e-label').innerHTML = label;
        return createCboxWithWrap(uid, cbox, 'e-ccheck');
    };
    ColumnChooser.prototype.renderCheckbox = function (column) {
        var cclist;
        var hideColState;
        var showColState;
        var checkBoxObj;
        if (column.showInColumnChooser) {
            cclist = createElement('li', { className: 'e-cclist e-cc', styles: 'list-style:None', id: 'e-ccli_' + column.uid });
            hideColState = this.hideColumn.indexOf(column.uid) === -1 ? false : true;
            showColState = this.showColumn.indexOf(column.uid) === -1 ? false : true;
            var cccheckboxlist = this.createCheckBox(column.headerText, (column.visible && !hideColState) || showColState, column.uid);
            cclist.appendChild(cccheckboxlist);
            this.ulElement.appendChild(cclist);
        }
    };
    ColumnChooser.prototype.columnChooserManualSearch = function (e) {
        this.addcancelIcon();
        this.searchValue = e.target.value;
        var proxy = this;
        this.stopTimer();
        this.startTimer(e);
    };
    ColumnChooser.prototype.startTimer = function (e) {
        var proxy = this;
        var interval = !proxy.flag && e.keyCode !== 13 ? 500 : 0;
        this.timer = window.setInterval(function () { proxy.columnChooserSearch(proxy.searchValue); }, interval);
    };
    ColumnChooser.prototype.stopTimer = function () {
        window.clearInterval(this.timer);
    };
    ColumnChooser.prototype.addcancelIcon = function () {
        this.dlgDiv.querySelector('.e-cc.e-ccsearch-icon').classList.add('e-cc-cancel');
    };
    ColumnChooser.prototype.removeCancelIcon = function () {
        this.dlgDiv.querySelector('.e-cc.e-ccsearch-icon').classList.remove('e-cc-cancel');
    };
    ColumnChooser.prototype.mOpenDlg = function () {
        if (Browser.isDevice) {
            this.dlgObj.element.querySelector('.e-cc-searchdiv').classList.remove('e-input-focus');
            this.dlgObj.element.querySelectorAll('.e-cc-chbox')[0].focus();
        }
    };
    // internally use
    ColumnChooser.prototype.getModuleName = function () {
        return 'ColumnChooser';
    };
    return ColumnChooser;
}());
export { ColumnChooser };
