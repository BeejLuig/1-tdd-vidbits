const {assert} = require('chai');
const {generateRandomUrl, submitCreateVideoForm, submitUpdateVideoForm} = require('../utilities');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('User visits update video page', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);
  describe('updating video', () => {
    const title = 'Fun Video';
    const updatedTitle = 'Funny Video';
    const description = 'This video is fun';
    const url = generateRandomUrl('youtube.com');

    beforeEach(() => {
      submitCreateVideoForm({ title, description, url });
      browser.click('#edit');
      submitUpdateVideoForm({ title: updatedTitle, url, description });
    });

    it('changes values', () => {
      assert.equal(browser.getText('.video-title'), updatedTitle, 'Expected title to be updated');
    });
    it('does not create an additional video', () => {
      browser.url('/');
  
      assert.include(browser.getText('.video-title'), updatedTitle);
      assert.notInclude(browser.getText('.video-title'), title);
    });
  });
});