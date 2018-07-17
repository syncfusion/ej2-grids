import { Page, Group } from '../../../src/grid/actions';
import { Grid } from '../../../src/grid/base/grid';
import { loadCldr, L10n, setCulture, setCurrencyCode } from '@syncfusion/ej2-base';
import { data } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';


Grid.Inject(Page);

L10n.load({
    'ar-AE': {
        'grid': {
            'EmptyRecord': 'لا سجلات لعرضها',
            'EmptyDataSourceError': 'يجب أن يكون مصدر البيانات فارغة في التحميل الأولي منذ يتم إنشاء الأعمدة من مصدر البيانات في أوتوجينيراتد عمود الشبكة'
        },
        'pager': {
            'currentPageInfo': '{0} من {1} صفحة',
            'totalItemsInfo': '({0} العناصر)',
            'firstPageTooltip': 'انتقل إلى الصفحة الأولى',
            'lastPageTooltip': 'انتقل إلى الصفحة الأخيرة',
            'nextPageTooltip': 'انتقل إلى الصفحة التالية',
            'previousPageTooltip': 'انتقل إلى الصفحة السابقة',
            'nextPagerTooltip': 'الذهاب إلى بيجر المقبل',
            'previousPagerTooltip': 'الذهاب إلى بيجر السابقة'
        }
    }
});

let grid: Grid = new Grid({
    dataSource: data,
    enableRtl: true,
    locale: 'ar-AE',
    allowPaging: true,
    pageSettings: { pageSize: 7 },
    columns: [
        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120 },
        { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
        { field: 'ShipCity', headerText: 'Ship City', width: 150 },
        { field: 'ShipName', headerText: 'Ship Name', width: 150 }
    ],
});
grid.appendTo('#Grid');