// Testing libraries
import { isFunction } from 'util';
import * as chai from 'chai';
import * as sinon from 'sinon';
const expect = chai.expect;

// Class under test dependencies
import * as puppeteer from 'puppeteer';
import axios from 'axios';

// Models
import FacebookAuthInfo from '../../app/models/facebookAuthInfo';

// Exceptions
import TinderAuthException from '../../app/exceptions/tinderAuthException';

// Class under test
import AuthService from '../../app/services/authService';

describe('AuthService.GetAuthInfo', () => {
    const fbAuthInfo = <FacebookAuthInfo> {
        email: 'test-email',
        password: 'test-password'
    }

    const fbGraphResponse = {
        data: { 
            id: 'test-id' 
        }
    }

    let axiosGetStub: sinon.SinonStub;    
    let launchStub: sinon.SinonStub;
    let pageFake: puppeteer.Page;
    let browserFake: puppeteer.Browser;

    beforeAll(() => {
        pageFake = SetupPageFake();
        browserFake = SetupBrowserFake(pageFake);
        launchStub = sinon.stub(puppeteer, 'launch').resolves(browserFake);
        axiosGetStub = sinon.stub(axios, 'get').resolves(fbGraphResponse);
    });

    beforeEach(() => {
        launchStub.resolves(browserFake);
        axiosGetStub.resolves(fbGraphResponse);
    });

    afterEach(() => {
        launchStub.reset();
        axiosGetStub.reset();
    });

    it('is a function', () => {
        expect(isFunction(AuthService.GetAuthInfo)).to.be.true;
    });

    it('opens the headless browser once', async () => {
        // Arrange
        // None needed

        // Act
        await AuthService.GetAuthInfo(fbAuthInfo);

        // Assert
        expect(launchStub.called, "browser must be launched").to.be.true;
        expect(launchStub.calledOnce, "browser should be launched no more than one time.").to.be.true;
    });

    it('throws a TinderAuthException if opening the browser fails', async () => {
        // Arrange
        let expectedException: TinderAuthException;
        let expectedMessage: string = 'failed to navigate to authentication page';

        launchStub.reset();
        launchStub.rejects();

        // Act
        try {
            await AuthService.GetAuthInfo(fbAuthInfo)
        }
        catch(exception) {
            expectedException = exception;
        }

        // Assert
        expect(expectedException.message).to.equal('failed to navigate to authentication page');
    });

    function SetupPageFake(): puppeteer.Page {
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

    function SetupBrowserFake(page: puppeteer.Page): puppeteer.Browser {
        let browser: puppeteer.Browser = <puppeteer.Browser>{};
        browser.newPage = sinon.stub().resolves(pageFake);
        browser.close = sinon.stub().resolves();
        return browser;
    }
});