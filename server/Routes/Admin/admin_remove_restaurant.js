/*
    * This file defines the route handler for removing a restaurant by an admin.
    * The route expects a POST request with the restaurant ID to delete.
    * The handler checks if the requester is an admin, verifies that the restaurant to be deleted exists, and deletes the restaurant from the Places collection.
    * Appropriate success and error responses are sent back to the client based on the outcome of the operation.
    * This route is protected and should only be accessible to users with admin privileges.
*/

const places = require('../../Models/places');

async function adminRemoveRestaurant(req, res) {
    const restaurantIdToDelete = req.body.restaurantId; //get restaurant id from the request body

    if (!req.user.IsAdmin) {// check that the user is an admin
        console.log('Unauthorized to delete this restaurant:', restaurantIdToDelete, 'by user:', req.user.id);
        return res.status(403).json({ message: 'Not authorized to delete this restaurant' });
    }
    try {
        //checking if restaurant exists
        const restaurantToDelete = await places.findById(restaurantIdToDelete);
        if (!restaurantToDelete) {
            console.log('Restaurant not found:', restaurantIdToDelete);
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        //deleting the restaurant
        await places.findByIdAndDelete(restaurantIdToDelete);
        console.log('Restaurant deleted successfully by admin:', restaurantIdToDelete);
        return res.status(200).json({ message: 'Restaurant deleted successfully' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = adminRemoveRestaurant;
