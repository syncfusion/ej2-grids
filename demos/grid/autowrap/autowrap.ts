import { Page } from '../../../src/grid/actions/page';
import { Grid } from '../../../src/grid/base/grid';
import { data } from './datasource';
import '../../../node_modules/es6-promise/dist/es6-promise';
Grid.Inject(Page);

let grid: Grid = new Grid({
    dataSource: data,
    allowTextWrap: true,
    textWrapSettings: { wrapMode: 'Content' },
    columns: [
        { field: 'RoolNo', headerText: 'Rool No', width: 120 },
        { field: 'Name', headerText: 'Name of the inventor', width: 100 },
        { field: 'patentfamilies', headerText: 'No of patentfamilies', width: 100 },
        { field: 'Country', headerText: 'country', width: 130 },
        { field: 'mainfields', headerText: 'Main fields of Invention', width: 150 },
    ],
    width: 'auto',
    allowPaging: true,
});
grid.appendTo('#Grid');