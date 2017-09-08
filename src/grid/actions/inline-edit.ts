
import { IGrid } from '../base/interface';
import { EditRender } from '../renderer/edit-renderer';
import { ServiceLocator } from '../services/service-locator';
import { NormalEdit } from './normal-edit';

/**
 * `InlineEdit` module is used to handle inline editing actions.
 * @hidden
 */
export class InlineEdit extends NormalEdit {

    protected parent: IGrid;
    protected serviceLocator: ServiceLocator;
    protected renderer: EditRender;

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, renderer?: EditRender) {
        super(parent, serviceLocator);
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.renderer = renderer;
    }

    public closeEdit(): void {
        super.closeEdit();
    }

    public addRecord(data?: Object): void {
        super.addRecord(data);
    }

    public endEdit(): void {
        super.endEdit();
    }

    public deleteRecord(fieldname?: string, data?: Object): void {
        super.deleteRecord(fieldname, data);
    }

    protected startEdit(tr?: Element): void {
        super.startEdit(tr);
    }

}