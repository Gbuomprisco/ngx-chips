import {
    describe,
    inject,
    it,
    expect,
    beforeEach
} from '@angular/core/testing';

import { Component } from '@angular/core';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {TagInput} from './tag-input.component';
import {Tag} from '../tag/tag.component';
import {TestComponentBuilder} from '@angular/compiler/testing';

import {
    Validators,
    Control
} from '@angular/common';

describe('TagInput', () => {
    let builder: TestComponentBuilder;

    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => builder = tcb));

    it('should have 2 tags set by ngModel',  (done: () => void) => {
        builder.createAsync(TestApp).then(fixture => {
            fixture.detectChanges();
            let tags = fixture.debugElement.queryAll(By.directive(Tag));
            expect(tags.length).toEqual(2);
            done();
        });
    });

    it('should override the default placeholder of the input',  (done: () => void) => {
        const template = `<tag-input [(ngModel)]="items" placeholder="New Tag"></tag-input>`;
        builder.overrideTemplate(TestApp, template).createAsync(TestApp).then(fixture => {
            fixture.detectChanges();
            let input = fixture.debugElement.query(By.css('input[type="text"]')).nativeElement;
            expect(input.getAttribute('placeholder')).toEqual('New Tag');
            done();
        });
    });

    describe('when a new item is added', function() {
        it('should be added to the list of items and update its parent\'s model', () => {
            const template = `<tag-input [(ngModel)]="items"></tag-input>`;
            builder.overrideTemplate(TestApp, template).createAsync(TestApp).then(fixture => {
                fixture.detectChanges();

                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;

                component.form.find('item').updateValue('New Item');
                expect(component.form.valid).toEqual(true);

                component.add();

                expect(component.form.valid).toEqual(false);
                expect(component.form.controls.item.value).toEqual('');

                fixture.detectChanges();

                expect(fixture.componentInstance.items.length).toEqual(3);
                expect(component.value.length).toEqual(3);
            });
        });

        it('should not be allowed if max-items is set up', () => {
            const template = `<tag-input [(ngModel)]="items" [maxItems]="2"></tag-input>`;

            builder.overrideTemplate(TestApp, template).createAsync(TestApp).then(fixture => {
                fixture.detectChanges();

                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;

                component.form.find('item').updateValue('New Item');
                component.add();

                fixture.detectChanges();

                expect(fixture.componentInstance.items.length).toEqual(2);
                expect(component.value.length).toEqual(2);
            });
        });

        it('emits the event onAdd', (done) => {
            builder.createAsync(TestApp).then(fixture => {
                fixture.detectChanges();

                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;
                const itemName = 'New Item';

                component.form.find('item').updateValue(itemName);

                component.onAdd.subscribe(item => {
                    expect(item).toEqual(itemName);
                    done();
                });

                component.add();
            });
        });

        it('does not allow dupes', () => {
            builder.createAsync(TestApp).then(fixture => {
                fixture.detectChanges();
                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;
                component.form.find('item').updateValue('Javascript');
                component.add();
                expect(component.value.length).toEqual(2);
            });
        });
    });

    describe('when an item is removed', () => {
        it('is removed from the list', () => {
            builder.createAsync(TestApp).then(fixture => {
                fixture.detectChanges();
                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;
                const tagName = 'Typescript';
                const tag = component.tags.toArray().filter(item => item.item === tagName)[0];
                component.remove(tag);

                fixture.detectChanges();

                expect(component.value).toEqual(['Javascript']);
                expect(component.input.isFocused).toEqual(true);
            });
        });

        it('emits the event onRemove', done => {
            builder.createAsync(TestApp).then(fixture => {
                fixture.detectChanges();
                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;
                const tagName = 'Typescript';
                const tag = component.tags.toArray().filter(item => item.item === tagName)[0];

                component.onRemove.subscribe(item => {
                    expect(item).toEqual(tagName);
                    done();
                });

                component.remove(tag);
            });
        });

        it('is sets current selected item as undefined', () => {
            builder.createAsync(TestApp).then(fixture => {
                fixture.detectChanges();
                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;
                const tagName = 'Typescript';
                const tag = component.tags.toArray().filter(item => item.item === tagName)[0];

                fixture.detectChanges();

                component.remove(tag);
                expect(component.selectedTag).toBe(undefined);
            });
        });
    });

    describe('testing validators', () => {
        it('injects minLength validator and validates correctly', function() {
            const template = `<tag-input 
                                    [validators]="[validators.minLength]" 
                                    [(ngModel)]="items"></tag-input>`;

            builder.overrideTemplate(TestApp, template).createAsync(TestApp).then(fixture => {
                fixture.detectChanges();

                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;

                component.form.find('item').updateValue('Ab');
                expect(component.form.valid).toBe(false);

                component.add();
                expect(component.value.length).toEqual(2);


                // add element with > 3 chars
                component.form.find('item').updateValue('Abcde');
                expect(component.form.valid).toBe(true);
                component.add();

                expect(component.value.length).toEqual(3);
            });
        });

        it('injects minLength validator and custom validator and validates correctly', function() {
            const template = `<tag-input 
                                    [validators]="[validators.minLength, validators.startsWith]" 
                                    [(ngModel)]="items"></tag-input>`;

            builder.overrideTemplate(TestApp, template).createAsync(TestApp).then(fixture => {
                fixture.detectChanges();

                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;

                component.form.find('item').updateValue('Javacript');
                expect(component.form.valid).toBe(false);
                component.add();
                expect(component.value.length).toEqual(2);


                component.form.find('item').updateValue('@J');
                expect(component.form.valid).toBe(false);
                component.add();
                expect(component.value.length).toEqual(2);


                // add element with > 3 chars AND @
                component.form.find('item').updateValue('@Javacript');
                expect(component.form.valid).toBe(true);
                component.add();

                expect(component.value.length).toEqual(3);
            });
        });

        it('validates transformed values', function() {
            const template = `<tag-input 
                                    [transform]="addPrefix"
                                    [validators]="[validators.minLength]" 
                                    [(ngModel)]="items">
                             </tag-input>`;

            builder.overrideTemplate(TestApp, template).createAsync(TestApp).then(fixture => {
                fixture.detectChanges();

                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;

                component.form.find('item').updateValue('@');
                component.add();

                expect(component.value[2]).toEqual('prefix: @');
                expect(component.value.length).toEqual(3);
            });
        });
    });
});

@Component({
    selector: 'test-app',
    template: `<tag-input 
                [(ngModel)]="items" 
                (onRemove)="onRemove($event)" 
                (onAdd)="onAdd($event)"></tag-input>`,
    directives: [TagInput]
})
class TestApp {
    public items = ['Javascript', 'Typescript'];
    public placeholder = '';

    onAdd(item) {

    }

    onRemove(item) {

    }

    validators = {
        minLength: Validators.minLength(3),
        startsWith: (control: Control) => {
            if (control.value.charAt(0) !== '@') {
                return {
                    'startsWithAt@': true
                };
            }
            return null;
        }
    };

    addPrefix(item: string) {
        return `prefix: ${item}`;
    }

    ngOnInit() {

    }
}
