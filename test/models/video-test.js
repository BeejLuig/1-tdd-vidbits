const {assert} = require('chai');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const Video = require('../../models/video');

describe('Video', () => {

  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('#title', () => {
    it('is a String', () => {
      const title = 1;

      const video = new Video({ title });

      assert.strictEqual(video.title, title.toString());
    });
    it('is required', () => {
      const video = new Video();

      video.validateSync();

      assert.equal(video.errors.title.message, 'Title is required');
    });
  });

  describe('#description', () => {
    it('is a String', () => {
      const title = 'My Title';
      const description = 1;
    
      const video = new Video({ title, description });

      assert.strictEqual(video.description, description.toString());
    });
  });

  describe('#url', () => {
    it('is a String', () => {
      const title = 'Title';
      const url = 1;

      const video = new Video({ title, url });

      assert.strictEqual(video.url, url.toString());
    });
    it('is required', () => {
      const video = new Video();

      video.validateSync();

      assert.ok(video.errors.url.message, 'URL is required');
    });
  });
});