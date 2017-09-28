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
import { createElement, closest } from '@syncfusion/ej2-base';
import { Browser } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { getRowHeight } from '../base/util';
import { dataReady, modelChanged, refreshVirtualBlock, contentReady } from '../base/constant';
import { RenderType } from '../base/enum';
import { ContentRender } from './content-renderer';
import { HeaderRender } from './header-renderer';
import { InterSectionObserver } from '../services/intersection-observer';
import { VirtualRowModelGenerator } from '../services/virtual-row-model-generator';
var VirtualContentRenderer = (function (_super) {
    __extends(VirtualContentRenderer, _super);
    function VirtualContentRenderer(parent, locator) {
        var _this = _super.call(this, parent, locator) || this;
        _this.prevHeight = 0;
        _this.preventEvent = false;
        _this.actions = ['filtering', 'searching', 'grouping', 'ungrouping'];
        _this.offsets = {};
        _this.tmpOffsets = {};
        _this.virtualEle = new VirtualElementHandler();
        _this.offsetKeys = [];
        _this.isFocused = false;
        _this.locator = locator;
        _this.eventListener('on');
        _this.vgenerator = _this.generator;
        return _this;
    }
    VirtualContentRenderer.prototype.renderTable = function () {
        this.header = this.locator.getService('rendererFactory').getRenderer(RenderType.Header);
        _super.prototype.renderTable.call(this);
        this.virtualEle.table = this.getTable();
        this.virtualEle.content = this.content = this.getPanel().firstChild;
        this.virtualEle.renderWrapper();
        this.virtualEle.renderPlaceHolder();
        this.virtualEle.wrapper.style.position = 'absolute';
        var debounceEvent = (this.parent.dataSource instanceof DataManager && !this.parent.dataSource.dataSource.offline);
        var opt = {
            container: this.content, pageHeight: this.getBlockHeight() * 2, debounceEvent: debounceEvent,
            axes: this.parent.enableColumnVirtualization ? ['X', 'Y'] : ['Y']
        };
        this.observer = new InterSectionObserver(this.virtualEle.wrapper, opt);
    };
    VirtualContentRenderer.prototype.renderEmpty = function (tbody) {
        this.getTable().appendChild(tbody);
        this.virtualEle.adjustTable(0, 0);
    };
    VirtualContentRenderer.prototype.scrollListener = function (scrollArgs) {
        if (this.preventEvent || this.parent.isDestroyed) {
            this.preventEvent = false;
            return;
        }
        this.isFocused = this.content === closest(document.activeElement, '.e-content') || this.content === document.activeElement;
        var info = scrollArgs.sentinel;
        var viewInfo = this.getInfoFromView(scrollArgs.direction, info, scrollArgs.offset);
        if (this.prevInfo && ((info.axis === 'Y' && this.prevInfo.blockIndexes.toString() === viewInfo.blockIndexes.toString())
            || (info.axis === 'X' && this.prevInfo.columnIndexes.toString() === viewInfo.columnIndexes.toString()))) {
            return;
        }
        this.parent.setColumnIndexesInView(this.parent.enableColumnVirtualization ? viewInfo.columnIndexes : []);
        this.parent.pageSettings.currentPage = viewInfo.loadNext && !viewInfo.loadSelf ? viewInfo.nextInfo.page : viewInfo.page;
        this.parent.notify(viewInfo.event, { requestType: 'virtualscroll', virtualInfo: viewInfo });
    };
    VirtualContentRenderer.prototype.block = function (blk) {
        return this.vgenerator.isBlockAvailable(blk);
    };
    VirtualContentRenderer.prototype.getInfoFromView = function (direction, info, e) {
        var tempBlocks = [];
        var infoType = { direction: direction, sentinelInfo: info, offsets: e };
        infoType.page = this.getPageFromTop(e.top, infoType);
        infoType.blockIndexes = tempBlocks = this.vgenerator.getBlockIndexes(infoType.page);
        infoType.loadSelf = !this.vgenerator.isBlockAvailable(tempBlocks[infoType.block]);
        var blocks = this.ensureBlocks(infoType);
        infoType.blockIndexes = blocks;
        infoType.loadNext = !blocks.filter(function (val) { return tempBlocks.indexOf(val) === -1; })
            .every(this.block.bind(this));
        infoType.event = (infoType.loadNext || infoType.loadSelf) ? modelChanged : refreshVirtualBlock;
        infoType.nextInfo = infoType.loadNext ? { page: Math.max(1, infoType.page + (direction === 'down' ? 1 : -1)) } : {};
        infoType.columnIndexes = info.axis === 'X' ? this.vgenerator.getColumnIndexes() : this.parent.getColumnIndexesInView();
        if (this.parent.enableColumnVirtualization && info.axis === 'X') {
            infoType.event = refreshVirtualBlock;
        }
        return infoType;
    };
    VirtualContentRenderer.prototype.ensureBlocks = function (info) {
        var _this = this;
        var index = info.blockIndexes[info.block];
        var mIdx;
        var old = index;
        var max = Math.max;
        var indexes = info.direction === 'down' ? [max(index, 1), ++index, ++index] : [max(index - 1, 1), index, index + 1];
        indexes = indexes.filter(function (val, ind) { return indexes.indexOf(val) === ind; });
        if (this.prevInfo.blockIndexes.toString() === indexes.toString()) {
            return indexes;
        }
        if (info.loadSelf || (info.direction === 'down' && this.isEndBlock(old))) {
            indexes = this.vgenerator.getBlockIndexes(info.page);
        }
        indexes.some(function (val, ind) {
            var result = val === _this.getTotalBlocks();
            if (result) {
                mIdx = ind;
            }
            return result;
        });
        if (mIdx !== undefined) {
            indexes = indexes.slice(0, mIdx + 1);
            if (info.block === 0 && indexes.length === 1 && this.vgenerator.isBlockAvailable(indexes[0] - 1)) {
                indexes = [indexes[0] - 1, indexes[0]];
            }
        }
        return indexes;
    };
    VirtualContentRenderer.prototype.appendContent = function (target, newChild, e) {
        var info = e.virtualInfo;
        this.prevInfo = this.prevInfo || e.virtualInfo;
        var cBlock = (info.columnIndexes[0]) - 1;
        var cOffset = this.getColumnOffset(cBlock);
        var width;
        var blocks = info.blockIndexes;
        if (this.parent.groupSettings.columns.length) {
            this.refreshOffsets();
        }
        var translate = this.getTranslateY(this.content.scrollTop, this.content.getBoundingClientRect().height, info);
        this.virtualEle.adjustTable(cOffset, translate);
        if (this.parent.enableColumnVirtualization) {
            this.header.virtualEle.adjustTable(cOffset, 0);
        }
        if (this.parent.enableColumnVirtualization) {
            var cIndex = info.columnIndexes;
            width = this.getColumnOffset(cIndex[cIndex.length - 1]) - this.getColumnOffset(cIndex[0] - 1) + '';
            this.header.virtualEle.setWrapperWidth(width);
        }
        this.virtualEle.setWrapperWidth(width, this.parent.enableColumnVirtualization || Browser.isIE);
        target.appendChild(newChild);
        this.getTable().appendChild(target);
        if (this.parent.groupSettings.columns.length) {
            if (info.direction === 'up') {
                var blk = this.offsets[this.getTotalBlocks()] - this.prevHeight;
                this.preventEvent = true;
                var sTop = this.content.scrollTop;
                this.content.scrollTop = sTop + blk;
            }
            this.setVirtualHeight();
            this.observer.setPageHeight(this.getOffset(blocks[blocks.length - 1]) - this.getOffset(blocks[0] - 1));
        }
        this.prevInfo = info;
        if (this.isFocused) {
            this.content.focus();
        }
    };
    VirtualContentRenderer.prototype.onDataReady = function (e) {
        if (!isNullOrUndefined(e.count)) {
            this.count = e.count;
            this.maxPage = Math.ceil(e.count / this.parent.pageSettings.pageSize);
        }
        this.refreshOffsets();
        this.setVirtualHeight();
        this.resetScrollPosition(e.requestType);
    };
    VirtualContentRenderer.prototype.setVirtualHeight = function () {
        var width = this.parent.enableColumnVirtualization ?
            this.getColumnOffset(this.parent.columns.length + this.parent.groupSettings.columns.length - 1) + 'px' : '100%';
        this.virtualEle.setVirtualHeight(this.offsets[this.getTotalBlocks()], width);
        if (this.parent.enableColumnVirtualization) {
            this.header.virtualEle.setVirtualHeight(1, width);
        }
    };
    VirtualContentRenderer.prototype.getPageFromTop = function (sTop, info) {
        var _this = this;
        var total = this.getTotalBlocks();
        var page = 0;
        var extra = this.offsets[total] - this.prevHeight;
        this.offsetKeys.some(function (offset) {
            var iOffset = Number(offset);
            var border = sTop < _this.offsets[offset] || (iOffset === total && sTop > _this.offsets[offset]);
            if (border) {
                info.block = iOffset % 2 === 0 ? 1 : 0;
                page = Math.max(1, Math.min(_this.vgenerator.getPage(iOffset), _this.maxPage));
            }
            return border;
        });
        return page;
    };
    VirtualContentRenderer.prototype.getTranslateY = function (sTop, cHeight, info) {
        if (info === undefined) {
            info = { page: this.getPageFromTop(sTop, {}) };
            info.blockIndexes = this.vgenerator.getBlockIndexes(info.page);
        }
        var block = (info.blockIndexes[0] || 1) - 1;
        var translate = this.getOffset(block);
        var endTranslate = this.getOffset(info.blockIndexes[info.blockIndexes.length - 1]);
        return translate > sTop ? this.getOffset(block - 1) : endTranslate < (sTop + cHeight) ? this.getOffset(block + 1) : translate;
    };
    VirtualContentRenderer.prototype.getOffset = function (block) {
        return Math.min(this.offsets[block] | 0, this.offsets[this.maxBlock]);
    };
    VirtualContentRenderer.prototype.onEntered = function () {
        var _this = this;
        return function (element, current, direction, e) {
            var xAxis = current.axis === 'X';
            var top = _this.prevInfo.offsets ? _this.prevInfo.offsets.top : null;
            var height = _this.content.getBoundingClientRect().height;
            var x = _this.getColumnOffset(xAxis ? _this.vgenerator.getColumnIndexes()[0] - 1 : _this.prevInfo.columnIndexes[0] - 1);
            var y = _this.getTranslateY(e.top, height, xAxis && top === e.top ? _this.prevInfo : undefined);
            _this.virtualEle.adjustTable(x, Math.min(y, _this.offsets[_this.maxBlock]));
            if (_this.parent.enableColumnVirtualization) {
                _this.header.virtualEle.adjustTable(x, 0);
            }
        };
    };
    VirtualContentRenderer.prototype.eventListener = function (action) {
        var _this = this;
        this.parent[action](dataReady, this.onDataReady, this);
        this.parent[action](refreshVirtualBlock, this.refreshContentRows, this);
        this.actions.forEach(function (event) { return _this.parent[action](event + "-begin", _this.onActionBegin, _this); });
        var fn = function () {
            _this.observer.observe(function (scrollArgs) { return _this.scrollListener(scrollArgs); }, _this.onEntered());
            _this.parent.off(contentReady, fn);
        };
        this.parent.on(contentReady, fn, this);
    };
    VirtualContentRenderer.prototype.getBlockSize = function () {
        return this.parent.pageSettings.pageSize >> 1;
    };
    VirtualContentRenderer.prototype.getBlockHeight = function () {
        return this.getBlockSize() * getRowHeight();
    };
    VirtualContentRenderer.prototype.isEndBlock = function (index) {
        var totalBlocks = this.getTotalBlocks();
        return index >= totalBlocks || index === totalBlocks - 1;
    };
    VirtualContentRenderer.prototype.getTotalBlocks = function () {
        return Math.ceil(this.count / this.getBlockSize());
    };
    VirtualContentRenderer.prototype.getColumnOffset = function (block) {
        return this.vgenerator.cOffsets[block] | 0;
    };
    VirtualContentRenderer.prototype.getModelGenerator = function () {
        return new VirtualRowModelGenerator(this.parent);
    };
    VirtualContentRenderer.prototype.resetScrollPosition = function (action) {
        if (this.actions.some(function (value) { return value === action; })) {
            this.preventEvent = this.content.scrollTop !== 0;
            this.content.scrollTop = 0;
        }
    };
    VirtualContentRenderer.prototype.onActionBegin = function (e) {
        this.parent.setProperties({ pageSettings: { currentPage: 1 } }, true);
    };
    VirtualContentRenderer.prototype.getRows = function () {
        return this.vgenerator.getRows();
    };
    VirtualContentRenderer.prototype.getRowByIndex = function (index) {
        var prev = this.prevInfo.blockIndexes;
        var startIdx = (prev[0] - 1) * this.getBlockSize();
        return this.parent.getDataRows()[index - startIdx];
    };
    VirtualContentRenderer.prototype.refreshOffsets = function () {
        var _this = this;
        var row = 0;
        var bSize = this.getBlockSize();
        var total = this.getTotalBlocks();
        this.prevHeight = this.offsets[total];
        this.maxBlock = total % 2 === 0 ? total - 2 : total - 1;
        this.offsets = {};
        Array.apply(null, Array(total)).map(function () { return ++row; })
            .forEach(function (block) {
            var tmp = (_this.vgenerator.cache[block] || []).length;
            var rem = _this.count % bSize;
            var size = block in _this.vgenerator.cache ?
                tmp * getRowHeight() : rem && block === total ? rem * getRowHeight() : _this.getBlockHeight();
            _this.offsets[block] = (_this.offsets[block - 1] | 0) + size;
            _this.tmpOffsets[block] = _this.offsets[block - 1] | 0;
        });
        this.offsetKeys = Object.keys(this.offsets);
        if (this.parent.enableColumnVirtualization) {
            this.vgenerator.refreshColOffsets();
        }
    };
    VirtualContentRenderer.prototype.refreshVirtualElement = function () {
        this.vgenerator.refreshColOffsets();
        this.setVirtualHeight();
    };
    return VirtualContentRenderer;
}(ContentRender));
export { VirtualContentRenderer };
var VirtualHeaderRenderer = (function (_super) {
    __extends(VirtualHeaderRenderer, _super);
    function VirtualHeaderRenderer(parent, locator) {
        var _this = _super.call(this, parent, locator) || this;
        _this.virtualEle = new VirtualElementHandler();
        _this.gen = new VirtualRowModelGenerator(_this.parent);
        _this.parent.on(refreshVirtualBlock, function (e) { return e.virtualInfo.sentinelInfo.axis === 'X' ? _this.refreshUI() : null; }, _this);
        return _this;
    }
    VirtualHeaderRenderer.prototype.renderTable = function () {
        this.gen.refreshColOffsets();
        this.parent.setColumnIndexesInView(this.gen.getColumnIndexes(this.getPanel().firstChild));
        _super.prototype.renderTable.call(this);
        this.virtualEle.table = this.getTable();
        this.virtualEle.content = this.getPanel().firstChild;
        this.virtualEle.content.style.position = 'relative';
        this.virtualEle.renderWrapper();
        this.virtualEle.renderPlaceHolder('absolute');
    };
    VirtualHeaderRenderer.prototype.appendContent = function (table) {
        this.virtualEle.wrapper.appendChild(table);
    };
    VirtualHeaderRenderer.prototype.refreshUI = function () {
        this.gen.refreshColOffsets();
        this.parent.setColumnIndexesInView(this.gen.getColumnIndexes(this.getPanel().firstChild));
        _super.prototype.refreshUI.call(this);
    };
    return VirtualHeaderRenderer;
}(HeaderRender));
export { VirtualHeaderRenderer };
var VirtualElementHandler = (function () {
    function VirtualElementHandler() {
    }
    VirtualElementHandler.prototype.renderWrapper = function () {
        this.wrapper = createElement('div', { className: 'e-virtualtable' });
        this.wrapper.appendChild(this.table);
        this.content.appendChild(this.wrapper);
    };
    VirtualElementHandler.prototype.renderPlaceHolder = function (position) {
        if (position === void 0) { position = 'relative'; }
        this.placeholder = createElement('div', { className: 'e-virtualtrack', styles: "position:" + position });
        this.content.appendChild(this.placeholder);
    };
    VirtualElementHandler.prototype.adjustTable = function (xValue, yValue) {
        this.wrapper.style.transform = "translate(" + xValue + "px, " + yValue + "px)";
    };
    VirtualElementHandler.prototype.setWrapperWidth = function (width, full) {
        this.wrapper.style.width = width ? width + "px" : full ? '100%' : '';
    };
    VirtualElementHandler.prototype.setVirtualHeight = function (height, width) {
        this.placeholder.style.height = height + "px";
        this.placeholder.style.width = width;
    };
    return VirtualElementHandler;
}());
export { VirtualElementHandler };
