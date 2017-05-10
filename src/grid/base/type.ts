import { ColumnModel } from '../models/column';

/**
 * Exports types used by Grid.
 */

export type ValueType = number | string | Date | boolean;

export type ValueAccessor = (field: string, data: Object, column: ColumnModel) => Object;

export type SortComparer = (x: ValueType, y: ValueType) => number;
