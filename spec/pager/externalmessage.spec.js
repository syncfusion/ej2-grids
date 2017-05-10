define(["require", "exports", "@syncfusion/ej2-base/dom", "../../src/pager/pager", "../../src/pager/external-message", "../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, dom_1, pager_1, external_message_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    pager_1.Pager.Inject(external_message_1.ExternalMessage);
    describe('ExternalMessage module testing', function () {
        describe('ExternalMessage method testing', function () {
            var pagerObj;
            var elem = dom_1.createElement('div', { id: 'Pager' });
            beforeAll(function (done) {
                var created = function () { done(); };
                document.body.appendChild(elem);
                pagerObj = new pager_1.Pager({
                    totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5, enablePagerMessage: false,
                    enableExternalMessage: true, externalMessage: '', created: created
                });
                pagerObj.appendTo('#Pager');
            });
            it('externalMessage hide testing', function () {
                pagerObj.externalMessageModule.hideMessage();
                expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg')[0].style.display).toEqual('none');
            });
            it('externalMessage show testing', function () {
                pagerObj.externalMessageModule.showMessage();
                expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg')[0].style.display).not.toEqual('none');
            });
            it('refresh externalMessage testing', function () {
                pagerObj.externalMessageModule.refresh();
                expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg')[0].textContent.length).toEqual(0);
            });
            it('set externalMessage testing', function () {
                pagerObj.externalMessage = 'externalMessage';
                pagerObj.externalMessageModule.refresh();
                expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg')[0].textContent).toEqual('externalMessage');
            });
            afterAll(function () {
                pagerObj.destroy();
                elem.remove();
            });
        });
        describe('ExternalMessage disable testing', function () {
            var pagerObj;
            var elem = dom_1.createElement('div', { id: 'Pager' });
            beforeAll(function (done) {
                var created = function () { done(); };
                document.body.appendChild(elem);
                pagerObj = new pager_1.Pager({
                    totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5, enablePagerMessage: false,
                    enableExternalMessage: false, externalMessage: 'extmsg', created: created
                });
                pagerObj.appendTo('#Pager');
            });
            it('externalMessage element testing', function () {
                expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg').length).toEqual(0);
            });
            it('externalMessage enable testing', function () {
                pagerObj.enableExternalMessage = true;
                pagerObj.dataBind();
                expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg').length).toEqual(1);
            });
            afterAll(function () {
                pagerObj.destroy();
                elem.remove();
            });
        });
    });
});
