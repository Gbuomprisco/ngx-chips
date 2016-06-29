import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {provide, enableProdMode, PLATFORM_DIRECTIVES} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_PROVIDERS} from '@angular/router';
import { disableDeprecatedForms, provideForms, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';

import {App} from './home/home';


// enableProdMode()

bootstrap(App, [
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  disableDeprecatedForms(),
  provideForms(),
  {
        provide: PLATFORM_DIRECTIVES,
        useValue: [REACTIVE_FORM_DIRECTIVES],
        multi: true
  },
  provide(LocationStrategy, {useClass: HashLocationStrategy})
])
.catch(err => console.error(err));
