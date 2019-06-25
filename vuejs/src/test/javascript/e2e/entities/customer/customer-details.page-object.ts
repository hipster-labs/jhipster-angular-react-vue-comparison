import { element, by, ElementFinder } from 'protractor';

export default class CustomerDetailsPage {
  pageTitle: ElementFinder = element(by.css('h2.jh-entity-heading'));
  firstDetail: ElementFinder = element.all(by.css('.jh-entity-details > dd > span')).first();
  backButton: ElementFinder = element(by.css('.btn-info'));

  getPageTitle() {
    return this.pageTitle;
  }

  getFirstDetail() {
    return this.firstDetail;
  }

  getBackButton() {
    return this.backButton;
  }
}
