import { OptionsProvider } from './options-provider';

describe('Options Provider', () => {
    let provider: OptionsProvider;

    beforeEach(() => {
        provider = new OptionsProvider();
    });

    it('has default options', () => {
        expect(OptionsProvider.defaults).toBeDefined();
    });

    it('sets options', () => {
        const custom = 'Custom';

        provider.setOptions({
            tagInput: {
                placeholder: custom
            },
            dropdown: {
                showDropdownIfEmpty: true
            }
        });

        expect(OptionsProvider.defaults.tagInput.placeholder).toEqual(custom);
        expect(OptionsProvider.defaults.dropdown.showDropdownIfEmpty).toEqual(true);
    });
});