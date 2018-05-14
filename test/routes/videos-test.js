const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {parseTextFromHTML, generateRandomUrl} = require('../utilities');
const app = require('../../app');
const Video = require('../../models/video');

describe('Server route: "/videos"', () => {
  beforeEach(connectDatabase);
  afterEach(connectDatabase);
  describe('GET', () => {
    it('renders saved videos', async () => {
      const url = generateRandomUrl('localhost');
      const title = 'Cool Vid';
      const video = await Video.create({ title, url });
      const response = await request(app).get('/videos/');

      assert.include(parseTextFromHTML(response.text, '.video-title'), title);
      assert.exists(parseTextFromHTML(response.text, `.video-player[src="${url}"]`));
    });
  });
});