import { browser, element, By, protractor } from "@syncfusion/ej2-base/e2e/index";
let EC = browser.ExpectedConditions;
export class Helper {
    public Grid: object = By.id('Grid');
    public DialogEdit: Object = By.id('Grid_dialogEdit_wrapper');

    public loadAndWait(url: string, ele: any, time: number = 2000) {
        browser.load(url);
        this.waitUntilPresent(ele, time);
    }

    public waitUntilPresent(ele: any, time: number = 2000) {
        browser.wait(
            EC.presenceOf(element(ele)), time
        );
    }

    public invisibility(ele: any, time: number =2000){
        var EC = protractor.ExpectedConditions;
        // Waits for the element with id 'abc' to be no longer visible on the dom.
        browser.wait(EC.invisibilityOf(ele), time);
    }
}
