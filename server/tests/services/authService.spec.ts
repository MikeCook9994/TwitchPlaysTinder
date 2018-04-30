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

const FACEBOOK_AUTHENTICATION_TOKEN_URL: string = 'https://www.facebook.com/v2.6/dialog/oauth?redirect_uri=fb464891386855067%3A%2F%2Fauthorize%2F&display=touch&state=%7B%22challenge%22%3A%22IUUkEUqIGud332lfu%252BMJhxL4Wlc%253D%22%2C%220_auth_logger_id%22%3A%2230F06532-A1B9-4B10-BB28-B29956C71AB1%22%2C%22com.facebook.sdk_client_state%22%3Atrue%2C%223_method%22%3A%22sfvc_auth%22%7D&scope=user_birthday%2Cuser_photos%2Cuser_education_history%2Cemail%2Cuser_relationship_details%2Cuser_friends%2Cuser_work_history%2Cuser_likes&response_type=token%2Csigned_request&default_audience=friends&return_scopes=true&auth_type=rerequest&client_id=464891386855067&ret=login&sdk=ios&logger_id=30F06532-A1B9-4B10-BB28-B29956C71AB1&ext=1470840777&hash=AeZqkIcf-NEW6vBd';

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
        expect(launchStub.called, 'browser must be launched').to.be.true;
        expect(launchStub.calledOnce, 'browser should be launched no more than one time').to.be.true;
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
        expect(expectedException).to.not.be.null;
        expect(expectedException).to.be.instanceof(TinderAuthException, 'exception not instance of TinderAuthException');
        expect(expectedException.message).to.equal('failed to navigate to authentication page');
    });

    it('opens exactly one page', async () => {
        // Arrange
        // None needed

        // Act
        await AuthService.GetAuthInfo(fbAuthInfo);

        // Assert
        expect((browserFake.newPage as sinon.SinonStub).called, 'new page must be opened').to.be.true;
        expect((browserFake.newPage as sinon.SinonStub).calledOnce, 'only one new page should be opened').to.be.true;
    });

    it('throws a TinderAuthException if opening the page fails', async () => {
        // Arrange
        let expectedException: Error;
        let expectedMessage: string = 'failed to navigate to authentication page';

        (browserFake.newPage as sinon.SinonStub).reset();
        (browserFake.newPage as sinon.SinonStub).rejects();

        // Act
        try {
            await AuthService.GetAuthInfo(fbAuthInfo)
        }
        catch(exception) {
            expectedException = exception;
        }

        // Assert
        expect(expectedException).to.not.be.null;
        expect(expectedException).to.be.instanceof(TinderAuthException, 'exception not instance of TinderAuthException');
        expect(expectedException.message).to.equal('failed to navigate to authentication page');  
    });

    it('navigates to the facebook authentication page', async () => {
        // Arrange
        // None needed

        // Act
        await AuthService.GetAuthInfo(fbAuthInfo);

        // Assert
        expect((pageFake.goto as sinon.SinonStub).called, 'facebook authentication page must be navigated to').to.be.true;
        expect((pageFake.goto as sinon.SinonStub).calledOnce, 'authentication page must be navigated to no more than once').to.be.true;
        expect((pageFake.goto as sinon.SinonStub).calledWith(FACEBOOK_AUTHENTICATION_TOKEN_URL), 'did not navigate to the expected url').to.be.true;
    });

    it('throws a TinderAuthException if navigating to the facebook authentication page fails', async () => {
        // Arrange
        let expectedException: Error = null;
        let expectedMessage: string = 'failed to navigate to authentication page';

        (pageFake.goto as sinon.SinonStub).reset();
        (pageFake.goto as sinon.SinonStub).rejects();

        // Act
        try {
            await AuthService.GetAuthInfo(fbAuthInfo)
        }
        catch(exception) {
            expectedException = exception;
        }

        // Assert
        expect(expectedException).to.not.be.null;
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