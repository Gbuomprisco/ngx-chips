import { NgModule } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {BrowserModule} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TagInputModule } from '../modules/ng2-tag-input.module';
import { Home } from './home/home';
import { CustomComponent } from './custom/custom.component';
import { CommonModule } from '@angular/common';
import { Ng2DropdownModule } from 'ng2-material-dropdown';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TagInputModule,
        Ng2DropdownModule
    ],
    declarations: [ Home, CustomComponent ],
    bootstrap: [ Home ],
    entryComponents: [ Home ]
})
export class AppModule {}
platformBrowserDynamic().bootstrapModule(AppModule);
