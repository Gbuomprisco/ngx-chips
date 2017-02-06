import { Component } from '@angular/core';

import {
    Validators,
    FormControl
} from '@angular/forms';

import { NgModule } from '@angular/core';
import { TagInputModule } from '../../ng2-tag-input.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
                  [validators]="validators"
                  (onRemove)="onRemove($event)"
                  (onAdd)="onAdd($event)">
              </tag-input>`
})
export class TagInputComponentWithValidation {
    public items = getItems();
    validators: any = validators;
    onAdd() {}
    onRemove() {}
}

@Component({
    selector: 'test-app',
    template: `<tag-input [(ngModel)]="items"
                          [validators]="validators"
                          [transform]="addPrefix">
                         </tag-input>`
})
export class TagInputComponentWithTransformer {
    public items = getItems();

    addPrefix(item: string) {
        return `prefix: ${item}`;
    }
    validators: any = validators.splice(0, 1);
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
                    <template let-item="item">
                        <span class="custom-class">
                            item: {{ item }}
                        </span>
    
                        <span (click)="input.removeItem(item)" class="ng2-tag__remove-button">
                            x
                        </span>
                    </template>
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
    TagInputComponentWithModelAsStrings
];

@NgModule({
    imports: [CommonModule, FormsModule, TagInputModule],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS]
})
export class TestModule {}
