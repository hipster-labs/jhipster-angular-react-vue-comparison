import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICustomer } from 'app/shared/model/customer.model';
import { AccountService } from 'app/core';
import { CustomerService } from './customer.service';

@Component({
  selector: 'jhi-customer',
  templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit, OnDestroy {
  customers: ICustomer[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected customerService: CustomerService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.customerService
      .query()
      .pipe(
        filter((res: HttpResponse<ICustomer[]>) => res.ok),
        map((res: HttpResponse<ICustomer[]>) => res.body)
      )
      .subscribe(
        (res: ICustomer[]) => {
          this.customers = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInCustomers();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ICustomer) {
    return item.id;
  }

  registerChangeInCustomers() {
    this.eventSubscriber = this.eventManager.subscribe('customerListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
