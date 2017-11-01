import { isNullOrUndefined, extend, NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';
import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';
import { IDataProcessor, IGrid } from '../base/interface';
import { ReturnType } from '../base/type';
import { SearchSettingsModel, PredicateModel, SortDescriptorModel } from '../base/grid-model';
import { getActualProperties, setFormatter } from '../base/util';
import { AggregateRowModel, AggregateColumnModel } from '../models/models';
import * as events from '../base/constant';
import { ValueFormatter } from '../services/value-formatter';
import { ServiceLocator } from '../services/service-locator';
import { Column } from '../models/column';

/**
 * Grid data module is used to generate query and data source.
 * @hidden
 */
export class Data implements IDataProcessor {
    //Internal variables   
    public dataManager: DataManager;

    //Module declarations    
    private parent: IGrid;
    private serviceLocator: ServiceLocator;

    /**
     * Constructor for data module.
     * @hidden
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.initDataManager();
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.rowsAdded, this.addRows, this);
        this.parent.on(events.rowsRemoved, this.removeRows, this);
        this.parent.on(events.dataSourceModified, this.initDataManager, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.updateData, this.crudActions, this);
        this.parent.on(events.addDeleteAction, this.getData, this);
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
    public generateQuery(skipPage?: boolean): Query {
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
                let types: string[] = column.type instanceof Array ? column.type : [column.type];
                types.forEach((type: string) => query.aggregate(type, column.field));
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

        if ((gObj.allowPaging || gObj.enableVirtualization) && skipPage !== true) {
            query.page(gObj.pageSettings.currentPage, gObj.pageSettings.pageSize);
        }

        if (gObj.allowGrouping && gObj.groupSettings.columns.length) {
            let columns: string[] = gObj.groupSettings.columns;
            for (let i: number = 0, len: number = columns.length; i < len; i++) {
                let isGrpFmt: boolean = gObj.getColumnByField(columns[i]).enableGroupByFormat;
                let format: string | NumberFormatOptions | DateFormatOptions = gObj.getColumnByField(columns[i]).format;
                if (isGrpFmt) {
                    query.group(columns[i], this.formatGroupColumn.bind(this), format);
                } else {
                    query.group(columns[i], null);
                }
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
    public getData(
        args: {
            requestType?: string, foreignKeyData?: string[], data?: Object
        } =
            { requestType: '' },
        query?: Query): Promise<Object> {
        let key: string = this.getKey(args.foreignKeyData &&
            Object.keys(args.foreignKeyData).length ?
            args.foreignKeyData : this.parent.getPrimaryKeyFieldNames());
        switch (args.requestType) {
            case 'delete':
                query = query ? query : this.generateQuery();
                this.dataManager.remove(key, args.data[0], null, query) as Promise<Object>;
                break;
            case 'save':
                query = query ? query : this.generateQuery();
                this.dataManager.insert(args.data, null, query, 0);
                break;
        }
        if (this.dataManager.ready) {
            let ready: Promise<Object> = this.dataManager.ready;
            ready.then((e: ReturnType) => {
                this.dataManager = new DataManager(e.result as JSON[]);
                this.parent.refresh();
            }).catch((e: ReturnType) => {
                this.parent.trigger(events.actionFailure, { error: e });
            });
        }
        return this.dataManager.executeQuery(query);
    }
    private formatGroupColumn(value: number | Date, field: string): string | object {
        let gObj: IGrid = this.parent;
        let serviceLocator: ServiceLocator = this.serviceLocator;
        let column: Column = gObj.getColumnByField(field);
        let date: Date = value as Date;
        if (!column.type) {
            column.type = date.getDay ? (date.getHours() > 0 || date.getMinutes() > 0 ||
                date.getSeconds() > 0 || date.getMilliseconds() > 0 ? 'datetime' : 'date') : typeof (value);
        }
        if (isNullOrUndefined(column.getFormatter())) {
            setFormatter(serviceLocator, column);
        }
        let formatVal: string | object = ValueFormatter.prototype.toView(value, column.getFormatter());
        return formatVal;
    }
    private crudActions(args: {
        requestType?: string, foreignKeyData?: string[], data?: Object
    }): void {
        this.generateQuery();
        let promise: Promise<Object> = null;
        let pr: string = 'promise';
        let key: string = this.getKey(args.foreignKeyData &&
            Object.keys(args.foreignKeyData).length ? args.foreignKeyData :
            this.parent.getPrimaryKeyFieldNames());
        switch (args.requestType) {
            case 'save':
                promise = this.dataManager.update(key, args.data, null, this.generateQuery()) as Promise<Object>;
                break;
        }
        args[pr] = promise;
        this.parent.notify(events.crudAction, args);
    }


    /** @hidden */
    public saveChanges(changes: Object, key: string): Promise<Object> {
        let promise: Promise<Object> =
            this.dataManager.saveChanges(changes, key, null, this.generateQuery().requiresCount()) as Promise<Object>;
        return promise;
    }

    private getKey(keys: string[]): string {
        if (keys && keys.length) {
            return keys[0];
        }
        return undefined;
    }

    /** @hidden */
    public isRemote(): boolean {
        return this.dataManager.dataSource.offline !== true && this.dataManager.dataSource.url !== undefined;
    }

    /** @hidden */
    public getDatePredicate(filterObject: PredicateModel): Predicate {
        let prevDate: Date;
        let nextDate: Date;
        let prevObj: PredicateModel = extend({}, getActualProperties(filterObject)) as PredicateModel;
        let nextObj: PredicateModel = extend({}, getActualProperties(filterObject)) as PredicateModel;
        let value: Date = new Date(filterObject.value as string);
        prevDate = new Date(value.setDate(value.getDate() - 1));
        nextDate = new Date(value.setDate(value.getDate() + 2));
        prevObj.value = prevDate;
        nextObj.value = nextDate;
        if (filterObject.operator === 'equal') {
            prevObj.operator = 'greaterthan';
            nextObj.operator = 'lessthan';
        } else if (filterObject.operator === 'notequal') {
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

    private removeRows(e: { indexes: number[], records: Object[] }): void {
        let json: Object[] = this.dataManager.dataSource.json;
        this.dataManager.dataSource.json = json.filter((value: Object, index: number) => e.records.indexOf(value) === -1);
    }

    private destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.rowsAdded, this.addRows);
        this.parent.off(events.rowsRemoved, this.removeRows);
        this.parent.off(events.dataSourceModified, this.initDataManager);
        this.parent.off(events.dataSourceModified, this.destroy);
        this.parent.off(events.updateData, this.crudActions);
        this.parent.off(events.addDeleteAction, this.getData);
    }


}