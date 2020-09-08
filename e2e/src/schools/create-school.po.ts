import { browser, by, element, ElementFinder, ElementArrayFinder, WebElementPromise } from 'protractor';

export class CreateSchoolDialog {
    getDialog(): ElementFinder {
        return element(by.css('mat-dialog-container'));
    }

    getTitleText(): Promise<string> {
        return element(by.css('h2.mat-dialog-title')).getText() as Promise<string>;
    }

    getInputField(field: string): ElementFinder {
        return element(by.css(`mat-dialog-content form input[formcontrolname="${field}"]`));
    }

    getCreateButton(): ElementFinder {
        return element(by.css('mat-dialog-actions button[type="submit"]'));
    }

    getCancelButton(): ElementFinder {
        return element(by.css('mat-dialog-actions button[type="reset"]'));
    }

    getFocusedField(): WebElementPromise {
        return browser.switchTo().activeElement();
    }

    getFormErrors(): ElementArrayFinder {
        return element.all(by.css('mat-dialog-content form mat-error'));
    }
}