restuarant = require('../../Models/places');

// get basic info for nearby restaurants by location and radius
async function getNearbyRestaurants(req, res) {
    try {
        //Radius is in meters which is super dumb and annoying but whatever
        const { latitude, longitude, radius } = req.query;
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
        //only return basic info for nearby restaurants
        const basicInfo = nearbyRestaurants.map(rest => ({
            _id: rest._id,
            displayName: rest.displayName,
            formattedAddress: rest.formattedAddress,
            rating: rest.rating,
            location: {
                coordinates: [rest.location.coordinates[0], rest.location.coordinates[1]]
            },
            primaryType: rest.primaryType,
            priceLevel: rest.priceLevel
        }));
        res.status(200).json(basicInfo);
    }
    catch (error) {
        console.error('Error fetching nearby restaurants:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = getNearbyRestaurants;
