define(["require", "exports", "@syncfusion/ej2-base/util", "../base/constant"], function (require, exports, util_1, events) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Search = (function () {
        function Search(parent) {
            this.parent = parent;
            this.addEventListener();
        }
        Search.prototype.search = function (searchString) {
            var gObj = this.parent;
            searchString = searchString.toLowerCase();
            if (searchString !== this.parent.searchSettings.key) {
                this.parent.searchSettings.key = searchString;
                this.parent.dataBind();
            }
        };
        Search.prototype.addEventListener = function () {
            this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
            this.parent.on(events.searchComplete, this.onActionComplete, this);
            this.parent.on(events.destroy, this.destroy, this);
        };
        Search.prototype.removeEventListener = function () {
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
            if (!util_1.isNullOrUndefined(e.properties.key)) {
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
            this.parent.trigger(events.actionComplete, util_1.extend(e, {
                searchString: this.parent.searchSettings.key, requestType: 'searching', type: events.actionComplete
            }));
        };
        Search.prototype.getModuleName = function () {
            return 'search';
        };
        return Search;
    }());
    exports.Search = Search;
});
