// Test 
import { isFunction } from 'util';
import * as chai from 'chai';
import * as sinon from 'sinon';

const expect = chai.expect;

// Class under test dependencies
import * as puppeteer from 'puppeteer';
import axios from 'axios';

// Models
import FacebookAuthInfo from '../../app/models/facebookAuthInfo';

// Class under test
import AuthService from '../../app/services/authService';



describe('AuthService.GetAuthInfo', () => {
    const fbAuthInfo = <FacebookAuthInfo> {
        email: 'test-email',
        password: 'test-password'
    }

    let launchStub: sinon.SinonStub;

    beforeAll(() => {
        launchStub = sinon.stub(puppeteer, 'launch').resolves( { newPage: () => {} } );
    });

    it('is a function', () => {
        // Arrange
        // None needed

        // Act
        // None needed

        // Assert
        expect(isFunction(AuthService.GetAuthInfo)).to.be.true;
    });

    it('opens the headless browser', () => {
        // Arrange
        // None needed

        // Act
        AuthService.GetAuthInfo(fbAuthInfo);

        // Assert
        expect(launchStub.called).to.be.true;
        expect(launchStub.callCount === 1).to.be.true;
    });
});