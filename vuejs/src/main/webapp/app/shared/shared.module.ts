import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VuejsSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [VuejsSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [VuejsSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VuejsSharedModule {
  static forRoot() {
    return {
      ngModule: VuejsSharedModule
    };
  }
}
