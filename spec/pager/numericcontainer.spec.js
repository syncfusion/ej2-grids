define(["require", "exports", "@syncfusion/ej2-base/dom", "../../src/pager/pager", "../../src/pager/external-message", "../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, dom_1, pager_1, external_message_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    pager_1.Pager.Inject(external_message_1.ExternalMessage);
    describe('Numericcontainer module testing', function () {
        describe('numericcontainer initial property testing', function () {
            var pagerObj;
            var elem = dom_1.createElement('div', { id: 'Pager' });
            beforeAll(function (done) {
                var created = function () { done(); };
                document.body.appendChild(elem);
                pagerObj = new pager_1.Pager({
                    totalRecordsCount: 103, currentPage: 8, pageCount: 5, pageSize: 5, enablePagerMessage: false,
                    enableExternalMessage: true, externalMessage: '', created: created
                });
                pagerObj.appendTo('#Pager');
            });
            it('current page testing', function () {
                expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('8');
            });
            afterAll(function () {
                pagerObj.destroy();
                elem.remove();
            });
        });
        describe('numericcontainer method and actions testing', function () {
            var pagerObj;
            var elem = dom_1.createElement('div', { id: 'Pager' });
            var first;
            var last;
            var prev;
            var next;
            var NP;
            var PP;
            beforeAll(function (done) {
                var created = function () { done(); };
                document.body.appendChild(elem);
                pagerObj = new pager_1.Pager({
                    totalRecordsCount: 100, currentPage: 6, pageCount: 5, pageSize: 5,
                    enablePagerMessage: true, enableExternalMessage: true, externalMessage: 'externalMessage',
                    enableRtl: true, enableQueryString: true, customText: 'sheet',
                    created: created
                });
                pagerObj.appendTo('#Pager');
            });
            it('Navigate page testing', function () {
                pagerObj.element.querySelectorAll('.e-numericcontainer')[0].childNodes[1].click();
                expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('7');
            });
            it('click event call', function () {
                var spyFn = jasmine.createSpy('click');
                pagerObj.click = spyFn;
                pagerObj.goToPage(3);
                expect(spyFn).toHaveBeenCalled();
            });
            it('Navigate unavailable page testing', function () {
                pagerObj.goToPage(23);
                expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('3');
            });
            it('Goto page testing', function () {
                pagerObj.goToPage(13);
                first = pagerObj.element.querySelectorAll('.e-first')[0];
                prev = pagerObj.element.querySelectorAll('.e-prev')[0];
                PP = pagerObj.element.querySelectorAll('.e-pp')[0];
                NP = pagerObj.element.querySelectorAll('.e-np')[0];
                next = pagerObj.element.querySelectorAll('.e-next')[0];
                last = pagerObj.element.querySelectorAll('.e-last')[0];
                expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('13');
                expect(first.classList.contains('e-firstpagedisabled')).toEqual(false);
                expect(first.classList.contains('e-disable')).toEqual(false);
                expect(first.classList.contains('e-firstpage')).toEqual(true);
                expect(prev.classList.contains('e-prevpagedisabled')).toEqual(false);
                expect(prev.classList.contains('e-disable')).toEqual(false);
                expect(prev.classList.contains('e-prevpage')).toEqual(true);
                expect(PP.classList.contains('e-nextprevitemdisabled')).toEqual(false);
                expect(PP.classList.contains('e-disable')).toEqual(false);
                expect(PP.classList.contains('e-numericitem')).toEqual(true);
                expect(NP.classList.contains('e-nextprevitemdisabled')).toEqual(false);
                expect(NP.classList.contains('e-disable')).toEqual(false);
                expect(NP.classList.contains('e-numericitem')).toEqual(true);
                expect(next.classList.contains('e-nextpagedisabled')).toEqual(false);
                expect(next.classList.contains('e-disable')).toEqual(false);
                expect(next.classList.contains('e-nextpage')).toEqual(true);
                expect(last.classList.contains('e-lastpagedisabled')).toEqual(false);
                expect(last.classList.contains('e-disable')).toEqual(false);
                expect(last.classList.contains('e-lastpage')).toEqual(true);
            });
            it('Prev page testing', function () {
                prev.click();
                expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('12');
                expect(first.classList.contains('e-firstpagedisabled')).toEqual(false);
                expect(first.classList.contains('e-disable')).toEqual(false);
                expect(first.classList.contains('e-firstpage')).toEqual(true);
                expect(prev.classList.contains('e-prevpagedisabled')).toEqual(false);
                expect(prev.classList.contains('e-disable')).toEqual(false);
                expect(prev.classList.contains('e-prevpage')).toEqual(true);
                expect(PP.classList.contains('e-nextprevitemdisabled')).toEqual(false);
                expect(PP.classList.contains('e-disable')).toEqual(false);
                expect(PP.classList.contains('e-numericitem')).toEqual(true);
                expect(NP.classList.contains('e-nextprevitemdisabled')).toEqual(false);
                expect(NP.classList.contains('e-disable')).toEqual(false);
                expect(NP.classList.contains('e-numericitem')).toEqual(true);
                expect(next.classList.contains('e-nextpagedisabled')).toEqual(false);
                expect(next.classList.contains('e-disable')).toEqual(false);
                expect(next.classList.contains('e-nextpage')).toEqual(true);
                expect(last.classList.contains('e-lastpagedisabled')).toEqual(false);
                expect(last.classList.contains('e-disable')).toEqual(false);
                expect(last.classList.contains('e-lastpage')).toEqual(true);
            });
            it('First page testing', function () {
                first.click();
                expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('1');
                expect(first.classList.contains('e-firstpagedisabled')).toEqual(true);
                expect(first.classList.contains('e-disable')).toEqual(true);
                expect(first.classList.contains('e-firstpage')).toEqual(false);
                expect(prev.classList.contains('e-prevpagedisabled')).toEqual(true);
                expect(prev.classList.contains('e-disable')).toEqual(true);
                expect(prev.classList.contains('e-prevpage')).toEqual(false);
                expect(PP.classList.contains('e-nextprevitemdisabled')).toEqual(true);
                expect(PP.classList.contains('e-disable')).toEqual(true);
                expect(PP.classList.contains('e-numericitem')).toEqual(false);
                expect(NP.classList.contains('e-nextprevitemdisabled')).toEqual(false);
                expect(NP.classList.contains('e-disable')).toEqual(false);
                expect(NP.classList.contains('e-numericitem')).toEqual(true);
                expect(next.classList.contains('e-nextpagedisabled')).toEqual(false);
                expect(next.classList.contains('e-disable')).toEqual(false);
                expect(next.classList.contains('e-nextpage')).toEqual(true);
                expect(last.classList.contains('e-lastpagedisabled')).toEqual(false);
                expect(last.classList.contains('e-disable')).toEqual(false);
                expect(last.classList.contains('e-lastpage')).toEqual(true);
                first.click();
            });
            it('Next page testing', function () {
                pagerObj.goToPage(13);
                next.click();
                expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('14');
                expect(first.classList.contains('e-firstpagedisabled')).toEqual(false);
                expect(first.classList.contains('e-disable')).toEqual(false);
                expect(first.classList.contains('e-firstpage')).toEqual(true);
                expect(prev.classList.contains('e-prevpagedisabled')).toEqual(false);
                expect(prev.classList.contains('e-disable')).toEqual(false);
                expect(prev.classList.contains('e-prevpage')).toEqual(true);
                expect(PP.classList.contains('e-nextprevitemdisabled')).toEqual(false);
                expect(PP.classList.contains('e-disable')).toEqual(false);
                expect(PP.classList.contains('e-numericitem')).toEqual(true);
                expect(NP.classList.contains('e-nextprevitemdisabled')).toEqual(false);
                expect(NP.classList.contains('e-disable')).toEqual(false);
                expect(NP.classList.contains('e-numericitem')).toEqual(true);
                expect(next.classList.contains('e-nextpagedisabled')).toEqual(false);
                expect(next.classList.contains('e-disable')).toEqual(false);
                expect(next.classList.contains('e-nextpage')).toEqual(true);
                expect(last.classList.contains('e-lastpagedisabled')).toEqual(false);
                expect(last.classList.contains('e-disable')).toEqual(false);
                expect(last.classList.contains('e-lastpage')).toEqual(true);
            });
            it('Last page testing', function () {
                last.click();
                expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('20');
                expect(first.classList.contains('e-firstpagedisabled')).toEqual(false);
                expect(first.classList.contains('e-disable')).toEqual(false);
                expect(first.classList.contains('e-firstpage')).toEqual(true);
                expect(prev.classList.contains('e-prevpagedisabled')).toEqual(false);
                expect(prev.classList.contains('e-disable')).toEqual(false);
                expect(prev.classList.contains('e-prevpage')).toEqual(true);
                expect(PP.classList.contains('e-nextprevitemdisabled')).toEqual(false);
                expect(PP.classList.contains('e-disable')).toEqual(false);
                expect(PP.classList.contains('e-numericitem')).toEqual(true);
                expect(NP.classList.contains('e-nextprevitemdisabled')).toEqual(true);
                expect(NP.classList.contains('e-disable')).toEqual(true);
                expect(NP.classList.contains('e-numericitem')).toEqual(false);
                expect(next.classList.contains('e-nextpagedisabled')).toEqual(true);
                expect(next.classList.contains('e-disable')).toEqual(true);
                expect(next.classList.contains('e-nextpage')).toEqual(false);
                expect(last.classList.contains('e-lastpagedisabled')).toEqual(true);
                expect(last.classList.contains('e-disable')).toEqual(true);
                expect(last.classList.contains('e-lastpage')).toEqual(false);
            });
            it('Prev page set testing', function () {
                pagerObj.goToPage(13);
                PP.click();
                expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('6');
                expect(first.classList.contains('e-firstpagedisabled')).toEqual(false);
                expect(first.classList.contains('e-disable')).toEqual(false);
                expect(first.classList.contains('e-firstpage')).toEqual(true);
                expect(prev.classList.contains('e-prevpagedisabled')).toEqual(false);
                expect(prev.classList.contains('e-disable')).toEqual(false);
                expect(prev.classList.contains('e-prevpage')).toEqual(true);
                expect(PP.classList.contains('e-nextprevitemdisabled')).toEqual(false);
                expect(PP.classList.contains('e-disable')).toEqual(false);
                expect(PP.classList.contains('e-numericitem')).toEqual(true);
                expect(NP.classList.contains('e-nextprevitemdisabled')).toEqual(false);
                expect(NP.classList.contains('e-disable')).toEqual(false);
                expect(NP.classList.contains('e-numericitem')).toEqual(true);
                expect(next.classList.contains('e-nextpagedisabled')).toEqual(false);
                expect(next.classList.contains('e-disable')).toEqual(false);
                expect(next.classList.contains('e-nextpage')).toEqual(true);
                expect(last.classList.contains('e-lastpagedisabled')).toEqual(false);
                expect(last.classList.contains('e-disable')).toEqual(false);
                expect(last.classList.contains('e-lastpage')).toEqual(true);
            });
            it('Prev page set testing', function () {
                pagerObj.goToPage(13);
                NP.click();
                expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('16');
                expect(first.classList.contains('e-firstpagedisabled')).toEqual(false);
                expect(first.classList.contains('e-disable')).toEqual(false);
                expect(first.classList.contains('e-firstpage')).toEqual(true);
                expect(prev.classList.contains('e-prevpagedisabled')).toEqual(false);
                expect(prev.classList.contains('e-disable')).toEqual(false);
                expect(prev.classList.contains('e-prevpage')).toEqual(true);
                expect(PP.classList.contains('e-nextprevitemdisabled')).toEqual(false);
                expect(PP.classList.contains('e-disable')).toEqual(false);
                expect(PP.classList.contains('e-numericitem')).toEqual(true);
                expect(NP.classList.contains('e-nextprevitemdisabled')).toEqual(true);
                expect(NP.classList.contains('e-disable')).toEqual(true);
                expect(NP.classList.contains('e-numericitem')).toEqual(false);
                expect(next.classList.contains('e-nextpagedisabled')).toEqual(false);
                expect(next.classList.contains('e-disable')).toEqual(false);
                expect(next.classList.contains('e-nextpage')).toEqual(true);
                expect(last.classList.contains('e-lastpagedisabled')).toEqual(false);
                expect(last.classList.contains('e-disable')).toEqual(false);
                expect(last.classList.contains('e-lastpage')).toEqual(true);
            });
            afterAll(function () {
                pagerObj.destroy();
                elem.remove();
            });
        });
        describe('numericcontainer method testing', function () {
            var pagerObj;
            var elem = dom_1.createElement('div', { id: 'Pager' });
            beforeAll(function (done) {
                var created = function () { done(); };
                document.body.appendChild(elem);
                pagerObj = new pager_1.Pager({
                    totalRecordsCount: 5, currentPage: 1, pageCount: 5, pageSize: 5, enablePagerMessage: false,
                    enableExternalMessage: true, externalMessage: '', created: created
                });
                pagerObj.appendTo('#Pager');
            });
            it('current page testing', function () {
                pagerObj.currentPage = 2;
                pagerObj.dataBind();
                pagerObj.refresh();
                expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('1');
            });
            afterAll(function () {
                pagerObj.destroy();
                elem.remove();
            });
        });
        describe('numericcontainer method testing', function () {
            var pagerObj;
            var elem = dom_1.createElement('div', { id: 'Pager' });
            beforeAll(function (done) {
                var created = function () { done(); };
                document.body.appendChild(elem);
                pagerObj = new pager_1.Pager({
                    totalRecordsCount: 15, currentPage: 3, pageCount: 5, pageSize: 5, enablePagerMessage: false,
                    enableExternalMessage: true, externalMessage: '', created: created
                });
                pagerObj.appendTo('#Pager');
            });
            it('current page testing', function () {
                pagerObj.currentPage = 5;
                pagerObj.dataBind();
                pagerObj.refresh();
                expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('3');
            });
            afterAll(function () {
                pagerObj.destroy();
                elem.remove();
            });
        });
    });
});
