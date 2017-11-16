import { createElement, isNullOrUndefined, addClass } from '@syncfusion/ej2-base';
var InlineEditRender = (function () {
    function InlineEditRender(parent) {
        this.parent = parent;
    }
    InlineEditRender.prototype.addNew = function (elements, args) {
        var tbody = this.parent.getContentTable().querySelector('tbody');
        args.row = createElement('tr', { className: 'e-row e-addedrow' });
        tbody.insertBefore(args.row, tbody.firstChild);
        args.row.appendChild(this.getEditElement(elements, false));
    };
    InlineEditRender.prototype.update = function (elements, args) {
        var tdElement = [].slice.call(args.row.querySelectorAll('td.e-rowcell'));
        args.row.innerHTML = '';
        args.row.appendChild(this.getEditElement(elements, true, tdElement));
        args.row.classList.add('e-editedrow');
    };
    InlineEditRender.prototype.getEditElement = function (elements, isEdit, tdElement) {
        var gObj = this.parent;
        var gLen = 0;
        var isDetail = !isNullOrUndefined(gObj.detailTemplate) || !isNullOrUndefined(gObj.childGrid) ? 1 : 0;
        if (gObj.allowGrouping) {
            gLen = gObj.groupSettings.columns.length;
        }
        var td = createElement('td', {
            className: 'e-editcell e-normaledit',
            attrs: { colspan: (gObj.getVisibleColumns().length + gLen + isDetail).toString() }
        });
        var form = createElement('form', { id: gObj.element.id + 'EditForm', className: 'e-gridform' });
        var table = createElement('table', { className: 'e-table e-inline-edit', attrs: { cellspacing: '0.25' } });
        table.appendChild(gObj.getContentTable().querySelector('colgroup').cloneNode(true));
        var tbody = createElement('tbody');
        var tr = createElement('tr');
        var i = 0;
        if (isDetail) {
            tr.insertBefore(createElement('td', { className: 'e-detailrowcollapse' }), tr.firstChild);
        }
        while (i < gLen) {
            tr.appendChild(createElement('td', { className: 'e-indentcell' }));
            i++;
        }
        var m = 0;
        i = 0;
        while ((isEdit && m < tdElement.length && i < gObj.columns.length) || i < gObj.columns.length) {
            var span = isEdit ? tdElement[m].getAttribute('colspan') : null;
            var col = gObj.columns[i];
            if (col.visible) {
                var td_1 = createElement('td', {
                    className: 'e-rowcell', attrs: { style: 'text-align:' + (col.textAlign ? col.textAlign : ''), 'colspan': span ? span : '' }
                });
                td_1.appendChild(elements[col.uid]);
                if (col.editType === 'booleanedit') {
                    td_1.classList.add('e-boolcell');
                }
                else if (col.commands || col.commandsTemplate) {
                    addClass([td_1], 'e-unboundcell');
                }
                tr.appendChild(td_1);
            }
            i = span ? i + parseInt(span, 10) : i + 1;
            m++;
        }
        tbody.appendChild(tr);
        table.appendChild(tbody);
        form.appendChild(table);
        td.appendChild(form);
        return td;
    };
    return InlineEditRender;
}());
export { InlineEditRender };
