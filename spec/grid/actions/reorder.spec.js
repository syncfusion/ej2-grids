define(["require", "exports", "@syncfusion/ej2-base", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../../../src/grid/base/util", "../../../src/grid/actions/sort", "../../../src/grid/actions/filter", "../../../src/grid/actions/group", "../../../src/grid/actions/page", "../../../src/grid/actions/reorder", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, ej2_base_1, util_1, dom_1, grid_1, util_2, sort_1, filter_1, group_1, page_1, reorder_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    grid_1.Grid.Inject(sort_1.Sort, page_1.Page, filter_1.Filter, reorder_1.Reorder, group_1.Group);
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
    describe('Reorder module', function () {
        describe('Reorder functionalities', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var dataBound;
            var actionComplete;
            var headers;
            var columns;
            window['browserDetails'].isIE = false;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data,
                    allowSorting: true,
                    allowReordering: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                        { field: 'ShipCity' }],
                    allowFiltering: true,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('Reorder Column method testing', function (done) {
                var dataBound = function (args) {
                    columns = gridObj.getColumns();
                    headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                    expect(headers[0].querySelector('.e-headercelldiv').textContent).toEqual('EmployeeID');
                    expect(headers[1].querySelector('.e-headercelldiv').textContent).toEqual('OrderID');
                    expect(headers[2].querySelector('.e-headercelldiv').textContent).toEqual('CustomerID');
                    expect(columns[0].field).toEqual('EmployeeID');
                    expect(columns[1].field).toEqual('OrderID');
                    expect(columns[2].field).toEqual('CustomerID');
                    done();
                };
                gridObj.dataBound = dataBound;
                gridObj.dataBind();
                gridObj.reorderColumns('EmployeeID', 'OrderID');
            });
            it('Reorder Invalid Column testing', function () {
                gridObj.reorderColumns('EmployeeID', 'EmployeeID1');
                headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                expect(headers[0].querySelector('.e-headercelldiv').textContent).toEqual('EmployeeID');
                expect(headers[1].querySelector('.e-headercelldiv').textContent).toEqual('OrderID');
                expect(columns[0].field).toEqual('EmployeeID');
                expect(columns[1].field).toEqual('OrderID');
            });
            it('Reorder same Column testing', function () {
                gridObj.reorderColumns('EmployeeID', 'EmployeeID');
                headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                expect(headers[0].querySelector('.e-headercelldiv').textContent).toEqual('EmployeeID');
                expect(headers[1].querySelector('.e-headercelldiv').textContent).toEqual('OrderID');
                expect(columns[0].field).toEqual('EmployeeID');
                expect(columns[1].field).toEqual('OrderID');
            });
            it('Reorder Column simulate testing', function (done) {
                var dataBound = function (args) {
                    columns = gridObj.getColumns();
                    headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                    expect(headers[0].querySelector('.e-headercelldiv').textContent).toEqual('OrderID');
                    expect(headers[1].querySelector('.e-headercelldiv').textContent).toEqual('EmployeeID');
                    expect(columns[0].field).toEqual('OrderID');
                    expect(columns[1].field).toEqual('EmployeeID');
                    done();
                };
                gridObj.dataBound = dataBound;
                gridObj.dataBind();
                var mousedown = getEventObject('MouseEvents', 'mousedown', headers[0].querySelector('.e-headercelldiv'), 13, 13);
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent().querySelector('.e-columnheader'), 'mousedown', mousedown);
                var mousemove = getEventObject('MouseEvents', 'mousemove', headers[0], 27, 14);
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.getContentTable();
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = document.body;
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = headers[1];
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                var mouseup = getEventObject('MouseEvents', 'mouseup', headers[1], 198, 13);
                ej2_base_1.EventHandler.trigger((document), 'mouseup', mouseup);
            });
            it('Reorder disable and enable testing', function (done) {
                var dataBound = function (args) {
                    columns = gridObj.getColumns();
                    headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                    expect(headers[0].querySelector('.e-headercelldiv').textContent).toEqual('OrderID');
                    expect(headers[1].querySelector('.e-headercelldiv').textContent).toEqual('ShipCity');
                    expect(headers[2].querySelector('.e-headercelldiv').textContent).toEqual('EmployeeID');
                    expect(headers[4].querySelector('.e-headercelldiv').textContent).toEqual('Freight');
                    expect(columns[0].field).toEqual('OrderID');
                    expect(columns[1].field).toEqual('ShipCity');
                    expect(columns[2].field).toEqual('EmployeeID');
                    expect(columns[4].field).toEqual('Freight');
                    util_2.getActualProperties({});
                    util_2.parentsUntil(headers[0], 'e-headercell', false);
                    util_2.parentsUntil(headers[0], 'Grid', true);
                    done();
                };
                gridObj.allowReordering = false;
                gridObj.dataBind();
                gridObj.allowReordering = true;
                gridObj.dataBind();
                gridObj.dataBound = dataBound;
                gridObj.dataBind();
                gridObj.reorderColumns('ShipCity', 'EmployeeID');
            });
            it('Reorder Column simulate testing', function () {
                var mousedown = getEventObject('MouseEvents', 'mousedown', headers[0].querySelector('.e-headercelldiv'), 13, 13);
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent().querySelector('.e-columnheader'), 'mousedown', mousedown);
                gridObj.allowReordering = false;
                gridObj.dataBind();
                var mousemove = getEventObject('MouseEvents', 'mousemove', headers[0], 14, 14);
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = headers[1];
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                var mouseup = getEventObject('MouseEvents', 'mouseup', headers[1], 198, 13);
                ej2_base_1.EventHandler.trigger((document), 'mouseup', mouseup);
                gridObj.allowReordering = true;
                gridObj.dataBind();
            });
            it('Reorder Column simulate invalid drop element testing', function () {
                var mousedown = getEventObject('MouseEvents', 'mousedown', gridObj.element, 13, 13);
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent().querySelector('.e-columnheader'), 'mousedown', mousedown);
                var mousemove = getEventObject('MouseEvents', 'mousemove', gridObj.element, 27, 14);
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                mousedown = getEventObject('MouseEvents', 'mousedown', headers[0], 13, 13);
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent().querySelector('.e-columnheader'), 'mousedown', mousedown);
                mousemove = getEventObject('MouseEvents', 'mousemove', headers[0].querySelector('.e-headercelldiv'), 27, 14);
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = headers[1].querySelector('.e-headercelldiv');
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                var mouseup = getEventObject('MouseEvents', 'mouseup', gridObj.getHeaderContent(), 198, 13);
                ej2_base_1.EventHandler.trigger((document), 'mouseup', mouseup);
                gridObj.allowReordering = false;
                gridObj.dataBind();
                mousedown = getEventObject('MouseEvents', 'mousedown', gridObj.element, 13, 13);
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent().querySelector('.e-columnheader'), 'mousedown', mousedown);
                mousemove = getEventObject('MouseEvents', 'mousemove', headers[0].querySelector('.e-headercelldiv'), 27, 14);
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = headers[1].querySelector('.e-headercelldiv');
                ej2_base_1.EventHandler.trigger((document), 'mousemove', mousemove);
                mouseup = getEventObject('MouseEvents', 'mouseup', gridObj.getHeaderContent(), 198, 13);
                ej2_base_1.EventHandler.trigger((document), 'mouseup', mouseup);
                gridObj.allowReordering = true;
                gridObj.dataBind();
                gridObj.reorderModule.enableAfterRender({ module: 'sort' });
                headers[3].classList.add('e-reorderindicate');
                gridObj.element.appendChild(dom_1.createElement('div', { className: 'e-cloneproperties' }));
                gridObj.getHeaderContent().ej2_instances[0].trigger('drop', { target: dom_1.createElement('div'), droppedElement: gridObj.element.querySelector('.e-cloneproperties') });
                gridObj.element.appendChild(dom_1.createElement('div', { className: 'e-cloneproperties' }));
                gridObj.width = 300;
                gridObj.dataBind();
                gridObj.reorderModule.updateScrollPostion({ clientX: 10, clientY: 10 });
                gridObj.reorderModule.updateScrollPostion({ clientX: gridObj.element.getBoundingClientRect().right - 20, clientY: 10 });
                gridObj.reorderModule.updateScrollPostion({ changedTouches: [{ clientX: 10, clientY: 10 }] });
                gridObj.allowGrouping = true;
                var header = headers[2];
                gridObj.reorderModule.element = header.parentElement;
                gridObj.reorderModule.drag({ target: header, event: { clientX: 55, clientY: 10 } });
                gridObj.isDestroyed = true;
                gridObj.reorderModule = new reorder_1.Reorder(gridObj);
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
});
