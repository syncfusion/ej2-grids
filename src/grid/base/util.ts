import { ChildProperty, compile as baseTemplateComplier } from '@syncfusion/ej2-base';
import { extend as baseExtend, isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { setStyleAttribute, addClass, attributes, createElement, remove } from '@syncfusion/ej2-base';
import { IPosition, IGrid } from './interface';
import { DataUtil } from '@syncfusion/ej2-data';
import { Column } from '../models/column';
import { ColumnModel, AggregateColumnModel } from '../models/models';
import { AggregateType } from './enum';


//https://typescript.codeplex.com/discussions/401501
/**
 * Function to check whether target object implement specific interface
 * @param  {Object} target
 * @param  {string} checkFor
 * @returns no
 * @hidden
 */
export function doesImplementInterface(target: Object, checkFor: string): boolean {
    /* tslint:disable:no-any */
    return (<any>target).prototype && checkFor in (<any>target).prototype;
}
/**
 * Function to get value from provided data 
 * @param  {string} field
 * @param  {Object} data
 * @param  {IColumn} column
 * @hidden
 */
export function valueAccessor(field: string, data: Object, column: ColumnModel): Object {
    field = isNullOrUndefined(field) ? '' : field;
    return getValue(field, data);
}

/**
 * The function used to update Dom using requestAnimationFrame.
 * @param  {Function} fn - Function that contains the actual action
 * @return {Promise<T>}
 * @hidden
 */
export function getUpdateUsingRaf<T>(updateFunction: Function, callBack: Function): void {
    requestAnimationFrame(() => {
        try {
            callBack(null, updateFunction());
        } catch (e) {
            callBack(e);
        }
    });
}
/**
 * @hidden
 */
export function iterateArrayOrObject<T, U>(collection: U[], predicate: (item: Object, index: number) => T): T[] {
    let result: T[] = [];
    for (let i: number = 0, len: number = collection.length; i < len; i++) {
        let pred: T = predicate(collection[i], i);
        if (!isNullOrUndefined(pred)) {
            result.push(<T>pred);
        }
    }
    return result;
}

/** @hidden */
export function templateCompiler(template: string): Function {
    if (template) {
        let e: Object;
        try {
            if (document.querySelectorAll(template).length) {
                return baseTemplateComplier(document.querySelector(template).innerHTML.trim());
            }
        } catch (e) {
            return baseTemplateComplier(template);
        }
    }
    return undefined;
}

/** @hidden */
export function setStyleAndAttributes(node: Element, customAttributes: { [x: string]: Object }): void {
    let copyAttr: { [x: string]: Object } = {}; let literals: string[] = ['style', 'class'];

    //Dont touch the original object - make a copy
    baseExtend(copyAttr, customAttributes, {});

    if ('style' in copyAttr) {
        setStyleAttribute(node as HTMLElement, copyAttr[literals[0]] as { [x: string]: Object });
        delete copyAttr[literals[0]];
    }

    if ('class' in copyAttr) {
        addClass([node], copyAttr[literals[1]] as string | string[]);
        delete copyAttr[literals[1]];
    }

    attributes(node, copyAttr as { [x: string]: string });
}
/** @hidden */
export function extend(copied: Object, first: Object, second?: Object, exclude?: string[]): Object {
    let moved: Object = baseExtend(copied, first, second);

    Object.keys(moved).forEach((value: string, index: number) => {
        if (exclude.indexOf(value) !== -1) {
            delete moved[value];
        }
    });

    return moved;
}

/** @hidden */
export function prepareColumns(columns: Column[] | string[] | ColumnModel[], autoWidth?: boolean): Column[] {
    for (let c: number = 0, len: number = columns.length; c < len; c++) {

        let column: Column;

        if (typeof columns[c] === 'string') {
            column = new Column({ field: <string>columns[c] });
        } else if (!(columns[c] instanceof Column)) {
            if (!(columns[c] as Column).columns) {
                column = new Column(columns[c] as Column);
            } else {
                column = new Column(columns[c] as Column);
                (columns[c] as Column).columns = prepareColumns((columns[c] as Column).columns);
            }
        } else {
            column = <Column>columns[c];
        }

        column.headerText = isNullOrUndefined(column.headerText) ? column.field || '' : column.headerText;

        column.valueAccessor = column.valueAccessor || valueAccessor;

        column.width = autoWidth && isNullOrUndefined(column.width) ? 200 : column.width;

        if (isNullOrUndefined(column.visible)) {
            column.visible = true;
        }

        columns[c] = column;

    }
    return columns as Column[];
}

/** @hidden */
export function setCssInGridPopUp(popUp: HTMLElement, e: MouseEvent | TouchEvent, className: string): void {
    let popUpSpan: HTMLElement = popUp.querySelector('span');
    let position: { top: number, left: number, right: number } = popUp.parentElement.getBoundingClientRect();
    let targetPosition: { top: number, left: number, right: number } = (e.target as HTMLElement).getBoundingClientRect();
    let isBottomTail: boolean;
    popUpSpan.className = className;
    popUp.style.display = '';
    isBottomTail = (isNullOrUndefined((e as MouseEvent).clientY) ? (e as TouchEvent).changedTouches[0].clientY :
        (e as MouseEvent).clientY) > popUp.offsetHeight + 10;
    popUp.style.top = targetPosition.top - position.top +
        (isBottomTail ? -(popUp.offsetHeight + 10) : popUp.offsetHeight + 10) + 'px'; //10px for tail element
    popUp.style.left = getPopupLeftPosition(popUp, e, targetPosition, position.left) + 'px';
    if (isBottomTail) {
        (popUp.querySelector('.e-downtail') as HTMLElement).style.display = '';
        (popUp.querySelector('.e-uptail') as HTMLElement).style.display = 'none';
    } else {
        (popUp.querySelector('.e-downtail') as HTMLElement).style.display = 'none';
        (popUp.querySelector('.e-uptail') as HTMLElement).style.display = '';
    }
}
/** @hidden */
function getPopupLeftPosition(
    popup: HTMLElement, e: MouseEvent | TouchEvent, targetPosition: { top: number, left: number, right: number }, left: number): number {
    let width: number = popup.offsetWidth / 2;
    let x: number = getPosition(e).x;
    if (x - targetPosition.left < width) {
        return targetPosition.left - left;
    } else if (targetPosition.right - x < width) {
        return targetPosition.right - left - width * 2;
    } else {
        return x - left - width;
    }
}
/** @hidden */
export function getActualProperties<T>(obj: T): T {
    if (obj instanceof ChildProperty) {
        return <T>getValue('properties', obj);
    } else {
        return obj;
    }
}
/** @hidden */
export function parentsUntil(elem: Element, selector: string, isID?: boolean): Element {
    let parent: Element = elem;
    while (parent) {
        if (isID ? parent.id === selector : parent.classList.contains(selector)) {
            break;
        }
        parent = parent.parentElement;
    }
    return parent;
}
/** @hidden */
export function getElementIndex(element: Element, elements: Element[]): number {
    let index: number = -1;
    for (let i: number = 0, len: number = elements.length; i < len; i++) {
        if (elements[i].isEqualNode(element)) {
            index = i;
            break;
        }
    }
    return index;
}
/** @hidden */
export function inArray(value: Object, collection: Object[]): number {
    for (let i: number = 0, len: number = collection.length; i < len; i++) {
        if (collection[i] === value) {
            return i;
        }
    }
    return -1;
}

/** @hidden */
export function getActualPropFromColl(collection: Object[]): Object[] {
    let coll: Object[] = [];
    for (let i: number = 0, len: number = collection.length; i < len; i++) {
        if (collection[i].hasOwnProperty('properties')) {
            coll.push((collection[i] as { properties: Object }).properties);
        } else {
            coll.push(collection[i]);
        }
    }
    return coll;
}

/** @hidden */
export function removeElement(target: Element, selector: string): void {
    let elements: HTMLElement[] = [].slice.call(target.querySelectorAll(selector));
    for (let i: number = 0; i < elements.length; i++) {
        remove(elements[i]);
    }
}

/** @hidden */
export function getPosition(e: MouseEvent | TouchEvent): IPosition {
    let position: IPosition = {} as IPosition;
    position.x = (isNullOrUndefined((e as MouseEvent).clientX) ? (e as TouchEvent).changedTouches[0].clientX :
        (e as MouseEvent).clientX);
    position.y = (isNullOrUndefined((e as MouseEvent).clientY) ? (e as TouchEvent).changedTouches[0].clientY :
        (e as MouseEvent).clientY);
    return position;
}


let uid: number = 0;
/** @hidden */
export function getUid(prefix: string): string {
    return prefix + uid++;
}

/** @hidden */
export function appendChildren(elem: Element, children: Element[]): Element {
    for (let i: number = 0, len: number = children.length; i < len; i++) {
        if (len === children.length) {
            elem.appendChild(children[i]);
        } else {
            elem.appendChild(children[0]);
        }
    }
    return elem;
}

/** @hidden */
export function parents(elem: Element, selector: string, isID?: boolean): Element[] {
    let parent: Element = elem;
    let parents: Element[] = [];
    while (parent) {
        if (isID ? parent.id === selector : parent.classList.contains(selector)) {
            parents.push(parent);
        }
        parent = parent.parentElement;
    }
    return parents;
}

/** @hidden */
export function calculateAggregate(type: AggregateType | string, data: Object, column?: AggregateColumnModel, context?: Object): Object {
    if (type === 'custom') {
        return column.customAggregate ? column.customAggregate.call(context, data, column) : '';
    }
    return DataUtil.aggregates[type](data, column.field);
}
/** @hidden */
let scrollWidth: number = null;

/** @hidden */
export function getScrollBarWidth(): number {
    if (scrollWidth !== null) { return scrollWidth; }
    let divNode: HTMLDivElement = document.createElement('div');
    let value: number = 0;
    divNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
    document.body.appendChild(divNode);
    value = (divNode.offsetWidth - divNode.clientWidth) | 0;
    document.body.removeChild(divNode);
    return scrollWidth = value;
}

/** @hidden */
let rowHeight: number;
/** @hidden */
export function getRowHeight(element?: HTMLElement): number {
    if (rowHeight !== undefined) {
        return rowHeight;
    }
    let table: HTMLTableElement = <HTMLTableElement>createElement('table', { className: 'e-table', styles: 'visibility: hidden' });
    table.innerHTML = '<tr><td class="e-rowcell">A<td></tr>';
    element.appendChild(table);
    let rect: ClientRect = table.querySelector('td').getBoundingClientRect();
    element.removeChild(table);
    rowHeight = Math.ceil(rect.height);
    return rowHeight;
}

/** @hidden */
export function isEditable(col: Column, type: string, elem: Element): boolean {
    let row: Element = parentsUntil(elem, 'e-row');
    let isOldRow: boolean = !row ? true : row && !row.classList.contains('e-insertedrow');
    if (type === 'beginEdit' && isOldRow) {
        if (col.isIdentity || col.isPrimaryKey || !col.allowEditing) {
            return false;
        }
        return true;
    } else {
        if (isOldRow && !col.allowEditing && !col.isIdentity && !col.isPrimaryKey) {
            return false;
        }
        return true;
    }
}

/** @hidden */
export function isActionPrevent(inst: IGrid): boolean {
    let dlg: HTMLElement = inst.element.querySelector('#' + inst.element.id + 'EditConfirm') as HTMLElement;
    return inst.editSettings.mode === 'batch' &&
        (inst.element.querySelectorAll('.e-updatedtd').length) &&
        (dlg ? dlg.classList.contains('e-popup-close') : true);
}

/** @hidden */
export function wrap(elem: any, action: boolean): void {
    let clName: string = 'e-wrap';
    elem = elem instanceof Array ? elem : [elem];
    for (let i: number = 0; i < elem.length; i++) {
        action ? elem[i].classList.add(clName) : elem[i].classList.remove(clName);
    }
}