import {
    ACTIONS_KEYS,
    KEY_PRESS_ACTIONS
} from './constants';

export function getAction(KEY: number): () => any {
    const ACTION_TYPE = KEY_PRESS_ACTIONS[KEY];

    let action;

    switch (ACTION_TYPE) {
        case ACTIONS_KEYS.DELETE:
            action = deleteSelectedTag;
            break;
        case ACTIONS_KEYS.SWITCH_PREV:
            action = switchPrev;
            break;
        case ACTIONS_KEYS.SWITCH_NEXT:
            action = switchNext;
            break;
        case ACTIONS_KEYS.TAB:
            action = switchNext;
            break;
        default:
            return () => {};
    }

    return action;
}

/**
 * @name deleteSelectedTag
 */
function deleteSelectedTag(): void {
    if (this.selectedTag) {
        this.removeItem(this.selectedTag);
    }
}

/**
 * @name switchPrev
 * @param itemIndex { number }
 */
function switchPrev(itemIndex: number): void {
    if (itemIndex > 0) {
        const el = this.tagElements[itemIndex - 1];
        this.selectItem(this.items[itemIndex - 1]);
        this.renderer.invokeElementMethod(el, 'focus', []);
    } else {
        this.focus(true);
    }
}

/**
 * @name switchNext
 * @param itemIndex
 */
function switchNext(itemIndex: number) {
    if (itemIndex < this.items.length - 1) {
        const el = this.tagElements[itemIndex + 1];
        this.selectItem(this.items[itemIndex + 1]);
        this.renderer.invokeElementMethod(el, 'focus', []);
    } else {
        this.focus(true);
    }
}
