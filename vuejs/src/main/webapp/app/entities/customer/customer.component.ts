import { Component, Inject, Vue } from 'vue-property-decorator';
import { ICustomer } from '@/shared/model/customer.model';
import AlertService from '@/shared/alert/alert.service';

import CustomerService from './customer.service';

@Component
export default class Customer extends Vue {
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('customerService') private customerService: () => CustomerService;
  private removeId: number = null;
  public customers: ICustomer[] = [];

  public isFetching = false;
  public dismissCountDown: number = this.$store.getters.dismissCountDown;
  public dismissSecs: number = this.$store.getters.dismissSecs;
  public alertType: string = this.$store.getters.alertType;
  public alertMessage: any = this.$store.getters.alertMessage;

  public getAlertFromStore() {
    this.dismissCountDown = this.$store.getters.dismissCountDown;
    this.dismissSecs = this.$store.getters.dismissSecs;
    this.alertType = this.$store.getters.alertType;
    this.alertMessage = this.$store.getters.alertMessage;
  }

  public countDownChanged(dismissCountDown: number) {
    this.alertService().countDownChanged(dismissCountDown);
    this.getAlertFromStore();
  }

  public mounted(): void {
    this.retrieveAllCustomers();
  }

  public clear(): void {
    this.retrieveAllCustomers();
  }

  public retrieveAllCustomers(): void {
    this.isFetching = true;

    this.customerService()
      .retrieve()
      .then(
        res => {
          this.customers = res.data;
          this.isFetching = false;
        },
        err => {
          this.isFetching = false;
        }
      );
  }

  public prepareRemove(instance: ICustomer): void {
    this.removeId = instance.id;
  }

  public removeCustomer(): void {
    this.customerService()
      .delete(this.removeId)
      .then(() => {
        const message = this.$t('vuejsApp.customer.deleted', { param: this.removeId });
        this.alertService().showAlert(message, 'danger');
        this.getAlertFromStore();

        this.removeId = null;
        this.retrieveAllCustomers();
        this.closeDialog();
      });
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
  }
}
