import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [AngularSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [AngularSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AngularSharedModule {
  static forRoot() {
    return {
      ngModule: AngularSharedModule
    };
  }
}
