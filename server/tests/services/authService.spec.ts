import AuthService from '../../app/services/authService';
import { isFunction } from 'util';

import { expect, assert, should } from 'chai';

describe('Test', () => {
    it('tests', () => {
        assert.isTrue(isFunction(AuthService.GetAuthInfo), 'AuthService.GetAuthInfo is a not a function');
    });
});