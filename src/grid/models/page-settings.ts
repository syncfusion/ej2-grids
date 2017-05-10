import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**  
 * Configures the paging behavior of Grid.  
 */
export class PageSettings extends ChildProperty<PageSettings> {
    /** 
     * Defines the number of records displayed per page.
     * @default 12
     */
    @Property(12)
    public pageSize: number;

    /** 
     * Defines the number of pages to display in pager container.  
     * @default 8 
     */
    @Property(8)
    public pageCount: number;

    /** 
     * Defines the current page number of pager.
     * @default 1
     */
    @Property(1)
    public currentPage: number;

    /** 
     * @hidden
     * Gets the total records count of the Grid. 
     */
    @Property()
    public totalRecordsCount: number;

    /**   
     * If `enableQueryString` set to true,   
     * then it pass current page information as a query string along with the URL while navigating to other page.  
     * @default false  
     */
    @Property(false)
    public enableQueryString: boolean;

}
