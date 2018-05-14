const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {parseTextFromHTML, generateRandomUrl} = require('../utilities');
const app = require('../../app');
const Video = require('../../models/video');


describe('Server route: "videos/:id"', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);
  describe('GET', () => {
    it('renders a specific video', async () => {
      const title = 'Sweet Vid';
      const description = 'This vid is sweet';
      const url = generateRandomUrl('localhost');
      const video = await Video.create({ title, description, url });
      
      const response = await request(app)
        .get(`/videos/${video._id}`)
        .send();

      assert.include(parseTextFromHTML(response.text, '.video-title'), title);
      assert.include(parseTextFromHTML(response.text, '.video-description'), description);
      assert.exists(parseTextFromHTML(response.text,`iframe.video-player[src="${url}"]`));
    });
  });
});