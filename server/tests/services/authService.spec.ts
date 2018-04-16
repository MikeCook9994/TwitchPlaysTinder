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
    let pageStub: sinon.SinonStub;
    let browserStub: sinon.SinonStub;

    beforeAll(() => {
        let page: puppeteer.Page = SetupPageStub();
        let browser: puppeteer.Browser = SetupBrowserStub(page);
        launchStub = sinon.stub(puppeteer, 'launch').resolves(browser);
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

    function SetupPageStub(): puppeteer.Page {
        let page: puppeteer.Page = <puppeteer.Page>{};
        page.goto = sinon.stub().resolves(page);
        page.type = sinon.stub().resolves(page);
        page.click = sinon.stub().resolves(page);
        page.waitForNavigation = sinon.stub().resolves(<puppeteer.Response>{});
        page.evaluate = sinon.stub().resolves({});
        page.on = sinon.stub().returns(page);
        page.waitForFunction = sinon.stub().resolves({});
        page.close = sinon.stub().resolves();
        return page;
    }

    function SetupBrowserStub(page: puppeteer.Page): puppeteer.Browser {
        let browser: puppeteer.Browser = <puppeteer.Browser>{};
        browser.newPage = sinon.stub().resolves(page);
        browser.close = sinon.stub();
        return browser;
    }
});