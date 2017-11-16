import { Browser, createElement, remove } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
var Clipboard = (function () {
    function Clipboard(parent) {
        this.copyContent = '';
        this.isSelect = false;
        this.parent = parent;
        this.addEventListener();
    }
    Clipboard.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.contentReady, this.initialEnd, this);
        this.parent.on(events.keyPressed, this.keyDownHandler, this);
    };
    Clipboard.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.keyPressed, this.keyDownHandler);
    };
    Clipboard.prototype.initialEnd = function () {
        this.parent.off(events.contentReady, this.initialEnd);
        this.clipBoardTextArea = createElement('textarea', {
            className: 'e-clipboard',
            styles: 'opacity: 0',
            attrs: { readonly: 'true' }
        });
        this.parent.element.appendChild(this.clipBoardTextArea);
    };
    Clipboard.prototype.keyDownHandler = function (e) {
        if (e.action === 'ctrlPlusC') {
            this.copy();
        }
        else if (e.action === 'ctrlShiftPlusH') {
            this.copy(true);
        }
    };
    Clipboard.prototype.setCopyData = function (withHeader) {
        if (window.getSelection().toString() === '') {
            this.clipBoardTextArea.value = this.copyContent = '';
            if (this.parent.selectionSettings.mode !== 'cell') {
                var rows = this.parent.getRows();
                var selectedIndexes = this.parent.getSelectedRowIndexes().sort(function (a, b) { return a - b; });
                if (withHeader) {
                    this.getCopyData([].slice.call(this.parent.element.querySelectorAll('.e-headercell')), false, '\t', withHeader);
                    this.copyContent += '\n';
                }
                for (var i = 0; i < selectedIndexes.length; i++) {
                    if (i > 0) {
                        this.copyContent += '\n';
                    }
                    this.getCopyData([].slice.call(rows[selectedIndexes[i]].querySelectorAll('.e-rowcell')), false, '\t', withHeader);
                }
            }
            else {
                this.getCopyData([].slice.call(this.parent.element.querySelectorAll('.e-cellselectionbackground')), true, '\n', withHeader);
            }
            var args = {
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
            }
            else {
                this.clipBoardTextArea.setSelectionRange(0, this.clipBoardTextArea.value.length);
            }
            this.isSelect = true;
        }
    };
    Clipboard.prototype.getCopyData = function (cells, isCell, splitKey, withHeader) {
        for (var j = 0; j < cells.length; j++) {
            if (withHeader && isCell) {
                this.copyContent += this.parent.getVisibleColumns()[parseInt(cells[j].getAttribute('aria-colindex'), 10)].headerText + '\n';
            }
            this.copyContent += cells[j].textContent;
            if (j < cells.length - 1) {
                this.copyContent += splitKey;
            }
        }
    };
    Clipboard.prototype.copy = function (withHeader) {
        if (document.queryCommandSupported('copy')) {
            this.setCopyData(withHeader);
            document.execCommand('copy');
            this.clipBoardTextArea.blur();
        }
        if (this.isSelect) {
            window.getSelection().removeAllRanges();
            this.isSelect = false;
        }
    };
    Clipboard.prototype.getModuleName = function () {
        return 'clipboard';
    };
    Clipboard.prototype.destroy = function () {
        this.removeEventListener();
        remove(this.clipBoardTextArea);
    };
    return Clipboard;
}());
export { Clipboard };
