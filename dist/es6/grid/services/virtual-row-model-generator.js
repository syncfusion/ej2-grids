import { Browser } from '@syncfusion/ej2-base';
import { RowModelGenerator } from '../services/row-model-generator';
import { GroupModelGenerator } from '../services/group-model-generator';
/**
 * Content module is used to render grid content
 */
var VirtualRowModelGenerator = /** @class */ (function () {
    function VirtualRowModelGenerator(parent) {
        this.cOffsets = {};
        this.cache = {};
        this.data = {};
        this.groups = {};
        this.parent = parent;
        this.model = this.parent.pageSettings;
        this.rowModelGenerator = this.parent.allowGrouping ? new GroupModelGenerator(this.parent) : new RowModelGenerator(this.parent);
    }
    VirtualRowModelGenerator.prototype.generateRows = function (data, notifyArgs) {
        var _this = this;
        var info = notifyArgs.virtualInfo = notifyArgs.virtualInfo || this.getData();
        var xAxis = info.sentinelInfo && info.sentinelInfo.axis === 'X';
        var page = !xAxis && info.loadNext && !info.loadSelf ? info.nextInfo.page : info.page;
        var result = [];
        var center = ~~(this.model.pageSize / 2);
        var indexes = this.getBlockIndexes(page);
        var loadedBlocks = [];
        this.checkAndResetCache(notifyArgs.requestType);
        if (this.parent.enableColumnVirtualization) {
            info.blockIndexes.forEach(function (value) {
                if (_this.isBlockAvailable(value)) {
                    _this.cache[value] = _this.rowModelGenerator.refreshRows(_this.cache[value]);
                }
            });
        }
        info.blockIndexes.forEach(function (value) {
            if (!_this.isBlockAvailable(value)) {
                var rows = _this.rowModelGenerator.generateRows(data, {
                    virtualInfo: info, startIndex: _this.getStartIndex(value, data)
                });
                var median = ~~Math.max(rows.length, _this.model.pageSize) / 2;
                if (!_this.isBlockAvailable(indexes[0])) {
                    _this.cache[indexes[0]] = rows.slice(0, median);
                }
                if (!_this.isBlockAvailable(indexes[1])) {
                    _this.cache[indexes[1]] = rows.slice(median);
                }
            }
            if (_this.parent.groupSettings.columns.length && !xAxis && _this.cache[value]) {
                _this.cache[value] = _this.updateGroupRow(_this.cache[value], value);
            }
            result.push.apply(result, _this.cache[value]);
            if (_this.isBlockAvailable(value)) {
                loadedBlocks.push(value);
            }
        });
        info.blockIndexes = loadedBlocks;
        return result;
    };
    VirtualRowModelGenerator.prototype.getBlockIndexes = function (page) {
        return [page + (page - 1), page * 2];
    };
    VirtualRowModelGenerator.prototype.getPage = function (block) {
        return block % 2 === 0 ? block / 2 : (block + 1) / 2;
    };
    VirtualRowModelGenerator.prototype.isBlockAvailable = function (value) {
        return value in this.cache;
    };
    VirtualRowModelGenerator.prototype.getData = function () {
        return {
            page: this.model.currentPage,
            blockIndexes: this.getBlockIndexes(this.model.currentPage),
            direction: 'down',
            columnIndexes: this.parent.getColumnIndexesInView()
        };
    };
    VirtualRowModelGenerator.prototype.getStartIndex = function (blk, data, full) {
        if (full === void 0) { full = true; }
        var page = this.getPage(blk);
        var even = blk % 2 === 0;
        var index = (page - 1) * this.model.pageSize;
        return full || !even ? index : index + ~~(this.model.pageSize / 2);
    };
    VirtualRowModelGenerator.prototype.getColumnIndexes = function (content) {
        var _this = this;
        if (content === void 0) { content = this.parent.getHeaderContent().firstChild; }
        var indexes = [];
        var sLeft = content.scrollLeft | 0;
        var keys = Object.keys(this.cOffsets);
        var cWidth = content.getBoundingClientRect().width;
        sLeft = Math.min(this.cOffsets[keys.length - 1] - cWidth, sLeft);
        var calWidth = Browser.isDevice ? 2 * cWidth : cWidth / 2;
        var left = sLeft + cWidth + (sLeft === 0 ? calWidth : 0);
        keys.some(function (offset, indx, input) {
            var iOffset = Number(offset);
            var offsetVal = _this.cOffsets[offset];
            var border = sLeft - calWidth <= offsetVal && left + calWidth >= offsetVal;
            if (border) {
                indexes.push(iOffset);
            }
            return left + calWidth < offsetVal;
        });
        return indexes;
    };
    VirtualRowModelGenerator.prototype.checkAndResetCache = function (action) {
        var clear = ['paging', 'refresh', 'sorting', 'filtering', 'searching', 'grouping', 'ungrouping']
            .some(function (value) { return action === value; });
        if (clear) {
            this.cache = {};
            this.data = {};
            this.groups = {};
        }
        return clear;
    };
    VirtualRowModelGenerator.prototype.refreshColOffsets = function () {
        var _this = this;
        var col = 0;
        this.cOffsets = {};
        var gLen = this.parent.groupSettings.columns.length;
        var cols = this.parent.columns;
        var cLen = cols.length;
        var isVisible = function (column) { return column.visible &&
            (!_this.parent.groupSettings.showGroupedColumn ? _this.parent.groupSettings.columns.indexOf(column.field) < 0 : column.visible); };
        this.parent.groupSettings.columns.forEach(function (c, n) { return _this.cOffsets[n] = (_this.cOffsets[n - 1] | 0) + 30; });
        Array.apply(null, Array(cLen)).map(function () { return col++; }).forEach(function (block, i) {
            block = block + gLen;
            _this.cOffsets[block] = (_this.cOffsets[block - 1] | 0) + (isVisible(cols[i]) ? parseInt(cols[i].width, 10) : 0);
        });
    };
    VirtualRowModelGenerator.prototype.updateGroupRow = function (current, block) {
        var _this = this;
        var currentFirst = current[0];
        var rows = [];
        Object.keys(this.cache).forEach(function (key) {
            if (Number(key) < block) {
                rows = rows.concat(_this.cache[key]);
            }
        });
        if ((currentFirst && currentFirst.isDataRow) || block % 2 === 0) {
            return current;
        }
        return this.iterateGroup(current, rows);
    };
    VirtualRowModelGenerator.prototype.iterateGroup = function (current, rows) {
        var currentFirst = current[0];
        var offset = 0;
        if (currentFirst && currentFirst.isDataRow) {
            return current;
        }
        var isPresent = current.some(function (row) {
            return rows.some(function (oRow, index) {
                var res = oRow && oRow.data.field !== undefined && oRow.data.field === row.data.field &&
                    oRow.data.key === row.data.key;
                if (res) {
                    offset = index;
                }
                return res;
            });
        });
        if (isPresent) {
            current.shift();
            current = this.iterateGroup(current, rows.slice(offset));
        }
        return current;
    };
    VirtualRowModelGenerator.prototype.getRows = function () {
        var _this = this;
        var rows = [];
        Object.keys(this.cache).forEach(function (key) { return rows = rows.concat(_this.cache[key]); });
        return rows;
    };
    return VirtualRowModelGenerator;
}());
export { VirtualRowModelGenerator };
