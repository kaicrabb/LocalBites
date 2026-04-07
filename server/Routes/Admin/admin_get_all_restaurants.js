const places = require('../../Models/places');

async function adminGetAllRestaurants(req, res) {
    const restaurantIdToDelete = req.body.restaurantId; //get restaurant id from the request body
    if (!req.user.IsAdmin) {// check that the user is an admin
        console.log('Unauthorized to get all restaurants:', 'by user:', req.user.id);
        return res.status(403).json({ message: 'Not authorized to get all restaurants' });
    }

    try {
        const allRestaurants = await places.find();
        return res.status(200).json({ restaurants: allRestaurants });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = adminGetAllRestaurants;
