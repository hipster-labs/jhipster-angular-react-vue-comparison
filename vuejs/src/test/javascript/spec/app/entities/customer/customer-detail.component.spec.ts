/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';

import * as config from '@/shared/config/config';
import CustomerDetailComponent from '@/entities/customer/customer-details.vue';
import CustomerClass from '@/entities/customer/customer-details.component';
import CustomerService from '@/entities/customer/customer.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('router-link', {});

describe('Component Tests', () => {
  describe('Customer Management Detail Component', () => {
    let wrapper: Wrapper<CustomerClass>;
    let comp: CustomerClass;
    let customerServiceStub: SinonStubbedInstance<CustomerService>;

    beforeEach(() => {
      customerServiceStub = sinon.createStubInstance<CustomerService>(CustomerService);

      wrapper = shallowMount<CustomerClass>(CustomerDetailComponent, {
        store,
        i18n,
        localVue,
        provide: { customerService: () => customerServiceStub }
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundCustomer = { id: 123 };
        customerServiceStub.find.resolves(foundCustomer);

        // WHEN
        comp.retrieveCustomer(123);
        await comp.$nextTick();

        // THEN
        expect(comp.customer).toBe(foundCustomer);
      });
    });
  });
});
