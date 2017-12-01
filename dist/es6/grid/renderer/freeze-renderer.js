var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { createElement, remove } from '@syncfusion/ej2-base';
import { HeaderRender } from './header-renderer';
import { ContentRender } from './content-renderer';
import { FreezeRowModelGenerator } from '../services/freeze-row-model-generator';
import * as events from '../base/constant';
/**
 * Freeze module is used to render grid content with frozen rows and columns
 * @hidden
 */
var FreezeContentRender = /** @class */ (function (_super) {
    __extends(FreezeContentRender, _super);
    function FreezeContentRender(parent, locator) {
        return _super.call(this, parent, locator) || this;
    }
    FreezeContentRender.prototype.renderPanel = function () {
        _super.prototype.renderPanel.call(this);
        if (this.parent.frozenColumns) {
            var fDiv = createElement('div', { className: 'e-frozencontent' });
            var mDiv = createElement('div', { className: 'e-movablecontent' });
            this.getPanel().firstChild.appendChild(fDiv);
            this.getPanel().firstChild.appendChild(mDiv);
            this.setFrozenContent(fDiv);
            this.setMovableContent(mDiv);
        }
    };
    FreezeContentRender.prototype.renderEmpty = function (tbody) {
        _super.prototype.renderEmpty.call(this, tbody);
        if (this.parent.frozenColumns) {
            this.getMovableContent().querySelector('tbody').innerHTML = '<tr><td></td></tr>';
            if (this.parent.frozenRows) {
                this.parent.getHeaderContent().querySelector('.e-frozenheader').querySelector('tbody').innerHTML = '';
                this.parent.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody').innerHTML = '';
            }
        }
        else if (this.parent.frozenRows) {
            this.parent.getHeaderContent().querySelector('tbody').innerHTML = '';
        }
    };
    FreezeContentRender.prototype.setFrozenContent = function (ele) {
        this.frozenContent = ele;
    };
    FreezeContentRender.prototype.setMovableContent = function (ele) {
        this.movableContent = ele;
    };
    FreezeContentRender.prototype.getFrozenContent = function () {
        return this.frozenContent;
    };
    FreezeContentRender.prototype.getMovableContent = function () {
        return this.movableContent;
    };
    FreezeContentRender.prototype.getModelGenerator = function () {
        return new FreezeRowModelGenerator(this.parent);
    };
    FreezeContentRender.prototype.renderTable = function () {
        _super.prototype.renderTable.call(this);
        if (this.parent.frozenColumns) {
            this.getFrozenContent().appendChild(this.getTable());
            var mTbl = this.getTable().cloneNode(true);
            this.getMovableContent().appendChild(mTbl);
        }
        if (this.parent.frozenRows) {
            this.parent.getHeaderContent().firstChild.classList.add('e-frozenhdrcont');
        }
    };
    return FreezeContentRender;
}(ContentRender));
export { FreezeContentRender };
var FreezeRender = /** @class */ (function (_super) {
    __extends(FreezeRender, _super);
    function FreezeRender(parent, locator) {
        var _this = _super.call(this, parent, locator) || this;
        _this.addEventListener();
        return _this;
    }
    FreezeRender.prototype.addEventListener = function () {
        this.parent.on(events.freezeRender, this.refreshFreeze, this);
    };
    FreezeRender.prototype.renderTable = function () {
        _super.prototype.renderTable.call(this);
        this.rfshMovable();
    };
    FreezeRender.prototype.renderPanel = function () {
        _super.prototype.renderPanel.call(this);
        var fDiv = createElement('div', { className: 'e-frozenheader' });
        var mDiv = createElement('div', { className: 'e-movableheader' });
        this.getPanel().firstChild.appendChild(fDiv);
        this.getPanel().firstChild.appendChild(mDiv);
        this.setFrozenHeader(fDiv);
        this.setMovableHeader(mDiv);
    };
    FreezeRender.prototype.refreshUI = function () {
        this.getMovableHeader().innerHTML = '';
        _super.prototype.refreshUI.call(this);
        this.rfshMovable();
        var mTable = this.getMovableHeader().querySelector('table');
        remove(this.getMovableHeader().querySelector('colgroup'));
        mTable.insertBefore(this.renderMovable(this.getFrozenHeader().querySelector('colgroup')), mTable.querySelector('thead'));
    };
    FreezeRender.prototype.rfshMovable = function () {
        this.getFrozenHeader().appendChild(this.getTable());
        this.getMovableHeader().appendChild(this.createTable());
        this.refreshFreeze({ case: 'filter' });
        this.parent.notify(events.freezeRefresh, {});
    };
    FreezeRender.prototype.refreshFreeze = function (obj) {
        if (obj.case === 'filter') {
            var filterRow = this.getTable().querySelector('.e-filterbar');
            if (this.parent.allowFiltering && filterRow && this.getMovableHeader().querySelector('thead')) {
                this.getMovableHeader().querySelector('thead')
                    .appendChild(this.renderMovable(filterRow));
            }
        }
        else if (obj.case === 'textwrap') {
            var fRows = void 0;
            var mRows = void 0;
            var wrapMode = this.parent.textWrapSettings.wrapMode;
            if (wrapMode !== 'header' || obj.isModeChg) {
                fRows = this.parent.getContent()
                    .querySelector('.e-frozencontent').querySelectorAll('tr');
                mRows = this.parent.getContent()
                    .querySelector('.e-movablecontent').querySelectorAll('tr');
                this.setWrapHeight(fRows, mRows, obj.isModeChg, true);
            }
            if (this.parent.frozenRows) {
                if (wrapMode === 'content' && this.parent.allowTextWrap) {
                    this.parent.getHeaderContent().firstChild.classList.add('e-wrap');
                }
                else {
                    this.parent.getHeaderContent().firstChild.classList.remove('e-wrap');
                }
                if (wrapMode === 'both' || obj.isModeChg) {
                    fRows = this.getFrozenHeader().querySelectorAll('tr');
                    mRows = this.getMovableHeader().querySelectorAll('tr');
                }
                else {
                    fRows = this.getFrozenHeader().querySelector(wrapMode === 'content' ? 'tbody' : 'thead')
                        .querySelectorAll('tr');
                    mRows = this.getMovableHeader().querySelector(wrapMode === 'content' ? 'tbody' : 'thead')
                        .querySelectorAll('tr');
                }
                this.setWrapHeight(fRows, mRows, obj.isModeChg);
            }
        }
    };
    FreezeRender.prototype.setWrapHeight = function (fRows, mRows, isModeChg, isContReset) {
        var fRowHgt;
        var mRowHgt;
        var isWrap = this.parent.allowTextWrap;
        var wrapMode = this.parent.textWrapSettings.wrapMode;
        var tHead = this.parent.getHeaderContent().querySelector('thead');
        var tBody = this.parent.getHeaderContent().querySelector('tbody');
        for (var i = 0, len = fRows.length; i < len; i++) {
            if (isModeChg && ((wrapMode === 'header' && isContReset) || ((wrapMode === 'content' && tHead.contains(fRows[i]))
                || (wrapMode === 'header' && tBody.contains(fRows[i]))))) {
                fRows[i].style.height = null;
                mRows[i].style.height = null;
            }
            fRowHgt = fRows[i].offsetHeight;
            mRowHgt = mRows[i].offsetHeight;
            if ((isWrap && fRowHgt < mRowHgt) || (!isWrap && fRowHgt > mRowHgt)) {
                fRows[i].style.height = mRowHgt + 'px';
            }
            else if ((isWrap && fRowHgt > mRowHgt) || (!isWrap && fRowHgt < mRowHgt)) {
                mRows[i].style.height = fRowHgt + 'px';
            }
        }
    };
    FreezeRender.prototype.setFrozenHeader = function (ele) {
        this.frozenHeader = ele;
    };
    FreezeRender.prototype.setMovableHeader = function (ele) {
        this.movableHeader = ele;
    };
    FreezeRender.prototype.getFrozenHeader = function () {
        return this.frozenHeader;
    };
    FreezeRender.prototype.getMovableHeader = function () {
        return this.movableHeader;
    };
    FreezeRender.prototype.renderMovable = function (ele) {
        var mEle = ele.cloneNode(true);
        for (var i = 0; i < this.parent.frozenColumns; i++) {
            mEle.removeChild(mEle.children[0]);
        }
        for (var i = this.parent.frozenColumns, len = ele.childElementCount; i < len; i++) {
            ele.removeChild(ele.children[ele.childElementCount - 1]);
        }
        return mEle;
    };
    return FreezeRender;
}(HeaderRender));
export { FreezeRender };
