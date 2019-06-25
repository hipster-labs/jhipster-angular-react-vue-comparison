import { Component, Vue, Inject } from 'vue-property-decorator';

import { ICustomer } from '@/shared/model/customer.model';
import CustomerService from './customer.service';

@Component
export default class CustomerDetails extends Vue {
  @Inject('customerService') private customerService: () => CustomerService;
  public customer: ICustomer = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.customerId) {
        vm.retrieveCustomer(to.params.customerId);
      }
    });
  }

  public retrieveCustomer(customerId) {
    this.customerService()
      .find(customerId)
      .then(res => {
        this.customer = res;
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
