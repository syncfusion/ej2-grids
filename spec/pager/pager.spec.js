define(["require", "exports", "@syncfusion/ej2-base", "@syncfusion/ej2-base/dom", "../../src/pager/pager", "../../src/pager/external-message", "../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, ej2_base_1, dom_1, pager_1, external_message_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    pager_1.Pager.Inject(external_message_1.ExternalMessage);
    describe('Pager base module', function () {
        describe('Pager properties testing', function () {
            var pagerObj;
            var elem = dom_1.createElement('div', { id: 'Pager' });
            beforeAll(function (done) {
                ej2_base_1.L10n.load({
                    'de-DE': {
                        'pager': {
                            'currentPageInfo': '{0} van {1} pagina',
                            'totalItemsInfo': '( {0} items)',
                            'firstPageTooltip': 'Ga naar de eerste pagina',
                            'lastPageTooltip': 'Ga naar de laatste pagina',
                            'nextPageTooltip': 'Ga naar de volgende pagina',
                            'previousPageTooltip': 'Ga naar de vorige pagina',
                            'nextPagerTooltip': 'Ga naar de volgende pager',
                            'previousPagerTooltip': 'Ga naar vorige pager'
                        }
                    }
                });
                var created = function () { done(); };
                document.body.appendChild(elem);
                pagerObj = new pager_1.Pager({
                    totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5, locale: 'de-DE',
                    enablePagerMessage: true, enableExternalMessage: true, externalMessage: 'externalMessage',
                    enableRtl: true, enableQueryString: true, customText: 'sheet',
                    created: created
                });
                pagerObj.appendTo('#Pager');
            });
            it('current page testing', function () {
                expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('8');
            });
            it('page count testing', function () {
                expect(pagerObj.element.querySelectorAll('.e-numericcontainer')[0].childNodes.length).toEqual(5);
            });
            it('enable pager message element testing', function () {
                expect(pagerObj.element.querySelectorAll('.e-parentmsgbar').length).toEqual(1);
            });
            it('enable pager message testing', function () {
                expect(pagerObj.element.querySelectorAll('.e-parentmsgbar')[0].textContent).toEqual('8 van 20 pagina ( 100 items)');
            });
            it('enable pager external message element testing', function () {
                expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg').length).toEqual(1);
            });
            it('enable pager external message testing', function () {
                expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg')[0].textContent).toEqual('externalMessage');
            });
            it('class testing', function () {
                expect(pagerObj.element.classList.contains('e-pager')).toEqual(true);
            });
            it('rtl testing', function () {
                expect(pagerObj.element.classList.contains('e-rtl')).toEqual(true);
            });
            it('custom text testing', function () {
                expect(pagerObj.element.querySelectorAll('.e-active')[0].textContent).toEqual('sheet8');
            });
            it('current page value testing', function () {
                expect(pagerObj.currentPage).toEqual(8);
            });
            it('totalRecordsCount value testing', function () {
                expect(pagerObj.totalRecordsCount).toEqual(100);
            });
            it('pageCount value testing', function () {
                expect(pagerObj.pageCount).toEqual(5);
            });
            it('pageSize value testing', function () {
                expect(pagerObj.pageSize).toEqual(5);
            });
            it('enableExternalMessage value testing', function () {
                expect(pagerObj.enableExternalMessage).toEqual(true);
            });
            it('enablePagerMessage value testing', function () {
                expect(pagerObj.enablePagerMessage).toEqual(true);
            });
            it('externalMessage value testing', function () {
                expect(pagerObj.externalMessage).toEqual('externalMessage');
            });
            it('enableRtl value testing', function () {
                expect(pagerObj.enableRtl).toEqual(true);
            });
            it('enableQueryString value testing', function () {
                expect(pagerObj.enableQueryString).toEqual(true);
            });
            it('locale value testing', function () {
                expect(pagerObj.locale).toEqual('de-DE');
            });
            it('querystring testing', function () {
                pagerObj.goToPage(10);
                expect(window.location.href.indexOf('?page=10')).toBeGreaterThan(-1);
            });
            it('pager button visibility testing', function () {
                expect(pagerObj.element.querySelectorAll('.e-disable').length).toEqual(0);
            });
            afterAll(function () {
                pagerObj.destroy();
                elem.remove();
            });
        });
        describe('Empty pager control testing', function () {
            var pagerObj;
            var elem = dom_1.createElement('div', { id: 'Pager' });
            beforeAll(function (done) {
                var created = function () { done(); };
                document.body.appendChild(elem);
                pagerObj = new pager_1.Pager({ created: created });
                pagerObj.appendTo('#Pager');
            });
            it('pager message testing', function () {
                expect(pagerObj.element.querySelectorAll('.e-parentmsgbar')[0].textContent).toEqual('0 of 0 pages (0 items)');
            });
            it('disabled element testing', function () {
                expect(pagerObj.element.querySelectorAll('.e-disable').length).toEqual(10);
            });
            it('numericcontainer element testing', function () {
                expect(pagerObj.element.querySelectorAll('.e-numericcontainer')[0].childNodes.length).toEqual(10);
            });
            it('pager message element testing', function () {
                expect(pagerObj.element.querySelectorAll('.e-parentmsgbar').length).toEqual(1);
            });
            it('pager external message element testing', function () {
                expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg').length).toEqual(0);
            });
            afterAll(function () {
                pagerObj.destroy();
                elem.remove();
            });
        });
        describe('Method testing', function () {
            var pagerObj;
            var elem = dom_1.createElement('div', { id: 'Pager' });
            beforeAll(function (done) {
                document.body.appendChild(elem);
                pagerObj = new pager_1.Pager({
                    totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5,
                });
                pagerObj.appendTo('#Pager');
                setTimeout(function () { done(); }, 1000);
            });
            it('getPersistData testing', function () {
                expect(pagerObj.getPersistData()).toEqual('{"enableExternalMessage":false,"enablePagerMessage":true,"currentPage":8,"pageSize":5,"pageCount":5,"totalRecordsCount":100,"customText":""}');
            });
            it('getLocalizedLabel testing', function () {
                expect(pagerObj.getLocalizedLabel('firstPageTooltip')).toEqual('Go to first page');
            });
            afterAll(function () {
                pagerObj.destroy();
                elem.remove();
            });
        });
        describe('pager onproperty changed', function () {
            var pagerObj;
            var elem = dom_1.createElement('div', { id: 'Pager' });
            beforeAll(function (done) {
                var created = function () { done(); };
                document.body.appendChild(elem);
                pagerObj = new pager_1.Pager({
                    totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5,
                    enablePagerMessage: true, enableExternalMessage: true, externalMessage: 'externalMessage',
                    enableRtl: true, enableQueryString: true, customText: 'sheet',
                    created: created
                });
                pagerObj.appendTo('#Pager');
            });
            it('totalRecordsCount testing', function () {
                pagerObj.totalRecordsCount = 200;
                pagerObj.dataBind();
                expect(pagerObj.element.querySelectorAll('.e-parentmsgbar')[0].textContent).toEqual('8 of 40 pages (200 items)');
            });
            it('pageSize testing', function () {
                pagerObj.pageSize = 6;
                pagerObj.dataBind();
                expect(pagerObj.element.querySelectorAll('.e-parentmsgbar')[0].textContent).toEqual('8 of 34 pages (200 items)');
            });
            it('pageCount testing', function () {
                pagerObj.pageCount = 6;
                pagerObj.dataBind();
                expect(pagerObj.element.querySelectorAll('.e-numericcontainer')[0].childNodes.length).toEqual(6);
            });
            it('currentPage testing', function () {
                expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('8');
                pagerObj.currentPage = 13;
                pagerObj.dataBind();
                expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('13');
            });
            it('currentPage invalid value testing', function () {
                pagerObj.currentPage = -1;
                pagerObj.dataBind();
                expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('13');
                pagerObj.currentPage = 13;
                pagerObj.dataBind();
            });
            it('enablePagerMessage false testing', function () {
                pagerObj.enablePagerMessage = false;
                pagerObj.dataBind();
                expect(pagerObj.element.querySelectorAll('.e-parentmsgbar')[0].style.display).toEqual('');
            });
            it('enablePagerMessage true testing', function () {
                pagerObj.enablePagerMessage = true;
                pagerObj.dataBind();
                expect(pagerObj.element.querySelectorAll('.e-parentmsgbar')[0].style.display).not.toEqual('none');
            });
            it('enableExternalMessage false testing', function () {
                pagerObj.enableExternalMessage = false;
                pagerObj.dataBind();
                expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg').length).toEqual(0);
            });
            it('enableExternalMessage true testing', function () {
                pagerObj.enableExternalMessage = true;
                pagerObj.dataBind();
                expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg').length).toEqual(1);
            });
            it('enable pager external message testing', function () {
                pagerObj.externalMessage = 'modified';
                pagerObj.dataBind();
                expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg')[0].textContent).toEqual('modified');
            });
            it('rtl false testing', function () {
                pagerObj.enableRtl = false;
                pagerObj.dataBind();
                expect(pagerObj.element.classList.contains('e-rtl')).toEqual(false);
            });
            it('rtl true testing', function () {
                pagerObj.enableRtl = true;
                pagerObj.dataBind();
                expect(pagerObj.element.classList.contains('e-rtl')).toEqual(true);
            });
            it('custom text testing', function () {
                pagerObj.customText = 'spreadsheet';
                pagerObj.dataBind();
                expect(pagerObj.element.querySelectorAll('.e-active')[0].textContent).toEqual('spreadsheet13');
            });
            it('querystring testing', function () {
                pagerObj.enableQueryString = false;
                pagerObj.dataBind();
                pagerObj.goToPage(14);
                expect(window.location.href.indexOf('?page=14')).not.toBeGreaterThan(-1);
                pagerObj.enableQueryString = true;
                pagerObj.dataBind();
                pagerObj.goToPage(15);
                expect(window.location.href.indexOf('?page=15')).toBeGreaterThan(-1);
            });
            it('locale testing', function () {
                pagerObj.locale = 'de-DE';
                pagerObj.dataBind();
                expect(pagerObj.element.querySelectorAll('.e-parentmsgbar')[0].textContent).toEqual('15 van 34 pagina ( 200 items)');
            });
            afterAll(function () {
                pagerObj.destroy();
                elem.remove();
            });
        });
    });
});
