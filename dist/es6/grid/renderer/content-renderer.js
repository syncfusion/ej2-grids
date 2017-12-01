import { Droppable, Browser } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { createElement, setStyleAttribute, remove } from '@syncfusion/ej2-base';
import { getUpdateUsingRaf } from '../base/util';
import * as events from '../base/constant';
import { RowRenderer } from './row-renderer';
import { CellMergeRender } from './cell-merge-renderer';
import { RowModelGenerator } from '../services/row-model-generator';
import { GroupModelGenerator } from '../services/group-model-generator';
import { getScrollBarWidth } from '../base/util';
/**
 * Content module is used to render grid content
 * @hidden
 */
var ContentRender = /** @class */ (function () {
    /**
     * Constructor for content renderer module
     */
    function ContentRender(parent, serviceLocator) {
        var _this = this;
        this.rows = [];
        this.isLoaded = true;
        this.drop = function (e) {
            _this.parent.notify(events.columnDrop, { target: e.target, droppedElement: e.droppedElement });
            remove(e.droppedElement);
        };
        this.rafCallback = function (args) { return function () {
            _this.ariaService.setBusy(_this.getPanel().firstChild, false);
            if (_this.parent.isDestroyed) {
                return;
            }
            _this.parent.notify(events.contentReady, { rows: _this.rows, args: args });
            if (_this.isLoaded) {
                _this.parent.trigger(events.dataBound, {});
                if (_this.parent.allowTextWrap) {
                    _this.parent.notify(events.freezeRender, { case: 'textwrap' });
                }
            }
            if (args) {
                var action = (args.requestType || '').toLowerCase() + '-complete';
                _this.parent.notify(action, args);
            }
            _this.parent.hideSpinner();
        }; };
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.ariaService = this.serviceLocator.getService('ariaService');
        this.generator = this.getModelGenerator();
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
        this.parent.on(events.colGroupRefresh, this.colGroupRefresh, this);
    }
    /**
     * The function is used to render grid content div
     */
    ContentRender.prototype.renderPanel = function () {
        var gObj = this.parent;
        var div = createElement('div', { className: 'e-gridcontent' });
        var innerDiv = createElement('div', {
            className: 'e-content'
        });
        if (!Browser.isDevice) {
            innerDiv.setAttribute('tabindex', '0');
        }
        this.ariaService.setOptions(innerDiv, { busy: false });
        div.appendChild(innerDiv);
        this.setPanel(div);
        gObj.element.appendChild(div);
    };
    /**
     * The function is used to render grid content table
     */
    ContentRender.prototype.renderTable = function () {
        var contentDiv = this.getPanel();
        contentDiv.appendChild(this.createContentTable());
        this.setTable(contentDiv.querySelector('.e-table'));
        this.ariaService.setOptions(this.getTable(), {
            multiselectable: this.parent.selectionSettings.type === 'multiple'
        });
        this.initializeContentDrop();
    };
    /**
     * The function is used to create content table elements
     * @return {Element}
     * @hidden
     */
    ContentRender.prototype.createContentTable = function () {
        var innerDiv = this.getPanel().firstChild;
        var table = createElement('table', {
            className: 'e-table', attrs: {
                cellspacing: '0.25px', role: 'grid',
                id: this.parent.element.id + '_content_table'
            }
        });
        this.setColGroup(this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').cloneNode(true));
        table.appendChild(this.getColGroup());
        table.appendChild(createElement('tbody'));
        innerDiv.appendChild(table);
        return innerDiv;
    };
    /**
     * Refresh the content of the Grid.
     * @return {void}
     */
    ContentRender.prototype.refreshContentRows = function (args) {
        var _this = this;
        if (args === void 0) { args = {}; }
        var gObj = this.parent;
        if (gObj.currentViewData.length === 0) {
            return;
        }
        var dataSource = gObj.currentViewData;
        var frag = document.createDocumentFragment();
        var hdrfrag = document.createDocumentFragment();
        var columns = gObj.getColumns();
        var tr;
        var tbody;
        var hdrTbody;
        var row = new RowRenderer(this.serviceLocator, null, this.parent);
        this.rowElements = [];
        this.rows = [];
        var modelData = this.generator.generateRows(dataSource, args);
        var idx = modelData[0].cells[0].index;
        var fCont = this.getPanel().querySelector('.e-frozencontent');
        var mCont = this.getPanel().querySelector('.e-movablecontent');
        var cont = this.getPanel().querySelector('.e-content');
        if (this.parent.enableColumnVirtualization) {
            var cellMerge = new CellMergeRender(this.serviceLocator, this.parent);
            cellMerge.updateVirtualCells(modelData);
        }
        if (this.parent.frozenColumns && idx >= this.parent.frozenColumns) {
            tbody = mCont.querySelector('tbody');
        }
        else {
            tbody = this.getTable().querySelector('tbody');
        }
        for (var i = 0, len = modelData.length; i < len; i++) {
            if (!gObj.rowTemplate) {
                tr = row.render(modelData[i], columns);
            }
            else {
                var elements = gObj.getRowTemplate()(extend({ index: i }, dataSource[i]), gObj, 'rowTemplate');
                for (var j = 0; j < elements.length; j++) {
                    var isTR = elements[j].nodeName.toLowerCase() === 'tr';
                    if (isTR || (elements[j].querySelectorAll && elements[j].querySelectorAll('tr').length)) {
                        tr = isTR ? elements[j] : elements[j].querySelector('tr');
                    }
                }
            }
            if (gObj.frozenRows && i < gObj.frozenRows) {
                hdrfrag.appendChild(tr);
            }
            else {
                frag.appendChild(tr);
            }
            this.rows.push(modelData[i]);
            if (modelData[i].isDataRow) {
                //detailrowvisible 
                var td = tr.querySelectorAll('.e-rowcell:not(.e-hide)')[0];
                if (td) {
                    td.classList.add('e-detailrowvisible');
                }
                this.rowElements.push(tr);
            }
            this.ariaService.setOptions(this.getTable(), { colcount: gObj.getColumns().length.toString() });
        }
        if (gObj.frozenRows) {
            hdrTbody = gObj.frozenColumns ? gObj.getHeaderContent().querySelector(idx === 0 ? '.e-frozenheader'
                : '.e-movableheader').querySelector('tbody') : gObj.getHeaderTable().querySelector('tbody');
            hdrTbody.innerHTML = '';
            hdrTbody.appendChild(hdrfrag);
        }
        if (gObj.frozenRows && idx === 0 && cont.offsetHeight === Number(gObj.height)) {
            cont.style.height = (cont.offsetHeight - hdrTbody.offsetHeight) + 'px';
        }
        if (gObj.frozenColumns && idx === 0) {
            this.getPanel().firstChild.style.overflowY = 'hidden';
        }
        this.args = args;
        getUpdateUsingRaf(function () {
            remove(tbody);
            tbody = createElement('tbody');
            if (gObj.frozenColumns) {
                tbody.appendChild(frag);
                if (idx === 0) {
                    _this.isLoaded = false;
                    fCont.querySelector('table').appendChild(tbody);
                }
                else {
                    if (tbody.childElementCount < 1) {
                        tbody.appendChild(createElement('tr').appendChild(createElement('td')));
                    }
                    _this.isLoaded = true;
                    mCont.querySelector('table').appendChild(tbody);
                    fCont.style.height = ((mCont.offsetHeight) - getScrollBarWidth()) + 'px';
                    mCont.style.overflow = 'scroll';
                }
            }
            else {
                _this.appendContent(tbody, frag, args);
            }
            if (gObj.frozenColumns && idx === 0) {
                _this.refreshContentRows(args);
            }
        }, this.rafCallback(args));
    };
    ContentRender.prototype.appendContent = function (tbody, frag, args) {
        tbody.appendChild(frag);
        this.getTable().appendChild(tbody);
    };
    /**
     * Get the content div element of grid
     * @return {Element}
     */
    ContentRender.prototype.getPanel = function () {
        return this.contentPanel;
    };
    /**
     * Set the content div element of grid
     * @param  {Element} panel
     */
    ContentRender.prototype.setPanel = function (panel) {
        this.contentPanel = panel;
    };
    /**
     * Get the content table element of grid
     * @return {Element}
     */
    ContentRender.prototype.getTable = function () {
        return this.contentTable;
    };
    /**
     * Set the content table element of grid
     * @param  {Element} table
     */
    ContentRender.prototype.setTable = function (table) {
        this.contentTable = table;
    };
    /**
     * Get the Row collection in the Grid.
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>}
     */
    ContentRender.prototype.getRows = function () {
        return this.rows;
    };
    /**
     * Get the content table data row elements
     * @return {Element}
     */
    ContentRender.prototype.getRowElements = function () {
        return this.rowElements;
    };
    /**
     * Get the content table data row elements
     * @return {Element}
     */
    ContentRender.prototype.setRowElements = function (elements) {
        this.rowElements = elements;
    };
    /**
     * Get the header colgroup element
     * @returns {Element}
     */
    ContentRender.prototype.getColGroup = function () {
        return this.colgroup;
    };
    /**
     * Set the header colgroup element
     * @param {Element} colgroup
     * @returns {Element}
     */
    ContentRender.prototype.setColGroup = function (colGroup) {
        return this.colgroup = colGroup;
    };
    /**
     * Function to hide content table column based on visible property
     * @param  {Column[]} columns?
     */
    ContentRender.prototype.setVisible = function (columns) {
        var rows = this.getRows();
        var element;
        var testRow;
        rows.some(function (r) { if (r.isDataRow) {
            testRow = r;
        } return r.isDataRow; });
        var tasks = [];
        for (var c = 0, clen = columns.length; c < clen; c++) {
            var column = columns[c];
            var idx = this.parent.getNormalizedColumnIndex(column.uid);
            //used canSkip method to skip unwanted visible toggle operation. 
            if (this.canSkip(column, testRow, idx)) {
                continue;
            }
            var displayVal = column.visible === true ? '' : 'none';
            setStyleAttribute(this.getColGroup().childNodes[idx], { 'display': displayVal });
        }
        this.refreshContentRows({ requestType: 'refresh' });
    };
    ContentRender.prototype.colGroupRefresh = function () {
        if (this.getColGroup()) {
            var colGroup = this.getColGroup();
            colGroup.innerHTML = this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').innerHTML;
            this.setColGroup(colGroup);
        }
    };
    ContentRender.prototype.initializeContentDrop = function () {
        var gObj = this.parent;
        var drop = new Droppable(gObj.getContent(), {
            accept: '.e-dragclone',
            drop: this.drop
        });
    };
    ContentRender.prototype.canSkip = function (column, row, index) {
        /**
         * Skip the toggle visiblity operation when one of the following success
         * 1. Grid has empty records
         * 2. column visible property is unchanged
         * 3. cell`s isVisible property is same as column`s visible property.
         */
        return isNullOrUndefined(row) || //(1)
            isNullOrUndefined(column.visible) || //(2)    
            row.cells[index].visible === column.visible; //(3)
    };
    ContentRender.prototype.getModelGenerator = function () {
        return this.generator = this.parent.allowGrouping ? new GroupModelGenerator(this.parent) : new RowModelGenerator(this.parent);
    };
    ContentRender.prototype.renderEmpty = function (tbody) {
        this.getTable().appendChild(tbody);
    };
    ContentRender.prototype.setSelection = function (uid, set, clearAll) {
        this.getRows().filter(function (row) { return clearAll || uid === row.uid; })
            .forEach(function (row) { return row.isSelected = set; });
    };
    ContentRender.prototype.getRowByIndex = function (index) {
        return this.parent.getDataRows()[index];
    };
    return ContentRender;
}());
export { ContentRender };
