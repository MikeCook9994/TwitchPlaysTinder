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
        launchStub = sinon.stub(puppeteer, 'launch').resolves(browserFake);        
        pageFake = CreatePageFake();
        browserFake = CreateBrowserFake(pageFake);

        axiosGetStub = sinon.stub(axios, 'get').resolves(fbGraphResponse);
    });

    beforeEach(() => {
        launchStub.resolves(browserFake);
        SetBrowserFakeDefaultBehavior(browserFake, pageFake);
        SetPageFakeDefaultBehavior(pageFake);

        axiosGetStub.resolves(fbGraphResponse);
    });

    afterEach(() => {
        launchStub.reset();
        ResetBrowserFake(browserFake);
        ResetPageFake(pageFake);

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
        let expectedException: Error;
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
        expect(expectedException).to.be.instanceof(TinderAuthException, 'exception not instance of TinderAuthException');
        expect(expectedException.message).to.equal('failed to navigate to authentication page');
    });

    function CreatePageFake(): puppeteer.Page {
        let page: puppeteer.Page = <puppeteer.Page>{};

        page.goto = sinon.stub();
        page.type = sinon.stub();
        page.click = sinon.stub();
        page.waitForNavigation = sinon.stub();
        page.evaluate = sinon.stub();
        page.on = sinon.stub();
        page.waitForFunction = sinon.stub();
        page.close = sinon.stub();

        SetPageFakeDefaultBehavior(page);
        return page;
    }

    function SetPageFakeDefaultBehavior(page: puppeteer.Page): void {
        (page.goto as sinon.SinonStub).resolves(page);
        (page.type as sinon.SinonStub).resolves(page);
        (page.click as sinon.SinonStub).resolves(page);
        (page.waitForNavigation as sinon.SinonStub).resolves(<puppeteer.Response>{});
        (page.evaluate as sinon.SinonStub).resolves({});
        (page.on as sinon.SinonStub).returns(page);
        (page.waitForFunction as sinon.SinonStub).resolves({});
        (page.close as sinon.SinonStub).resolves();
    }

    function ResetPageFake(page: puppeteer.Page): void {
        (page.goto as sinon.SinonStub).reset();
        (page.type as sinon.SinonStub).reset();
        (page.click as sinon.SinonStub).reset();
        (page.waitForNavigation as sinon.SinonStub).reset();
        (page.evaluate as sinon.SinonStub).reset();
        (page.on as sinon.SinonStub).reset();
        (page.waitForFunction as sinon.SinonStub).reset();
        (page.close as sinon.SinonStub).reset();
    }

    function CreateBrowserFake(page: puppeteer.Page): puppeteer.Browser {
        let browser: puppeteer.Browser = <puppeteer.Browser>{};
        browser.newPage = sinon.stub();
        browser.close = sinon.stub();

        SetBrowserFakeDefaultBehavior(browser, page);
        return browser;
    }

    function SetBrowserFakeDefaultBehavior(browser: puppeteer.Browser, page: puppeteer.Page): void {
        (browser.newPage as sinon.SinonStub).resolves(pageFake);
        (browser.close as sinon.SinonStub).resolves();
    }

    function ResetBrowserFake(browser: puppeteer.Browser): void {
        (browser.newPage as sinon.SinonStub).reset();
        (browser.close as sinon.SinonStub).reset();
    }
});