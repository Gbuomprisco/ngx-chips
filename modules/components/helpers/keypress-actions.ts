import {
    ACTIONS_KEYS,
    KEY_PRESS_ACTIONS
} from './constants';
import { TagModel } from './accessor';

/**
 * @name getAction
 * @param action
 * @returns {any}
 */
export function getAction(action: number): (args?) => any {
    switch (KEY_PRESS_ACTIONS[action]) {
        case ACTIONS_KEYS.DELETE:
            return deleteSelectedTag;
        case ACTIONS_KEYS.SWITCH_PREV:
            return switchPrev;
        case ACTIONS_KEYS.SWITCH_NEXT:
            return switchNext;
        case ACTIONS_KEYS.TAB:
            return switchNext;
        default:
            return () => {};
    }
}

/**
 * @name deleteSelectedTag
 */
function deleteSelectedTag() {
    if (this.selectedTag) {
        this.removeItem(this.selectedTag);
    }
}

/**
 * @name switchPrev
 * @param item { TagModel }
 */
function switchPrev(item: TagModel) {
    if (this.tags.first.model !== item) {
        const tags = this.tags.toArray();
        const tagIndex = tags.findIndex(tag => tag.model === item);
        const tag = tags[tagIndex - 1];

        // select tags
        tag.select.call(tag);
    }
}

/**
 * @name switchNext
 * @param item { TagModel }
 */
function switchNext(item: TagModel) {
    if (this.tags.last.model === item) {
        this.focus(true);
        return;
    }

    const tags = this.tags.toArray();
    const tagIndex = tags.findIndex(tag => tag.model === item);
    const tag = tags[tagIndex + 1];

    // select tag
    tag.select.call(tag);
}
