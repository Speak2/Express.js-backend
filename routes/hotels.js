const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const fs = require('fs');

// Configure multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Get all hotels
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT slug, title, description, guest_count, bedroom_count, bathroom_count, amenities, amenities_icon_logos, host_information, host_image, co_host_images, address, latitude, longitude FROM hotels');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error in GET /api/hotels:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Get a specific hotel
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { rows } = await db.query('SELECT * FROM hotels WHERE slug = $1', [slug]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    // Convert BYTEA to Base64 for each image
    rows[0].images = rows[0].images.map(image => image.toString('base64'));
    rows[0].amenities_icon_logos = rows[0].amenities_icon_logos.map(logo => logo.toString('base64'));
    rows[0].host_image = rows[0].host_image.toString('base64');
    rows[0].co_host_images = rows[0].co_host_images.map(image => image.toString('base64'));
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error in GET /api/hotels/:slug:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});
 
// Create a new hotel
router.post('/', upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'amenities_icon_logos', maxCount: 10 },
  { name: 'host_image', maxCount: 1 },
  { name: 'co_host_images', maxCount: 5 }
]), async (req, res) => {
  try {
    const { slug, title, description, guest_count, bedroom_count, bathroom_count, amenities, host_information, address, latitude, longitude } = req.body;
    
    // Read uploaded files and convert to BYTEA
    const images = req.files.images.map(file => {
      const img = fs.readFileSync(file.path);
      fs.unlinkSync(file.path);
      return img;
    });

    const amenities_icon_logos = req.files.amenities_icon_logos.map(file => {
      const logo = fs.readFileSync(file.path);
      fs.unlinkSync(file.path);
      return logo;
    });

    const host_image = fs.readFileSync(req.files.host_image[0].path);
    fs.unlinkSync(req.files.host_image[0].path);

    const co_host_images = req.files.co_host_images.map(file => {
      const img = fs.readFileSync(file.path);
      fs.unlinkSync(file.path);
      return img;
    });

    const { rows } = await db.query(
      'INSERT INTO hotels (slug, images, title, description, guest_count, bedroom_count, bathroom_count, amenities, amenities_icon_logos, host_information, host_image, co_host_images, address, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *',
      [slug, images, title, description, guest_count, bedroom_count, bathroom_count, amenities, amenities_icon_logos, host_information, host_image, co_host_images, address, latitude, longitude]
    );

    // Convert BYTEA to Base64 for the response
    rows[0].images = rows[0].images.map(image => image.toString('base64'));
    rows[0].amenities_icon_logos = rows[0].amenities_icon_logos.map(logo => logo.toString('base64'));
    rows[0].host_image = rows[0].host_image.toString('base64');
    rows[0].co_host_images = rows[0].co_host_images.map(image => image.toString('base64'));
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error in POST /api/hotels:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// ... other routes ...

module.exports = router;