
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from '../modules';
import { Home } from './home/home';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TagInputModule
    ],
    declarations: [Home],
    bootstrap: [Home],
    entryComponents: [Home]
})
export class AppModule { }
