import { Home, HomeModule } from './home/home';
import { TagInput } from '../modules/ng2-tag-input.module';
import { NgModule } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

@NgModule({
    imports:      [BrowserModule, HomeModule],
    bootstrap:    [Home],
    declarations: []
})
export class AppModule {}
platformBrowserDynamic().bootstrapModule(AppModule)
