import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { isActionPrevent } from '../base/util';
var Search = (function () {
    function Search(parent) {
        this.parent = parent;
        this.addEventListener();
    }
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
    Search.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(events.searchComplete, this.onActionComplete, this);
        this.parent.on(events.destroy, this.destroy, this);
    };
    Search.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(events.searchComplete, this.onActionComplete);
        this.parent.off(events.destroy, this.destroy);
    };
    Search.prototype.destroy = function () {
        this.removeEventListener();
    };
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
    Search.prototype.onActionComplete = function (e) {
        this.parent.trigger(events.actionComplete, extend(e, {
            searchString: this.parent.searchSettings.key, requestType: 'searching', type: events.actionComplete
        }));
    };
    Search.prototype.getModuleName = function () {
        return 'search';
    };
    return Search;
}());
export { Search };
