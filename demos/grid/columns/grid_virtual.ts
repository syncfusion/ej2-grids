import { Edit } from '../../../src/grid/actions/edit';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Resize } from '../../../src/grid/actions/resize';
import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Reorder } from '../../../src/grid/actions/reorder';
import { CommandColumn } from '../../../src/grid/actions/command-column';
import { ActionEventArgs } from '../../../src/grid/base/interface';
import { Grid } from '../../../src/grid/base/grid';
import { createElement } from '.../../../node_modules/@syncfusion/ej2-base';
import {  data } from '../../../spec/grid/base/datasource.spec';
import {employeeData} from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import {Button} from '@syncfusion/ej2-buttons';
let isReordered : boolean = false;


Grid.Inject(VirtualScroll, Resize, Edit, Toolbar)

let virtualData: Object[] = [];
let names: string[] = ['hardire', 'abramjo01', 'aubucch01', 'Hook', 'Rumpelstiltskin', 'Belle', 'Emma', 'Regina', 'Aurora', 'Elsa',
    'Anna', 'Snow White', 'Prince Charming', 'Cora', 'Zelena', 'August', 'Mulan', 'Graham', 'Discord', 'Will', 'Robin Hood',
    'Jiminy Cricket', 'Henry', 'Neal', 'Red', 'Aaran', 'Aaren', 'Aarez', 'Aarman', 'Aaron', 'Aaron-James', 'Aarron', 'Aaryan', 'Aaryn',
    'Aayan', 'Aazaan', 'Abaan', 'Abbas', 'Abdallah', 'Abdalroof', 'Abdihakim', 'Abdirahman', 'Abdisalam', 'Abdul', 'Abdul-Aziz',
    'Abdulbasir', 'Abdulkadir', 'Abdulkarem', 'Abdulkhader', 'Abdullah', 'Abdul-Majeed', 'Abdulmalik', 'Abdul-Rehman', 'Abdur',
    'Abdurraheem', 'Abdur-Rahman', 'Abdur-Rehmaan', 'Abel', 'Abhinav', 'Abhisumant', 'Abid', 'Abir', 'Abraham', 'Abu', 'Abubakar',
    'Ace', 'Adain', 'Adam', 'Adam-James', 'Addison', 'Addisson', 'Adegbola', 'Adegbolahan', 'Aden', 'Adenn', 'Adie', 'Adil', 'Aditya',
    'Adnan', 'Adrian', 'Adrien', 'Aedan', 'Aedin', 'Aedyn', 'Aeron', 'Afonso', 'Ahmad', 'Ahmed', 'Ahmed-Aziz', 'Ahoua', 'Ahtasham',
    'Aiadan', 'Aidan', 'Aiden', 'Aiden-Jack', 'Aiden-Vee'];
let date1: number;
let date2: number;
let flag: boolean = true;

