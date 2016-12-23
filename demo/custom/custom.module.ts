import { NgModule } from '@angular/core';
import { CustomComponent } from './custom.component';
import { TagInputModule } from '../../modules/ng2-tag-input.module';

@NgModule({
    imports: [ TagInputModule ],
    declarations: [ CustomComponent ],
    exports: [ CustomComponent ]
})
export class CustomModule {

}
