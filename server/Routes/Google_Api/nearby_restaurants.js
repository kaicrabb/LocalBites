restuarant = require('../../Models/places');

// get nearby restaurants by location and radius
async function getNearbyRestaurants(req, res) {
    try {
        //Radius is in meters which is super dumb and annoying but whatever
        const { latitude, longitude, radius } = req.body;
        const nearbyRestaurants = await restaurant.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: radius
                }
            }
        });
        //console.log("Nearby restaurants found: " + nearbyRestaurants.length);
        res.status(200).json(nearbyRestaurants);
    }
    catch (error) {
        console.error('Error fetching nearby restaurants:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = getNearbyRestaurants;