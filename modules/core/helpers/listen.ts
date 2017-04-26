
/**
 * @name listen
 * @param listenerType
 * @param action
 * @param condition
 */
export function listen(listenerType: string, action: () => any, condition = true): void {
    // if the event provided does not exist, throw an error
    if (!this.listeners.hasOwnProperty(listenerType)) {
        throw new Error('The event entered may be wrong');
    }

    // if a condition is present and is false, exit early
    if (!condition) {
        return;
    }

    // fire listener
    this.listeners[listenerType].push(action);
}
