import { browser, ExpectedConditions as EC } from 'protractor';
import { SchoolListPage } from './school-list.po';
import { CreateSchoolDialog } from './create-school.po';

describe('Create School Dialog', () => {
    let page: SchoolListPage;
    let dialog: CreateSchoolDialog;

    beforeEach(() => {
        page = new SchoolListPage();
        dialog = new CreateSchoolDialog();
    });

    it('should display add school button', () => {
        page.navigateTo();
        expect(page.getAddSchoolButton().isDisplayed()).toBeTruthy();
    });

    it('should open create school dialog once add button is clicked', () => {
        page.navigateTo();
        page.getAddSchoolButton().click();
        browser.wait(EC.presenceOf(dialog.getDialog()), 5000);
        expect(dialog.getTitleText()).toEqual('Add New School');
        expect(dialog.getInputField('name').isDisplayed()).toBeTruthy();
        expect(dialog.getInputField('studentCount').isDisplayed()).toBeTruthy();
        expect(dialog.getInputField('street').isDisplayed()).toBeTruthy();
        expect(dialog.getInputField('suburb').isDisplayed()).toBeTruthy();
        expect(dialog.getInputField('state').isDisplayed()).toBeTruthy();
        expect(dialog.getInputField('postcode').isDisplayed()).toBeTruthy();
        dialog.getFocusedField().then((element) => {
            expect(dialog.getInputField('name').equals(element)).toBeTruthy();
        });
        expect(dialog.getCreateButton().isDisplayed()).toBeTruthy();
        expect(dialog.getCancelButton().isDisplayed()).toBeTruthy();
    });

    it('should validate the form before submitting', () => {
        page.navigateTo();
        page.getAddSchoolButton().click();
        browser.wait(EC.presenceOf(dialog.getDialog()), 5000);
        expect(dialog.getCreateButton().isEnabled()).toBeFalsy();
        dialog.getInputField('studentCount').click();
        const formErrors = dialog.getFormErrors();
        expect(formErrors.count()).toEqual(1);
        dialog.getInputField('studentCount').sendKeys('Not a number');
        dialog.getInputField('street').click();
        expect(formErrors.count()).toEqual(2);
        expect(formErrors.get(0).getText()).toEqual('Name is required');
        expect(formErrors.get(1).getText()).toEqual('Input sholud be valid number');
        dialog.getInputField('name').sendKeys('Test school');
        dialog.getInputField('studentCount').clear();
        dialog.getInputField('studentCount').sendKeys('123');
        expect(dialog.getCreateButton().isEnabled()).toBeTruthy();
    });

    it('should close the dialog after submitting', () => {
        page.navigateTo();
        page.getInputField('name').sendKeys('Test school');
        page.getSearchButton().click();
        expect(page.getTableRows().count()).toEqual(0);
        page.getAddSchoolButton().click();
        browser.wait(EC.presenceOf(dialog.getDialog()), 5000);
        dialog.getInputField('name').sendKeys('Test school');
        dialog.getInputField('studentCount').sendKeys('123');
        dialog.getCreateButton().click();
        browser.wait(EC.stalenessOf(dialog.getDialog()), 5000);
        expect(page.getTableRows().count()).toEqual(1);
    });

    it('should close the dialog when cancel button is clicked', () => {
        page.navigateTo();
        page.getInputField('name').sendKeys('Test school2');
        page.getSearchButton().click();
        expect(page.getTableRows().count()).toEqual(0);
        page.getAddSchoolButton().click();
        browser.wait(EC.presenceOf(dialog.getDialog()), 5000);
        dialog.getInputField('name').sendKeys('Test school');
        dialog.getInputField('studentCount').sendKeys('123');
        dialog.getCancelButton().click();
        browser.wait(EC.stalenessOf(dialog.getDialog()), 5000);
        expect(page.getTableRows().count()).toEqual(0);
    });
});