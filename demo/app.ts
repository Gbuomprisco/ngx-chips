import '../modules/tag-input.module.scss';
import { NgModule } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {BrowserModule} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { TagInputModule } from '../modules';
import { Home } from './home/home';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

TagInputModule.withDefaults({
    tagInput: {
        placeholder: 'Add new tag'
    }
});

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
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
