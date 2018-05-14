const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {parseTextFromHTML, generateRandomUrl} = require('../utilities');
const app = require('../../app');
const Video = require('../../models/video');

describe('Server route: "/videos/:id/delete"', () => {
  beforeEach(connectDatabase);
  afterEach(connectDatabase);
  describe('POST', () => {
    it('renders a form for a video', async () => {
      const title = 'Cool Vid';
      const description = 'This vid is way cool';
      const url = generateRandomUrl('localhost');

      const video = await Video.create({ title, description, url });
      const response = await request(app)
        .post(`/videos/${video._id}/delete`)
        .type('form')
        .send();

      const videoCount = await Video.count();

      assert.equal(videoCount, 0, 'Expected video to be deleted');
    });
  });
});