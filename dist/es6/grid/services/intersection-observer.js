import { EventHandler } from '@syncfusion/ej2-base';
import { debounce } from '@syncfusion/ej2-base';
var InterSectionObserver = (function () {
    function InterSectionObserver(element, options) {
        var _this = this;
        this.fromWheel = false;
        this.touchMove = false;
        this.options = {};
        this.sentinelInfo = {
            'up': {
                check: function (rect, info) {
                    var top = rect.top - _this.containerRect.top;
                    info.entered = top >= 0;
                    return top + (_this.options.pageHeight / 2) >= 0;
                },
                axis: 'Y'
            },
            'down': {
                check: function (rect, info) {
                    var cHeight = _this.options.container.clientHeight;
                    var top = rect.bottom;
                    info.entered = rect.bottom <= _this.containerRect.bottom;
                    return top - (_this.options.pageHeight / 2) <= _this.options.pageHeight / 2;
                }, axis: 'Y'
            },
            'right': {
                check: function (rect, info) {
                    var right = rect.right;
                    info.entered = right < _this.containerRect.right;
                    return right - _this.containerRect.width <= _this.containerRect.right;
                }, axis: 'X'
            },
            'left': {
                check: function (rect, info) {
                    var left = rect.left;
                    info.entered = left > 0;
                    return left + _this.containerRect.width >= _this.containerRect.left;
                }, axis: 'X'
            }
        };
        this.element = element;
        this.options = options;
    }
    InterSectionObserver.prototype.observe = function (callback, onEnterCallback) {
        var _this = this;
        this.containerRect = this.options.container.getBoundingClientRect();
        EventHandler.add(this.options.container, 'wheel', function () { return _this.fromWheel = true; }, this);
        EventHandler.add(this.options.container, 'scroll', this.virtualScrollHandler(callback, onEnterCallback), this);
    };
    InterSectionObserver.prototype.check = function (direction) {
        var info = this.sentinelInfo[direction];
        return info.check(this.element.getBoundingClientRect(), info);
    };
    InterSectionObserver.prototype.virtualScrollHandler = function (callback, onEnterCallback) {
        var _this = this;
        var prevTop = 0;
        var prevLeft = 0;
        var debounced100 = debounce(callback, 100);
        var debounced50 = debounce(callback, 50);
        return function (e) {
            var top = e.target.scrollTop;
            var left = e.target.scrollLeft;
            var direction = prevTop < top ? 'down' : 'up';
            direction = prevLeft === left ? direction : prevLeft < left ? 'right' : 'left';
            prevTop = top;
            prevLeft = left;
            var current = _this.sentinelInfo[direction];
            if (_this.options.axes.indexOf(current.axis) === -1) {
                return;
            }
            var check = _this.check(direction);
            if (current.entered) {
                onEnterCallback(_this.element, current, direction, { top: top, left: left });
            }
            if (check) {
                var fn = _this.fromWheel ? _this.options.debounceEvent ? debounced100 : callback : debounced100;
                if (current.axis === 'X') {
                    fn = debounced50;
                }
                fn({ direction: direction, sentinel: current, offset: { top: top, left: left } });
            }
            _this.fromWheel = false;
        };
    };
    InterSectionObserver.prototype.setPageHeight = function (value) {
        this.options.pageHeight = value;
    };
    return InterSectionObserver;
}());
export { InterSectionObserver };
