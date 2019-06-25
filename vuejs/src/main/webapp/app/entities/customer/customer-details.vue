<template>
    <div class="row justify-content-center">
        <div class="col-8">
            <div v-if="customer">
                <h2 class="jh-entity-heading"><span v-text="$t('vuejsApp.customer.detail.title')">Customer</span> {{customer.id}}</h2>
                <dl class="row jh-entity-details">
                    <dt>
                        <span v-text="$t('vuejsApp.customer.firstName')">First Name</span>
                    </dt>
                    <dd>
                        <span>{{customer.firstName}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('vuejsApp.customer.lastName')">Last Name</span>
                    </dt>
                    <dd>
                        <span>{{customer.lastName}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('vuejsApp.customer.gender')">Gender</span>
                    </dt>
                    <dd>
                        <span v-text="$t('vuejsApp.Gender.' + customer.gender)">{{customer.gender}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('vuejsApp.customer.email')">Email</span>
                    </dt>
                    <dd>
                        <span>{{customer.email}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('vuejsApp.customer.phone')">Phone</span>
                    </dt>
                    <dd>
                        <span>{{customer.phone}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('vuejsApp.customer.addressLine1')">Address Line 1</span>
                    </dt>
                    <dd>
                        <span>{{customer.addressLine1}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('vuejsApp.customer.addressLine2')">Address Line 2</span>
                    </dt>
                    <dd>
                        <span>{{customer.addressLine2}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('vuejsApp.customer.city')">City</span>
                    </dt>
                    <dd>
                        <span>{{customer.city}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('vuejsApp.customer.country')">Country</span>
                    </dt>
                    <dd>
                        <span>{{customer.country}}</span>
                    </dd>
                </dl>
                <button type="submit"
                        v-on:click.prevent="previousState()"
                        class="btn btn-info">
                    <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
                </button>
                <router-link v-if="customer.id" :to="{name: 'CustomerEdit', params: {customerId: customer.id}}" tag="button" class="btn btn-primary">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.edit')"> Edit</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./customer-details.component.ts">
</script>
