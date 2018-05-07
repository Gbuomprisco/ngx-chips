import { Observable } from 'rxjs';
import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';

import { SECONDARY_PLACEHOLDER, PLACEHOLDER } from './core/constants/index';
import { TagInputDropdown } from './components/dropdown/tag-input-dropdown.component';
import { TagModel } from './core/accessor';

export interface TagInputOptions {
    separatorKeys: string[];
    separatorKeyCodes: number[];
    maxItems: number;
    placeholder: string;
    secondaryPlaceholder: string;
    validators: ValidatorFn[];
    asyncValidators: AsyncValidatorFn[];
    onlyFromAutocomplete: boolean;
    errorMessages: { [key: string]: string; };
    theme: string;
    onTextChangeDebounce: number;
    inputId: string | null;
    inputClass: string;
    clearOnBlur: boolean;
    hideForm: boolean;
    addOnBlur: boolean;
    addOnPaste: boolean;
    pasteSplitPattern: string | RegExp;
    blinkIfDupe: boolean;
    removable: boolean;
    editable: boolean;
    allowDupes: boolean;
    modelAsStrings: boolean;
    trimTags: boolean;
    ripple: boolean;
    tabIndex: string;
    disable: boolean;
    dragZone: string;
    onRemoving?: (tag: TagModel) => Observable<TagModel>;
    onAdding?: (tag: TagModel) => Observable<TagModel>;
    displayBy: string;
    identifyBy: string;
    animationDuration: {
        enter: string,
        leave: string
    };
}

export interface TagInputDropdownOptions {
    displayBy: string;
    identifyBy: string;
    appendToBody: boolean;
    offset: string;
    focusFirstElement: boolean;
    showDropdownIfEmpty: boolean;
    minimumTextLength: number;
    limitItemsTo: number;
    keepOpen: boolean;
    zIndex: number;
    dynamicUpdate: boolean;
    matchingFn: (value: string, target: TagModel) => boolean;
}

export const defaults = {
    tagInput: <TagInputOptions>{
        separatorKeys: [],
        separatorKeyCodes: [],
        maxItems: Infinity,
        placeholder: PLACEHOLDER,
        secondaryPlaceholder: SECONDARY_PLACEHOLDER,
        validators: [],
        asyncValidators: [],
        onlyFromAutocomplete: false,
        errorMessages: {},
        theme: '',
        onTextChangeDebounce: 250,
        inputId: null,
        inputClass: '',
        clearOnBlur: false,
        hideForm: false,
        addOnBlur: false,
        addOnPaste: false,
        pasteSplitPattern: ',',
        blinkIfDupe: true,
        removable: true,
        editable: false,
        allowDupes: false,
        modelAsStrings: false,
        trimTags: true,
        ripple: true,
        tabIndex: '',
        disable: false,
        dragZone: '',
        onRemoving: undefined,
        onAdding: undefined,
        displayBy: 'display',
        identifyBy: 'value',
        animationDuration: {
            enter: '250ms',
            leave: '150ms'
        }
    },
    dropdown: <TagInputDropdownOptions>{
        displayBy: 'display',
        identifyBy: 'value',
        appendToBody: true,
        offset: '50 0',
        focusFirstElement: false,
        showDropdownIfEmpty: false,
        minimumTextLength: 1,
        limitItemsTo: Infinity,
        keepOpen: true,
        dynamicUpdate: true,
        zIndex: 1000,
        matchingFn
    }
};

/**
 * @name matchingFn
 * @param this
 * @param value
 * @param target
 */
function matchingFn(this: TagInputDropdown, value: string, target: TagModel): boolean {
    const targetValue = target[this.displayBy].toString();

    return targetValue && targetValue
        .toLowerCase()
        .indexOf(value.toLowerCase()) >= 0;
}
