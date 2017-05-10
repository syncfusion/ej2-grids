define(["require", "exports", "@syncfusion/ej2-base", "@syncfusion/ej2-base/dom", "@syncfusion/ej2-base/util", "../../../src/grid/base/grid", "../../../src/grid/actions/sort", "../../../src/grid/actions/selection", "../../../src/grid/actions/filter", "../../../src/grid/actions/page", "../../../src/grid/actions/group", "../../../src/grid/actions/reorder", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, ej2_base_1, dom_1, util_1, grid_1, sort_1, selection_1, filter_1, page_1, group_1, reorder_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    grid_1.Grid.Inject(sort_1.Sort, page_1.Page, filter_1.Filter, group_1.Group, selection_1.Selection, reorder_1.Reorder);
    function copyObject(source, destiation) {
        for (var prop in source) {
            destiation[prop] = source[prop];
        }
        return destiation;
    }
    function getEventObject(eventType, eventName, target, x, y) {
        var tempEvent = document.createEvent(eventType);
        tempEvent.initEvent(eventName, true, true);
        var returnObject = copyObject(tempEvent, {});
        returnObject.preventDefault = function () { return true; };
        if (!util_1.isNullOrUndefined(x)) {
            returnObject.pageX = x;
            returnObject.clientX = x;
        }
        if (!util_1.isNullOrUndefined(y)) {
            returnObject.pageY = y;
            returnObject.clientY = y;
        }
        if (!util_1.isNullOrUndefined(target)) {
            returnObject.target = returnObject.srcElement = returnObject.toElement = returnObject.currentTarget = target;
        }
        return returnObject;
    }
    describe('Grouping module', function () {
        describe('Grouping', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionBegin;
            var actionComplete;
            var columns;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'EmployeeID', headerText: 'Employee ID' },
                        { field: 'Freight', headerText: 'Freight' },
                        { field: 'ShipCity', headerText: 'Ship City' },
                        { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    allowSelection: true,
                    groupSettings: { showGroupedColumn: true },
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('group drop area testing', function () {
                var dropArea = gridObj.element.querySelectorAll('.e-groupdroparea');
                expect(dropArea.length).toEqual(1);
                expect(dropArea[0].textContent).toEqual('Drag a column header here to group its column');
            });
            it('Single column group testing', function (done) {
                actionComplete = function (args) {
                    var grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
                    var content = gridObj.getContent().querySelectorAll('tr');
                    var gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
                    expect(grpHIndent.length).toEqual(1);
                    expect(grpHIndent[0].querySelector('.e-headercelldiv').classList.contains('e-emptycell')).toEqual(true);
                    expect(content[0].querySelectorAll('.e-recordplusexpand').length).toEqual(1);
                    expect(content[0].querySelectorAll('.e-recordplusexpand')[0].firstElementChild.classList.contains('e-gdiagonaldown')).toEqual(true);
                    expect(content[0].querySelectorAll('.e-groupcaption').length).toEqual(1);
                    expect(content[0].querySelectorAll('.e-groupcaption')[0].getAttribute('colspan')).toEqual('6');
                    expect(content[0].querySelectorAll('.e-groupcaption')[0].textContent).toEqual('Ship City: Albuquerque - 5 items');
                    expect(content[1].querySelectorAll('.e-indentcell').length).toEqual(1);
                    expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toEqual(6);
                    expect(gHeader.length).toEqual(1);
                    expect(gHeader[0].querySelectorAll('.e-grouptext').length).toEqual(1);
                    expect(gHeader[0].querySelectorAll('.e-grouptext')[0].textContent).toEqual('Ship City');
                    expect(gHeader[0].querySelectorAll('.e-groupsort').length).toEqual(1);
                    expect(gHeader[0].querySelectorAll('.e-groupsort')[0].classList.contains('e-ascending')).toEqual(true);
                    expect(gHeader[0].querySelectorAll('.e-ungroupbutton').length).toEqual(1);
                    expect(gridObj.groupSettings.columns.length).toEqual(1);
                    expect(gridObj.sortSettings.columns.length).toEqual(1);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.groupModule.groupColumn('ShipCity');
            });
            it('Expandcollase row shortcut testing', function () {
                gridObj.selectRow(1);
                gridObj.groupModule.keyPressHandler({ action: 'altUpArrow', preventDefault: function () { } });
                expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toEqual(13);
                gridObj.groupModule.keyPressHandler({ action: 'altUpArrow', preventDefault: function () { } });
                expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toEqual(13);
                gridObj.groupModule.keyPressHandler({ action: 'altDownArrow', preventDefault: function () { } });
                expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toEqual(18);
                gridObj.groupModule.keyPressHandler({ action: 'altDownArrow', preventDefault: function () { } });
                expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toEqual(18);
            });
            it('multi column group testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.groupSettings.columns.length).toEqual(2);
                    expect(gridObj.sortSettings.columns.length).toEqual(2);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.groupModule.groupColumn('ShipCountry');
            });
            it('multiple column group testing', function (done) {
                actionComplete = function (args) {
                    var grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
                    var content = gridObj.getContent().querySelectorAll('tr');
                    var gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
                    expect(grpHIndent.length).toEqual(3);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell').length).toEqual(3);
                    expect(content[0].querySelectorAll('.e-recordplusexpand').length).toEqual(1);
                    expect(content[0].querySelectorAll('.e-recordplusexpand')[0].cellIndex).toEqual(0);
                    expect(content[0].querySelectorAll('.e-indentcell').length).toEqual(0);
                    expect(content[0].querySelectorAll('.e-recordplusexpand')[0].firstElementChild.classList.contains('e-gdiagonaldown')).toEqual(true);
                    expect(content[1].querySelectorAll('.e-recordplusexpand').length).toEqual(1);
                    expect(content[1].querySelectorAll('.e-recordplusexpand')[0].cellIndex).toEqual(1);
                    expect(content[1].querySelectorAll('.e-indentcell').length).toEqual(1);
                    expect(content[1].querySelectorAll('.e-recordplusexpand')[0].firstElementChild.classList.contains('e-gdiagonaldown')).toEqual(true);
                    expect(content[2].querySelectorAll('.e-recordplusexpand').length).toEqual(1);
                    expect(content[2].querySelectorAll('.e-recordplusexpand')[0].cellIndex).toEqual(2);
                    expect(content[2].querySelectorAll('.e-indentcell').length).toEqual(2);
                    expect(content[2].querySelectorAll('.e-recordplusexpand')[0].firstElementChild.classList.contains('e-gdiagonaldown')).toEqual(true);
                    expect(content[0].querySelectorAll('.e-groupcaption')[0].getAttribute('colspan')).toEqual('8');
                    expect(content[1].querySelectorAll('.e-groupcaption')[0].getAttribute('colspan')).toEqual('7');
                    expect(content[2].querySelectorAll('.e-groupcaption')[0].getAttribute('colspan')).toEqual('6');
                    expect(content[0].querySelectorAll('.e-groupcaption').length).toEqual(1);
                    expect(content[1].querySelectorAll('.e-groupcaption').length).toEqual(1);
                    expect(content[2].querySelectorAll('.e-groupcaption').length).toEqual(1);
                    expect(content[0].querySelectorAll('.e-groupcaption')[0].textContent).toEqual('Ship City: Albuquerque - 1 item');
                    expect(content[1].querySelectorAll('.e-groupcaption')[0].textContent).toEqual('Ship Country: USA - 1 item');
                    expect(content[2].querySelectorAll('.e-groupcaption')[0].textContent).toEqual('CustomerID: RATTC - 5 items');
                    expect(content[3].querySelectorAll('.e-indentcell').length).toEqual(3);
                    expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toEqual(18);
                    expect(gHeader.length).toEqual(3);
                    expect(gridObj.groupSettings.columns.length).toEqual(3);
                    expect(gridObj.sortSettings.columns.length).toEqual(3);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.groupModule.groupColumn('CustomerID');
            });
            it('ungroup testing', function (done) {
                actionComplete = function (args) {
                    var grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
                    var content = gridObj.getContent().querySelectorAll('tr');
                    var gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
                    expect(grpHIndent.length).toEqual(2);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell').length).toEqual(2);
                    expect(content[0].querySelectorAll('.e-recordplusexpand').length).toEqual(1);
                    expect(content[0].querySelectorAll('.e-recordplusexpand')[0].cellIndex).toEqual(0);
                    expect(content[0].querySelectorAll('.e-indentcell').length).toEqual(0);
                    expect(content[0].querySelectorAll('.e-recordplusexpand')[0].firstElementChild.classList.contains('e-gdiagonaldown')).toEqual(true);
                    expect(content[1].querySelectorAll('.e-recordplusexpand').length).toEqual(1);
                    expect(content[1].querySelectorAll('.e-recordplusexpand')[0].cellIndex).toEqual(1);
                    expect(content[1].querySelectorAll('.e-indentcell').length).toEqual(1);
                    expect(content[1].querySelectorAll('.e-recordplusexpand')[0].firstElementChild.classList.contains('e-gdiagonaldown')).toEqual(true);
                    expect(content[0].querySelectorAll('.e-groupcaption')[0].getAttribute('colspan')).toEqual('7');
                    expect(content[1].querySelectorAll('.e-groupcaption')[0].getAttribute('colspan')).toEqual('6');
                    expect(content[0].querySelectorAll('.e-groupcaption').length).toEqual(1);
                    expect(content[1].querySelectorAll('.e-groupcaption').length).toEqual(1);
                    expect(content[0].querySelectorAll('.e-groupcaption')[0].textContent).toEqual('Ship City: Albuquerque - 1 item');
                    expect(content[1].querySelectorAll('.e-groupcaption')[0].textContent).toEqual('CustomerID: RATTC - 5 items');
                    expect(content[2].querySelectorAll('.e-indentcell').length).toEqual(2);
                    expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toEqual(12);
                    expect(gHeader.length).toEqual(2);
                    expect(gridObj.groupSettings.columns.length).toEqual(2);
                    expect(gridObj.sortSettings.columns.length).toEqual(2);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.groupModule.ungroupColumn('ShipCountry');
            });
            it('Sort column with sorting disabled testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelector('.e-groupdroparea').querySelectorAll('.e-descending').length).toEqual(0);
                    expect(gridObj.element.querySelector('.e-groupdroparea').querySelectorAll('.e-ascending').length).toEqual(2);
                    expect(gridObj.sortSettings.columns[0].direction).toEqual('ascending');
                    expect(gridObj.sortSettings.columns[1].direction).toEqual('ascending');
                    expect(gridObj.getColumnHeaderByField('CustomerID').querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(gridObj.getColumnHeaderByField('ShipCity').querySelectorAll('.e-ascending').length).toEqual(1);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                var grpHCell = gridObj.element.querySelectorAll('.e-groupheadercell');
                grpHCell[0].click();
                grpHCell[1].click();
                gridObj.allowSorting = true;
                gridObj.dataBind();
            });
            it('Sort column with sorting enable testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelector('.e-groupdroparea').querySelectorAll('.e-descending').length).toEqual(1);
                    expect(gridObj.element.querySelector('.e-groupdroparea').querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(gridObj.sortSettings.columns[0].direction).toEqual('descending');
                    expect(gridObj.getColumnHeaderByField('ShipCity').querySelectorAll('.e-descending').length).toEqual(1);
                    done();
                };
                var grpHCell = gridObj.element.querySelectorAll('.e-groupheadercell');
                gridObj.actionComplete = actionComplete;
                grpHCell[0].click();
            });
            it('Sort column with sorting enable testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelector('.e-groupdroparea').querySelectorAll('.e-descending').length).toEqual(2);
                    expect(gridObj.element.querySelector('.e-groupdroparea').querySelectorAll('.e-ascending').length).toEqual(0);
                    expect(gridObj.sortSettings.columns[1].direction).toEqual('descending');
                    expect(gridObj.getColumnHeaderByField('CustomerID').querySelectorAll('.e-descending').length).toEqual(1);
                    done();
                };
                var grpHCell = gridObj.element.querySelectorAll('.e-groupheadercell');
                gridObj.actionComplete = actionComplete;
                grpHCell[1].click();
            });
            it('ungroup from button click testing', function (done) {
                actionComplete = function (args) {
                    var grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
                    var gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
                    expect(grpHIndent.length).toEqual(1);
                    expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toEqual(8);
                    expect(gHeader.length).toEqual(1);
                    expect(gridObj.groupSettings.columns.length).toEqual(1);
                    expect(gridObj.sortSettings.columns.length).toEqual(2);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.element.getElementsByClassName('e-groupheadercell')[0].querySelector('.e-ungroupbutton').click();
            });
            it('ungroup from drag and drop testing', function (done) {
                actionComplete = function (args) {
                    var grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
                    var gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
                    expect(grpHIndent.length).toEqual(0);
                    expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toEqual(0);
                    expect(gHeader.length).toEqual(0);
                    expect(gridObj.groupSettings.columns.length).toEqual(0);
                    expect(gridObj.sortSettings.columns.length).toEqual(2);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                var gHeaders = gridObj.element.querySelectorAll('.e-groupheadercell');
                var mousedown = getEventObject('MouseEvents', 'mousedown', gHeaders[0], 10, 10);
                ej2_base_1.EventHandler.trigger(gridObj.element.querySelector('.e-groupdroparea'), 'mousedown', mousedown);
                var mousemove = getEventObject('MouseEvents', 'mousemove', gHeaders[0]);
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element.querySelector('.e-cloneproperties');
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.getContent().querySelectorAll('.e-rowcell')[1];
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                var mouseup = getEventObject('MouseEvents', 'mouseup', gridObj.getContent().querySelectorAll('.e-rowcell')[1], 198, 198);
                ej2_base_1.EventHandler.trigger((document), 'mouseup', mouseup);
            });
            it('group from drag and drop testing', function (done) {
                actionComplete = function (args) {
                    var grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
                    var gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
                    expect(grpHIndent.length).toEqual(1);
                    expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toEqual(8);
                    expect(gHeader.length).toEqual(1);
                    expect(gridObj.groupSettings.columns.length).toEqual(1);
                    expect(gridObj.sortSettings.columns.length).toEqual(2);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                var gHeaders = gridObj.element.querySelectorAll('.e-groupheadercell');
                var headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                var mousedown = getEventObject('MouseEvents', 'mousedown', headers[1].querySelector('.e-headercelldiv'), 20, 40);
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent().querySelector('.e-columnheader'), 'mousedown', mousedown);
                var mousemove = getEventObject('MouseEvents', 'mousemove', headers[1]);
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element.querySelector('.e-cloneproperties');
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element.querySelector('.e-groupdroparea');
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                var mouseup = getEventObject('MouseEvents', 'mouseup', gridObj.element.querySelector('.e-groupdroparea'), 10, 13);
                ej2_base_1.EventHandler.trigger((document), 'mouseup', mouseup);
            });
            it('collapseAll method testing', function () {
                var expandElem = gridObj.getContent().querySelectorAll('.e-recordplusexpand');
                gridObj.groupModule.expandCollapseRows(expandElem[1]);
                gridObj.groupModule.expandCollapseRows(expandElem[0]);
                gridObj.groupModule.collapseAll();
                expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toEqual(8);
            });
            it('expandAll method testing', function () {
                gridObj.groupModule.expandAll();
                expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toEqual(20);
            });
            it('collapseAll shortcut testing', function () {
                var expandElem = gridObj.getContent().querySelectorAll('.e-recordplusexpand');
                gridObj.groupModule.expandCollapseRows(expandElem[1]);
                gridObj.groupModule.expandCollapseRows(expandElem[0]);
                gridObj.groupModule.keyPressHandler({ action: 'ctrlUpArrow', preventDefault: function () { } });
                expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toEqual(8);
            });
            it('expandAll shortcut testing', function () {
                gridObj.groupModule.keyPressHandler({ action: 'ctrlDownArrow', preventDefault: function () { } });
                expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toEqual(20);
            });
            it('multi column group testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.groupSettings.columns.length).toEqual(2);
                    expect(gridObj.sortSettings.columns.length).toEqual(2);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.groupModule.groupColumn('ShipCity');
            });
            it('expandcollapse rows method testing', function () {
                var expandElem = gridObj.getContent().querySelectorAll('.e-recordplusexpand');
                gridObj.groupModule.expandCollapseRows(expandElem[1]);
                expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toEqual(28);
                gridObj.groupModule.expandCollapseRows(expandElem[0]);
                expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toEqual(27);
                gridObj.groupModule.expandCollapseRows(expandElem[0]);
                expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toEqual(28);
                gridObj.groupModule.expandCollapseRows(expandElem[1]);
                expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toEqual(30);
                gridObj.groupModule.expandCollapseRows(expandElem[2]);
                expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toEqual(27);
                gridObj.groupModule.expandCollapseRows(expandElem[2]);
                expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toEqual(30);
            });
            it('group destroy testing', function () {
                gridObj.element.appendChild(dom_1.createElement('div', { className: 'e-cloneproperties' }));
                gridObj.groupModule.drag({ target: gridObj.element.querySelector('.e-groupdroparea') });
                gridObj.groupModule.drag({ target: gridObj.element });
                gridObj.groupModule.groupColumn('');
                gridObj.groupModule.ungroupColumn('');
                gridObj.groupModule.headerDrop({ uid: gridObj.getColumnByField('ShipCountry').uid });
                gridObj.allowGrouping = false;
                gridObj.dataBind();
                gridObj.allowGrouping = true;
                gridObj.dataBind();
                gridObj.isDestroyed = true;
                gridObj.groupModule.addEventListener();
                gridObj.groupModule.onPropertyChanged({ module: 'group', properties: { columns: undefined } });
                gridObj.groupModule.columnDrop({ droppedElement: dom_1.createElement('div', { attrs: { action: 'grouping1' } }) });
                gridObj.groupModule.columnDrop({ droppedElement: dom_1.createElement('div', { attrs: { 'action': 'grouping', 'e-mappinguid': '' } }) });
            });
            afterAll(function () {
                elem.remove();
            });
        });
        describe('Grouping hide', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionBegin;
            var actionComplete;
            var columns;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'EmployeeID', headerText: 'Employee ID' },
                        { field: 'Freight', headerText: 'Freight' },
                        { field: 'ShipCity', headerText: 'Ship City' },
                        { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    allowSorting: true,
                    groupSettings: { showGroupedColumn: false },
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('Single column group testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.groupSettings.columns.length).toEqual(1);
                    expect(gridObj.sortSettings.columns.length).toEqual(1);
                    expect(gridObj.element.querySelectorAll('.e-headercell:not(.e-hide)').length).toEqual(5);
                    done();
                };
                gridObj.groupSettings.showGroupedColumn = false;
                gridObj.dataBind();
                gridObj.actionComplete = actionComplete;
                gridObj.groupModule.groupColumn('ShipCity');
            });
            it('Single column ungroup testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.groupSettings.columns.length).toEqual(0);
                    expect(gridObj.sortSettings.columns.length).toEqual(0);
                    expect(gridObj.element.querySelectorAll('.e-headercell:not(.e-hide)').length).toEqual(6);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.groupModule.ungroupColumn('ShipCity');
            });
            afterAll(function () {
                elem.remove();
            });
        });
        describe('Grouping toggle', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionBegin;
            var actionComplete;
            var columns;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'EmployeeID', headerText: 'Employee ID' },
                        { field: 'Freight', headerText: 'Freight' },
                        { field: 'ShipCity', headerText: 'Ship City' },
                        { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    allowSorting: true,
                    groupSettings: { showToggleButton: true, showGroupedColumn: true },
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('sort after group testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.groupSettings.columns.length).toEqual(1);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                var headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                headers[0].querySelector('.e-grptogglebtn').click();
            });
            it('group from toogle header testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.sortSettings.columns.length).toEqual(2);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.sortColumn('CustomerID', 'ascending', false);
            });
            it('show drop area', function () {
                gridObj.groupSettings.showDropArea = true;
                gridObj.dataBind();
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].style.display).toEqual('');
            });
            it('hide drop area', function () {
                gridObj.groupSettings.showDropArea = false;
                gridObj.dataBind();
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].style.display).toEqual('none');
            });
            it('ungroup from toogele header testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.groupSettings.columns.length).toEqual(0);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                var headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                headers[0].querySelector('.e-grptogglebtn').click();
                gridObj.groupModule.toogleGroupFromHeader(dom_1.createElement('div'));
                var div = dom_1.createElement('div', { className: 'e-toggleungroup', attrs: { 'ej-mappingname': '' } });
                div.appendChild(dom_1.createElement('div', { className: 'e-toggleungroup', attrs: { 'ej-mappingname': '' } }));
                gridObj.groupModule.toogleGroupFromHeader(div.firstElementChild);
                gridObj.groupModule.enableAfterRender({ module: 'sort' });
                gridObj.clearSelection();
                gridObj.groupModule.keyPressHandler({ action: 'altDownArrow', preventDefault: function () { } });
            });
            afterAll(function () {
                elem.remove();
            });
        });
        describe('group col initial rendering', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionBegin;
            var actionComplete;
            var columns;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'Customer ID' },
                        { field: 'EmployeeID', headerText: 'Employee ID' },
                    ],
                    allowGrouping: true,
                    allowSorting: true,
                    groupSettings: { columns: ['CustomerID'], showToggleButton: true, showGroupedColumn: true, showDropArea: true },
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('group header testing', function () {
                gridObj.groupModule.contentRefresh = false;
                gridObj.groupModule.groupColumn('EmployeeID');
                expect(1).toEqual(1);
                gridObj.groupSettings.showToggleButton = false;
                gridObj.dataBind();
                gridObj.groupSettings.showToggleButton = true;
                gridObj.dataBind();
                gridObj.groupSettings.showGroupedColumn = false;
                gridObj.dataBind();
                gridObj.groupSettings.showGroupedColumn = true;
                gridObj.dataBind();
                gridObj.groupSettings.showDropArea = false;
                gridObj.dataBind();
                gridObj.groupSettings.showDropArea = true;
                gridObj.dataBind();
            });
            afterAll(function () {
                elem.remove();
            });
        });
        describe('Stacked header with grouping', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.filterData, allowPaging: false,
                    columns: [
                        {
                            headerText: 'Order Details', toolTip: 'Order Details',
                            columns: [{ field: 'OrderID', headerText: 'Order ID' },
                                { field: 'OrderDate', headerText: 'Order Date', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }]
                        },
                        { field: 'CustomerID', headerText: 'Customer ID' },
                        { field: 'EmployeeID', headerText: 'Employee ID' },
                        {
                            headerText: 'Ship Details',
                            columns: [
                                { field: 'ShipCity', headerText: 'Ship City' },
                                { field: 'ShipCountry', headerText: 'Ship Country' },
                                {
                                    headerText: 'Ship Name Verified', columns: [{ field: 'ShipName', headerText: 'Ship Name' },
                                        { field: 'Verified', headerText: 'Verified' }]
                                },
                            ],
                        }
                    ],
                    allowGrouping: true,
                    allowSorting: true,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('group a column', function (done) {
                var actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toEqual(1);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toEqual(3);
                    done();
                };
                gridObj.groupModule.groupColumn('EmployeeID');
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
            });
            it('sort a column', function (done) {
                var actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toEqual(1);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toEqual(2);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toEqual(3);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.sortColumn('OrderDate', 'ascending');
                gridObj.dataBind();
            });
            it('ungroup a column', function (done) {
                var actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toEqual(0);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toEqual(0);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.groupModule.ungroupColumn('EmployeeID');
                gridObj.dataBind();
            });
            it('clear sort', function (done) {
                var actionComplete = function (args) {
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toEqual(0);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearSorting();
                gridObj.dataBind();
            });
            afterAll(function () {
                elem.remove();
            });
        });
        describe('Grouping set model test case', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionBegin;
            var actionComplete;
            var columns;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'EmployeeID', headerText: 'Employee ID' },
                        { field: 'Freight', headerText: 'Freight' },
                        { field: 'ShipCity', headerText: 'Ship City' },
                        { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    allowSorting: true,
                    allowPaging: true,
                    allowReordering: true,
                    groupSettings: { showDropArea: false, showToggleButton: true, showUngroupButton: true },
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('check default group property rendering', function () {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toEqual(1);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn').length).toEqual(gridObj.columns.length);
            });
            it('disable Grouping', function (done) {
                actionComplete = function () {
                    expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toEqual(0);
                    expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn').length).toEqual(0);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.allowGrouping = false;
                gridObj.dataBind();
            });
            it('enable Grouping', function (done) {
                actionComplete = function () {
                    expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toEqual(1);
                    expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn').length).toEqual(gridObj.columns.length);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.allowGrouping = true;
                gridObj.dataBind();
            });
            it('group a column', function (done) {
                actionComplete = function () {
                    expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toEqual(1);
                    expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn.e-toggleungroup').length).toEqual(1);
                    expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].querySelectorAll('.e-ungroupbutton').length).toEqual(1);
                    expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending').length).toEqual(1);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.groupModule.groupColumn('EmployeeID');
                gridObj.dataBind();
            });
            it('reOrder the grouped column', function (done) {
                actionComplete = function () {
                    expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn.e-toggleungroup').length).toEqual(1);
                    expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].querySelectorAll('.e-ungroupbutton').length).toEqual(1);
                    expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-headercell')[5].children[0].innerHTML).toMatch('Employee ID');
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toEqual(12);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.reorderColumns('EmployeeID', 'ShipCountry');
                gridObj.dataBind();
            });
            afterAll(function () {
                elem.remove();
            });
        });
        describe('Grouping a column in default', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionBegin;
            var actionComplete;
            var columns;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'EmployeeID', headerText: 'Employee ID' },
                        { field: 'Freight', headerText: 'Freight' },
                        { field: 'ShipCity', headerText: 'Ship City' },
                        { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { columns: ['EmployeeID'] },
                    allowSorting: true,
                    allowPaging: true,
                    allowFiltering: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('check default group property rendering', function () {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toEqual(1);
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toEqual(1);
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].querySelectorAll('.e-ungroupbutton').length).toEqual(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toEqual(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell').length).toEqual(2);
                expect(gridObj.getContent().querySelectorAll('.e-indentcell').length > 0).toEqual(true);
                expect(gridObj.getContent().querySelectorAll('.e-rowcell')[0].innerHTML).toEqual('10258');
                expect(gridObj.groupSettings.columns.length).toEqual(1);
            });
            it('disable Grouping', function (done) {
                actionComplete = function () {
                    expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toEqual(0);
                    expect(gridObj.currentViewData.length).toEqual(12);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.allowGrouping = false;
                gridObj.dataBind();
            });
            it('enable Grouping', function (done) {
                actionComplete = function () {
                    expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toEqual(1);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.allowGrouping = true;
                gridObj.dataBind();
            });
            afterAll(function () {
                elem.remove();
            });
        });
        describe('Grouping two columns initial', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionBegin;
            var actionComplete;
            var columns;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'EmployeeID', headerText: 'Employee ID' },
                        { field: 'Freight', headerText: 'Freight' },
                        { field: 'ShipCity', headerText: 'Ship City' },
                        { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { columns: ['EmployeeID', 'ShipCity'] },
                    allowSorting: true,
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('check default group property rendering', function () {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toEqual(1);
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toEqual(2);
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].querySelectorAll('.e-ungroupbutton').length).toEqual(2);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toEqual(2);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell').length).toEqual(2);
                expect(gridObj.getContentTable().querySelectorAll('.e-indentcell').length > 0).toEqual(true);
                expect(gridObj.groupSettings.columns.length).toEqual(2);
            });
            it('disable Grouping', function (done) {
                actionComplete = function () {
                    expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toEqual(0);
                    expect(gridObj.currentViewData.length).toEqual(12);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.allowGrouping = false;
                gridObj.dataBind();
            });
            it('enable Grouping', function (done) {
                actionComplete = function () {
                    expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toEqual(1);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.allowGrouping = true;
                gridObj.dataBind();
            });
            afterAll(function () {
                elem.remove();
            });
        });
        describe('Grouping two columns initial', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionBegin;
            var actionComplete;
            var columns;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'EmployeeID', headerText: 'Employee ID' },
                        { field: 'Freight', headerText: 'Freight' },
                        { field: 'ShipCity', headerText: 'Ship City' },
                        { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { columns: ['EmployeeID', 'ShipCity'] },
                    allowSorting: false,
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('test', function () {
                expect(1).toEqual(1);
            });
            afterAll(function () {
                elem.remove();
            });
        });
        describe('Grouping two columns initial', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionBegin;
            var actionComplete;
            var columns;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'EmployeeID', headerText: 'Employee ID' },
                        { field: 'Freight', headerText: 'Freight' },
                        { field: 'ShipCity', headerText: 'Ship City' },
                        { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    sortSettings: { columns: [{ field: 'EmployeeID', direction: 'ascending' }] },
                    groupSettings: { columns: ['EmployeeID'] },
                    allowSorting: true,
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('test', function () {
                expect(1).toEqual(1);
            });
            afterAll(function () {
                elem.remove();
            });
        });
    });
});
