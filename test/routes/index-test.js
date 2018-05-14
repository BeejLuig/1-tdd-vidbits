const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

const app = require('../../app');

describe('Server route: "/"', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);
  describe('GET', () => {
    it('redirects to "/videos"', async () => {
      const response = await request(app).get('/');

      assert.equal(response.header.location, '/videos');
    });
  });
});