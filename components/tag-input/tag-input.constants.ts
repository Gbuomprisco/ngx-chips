/*
** constants and default values for <tag-input>
 */

export const PLACEHOLDER = '+ Tag';
export const SECONDARY_PLACEHOLDER = 'Enter a new tag';
export const ACTIONS = {
    DELETE: 'DELETE',
    SWITCH_PREV: 'SWITCH_PREV',
    SWITCH_NEXT: 'SWITCH_NEXT',
    TAB: 'TAB'
};

export const KEY_PRESS_ACTIONS = {
    8: ACTIONS.DELETE,
    37: ACTIONS.SWITCH_PREV,
    39: ACTIONS.SWITCH_NEXT,
    9: ACTIONS.TAB
};
