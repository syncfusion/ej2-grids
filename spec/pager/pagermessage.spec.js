define(["require", "exports", "@syncfusion/ej2-base/dom", "../../src/pager/pager", "../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, dom_1, pager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('Pagermessage module', function () {
        describe('Pager message disable testing', function () {
            var pagerObj;
            var elem = dom_1.createElement('div', { id: 'Pager' });
            beforeAll(function (done) {
                var created = function () { done(); };
                document.body.appendChild(elem);
                pagerObj = new pager_1.Pager({
                    totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5, enablePagerMessage: false, created: created
                });
                pagerObj.appendTo('#Pager');
            });
            it('pager message element testing', function () {
                expect(pagerObj.element.querySelectorAll('.e-parentmsgbar').length).toEqual(0);
            });
            afterAll(function () {
                pagerObj.destroy();
                elem.remove();
            });
        });
        describe('Pager message method testing', function () {
            var pagerObj;
            var elem = dom_1.createElement('div', { id: 'Pager' });
            beforeAll(function (done) {
                var created = function () { done(); };
                document.body.appendChild(elem);
                pagerObj = new pager_1.Pager({
                    totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5, created: created
                });
                pagerObj.appendTo('#Pager');
            });
            it('pagerMessage hide testing', function () {
                pagerObj.pagerMessageModule.hideMessage();
                expect(pagerObj.element.querySelector('.e-pagenomsg').style.display).toEqual('none');
                expect(pagerObj.element.querySelector('.e-pagecountmsg').style.display).toEqual('none');
            });
            it('pagerMessage show testing', function () {
                pagerObj.pagerMessageModule.showMessage();
                expect(pagerObj.element.querySelector('.e-pagenomsg').style.display).not.toEqual('none');
                expect(pagerObj.element.querySelector('.e-pagecountmsg').style.display).not.toEqual('none');
            });
            afterAll(function () {
                pagerObj.destroy();
                elem.remove();
            });
        });
        describe('Pager message disable testing', function () {
            var pagerObj;
            var elem = dom_1.createElement('div', { id: 'Pager' });
            beforeAll(function (done) {
                var created = function () { done(); };
                document.body.appendChild(elem);
                pagerObj = new pager_1.Pager({
                    totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5, enablePagerMessage: false, created: created
                });
                pagerObj.appendTo('#Pager');
            });
            it('pagerMessage element testing', function () {
                pagerObj.pagerMessageModule.hideMessage();
                expect(pagerObj.element.querySelectorAll('.e-pagenomsg').length).toEqual(0);
                expect(pagerObj.element.querySelectorAll('.e-pagecountmsg').length).toEqual(0);
            });
            it('pagerMessage enable testing', function () {
                pagerObj.enablePagerMessage = true;
                pagerObj.dataBind();
                expect(pagerObj.element.querySelectorAll('.e-pagenomsg').length).toEqual(1);
                expect(pagerObj.element.querySelectorAll('.e-pagecountmsg').length).toEqual(1);
            });
            afterAll(function () {
                pagerObj.destroy();
                elem.remove();
            });
        });
    });
});
