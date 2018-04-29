export default class TinderAuthException extends Error {
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);
    }
}