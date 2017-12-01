import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { isActionPrevent } from '../base/util';
/**
 *
 * `Search` module is used to handle search action.
 */
var Search = /** @class */ (function () {
    /**
     * Constructor for Grid search module.
     * @hidden
     */
    function Search(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * Searches Grid records by given key.
     * @param  {string} searchString - Defines the key.
     * @return {void}
     */
    Search.prototype.search = function (searchString) {
        var gObj = this.parent;
        if (isActionPrevent(gObj)) {
            gObj.notify(events.preventBatch, { instance: this, handler: this.search, arg1: searchString });
            return;
        }
        searchString = searchString.toLowerCase();
        if (searchString !== gObj.searchSettings.key) {
            gObj.searchSettings.key = searchString;
            gObj.dataBind();
        }
    };
    /**
     * @hidden
     */
    Search.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(events.searchComplete, this.onActionComplete, this);
        this.parent.on(events.destroy, this.destroy, this);
    };
    /**
     * @hidden
     */
    Search.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(events.searchComplete, this.onActionComplete);
        this.parent.off(events.destroy, this.destroy);
    };
    /**
     * To destroy the print
     * @return {void}
     * @hidden
     */
    Search.prototype.destroy = function () {
        this.removeEventListener();
    };
    /**
     * @hidden
     */
    Search.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName()) {
            return;
        }
        if (!isNullOrUndefined(e.properties.key)) {
            this.parent.notify(events.modelChanged, {
                requestType: 'searching', type: events.actionBegin, searchString: this.parent.searchSettings.key
            });
        }
        else {
            this.parent.notify(events.modelChanged, {
                requestType: 'searching', type: events.actionBegin
            });
        }
    };
    /**
     * The function used to trigger onActionComplete
     * @return {void}
     * @hidden
     */
    Search.prototype.onActionComplete = function (e) {
        this.parent.trigger(events.actionComplete, extend(e, {
            searchString: this.parent.searchSettings.key, requestType: 'searching', type: events.actionComplete
        }));
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Search.prototype.getModuleName = function () {
        return 'search';
    };
    return Search;
}());
export { Search };
