const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {parseTextFromHTML, generateRandomUrl} = require('../utilities');
const app = require('../../app');
const Video = require('../../models/video');

describe('Server route: "/videos/:id/update"', () => {
  beforeEach(connectDatabase);
  afterEach(connectDatabase);
  describe('POST', () => {
    const title = 'Cool Vid';
    const updatedTitle = 'Coolest Vid';
    const description = 'This vid is way cool';
    const url = generateRandomUrl('localhost');
    it('updates a video record', async () => {
      const video = await Video.create({ title, description, url });
      const response = await request(app)
        .post(`/videos/${video._id}/update`)
        .type('form')
        .send({ 
          title: updatedTitle, 
          url: video.url, description: 
          video.description 
        });
      const updatedVideo = await Video.findOne({ _id: video._id });

      assert.equal(updatedVideo.title, updatedTitle);
    });
    it('redirects to the Video show page', async () => {
      const video = await Video.create({ title, description, url });
      const response = await request(app)
        .post(`/videos/${video._id}/update`)
        .type('form')
        .send({ 
          title: updatedTitle,
          url: video.url,
          description: video.description
        });
      
      assert.equal(response.status, 302);
      assert.equal(response.header['location'], `/videos/${video._id}`);
    });
    describe('with an invalid record', () => {
      it('does not save', async () => {
        const video = await Video.create({ title, description, url });
        const emptyTitle = '';
        const response = await request(app)
          .post(`/videos/${video._id}/update`)
          .type('form')
          .send({ title: emptyTitle });
        const updatedVideo = await Video.findOne({ _id: video._id });

        assert.equal(response.status, 400);
        assert.equal(updatedVideo.title, video.title);
      });
      it('re-renders the edit form', async () => {
        const video = await Video.create({ title, description, url });
        const emptyTitle = '';
        const response = await request(app)
          .post(`/videos/${video._id}/update`)
          .type('form')
          .send({ title: emptyTitle });

        assert.exists(jsdom(response.text).querySelector(`#video-form[action="/videos/${video._id}/update"]`));
      });
    });
  });
});