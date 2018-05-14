const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {parseTextFromHTML, generateRandomUrl} = require('../utilities');
const app = require('../../app');
const Video = require('../../models/video');

describe('Server route: "/videos"', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);
  describe('POST', () => {
    it('creates a Video document and redirects to it\'s show page', async () => {
      const title = 'My Video';
      const url = 'http://localhost:5000/my-video.mp4';
      const description = 'My vid is cool';

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({ title, description, url });
      const video = await Video.findOne({ title });
      
      assert.equal(video.title, title);
      assert.equal(video.description, description);
      assert.equal(video.url, url);

      assert.equal(response.status, 302);
      assert.equal(response.header.location, `/videos/${video._id}`);
    });
    describe('with a missing title', () => {
      const emptyTitle = '';
      it('does not save a Video', async () => {
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send({ title: emptyTitle });
        const videos = await Video.find({});
  
        assert.isEmpty(videos);
      });
      it('responds with a 400', async () => {
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send({ title: emptyTitle });

        assert.equal(response.status, 400);
      });
      it('renders new Video form', async () => {  
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send({ title: emptyTitle });
        
        assert.equal(parseTextFromHTML(response.text, 'h1'), 'Save a video')
      });
      it('renders a validation error', async () => {
        const validationError = 'Title is required';
        const response = await request(app)
        .post('/videos')
        .type('form')
        .send({ title: emptyTitle });

        assert.include(parseTextFromHTML(response.text, '#validation-error'), validationError)
      });
      it('preserves other form data', async () => {
        const description = 'This video rocks';
        const url = generateRandomUrl('localhost');
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send({ title: emptyTitle, description, url });
        
        assert.equal(parseTextFromHTML(response.text, '#description'), description);
        assert.include(jsdom(response.text).querySelector('#url').value, url);
      });
    });
    describe('with a missing URL', () => {
      const emptyURL = '';
      it('renders a validation error', async () => {
        const validationError = 'URL is required';
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send({ title: 'Title', url: emptyURL });

        assert.include(parseTextFromHTML(response.text, '#validation-error'), validationError);
      });
    });
  });
});