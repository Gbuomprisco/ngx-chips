# Tag Input Component for Angular [![Build Status](https://travis-ci.org/Gbuomprisco/ngx-chips.svg?branch=develop)](https://travis-ci.org/Gbuomprisco/ng2-tag-input) [![npm version](https://badge.fury.io/js/ngx-chips.svg)](https://badge.fury.io/js/ngx-chips)

This is a component for Angular >= 4. Design and API are blandly inspired by Angular Material's md-chips. Formerly called ng2-tag-input.

[![NPM](https://nodei.co/npm/ngx-chips.png?downloads=true&stars=true)](https://nodei.co/npm/ngx-chips/)

## [Demo](https://angular-mfppay.stackblitz.io/)

Check out [the live demo](https://angular-mfppay.stackblitz.io/).


## Getting Started

    npm install ngx-chips --save // OR
    yarn add ngx-chips

**Notice**: the latest version on NPM may not reflect the branch `master`. Open an issue and tag me if you need it to be published.

## Configuration

Ensure you import the module and the dependencies:

```javascript
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
   imports: [
       TagInputModule, 
       BrowserAnimationsModule,
       FormsModule,
       ReactiveFormsModule
       ...OtherModules 
   ] // along with your other modules
})
export class AppModule {}
```

## API for TagInputComponent

#### Inputs

##### ngModel OR use FormGroup/formControlName (required)
- **`ngModel`** - [**`string[] | TagModel[]`**] - Model of the component. Accepts an array of strings as input OR an array of objects.

If you do use an array of objects, make sure you:
- define two properties, `value` and `display`. `Value` will uniquely identify the items, `display` will be the value displayed.
- or, in alternative, provide the keys using the inputs `identifyBy` and `displayBy`

**Notice**: the items provided to the model won't change, but the items added to the model will have the format { display, value }. If you do provide `identifyBy` and `displayBy`, these will be used as format for the user-entered tags.

---

#### Properties (optional)
**`placeholder`** - [**`?string`**]

String that sets the placeholder of the input for entering new terms.


**`secondaryPlaceholder`** - [**`?string`**]

String that sets the placeholder of the input for entering new terms when there are 0 items entered.


**`maxItems`** -  [**`?number`**]

Sets the maximum number of items it is possible to enter.


~~**`readonly`**~~ - [**`?boolean`**] [REMOVED]

Please add a readonly attribute to each tag model as a truthy value instead.

Example:
```
// TagModel
{
    display: 'display',
    value: 124242,
    readonly: true
}
```


**`separatorKeyCodes`** - [**`?number[]`**]

Array of keyboard keys with which is possible to define the key for separating terms. By default, only Enter is the defined key.


**`separatorKeys`** - [**`?string[]`**]

Array of input characters with which is possible to define the key for separating terms. Default is empty. Can use with `separatorKeyCodes`, either one method matched will trigger tag separation.


~~**`transform`**~~ - [**`?(item: string) => string`**] [REMOVED]

Please use `onAdding` instead. Just pass the value, transformed, to the Observable.


**`inputId`** - [**`?string`**]

Custom ID assigned to the input


**`inputClass`** - [**`?string`**]

Custom class assigned to the input


**`clearOnBlur`** - [**`?boolean`**]

If set to true, it will clear the form's text on blur events


**`hideForm`** - [**`?number`**]

If set to true, will remove the form from the component


**`onTextChangeDebounce`** - [**`?number`**]

Number of ms for debouncing the `onTextChange` event (defaults to `250`)


**`addOnBlur`** - [**`?boolean`**]

If set to `true`, will add an item when the form is blurred (defaults to `false`)


**`addOnPaste`** - [**`?boolean`**]

If set to `true`, will add items pasted into the form's input  (defaults to `false`)


**`pasteSplitPattern`** - [**`?string | RegExp`**]

Pattern used with the native method split() to separate patterns in the string pasted (defaults to `,`)


**`blinkIfDupe`** - [**`?boolean`**]

If a duplicate item gets added, this will blink - giving the user a visual cue of where it is located (defaults to `true`)


**`removable`** - [**`?boolean`**]

If set to `false`, it will not be possible to remove tags (defaults to `true`)


**`editable`** (experimental) - [**`?boolean`**]

If set to `true`, it will be possible to edit the display value of the tags (defaults to `false`)


**`allowDupes`** - [**`?boolean`**]

If set to `true`, it will be possible to add tags with the same value (defaults to `false`)


**`modelAsStrings`** - [**`?boolean`**]

If set to `true`, all values added will be strings, and not objects (defaults to `false`)


**`trimTags`** - [**`?boolean`**]

If set to `false`, the tags could contain leading and trailing spaces (defaults to `true`)


**`inputText`** - [**`?string`**]

Property to bind text directly to the form's value.
You can use it to change the text of the input at any time, or to just bind a value. Remember: use two-way data binding with this property.


**`ripple`** - [**`?boolean`**]

Specifies whether the ripple effect should be visible or not (defaults to `true`)


**`disable`** - [**`?boolean`**]

If set to `true`, the input will be disabled. Similar to `readonly` but with a visual effect.

*Notice**: this attribute was changed from 'disabled' to 'disable' in order to comply with Angular's compiler.


**`tabindex`** - [**`?string`**]

If set, passes the specified tabindex to the form's input.


**`dragZone`** - [**`?string`**]

If set, the input will be draggable. Also the input will be draggable to another form with the same dragZone value.


**`animationDuration`** - [**`?{enter: string, leave: string}`**]

This option overwrites the default timing values for the animation. If you don't like the animation at all, just set both values to '0ms'.

The default value is `{enter: '250ms', leave: '150ms'}`

---

##### Validation (optional)
**`validators`** - [**`?ValidatorFn[]`**]

An array of Validators (custom or Angular's) that will validate the tag before adding it to the list of items. It is possible to use multiple validators.


**`asyncValidators`** - [**`?AsyncValidatorFn[]`**]

An array of AsyncValidators that will validate the tag before adding it to the list of items. It is possible to use multiple async validators.


**`errorMessages`** - [**`?Object{error: message}`**]

An object whose key is the name of the error (ex. required) and the value is the message you want to display to your users


**`onAdding`** - [**`?onAdding(tag: tagModel): Observable<TagModel>`**]

Hook to intercept when an item is being added. Needs to return an Observable.
* You can modify the tag being added during the interception.

Example:
```javascript
 public onAdding(tag: TagModel): Observable<TagModel> {
    const confirm = window.confirm('Do you really want to add this tag?');
    return Observable
        .of(tag)
        .filter(() => confirm);
}
```


**`onRemoving`** - [**`?onRemoving(tag: tagModel): Observable<TagModel>`**]

Hook to intercept when an item is being removed. Needs to return an Observable.
Example:

```javascript
public onRemoving(tag: TagModel): Observable<TagModel> {
        const confirm = window.confirm('Do you really want to remove this tag?');
        return Observable
            .of(tag)
            .filter(() => confirm);
    }
```

---

##### Autocomplete (optional)
**`onlyFromAutocomplete`** - [**`?boolean`**]

If set to `true`, it will be possible to add new items only from the autocomplete dropdown


##### Tags as Objects (optional)
**`identifyBy`** - [**`?any`**]

Any value you want your tag object to be defined by (defaults to `value`)


**`displayBy`** - [**`?string`**]

The string displayed in a tag object (defaults to `display`)


---

#### Outputs (optional)
**`onAdd`** - [**`?onAdd($event: string)`**]

Event fired when an item has been added


**`onRemove`** - [**`?onRemove($event: string)`**]

Event fired when an item has been removed


**`onSelect`** - [**`?onSelect($event: string)`**]

Event fired when an item has been selected


**`onFocus`** - [**`?onFocus($event: string)`**]

Event fired when the input is focused - will return current input value


**`onBlur`** - [**`?onBlur($event: string)`**]

Event fired when the input is blurred - will return current input value


**`onTextChange`** - [**`?onTextChange($event: string)`**]

Event fired when the input value changes


**`onPaste`** - [**`?onPaste($event: string)`**]

Event fired when the text is pasted into the input (only if `addOnPaste` is set to `true`)


**`onValidationError`** - [**`?onValidationError($event: string)`**]

Event fired when the validation fails


**`onTagEdited`** - [**`?onTagEdited($event: TagModel)`**]

Event fired when a tag is edited


## API for TagInputDropdownComponent
TagInputDropdownComponent is a proxy between `ngx-chips` and `ng2-material-dropdown`.

**`autocompleteObservable`** - [**`(text: string) => Observable<Response>`**]

A function that takes a string (current input value) and returns an Observable (ex. `http.get()`) with an array of items wit the same structure as `autocompleteItems` (see below). Make sure you retain the scope of your class or function when using this property.
It can be used to popuplate the autocomplete with items coming from an async request.


**`showDropdownIfEmpty`** - [**`?boolean`**]

If set to `true`, the dropdown of the autocomplete will be shown as soon as the user focuses on the form


**`keepOpen`** - [**`?boolean`**]

To use in conjunction with `showDropdownIfEmpty`. If set to `false`, the dropdown will not reopen automatically after adding a new tag. (defaults to `true`).


**`autocompleteItems`** - [**`?string[] | AutoCompleteModel[]`**]

An array of items to populate the autocomplete dropdown


**`offset`** - [**`?string`**]

Offset to adjust the position of the dropdown with absolute values (defaults to `'50 0'`)


**`focusFirstElement`** - [**`?boolean`**]

If set to `true`, the first item of the dropdown will be automatically focused (defaults to `false`)


**`minimumTextLength`** - [**`?number`**]

Minimum text length in order to display the autocomplete dropdown (defaults to `1`)


**`limitItemsTo`** - [**`?number`**]

Number of items to display in the autocomplete dropdown


**`identifyBy`** - [**`?string`**]

Just like for `tag-input`, this property defines the property of the value displayed of the object passed to the autocomplete


**`displayBy`** - [**`?string`**]

Just like for `tag-input`, this property defines the property of the unique value of the object passed to the autocomplete


**`matchingFn`** - [**`?matchingFn(value: string, target: TagModel): boolean`**]

Use this property if you are not happy with the default matching and want to provide your own implementation. The first value is the value
of the input text, the second value corresponds to the value of each autocomplete item passed to the component


**`appendToBody`** - [**`?boolean`**]

If set to `false`, the dropdown will not be appended to the body, but will remain in its parent element. Useful when using the components inside popups or dropdowns. Defaults to `true`.

**`dynamicUpdate`** - [**`?boolean`**]

If set to `false`, the dropdown will not try to set the position according to its position in the page, but will be fixed. Defaults to `true`.

**`zIndex`** - [**`?number`**]

Manually set the zIndex of the dropdown. Defaults to `100`.

---


The property `autocompleteItems` can be an array of strings or objects. Interface for `AutoCompleteModel` (just like `TagModel)` is:

```javascript
interface AutoCompleteModel {
   value: any;
   display: string;
}
```

The input text will be matched against both the properties.

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


#### Editable tags
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
        <ng-template let-item="item" let-index="index">
            {{ index }}: {{ item.display }}
        </ng-template>
    </tag-input-dropdown>
</tag-input>
```


##### Populate items using an Observable
```javascript
public requestAutocompleteItems = (text: string): Observable<Response> => {
    const url = `https://my.api.com/search?q=${text}`;
    return this.http
        .get(url)
        .map(data => data.json());
};
```

```html
<tag-input [ngModel]="['@item']">
    <tag-input-dropdown [autocompleteObservable]='requestAutocompleteItems'></tag-input-dropdown>
</tag-input>
```


#### Additional keys to separate tags
If you want to use more keys to separate items, add them to separatorKeys as an array of keyboard key codes.

```html
<tag-input [(ngModel)]='items' [separatorKeyCodes]="[32]"></tag-input>
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
<tag-input [ngModel]="['@item']" [modelAsStrings]="true" #input>
    <ng-template let-item="item" let-index="index"> <!-- DEFINE HERE YOUR TEMPLATE -->
        <span>
            <!-- YOU MAY ACTUALLY DISPLAY WHATEVER YOU WANT IF YOU PASS AN OBJECT AS ITEM -->
            <!-- ex. item.myDisplayValue -->

            item: {{ item }}
        </span>
        <delete-icon (click)="input.removeItem(item, index)"></delete-icon>
    </ng-template>
</tag-input>
```

#### Add default values
If you use many instances of the component and want to set some values by default for all of them, import the module and use `withDefaults`:

```javascript
import { TagInputModule } from 'ngx-chips';

TagInputModule.withDefaults({
    tagInput: {
        placeholder: 'Add a new tag',
        // add here other default values for tag-input
    },
    dropdown: {
        displayBy: 'my-display-value',
        // add here other default values for tag-input-dropdown
    }
});
```

#### Built-in Themes
If you don't like how the default theme looks, or you just need it to fit in a different design, you can choose 4 new themes: `bootstrap3-info`, `bootstrap`, `dark` and `minimal`.

```html
<tag-input [(ngModel)]='items' theme='bootstrap3-info'></tag-input>
<tag-input [(ngModel)]='items' theme='bootstrap'></tag-input>
<tag-input [(ngModel)]='items' theme='minimal'></tag-input>
<tag-input [(ngModel)]='items' theme='dark'></tag-input>
```

If you do not like these themes, [define your own theme](https://github.com/gbuomprisco/ngx-chips/blob/master/docs/custom-themes.md).


## FAQ

### Does it work with Angular Universal?
Yes.


### Does it work with Angular's Ahead of time compilation (AOT)?
Yes.


### Does it work with Ionic 2?
Yes.


### What version does it support?
This component is supposed to work with the latest Angular versions.

If you have any issues, please do make sure you're not running a different version (or check this repo's package.json). Otherwise, please do open a new issue.


### Can I change the style?
Yes - check out [how to create custom themes](https://github.com/gbuomprisco/ngx-chips/blob/master/docs/custom-themes.md).


### Something's broken?
Please do open a new issue, but please check first that the same issue has not already been raised and that you are using the latest version :)

Please **do not** send private emails - Github Issues are supposed to help whoever might have your same issue, so it is the right place to help each other.

Issues not filled out with the provided templates are going to be closed. Please provide as much information as possible: do include a plunkr so that I can see what the problem is without having to replicate your environment on my laptop. The time I can spend on this is very limited.

No features requests will be considered, unless they are Pull Requests. I feel the component is already quite bloated, and I'd like on solving bugs and making this more reliable for everyone.

## Contributing/Pull Requests
Contributions are highly welcome! No, there is no guideline on how to do it. Just make sure to lint and unit test your changes. We'll figure out the rest with a couple of messages...


### Ok - cool stuff. But when will you fix the issue I created?
Do please read this great post by Micheal Bromley: http://www.michaelbromley.co.uk/blog/529/why-i-havent-fixed-your-issue-yet. No, I don't have babies, but am not 24/7 coding :)
