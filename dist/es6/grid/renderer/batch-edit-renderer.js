import { createElement, classList } from '@syncfusion/ej2-base';
var BatchEditRender = (function () {
    function BatchEditRender(parent) {
        this.parent = parent;
    }
    BatchEditRender.prototype.update = function (elements, args) {
        args.cell.innerHTML = '';
        args.cell.appendChild(this.getEditElement(elements, args));
        args.cell.classList.add('e-editedbatchcell');
        classList(args.row, ['e-editedrow', 'e-batchrow'], []);
    };
    BatchEditRender.prototype.getEditElement = function (elements, args) {
        var gObj = this.parent;
        var form = createElement('form', { id: gObj.element.id + 'EditForm', className: 'e-gridform' });
        form.appendChild(elements[args.columnObject.uid]);
        if (args.columnObject.editType === 'booleanedit') {
            args.cell.classList.add('e-boolcell');
        }
        if (!args.columnObject.editType) {
            args.cell.classList.add('e-inputbox');
        }
        return form;
    };
    return BatchEditRender;
}());
export { BatchEditRender };
