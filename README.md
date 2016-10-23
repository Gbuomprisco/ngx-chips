# Angular2 Tag Input [![Build Status](https://travis-ci.org/Gbuomprisco/ng2-tag-input.svg?branch=develop)](https://travis-ci.org/Gbuomprisco/ng2-tag-input)

This is a component for Angular 2. Design and API are blandly inspired by Angular Material's md-chips.

## Demo

Check out the live demo (with source code) here [http://www.webpackbin.com/VyLKAtssb](http://www.webpackbin.com/VyLKAtssb).

## Quick start. Install the component from NPM by running:

    npm install ng2-tag-input --save

## If you want to run the tests, run the command:

    npm test

## Set up the module
The component is updated to use the latest version of Angular 2. This means
it requires some configuration to correctly work with your app. Ensure, you are
registering the following providers when bootstrapping the app:

```javascript
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
```

Please do have a look at the file `demo/app.ts` if you are unsure how to configure the app.

## Configuration

Ensure you import the module:

```javascript
import { TagInputModule } from 'ng2-tag-input';

// please notice this is the new way of telling a Component
// to import another component...no more directives[]
@NgModule({
   imports: [TagInputModule]
})
export class MyModule {}
```

## API

#### Inputs
- **`ngModel`** - [**`string[]`**] - Model of the component. Accepts an array of strings as input.
- **`placeholder`** - [**`?string`**] - String that sets the placeholder of the input for entering new terms.
- **`secondaryPlaceholder`** - [**`?string`**] - String that sets the placeholder of the input for entering new terms when there are 0 items entered.
- **`maxItems`** -  [**`?number`**] - Sets the maximum number of items it is possible to enter.
- **`readonly`** - [**`?boolean`**] - Sets the tag input static, not allowing deletion/addition of the items entered.
- **`separatorKeys`** - [**`?number[]`**] - Array of keyboard keys with which is possible to define the key for separating terms. By default, only Enter is the defined key.
- **`transform`** - [**`?(item: string) => string`**] - a function that takes as argument the value of an item, and returns a string with the new value when appended. If the method returns null/undefined/false, the item gets rejected.
- **`validators`** - [**`?Validators[]`**] - an array of Validators (custom or Angular's) that will validate the tag before adding it to the list of items. It is possible to use multiple validators.
- **`errorMessages`** - [**`?Object{error: message}`**] - an object whose key is the name of the error (ex. required) and the value is the message you want to display to your users
- **`autocomplete`** - [**`?boolean`**] - if true, it adds an autocomplete component from which is possible to select items
- **`autocompleteItems`** - [**`?string[]`**] - an array of items to populate the autocomplete dropdown
- **`onlyFromAutocomplete`** - [**`?boolean`**] - if true, it will be possible to add new items only from the autocomplete dropdown
- **`onTextChangeDebounce`** - [**`?number`**] - number of ms for debouncing the `onTextChange` event

#### Outputs
- **`onAdd`** - [**`?onAdd(item: string)`**] - event fired when an item has been added
- **`onRemove`** - [**`?onRemove(item: string)`**] - event fired when an item has been removed
- **`onSelect`** - [**`?onSelect(item: string)`**] - event fired when an item has been selected
- **`onFocus`** - [**`?onFocus(item: string)`**] - event fired when the input is focused - will return current input value
- **`onBlur`** - [**`?onBlur(item: string)`**] - event fired when the input is blurred - will return current input value
- **`onTextChange`** - [**`?onTextChange(text: string)`**] - event fired when the input value changes



### Basic Example
#### Component

```javascript
@Component({
    selector: 'app',
    template: `<tag-input [(ngModel)]='items'></tag-input>`
});
export class App {
    items = ['Pizza', 'Pasta', 'Parmesan'];
    options = {
        placeholder: "+ term",
        secondaryPlaceholder: "Enter a new term",
        separatorKeys: [4, 5]
        maxItems: 10
    }
    onItemAdded(item) {
        console.log(``${item} has been added`)
    }
    onItemRemoved(item) {
        console.log(``${item} has been removed :(`)
    }
    // ...
}
```

#### Template

```html
<tag-input [(ngModel)]='items'
           [placeholder]="options.placeholder"
           [secondaryPlaceholder]="options.secondaryPlaceholder"
           [maxItems]="options.maxItems"
           [separatorKeys]="options.separatorKeys">
</tag-input>

```

### More examples

#### Max number of items
```html
<tag-input [(ngModel)]='items' [maxItems]='5'></tag-input>
```

#### Autocomplete 
```html
<tag-input [ngModel]="['@item']"
           [autocompleteItems]="['Item1', 'item2', 'item3']"
           [autocomplete]="true">
</tag-input>
```

This will accept items only from the autocomplete dropdown:

```html 
<tag-input [ngModel]="['@item']"
           [onlyFromAutocomplete]="true"
           [autocompleteItems]="['Item1', 'item2', 'item3']"
           [autocomplete]="true">
</tag-input>
```

#### Additional keys to separate tags
If you want to use more keys to separate items, add them to separatorKeys as an array of keyboard key codes.

```html
<tag-input [(ngModel)]='items' separatorKeys="[32]"></tag-input>
```

#### Validation

Create some validation methods in your component:

```javascript
class MyComponent {
    private startsWithAt(control: FormControl) {
            if (control.value.charAt(0) !== '@') {
                return {
                    'startsWithAt@': true
                };
            }
    
            return null;
        }
    
        private endsWith$(control: FormControl) {
            if (control.value.charAt(control.value.length - 1) !== '$') {
                return {
                    'endsWith$': true
                };
            }
    
            return null;
        }
    
        public validators = [this.startsWithAt, this.endsWith$];
    
        public errorMessages = {
            'startsWithAt@': 'Your items need to start with "@"',
            'endsWith$': 'Your items need to end with "$"'
        };
}
```

Pass them to the tag-input component:

```html
<tag-input [ngModel]="['@item']"
           [errorMessages]="errorMessages"
           [validators]="validators">
</tag-input>
```

#### Items Transformer

Set up a transformer, which is a function that takes the item's string as parameter, and should return
the transformed string.

```javascript
class MyComponent {
    public transformer(item: string): string {
        return `@${item}`;
    }
    // ...
}
```

Every item entered will be prefixed with `@`.

```html
<tag-input [ngModel]="['@item']"[transform]="transformer"></tag-input>
```

#### Events
Set up some methods that will fire when its relative event is outputted.

```html
<tag-input [(ngModel)]='items'
           (onBlur)="onInputBlurred($event)"
           (onFocus)="onInputFocused($event)"
           (onSelect)="onSelected($event)"
           (onRemove)="onItemRemoved($event)"
           (onAdd)="onItemAdded($event)">
</tag-input>
```

#### Readonly
If readonly is passed to the tag-input, it won't be possible to select, add and remove items.

```html
<tag-input [ngModel]="['Javascript', 'Typescript']" [readonly]="true"></tag-input>
```

#### Custom template
Define your own template, but remember to set up the needed events using the `input` reference.

```html
<tag-input [(ngModel)]='items' #input> // create a reference #input to the controller in order to use its API
    <div class='tag' *ngFor='let item of input.value'> // loop over the items
        <div class='tag__name'> {{ item }} </span> // display its values
        <span (click)="input.remove(item)">
            Remove me
        </span>
    </div>
</tag-input>
```

#### New Themes
If you don't like how the default theme looks, or you just need it to
fit in a different design, you can choose 2 new themes: `dark` and `minimal`.

```html
<tag-input [(ngModel)]='items' theme='minimal'></tag-input>
<tag-input [(ngModel)]='items' theme='dark'></tag-input>
```