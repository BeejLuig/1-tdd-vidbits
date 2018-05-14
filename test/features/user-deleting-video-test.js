const {assert} = require('chai');
const {generateRandomUrl, submitCreateVideoForm} = require('../utilities');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('User deleting video', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  it('removes the Video from the list', () => {
    submitCreateVideoForm({ 
      title: 'Title',
      url: generateRandomUrl('youtube'),
    });

    
    browser.click('#delete');

    assert.isEmpty(browser.getText('#videos-container'), 'Expected video to be deleted');
  });

});