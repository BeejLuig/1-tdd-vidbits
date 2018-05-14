const {jsdom} = require('jsdom');

const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

const generateRandomUrl = (domain) => {
  return `http://${domain}/${Math.random()}`;
};

const submitCreateVideoForm = ({ title = '', description = '', url = '' }) => {
  browser.url('/videos/create');
  browser.setValue('#title', title);
  browser.setValue('#description', description);
  browser.setValue('#url', url);
  browser.submitForm('#video-form');
}

const submitUpdateVideoForm = ({ title = '', description = '', url = '' }) => {
  browser.setValue('#title', title);
  browser.setValue('#description', description);
  browser.setValue('#url', url);
  browser.submitForm('#video-form');
}

module.exports = { 
  parseTextFromHTML, 
  generateRandomUrl, 
  submitCreateVideoForm, 
  submitUpdateVideoForm 
};