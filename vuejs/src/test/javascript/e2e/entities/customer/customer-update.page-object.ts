import { element, by, ElementFinder, protractor, browser } from 'protractor';
import { clearElement, waitUntilDisplayed } from '../../util/utils';

export default class CustomerUpdatePage {
  getPageTitle() {
    return element(by.id('vuejsApp.customer.home.createOrEditLabel'));
  }

  getFooter() {
    return element(by.id('footer'));
  }

  getSaveButton() {
    return element(by.id('save-entity'));
  }

  async isSaveButtonPresent() {
    return await this.getSaveButton().isPresent();
  }

  async save() {
    await this.getSaveButton().click();
  }

  async cancel() {
    await element(by.id('cancel-save')).click();
  }

  //--------------------------------------------------

  findFirstNameInput() {
    return element(by.css('input#customer-firstName'));
  }

  async setFirstNameInput(firstName) {
    const elementInput = this.findFirstNameInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(firstName);
  }

  async getFirstNameInput() {
    const elementInput = this.findFirstNameInput();
    return await elementInput.getAttribute('value');
  }

  async clearFirstNameInput() {
    const elementInput = this.findFirstNameInput();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  findLastNameInput() {
    return element(by.css('input#customer-lastName'));
  }

  async setLastNameInput(lastName) {
    const elementInput = this.findLastNameInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(lastName);
  }

  async getLastNameInput() {
    const elementInput = this.findLastNameInput();
    return await elementInput.getAttribute('value');
  }

  async clearLastNameInput() {
    const elementInput = this.findLastNameInput();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  async setGenderSelect(gender) {
    const elem = element(by.css('select#customer-gender'));
    await elem.sendKeys(gender);
  }

  async getGenderSelect() {
    const elem = element(by.css('select#customer-gender'));
    const elemChecked = elem.element(by.css('option:checked'));
    return await elemChecked.getText();
  }

  async genderSelectLastOption() {
    const elem = element(by.css('select#customer-gender'));
    await elem
      .all(by.tagName('option'))
      .last()
      .click();
  }

  //--------------------------------------------------

  findEmailInput() {
    return element(by.css('input#customer-email'));
  }

  async setEmailInput(email) {
    const elementInput = this.findEmailInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(email);
  }

  async getEmailInput() {
    const elementInput = this.findEmailInput();
    return await elementInput.getAttribute('value');
  }

  async clearEmailInput() {
    const elementInput = this.findEmailInput();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  findPhoneInput() {
    return element(by.css('input#customer-phone'));
  }

  async setPhoneInput(phone) {
    const elementInput = this.findPhoneInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(phone);
  }

  async getPhoneInput() {
    const elementInput = this.findPhoneInput();
    return await elementInput.getAttribute('value');
  }

  async clearPhoneInput() {
    const elementInput = this.findPhoneInput();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  findAddressLine1Input() {
    return element(by.css('input#customer-addressLine1'));
  }

  async setAddressLine1Input(addressLine1) {
    const elementInput = this.findAddressLine1Input();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(addressLine1);
  }

  async getAddressLine1Input() {
    const elementInput = this.findAddressLine1Input();
    return await elementInput.getAttribute('value');
  }

  async clearAddressLine1Input() {
    const elementInput = this.findAddressLine1Input();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  findAddressLine2Input() {
    return element(by.css('input#customer-addressLine2'));
  }

  async setAddressLine2Input(addressLine2) {
    const elementInput = this.findAddressLine2Input();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(addressLine2);
  }

  async getAddressLine2Input() {
    const elementInput = this.findAddressLine2Input();
    return await elementInput.getAttribute('value');
  }

  async clearAddressLine2Input() {
    const elementInput = this.findAddressLine2Input();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  findCityInput() {
    return element(by.css('input#customer-city'));
  }

  async setCityInput(city) {
    const elementInput = this.findCityInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(city);
  }

  async getCityInput() {
    const elementInput = this.findCityInput();
    return await elementInput.getAttribute('value');
  }

  async clearCityInput() {
    const elementInput = this.findCityInput();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  findCountryInput() {
    return element(by.css('input#customer-country'));
  }

  async setCountryInput(country) {
    const elementInput = this.findCountryInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(country);
  }

  async getCountryInput() {
    const elementInput = this.findCountryInput();
    return await elementInput.getAttribute('value');
  }

  async clearCountryInput() {
    const elementInput = this.findCountryInput();
    await clearElement(elementInput, 100);
  }
}
