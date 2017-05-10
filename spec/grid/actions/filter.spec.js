define(["require", "exports", "@syncfusion/ej2-base", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../../../src/grid/actions/filter", "../../../src/grid/actions/group", "../../../src/grid/actions/page", "../../../src/grid/base/enum", "../../../src/grid/services/value-formatter", "../../../src/grid/actions/selection", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, ej2_base_1, util_1, dom_1, grid_1, filter_1, group_1, page_1, enum_1, value_formatter_1, selection_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    grid_1.Grid.Inject(filter_1.Filter, page_1.Page, selection_1.Selection, group_1.Group);
    function getEventObject(eventType, eventName) {
        var tempEvent = document.createEvent(eventType);
        tempEvent.initEvent(eventName, true, true);
        var returnObject = util_1.extend({}, tempEvent);
        returnObject.preventDefault = function () { return true; };
        return returnObject;
    }
    describe('Filtering module', function () {
        var getActualProperties = function (obj) {
            if (obj instanceof ej2_base_1.ChildProperty) {
                return util_1.getValue('properties', obj);
            }
            else {
                return obj;
            }
        };
        var getString = function (obj) {
            return JSON.stringify(obj, function (key, value) {
                return getActualProperties(value);
            });
        };
        describe('Filterbar functionalities', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionBegin;
            var actionComplete;
            var filterElement;
            var orderIDElement;
            var keyup = getEventObject('KeyboardEvent', 'keyup');
            keyup.keyCode = 13;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.filterData,
                    allowFiltering: true,
                    allowPaging: false,
                    filterSettings: { type: 'filterbar', showFilterBarStatus: true },
                    columns: [{ field: 'OrderID', type: 'number', visible: true }, { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number' }, { field: 'Freight', format: 'C2', type: 'number' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean' }, { field: 'ShipName', allowFiltering: false },
                        { field: 'ShipCountry', type: 'string' }, { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('Filter string column testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(3);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"CustomerID","operator":"startswith","value":"VINET","predicate":"and","matchCase":false,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = gridObj.element.querySelector('#CustomerID_filterBarcell');
                orderIDElement = gridObj.element.querySelector('#OrderID_filterBarcell');
                filterElement.value = 'VINET';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('empty filter value testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(71);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = gridObj.element.querySelector('#CustomerID_filterBarcell');
                filterElement.value = '';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('skip input filter string value testing', function (done) {
                filterElement = gridObj.element.querySelector('#CustomerID_filterBarcell');
                filterElement.value = '<';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
                setTimeout(function () {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(71);
                    done();
                }, 500);
            });
            it('skip input filter number value testing', function (done) {
                filterElement = orderIDElement;
                filterElement.value = '!';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
                setTimeout(function () {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(71);
                    done();
                }, 500);
            });
            it('column allowFiltering false testing', function (done) {
                filterElement = gridObj.element.querySelector('#ShipName_filterBarcell');
                filterElement.value = 'Lyon';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
                keyup.keyCode = 8;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
                keyup.keyCode = 13;
                setTimeout(function () {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(71);
                    done();
                }, 500);
            });
            it('Filter undefined type column testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(3);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"ShipCountry","operator":"startswith","value":"UK","predicate":"and","matchCase":false,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = gridObj.element.querySelector('#ShipCountry_filterBarcell');
                filterElement.value = 'UK';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('clear Filtering testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.filterData.length);
                    expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearFiltering();
            });
            it('Filter number column testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"OrderID","operator":"equal","value":10249,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = orderIDElement;
                filterElement.value = '10249';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('clear Filtering testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.filterData.length);
                    expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearFiltering();
            });
            it('Filter number column string value testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(0);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = orderIDElement;
                filterElement.value = '102i49i';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('clear Filtering testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.filterData.length);
                    expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearFiltering();
            });
            it('Filter date column testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.filterSettings.columns.length).toEqual(1);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = gridObj.element.querySelector('#OrderDate_filterBarcell');
                var valueFormatter = new value_formatter_1.ValueFormatter();
                filterElement.value = valueFormatter.toView(new Date(8364186e5), gridObj.getColumns()[8].getFormatter()).toString();
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('clear Filtering testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.filterData.length);
                    expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearFiltering();
            });
            it('Filter number format column testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"Freight","operator":"equal","value":32.38,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = gridObj.element.querySelector('#Freight_filterBarcell');
                filterElement.value = '32.38';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('clear Filtering testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.filterData.length);
                    expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearFiltering();
            });
            it('Filter number format with formated value testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"Freight","operator":"equal","value":32.38,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = gridObj.element.querySelector('#Freight_filterBarcell');
                filterElement.value = '$32.38';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('clear Filtering testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.filterData.length);
                    expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearFiltering();
            });
            it('Filter number with < operator testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(4);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"OrderID","operator":"lessthan","value":10252,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = orderIDElement;
                filterElement.value = '<10252';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('clear Filtering testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.filterData.length);
                    expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearFiltering();
            });
            it('Filter number with > operator testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(66);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"OrderID","operator":"greaterthan","value":10252,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = orderIDElement;
                filterElement.value = '>10252';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('clear Filtering testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.filterData.length);
                    expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearFiltering();
            });
            it('Filter number with < operator testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(5);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"OrderID","operator":"lessthanorequal","value":10252,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = orderIDElement;
                filterElement.value = '<=10252';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('clear Filtering testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.filterData.length);
                    expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearFiltering();
            });
            it('Filter number with >= operator testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(67);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"OrderID","operator":"greaterthanorequal","value":10252,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = orderIDElement;
                filterElement.value = '>=10252';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('clear Filtering testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.filterData.length);
                    expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearFiltering();
            });
            it('Filter number with = operator testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"OrderID","operator":"equal","value":10252,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = orderIDElement;
                filterElement.value = '=10252';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('clear Filtering testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.filterData.length);
                    expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearFiltering();
            });
            it('Filter number with ! operator testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.filterData.length - 1);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"OrderID","operator":"notequal","value":10252,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = orderIDElement;
                filterElement.value = '!10252';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('clear Filtering testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.filterData.length);
                    expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearFiltering();
            });
            it('Filter string with * operator testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(4);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"CustomerID","operator":"startswith","value":"v","predicate":"and","matchCase":false,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = gridObj.element.querySelector('#CustomerID_filterBarcell');
                filterElement.value = '*v';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('clear Filtering testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.filterData.length);
                    expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearFiltering();
            });
            it('Filter string with % first operator testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"CustomerID","operator":"endswith","value":"v","predicate":"and","matchCase":false,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = gridObj.element.querySelector('#CustomerID_filterBarcell');
                filterElement.value = '%v';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('clear Filtering testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.filterData.length);
                    expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearFiltering();
            });
            it('Filter string with % last operator testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(5);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"CustomerID","operator":"startswith","value":"b","predicate":"and","matchCase":false,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = gridObj.element.querySelector('#CustomerID_filterBarcell');
                filterElement.value = 'b%';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('clear Filtering testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.filterData.length);
                    expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearFiltering();
            });
            it('Filter boolean format true column testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(35);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"Verified","operator":"equal","value":true,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = gridObj.element.querySelector('#Verified_filterBarcell');
                filterElement.value = 'true';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('Filter boolean format 0 column testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(36);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"Verified","operator":"equal","value":false,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = gridObj.element.querySelector('#Verified_filterBarcell');
                filterElement.value = '0';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('Filter boolean format 1 column testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(35);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"Verified","operator":"equal","value":true,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = gridObj.element.querySelector('#Verified_filterBarcell');
                filterElement.value = '1';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('Filter boolean format false column testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(36);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"Verified","operator":"equal","value":false,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = gridObj.element.querySelector('#Verified_filterBarcell');
                filterElement.value = 'false';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('Filter boolean format invalid value testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(0);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = gridObj.element.querySelector('#Verified_filterBarcell');
                filterElement.value = 'VINET';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('clear Filtering testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.filterData.length);
                    expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearFiltering();
            });
            it('Filter undefined format column testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"ShipCity","operator":"startswith","value":"Lyon","predicate":"and","matchCase":false,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterElement = gridObj.element.querySelector('#ShipCity_filterBarcell');
                filterElement.value = 'Lyon';
                filterElement.focus();
                keyup.target = filterElement;
                ej2_base_1.EventHandler.trigger(gridObj.getHeaderContent(), 'keyup', keyup);
            });
            it('clear Filtering testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.filterData.length);
                    expect(getString(gridObj.filterSettings.columns) === '[]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearFiltering();
            });
            it('filterByColumn method testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"OrderID","operator":"equal","value":10248,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', true);
                expect(orderIDElement.disabled).toEqual(false);
            });
            it('check already filtered column testing', function (done) {
                gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', true);
                expect(orderIDElement.disabled).toEqual(false);
                setTimeout(function () {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                    expect(getString(gridObj.filterSettings.columns) ===
                        '[{"field":"OrderID","operator":"equal","value":10248,"predicate":"and","matchCase":true,"actualFilterValue":{},"actualOperator":{}}]').toEqual(true);
                    done();
                    done();
                }, 500);
            });
            it('removeFilteredColsByField false testing', function (done) {
                actionComplete = function (args) {
                    expect(orderIDElement.value).toEqual('');
                    gridObj.filterModule.generateCell(gridObj.getColumns()[1], enum_1.CellType.Filter);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.removeFilteredColsByField('OrderID1', false);
                gridObj.removeFilteredColsByField('OrderID', true);
            });
            it('allowfiltering false testing', function () {
                gridObj.allowFiltering = false;
                gridObj.dataBind();
                expect(gridObj.element.querySelectorAll('.e-filterbar').length).toEqual(0);
            });
            it('allowfiltering true testing', function () {
                gridObj.allowFiltering = true;
                gridObj.dataBind();
                expect(gridObj.element.querySelectorAll('.e-filterbar').length).toEqual(1);
            });
            it('filter clear button testing', function () {
                orderIDElement.value = '10248';
                gridObj.filterModule.updateSpanClass({ type: 'mousedown', target: orderIDElement.nextElementSibling, preventDefault: function () { } });
                expect(orderIDElement.value).toEqual('');
                orderIDElement.focus();
                gridObj.element.focus();
                gridObj.filterModule.column = gridObj.getColumnByField('ShipCity');
                gridObj.filterModule.column.type = undefined;
                gridObj.filterModule.validateFilterValue('AD');
                gridObj.filterModule.generateCells();
                gridObj.groupSettings.columns = ['OrderID'];
                gridObj.filterModule.generateCells();
                gridObj.columns = [];
                gridObj.filterModule.render();
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('Filterbar template with paging', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionBegin;
            var actionComplete;
            var filterElement;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    pageSettings: { currentPage: 1 },
                    filterSettings: { type: 'filterbar', columns: [], showFilterBarStatus: true },
                    columns: [
                        { field: 'OrderID', type: 'number', visible: true }, { field: 'CustomerID', type: 'string' },
                        { field: 'Freight', format: 'C2', type: 'number' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean' }, { field: 'ShipName', allowFiltering: false },
                        { field: 'OrderDate', format: 'yMd', type: 'date' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('showFilterBarStatus testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelector('.e-pagerexternalmsg').style.display).toEqual('none');
                    gridObj.filterSettings.showFilterBarStatus = false;
                    gridObj.dataBind();
                    gridObj.filterSettings.showFilterBarStatus = true;
                    gridObj.dataBind();
                    gridObj.isDestroyed = true;
                    gridObj.filterModule.addEventListener();
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.filterSettings.showFilterBarStatus = false;
                gridObj.dataBind();
                gridObj.filterByColumn('OrderID', 'equal', '10248', 'and', false);
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('Filterbar template', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionBegin;
            var actionComplete;
            var filterElement;
            var keyup = getEventObject('KeyboardEvent', 'keyup');
            keyup.keyCode = 13;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    pageSettings: { currentPage: 1 },
                    filterSettings: { type: 'filterbar', columns: [] },
                    columns: [
                        { field: 'OrderID', type: 'number', visible: true }, { field: 'CustomerID', type: 'string' },
                        {
                            field: 'EmployeeID', filterBarTemplate: {
                                create: function (args) {
                                    var input = document.createElement('input');
                                    input.type = "text";
                                    return input;
                                },
                                write: function (args) {
                                    args.element.addEventListener('input', args.column.filterBarTemplate.read);
                                },
                                read: function (args) {
                                    this.filterByColumn(args.column.field, "equal", args.element.value, "and", true);
                                }
                            }
                        },
                        { field: 'Freight', format: 'C2', type: 'number' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean' }, { field: 'ShipName', allowFiltering: false },
                        { field: 'OrderDate', format: 'yMd', type: 'date' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('allowfiltering true testing', function () {
                gridObj.allowFiltering = true;
                gridObj.dataBind();
                expect(gridObj.element.querySelector('#OrderID_filterBarcell').disabled).toEqual(false);
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('Filterbar template without create testing', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionBegin;
            var actionComplete;
            var filterElement;
            var keyup = getEventObject('KeyboardEvent', 'keyup');
            var filterModule;
            keyup.keyCode = 13;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    pageSettings: { currentPage: 1 },
                    filterSettings: { type: 'filterbar', columns: [] },
                    columns: [{ field: 'OrderID', type: 'number', visible: true }, { field: 'CustomerID', type: 'string' },
                        {
                            field: 'EmployeeID', filterBarTemplate: {
                                write: function (args) {
                                    args.element.addEventListener('input', args.column.filterBarTemplate.read);
                                },
                                read: function (args) {
                                    this.filterByColumn(args.column.field, "equal", args.element.value, "and", true);
                                }
                            }
                        },
                        { field: 'Freight', format: 'C2', type: 'number' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean' }, { field: 'ShipName', allowFiltering: false },
                        { field: 'OrderDate', format: 'yMd', type: 'date' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('allowfiltering true testing', function () {
                gridObj.allowFiltering = true;
                gridObj.dataBind();
                var element = gridObj.element.querySelector('#OrderID_filterBarcell');
                expect(element.disabled).toEqual(false);
                gridObj.filterModule.column = 'OrderID';
                gridObj.filterSettings.columns = [{ field: 'OrderID', operator: 'equal', value: '10248', predicate: 'and', matchCase: true }];
                gridObj.dataBind();
                gridObj.filterModule.lastFilterElement = element;
                gridObj.filterModule.isSpanClicked = false;
                gridObj.filterModule.updateSpanClass({ type: 'focusin', target: gridObj.element, preventDefault: function () { } });
                gridObj.filterModule.isSpanClicked = true;
                gridObj.filterModule.updateSpanClass({ type: 'focusin', target: gridObj.element, preventDefault: function () { } });
            });
            afterAll(function () {
                dom_1.remove(gridObj.element);
            });
        });
        describe('Filter a column and clear fitering', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionBegin;
            var actionComplete;
            var filterElement;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    allowGrouping: true,
                    pageSettings: { currentPage: 1 },
                    filterSettings: { type: 'filterbar', columns: [{ field: 'EmployeeID', operator: 'equal', value: 5, matchCase: true }], showFilterBarStatus: true },
                    columns: [
                        { field: 'OrderID', type: 'number', visible: true }, { field: 'EmployeeID', type: 'number' },
                        { field: 'Freight', format: 'C2', type: 'number' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean' }, { field: 'ShipName', allowFiltering: false },
                        { field: 'OrderDate', format: 'yMd', type: 'date' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('showFilterBarStatus testing initial filter', function () {
                expect(gridObj.getHeaderContent().querySelectorAll('#EmployeeID_filterBarcell')[0].value).toEqual('5');
                expect(gridObj.currentViewData.length).toEqual(4);
                expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].innerHTML).toEqual('EmployeeID: 5');
            });
            it('showFilterBarStatus testing with aditional filter', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getHeaderContent().querySelectorAll('#OrderID_filterBarcell')[0].value).toEqual('10248');
                    expect(gridObj.getHeaderContent().querySelectorAll('#EmployeeID_filterBarcell')[0].value).toEqual('5');
                    expect(gridObj.currentViewData.length).toEqual(1);
                    expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].innerHTML).toEqual('EmployeeID: 5 &amp;&amp; OrderID: 10248');
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.filterByColumn('OrderID', 'equal', '10248', 'and', false);
                gridObj.dataBind();
            });
            it('group a column', function (done) {
                actionComplete = function () {
                    expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toEqual(1);
                    expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(gridObj.getHeaderContent().querySelectorAll('#OrderID_filterBarcell')[0].value).toEqual('10248');
                    expect(gridObj.getHeaderContent().querySelectorAll('#EmployeeID_filterBarcell')[0].value).toEqual('5');
                    expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].innerHTML).toEqual('EmployeeID: 5 &amp;&amp; OrderID: 10248');
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.groupModule.groupColumn('EmployeeID');
                gridObj.dataBind();
            });
            it('ungroup a column', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toEqual(0);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toEqual(0);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toEqual(0);
                    expect(gridObj.getHeaderContent().querySelectorAll('#OrderID_filterBarcell')[0].value).toEqual('10248');
                    expect(gridObj.getHeaderContent().querySelectorAll('#EmployeeID_filterBarcell')[0].value).toEqual('5');
                    expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].innerHTML).toEqual('EmployeeID: 5 &amp;&amp; OrderID: 10248');
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.groupModule.ungroupColumn('EmployeeID');
                gridObj.dataBind();
            });
            it('group a column', function (done) {
                actionComplete = function () {
                    expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toEqual(1);
                    expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending').length).toEqual(1);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.groupModule.groupColumn('OrderID');
                gridObj.dataBind();
            });
            it('Filter a column', function (done) {
                actionComplete = function () {
                    expect(gridObj.currentViewData.length).toEqual(0);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.filterByColumn('Freight', 'lessthan', '0', 'and', true);
                gridObj.dataBind();
            });
            it('Clear grouping', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toEqual(0);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell').length).toEqual(0);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.groupModule.ungroupColumn('OrderID');
                gridObj.dataBind();
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
});
