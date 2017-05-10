define(["require", "exports", "@syncfusion/ej2-base", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../../../src/grid/actions/sort", "../../../src/grid/actions/page", "../../../src/grid/actions/selection", "../../../src/grid/actions/row-reorder", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, ej2_base_1, util_1, dom_1, grid_1, sort_1, page_1, selection_1, row_reorder_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    grid_1.Grid.Inject(page_1.Page, sort_1.Sort, selection_1.Selection, row_reorder_1.RowDD);
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
    function setMouseCordinates(eventarg, x, y) {
        eventarg.pageX = x;
        eventarg.pageY = y;
        eventarg.clientX = x;
        eventarg.clientY = y;
        return eventarg;
    }
    describe('Row Drag and Drop module', function () {
        describe('Reorder row functionalities', function () {
            var gridObj;
            var gridObj1;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var elem1 = dom_1.createElement('div', { id: 'Grid1' });
            var dataBound;
            var actionComplete;
            var dataBound1;
            var actionComplete1;
            var rows;
            var rows1;
            window['browserDetails'].isIE = false;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: JSON.parse(JSON.stringify(datasource_spec_1.data)),
                    allowRowDragAndDrop: true,
                    rowDropSettings: { targetID: undefined },
                    allowSelection: true,
                    selectionSettings: { type: 'multiple', mode: 'row' },
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                        { field: 'ShipCity' }],
                    allowSorting: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 6, currentPage: 1 },
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
                document.body.appendChild(elem1);
                gridObj1 = new grid_1.Grid({
                    dataSource: [],
                    allowRowDragAndDrop: true,
                    rowDropSettings: { targetID: 'Grid' },
                    allowSelection: true,
                    selectionSettings: { type: 'multiple', mode: 'row' },
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                        { field: 'ShipCity' }],
                    allowSorting: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 6, currentPage: 1 },
                    actionComplete: actionComplete1,
                    dataBound: dataBound1
                });
                gridObj1.appendTo('#Grid1');
            });
            it('Reorder box selection simulate testing', function () {
                rows = gridObj.getContent().querySelectorAll('tr.e-row');
                var mousedown = getEventObject('MouseEvents', 'mousedown', rows[0].querySelectorAll('.e-rowcell')[0], 15, 10);
                ej2_base_1.EventHandler.trigger(gridObj.getContent(), 'mousedown', mousedown);
                var mousemove = getEventObject('MouseEvents', 'mousemove', rows[1].querySelectorAll('.e-rowcell')[0], 15, 29);
                ej2_base_1.EventHandler.trigger(gridObj.getContent(), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 2, 2);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rows[0].querySelectorAll('.e-rowcell')[0];
                ej2_base_1.EventHandler.trigger(gridObj.getContent(), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rows[1].querySelectorAll('.e-rowcell')[0];
                mousemove = setMouseCordinates(mousemove, 15, 29);
                ej2_base_1.EventHandler.trigger(gridObj.getContent(), 'mousemove', mousemove);
                var mouseup = getEventObject('MouseEvents', 'mouseup', rows[1].querySelectorAll('.e-rowcell')[0]);
                ej2_base_1.EventHandler.trigger((document.body), 'mouseup', mouseup);
                expect(gridObj.selectionModule.selectedRowIndexes.length).toEqual(2);
                expect(gridObj.selectionModule.selectedRowIndexes.indexOf(0) > -1).toEqual(true);
                expect(gridObj.selectionModule.selectedRowIndexes.indexOf(1) > -1).toEqual(true);
            });
            it('Reorder Row within grid return testing', function () {
                rows = gridObj.getContent().querySelectorAll('tr.e-row');
                var mousedown = getEventObject('MouseEvents', 'mousedown', rows[0].querySelectorAll('.e-rowcell')[0], 15, 10);
                ej2_base_1.EventHandler.trigger(gridObj.getContent(), 'mousedown', mousedown);
                var mousemove = getEventObject('MouseEvents', 'mousemove', rows[0].querySelectorAll('.e-rowcell')[0], 15, 70);
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rows[3].querySelectorAll('.e-rowcell')[0];
                mousemove = setMouseCordinates(mousemove, 15, 75);
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                var mouseup = getEventObject('MouseEvents', 'mouseup', rows[3].querySelectorAll('.e-rowcell')[0]);
                mouseup.type = 'mouseup';
                ej2_base_1.EventHandler.trigger((document), 'mouseup', mouseup);
                rows = gridObj.getContent().querySelectorAll('tr.e-row');
                expect(rows[0].querySelector('.e-rowcell').textContent).toEqual('10248');
            });
            it('Reorder Row simulate grid to grid with undefined id testing', function () {
                rows = gridObj.getContent().querySelectorAll('tr.e-row');
                var mousedown = getEventObject('MouseEvents', 'mousedown', rows[0].querySelectorAll('.e-rowcell')[0], 15, 10);
                ej2_base_1.EventHandler.trigger(gridObj.getContent(), 'mousedown', mousedown);
                rows1 = gridObj1.element.querySelector('.e-emptyrow');
                var mousemove = getEventObject('MouseEvents', 'mousemove', rows[0].querySelectorAll('.e-rowcell')[0], 15, 70);
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element;
                mousemove = setMouseCordinates(mousemove, 15, 75);
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rows1;
                mousemove = setMouseCordinates(mousemove, 15, 75);
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                var mouseup = getEventObject('MouseEvents', 'mouseup', rows1, 15, 75);
                mouseup.type = 'mouseup';
                ej2_base_1.EventHandler.trigger((document), 'mouseup', mouseup);
                expect(rows[0].querySelector('.e-rowcell').textContent).toEqual('10248');
                expect(rows[1].querySelector('.e-rowcell').textContent).toEqual('10249');
            });
            it('Reorder Row simulate grid to grid testing', function (done) {
                actionComplete = function (args) {
                    rows = gridObj1.getContent().querySelectorAll('tr.e-row');
                    expect(rows[0].querySelector('.e-rowcell').textContent).toEqual('10248');
                    expect(rows[1].querySelector('.e-rowcell').textContent).toEqual('10249');
                    rows = gridObj.getContent().querySelectorAll('tr.e-row');
                    expect(rows[0].querySelector('.e-rowcell').textContent).toEqual('10250');
                    expect(rows[1].querySelector('.e-rowcell').textContent).toEqual('10251');
                    gridObj.allowRowDragAndDrop = false;
                    gridObj.dataBind();
                    gridObj.allowRowDragAndDrop = true;
                    gridObj.dataBind();
                    gridObj.rowDragAndDropModule.enableAfterRender({ module: 'sort' });
                    gridObj.rowDragAndDropModule.columnDrop({ droppedElement: dom_1.createElement('div', { attrs: { 'action': 'grouping' } }) });
                    gridObj.renderModule.data.removeRows({ indexes: [2, 1] });
                    gridObj.element.appendChild(dom_1.createElement('div', { className: 'e-griddragarea' }));
                    gridObj.getContent().ej2_instances[2].trigger('dragStart', {});
                    gridObj.element.appendChild(dom_1.createElement('div', { className: 'e-cloneproperties' }));
                    gridObj.getContent().ej2_instances[2].trigger('dragStop', { target: gridObj.element, helper: gridObj.element.querySelector('.e-cloneproperties'), event: { clientX: 15, clientY: 15 } });
                    var target = dom_1.createElement('div', { id: 'Grid', attrs: { 'action': 'grouping1' } });
                    gridObj.element.appendChild(target);
                    gridObj.rowDragAndDropModule.columnDrop({ target: gridObj.element, droppedElement: target });
                    gridObj1.allowPaging = false;
                    gridObj1.dataBind();
                    target = dom_1.createElement('div', { id: 'Grid', attrs: { 'action': 'grouping1' } });
                    gridObj.element.appendChild(target);
                    gridObj1.rowDragAndDropModule.columnDrop({ target: gridObj1.element.querySelector('.e-row'), droppedElement: target });
                    gridObj.isDestroyed = true;
                    gridObj.rowDragAndDropModule = new row_reorder_1.RowDD(gridObj);
                    gridObj.rowDragAndDropModule.destroy();
                    done();
                };
                gridObj.rowDropSettings.targetID = 'Grid1';
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
                rows = gridObj.getContent().querySelectorAll('tr.e-row');
                var mousedown = getEventObject('MouseEvents', 'mousedown', rows[0].querySelectorAll('.e-rowcell')[0], 15, 10);
                ej2_base_1.EventHandler.trigger(gridObj.getContent(), 'mousedown', mousedown);
                rows1 = gridObj1.element.querySelector('.e-emptyrow');
                var mousemove = getEventObject('MouseEvents', 'mousemove', rows[0].querySelectorAll('.e-rowcell')[0], 15, 70);
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element;
                mousemove = setMouseCordinates(mousemove, 0, 0);
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element;
                var obj = gridObj1.element.getElementsByClassName('e-emptyrow')[0].getBoundingClientRect();
                mousemove = setMouseCordinates(mousemove, obj.left + 2, obj.top + 2);
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rows1;
                mousemove = setMouseCordinates(mousemove, 15, 75);
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                var mouseup = getEventObject('MouseEvents', 'mouseup', rows1, 15, 75);
                mouseup.type = 'mouseup';
                ej2_base_1.EventHandler.trigger((document), 'mouseup', mouseup);
            });
            afterAll(function () {
                dom_1.remove(elem);
                dom_1.remove(elem1);
            });
        });
    });
});
