<template>
    <div>
        <h2 id="page-heading">
            <span v-text="$t('vuejsApp.customer.home.title')" id="customer-heading">Customers</span>
            <router-link :to="{name: 'CustomerCreate'}" tag="button" id="jh-create-entity" class="btn btn-primary float-right jh-create-entity create-customer">
                <font-awesome-icon icon="plus"></font-awesome-icon>
                <span  v-text="$t('vuejsApp.customer.home.createLabel')">
                    Create new Customer
                </span>
            </router-link>
        </h2>
        <b-alert :show="dismissCountDown"
            dismissible
            :variant="alertType"
            @dismissed="dismissCountDown=0"
            @dismiss-count-down="countDownChanged">
            {{alertMessage}}
        </b-alert>
        <br/>
        <div class="alert alert-warning" v-if="!isFetching && customers && customers.length === 0">
            <span v-text="$t('vuejsApp.customer.home.notFound')">No customers found</span>
        </div>
        <div class="table-responsive" v-if="customers && customers.length > 0">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th><span v-text="$t('global.field.id')">ID</span></th>
                    <th><span v-text="$t('vuejsApp.customer.firstName')">First Name</span></th>
                    <th><span v-text="$t('vuejsApp.customer.lastName')">Last Name</span></th>
                    <th><span v-text="$t('vuejsApp.customer.gender')">Gender</span></th>
                    <th><span v-text="$t('vuejsApp.customer.email')">Email</span></th>
                    <th><span v-text="$t('vuejsApp.customer.phone')">Phone</span></th>
                    <th><span v-text="$t('vuejsApp.customer.addressLine1')">Address Line 1</span></th>
                    <th><span v-text="$t('vuejsApp.customer.addressLine2')">Address Line 2</span></th>
                    <th><span v-text="$t('vuejsApp.customer.city')">City</span></th>
                    <th><span v-text="$t('vuejsApp.customer.country')">Country</span></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="customer in customers"
                    :key="customer.id">
                    <td>
                        <router-link :to="{name: 'CustomerView', params: {customerId: customer.id}}">{{customer.id}}</router-link>
                    </td>
                    <td>{{customer.firstName}}</td>
                    <td>{{customer.lastName}}</td>
                    <td v-text="$t('vuejsApp.Gender.' + customer.gender)">{{customer.gender}}</td>
                    <td>{{customer.email}}</td>
                    <td>{{customer.phone}}</td>
                    <td>{{customer.addressLine1}}</td>
                    <td>{{customer.addressLine2}}</td>
                    <td>{{customer.city}}</td>
                    <td>{{customer.country}}</td>
                    <td class="text-right">
                        <div class="btn-group flex-btn-group-container">
                            <router-link :to="{name: 'CustomerView', params: {customerId: customer.id}}" tag="button" class="btn btn-info btn-sm details">
                                <font-awesome-icon icon="eye"></font-awesome-icon>
                                <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                            </router-link>
                            <router-link :to="{name: 'CustomerEdit', params: {customerId: customer.id}}"  tag="button" class="btn btn-primary btn-sm edit">
                                <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                                <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                            </router-link>
                            <b-button v-on:click="prepareRemove(customer)"
                                   variant="danger"
                                   class="btn btn-sm"
                                   v-b-modal.removeEntity>
                                <font-awesome-icon icon="times"></font-awesome-icon>
                                <span class="d-none d-md-inline" v-text="$t('entity.action.delete')">Delete</span>
                            </b-button>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <b-modal ref="removeEntity" id="removeEntity" >
            <span slot="modal-title"><span id="vuejsApp.customer.delete.question" v-text="$t('entity.delete.title')">Confirm delete operation</span></span>
            <div class="modal-body">
                <p id="jhi-delete-customer-heading" v-bind:title="$t('vuejsApp.customer.delete.question')">Are you sure you want to delete this Customer?</p>
            </div>
            <div slot="modal-footer">
                <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
                <button type="button" class="btn btn-primary" id="jhi-confirm-delete-customer" v-text="$t('entity.action.delete')" v-on:click="removeCustomer()">Delete</button>
            </div>
        </b-modal>
    </div>
</template>

<script lang="ts" src="./customer.component.ts">
</script>
