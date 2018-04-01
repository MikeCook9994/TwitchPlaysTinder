export interface TinderAuthInfo {

    /**
     * the user id of the Facebook account that the auth token belongs to
     *
     * @type {string}
     * @memberof TinderAuthInfo
     */
    id: string;

    /**
     * the auth token used for authenticating with Tinder's API
     *
     * @type {string}
     * @memberof TinderAuthInfo
     */
    token: string;
}
