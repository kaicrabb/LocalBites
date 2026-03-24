restaurant = require('../../Models/places');


// get all details for a restaurant by placeId
async function getRestaurantDetails(req, res) {
    try {
        const { placeId } = req.query;
        const restaurantDetails = await restaurant.findOne({ _id: placeId });
        if (!restaurantDetails) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        // console.log("Restaurant details found for placeId: " + placeId);
        res.status(200).json(restaurantDetails);
    }
    catch (error) {
        console.error('Error fetching restaurant details:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = getRestaurantDetails;