const express = require('express');
const router = express.Router();
const API_KEY = process.env.API_KEY;

// route to get a photo from google api by photo reference
router.get('/photo', async (req, res) => {
    try {
        const photoReference = req.query.name;
        if (!photoReference) {
            return res.status(400).json({ message: 'Photo reference is required' });
        }
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${API_KEY}`;
        res.redirect(photoUrl);
    } catch (error) {
        console.error('Error fetching photo:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;