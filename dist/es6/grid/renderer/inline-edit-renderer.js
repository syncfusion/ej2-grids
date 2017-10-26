import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
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
        args.row.innerHTML = '';
        args.row.appendChild(this.getEditElement(elements, true));
        args.row.classList.add('e-editedrow');
    };
    InlineEditRender.prototype.getEditElement = function (elements, isEdit) {
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
        for (var _i = 0, _a = gObj.columns; _i < _a.length; _i++) {
            var col = _a[_i];
            if (!col.visible) {
                continue;
            }
            var td_1 = createElement('td', {
                className: 'e-rowcell', attrs: { style: 'text-align:' + (col.textAlign ? col.textAlign : '') }
            });
            td_1.appendChild(elements[col.uid]);
            if (col.editType === 'booleanedit') {
                td_1.classList.add('e-boolcell');
            }
            tr.appendChild(td_1);
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
