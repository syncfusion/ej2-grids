/**
 * Service Locator spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base/dom';
import { Grid } from '../../../src/grid/base/grid';
import { Column } from '../../../src/grid/models/column';
import { ICellFormatter } from '../../../src/grid/base/interface';
import '../../../node_modules/es6-promise/dist/es6-promise';

class ExtHtmlEscapeService implements ICellFormatter {

    public escapeRegex: RegExp = /[&<>"']/g;

    public entitySet: { [x: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&#34;',
        '\'': '&#39;'
    };

    public getValue(column: Column, data: Object): string {
        let value: string = <string>column.valueAccessor(column.field, data, column);

        if (value === null || value === undefined) {
            return value;
        }

        return value.replace(this.escapeRegex, (c: string) => {
            return this.entitySet[c];
        });
    }

    public static extEscape(input: string, coluns: Column[]): string {
        return input;
    }
}

describe('Html escaper module', () => {

    describe('Default and extended', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });

        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid({
                columns: [
                    {
                        field: 'data.a', headerText: '<i>A</i>', headerTextAlign: 'center',
                        disableHtmlEncode: true, textAlign: 'right', customAttributes: {
                            class: 'hi',
                            style: { color: 'green', 'background-color': 'wheat' },
                            'data-id': 'grid-cell'
                        }
                    },
                    { field: 'c', headerText: 'C', displayAsCheckBox: true, type: 'boolean' },
                    { field: 'b', headerText: 'Cc', disableHtmlEncode: false, formatter: ExtHtmlEscapeService }
                ],
                dataSource: [{ data: { a: '<i>VINET</i>' }, b: '<i>TOMSP</i>', c: true, d: new Date() },
                { data: { a: 2 }, b: null, c: false, d: new Date() }], allowPaging: false, dataBound: dataBound
            });
            gridObj.appendTo('#Grid');
        });

        it('content testing', () => {
            expect(gridObj.getContent().querySelectorAll('.e-rowcell')[2].innerHTML).toBe('&lt;i&gt;TOMSP&lt;/i&gt;');
        });

        afterAll(() => {
            remove(elem);
        });

    });
});