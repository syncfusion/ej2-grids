/**
 * Util spec
 */
import { doesImplementInterface, prepareColumns, setCssInGridPopUp} from '../../../src/grid/base/util';
import { createElement } from '@syncfusion/ej2-base/dom';
import '../../../node_modules/es6-promise/dist/es6-promise';

describe('Util module', () => {

    describe('Method testing', () => {
        class Test {
        }
        it('doesImplementInterface testing', () => {
            expect(doesImplementInterface(Test, 'hi')).toEqual(false);      

            //for coverage
            let div = createElement('div');
            div.appendChild(createElement('span',));
            createElement('div').appendChild(div);
            setCssInGridPopUp(div,{target:div,clientX:0, clientY:100} as any,'e-downtail e-uptail');
            setCssInGridPopUp(div,{target:div,changedTouches:[{clientX:0, clientY:100}]} as any,'e-downtail e-uptail');
            prepareColumns(['a', 'b']); 
        });

    });

});