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
import { createElement } from '@syncfusion/ej2-base';
import { formatUnit } from '@syncfusion/ej2-base';
import { Browser } from '@syncfusion/ej2-base';
import { colGroupRefresh, columnWidthChanged, scroll, columnVisibilityChanged } from '../base/constant';
import { ContentRender } from './content-renderer';
import { RowRenderer } from './row-renderer';
import { SummaryModelGenerator } from '../services/summary-model-generator';
var FooterRenderer = (function (_super) {
    __extends(FooterRenderer, _super);
    function FooterRenderer(gridModule, serviceLocator) {
        var _this = _super.call(this, gridModule, serviceLocator) || this;
        _this.aggregates = {};
        _this.parent = gridModule;
        _this.locator = serviceLocator;
        _this.modelGenerator = new SummaryModelGenerator(_this.parent);
        _this.addEventListener();
        return _this;
    }
    FooterRenderer.prototype.renderPanel = function () {
        var div = createElement('div', { className: 'e-gridfooter' });
        var innerDiv = createElement('div', { className: 'e-summarycontent' });
        if (Browser.isDevice) {
            innerDiv.style.overflowX = 'scroll';
        }
        div.appendChild(innerDiv);
        this.setPanel(div);
        if (this.parent.getPager() != null) {
            this.parent.element.insertBefore(div, this.parent.getPager());
        }
        else {
            this.parent.element.appendChild(div);
        }
    };
    FooterRenderer.prototype.renderTable = function () {
        var contentDiv = this.getPanel();
        var innerDiv = this.createContentTable();
        var table = innerDiv.querySelector('.e-table');
        var tFoot = createElement('tfoot');
        table.appendChild(tFoot);
        this.setTable(table);
    };
    FooterRenderer.prototype.renderSummaryContent = function (e) {
        var input = this.parent.dataSource instanceof Array ? this.parent.dataSource : this.parent.currentViewData;
        var summaries = this.modelGenerator.getData();
        var dummies = this.modelGenerator.getColumns();
        var rows = this.modelGenerator.generateRows(input, e || this.aggregates);
        var fragment = document.createDocumentFragment();
        var rowrenderer = new RowRenderer(this.locator);
        rowrenderer.element = createElement('TR', { className: 'e-summaryrow' });
        for (var srow = 0, len = summaries.length; srow < len; srow++) {
            var row = rows[srow];
            if (!row) {
                continue;
            }
            var tr = rowrenderer.render(row, dummies);
            fragment.appendChild(tr);
        }
        this.getTable().tFoot.appendChild(fragment);
        this.aggregates = e;
    };
    FooterRenderer.prototype.refresh = function (e) {
        this.getTable().tFoot.innerHTML = '';
        this.renderSummaryContent(e);
        this.onScroll();
    };
    FooterRenderer.prototype.refreshCol = function () {
        var headerCol = this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').cloneNode(true);
        this.getTable().replaceChild(headerCol, this.getColGroup());
        this.setColGroup(headerCol);
    };
    FooterRenderer.prototype.onWidthChange = function (args) {
        this.getColGroup().children[args.index].style.width = formatUnit(args.width);
        if (this.parent.allowResizing) {
            this.updateFooterTableWidth(this.getTable());
        }
    };
    FooterRenderer.prototype.onScroll = function (e) {
        if (e === void 0) { e = { left: this.parent.getContent().firstChild.scrollLeft }; }
        this.getPanel().firstChild.scrollLeft = e.left;
    };
    FooterRenderer.prototype.columnVisibilityChanged = function () {
        this.refresh();
    };
    FooterRenderer.prototype.addEventListener = function () {
        this.parent.on(colGroupRefresh, this.refreshCol, this);
        this.parent.on(columnWidthChanged, this.onWidthChange, this);
        this.parent.on(scroll, this.onScroll, this);
        this.parent.on(columnVisibilityChanged, this.columnVisibilityChanged, this);
    };
    FooterRenderer.prototype.removeEventListener = function () {
        this.parent.off(colGroupRefresh, this.refreshCol);
        this.parent.off(columnWidthChanged, this.onWidthChange);
        this.parent.off(scroll, this.onScroll);
        this.parent.off(columnVisibilityChanged, this.columnVisibilityChanged);
    };
    FooterRenderer.prototype.updateFooterTableWidth = function (tFoot) {
        var tHead = this.parent.getHeaderTable();
        if (tHead && tFoot) {
            tFoot.style.width = tHead.style.width;
        }
    };
    return FooterRenderer;
}(ContentRender));
export { FooterRenderer };
