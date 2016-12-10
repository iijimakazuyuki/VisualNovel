const assert = require('chai').assert;
const express = require('express');
const webdriver = require('selenium-webdriver');
const until = webdriver.until;

/**
 * Mocha test timeout.
 */
const TEST_TIMEOUT = 90000;

/**
 * The port listened by the local server for testing.
 */
const TEST_APP_PORT = 3000;

/**
 * The base URL used by the local server for testing.
 */
const BASE_URL = 'http://localhost:' + TEST_APP_PORT + '/test/view/';

/**
 * The name of the browser drivers for testing.
 */
const BROWSER_DRIVERS_NAME = [
    'ie',
    'MicrosoftEdge',
    'chrome',
    'firefox',
];

/**
 * @param browser {string} The browser name of the WebDriver.
 * @returns {Promise} The promised WebDriver building process.
 */
const promiseBuildWebDriver = browser => new Promise(
    (resolve, reject) => new webdriver.Builder()
        .forBrowser(browser)
        .build()
        .then(resolve, reject)
);

describe('ItSoundsNovel View', function () {
    this.timeout(TEST_TIMEOUT);
    let appServer;
    let browserDrivers = new Map();

    before(function () {
        let startAppServer = new Promise(resolve => {
            appServer = express()
                .use(express.static('.'))
                .listen(TEST_APP_PORT, resolve)
        });
        let buildBrowserDrivers = BROWSER_DRIVERS_NAME
            .map(browser => promiseBuildWebDriver(browser)
                .then(driver => browserDrivers.set(browser, driver)));
        return Promise.all(buildBrowserDrivers
            .concat([startAppServer])
        );
    });

    describe('Display a sequence of sentences', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'display_a_sequence_of_sentences.html';

        /**
         * The first sentence in the sequence.
         */
        const FIRST_SENTENCE = "I am a cat. I don't have my name yet.";

        /**
         * The second sentence in the sequence.
         */
        const SECOND_SENTENCE = "I don't know where I was born.";

        /**
         * The timeout for displaying the first or second sentence.
         * The last letter of the first sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  37 + 500 [ms] = 2350 [ms] < 5000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000;

        /**
         * @param browserDriverName {string} The browser name ofWebDriver.
         * @returns {Thenable} The WebDriver test sequence.
         */
        const TEST_SEQUENCE_OF = browserDriverName => {
            let driver = browserDrivers.get(browserDriverName);
            return driver.get(BASE_URL + PATH)
                .then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, FIRST_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, SECOND_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                );
        }

        it('should be performed in Firefox', function () {
            return TEST_SEQUENCE_OF('firefox');
        });
        it('should be performed in Chrome', function () {
            return TEST_SEQUENCE_OF('chrome');
        })
        it('should be performed in IE', function () {
            return TEST_SEQUENCE_OF('ie');
        })
        it('should be performed in Edge', function () {
            return TEST_SEQUENCE_OF('MicrosoftEdge');
        })
    });

    describe('Change the display speed', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'change_the_display_speed.html';

        /**
         * The first sentence in the sequence.
         */
        const FIRST_SENTENCE = "I am a cat. I don't have my name yet.";

        /**
         * The second sentence in the sequence.
         */
        const SECOND_SENTENCE = "I don't know where I was born.";

        /**
         * The second sentence in the sequence.
         */
        const THIRD_SENTENCE =
            "I only remember that I was meowing in dim and wet place.";

        /**
         * The second sentence in the sequence.
         */
        const FOURTH_SENTENCE =
            "I saw something called human beings for the first time there.";

        /**
         * The timeout for displaying the first or third sentence.
         * The last letter of the first sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  37 + 500 [ms] = 2350 [ms] < 5000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const DEFAULT_TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000

        /**
         * The timeout for displaying the second or fourth sentence.
         * The last letter of the fourth sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 10 [ms] *  61 + 100 [ms] = 710 [ms] < 1000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 1000;

        /**
         * @param browserDriverName {string} The browser name ofWebDriver.
         * @returns {Thenable} The WebDriver test sequence.
         */
        const TEST_SEQUENCE_OF = browserDriverName => {
            let driver = browserDrivers.get(browserDriverName);
            let startTime;
            return driver.get(BASE_URL + PATH)
                .then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element => {
                    // Measure the time how long first sentence is displayed.
                    startTime = new Date();
                    return driver.wait(
                        until.elementTextIs(element, FIRST_SENTENCE),
                        DEFAULT_TIMEOUT_FOR_DISPLAYING_SENTENCE
                    );
                }).then(() => {
                    let endTime = new Date();
                    // The first sentence will be displayed more slowly
                    // than the second or fourth sentence.
                    assert.isAbove(
                        endTime - startTime,
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    );
                    return driver.findElement({ id: 'nextButton' });
                }).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, SECOND_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element => {
                    // Measure the time how long third sentence is displayed.
                    startTime = new Date();
                    return driver.wait(
                        until.elementTextIs(element, THIRD_SENTENCE),
                        DEFAULT_TIMEOUT_FOR_DISPLAYING_SENTENCE
                    );
                }).then(() => {
                    let endTime = new Date();
                    // The third sentence will be displayed more slowly
                    // than the second or fourth sentence.
                    assert.isAbove(
                        endTime - startTime,
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                    return driver.findElement({ id: 'nextButton' });
                }).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, FOURTH_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                );
        }

        it('should be performed in Firefox', function () {
            return TEST_SEQUENCE_OF('firefox');
        });
        it('should be performed in Chrome', function () {
            return TEST_SEQUENCE_OF('chrome');
        })
        it('should be performed in IE', function () {
            return TEST_SEQUENCE_OF('ie');
        })
        it('should be performed in Edge', function () {
            return TEST_SEQUENCE_OF('MicrosoftEdge');
        })
    });

    describe('Play sounds', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'play_sounds.html';

        /**
         * The first sentence in the sequence.
         */
        const FIRST_SENTENCE = "I don't know where I was born.";

        /**
         * The second sentence in the sequence.
         */
        const SECOND_SENTENCE =
            "I only remember that I was meowing in dim and wet place.";

        /*
         * The third sentence in the sequence.
         */
        const THIRD_SENTENCE =
            "I saw something called human beings for the first time there.";

        /**
         * The timeout for displaying the first or second or third sentence.
         * The last letter of the longest sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  61 + 500 [ms] = 3550 [ms] < 5000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000;

        /**
         * @param browserDriverName {string} The browser name ofWebDriver.
         * @returns {Thenable} The WebDriver test sequence.
         */
        const TEST_SEQUENCE_OF = browserDriverName => {
            let driver = browserDrivers.get(browserDriverName);
            return driver.get(BASE_URL + PATH)
                .then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, FIRST_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, SECOND_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, THIRD_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                );
        }

        it('should be performed in Firefox', function () {
            return TEST_SEQUENCE_OF('firefox');
        });
        it('should be performed in Chrome', function () {
            return TEST_SEQUENCE_OF('chrome');
        })
        it('should be performed in IE', function () {
            return TEST_SEQUENCE_OF('ie');
        })
        it('should be performed in Edge', function () {
            return TEST_SEQUENCE_OF('MicrosoftEdge');
        })
    });

    after(function () {
        let stopAppServer = new Promise(resolve => {
            appServer.close(resolve);
        });
        let closeBrowserDrivers = Array.from(browserDrivers.values())
            .map(driver => driver.quit());
        return Promise.all(closeBrowserDrivers
            .concat([stopAppServer])
        );
    });
});