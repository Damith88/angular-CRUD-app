import { SchoolListPage } from './school-list.po';

describe('School List page', () => {
    let page: SchoolListPage;

    beforeEach(() => {
        page = new SchoolListPage();
    });

    it('should display the page header as "School List"', () => {
        page.navigateTo();
        expect(page.getTitleText()).toEqual('School List');
    });

    it('should contain a search form', () => {
        page.navigateTo();
        expect(page.getSearchForm().isDisplayed()).toBeTruthy();
        expect(page.getInputField('name').isDisplayed()).toBeTruthy();
        expect(page.getInputField('street').isDisplayed()).toBeTruthy();
        expect(page.getInputField('suburb').isDisplayed()).toBeTruthy();
        expect(page.getInputField('state').isDisplayed()).toBeTruthy();
        expect(page.getInputField('postcode').isDisplayed()).toBeTruthy();
        expect(page.getSearchButton().isDisplayed()).toBeTruthy();
        expect(page.getSearchButton().isEnabled()).toBeTruthy();
        expect(page.getSearchButton().getText()).toEqual('Search');
        expect(page.getResetButton().isDisplayed()).toBeTruthy();
        expect(page.getResetButton().isEnabled()).toBeFalsy();
        expect(page.getResetButton().getText()).toEqual('Reset');
    });

    it('should display a table of schools', () => {
        page.navigateTo();
        expect(page.getTable().isDisplayed()).toBeTruthy();
        const tableHeaders = page.getTableHeaderFields();
        expect(tableHeaders.count()).toEqual(6);
        expect(tableHeaders.get(0).getText()).toEqual('Name');
        expect(tableHeaders.get(1).getText()).toEqual('Street');
        expect(tableHeaders.get(2).getText()).toEqual('Suburb');
        expect(tableHeaders.get(3).getText()).toEqual('State');
        expect(tableHeaders.get(4).getText()).toEqual('Post Code');
        expect(tableHeaders.get(5).getText()).toEqual('Student Count');
        expect(page.getTableRows().count()).toEqual(20);
    });

    it('should be able to search by name and school address', () => {
        page.navigateTo();
        const rows = page.getTableRows();
        page.getInputField('name').sendKeys('Albany');
        expect(page.getResetButton().isEnabled()).toBeTruthy();
        page.getSearchButton().click();
        expect(rows.count()).toEqual(4);
        page.getResetButton().click();
        expect(rows.count()).toEqual(20);
        page.getInputField('street').sendKeys('Wittenoom');
        page.getSearchButton().click();
        expect(rows.count()).toEqual(1);
        expect(page.getResetButton().isEnabled()).toBeTruthy();
        page.getResetButton().click();
        page.getInputField('suburb').sendKeys('ALKIMOS');
        page.getSearchButton().click();
        expect(rows.count()).toEqual(3);
        page.getResetButton().click();
        page.getInputField('state').sendKeys('WA');
        page.getSearchButton().click();
        expect(rows.count()).toEqual(20);
        page.getResetButton().click();
        page.getInputField('postcode').sendKeys('6330');
        page.getSearchButton().click();
        expect(rows.count()).toEqual(4);
        page.getResetButton().click();
    });
});