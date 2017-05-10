define(["require", "exports", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base", "@syncfusion/ej2-base/dom"], function (require, exports, util_1, ej2_base_1, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NumericContainer = (function () {
        function NumericContainer(pagerModule) {
            this.pagerModule = pagerModule;
        }
        NumericContainer.prototype.render = function () {
            this.pagerElement = this.pagerModule.element;
            this.renderNumericContainer();
            this.refreshNumericLinks();
            this.wireEvents();
        };
        NumericContainer.prototype.refresh = function () {
            var pagerObj = this.pagerModule;
            pagerObj.totalPages = (pagerObj.totalRecordsCount % pagerObj.pageSize === 0) ? (pagerObj.totalRecordsCount / pagerObj.pageSize) :
                (parseInt((pagerObj.totalRecordsCount / pagerObj.pageSize).toString(), 10) + 1);
            if (this.links.length) {
                this.updateLinksHtml();
            }
            this.updateStyles();
        };
        NumericContainer.prototype.refreshNumericLinks = function () {
            var link;
            var pagerObj = this.pagerModule;
            var div = pagerObj.element.querySelector('.e-numericcontainer');
            var frag = document.createDocumentFragment();
            div.innerHTML = '';
            for (var i = 1; i <= pagerObj.pageCount; i++) {
                link = dom_1.createElement('a', { className: 'e-link e-numericitem e-spacing e-pager-default', attrs: { role: 'link' } });
                if (pagerObj.currentPage === i) {
                    dom_1.classList(link, ['e-currentitem', 'e-active'], ['e-pager-default']);
                }
                frag.appendChild(link);
            }
            div.appendChild(frag);
            this.links = [].slice.call(div.childNodes);
        };
        NumericContainer.prototype.wireEvents = function () {
            ej2_base_1.EventHandler.add(this.pagerElement, 'click', this.clickHandler, this);
        };
        NumericContainer.prototype.unwireEvents = function () {
            ej2_base_1.EventHandler.remove(this.pagerElement, 'click', this.clickHandler);
        };
        NumericContainer.prototype.destroy = function () {
            this.unwireEvents();
        };
        NumericContainer.prototype.renderNumericContainer = function () {
            this.element = dom_1.createElement('div', { className: 'e-pagercontainer' });
            this.renderFirstNPrev(this.element);
            this.renderPrevPagerSet(this.element);
            this.element.appendChild(dom_1.createElement('div', { className: 'e-numericcontainer' }));
            this.renderNextPagerSet(this.element);
            this.renderNextNLast(this.element);
            this.pagerModule.element.appendChild(this.element);
        };
        NumericContainer.prototype.renderFirstNPrev = function (pagerContainer) {
            this.first = dom_1.createElement('div', {
                className: 'e-first e-icons e-icon-first',
                attrs: {
                    title: this.pagerModule.getLocalizedLabel('firstPageTooltip'),
                    'aria-label': this.pagerModule.getLocalizedLabel('firstPageTooltip')
                }
            });
            this.prev = dom_1.createElement('div', {
                className: 'e-prev e-icons e-icon-prev',
                attrs: {
                    title: this.pagerModule.getLocalizedLabel('previousPageTooltip'),
                    'aria-label': this.pagerModule.getLocalizedLabel('previousPageTooltip')
                }
            });
            dom_1.append([this.first, this.prev], pagerContainer);
        };
        NumericContainer.prototype.renderPrevPagerSet = function (pagerContainer) {
            this.PP = dom_1.createElement('a', {
                className: 'e-link e-pp e-spacing', innerHTML: '...',
                attrs: {
                    title: this.pagerModule.getLocalizedLabel('previousPagerTooltip'), role: 'link',
                    'aria-label': this.pagerModule.getLocalizedLabel('previousPagerTooltip')
                }
            });
            pagerContainer.appendChild(this.PP);
        };
        NumericContainer.prototype.renderNextPagerSet = function (pagerContainer) {
            this.NP = dom_1.createElement('a', {
                className: 'e-link e-np e-spacing',
                innerHTML: '...', attrs: {
                    title: this.pagerModule.getLocalizedLabel('nextPagerTooltip'), role: 'link',
                    'aria-label': this.pagerModule.getLocalizedLabel('nextPagerTooltip')
                }
            });
            pagerContainer.appendChild(this.NP);
        };
        NumericContainer.prototype.renderNextNLast = function (pagerContainer) {
            this.next = dom_1.createElement('div', {
                className: 'e-next e-icons e-icon-next',
                attrs: {
                    title: this.pagerModule.getLocalizedLabel('nextPageTooltip'),
                    'aria-label': this.pagerModule.getLocalizedLabel('nextPageTooltip')
                }
            });
            this.last = dom_1.createElement('div', {
                className: 'e-last e-icons e-icon-last',
                attrs: {
                    title: this.pagerModule.getLocalizedLabel('lastPageTooltip'),
                    'aria-label': this.pagerModule.getLocalizedLabel('lastPageTooltip')
                }
            });
            dom_1.append([this.next, this.last], pagerContainer);
        };
        NumericContainer.prototype.clickHandler = function (e) {
            var pagerObj = this.pagerModule;
            var target = e.target;
            pagerObj.previousPageNo = pagerObj.currentPage;
            if (!target.classList.contains('e-disable') && !util_1.isNullOrUndefined(target.getAttribute('index'))) {
                pagerObj.currentPage = parseInt(target.getAttribute('index'), 10);
                pagerObj.dataBind();
            }
            return false;
        };
        NumericContainer.prototype.updateLinksHtml = function () {
            var pagerObj = this.pagerModule;
            var currentPageSet;
            var pageNo;
            pagerObj.currentPage = pagerObj.totalPages === 1 ? 1 : pagerObj.currentPage;
            if (pagerObj.currentPage > pagerObj.totalPages && pagerObj.totalPages) {
                pagerObj.currentPage = pagerObj.totalPages;
            }
            currentPageSet = parseInt((pagerObj.currentPage / pagerObj.pageCount).toString(), 10);
            if (pagerObj.currentPage % pagerObj.pageCount === 0 && currentPageSet > 0) {
                currentPageSet = currentPageSet - 1;
            }
            for (var i = 0; i < pagerObj.pageCount; i++) {
                pageNo = (currentPageSet * pagerObj.pageCount) + 1 + i;
                if (pageNo <= pagerObj.totalPages) {
                    this.links[i].style.display = '';
                    this.links[i].setAttribute('index', pageNo.toString());
                    this.links[i].innerHTML = !pagerObj.customText ? pageNo.toString() : pagerObj.customText + pageNo;
                    if (pagerObj.currentPage !== pageNo) {
                        this.links[i].classList.add('e-pager-default');
                    }
                    else {
                        this.links[i].classList.remove('e-pager-default');
                    }
                }
                else {
                    this.links[i].style.display = 'none';
                }
                dom_1.classList(this.links[i], [], ['e-currentitem', 'e-active']);
            }
            this.first.setAttribute('index', '1');
            this.last.setAttribute('index', pagerObj.totalPages.toString());
            this.prev.setAttribute('index', (pagerObj.currentPage - 1).toString());
            this.next.setAttribute('index', (pagerObj.currentPage + 1).toString());
            this.pagerElement.querySelector('.e-mfirst').setAttribute('index', '1');
            this.pagerElement.querySelector('.e-mlast').setAttribute('index', pagerObj.totalPages.toString());
            this.pagerElement.querySelector('.e-mprev').setAttribute('index', (pagerObj.currentPage - 1).toString());
            this.pagerElement.querySelector('.e-mnext').setAttribute('index', (pagerObj.currentPage + 1).toString());
            this.PP.setAttribute('index', (parseInt(this.links[0].getAttribute('index'), 10) - pagerObj.pageCount).toString());
            this.NP.setAttribute('index', (parseInt(this.links[this.links.length - 1].getAttribute('index'), 10) + 1).toString());
        };
        NumericContainer.prototype.updateStyles = function () {
            this.updateFirstNPrevStyles();
            this.updatePrevPagerSetStyles();
            this.updateNextPagerSetStyles();
            this.updateNextNLastStyles();
            if (this.links.length) {
                dom_1.classList(this.links[(this.pagerModule.currentPage - 1) % this.pagerModule.pageCount], ['e-currentitem', 'e-active'], []);
            }
        };
        NumericContainer.prototype.updateFirstNPrevStyles = function () {
            var firstPage = ['e-firstpage', 'e-pager-default'];
            var firstPageDisabled = ['e-firstpagedisabled', 'e-disable'];
            var prevPage = ['e-prevpage', 'e-pager-default'];
            var prevPageDisabled = ['e-prevpagedisabled', 'e-disable'];
            if (this.pagerModule.currentPage > 1) {
                dom_1.classList(this.prev, prevPage, prevPageDisabled);
                dom_1.classList(this.first, firstPage, firstPageDisabled);
                dom_1.classList(this.pagerElement.querySelector('.e-mfirst'), firstPage, firstPageDisabled);
                dom_1.classList(this.pagerElement.querySelector('.e-mprev'), prevPage, prevPageDisabled);
            }
            else {
                dom_1.classList(this.prev, prevPageDisabled, prevPage);
                dom_1.classList(this.first, firstPageDisabled, firstPage);
                dom_1.classList(this.pagerElement.querySelector('.e-mprev'), prevPageDisabled, prevPage);
                dom_1.classList(this.pagerElement.querySelector('.e-mfirst'), firstPageDisabled, firstPage);
            }
        };
        NumericContainer.prototype.updatePrevPagerSetStyles = function () {
            if (this.pagerModule.currentPage > this.pagerModule.pageCount) {
                dom_1.classList(this.PP, ['e-numericitem', 'e-pager-default'], ['e-nextprevitemdisabled', 'e-disable']);
            }
            else {
                dom_1.classList(this.PP, ['e-nextprevitemdisabled', 'e-disable'], ['e-numericitem', 'e-pager-default']);
            }
        };
        NumericContainer.prototype.updateNextPagerSetStyles = function () {
            var pagerObj = this.pagerModule;
            var firstPage = this.links[0].innerHTML.replace(pagerObj.customText, '');
            if (!firstPage.length || !this.links.length || (parseInt(firstPage, 10) + pagerObj.pageCount > pagerObj.totalPages)) {
                dom_1.classList(this.NP, ['e-nextprevitemdisabled', 'e-disable'], ['e-numericitem', 'e-pager-default']);
            }
            else {
                dom_1.classList(this.NP, ['e-numericitem', 'e-pager-default'], ['e-nextprevitemdisabled', 'e-disable']);
            }
        };
        NumericContainer.prototype.updateNextNLastStyles = function () {
            var lastPage = ['e-lastpage', 'e-pager-default'];
            var lastPageDisabled = ['e-lastpagedisabled', 'e-disable'];
            var nextPage = ['e-nextpage', 'e-pager-default'];
            var nextPageDisabled = ['e-nextpagedisabled', 'e-disable'];
            var pagerObj = this.pagerModule;
            if (pagerObj.currentPage === pagerObj.totalPages || pagerObj.totalRecordsCount === 0) {
                dom_1.classList(this.last, lastPageDisabled, lastPage);
                dom_1.classList(this.next, nextPageDisabled, nextPage);
                dom_1.classList(this.pagerElement.querySelector('.e-mlast'), lastPageDisabled, lastPage);
                dom_1.classList(this.pagerElement.querySelector('.e-mnext'), nextPageDisabled, nextPage);
            }
            else {
                dom_1.classList(this.last, lastPage, lastPageDisabled);
                dom_1.classList(this.next, nextPage, nextPageDisabled);
                dom_1.classList(this.pagerElement.querySelector('.e-mlast'), lastPage, lastPageDisabled);
                dom_1.classList(this.pagerElement.querySelector('.e-mnext'), nextPage, nextPageDisabled);
            }
        };
        return NumericContainer;
    }());
    exports.NumericContainer = NumericContainer;
});
