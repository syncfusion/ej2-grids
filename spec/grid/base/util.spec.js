define(["require", "exports", "../../../src/grid/base/util", "@syncfusion/ej2-base/dom", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, util_1, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('Util module', function () {
        describe('Method testing', function () {
            var Test = (function () {
                function Test() {
                }
                return Test;
            }());
            it('doesImplementInterface testing', function () {
                expect(util_1.doesImplementInterface(Test, 'hi')).toEqual(false);
                var div = dom_1.createElement('div');
                div.appendChild(dom_1.createElement('span'));
                dom_1.createElement('div').appendChild(div);
                util_1.setCssInGridPopUp(div, { target: div, clientX: 0, clientY: 100 }, 'e-downtail e-uptail');
                util_1.setCssInGridPopUp(div, { target: div, changedTouches: [{ clientX: 0, clientY: 100 }] }, 'e-downtail e-uptail');
                util_1.prepareColumns(['a', 'b']);
            });
        });
    });
});
