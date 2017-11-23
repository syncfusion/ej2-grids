import { merge } from '@syncfusion/ej2-base';
var Cell = (function () {
    function Cell(options) {
        this.isSpanned = false;
        merge(this, options);
    }
    return Cell;
}());
export { Cell };
