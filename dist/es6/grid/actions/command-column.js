import { closest } from '@syncfusion/ej2-base';
import { initialEnd, click, keyPressed } from '../base/constant';
import { CellType } from '../base/enum';
import { CommandColumnRenderer } from '../renderer/command-column-renderer';
/**
 * `CommandColumn` used to handle the command column actions.
 * @hidden
 */
var CommandColumn = /** @class */ (function () {
    function CommandColumn(parent, locator) {
        this.parent = parent;
        this.locator = locator;
        this.addEventListener();
    }
    CommandColumn.prototype.initiateRender = function () {
        var cellFac = this.locator.getService('cellRendererFactory');
        cellFac.addCellRenderer(CellType.CommandColumn, new CommandColumnRenderer(this.parent, this.locator));
    };
    CommandColumn.prototype.commandClickHandler = function (e) {
        var gObj = this.parent;
        var gID = this.parent.element.id;
        var target = closest(e.target, 'button');
        if (!target || !gObj.editModule) {
            return;
        }
        switch (target.id.split('_')[0]) {
            case gID + 'edit':
                this.parent.editModule.endEdit();
                gObj.editModule.startEdit(closest(target, 'tr'));
                break;
            case gID + 'cancel':
                gObj.editModule.closeEdit();
                break;
            case gID + 'save':
                this.parent.editModule.endEdit();
                break;
            case gID + 'delete':
                this.parent.editModule.endEdit();
                gObj.editModule.deleteRow(closest(target, 'tr'));
                break;
        }
    };
    /**
     * For internal use only - Get the module name.
     */
    CommandColumn.prototype.getModuleName = function () {
        return 'commandColumn';
    };
    /**
     * To destroy CommandColumn.
     * @method destroy
     * @return {void}
     */
    CommandColumn.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeEventListener();
    };
    CommandColumn.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(click, this.commandClickHandler);
        this.parent.off(initialEnd, this.initiateRender);
        this.parent.off(keyPressed, this.keyPressHandler);
    };
    CommandColumn.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(click, this.commandClickHandler, this);
        this.parent.on(initialEnd, this.initiateRender, this);
        this.parent.on(keyPressed, this.keyPressHandler, this);
    };
    CommandColumn.prototype.keyPressHandler = function (e) {
        if (e.action === 'enter' && closest(e.target, 'button')) {
            this.commandClickHandler(e);
            e.preventDefault();
        }
    };
    return CommandColumn;
}());
export { CommandColumn };
