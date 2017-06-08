## 1.2.9

### Breaking Changes
- `readonly` is not part of the inputs, and is now a property that needs to be added to each tag in order to make it readonly

### Bug fixes
- removing tag should not trigger `onSelect`
- OnRemoving does not trigger by backspace and drag remove
- Added max-width for very long tags, and ellipsis at the end

## 1.2.3

### Features
- Added `onAdding` and `onRemoving` hooks

### Maintenance
- removed `Renderer`

## 1.1.5-beta.0

### Features
- Added `dropZone` attribute to drag and drop tags

### Demo
- Fixed missing animations module

## 0.7.0

### Breaking changes
- The autocomplete properties `autocompleteItems` and `showDropdownIfEmpty` are now part of the `tag-input-dropdown`
component instead.

### Refactoring
- Lots of code moved around and refactored

## 0.4.8

### Bug Fixes
- Custom theme's style is back

### Improvements
- Custom theme now uses <template> - lots of duplicate code removed as a result
