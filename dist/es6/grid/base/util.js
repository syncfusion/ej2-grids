import { ChildProperty, compile as baseTemplateComplier, classList } from '@syncfusion/ej2-base';
import { extend as baseExtend, isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { setStyleAttribute, addClass, attributes, createElement, remove } from '@syncfusion/ej2-base';
import { DataUtil } from '@syncfusion/ej2-data';
import { Column } from '../models/column';
import { calculateRelativeBasedPosition } from '@syncfusion/ej2-popups';
export function doesImplementInterface(target, checkFor) {
    return target.prototype && checkFor in target.prototype;
}
export function valueAccessor(field, data, column) {
    field = isNullOrUndefined(field) ? '' : field;
    return getValue(field, data);
}
export function getUpdateUsingRaf(updateFunction, callBack) {
    requestAnimationFrame(function () {
        try {
            callBack(null, updateFunction());
        }
        catch (e) {
            callBack(e);
        }
    });
}
export function iterateArrayOrObject(collection, predicate) {
    var result = [];
    for (var i = 0, len = collection.length; i < len; i++) {
        var pred = predicate(collection[i], i);
        if (!isNullOrUndefined(pred)) {
            result.push(pred);
        }
    }
    return result;
}
export function templateCompiler(template) {
    if (template) {
        var e = void 0;
        try {
            if (document.querySelectorAll(template).length) {
                return baseTemplateComplier(document.querySelector(template).innerHTML.trim());
            }
        }
        catch (e) {
            return baseTemplateComplier(template);
        }
    }
    return undefined;
}
export function setStyleAndAttributes(node, customAttributes) {
    var copyAttr = {};
    var literals = ['style', 'class'];
    baseExtend(copyAttr, customAttributes, {});
    if ('style' in copyAttr) {
        setStyleAttribute(node, copyAttr[literals[0]]);
        delete copyAttr[literals[0]];
    }
    if ('class' in copyAttr) {
        addClass([node], copyAttr[literals[1]]);
        delete copyAttr[literals[1]];
    }
    attributes(node, copyAttr);
}
export function extend(copied, first, second, exclude) {
    var moved = baseExtend(copied, first, second);
    Object.keys(moved).forEach(function (value, index) {
        if (exclude.indexOf(value) !== -1) {
            delete moved[value];
        }
    });
    return moved;
}
export function prepareColumns(columns, autoWidth) {
    for (var c = 0, len = columns.length; c < len; c++) {
        var column = void 0;
        if (typeof columns[c] === 'string') {
            column = new Column({ field: columns[c] });
        }
        else if (!(columns[c] instanceof Column)) {
            if (!columns[c].columns) {
                column = new Column(columns[c]);
            }
            else {
                column = new Column(columns[c]);
                columns[c].columns = prepareColumns(columns[c].columns);
            }
        }
        else {
            column = columns[c];
        }
        column.headerText = isNullOrUndefined(column.headerText) ? column.field || '' : column.headerText;
        column.valueAccessor = column.valueAccessor || valueAccessor;
        column.width = autoWidth && isNullOrUndefined(column.width) ? 200 : column.width;
        if (isNullOrUndefined(column.visible)) {
            column.visible = true;
        }
        columns[c] = column;
    }
    return columns;
}
export function setCssInGridPopUp(popUp, e, className) {
    var popUpSpan = popUp.querySelector('span');
    var position = popUp.parentElement.getBoundingClientRect();
    var targetPosition = e.target.getBoundingClientRect();
    var isBottomTail;
    popUpSpan.className = className;
    popUp.style.display = '';
    isBottomTail = (isNullOrUndefined(e.clientY) ? e.changedTouches[0].clientY :
        e.clientY) > popUp.offsetHeight + 10;
    popUp.style.top = targetPosition.top - position.top +
        (isBottomTail ? -(popUp.offsetHeight + 10) : popUp.offsetHeight + 10) + 'px';
    popUp.style.left = getPopupLeftPosition(popUp, e, targetPosition, position.left) + 'px';
    if (isBottomTail) {
        popUp.querySelector('.e-downtail').style.display = '';
        popUp.querySelector('.e-uptail').style.display = 'none';
    }
    else {
        popUp.querySelector('.e-downtail').style.display = 'none';
        popUp.querySelector('.e-uptail').style.display = '';
    }
}
function getPopupLeftPosition(popup, e, targetPosition, left) {
    var width = popup.offsetWidth / 2;
    var x = getPosition(e).x;
    if (x - targetPosition.left < width) {
        return targetPosition.left - left;
    }
    else if (targetPosition.right - x < width) {
        return targetPosition.right - left - width * 2;
    }
    else {
        return x - left - width;
    }
}
export function getActualProperties(obj) {
    if (obj instanceof ChildProperty) {
        return getValue('properties', obj);
    }
    else {
        return obj;
    }
}
export function parentsUntil(elem, selector, isID) {
    var parent = elem;
    while (parent) {
        if (isID ? parent.id === selector : parent.classList.contains(selector)) {
            break;
        }
        parent = parent.parentElement;
    }
    return parent;
}
export function getElementIndex(element, elements) {
    var index = -1;
    for (var i = 0, len = elements.length; i < len; i++) {
        if (elements[i].isEqualNode(element)) {
            index = i;
            break;
        }
    }
    return index;
}
export function inArray(value, collection) {
    for (var i = 0, len = collection.length; i < len; i++) {
        if (collection[i] === value) {
            return i;
        }
    }
    return -1;
}
export function getActualPropFromColl(collection) {
    var coll = [];
    for (var i = 0, len = collection.length; i < len; i++) {
        if (collection[i].hasOwnProperty('properties')) {
            coll.push(collection[i].properties);
        }
        else {
            coll.push(collection[i]);
        }
    }
    return coll;
}
export function removeElement(target, selector) {
    var elements = [].slice.call(target.querySelectorAll(selector));
    for (var i = 0; i < elements.length; i++) {
        remove(elements[i]);
    }
}
export function getPosition(e) {
    var position = {};
    position.x = (isNullOrUndefined(e.clientX) ? e.changedTouches[0].clientX :
        e.clientX);
    position.y = (isNullOrUndefined(e.clientY) ? e.changedTouches[0].clientY :
        e.clientY);
    return position;
}
var uid = 0;
export function getUid(prefix) {
    return prefix + uid++;
}
export function appendChildren(elem, children) {
    for (var i = 0, len = children.length; i < len; i++) {
        if (len === children.length) {
            elem.appendChild(children[i]);
        }
        else {
            elem.appendChild(children[0]);
        }
    }
    return elem;
}
export function parents(elem, selector, isID) {
    var parent = elem;
    var parents = [];
    while (parent) {
        if (isID ? parent.id === selector : parent.classList.contains(selector)) {
            parents.push(parent);
        }
        parent = parent.parentElement;
    }
    return parents;
}
export function calculateAggregate(type, data, column, context) {
    if (type === 'custom') {
        return column.customAggregate ? column.customAggregate.call(context, data, column) : '';
    }
    return DataUtil.aggregates[type](data, column.field);
}
var scrollWidth = null;
export function getScrollBarWidth() {
    if (scrollWidth !== null) {
        return scrollWidth;
    }
    var divNode = document.createElement('div');
    var value = 0;
    divNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
    document.body.appendChild(divNode);
    value = (divNode.offsetWidth - divNode.clientWidth) | 0;
    document.body.removeChild(divNode);
    return scrollWidth = value;
}
var rowHeight;
export function getRowHeight(element) {
    if (rowHeight !== undefined) {
        return rowHeight;
    }
    var table = createElement('table', { className: 'e-table', styles: 'visibility: hidden' });
    table.innerHTML = '<tr><td class="e-rowcell">A<td></tr>';
    element.appendChild(table);
    var rect = table.querySelector('td').getBoundingClientRect();
    element.removeChild(table);
    rowHeight = Math.ceil(rect.height);
    return rowHeight;
}
export function isEditable(col, type, elem) {
    var row = parentsUntil(elem, 'e-row');
    var isOldRow = !row ? true : row && !row.classList.contains('e-insertedrow');
    if (type === 'beginEdit' && isOldRow) {
        if (col.isIdentity || col.isPrimaryKey || !col.allowEditing) {
            return false;
        }
        return true;
    }
    else {
        if (isOldRow && !col.allowEditing && !col.isIdentity && !col.isPrimaryKey) {
            return false;
        }
        return true;
    }
}
export function isActionPrevent(inst) {
    var dlg = inst.element.querySelector('#' + inst.element.id + 'EditConfirm');
    return inst.editSettings.mode === 'batch' &&
        (inst.element.querySelectorAll('.e-updatedtd').length) &&
        (dlg ? dlg.classList.contains('e-popup-close') : true);
}
export function wrap(elem, action) {
    var clName = 'e-wrap';
    elem = elem instanceof Array ? elem : [elem];
    for (var i = 0; i < elem.length; i++) {
        action ? elem[i].classList.add(clName) : elem[i].classList.remove(clName);
    }
}
export function changeButtonType(target) {
    var elements = [].slice.call(target.querySelectorAll('button'));
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var button = elements_1[_i];
        attributes(button, { type: 'button' });
    }
}
export function setFormatter(serviceLocator, column) {
    var fmtr = serviceLocator.getService('valueFormatter');
    switch (column.type) {
        case 'date':
            column.setFormatter(fmtr.getFormatFunction({ type: 'date', skeleton: column.format }));
            column.setParser(fmtr.getParserFunction({ type: 'date', skeleton: column.format }));
            break;
        case 'datetime':
            column.setFormatter(fmtr.getFormatFunction({ type: 'dateTime', skeleton: column.format }));
            column.setParser(fmtr.getParserFunction({ type: 'dateTime', skeleton: column.format }));
            break;
        case 'number':
            column.setFormatter(fmtr.getFormatFunction({ format: column.format }));
            column.setParser(fmtr.getParserFunction({ format: column.format }));
            break;
    }
}
export function addRemoveActiveClasses(cells, add) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    for (var i = 0, len = cells.length; i < len; i++) {
        if (add) {
            classList(cells[i], args.slice(), []);
            cells[i].setAttribute('aria-selected', 'true');
        }
        else {
            classList(cells[i], [], args.slice());
            cells[i].removeAttribute('aria-selected');
        }
    }
}
export function distinctStringValues(result) {
    var temp = {};
    var res = [];
    for (var i = 0; i < result.length; i++) {
        if (!(result[i] in temp)) {
            res.push(result[i].toString());
            temp[result[i]] = 1;
        }
    }
    return res;
}
export function getFilterMenuPostion(target, dialogObj) {
    var elementVisible = dialogObj.element.style.display;
    dialogObj.element.style.display = 'block';
    var dlgWidth = dialogObj.width;
    var newpos = calculateRelativeBasedPosition(target, dialogObj.element);
    dialogObj.element.style.display = elementVisible;
    dialogObj.element.style.top = (newpos.top + target.getBoundingClientRect().height) - 5 + 'px';
    var leftPos = ((newpos.left - dlgWidth) + target.clientWidth);
    if (leftPos < 1) {
        dialogObj.element.style.left = (dlgWidth + leftPos) - 16 + 'px';
    }
    else {
        dialogObj.element.style.left = leftPos + -4 + 'px';
    }
}
export function getZIndexCalcualtion(args, dialogObj) {
    args.popup.element.style.zIndex = (dialogObj.zIndex + 1).toString();
}
export function toogleCheckbox(elem) {
    var span = elem.querySelector('.e-frame');
    span.classList.contains('e-check') ? classList(span, ['e-uncheck'], ['e-check']) :
        classList(span, ['e-check'], ['e-uncheck']);
}
export function createCboxWithWrap(uid, elem, className) {
    var div = createElement('div', { className: className });
    div.appendChild(elem);
    div.setAttribute('uid', uid);
    return div;
}
