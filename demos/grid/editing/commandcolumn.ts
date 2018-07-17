import { Page } from '../../../src/grid/actions/page';
import { Selection,Edit,Toolbar,CommandColumn } from '../../../src/grid/actions';
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

Grid.Inject(Grid, Edit, Toolbar, Page,CommandColumn )
let grid: Grid = new Grid({
    dataSource: data,
            editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true },
            allowPaging: true,
            pageSettings: {pageCount: 5},
               columns: [
                {
                    field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right',
                    validationRules: { required: true }, width: 120
                },
                {
                    field: 'CustomerID', headerText: 'Customer ID',
                    validationRules: { required: true }, width: 140
                },
              
                { field: 'ShipName', headerText: 'Ship Name', width: 170 },
                {
                    field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150,
                    edit: { params: { popupHeight: '300px' } }
                    
                },
                { headerText: 'Manage Records', width: 160,
                commands: [{ type: 'Edit', buttonOption: { iconCss: ' e-icons e-edit', cssClass: 'e-flat' } },
                    { type: 'Delete', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat' } },
                    { type: 'Save', buttonOption: { iconCss: 'e-icons e-update', cssClass: 'e-flat' } },
                    { type: 'Cancel', buttonOption: { iconCss: 'e-icons e-cancel-icon', cssClass: 'e-flat' } }]
            }
        ],
        });
grid.appendTo('#Grid');
