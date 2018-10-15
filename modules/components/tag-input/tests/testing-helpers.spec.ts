import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
    Validators,
    FormControl
} from '@angular/forms';

import { Observable } from 'rxjs';
import { of } from 'rxjs';

import { TagInputModule } from '../../../tag-input.module';

function getItems() {
    return ['Javascript', 'Typescript'];
}

const validators = [Validators.minLength(3), (control: FormControl) => {
    if (control.value.charAt(0) !== '@') {
        return {
            'startsWithAt@': true
        };
    }
    return null;
}];

@Component({
    selector: 'test-app',
    template: `<tag-input [(ngModel)]="items"></tag-input>`
})
export class BasicTagInputComponent {
    public items = getItems();
}

@Component({
    selector: 'test-app',
    template: `<tag-input
                  [(ngModel)]="items"
                  (onRemove)="onRemove($event)"
                  (onAdd)="onAdd($event)">
              </tag-input>`
})
export class TagInputComponentWithOutputs {
    public items = getItems();

    onAdd() {}
    onRemove() {}

    public validators: any = validators;
}

@Component({
    selector: 'test-app',
    template: `<tag-input [(ngModel)]="items"></tag-input>`
})
export class TagInputComponentTagsAsObjects {
    public items = [{value: 0, display: 'React'}, {value: 1, display: 'Angular'}];
}

@Component({
    selector: 'test-app',
    template: `<tag-input [(ngModel)]="items"></tag-input>`
})
export class TagInputComponentCustomTagsAsObjects {
    public items = [{id: 0, name: 'React'}, {id: 1, name: 'Angular'}];
}

@Component({
    selector: 'test-app',
    template: `<tag-input
                  [(ngModel)]="items"
                  [validators]="validators">
              </tag-input>`
})
export class TagInputComponentWithValidation {
    public items = getItems();
    validators: any = validators;
}

@Component({
    selector: 'test-app',
    template: `<tag-input [(ngModel)]="items"
                          [onAdding]="onAdding">
                         </tag-input>`
})
export class TagInputComponentWithTransformer {
    public items = getItems();

    onAdding(value: string): Observable<object> {
        const item = {display: `prefix: ${value}`, value: `prefix: ${value}`};
        return of(item);
    }
}

@Component({
    selector: 'test-app',
    template: `<tag-input [(ngModel)]="items" [placeholder]="'New Tag'"></tag-input>`
})
export class TagInputComponentWithPlaceholder {
    public items = getItems();
}

@Component({
    selector: 'test-app',
    template: `<tag-input [(ngModel)]="items" [maxItems]="2"></tag-input>`
})
export class TagInputComponentWithMaxItems {
    public items = getItems();
}

@Component({
    selector: 'test-app',
    template: `<tag-input [(ngModel)]="items">
                    <tag-input-dropdown [autocompleteItems]="['item1', 'item2', 'itam3']"></tag-input-dropdown>
               </tag-input>`
})
export class TagInputComponentWithAutocomplete {
    public items = getItems();
}

@Component({
    selector: 'test-app',
    template: `<tag-input [(ngModel)]="items">
                    <ng-template let-item="item">
                        <span class="custom-class">
                            item: {{ item }}
                        </span>

                        <span (click)="input.removeItem(item)" class="ng2-tag__remove-button">
                            x
                        </span>
                    </ng-template>
                </tag-input>`
})
export class TagInputComponentWithTemplate {
    public items = getItems();
}

@Component({
    selector: 'test-app',
    template: `<tag-input [(ngModel)]="items"
                           [onlyFromAutocomplete]="true">
                   <tag-input-dropdown [autocompleteItems]="['item1', 'item2', 'itam3']"></tag-input-dropdown>
               </tag-input>`
})
export class TagInputComponentWithOnlyAutocomplete {
    public items = getItems();
}

@Component({
    selector: 'test-app',
    template: `<tag-input [(ngModel)]="items" [modelAsStrings]="true"></tag-input>`
})
export class TagInputComponentWithModelAsStrings {
    public items = getItems();
}

@Component({
    selector: 'test-app',
    template: `<tag-input [(ngModel)]="items" [addOnBlur]="true">
                   <tag-input-dropdown [autocompleteItems]="['item1', 'item2', 'itam3']"></tag-input-dropdown>
               </tag-input>`
})
export class TagInputComponentWithAddOnBlur {
    public items = getItems();
}

@Component({
    selector: 'test-app',
    template: `<tag-input [(ngModel)]="items"
                          [onRemoving]="onRemoving"
                          [onAdding]="onAdding"></tag-input>`
})
export class TagInputComponentWithHooks {
    public items = getItems();

    public onAdding(tag): Observable<any> {
        return of({});
    }

    public onRemoving(tag): Observable<any> {
        return of({});
    }
}

@Component({
    selector: 'test-app',
    template: `<tag-input [(ngModel)]="items"
                          [editable]="true"></tag-input>`
})
export class TagInputComponentEditable {
    public items = getItems();
}

const COMPONENTS = [
    BasicTagInputComponent,
    TagInputComponentWithPlaceholder,
    TagInputComponentWithOutputs,
    TagInputComponentWithTransformer,
    TagInputComponentWithValidation,
    TagInputComponentWithMaxItems,
    TagInputComponentWithTemplate,
    TagInputComponentWithAutocomplete,
    TagInputComponentWithOnlyAutocomplete,
    TagInputComponentTagsAsObjects,
    TagInputComponentCustomTagsAsObjects,
    TagInputComponentWithModelAsStrings,
    TagInputComponentWithAddOnBlur,
    TagInputComponentWithHooks,
    TagInputComponentEditable
];

@NgModule({
    imports: [CommonModule, FormsModule, TagInputModule],
    declarations: COMPONENTS,
    exports: COMPONENTS
})
export class TestModule {}
