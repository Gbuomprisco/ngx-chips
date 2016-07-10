import {
    addProviders,
    fakeAsync,
    TestComponentBuilder,
    ComponentFixture,
    inject,
    tick,
    async
} from '@angular/core/testing';

import {
  Component,
  PLATFORM_DIRECTIVES
} from '@angular/core';

import { By } from '@angular/platform-browser';
import { TagInput } from './tag-input';

import {
    Validators,
    FormControl,
    disableDeprecatedForms,
    provideForms,
    REACTIVE_FORM_DIRECTIVES
} from '@angular/forms';

describe('TagInput', () => {
    let builder: TestComponentBuilder;

    beforeEach(() => {
      addProviders([
        disableDeprecatedForms(),
        provideForms(),
        {
            provide: PLATFORM_DIRECTIVES,
            useValue: [REACTIVE_FORM_DIRECTIVES],
            multi: true
        }]
      );
    });

    beforeEach(inject([TestComponentBuilder],
      (tcb: TestComponentBuilder) => builder = tcb));

    describe('Basic behaviours', () => {
      it('should have 2 tags set by ngModel',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
          const fixture = tcb.createSync(TestApp);
          fixture.detectChanges();

          const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;

          console.log(component);
          expect(component.items.length).toEqual(2);
        }));
      });

      it('should override the default placeholder of the input',  () => {
          const template = `<tag-input [(ngModel)]="items" placeholder="New Tag"></tag-input>`;
          const fixture = builder.overrideTemplate(TestApp, template).createSync(TestApp);
          fixture.detectChanges();

          let input = fixture.debugElement.query(By.css('input[type="text"]')).nativeElement;
          expect(input.getAttribute('placeholder')).toEqual('New Tag');
      });
    });

    describe('when a new item is added', () => {
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
                expect(component.items.length).toEqual(3);
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
                expect(component.items.length).toEqual(2);
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
                expect(component.items.length).toEqual(2);
            });
        });
    });

    describe('when an item is removed', () => {
        it('is removed from the list', () => {
            builder.createAsync(TestApp).then(fixture => {
                fixture.detectChanges();
                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;
                const tagName = 'Typescript';
                component.remove(tagName);

                fixture.detectChanges();

                expect(component.items).toEqual(['Javascript']);
                expect(component.input.isFocused).toEqual(true);
            });
        });

        it('emits the event onRemove', done => {
            builder.createAsync(TestApp).then(fixture => {
                fixture.detectChanges();
                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;
                const tagName = 'Typescript';

                component.onRemove.subscribe(item => {
                    expect(item).toEqual(tagName);
                    done();
                });

                component.remove(tagName);
            });
        });

        it('is sets current selected item as undefined', () => {
            builder.createAsync(TestApp).then(fixture => {
                fixture.detectChanges();
                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;
                const tagName = 'Typescript';

                fixture.detectChanges();

                component.remove(tagName);
                expect(component.selectedTag).toBe(undefined);
            });
        });
    });

    describe('testing validators', () => {
        it('injects minLength validator and validates correctly', () => {
            const template = `<tag-input
                                    [validators]="[validators.minLength]"
                                    [(ngModel)]="items"></tag-input>`;

            builder.overrideTemplate(TestApp, template).createAsync(TestApp).then(fixture => {
                fixture.detectChanges();

                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;

                component.form.find('item').updateValue('Ab');
                expect(component.form.valid).toBe(false);

                component.add();
                expect(component.items.length).toEqual(2);


                // add element with > 3 chars
                component.form.find('item').updateValue('Abcde');
                expect(component.form.valid).toBe(true);
                component.add();

                expect(component.items.length).toEqual(3);
            });
        });

        it('injects minLength validator and custom validator and validates correctly', () => {
            const template = `<tag-input
                                    [validators]="[validators.minLength, validators.startsWith]"
                                    [(ngModel)]="items"></tag-input>`;

            builder.overrideTemplate(TestApp, template).createAsync(TestApp).then(fixture => {
                fixture.detectChanges();

                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;

                component.form.find('item').updateValue('Javacript');
                expect(component.form.valid).toBe(false);
                component.add();
                expect(component.items.length).toEqual(2);


                component.form.find('item').updateValue('@J');
                expect(component.form.valid).toBe(false);
                component.add();
                expect(component.items.length).toEqual(2);


                // add element with > 3 chars AND @
                component.form.find('item').updateValue('@Javacript');
                expect(component.form.valid).toBe(true);
                component.add();

                expect(component.items.length).toEqual(3);
            });
        });

        it('validates transformed values', () => {
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

                expect(component.items[2]).toEqual('prefix: @');
                expect(component.items.length).toEqual(3);
            });
        });
    });

    describe('when user navigates tags with keypress event', () => {
        let keyUp: Event = new Event('keyup');
        let keyDown: Event = new Event('keydown');

        keyUp['keyCode'] = 8;
        keyDown['keyCode'] = 9;

        it('it handles navigation/deletion of tags', () => {
            builder.createAsync(TestApp).then((fixture: ComponentFixture<TestApp>) => {
                fixture.detectChanges();

                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;
                component.input.focus();

                // selected tag is undefined
                expect(component.selectedTag).toEqual(undefined);

                // press backspace
                component.input.element.dispatchEvent(keyUp);

                // selected tag is the last one
                expect(component.selectedTag).toEqual('Typescript');

                // press tab and focus input again
                keyUp['keyCode'] = 9;
                component.tagElements[1].dispatchEvent(keyDown);
                expect(component.selectedTag).toEqual(undefined);

                keyUp['keyCode'] = 8;
                // then starts from back again
                component.input.element.dispatchEvent(keyUp);
                expect(component.selectedTag).toEqual('Typescript');

                // it removes current selected tag when pressing backspace
                keyDown['keyCode'] = 8;
                component.tagElements[1].dispatchEvent(keyDown);
                expect(component.items.length).toEqual(1);
                expect(component.selectedTag).toBe(undefined);
            });
        });

        it('it navigates back and forth between tags', () => {
            builder.createAsync(TestApp).then((fixture: ComponentFixture<TestApp>) => {
                fixture.detectChanges();
                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;
                component.input.focus();

                keyUp['keyCode'] = 37;
                keyDown['keyCode'] = 37;

                // press left arrow
                component.input.element.dispatchEvent(keyUp);
                // selected tag is the last one
                expect(component.selectedTag).toEqual('Typescript');

                // press left arrow
                component.tagElements[1].dispatchEvent(keyDown);
                expect(component.selectedTag).toEqual('Javascript');

                // press right arrow
                keyDown['keyCode'] = 39;
                component.tagElements[0].dispatchEvent(keyDown);
                expect(component.selectedTag).toEqual('Typescript');

                // press tab -> focuses input
                component.tagElements[1].dispatchEvent(keyDown);
                expect(component.selectedTag).toEqual(undefined);
                expect(component.input.isFocused).toEqual(true);
            });
        });
    });

    describe('when using a custom template', () => {
        const template =
            `<tag-input [(ngModel)]="items">
                     <div class="custom_class" *ngFor="let item of value" (click)="select(item)">
                        <span class="tag__name">{{ item }}</span>
                        <span (click)="remove(item)"><img src="delete.png" /></span>
                     </div>
                </tag-input>`;

        it('replaced template with the custom one', () => {
            builder.overrideTemplate(TestApp, template).
                createAsync(TestApp).
                then((fixture: ComponentFixture<TestApp>) => {

                fixture.detectChanges();

                fakeAsync(() => {
                    tick();
                    fixture.detectChanges();

                    const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;

                    expect(component.hasTemplate).toEqual(true);
                    expect(component.items.length).toEqual(2);
                    expect(component.element.querySelector('.tags-container')).toEqual(undefined);
                    expect(component.element.querySelector('.custom__class').length).toEqual(2);
                });
            });
        });
    });
});

@Component({
    selector: 'test-app',
    template: `<tag-input
                  name='tags'
                  [ngModel]="['Typescript', 'Angular 2']"
                  (onRemove)="onRemove($event)"
                  (onAdd)="onAdd($event)">
              </tag-input>`,
    directives: [ TagInput ]
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
        startsWith: (control: FormControl) => {
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
