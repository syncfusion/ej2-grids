import { Grid } from '../../../src/grid/base/grid';
import { VirtualScroll } from '../../../src/grid/actions'
import { data } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
Grid.Inject(VirtualScroll);

let grid: Grid = new Grid({
    dataSource: data,
    height: 500,
    enableVirtualization: true,
    width: 500,
    columns: [
        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120 },
        { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 120 },
        { field: 'ShipCity', headerText: 'Ship City', width: 150 },
        { field: 'ShipCountry', headerText: 'Ship Country', width: 150 },
        { field: 'ShipName', headerText: 'Ship Name', width: 150 },
        { field: 'ShipCity', headerText: 'Ship City', width: 150 },
        { field: 'ShipAddress', headerText: 'Ship Address', width: 150 },
        { field: 'ShipPostalCode', headerText: 'Ship Code', width: 150 },
        { field: 'Freight', headerText: 'Freight', format: 'C2', width: 150 },
    ]
});
grid.appendTo('#Grid');