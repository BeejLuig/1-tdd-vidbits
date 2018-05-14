const {assert} = require('chai');
const {generateRandomUrl, submitCreateVideoForm} = require('../utilities');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('User visits create video page', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);
  it('and can save a new video with a title, url, and description', () => {
    const title = 'My Cool Video';
    const description = 'Check out my awesome video!';
    const url = generateRandomUrl('youtube.com');

    submitCreateVideoForm({ title, description, url });

    assert.include(browser.getText('.video-title'), title);
    assert.include(browser.getText('.video-card'), description);
    assert.exists(browser.getHTML(`.video-player[src="${url}"]`));
  });
});