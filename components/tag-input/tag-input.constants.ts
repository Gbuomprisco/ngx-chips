/*
** constants and default values for <tag-input>
 */

export const PLACEHOLDER: string = '+ Tag';
export const SECONDARY_PLACEHOLDER: string = 'Enter a new tag';
export const ACTIONS = {
    DELETE: 'DELETE',
    SWITCH_PREV: 'SWITCH_PREV',
    SWITCH_NEXT: 'SWITCH_NEXT'
};
export const KEY_PRESS_ACTIONS = {
    8: ACTIONS.DELETE,
    37: ACTIONS.SWITCH_PREV,
    39: ACTIONS.SWITCH_NEXT
};