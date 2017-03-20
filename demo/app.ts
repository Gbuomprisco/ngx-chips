import { NgModule } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {BrowserModule} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { TagInputModule } from '../modules/ng2-tag-input.module';
import { Home } from './home/home';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        TagInputModule
    ],
    declarations: [ Home ],
    bootstrap: [ Home ],
    entryComponents: [ Home ]
})
export class AppModule {}
platformBrowserDynamic().bootstrapModule(AppModule);
