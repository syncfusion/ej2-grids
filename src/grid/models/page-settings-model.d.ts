import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class PageSettings
 */
export interface PageSettingsModel {

    /**
     * Defines the number of records displayed per page.
     * @default 12
     */
    pageSize?: number;

    /**
     * Defines the number of pages to display in pager container.  
     * @default 8 
     */
    pageCount?: number;

    /**
     * Defines the current page number of pager.
     * @default 1
     */
    currentPage?: number;

    /**
     * @hidden
     * Gets the total records count of the Grid. 
     */
    totalRecordsCount?: number;

    /**
     * If `enableQueryString` set to true,   
     * then it pass current page information as a query string along with the URL while navigating to other page.  
     * @default false  
     */
    enableQueryString?: boolean;

}