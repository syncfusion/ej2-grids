import { isNullOrUndefined, extend } from '@syncfusion/ej2-base/util';
import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';
import { IDataProcessor, IGrid } from '../base/interface';
import { SearchSettingsModel, PredicateModel, SortDescriptorModel } from '../base/grid-model';
import { getActualProperties } from '../base/util';
import { AggregateRowModel, AggregateColumnModel } from '../models/models';
import * as events from '../base/constant';

/**
 * Grid data module is used to generate query and data source.
 * @hidden
 */
export class Data implements IDataProcessor {
    //Internal variables   
    private dataManager: DataManager;

    //Module declarations    
    private parent: IGrid;

    /**
     * Constructor for data module.
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        this.initDataManager();
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.rowsAdded, this.addRows, this);
        this.parent.on(events.rowsRemoved, this.removeRows, this);
        this.parent.on(events.dataSourceModified, this.initDataManager, this);
        this.parent.on(events.destroy, this.destroy, this);
    }

    /**
     * The function used to initialize dataManager and external query
     * @return {void}
     */
    private initDataManager(): void {
        let gObj: IGrid = this.parent;
        this.dataManager = gObj.dataSource instanceof DataManager ? <DataManager>gObj.dataSource :
            (isNullOrUndefined(gObj.dataSource) ? new DataManager() : new DataManager(gObj.dataSource));
        gObj.query = gObj.query instanceof Query ? gObj.query : new Query();
    }

    /**
     * The function is used to generate updated Query from Grid model.
     * @return {Query}
     * @hidden
     */
    public generateQuery(): Query {
        let gObj: IGrid = this.parent;
        let query: Query = gObj.query.clone();

        if (gObj.allowFiltering && gObj.filterSettings.columns.length) {
            let columns: PredicateModel[] = gObj.filterSettings.columns;
            for (let col of columns) {
                let sType: string = gObj.getColumnByField(col.field).type;
                if (sType !== 'date' && sType !== 'datetime') {
                    query.where(col.field, col.operator, col.value, !col.matchCase);
                } else {
                    query.where(this.getDatePredicate(col));
                }
            }
        }

        if (gObj.searchSettings.key.length) {
            let sSettings: SearchSettingsModel = gObj.searchSettings;
            sSettings.fields = sSettings.fields.length ? sSettings.fields : gObj.getColumnFieldNames();
            query.search(sSettings.key, sSettings.fields, sSettings.operator, sSettings.ignoreCase);
        }

        gObj.aggregates.forEach((row: AggregateRowModel) => {
            row.columns.forEach((column: AggregateColumnModel) => {
                query.aggregate(<string>column.type, column.field);
            });
        });

        if ((gObj.allowSorting || gObj.allowGrouping) && gObj.sortSettings.columns.length) {
            let columns: SortDescriptorModel[] = gObj.sortSettings.columns;
            let sortGrp: SortDescriptorModel[] = [];
            for (let i: number = columns.length - 1; i > -1; i--) {
                if (gObj.groupSettings.columns.indexOf(columns[i].field) === -1) {
                    query.sortBy(columns[i].field, columns[i].direction);
                } else {
                    sortGrp.push(columns[i]);
                }
            }
            for (let i: number = 0, len: number = sortGrp.length; i < len; i++) {
                query.sortBy(sortGrp[i].field, sortGrp[i].direction);

            }
        }

        if (gObj.allowPaging) {
            query.page(gObj.pageSettings.currentPage, gObj.pageSettings.pageSize);
        }

        if (gObj.allowGrouping && gObj.groupSettings.columns.length) {
            let columns: string[] = gObj.groupSettings.columns;
            for (let i: number = 0, len: number = columns.length; i < len; i++) {
                query.group(columns[i]);
            }
        }

        return query;
    }

    /** 
     * The function is used to get dataManager promise by executing given Query. 
     * @param  {Query} query - Defines the query which will execute along with data processing. 
     * @return {Promise<Object>} 
     * @hidden
     */
    public getData(query: Query): Promise<Object> {
        return this.dataManager.executeQuery(query);
    }

    private getDatePredicate(filterObject: PredicateModel): Predicate {
        let prevDate: Date;
        let nextDate: Date;
        let prevObj: PredicateModel = extend({}, getActualProperties(filterObject)) as PredicateModel;
        let nextObj: PredicateModel = extend({}, getActualProperties(filterObject)) as PredicateModel;
        let value: Date = new Date(filterObject.value);
        prevDate = new Date(value.setDate(value.getDate() - 1));
        nextDate = new Date(value.setDate(value.getDate() + 2));
        prevObj.value = prevDate;
        nextObj.value = nextDate;
        if (filterObject.operator === 'equal') {
            prevObj.operator = 'greaterthan';
            nextObj.operator = 'lessthan';
        } else {
            prevObj.operator = 'lessthanorequal';
            nextObj.operator = 'greaterthanorequal';
        }
        let predicateSt: Predicate = new Predicate(prevObj.field, prevObj.operator, prevObj.value, false);
        let predicateEnd: Predicate = new Predicate(nextObj.field, nextObj.operator, nextObj.value, false);
        return filterObject.operator === 'equal' ? predicateSt.and(predicateEnd) : predicateSt.or(predicateEnd);
    }

    private addRows(e: { toIndex: number, records: Object[] }): void {
        for (let i: number = e.records.length; i > 0; i--) {
            this.dataManager.dataSource.json.splice(e.toIndex, 0, e.records[i - 1]);
        }
    }

    private removeRows(e: { indexes: number[] }): void {
        let json: Object[] = this.dataManager.dataSource.json;
        this.dataManager.dataSource.json = json.filter((value: Object, index: number) => e.indexes.indexOf(index) === -1);
    }

    private destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.rowsAdded, this.addRows);
        this.parent.off(events.rowsRemoved, this.removeRows);
        this.parent.off(events.dataSourceModified, this.initDataManager);
        this.parent.off(events.dataSourceModified, this.destroy);
    }


}