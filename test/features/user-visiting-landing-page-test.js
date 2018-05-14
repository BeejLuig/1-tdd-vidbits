const {assert} = require('chai');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {generateRandomUrl, submitCreateVideoForm} = require('../utilities');

describe('User visits the landing page', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);
  describe('with no existing videos', () => {
    it('no videos are shown', () => {
      browser.url('/videos');

      assert.equal(browser.getText('#videos-container'), '');
    });

    it('can navigate to create video page', () => {
      browser.url('/videos/');

      browser.click('#create-video');

      assert.include(browser.getText('body'), 'Save a video');
    });
  });
  describe('with an existing video', () => {
    it('renders the existing video', () => {
      const title = 'Cool Video Title';
      const url = generateRandomUrl('localhost');

      submitCreateVideoForm({ title, url });
      browser.url('/');

      assert.include(browser.getText('#videos-container'), title);
    });
    it('renders an iframe with the video\'s URL', () => {
      const title = 'My Vid';
      const url = 'https://youtu.be/UoTl-DBTfWg';

      submitCreateVideoForm({ title, url });
      browser.url('/');

      assert.include(browser.getHTML('body'), url);
    });
    it('can navigate to a video', () => {
      const title = 'Random Vid';
      const description = 'Crazy random vid';
      const url = generateRandomUrl('youtube.com');

      submitCreateVideoForm({ title, description, url });
      browser.url('/');
      browser.click('a.video-title');

      assert.equal(browser.getText('.video-description'), description);
    });
  });
});