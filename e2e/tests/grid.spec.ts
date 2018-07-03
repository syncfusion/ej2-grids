import { browser, element, By, protractor, ElementFinder } from "@syncfusion/ej2-base/e2e/index";
import { Helper } from "./helper";
let helper =new Helper();

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1600, 1200);
}

describe('Grid', function () {
  
    it('grid Header', function (done) {
        browser.load('/demos/grid/default/default.html');
        browser.compareScreen(element(By.id('Grid')), 'default_grid', done);
        });

    it('select row', function (done) {
        browser.load('/demos/grid/default/default.html')
        browser.actions().mouseMove(element(By.css('.e-row'))).click().perform().then(function () {
            browser.compareScreen(element(By.id('Grid')), 'row_select', done);
        });
    });

    it('filter check', function (done) {
        browser.load('/demos/grid/default/default.html')
        let textBox: ElementFinder = element(By.id('OrderID_filterBarcell'));
        textBox.sendKeys("10251");
        textBox.sendKeys(protractor.Key.ENTER).then(() => {
            browser.compareScreen(element(By.id('Grid')), 'filter_row', done);
        })
    });

    it('grouping column', function (done) {
        browser.load('/demos/grid/default/default.html')
        let head: ElementFinder = element(By.css('div[e-mappinguid="grid-column0"]'));
        let area: ElementFinder = element(By.css('.e-groupdroparea'));
        browser.actions().dragAndDrop(head, area).mouseUp().perform().then(() => {
            browser.compareScreen(element(By.id('Grid')), 'grouping_column', done);
        })
    });

    it('grid Normal-Editing-Validation', function (done) {
        browser.load('/demos/grid/editing/normal.html');
        browser.actions().mouseMove(element(By.id('Grid_add'))).click().perform().then(function () {
        element(By.id('Grid_update')).click();
            browser.compareScreen(element(By.id('Grid')), 'NormalEdit-Validation', done);
        });
    });

    it('grid Normal-Editing-cancel', function (done) {
        browser.load('/demos/grid/editing/normal.html');
        browser.actions().mouseMove(element(By.id('Grid_add'))).click().perform().then(function () {
        element(By.id('Grid_update')).click();
        element(By.id('Grid_cancel')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.id('Grid')), 'NormalEdit-cancel', done);
        });
    });

    it('grid Normal-Editing-add', function (done) {
        browser.load('/demos/grid/editing/normal.html');
        browser.actions().mouseMove(element(By.id('Grid_add'))).click().perform().then(function () {
        element(By.id('GridOrderID')).sendKeys('10246');
        element(By.id('GridCustomerID')).sendKeys('customer');
        element(By.id('GridShipName')).sendKeys('ship');
        element(By.id('GridShipCountry')).sendKeys('Shipcountry')
        browser.actions().mouseMove(element(By.id('Grid_update'))).click().perform().then(function () {
            browser.compareScreen(element(By.id('Grid')), 'NormalEdit-add', done);
         });
      });
    });

    it('grid Normal-Editing', function () {
        browser.load('/demos/grid/editing/normal.html');
        element.all(By.className("e-row")).get(1).click();
        element(By.id('Grid_edit')).click();
        element(By.id('GridCustomerID')).sendKeys('Customer');
        element(By.id('GridShipName')).sendKeys('shipname');
        element(By.id('Grid_update')).click();
            browser.compareScreen(element(By.id('Grid')), 'Normal-Editing');
    });

    it('grid Normal-Deleting-withSelection', function () {
        browser.load('/demos/grid/editing/normal.html');
        element.all(By.className("e-row")).get(2).click();
        element(By.id('Grid_delete')).click();
            browser.compareScreen(element(By.id('Grid')), 'Normal-Deleting-withSelection');
    });

    it('grid Dialog-Editing-Validation', function (done) {
        browser.load('/demos/grid/editing/dialog.html');
        element(By.id('Grid_add')).click();
        browser.actions().mouseMove(element.all(By.className('e-primary')).get(2)).click().perform().then(function () {
                browser.compareScreen(element(By.id('Grid')), 'Dialog-Editing-Validation', done);
        });
    });

    it('grid Dialog-Editing-cancel', function (done) {
        browser.load('/demos/grid/editing/dialog.html');
        element(By.id('Grid_add')).click();
        browser.actions().mouseMove(element.all(By.className('e-flat')).get(2)).click().perform().then(function () {
            browser.compareScreen(element(By.id('Grid')), 'Dialog-Editing-cancel', done);
        });
    });

    it('grid Dialog-Editing-add-after', function (done) {
        browser.load('/demos/grid/editing/dialog.html');
        element(By.id('Grid_add')).click();
        element(By.id('GridOrderID')).sendKeys('10246');
        element(By.id('GridCustomerID')).sendKeys('Vinet');
        element(By.id('GridShipName')).sendKeys('Toms');
        element(By.id('GridShipCountry')).sendKeys('France');
        browser.actions().mouseMove(element.all(By.className('e-primary')).get(2)).click().perform().then(function () {
                browser.sleep(500);
                browser.compareScreen(element(By.id('Grid')), 'Dialog-Editing-add-after', done);
        })
    });

    it('grid Dialog-Editing', function (done) {
        browser.load('/demos/grid/editing/dialog.html');
        element.all(By.className("e-row")).get(1).click();
        element(By.id('Grid_edit')).click();
        element(By.id('GridCustomerID')).sendKeys('TOM');
        element(By.id('GridShipName')).sendKeys('Hanari');
        browser.actions().mouseMove(element.all(By.className('e-primary')).get(2)).click().perform().then(function () {
            browser.compareScreen(element(By.id('Grid')), 'Dialog-Editing', done);
        });
    });

    it('grid Dialog-Deleting-withSelection', function () {
        browser.load('/demos/grid/editing/dialog.html');
        element.all(By.className("e-row")).get(2).click();
        element(By.id('Grid_delete')).click();
            browser.compareScreen(element(By.id('Grid')), 'Dialog-Deleting');
    });

    it('grid batch-delete', function () {
        browser.load('/demos/grid/editing/batch.html');
        element.all(By.className("e-row")).get(2).click();
        element(By.id('Grid_delete')).click();
            browser.compareScreen(element(By.id('Grid')), 'batch-delete');
    });

    it('grid batch-delete-after-update', function (done) {
        browser.load('/demos/grid/editing/batch.html');
        element.all(By.className("e-row")).get(2).click();
        element(By.id('Grid_delete')).click();
        browser.actions().mouseMove(element(By.id('Grid_update'))).click().perform().then(function () {
            element.all(By.className('e-primary')).get(1).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.id('Grid')), 'batch-delete-after-update', done);
        });
    });

    it('grid batch-add', function (done) {
        browser.load('/demos/grid/editing/batch.html');
        browser.actions().mouseMove(element(By.id('Grid_add'))).click().perform().then(function () {
            browser.sleep(1000);
            browser.compareScreen(element(By.id('Grid')), 'batch-add', done);
        });
    });

    it('grid validation-batchediting', function (done) {
        browser.load('/demos/grid/editing/batch.html');
        element(By.id('Grid_add')).click();
        let textBox: ElementFinder = element(By.className('e-rowcell'));
        textBox.sendKeys(protractor.Key.TAB).then(() => {
            element.all(By.className('e-rowcell')).get(1).sendKeys(protractor.Key.ENTER)
            browser.compareScreen(element(By.id('Grid')), 'batchediting', done);
        })
    })

    it('grid Command-column-cancel', function () {
        browser.load('/demos/grid/editing/commandcolumn.html');
        element(By.id('Gridedit_0')).click();
        element(By.id('Gridcancel_0')).click();
            browser.compareScreen(element(By.id('Grid')), 'Commandcolumn-cancel');
    });

    it('grid Command-column-Editing', function () {
        browser.load('/demos/grid/editing/commandcolumn.html');
        element(By.id('Gridedit_1')).click();
        element(By.id('GridCustomerID')).sendKeys('BBBBB');
        element(By.id('GridShipName')).sendKeys('YYYYYY');
        element(By.id('Gridsave_1')).click();
            browser.compareScreen(element(By.id('Grid')), 'Comandcolumn-Editing');
    });

    it('grid commandcolumn-Deleting', function () {
        browser.load('/demos/grid/editing/commandcolumn.html');
        element(By.id('Griddelete_3')).click();
            browser.compareScreen(element(By.id('Grid')), 'commandcolumn-Deleting');
    });

    it('grid detailtemp', function () {
        browser.load('/demos/grid/detailtemp/index.html');
        browser.compareScreen(element(By.id('Grid')), 'grid_detailtemp');
    })

    it('grid grid_detailtemp-expand', function () {
        browser.load('/demos/grid/detailtemp/index.html');
        element.all(By.className('e-detailrowcollapse')).get(0).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.id('Grid')), 'grid_detailtemp-expand');
    })

    it('grid rowtemplate', function () {
        browser.load('/demos/grid/rows/index.html');
        browser.sleep(1000);
        browser.compareScreen(element(By.id('Grid')), 'grid_rowtemplate');
    })

    it('grid headertemplate', function () {
        browser.load('/demos/grid/templates/headerTemplate.html');
        browser.compareScreen(element(By.id('Grid')), 'grid_headertemplate');
    })

    it('grid columntemplate', function () {
        browser.load('/demos/grid/templates/columnTemplate.html');
        browser.sleep(1000);
        browser.compareScreen(element(By.id('Grid')), 'grid_columntemplate');
    })
    it('grid hierarchy', function () {
        browser.load('/demos/grid/hierarchy/index.html');
        browser.compareScreen(element(By.id('Grid')), 'grid_hierarchy');
    })

    it('grid hierarchy level1', function (done) {
        browser.load('/demos/grid/hierarchy/index.html');
        browser.actions().mouseMove(element.all(By.className('e-detailrowcollapse')).get(0)).click().perform().then(function () {
            browser.sleep(2000);
            browser.compareScreen(element(By.id('Grid')), 'grid_hierarchy1', done);
        });
    })

    it('grid hierarchy level2', function () {
        browser.load('/demos/grid/hierarchy/index.html');
        browser.actions().mouseMove(element.all(By.className('e-detailrowcollapse')).get(0)).click().perform().then(function () {
            browser.sleep(2000);
            element.all(By.className('e-detailrowcollapse')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('Grid')), 'grid_hierarchy2');
        });
    })

    it('grid aggregates', function () {
        browser.load('/demos/grid/aggregates/default.html');
        browser.compareScreen(element(By.id('Grid')), 'grid_defaultaggregates');
    })

    it('grid defaultaggregateswithgroup', function () {
        browser.load('/demos/grid/aggregates/group.html');
        browser.compareScreen(element(By.id('Grid')), 'grid_aggregateswithgroup');
    })

    it('grid groupcaption', function () {
        browser.load('/demos/grid/aggregates/groupcaption.html');
        browser.compareScreen(element(By.id('Grid')), 'grid_groupcaption');
    })

    it('grid caption', function () {
        browser.load('/demos/grid/aggregates/caption.html');
        browser.compareScreen(element(By.id('Grid')), 'grid_caption');
    })

    it('grid grouping', function () {
        browser.load('/demos/grid/grouping/index.html');
        element.all(By.className('e-grptogglebtn')).get(0).click();
        element.all(By.className('e-grptogglebtn')).get(1).click();
        browser.compareScreen(element(By.id('Grid')), 'grid_grouping');
    })

    it('grid groupingallcolumns', function () {
        browser.load('/demos/grid/grouping/index.html');
        element.all(By.className('e-grptogglebtn')).get(0).click();
        element.all(By.className('e-grptogglebtn')).get(1).click();
        element.all(By.className('e-grptogglebtn')).get(2).click();
        element.all(By.className('e-grptogglebtn')).get(3).click();
        element.all(By.className('e-grptogglebtn')).get(4).click();
        browser.compareScreen(element(By.id('Grid')), 'grid_groupingallcolumns');
    })

    it('grid groupcollapse', function () {
        browser.load('/demos/grid/grouping/index.html');
        element.all(By.className('e-grptogglebtn')).get(0).click();
        element.all(By.className('e-icon-gdownarrow')).get(0).click();
        browser.compareScreen(element(By.id('Grid')), 'grid_grouping_collapse');
    })

    it('grid showgroupedcolumns', function (done) {
        browser.load('/demos/grid/grouping/groupedcolumns.html');
        let head: ElementFinder = element(By.css('div[e-mappinguid="grid-column0"]'));
        let area: ElementFinder = element(By.css('.e-groupdroparea'));
        browser.actions().dragAndDrop(head, area).mouseUp().perform().then(() => {
            browser.compareScreen(element(By.id('Grid')), 'grid_showgroupedcolumns', done);
        })
    })

    it('grid cellselection', function () {
        browser.load('/demos/grid/selection/cellselection.html');
        element.all(By.className('e-rowcell')).get(8).click();
        browser.compareScreen(element(By.id('Grid')), 'grid_cellselection');
    })

    it('grid allcolumnselection', function () {
        browser.load('/demos/grid/selection/checkboxselection.html');
        element.all(By.className('e-frame')).get(0).click();
        browser.compareScreen(element(By.id('Grid')), 'grid_checkboxselect');
    })

    it('grid multicolumnselection', function () {
        browser.load('/demos/grid/selection/checkboxselection.html');
        element.all(By.className('e-frame')).get(1).click();
        element.all(By.className('e-frame')).get(3).click();        
        browser.compareScreen(element(By.id('Grid')), 'grid_multiselect');
    })

    it('grid defaultfiltering', function (done) {
        browser.load('/demos/grid/filter/default.html');
        let textBox: ElementFinder = element(By.id('ShipCountry_filterBarcell'));
        textBox.sendKeys("France");
        textBox.sendKeys(protractor.Key.ENTER).then(() => {
            browser.sleep(2000);
            browser.compareScreen(element(By.id('Grid')), 'grid_filtering', done);
        })
    });

    it('grid customtoolbar', function (done) {
        browser.load('/demos/grid/filter/filterbartemplate.html');
        browser.compareScreen(element(By.id('Grid')), 'grid_filterbar', done);
    });
    
    it('grid filtermenu', function () {
        browser.load('/demos/grid/filter/filtermenu.html');
        element.all(By.className('e-icon-filter')).get(1).click();
        element(By.className('e-flmenu-input')).sendKeys('Hanar'); 
        element(By.className('e-flmenu-okbtn')).click();  
        browser.compareScreen(element(By.id('Grid')), 'grid_filtermenu');
    })

    it('grid checkboxfilter', function () {
        browser.load('/demos/grid/filter/checkboxfilter.html');
        element.all(By.className('e-icon-filter')).get(4).click();
        element(By.id('Grid_SearchBox')).sendKeys('france'); 
        element(By.className('e-primary')).click();  
        browser.compareScreen(element(By.id('Grid')), 'grid_checkboxfilter');
    })

    it('grid excel-filter', function () {
        browser.load('/demos/grid/filter/excel.html');
        element.all(By.className('e-icon-filter')).get(1).click();
        element(By.id('Grid_SearchBox')).sendKeys('centc'); 
        element(By.className('e-primary')).click();  
        browser.compareScreen(element(By.id('Grid')), 'grid_excelfilter');
    })

    it('grid search toolbar', function () {
        browser.load('/demos/grid/filter/search.html');
        element(By.id('Grid_searchbar')).sendKeys('VINET');
        element(By.id('Grid_searchbutton')).click();  
        browser.compareScreen(element(By.id('Grid')), 'grid_search');
    })

    it('grid Grid_colmenu_autoFit', function () {
        browser.load('/demos/grid/columnmenu/columnmenu.html');
        element(By.className('e-columnmenu')).click();
        element(By.id('Grid_colmenu_autoFit')).click();
        browser.compareScreen(element(By.id('Grid')), 'Grid_colmenu_autoFit');
    })

    it('grid Grid_colmenu_autoFitAll', function () {
        browser.load('/demos/grid/columnmenu/columnmenu.html');
        element(By.className('e-columnmenu')).click();
        element(By.id('Grid_colmenu_autoFitAll')).click();
        browser.compareScreen(element(By.id('Grid')), 'Grid_colmenu_autoFitAll');
    })

    it('grid Grid_colmenu_group', function () {
        browser.load('/demos/grid/columnmenu/columnmenu.html');
        element(By.className('e-columnmenu')).click();
        element(By.id('Grid_colmenu_group')).click();
        browser.compareScreen(element(By.id('Grid')), 'Grid_colmenu_group');
    })

    it('grid Grid_colmenu_ungroup', function () {
        browser.load('/demos/grid/columnmenu/columnmenu.html');
        element(By.className('e-columnmenu')).click();
        element(By.id('Grid_colmenu_group')).click();
         element(By.className('e-columnmenu')).click();
        element(By.id('Grid_colmenu_ungroup')).click();
        browser.compareScreen(element(By.id('Grid')), 'Grid_colmenu_ungroup');
    })

    it('grid Grid_colmenu_sortAscending', function () {
        browser.load('/demos/grid/columnmenu/columnmenu.html');
        element(By.className('e-columnmenu')).click();
        element(By.id('Grid_colmenu_sortAscending')).click();
        browser.compareScreen(element(By.id('Grid')), 'Grid_colmenu_sortAscending');
    })

    it('grid Grid_colmenu_sortDescending', function (done) {
        browser.load('/demos/grid/columnmenu/columnmenu.html');
        element(By.className('e-columnmenu')).click();
        element(By.id('Grid_colmenu_sortAscending')).click();
        element(By.className('e-columnmenu')).click()
        browser.actions().mouseMove(element(By.id('Grid_colmenu_sortDescending'))).click().perform().then(function () {
            browser.compareScreen(element(By.id('Grid')), 'Grid_colmenu_sortDescending', done);
        })
    });

    it('grid Grid_colmenu_columnChooser', function () {
        browser.load('/demos/grid/columnmenu/columnmenu.html');
        element(By.className('e-columnmenu')).click();
        element(By.id('Grid_colmenu_columnChooser')).click();
        element(By.id('Grid_colmenu__chooser_CustomerID')).click();
        browser.compareScreen(element(By.id('Grid')), 'Grid_colmenu_columnChooser');
    })

    it('grid Grid_colmenu_filter', function () {
        browser.load('/demos/grid/columnmenu/columnmenu.html');
        element(By.className('e-columnmenu')).click();
        element(By.id('Grid_colmenu_filter')).click();
        element(By.id('Grid_SearchBox')).sendKeys('10248');
        element(By.className('e-primary')).click();
        browser.compareScreen(element(By.id('Grid')), 'Grid_colmenu_filter');
    })

    it('grid Grid_stackedheader', function () {
        browser.load('/demos/grid/stackedheader/stackedheader.html');
        browser.compareScreen(element(By.id('Grid')), 'Grid_stackedheader');
    })

    it('grid Grid_contextheader', function (done) {
        browser.load('/demos/grid/contextmenu/index.html');
        let header: ElementFinder = element(By.className('e-headercell'));
        header.sendKeys(protractor.Button.RIGHT).then(() => {
            browser.compareScreen(element(By.id('Grid')), 'Grid_headermenu', done);
        })
    })

    it('grid Grid_contextcontent', function () {
        browser.load('/demos/grid/contextmenu/index.html');
        browser.actions().mouseMove(element(By.className('e-rowcell'))).perform();
        browser.actions().click(protractor.Button.RIGHT).perform();
        browser.compareScreen(element(By.id('Grid')), 'Grid_contentmenu');
    })

    it('grid Grid_contextpager', function () {
        browser.load('/demos/grid/contextmenu/index.html');
        browser.actions().click(element(By.className('e-gridpager')),protractor.Button.RIGHT).perform()
        browser.compareScreen(element(By.id('Grid')), 'Grid_pagermenu');
    })

    it('grid Pager', function () {
        browser.load('/demos/grid/paging/page.html')
        browser.compareScreen(element(By.id('Grid')), 'paging');
    })

    it('grid Default Pager', function () {
        browser.load('/demos/grid/paging/default.html')
        browser.compareScreen(element(By.id('Grid')), 'default-pager');
    })

    it('grid PagerApi', function () {
        browser.load('/demos/grid/paging/pageapi.html')
        browser.compareScreen(element(By.id('Grid')), 'grid-pageapi');
    })

    it('grid Pagetemplate', function () {
        browser.load('/demos/grid/paging/template.html')
        browser.sleep(1000);
        browser.compareScreen(element(By.id('Grid')), 'grid-pagetemplate');
    })

    it('grid autowrap', function () {
        browser.load('/demos/grid/autowrap/autowrap.html')
        browser.sleep(3000);
        browser.compareScreen(element(By.id('Grid')), 'grid-autowrap');
    })

    it('grid localization', function () {
        browser.load('/demos/grid/localization/locale.html')
        browser.compareScreen(element(By.id('Grid')), 'grid-locale');
    })

    it('grid localizationwith rtl', function () {
        browser.load('/demos/grid/localization/localertl.html')
        browser.compareScreen(element(By.id('Grid')), 'locale_rtl');
    })

    it('grid Grid_columnspanning', function (done:Function) {
        browser.get(browser.basePath + '/demos/grid/columnspanning/spanning.html').then(() => {
            browser.sleep(3000);
            browser.compareScreen(element(By.id('Grid')), 'Grid_columnspanning', done);
        });
    })

    it('grid colunmchooser', function () {
        browser.load('/demos/grid/columnchooser/columnchooser.html');
        element(By.id("Grid_columnchooser")).click();
        element.all(By.className('e-check')).click();
        element(By.className('e-primary')).click();
        browser.compareScreen(element(By.id('Grid')), 'grid_uncheck_column');
    })

    it('grid allcolunmchooser', function () {
        browser.load('/demos/grid/columnchooser/columnchooser.html');
        element(By.id("Grid_columnchooser")).click();
        element.all(By.className('e-uncheck')).click();
        element(By.className('e-primary')).click();
        browser.compareScreen(element(By.id('Grid')), 'grid_check_allcolumn');
    })

    it('grid scroll_default', function () {
        browser.load('/demos/grid/scroll/default.html');
        browser.compareScreen(element(By.id('Grid')), 'scroll_default');
    })

    it('grid scroll_responsive', function () {
        browser.load('/demos/grid/scroll/responsive.html');
        browser.compareScreen(element(By.id('Grid')), 'scroll_responsive');
    })

    it('grid scroll_rtl', function () {
        browser.load('/demos/grid/scroll/rtl.html');
        browser.compareScreen(element(By.id('Grid')), 'scroll_rtl');
    })

    it('grid virtual_default', function () {
        browser.load('/demos/grid/scroll/virtual.html');
            browser.sleep(500);
            browser.compareScreen(element(By.id('Grid')), 'virtual_default');
    })

    it('grid virtual_column', function () {
        browser.load('/demos/grid/scroll/column.html');
            browser.sleep(500);
            browser.compareScreen(element(By.id('Grid')), 'virtual_column');
    })

    it('grid Grid_rtl-bothlines', function () {
        browser.load('/demos/grid/rtl/rtl-bothlines.html');
        browser.compareScreen(element(By.id('Grid')), 'Grid_rtl-bothlines');
    })

    it('grid Grid_rtl-verticallines', function () {
        browser.load('/demos/grid/rtl/rtl-verticallines.html');
        browser.compareScreen(element(By.id('Grid')), 'Grid_rtl-verticallines');
    })

    it('grid Grid_rtl-linesnone', function () {
        browser.load('/demos/grid/rtl/rtl-linesnone.html');
        browser.compareScreen(element(By.id('Grid')), 'Grid_rtl-linesnone');
    })

    it('grid Grid_rtl-horizontallines', function () {
        browser.load('/demos/grid/rtl/rtl-horizontallines.html');
        browser.compareScreen(element(By.id('Grid')), 'Grid_rtl-horizontallines');
    })

    it('grid foreignkey', function (done) {
        browser.load('/demos/grid/foreignkey/foreign.html')
            browser.compareScreen(element(By.id('Grid')), 'foreign_default_grid', done);
    });

    it('foreignkey select', function (done) {
        browser.load('/demos/grid/foreignkey/foreign.html')
        browser.actions().mouseMove(element.all(By.css('.e-row')).get(3)).click().perform().then(function () {
            browser.compareScreen(element(By.id('Grid')), 'foreign_row_select', done);
        });
    });

    it('foreignkey sort', function (done) {
        browser.load('/demos/grid/foreignkey/foreign.html')
        let textBox: ElementFinder = element.all(By.className('e-headercell')).get(1);
        browser.actions().mouseMove(textBox).click().perform().then(function () {
            browser.compareScreen(element(By.id('Grid')), 'foreign_sort', done);
        })
    });

    it('foreignkey grouping', function (done) {
        browser.load('/demos/grid/foreignkey/foreign.html')
        let head: ElementFinder = element(By.css('div[e-mappinguid="grid-column1"]'));
        let area: ElementFinder = element(By.css('.e-groupdroparea'));
        browser.actions().dragAndDrop(head, area).mouseUp().perform().then(() => {
            browser.compareScreen(element(By.id('Grid')), 'foreign-group', done);
        })
    });

    it('foreignkey filter', function (done) {
        browser.load('/demos/grid/foreignkey/foreign.html')
        let textBox: ElementFinder = element(By.id('CustomerID_filterBarcell'));
        textBox.sendKeys("b");
        textBox.sendKeys(protractor.Key.ENTER).then(() => {
            browser.sleep(2000)
            browser.compareScreen(element(By.id('Grid')), 'foreign-filter', done);
        })
    });

    it('grid search toolbar', function (done) {
        browser.load('/demos/grid/foreignkey/foreign.html');
        element(By.id('Grid_searchbar')).sendKeys('PAUL');
        browser.actions().mouseMove(element(By.id('Grid_searchbutton'))).click().perform().then(function () {
            browser.compareScreen(element(By.id('Grid')), 'foreign_search', done);
        })
    })

    it('foreignkey Normal-Editing', function (done) {
        browser.load('/demos/grid/foreignkey/foreign.html')
        element.all(By.className("e-row")).get(1).click();
        element(By.id('Grid_edit')).click();
        let textBox: ElementFinder = element(By.id('GridCustomerID'));
        textBox.sendKeys("a");
        textBox.sendKeys(protractor.Key.ENTER).then(() => {
            browser.compareScreen(element(By.id('Grid')), 'foreign-edit', done);
        })
    });

    it('grid frozen normal', function (done) {
        browser.load('/demos/grid/frozen/normal.html');
            browser.compareScreen(element(By.id('Grid')), 'frozen_normal', done);
    })

    it('grid frozen column', function (done) {
        browser.load('/demos/grid/frozen/column.html');
            browser.compareScreen(element(By.id('Grid')), 'frozen_column', done);
    })

    it('grid frozen row', function (done) {
        browser.load('/demos/grid/frozen/row.html');
            browser.compareScreen(element(By.id('Grid')), 'frozen_row', done);
    })

    it('grid row height high', function (done) {
        browser.load('/demos/grid/rows/row-height-high.html');
            browser.compareScreen(element(By.id('Grid')), 'rowheight_high', done);
    })

    it('grid row height low', function (done) {
        browser.load('/demos/grid/rows/grid-row-height.html');
            browser.compareScreen(element(By.id('Grid')), 'rowheight_low', done);
    })
})