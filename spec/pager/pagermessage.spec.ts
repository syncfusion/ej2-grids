/**
 * Pagermessage spec 
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base/dom';
import { Pager } from '../../src/pager/pager';
import '../../node_modules/es6-promise/dist/es6-promise';

describe('Pagermessage module', () => {

    describe('Pager message disable testing', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager({
                totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5, enablePagerMessage: false, created: created
            });
            pagerObj.appendTo('#Pager');
        });

        it('pager message element testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-parentmsgbar').length).toEqual(0);
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
        });

    });

    describe('Pager message method testing', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager({
                totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5, created: created
            });
            pagerObj.appendTo('#Pager');
        });

        it('pagerMessage hide testing', () => {
            pagerObj.pagerMessageModule.hideMessage();
            expect((pagerObj.element.querySelector('.e-pagenomsg') as HTMLElement).style.display).toEqual('none');
            expect((pagerObj.element.querySelector('.e-pagecountmsg') as HTMLElement).style.display).toEqual('none');
        });

        it('pagerMessage show testing', () => {
            pagerObj.pagerMessageModule.showMessage();
            expect((pagerObj.element.querySelector('.e-pagenomsg') as HTMLElement).style.display).not.toEqual('none');
            expect((pagerObj.element.querySelector('.e-pagecountmsg') as HTMLElement).style.display).not.toEqual('none');
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
        });

    });

    describe('Pager message disable testing', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager({
                totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5, enablePagerMessage: false, created: created
            });
            pagerObj.appendTo('#Pager');
        });

        it('pagerMessage element testing', () => {
            pagerObj.pagerMessageModule.hideMessage(); // for coverage
            expect(pagerObj.element.querySelectorAll('.e-pagenomsg').length).toEqual(0);
            expect(pagerObj.element.querySelectorAll('.e-pagecountmsg').length).toEqual(0);
        });

        it('pagerMessage enable testing', () => {
            pagerObj.enablePagerMessage = true;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-pagenomsg').length).toEqual(1);
            expect(pagerObj.element.querySelectorAll('.e-pagecountmsg').length).toEqual(1);
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
        });

    });

});