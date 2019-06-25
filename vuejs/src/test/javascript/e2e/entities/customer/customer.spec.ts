/* tslint:disable no-unused-expression */
import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import CustomerComponentsPage from './customer.page-object';
import { CustomerDeleteDialog } from './customer.page-object';
import CustomerUpdatePage from './customer-update.page-object';
import CustomerDetailsPage from './customer-details.page-object';
import {
  waitUntilDisplayed,
  waitUntilHidden,
  getDangerToast,
  getInfoToast,
  getSuccessToast,
  waitSilentlyUntilDisplayed
} from '../../util/utils';

const expect = chai.expect;

describe('Customer e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let customerUpdatePage: CustomerUpdatePage;
  let customerDetailsPage: CustomerDetailsPage;
  let customerComponentsPage: CustomerComponentsPage;
  let customerDeleteDialog: CustomerDeleteDialog;
  let nbButtonsBeforeCreate = 0;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
  });

  it('should load Customers', async () => {
    await navBarPage.getEntityPage('customer');
    customerComponentsPage = new CustomerComponentsPage();

    await waitSilentlyUntilDisplayed(customerComponentsPage.getDeleteButtons().last());
    const heading = customerComponentsPage.getTitle();
    await waitUntilDisplayed(heading);

    const footer = customerComponentsPage.getFooter();
    await waitUntilDisplayed(footer);

    expect(await heading.getText()).not.to.be.empty;
    nbButtonsBeforeCreate = await customerComponentsPage.countCustomer();
  });

  it('should load create Customer page', async () => {
    await customerComponentsPage.clickOnCreateButton();
    customerUpdatePage = new CustomerUpdatePage();

    const heading = customerUpdatePage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = customerUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(customerUpdatePage.getSaveButton());

    expect(await heading.getAttribute('id')).to.match(/vuejsApp.customer.home.createOrEditLabel/);
  });

  it('should create and save Customers', async () => {
    await customerUpdatePage.setFirstNameInput('firstName');
    expect(await customerUpdatePage.getFirstNameInput()).to.match(/firstName/);

    await customerUpdatePage.setLastNameInput('lastName');
    expect(await customerUpdatePage.getLastNameInput()).to.match(/lastName/);

    await customerUpdatePage.genderSelectLastOption();

    await customerUpdatePage.setEmailInput('email');
    expect(await customerUpdatePage.getEmailInput()).to.match(/email/);

    await customerUpdatePage.setPhoneInput('phone');
    expect(await customerUpdatePage.getPhoneInput()).to.match(/phone/);

    await customerUpdatePage.setAddressLine1Input('addressLine1');
    expect(await customerUpdatePage.getAddressLine1Input()).to.match(/addressLine1/);

    await customerUpdatePage.setAddressLine2Input('addressLine2');
    expect(await customerUpdatePage.getAddressLine2Input()).to.match(/addressLine2/);

    await customerUpdatePage.setCityInput('city');
    expect(await customerUpdatePage.getCityInput()).to.match(/city/);

    await customerUpdatePage.setCountryInput('country');
    expect(await customerUpdatePage.getCountryInput()).to.match(/country/);

    await customerUpdatePage.save();
    await waitUntilHidden(customerUpdatePage.getSaveButton());
    expect(await customerUpdatePage.isSaveButtonPresent()).to.be.false;

    const toast = getSuccessToast();
    await waitUntilDisplayed(toast);
    // Success toast should appear
    expect(await toast.isPresent()).to.be.true;

    await customerComponentsPage.waitUntilCustomerCountIs(nbButtonsBeforeCreate + 1);
    expect(await customerComponentsPage.countCustomer()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should load details Customer page and fetch data', async () => {
    await customerComponentsPage.waitUntilLoaded();
    await customerComponentsPage.clickOnLastDetailsButton();
    customerDetailsPage = new CustomerDetailsPage();

    const heading = customerDetailsPage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = customerUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(await customerDetailsPage.getBackButton());
    expect(await heading.getText()).not.to.be.empty;

    const firstDetail = customerDetailsPage.getFirstDetail();
    expect(await firstDetail.getText()).not.to.be.empty;

    await customerDetailsPage.getBackButton().click();
    await customerComponentsPage.waitUntilCustomerCountIs(nbButtonsBeforeCreate + 1);
  });

  it('should load edit Customer page and fetch data', async () => {
    await customerComponentsPage.waitUntilLoaded();
    await customerComponentsPage.clickOnLastEditButton();
    const heading = customerUpdatePage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = customerUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(customerUpdatePage.getSaveButton());

    expect(await heading.getText()).not.to.be.empty;

    await customerUpdatePage.clearFirstNameInput();
    await customerUpdatePage.setFirstNameInput('modified');
    expect(await customerUpdatePage.getFirstNameInput()).to.match(/modified/);

    await customerUpdatePage.clearLastNameInput();
    await customerUpdatePage.setLastNameInput('modified');
    expect(await customerUpdatePage.getLastNameInput()).to.match(/modified/);

    await customerUpdatePage.clearEmailInput();
    await customerUpdatePage.setEmailInput('modified');
    expect(await customerUpdatePage.getEmailInput()).to.match(/modified/);

    await customerUpdatePage.clearPhoneInput();
    await customerUpdatePage.setPhoneInput('modified');
    expect(await customerUpdatePage.getPhoneInput()).to.match(/modified/);

    await customerUpdatePage.clearAddressLine1Input();
    await customerUpdatePage.setAddressLine1Input('modified');
    expect(await customerUpdatePage.getAddressLine1Input()).to.match(/modified/);

    await customerUpdatePage.clearAddressLine2Input();
    await customerUpdatePage.setAddressLine2Input('modified');
    expect(await customerUpdatePage.getAddressLine2Input()).to.match(/modified/);

    await customerUpdatePage.clearCityInput();
    await customerUpdatePage.setCityInput('modified');
    expect(await customerUpdatePage.getCityInput()).to.match(/modified/);

    await customerUpdatePage.clearCountryInput();
    await customerUpdatePage.setCountryInput('modified');
    expect(await customerUpdatePage.getCountryInput()).to.match(/modified/);

    await customerUpdatePage.save();

    await waitUntilHidden(customerUpdatePage.getSaveButton());

    expect(await customerUpdatePage.isSaveButtonPresent()).to.be.false;

    const toast = getInfoToast();
    await waitUntilDisplayed(toast);
    // Info toast should appear
    expect(await toast.isPresent()).to.be.true;
  });

  it('should delete last Customer', async () => {
    await customerComponentsPage.waitUntilLoaded();
    const nbCustomerBeforeDelete = await customerComponentsPage.countCustomer();
    await customerComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);
    customerDeleteDialog = new CustomerDeleteDialog();
    expect(await customerDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/vuejsApp.customer.delete.question/);

    await customerDeleteDialog.clickOnConfirmButton();
    await waitUntilHidden(deleteModal);

    // Delete modal should disappear
    expect(await deleteModal.isDisplayed()).to.be.false;

    const toast = getDangerToast();

    // Danger toast should appear
    expect(await toast.isPresent()).to.be.true;

    expect(await customerComponentsPage.countCustomer()).to.eq(nbCustomerBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
