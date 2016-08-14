import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule } from '@angular/forms';
import { App } from './home/home';

import { NgModule }       from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    imports:      [BrowserModule, FormsModule],
    bootstrap:    [App],
    declarations: [App]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