let genarateData: Button = new Button({}, '#genarate');
genarateData.element.onclick = () => {
    if (!virtualData.length) {
        show();
        dataSource();
        date1 = new Date().getTime();
        grid.dataSource = virtualData;
    } else {
        flag = true;
        show();
        date1 = new Date().getTime();
        grid.refresh();
    }
};
let grid: Grid = new Grid(
    {
        dataSource: [],
        enableVirtualization: true,
        enableColumnVirtualization: true,
        height: 200,
        allowResizing:true,
        toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
        editSettings: {allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal'},
        columns: [
            { field: 'FIELD1', headerText: 'Player Name' },
            { field: 'FIELD2', headerText: 'Year', width: 120, textAlign: 'Right' },
            { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
            { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' },
            { field: 'FIELD5', headerText: 'LGID', width: 120, textAlign: 'Right' },
            { field: 'FIELD6', headerText: 'GP', width: 120, textAlign: 'Right' },
            { field: 'FIELD7', headerText: 'GS', width: 120, textAlign: 'Right' },
            { field: 'FIELD8', headerText: 'Minutes', width: 120, textAlign: 'Right' },
            { field: 'FIELD9', headerText: 'Points', width: 120, textAlign: 'Right' },
            { field: 'FIELD10', headerText: 'oRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD11', headerText: 'dRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD12', headerText: 'Rebounds', width: 120, textAlign: 'Right' },
            { field: 'FIELD13', headerText: 'Assists', width: 120, textAlign: 'Right' },
            { field: 'FIELD14', headerText: 'Steals', width: 120, textAlign: 'Right' },
            { field: 'FIELD15', headerText: 'Blocks', width: 120, textAlign: 'Right' },
            { field: 'FIELD16', headerText: 'Turnovers', width: 130, textAlign: 'Right' },
            { field: 'FIELD17', headerText: 'PF', width: 130, textAlign: 'Right' },
            { field: 'FIELD18', headerText: 'fgAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD19', headerText: 'fgMade', width: 120, textAlign: 'Right' },
            { field: 'FIELD20', headerText: 'ftAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD21', headerText: 'ftMade', width: 120, textAlign: 'Right' },
            { field: 'FIELD22', headerText: 'ThreeAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD23', headerText: 'ThreeMade', width: 130, textAlign: 'Right' },
            { field: 'FIELD24', headerText: 'PostGP', width: 120, textAlign: 'Right' },
            { field: 'FIELD25', headerText: 'PostGS', width: 120, textAlign: 'Right' },
            { field: 'FIELD26', headerText: 'PostMinutes', width: 120, textAlign: 'Right' },
            { field: 'FIELD27', headerText: 'PostPoints', width: 130, textAlign: 'Right' },
            { field: 'FIELD28', headerText: 'PostoRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD29', headerText: 'PostdRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD30', headerText: 'PostRebounds', width: 130, textAlign: 'Right' }],
        dataBound: hide,
        queryCellInfo: function(args: any){
            if(args.column.field === "FIELD1"){
                args.colSpan = 10;
            }
            if (args.column.field === "FIELD15") {
                args.colSpan = 10;
            }
            
        }
    });
grid.appendTo('#Grid');

function dataSource(): void {
    for (let i: number = 0; i < 10000; i++) {
        virtualData.push({
            'FIELD1': names[Math.floor(Math.random() * names.length)],
            'FIELD2': 1967 + (i % 10),
            'FIELD3': Math.floor(Math.random() * 200),
            'FIELD4': Math.floor(Math.random() * 100),
            'FIELD5': Math.floor(Math.random() * 2000),
            'FIELD6': Math.floor(Math.random() * 1000),
            'FIELD7': Math.floor(Math.random() * 100),
            'FIELD8': Math.floor(Math.random() * 10),
            'FIELD9': Math.floor(Math.random() * 10),
            'FIELD10': Math.floor(Math.random() * 100),
            'FIELD11': Math.floor(Math.random() * 100),
            'FIELD12': Math.floor(Math.random() * 1000),
            'FIELD13': Math.floor(Math.random() * 10),
            'FIELD14': Math.floor(Math.random() * 10),
            'FIELD15': Math.floor(Math.random() * 1000),
            'FIELD16': Math.floor(Math.random() * 200),
            'FIELD17': Math.floor(Math.random() * 300),
            'FIELD18': Math.floor(Math.random() * 400),
            'FIELD19': Math.floor(Math.random() * 500),
            'FIELD20': Math.floor(Math.random() * 700),
            'FIELD21': Math.floor(Math.random() * 800),
            'FIELD22': Math.floor(Math.random() * 1000),
            'FIELD23': Math.floor(Math.random() * 2000),
            'FIELD24': Math.floor(Math.random() * 150),
            'FIELD25': Math.floor(Math.random() * 1000),
            'FIELD26': Math.floor(Math.random() * 100),
            'FIELD27': Math.floor(Math.random() * 400),
            'FIELD28': Math.floor(Math.random() * 600),
            'FIELD29': Math.floor(Math.random() * 500),
            'FIELD30': Math.floor(Math.random() * 300),
        });
    }
}

function show(): void {
    document.getElementById('popup').style.display = 'inline-block';
}
function hide(): void {
    if (flag && date1) {
        let date2: number = new Date().getTime();
        document.getElementById('performanceTime').innerHTML = 'Time Taken: ' + (date2 - date1) + 'ms';
        flag = false;
    }
    document.getElementById('popup').style.display = 'none';
}