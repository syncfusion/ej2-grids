import { extend, isNullOrUndefined } from '@syncfusion/ej2-base/util';
import { IGrid, IAction, NotifyArgs } from '../base/interface';
import * as events from '../base/constant';
import { SearchSettingsModel } from '../base/grid-model';

/**
 * 
 * `Search` module is used to handle search action.
 */
export class Search implements IAction {

    //Internal variables    

    //Module declarations
    private parent: IGrid;

    /**
     * Constructor for Grid search module.
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        this.addEventListener();
    }

    /** 
     * Searches Grid records by given key.  
     * @param  {string} searchString - Defines the key.
     * @return {void} 
     */
    public search(searchString: string): void {
        let gObj: IGrid = this.parent;
        searchString = searchString.toLowerCase();
        if (searchString !== this.parent.searchSettings.key) {
            this.parent.searchSettings.key = searchString;
            this.parent.dataBind();
        }
    }
    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(events.searchComplete, this.onActionComplete, this);
        this.parent.on(events.destroy, this.destroy, this);
    }
    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(events.searchComplete, this.onActionComplete);
        this.parent.off(events.destroy, this.destroy);
    }

    /**
     * To destroy the print 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }
    /**
     * @hidden
     */
    public onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        if (!isNullOrUndefined((e.properties as SearchSettingsModel).key)) {
            this.parent.notify(events.modelChanged, {
                requestType: 'searching', type: events.actionBegin, searchString: this.parent.searchSettings.key
            });
        } else {
            this.parent.notify(events.modelChanged, {
                requestType: 'searching', type: events.actionBegin
            });
        }
    }

    /**
     * The function used to trigger onActionComplete
     * @return {void}
     * @hidden
     */
    public onActionComplete(e: NotifyArgs): void {
        this.parent.trigger(events.actionComplete, extend(e, {
            searchString: this.parent.searchSettings.key, requestType: 'searching', type: events.actionComplete
        }));
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'search';
    }

}
