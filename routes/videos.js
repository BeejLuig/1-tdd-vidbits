const router = require('express').Router();
const Video = require('../models/video');

router.post('/videos', async (req, res) => {
  const { title, description, url } = req.body;
  const video = new Video({ title, description, url });
  video.validateSync();

  if (video.errors) {
    res.status(400).render('videos/create', video);
  } else {
    await video.save();
    res.redirect(`/videos/${video._id}`);
  }
});

router.get('/videos/create', async (req, res) => {
  res.status(200).render('videos/create');
});

router.get('/videos/:id', async (req, res) => {
  const video = await Video.findById(req.params.id, (err) => {
    if (err) {
      res.status(404).render('404');
    }
  });
  if (video) {
    res.render('videos/show', video);
  }
});

router.get('/videos/:id/edit', async (req, res) => {
  const video = await Video.findOne({ _id: req.params.id });

  if (video) {
    res.render('videos/edit', video);
  }
});

router.post('/videos/:id/update', async (req, res) => {
  const { title, url, description } = req.body;
  const { id } = req.params;
  const video = await Video.findOne({ _id: id });

  video.set({ title, url, description });
  video.validateSync();

  if (video.errors) {
    res.status(400).render('videos/edit', video);
  } else {
    await video.save();
    res.redirect(`/videos/${video._id}`);
  }
});

router.post('/videos/:id/delete', async (req, res) => {
  const { id } = req.params;
  await Video.remove({ _id: id });
  res.redirect('/');
});

router.get('/videos', async (req, res) => {
  const videos = await Video.find({})
  res.render('videos/index', { videos });
});

router.get('/', async (req, res) => {
  res.redirect('/videos');
});

module.exports = router;