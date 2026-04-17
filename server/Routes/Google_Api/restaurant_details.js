restaurant = require('../../Models/places');

// get all details for a restaurant by placeId
async function getRestaurantDetails(req, res) {
    try {
        const { placeId } = req.query;
        const restaurantDetails = await restaurant.findOne({ _id: placeId });
        if (!restaurantDetails) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        // use google api to get actual links to the restaurant's photos using the photo references stored in the database
        const restaurantObj = restaurantDetails.toObject();

        // if there are photos, create an array of photo URLs to send back to the client
        if (restaurantObj.photos?.length > 0) {
            restaurantObj.photoUrls = restaurantObj.photos.map(photo =>
                `/Google_Api/photo?name=${encodeURIComponent(photo.name)}`
            );
        }

        // console.log("Restaurant details found for placeId: " + placeId);
        res.status(200).json(restaurantObj);
    }
    catch (error) {
        console.error('Error fetching restaurant details:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = getRestaurantDetails;