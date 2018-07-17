import { Page ,ExcelExport, PdfExport, Edit, ContextMenu,Resize } from '../../../src/grid/actions';
import { Selection } from '../../../src/grid/actions/selection';
import { Sort } from '../../../src/grid/actions/sort';
import { Filter } from '../../../src/grid/actions/filter';
import { Aggregate } from '../../../src/grid/actions/aggregate'
import { Group } from '../../../src/grid/actions/group';
import { Grid } from '../../../src/grid/base/grid';
import { data } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

/**
 * 
 */

Grid.Inject(Page, Selection, Resize, Sort,Edit, Aggregate, Filter,ContextMenu,ExcelExport,PdfExport)
let grid: Grid = new Grid({
    dataSource: data,
            allowExcelExport: true,
            allowPdfExport: true,
            allowSorting:true,
            editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true },
            allowPaging: true,
            contextMenuItems: [ 'AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending', 'Copy', 'Edit', 'Delete', 'Save', 'Cancel',
                'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage', 'LastPage', 'NextPage'],
            columns: [
                { field: 'OrderID', headerText: 'Order ID', minWidth: 120, width: 200, maxWidth: 300, textAlign: 'Right' },
                { field: 'CustomerID', headerText: 'Customer Name', minWidth: 8, width: 200 },
                { field: 'Freight', width: 150, format: 'C2', minWidth: 8, textAlign: 'Right'},
                { field: 'ShipName', headerText: 'Ship Name', minWidth: 8, width: 300 }
            ]
})
grid.appendTo('#Grid');
