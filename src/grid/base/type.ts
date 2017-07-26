import { ColumnModel, AggregateColumnModel } from '../models/models';

/**
 * Exports types used by Grid.
 */

export type ValueType = number | string | Date | boolean;

export type ValueAccessor = (field: string, data: Object, column: ColumnModel) => Object;

export type SortComparer = (x: ValueType, y: ValueType) => number;

export type CustomSummaryType = (data: Object[] | Object, column: AggregateColumnModel) => Object;

export type ReturnType = { result: Object[], count: number, aggregates?: Object };
