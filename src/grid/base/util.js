define(["require", "exports", "@syncfusion/ej2-base", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/dom", "../models/column"], function (require, exports, ej2_base_1, util_1, dom_1, column_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function doesImplementInterface(target, checkFor) {
        return target.prototype && checkFor in target.prototype;
    }
    exports.doesImplementInterface = doesImplementInterface;
    function valueAccessor(field, data, column) {
        field = util_1.isNullOrUndefined(field) ? '' : field;
        return util_1.getValue(field, data);
    }
    exports.valueAccessor = valueAccessor;
    function getUpdateUsingRaf(updateFunction, callBack) {
        requestAnimationFrame(function () {
            try {
                callBack(null, updateFunction());
            }
            catch (e) {
                callBack(e);
            }
        });
    }
    exports.getUpdateUsingRaf = getUpdateUsingRaf;
    function iterateArrayOrObject(collection, predicate) {
        var result = [];
        for (var i = 0, len = collection.length; i < len; i++) {
            var pred = predicate(collection[i], i);
            if (!util_1.isNullOrUndefined(pred)) {
                result.push(pred);
            }
        }
        return result;
    }
    exports.iterateArrayOrObject = iterateArrayOrObject;
    function setStyleAndAttributes(node, customAttributes) {
        var copyAttr = {};
        var literals = ['style', 'class'];
        util_1.extend(copyAttr, customAttributes, {});
        if ('style' in copyAttr) {
            dom_1.setStyleAttribute(node, copyAttr[literals[0]]);
            delete copyAttr[literals[0]];
        }
        if ('class' in copyAttr) {
            dom_1.addClass([node], copyAttr[literals[1]]);
            delete copyAttr[literals[1]];
        }
        dom_1.attributes(node, copyAttr);
    }
    exports.setStyleAndAttributes = setStyleAndAttributes;
    function extend(copied, first, second, exclude) {
        var moved = util_1.extend(copied, first, second);
        Object.keys(moved).forEach(function (value, index) {
            if (exclude.indexOf(value) !== -1) {
                delete moved[value];
            }
        });
        return moved;
    }
    exports.extend = extend;
    function prepareColumns(columns) {
        for (var c = 0, len = columns.length; c < len; c++) {
            var column = void 0;
            if (typeof columns[c] === 'string') {
                column = new column_1.Column({ field: columns[c] });
            }
            else if (!(columns[c] instanceof column_1.Column)) {
                if (!columns[c].columns) {
                    column = new column_1.Column(columns[c]);
                }
                else {
                    column = new column_1.Column(columns[c]);
                    columns[c].columns = prepareColumns(columns[c].columns);
                }
            }
            else {
                column = columns[c];
            }
            column.headerText = util_1.isNullOrUndefined(column.headerText) ? column.field || '' : column.headerText;
            column.valueAccessor = column.valueAccessor || valueAccessor;
            if (util_1.isNullOrUndefined(column.visible)) {
                column.visible = true;
            }
            columns[c] = column;
        }
        return columns;
    }
    exports.prepareColumns = prepareColumns;
    function setCssInGridPopUp(popUp, e, className) {
        var popUpSpan = popUp.querySelector('span');
        var position = popUp.parentElement.getBoundingClientRect();
        var targetPosition = e.target.getBoundingClientRect();
        var isBottomTail;
        popUpSpan.className = className;
        popUp.style.display = '';
        isBottomTail = (util_1.isNullOrUndefined(e.clientY) ? e.changedTouches[0].clientY :
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
    exports.setCssInGridPopUp = setCssInGridPopUp;
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
    function getActualProperties(obj) {
        if (obj instanceof ej2_base_1.ChildProperty) {
            return util_1.getValue('properties', obj);
        }
        else {
            return obj;
        }
    }
    exports.getActualProperties = getActualProperties;
    function parentsUntil(elem, selector, isID) {
        var parent = elem;
        while (parent) {
            if (isID ? parent.id === selector : parent.classList.contains(selector)) {
                break;
            }
            parent = parent.parentElement;
        }
        return parent;
    }
    exports.parentsUntil = parentsUntil;
    function getElementIndex(element, elements) {
        var index = -1;
        for (var i = 0, len = elements.length; i < len; i++) {
            if (elements[i].isEqualNode(element)) {
                index = i;
                break;
            }
        }
        return index;
    }
    exports.getElementIndex = getElementIndex;
    function inArray(value, collection) {
        for (var i = 0, len = collection.length; i < len; i++) {
            if (collection[i] === value) {
                return i;
            }
        }
        return -1;
    }
    exports.inArray = inArray;
    function getActualPropFromColl(collection) {
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
    exports.getActualPropFromColl = getActualPropFromColl;
    function removeElement(target, selector) {
        var elements = [].slice.call(target.querySelectorAll(selector));
        for (var i = 0; i < elements.length; i++) {
            elements[i].parentElement.removeChild(elements[i]);
        }
    }
    exports.removeElement = removeElement;
    function getPosition(e) {
        var position = {};
        position.x = (util_1.isNullOrUndefined(e.clientX) ? e.changedTouches[0].clientX :
            e.clientX);
        position.y = (util_1.isNullOrUndefined(e.clientY) ? e.changedTouches[0].clientY :
            e.clientY);
        return position;
    }
    exports.getPosition = getPosition;
    var uid = 0;
    function getUid(prefix) {
        return prefix + uid++;
    }
    exports.getUid = getUid;
});
