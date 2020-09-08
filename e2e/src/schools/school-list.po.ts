import { browser, by, element, ElementFinder, ElementArrayFinder } from 'protractor';

export class SchoolListPage {
    navigateTo(): Promise<unknown> {
        return browser.get(browser.baseUrl + 'schools') as Promise<unknown>;
    }

    getTitleText(): Promise<string> {
        return element(by.css('app-school-list h1')).getText() as Promise<string>;
    }

    getSearchForm(): ElementFinder {
        return element(by.css('app-school-list form'));
    }

    getInputField(field: string): ElementFinder {
        return element(by.css(`app-school-list form mat-form-field input[formcontrolname="${field}"]`));
    }

    getSearchButton(): ElementFinder {
        return element(by.css('app-school-list form button[type="submit"]'));
    }

    getResetButton(): ElementFinder {
        return element(by.css('app-school-list form button[type="reset"]'));
    }

    getTable(): ElementFinder {
        return element(by.css('app-school-list table'));
    }

    getTableHeaderFields(): ElementArrayFinder {
        return element.all(by.css('app-school-list table th'));
    }

    getTableHeaderField(field: string): ElementFinder {
        const headerIndex = {
            'Name': 0,
            'Street': 1,
            'Suburb': 2,
            'State': 3,
            'Post Code': 4,
            'Student Count': 5,
        };
        return this.getTableHeaderFields().get(headerIndex[field]);
    }

    getTableRows(): ElementArrayFinder {
        return element.all(by.css('app-school-list table tbody tr'));
    }

    getAddSchoolButton(): ElementFinder {
        return element(by.css('button.fixed-bottom-right'));
    }
}