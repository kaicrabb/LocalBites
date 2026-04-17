const express = require('express');
const API_KEY = process.env.API_KEY;
const { Readable } = require('stream');

// route to get a photo from google api by photo reference
const getPhoto = async (req, res) => {
    try {
        const name = req.query.name;

        if (!name) {
            return res.status(400).json({ message: 'Photo name is required' });
        }

        console.log('Fetching photo:', name);
        const url = `https://places.googleapis.com/v1/${name}/media?maxWidthPx=400`;
        const response = await fetch(url, {
            headers: {
                'X-Goog-Api-Key': API_KEY
            },
            redirect: 'follow'
        });

        if (!response.ok) {
            console.error('Failed to fetch photo:', response.statusText);
            return res.status(response.status).send('Failed to fetch image');
        }
        console.log('Photo fetched successfully:', name);
        res.setHeader(
            "Content-Type",
            response.headers.get("content-type") || "image/jpeg"
        );
        Readable.fromWeb(response.body).pipe(res);
    } catch (error) {
        console.error('Error fetching photo:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = getPhoto;