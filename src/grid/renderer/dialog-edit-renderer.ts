import { IGrid } from '../base/interface';
import { Column } from '../models/column';
import { Dialog } from '@syncfusion/ej2-popups';
import { remove, createElement } from '@syncfusion/ej2-base';
import { L10n } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../services/service-locator';
import * as events from '../base/constant';
import { changeButtonType } from '../base/util';

/**
 * Edit render module is used to render grid edit row.
 * @hidden
 */
export class DialogEditRender {
    //Internal variables              

    //Module declarations
    private parent: IGrid;
    private l10n: L10n;
    private isEdit: boolean;
    private serviceLocator: ServiceLocator;
    private dialog: HTMLElement;
    private dialogObj: Dialog;
    /**
     * Constructor for render module
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.dialogDestroy, this.destroy, this);
        this.parent.on(events.destroy, this.destroy, this);
    }

    private setLocaleObj(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
    }

    public addNew(elements: Element[], args: { primaryKeyValue?: string[] }): void {
        this.isEdit = false;
        this.createDialog(elements, args);
    }

    public update(elements: Element[], args: { primaryKeyValue?: string[] }): void {
        this.isEdit = true;
        this.createDialog(elements, args);
    }

    private createDialog(elements: Element[], args: { primaryKeyValue?: string[] }): void {
        let gObj: IGrid = this.parent;
        this.dialog = createElement('div', { id: gObj.element.id + '_dialogEdit_wrapper' });
        gObj.element.appendChild(this.dialog);
        this.setLocaleObj();
        this.dialogObj = new Dialog({
            header: this.isEdit ? this.l10n.getConstant('EditFormTitle') + args.primaryKeyValue[0] :
                this.l10n.getConstant('AddFormTitle'), isModal: true, visible: true, cssClass: 'e-edit-dialog',
            content: this.getEditElement(elements) as HTMLElement, showCloseIcon: true, allowDragging: true, close: this.destroy.bind(this),
            closeOnEscape: true, width: '330px', target: gObj.element, animationSettings: { effect: 'None' },
            buttons: [{
                click: this.btnClick.bind(this),
                buttonModel: { content: this.l10n.getConstant('SaveButton'), cssClass: 'e-primary', isPrimary: true }
            },
            { click: this.btnClick.bind(this), buttonModel: { cssClass: 'e-flat', content: this.l10n.getConstant('CancelButton') } }]
        });
        this.dialogObj.appendTo(this.dialog);
        changeButtonType(this.dialogObj.element);
    }

    private btnClick(e: MouseEvent): void {
        if (this.l10n.getConstant('CancelButton').toLowerCase() === (e.target as HTMLInputElement).innerText.toLowerCase()) {
            this.parent.closeEdit();
            this.destroy();
        } else {
            this.parent.endEdit();
        }
    }

    private destroy(args?: { requestType: string }): void {
        this.parent.notify(events.destroyForm, {});
        this.parent.isEdit = false;
        this.parent.notify(events.toolbarRefresh, {});
        if (this.dialog && !this.dialogObj.isDestroyed) {
            this.dialogObj.destroy();
            remove(this.dialog);
        }
    }

    private getEditElement(elements: Object): Element {
        let gObj: IGrid = this.parent;
        let div: Element = createElement('div', { className: this.isEdit ? 'e-editedrow' : 'e-insertedrow' });
        let form: HTMLFormElement = createElement('form', { id: gObj.element.id + 'EditForm', className: 'e-gridform' }) as HTMLFormElement;
        let table: Element = createElement('table', { className: 'e-table', attrs: { cellspacing: '6px' } });
        let tbody: Element = createElement('tbody');
        let cols: Column[] = gObj.getColumns() as Column[];
        for (let i: number = 0; i < cols.length; i++) {
            if (!cols[i].visible || cols[i].commands || cols[i].commandsTemplate) {
                continue;
            }
            let tr: Element = createElement('tr');
            let dataCell: HTMLElement = createElement('td', { className: 'e-rowcell', attrs: { style: 'text-align:left;width:190px' } });
            let label: Element = createElement('label', { innerHTML: cols[i].field });
            elements[cols[i].uid].classList.remove('e-input');
            dataCell.appendChild(elements[cols[i].uid]);
            tr.appendChild(dataCell);
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        form.appendChild(table);
        div.appendChild(form);
        return div;
    }

}

