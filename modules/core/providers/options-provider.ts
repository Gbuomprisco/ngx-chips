import { defaults, TagInputOptions, TagInputDropdownOptions } from '../../defaults';

export type Options = {
    tagInput?: {
        [P in keyof TagInputOptions]?: TagInputOptions[P];
    };
    dropdown?: {
        [P in keyof TagInputDropdownOptions]?: TagInputDropdownOptions[P];
    }
}

export class OptionsProvider {
    public static defaults = defaults;

    public setOptions(options: Options): void {
        OptionsProvider.defaults.tagInput = {...defaults.tagInput, ...options.tagInput};
        OptionsProvider.defaults.dropdown = {...defaults.dropdown, ...options.dropdown};
    }
}

export { TagInputDropdownOptions, TagInputOptions };