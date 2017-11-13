import { createElement, append } from '@syncfusion/ej2-base';
var PagerMessage = (function () {
    function PagerMessage(pagerModule) {
        this.pagerModule = pagerModule;
    }
    PagerMessage.prototype.render = function () {
        var div = createElement('div', { className: 'e-parentmsgbar', attrs: { 'aria-label': 'Pager Information' } });
        this.pageNoMsgElem = createElement('span', { className: 'e-pagenomsg', styles: 'textalign:right' });
        this.pageCountMsgElem = createElement('span', { className: 'e-pagecountmsg', styles: 'textalign:right' });
        append([this.pageNoMsgElem, this.pageCountMsgElem], div);
        this.pagerModule.element.appendChild(div);
        this.refresh();
    };
    PagerMessage.prototype.refresh = function () {
        var pagerObj = this.pagerModule;
        this.pageNoMsgElem.textContent = this.format(pagerObj.getLocalizedLabel('currentPageInfo'), [pagerObj.totalRecordsCount === 0 ? 0 :
                pagerObj.currentPage, pagerObj.totalPages || 0]) + ' ';
        this.pageCountMsgElem.textContent = this.format(pagerObj.getLocalizedLabel('totalItemsInfo'), [pagerObj.totalRecordsCount || 0]);
        this.pageNoMsgElem.parentElement.setAttribute('aria-label', this.pageNoMsgElem.textContent + this.pageCountMsgElem.textContent);
    };
    PagerMessage.prototype.hideMessage = function () {
        if (this.pageNoMsgElem) {
            this.pageNoMsgElem.style.display = 'none';
        }
        if (this.pageCountMsgElem) {
            this.pageCountMsgElem.style.display = 'none';
        }
    };
    PagerMessage.prototype.showMessage = function () {
        if (!this.pageNoMsgElem) {
            this.render();
        }
        this.pageNoMsgElem.style.display = '';
        this.pageCountMsgElem.style.display = '';
    };
    PagerMessage.prototype.destroy = function () {
    };
    PagerMessage.prototype.format = function (str, args) {
        var regx;
        for (var i = 0; i < args.length; i++) {
            regx = new RegExp('\\{' + (i) + '\\}', 'gm');
            str = str.replace(regx, args[i].toString());
        }
        return str;
    };
    return PagerMessage;
}());
export { PagerMessage };
