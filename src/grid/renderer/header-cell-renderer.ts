import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, attributes } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { ICellRenderer } from '../base/interface';
import { setStyleAndAttributes } from '../base/util';
import { CellRenderer } from './cell-renderer';
import { AriaService, IAriaOptions } from '../services/aria-service';
import { CheckBox } from '@syncfusion/ej2-buttons';
/**
 * HeaderCellRenderer class which responsible for building header cell content. 
 * @hidden
 */
export class HeaderCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = createElement('TH', { className: 'e-headercell', attrs: { role: 'columnheader', tabindex: '-1' } });
    private ariaService: AriaService = new AriaService();
    private hTxtEle: Element = createElement('span', { className: 'e-headertext' });
    private sortEle: Element = createElement('div', { className: 'e-sortfilterdiv e-icons' });
    private fltrMenuEle: Element = createElement('div', { className: 'e-filtermenudiv e-icons e-icon-filter' });
    private gui: Element = createElement('div');
    private chkAllBox: Element = createElement('input', { className: 'e-checkselectall', attrs: { 'type': 'checkbox' } });
    /**
     * Function to return the wrapper for the TH content.
     * @returns string 
     */
    public getGui(): string | Element {
        return <Element>this.gui.cloneNode();
    }

    /**
     * Function to render the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data     
     * @param  {Element}
     */
    public render(cell: Cell<Column>, data: Object, attributes?: { [x: string]: Object }): Element {
        let node: Element = this.element.cloneNode() as Element;

        return this.prepareHeader(cell, node);
    }

    /**
     * Function to refresh the cell content based on Column object.
     * @param  {Cell} cell
     * @param  {Element} node          
     */
    public refresh(cell: Cell<Column>, node: Element): Element {
        this.clean(node);
        return this.prepareHeader(cell, node);
    }

    private clean(node: Element): void {
        node.innerHTML = '';
    }

    private prepareHeader(cell: Cell<Column>, node: Element): Element {
        let column: Column = cell.column; let ariaAttr: IAriaOptions<boolean> = {};
        //Prepare innerHtml
        let innerDIV: HTMLDivElement = <HTMLDivElement>this.getGui();

        attributes(innerDIV, {
            'e-mappinguid': column.uid,
            'class': 'e-headercelldiv'
        });

        if (column.type !== 'checkbox') {

            let value: string = column.headerText;

            let headerText: Element = <Element>this.hTxtEle.cloneNode();

            //TODO: Header Template support.

            headerText[column.getDomSetter()] = value;

            innerDIV.appendChild(headerText);
        } else {
            column.editType = 'booleanedit';
            let checkAllBox: Element = <Element>this.chkAllBox.cloneNode();
            innerDIV.appendChild(checkAllBox);
            let checkAllBoxObj: CheckBox = new CheckBox();
            checkAllBoxObj.appendTo(checkAllBox as HTMLElement);
            innerDIV.classList.add('e-headerchkcelldiv');
        }

        this.buildAttributeFromCell(node as HTMLElement, cell);

        this.appendHtml(node, innerDIV);

        node.appendChild(this.sortEle.cloneNode());

        if ((this.parent.allowFiltering && this.parent.filterSettings.type === 'menu') &&
            (column.allowFiltering && isNullOrUndefined(column.template))) {
            attributes(this.fltrMenuEle, {
                'e-mappinguid': 'e-flmenu-' + column.uid,
            });
            node.appendChild(this.fltrMenuEle.cloneNode());
            node.classList.add('e-fltr-icon');
        }

        if (cell.className) {
            node.classList.add(cell.className);
        }

        if (column.customAttributes) {
            setStyleAndAttributes(node as HTMLElement, column.customAttributes);
        }

        if (column.allowSorting) {
            ariaAttr.sort = 'none';
        }
        if (column.allowGrouping) {
            ariaAttr.grabbed = false;
        }
        if (!isNullOrUndefined(column.headerTemplate)) {
            if (column.headerTemplate.indexOf('#') !== -1) {
                innerDIV.innerHTML = document.querySelector(column.headerTemplate).innerHTML.trim();
            } else {
                innerDIV.innerHTML = column.headerTemplate;
            }
        }

        if (this.parent.allowResizing) {
            let handler: HTMLElement = createElement('div');
            handler.className = column.allowResizing ? 'e-rhandler e-rcursor' : 'e-rsuppress';
            node.appendChild(handler);
        }
        this.ariaService.setOptions(<HTMLElement>node, ariaAttr);

        if (!isNullOrUndefined(column.headerTextAlign) || !isNullOrUndefined(column.textAlign)) {
            let alignment: string = column.headerTextAlign || column.textAlign;
            (innerDIV as HTMLElement).style.textAlign = alignment;
            if (alignment === 'right' || alignment === 'left') {
                node.classList.add(alignment === 'right' ? 'e-rightalign' : 'e-leftalign');
            }
        }

        if (column.clipMode === 'clip') {
            node.classList.add('e-gridclip');
        } else if (column.clipMode === 'ellipsiswithtooltip') {
            node.classList.add('e-ellipsistooltip');
        }
        node.setAttribute('aria-rowspan', (!isNullOrUndefined(cell.rowSpan) ? cell.rowSpan : 1).toString());
        node.setAttribute('aria-colspan', '1');
        return node;
    }

    /**
     * Function to specifies how the result content to be placed in the cell.
     * @param  {Element} node
     * @param  {string|Element} innerHtml
     * @returns Element
     */
    public appendHtml(node: Element, innerHtml: string | Element): Element {
        node.appendChild(<Element>innerHtml);
        return node;
    }
}