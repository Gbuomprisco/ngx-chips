# Tag Input Component for Angular [![Build Status](https://travis-ci.org/Gbuomprisco/ng2-tag-input.svg?branch=develop)](https://travis-ci.org/Gbuomprisco/ng2-tag-input)

This is a component for Angular >= 2. Design and API are blandly inspired by Angular Material's md-chips.

## Demo

Check out the live demo (with source code) here [http://www.webpackbin.com/VkEgHA8xM](http://www.webpackbin.com/VkEgHA8xM). 
**[OUTDATED] - the demo will soon be published on its dedicated gh-pages site**

## Install

    npm install ng2-tag-input --save
    
**Notice**: the latest version on NPM may not reflect the branch `master`. Send me an email or open an issue and tag me if you need it to be published.

## Configuration

Ensure you import the module:

```javascript
import { TagInputModule } from 'ng2-tag-input';

@NgModule({
   imports: [ TagInputModule ]
})
export class MyModule {}
```

### Configuration for SystemJS users

Many users have reported issues with SystemJS. I got it working with the following additions to the SystemJS configuration:

```javascript
// packages object
{
    'ng2-tag-input': {
        main: 'dist/ng2-tag-input.bundle.js',
        format: 'cjs',
    },
    'ng2-material-dropdown': {
        defaultExtension: 'js',
        main: 'dist/ng2-dropdown.bundle.js',
        format: 'cjs',
    },
    'ng2-tag-input/modules/components/tag-input.template.html': {
        defaultJSExtension: false
    }
    // rest of the configuration
};
```

## API for TagInputComponent

#### Inputs

##### Model (required)
- **`ngModel`** - [**`string[] | TagModel[]`**] - Model of the component. Accepts an array of strings as input OR an array of objects.

If you do use an array of objects, make sure you:
- define two properties, `value` and `display`. `Value` will uniquely identify the items, `display` will be the value displayed.
- or, in alternative, provide the keys using the inputs `identifyBy` and `displayBy`

**Notice**: the model will be transformed into an object { display, value }.

#### Properties (optional)
- **`placeholder`** - [**`?string`**] - String that sets the placeholder of the input for entering new terms.

- **`secondaryPlaceholder`** - [**`?string`**] - String that sets the placeholder of the input for entering new terms when there are 0 items entered.

- **`maxItems`** -  [**`?number`**] - Sets the maximum number of items it is possible to enter.

- **`readonly`** - [**`?boolean`**] - Sets the tag input static, not allowing deletion/addition of the items entered.

- **`separatorKeys`** - [**`?number[]`**] - Array of keyboard keys with which is possible to define the key for separating terms. By default, only Enter is the defined key.

- **`transform`** - [**`?(item: string) => string`**] - a function that takes as argument the value of an item, and returns a string with the new value when appended. If the method returns null/undefined/false, the item gets rejected.

- **`inputId`** - [**`?string`**] - custom ID assigned to the input

- **`inputClass`** - [**`?string`**] - custom class assigned to the input

- **`clearOnBlur`** - [**`?boolean`**] - if set to true, it will clear the form's text on blur events

- **`hideForm`** - [**`?number`**] - if set to true, will remove the form from the component

- **`onTextChangeDebounce`** - [**`?number`**] - number of ms for debouncing the `onTextChange` event (defaults to `250`)

- **`addOnBlur`** - [**`?boolean`**] - if set to true, will add an item when the form is blurred (defaults to `false`)

- **`addOnPaste`** - [**`?boolean`**] - if set to true, will add items pasted into the form's input  (defaults to `false`)

- **`pasteSplitPattern`** - [**`?string`**] - pattern used with the native method split() to separate patterns in the string pasted (defaults to `,`)

- **`blinkIfDupe`** - [**`?boolean`**] - if a duplicate item gets added, this will blink - giving the user a visual cue of where it is located (defaults to `true`)

- **`removable`** - [**`?boolean`**] - if set to `false`, it will not be possible to remove tags (defaults to `true`)

- **`editable`** (experimental) - [**`?boolean`**] - if set to `true`, it will be possible to edit the display value of the tags (defaults to `false`)


##### Validation (optional)
- **`validators`** - [**`?Validators[]`**] - an array of Validators (custom or Angular's) that will validate the tag before adding it to the list of items. It is possible to use multiple validators.

- **`errorMessages`** - [**`?Object{error: message}`**] - an object whose key is the name of the error (ex. required) and the value is the message you want to display to your users

##### Autocomplete (optional)
- **`onlyFromAutocomplete`** - [**`?boolean`**] - if true, it will be possible to add new items only from the autocomplete dropdown

##### Tags as Objects (optional)
- **`identifyBy`** - [**`?any`**] - any value you want your tag object to be defined by (defaults to `value`)

- **`displayBy`** - [**`?string`**] - the string displayed in a tag object (defaults to `display`)

#### Outputs (optional)
- **`onAdd`** - [**`?onAdd($event: string)`**] - event fired when an item has been added

- **`onRemove`** - [**`?onRemove($event: string)`**] - event fired when an item has been removed

- **`onSelect`** - [**`?onSelect($event: string)`**] - event fired when an item has been selected

- **`onFocus`** - [**`?onFocus($event: string)`**] - event fired when the input is focused - will return current input value

- **`onBlur`** - [**`?onBlur($event: string)`**] - event fired when the input is blurred - will return current input value

- **`onTextChange`** - [**`?onTextChange($event: string)`**] - event fired when the input value changes

- **`onPaste`** - [**`?onPaste($event: string)`**] - event fired when the text is pasted into the input (only if `addOnPaste` is set to `true`)

- **`onValidationError`** - [**`?onValidationError($event: string)`**] - event fired when the validation fails

- **`onTagEdited`** - [**`?onTagEdited($event: TagModel)`**] - event fired when a tag is edited


## API for TagInputDropdownComponent
TagInputDropdownComponent is a proxy between `ng2-tag-input` and `ng2-material-dropdown`.

- **`showDropdownIfEmpty`** - [**`?boolean`**] - if true, the dropdown of the autocomplete will be shown as soon as the user focuses on the form

- **`autocompleteItems`** - [**`?string[] | AutoCompleteModel[]`**] - an array of items to populate the autocomplete dropdown

- **`offset`** - [**`?string`**] - offset to adjust the position of the dropdown with absolute values (defaults to `'0 0'`)

- **`focusFirstElement`** - [**`?boolean`**] - if true, the first item of the dropdown will be automatically focused (defaults to `false`)

The property `autocompleteItems` can be an array of strings or objects. Interface for `AutoCompleteModel` (just like `TagModel)` is:

```javascript
interface AutoCompleteModel {
   value: any;
   display: string;
}
```

More options to customise the dropdown will follow.

### Basic Example

```javascript
@Component({
    selector: 'app',
    template: `<tag-input [(ngModel)]='items'></tag-input>`
});
export class App {
    items = ['Pizza', 'Pasta', 'Parmesan'];
}
```

```html
<tag-input [(ngModel)]='items'></tag-input>

```

### Advanced usage

#### Using an array of objects

```html
// itemsAsObjects = [{value: 0, display: 'Angular'}, {value: 1, display: 'React'}];
<tag-input [ngModel]="itemsAsObjects"></tag-input>
```

#### Using an array of with custom `identifyBy` and `displayBy`
```html
// itemsAsObjects = [{id: 0, name: 'Angular'}, {id: 1, name: 'React'}];
<tag-input [ngModel]="itemsAsObjects" [identifyBy]="'id'" [displayBy]="'name'"></tag-input>
```

#### Editable tags (experimental)
```html
<tag-input [(ngModel)]='items' [editable]='true' (onTagEdited)="onTagEdited($event)"></tag-input>
```

#### Static Tags (not removable)
```html
<tag-input [(ngModel)]='items' [removable]='false'></tag-input>
```

#### Max number of items
```html
<tag-input [(ngModel)]='items' [maxItems]='5'></tag-input>
```

If the value of the model will contain more tags than `maxItems`, `maxItems` will be replaced with the current size of the model.

#### Autocomplete 
```html
<tag-input [ngModel]="['@item']">
       <tag-input-dropdown [autocompleteItems]="[{display: 'Item1', value: 0}, 'item2', 'item3']">
       </tag-input-dropdown>
</tag-input>
```

This will accept items only from the autocomplete dropdown:

```html 
<tag-input [ngModel]="['@item']"
           [onlyFromAutocomplete]="true">
    <tag-input-dropdown [showDropdownIfEmpty]="true"
                        [autocompleteItems]="['iTem1', 'item2', 'item3']">
    </tag-input-dropdown>
</tag-input>
```

##### Define a template for your menu items
```html
<tag-input [ngModel]="['@item']"
           [onlyFromAutocomplete]="true">
    <tag-input-dropdown [showDropdownIfEmpty]="true"
                        [autocompleteItems]="['iTem1', 'item2', 'item3']">
        <template let-item="item" let-index="index">
            {{ index }}: {{ item.display }}
        </template>
    </tag-input-dropdown>
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
}
```

Every item entered will be prefixed with `@`.

```html
<tag-input [ngModel]="['@item']" [transform]="transformer"></tag-input>
```

#### Events
Set up some methods that will run when its relative event is fired.

```html
<tag-input [(ngModel)]='items'
           (onBlur)="onInputBlurred($event)"
           (onFocus)="onInputFocused($event)"
           (onSelect)="onSelected($event)"
           (onRemove)="onItemRemoved($event)"
           (onTextChange)="onTextChange($event)"
           (onAdd)="onItemAdded($event)">
</tag-input>
```

#### Readonly
If readonly is passed to the tag-input, it won't be possible to select, add and remove items.

```html
<tag-input [ngModel]="['Javascript', 'Typescript']" [readonly]="true"></tag-input>
```

#### Custom items template
Define your own template, but remember to set up the needed events using the `input` reference.

```html
<tag-input [ngModel]="['@item']" #input>
    <template let-item="item"> <!-- DEFINE HERE YOUR TEMPLATE -->
        <span>
            <!-- YOU MAY ACTUALLY DISPLAY WHATEVER YOU WANT IF YOU PASS AN OBJECT AS ITEM -->
            item: {{ item.display }}
        </span>
        <span (click)="input.removeItem(item)" class="ng2-tag__remove-button">
            x
        </span>
    </template>
</tag-input>
```

#### Built-in Themes
If you don't like how the default theme looks, or you just need it to fit in a different design, you can choose 2 new themes: `dark` and `minimal`.

```html
<tag-input [(ngModel)]='items' theme='minimal'></tag-input>
<tag-input [(ngModel)]='items' theme='dark'></tag-input>
```

You still don't like them? It's fine, read the next section.

## Customization

Thanks to the newly introduced component inheritance, it is possible to finally customize the component with your own settings.
It is not super straightforward, but you can finally define your own templates and styles. Let's see how it's done.

The first thing to do, is to define a new component and extend `tag-input`:

```javascript
import { Component, forwardRef } from '@angular/core';
import { TagInputComponent } from 'ng2-tag-input';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

// all this boilerplate is needed
@Component({
    selector: 'custom-tag-input', // or whatever you want
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CustomComponent),
        multi: true
    }],
    
    // not needed, but you may want it
    styleUrls: [ './custom.scss' ],
    
    // you can add your own, but for now let's go with this
    templateUrl: '{{ node_modules }}/ng2-tag-input/dist/modules/components/tag-input.template.html' 
    // or
    // template: require('ng2-tag-input/dist/modules/components/tag-input.template.html'),
    
    animations: [
        trigger('flyInOut', [
            state('in', style({transform: 'translateX(0)'})),
            transition(':enter', [
                animate(200, keyframes([
                    style({opacity: 0, offset: 0}),
                    style({opacity: 0.5, offset: 0.3}),
                    style({opacity: 1, offset: 1.0})
                ]))
            ]),
            transition(':leave', [
                animate(150, keyframes([
                    style({opacity: 1, transform: 'translateX(0)', offset: 0}),
                    style({opacity: 1, transform: 'translateX(-15px)', offset: 0.7}),
                    style({opacity: 0, transform: 'translateX(100%)', offset: 1.0})
                ]))
            ])
        ])
    ]
})
export class CustomComponent extends TagInputComponent { }
```

And here is where we define our own styles:
```sass
// I'm overwriting the variables
$tag-color: #222;
$tag-border-radius: 100px;
$color-primary-default: #000;
// have a look at https://github.com/Gbuomprisco/ng2-tag-input/tree/master/modules/components/themes
// for having an idea on how to change the variables and how they're defined

@import "~ng2-tag-input/dist/modules/components/tag-input.style.scss";
```

We now need to register this newly created component. Here is how our app module looks like:

```javascript

// .. all other imports
import { TagInputModule } from 'ng2-tag-input';
import { CustomComponent } from './custom/custom.component'; // my newly defined component

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,

        TagInputModule, // we need this here
    ],
    declarations: [ Home, CustomComponent ], // we need this here
    bootstrap: [ Home ], // this is just an example
    entryComponents: [ Home ] // this is just an example
})
export class AppModule {}
platformBrowserDynamic().bootstrapModule(AppModule);

```

## Use tags without a form

It is possible to use `<tag>` components independently from the `tag-input` component.
In order to do so, pass to the component the input `model` (TagModel).

Notice: by default, these are unstyled. You are free to add the required styles yourself. For example, just add a class `tag`.
If you wish to copy the same style as the one used in the component, please have a look at source code.

```html
<div class="flex">
    <tag [model]="{display: 'Tag 1'}" class='tag'></tag>
    <tag [model]="{display: 'Tag 2'}" class='tag'></tag>
    <tag [model]="{display: 'Tag 3'}" [readonly]="true" class='tag'></tag>
</div>
```
