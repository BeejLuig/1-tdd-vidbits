const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {parseTextFromHTML, generateRandomUrl} = require('../utilities');
const app = require('../../app');
const Video = require('../../models/video');

describe('Server route: "/videos/:id/edit"', () => {
  beforeEach(connectDatabase);
  afterEach(connectDatabase);
  describe('GET', () => {
    it('renders a form for a video', async () => {
      const title = 'Cool Vid';
      const description = 'This vid is way cool';
      const url = generateRandomUrl('localhost');

      const video = await Video.create({ title, description, url });
      const response = await request(app)
        .get(`/videos/${video._id}/edit`)

      assert.exists(parseTextFromHTML(response.text, 'form#video-form'), 'Expected update form to be rendered');
      assert.exists(parseTextFromHTML(response.text, `input[value="${title}"]`));
      assert.include(parseTextFromHTML(response.text, `#description`), description);
      assert.exists(parseTextFromHTML(response.text, `#url[value="${url}"]`));
    });
  });
});