/*
    * This file defines the route handler for adding new restaurants via api requests by an admin.
    * The route expects a POST request with a location, made up of town name and state.
    * The handler checks if the requester is an admin, intiates a call to the google api, and returns a list of the restaurant names.
    * Appropriate success and error responses are sent back to the client based on the outcome of the operation.
    * This route is protected and should only be accessible to users with admin privileges.
*/

const httpSearchText = require('../Google_Api/http_search_places');

async function addRestaurants(req, res){
    try{
        if (!req.user.IsAdmin) {// check that the user is an admin
            console.log('Unauthorized to add restaurants via admin page', 'by user:', req.user.id);
            return res.status(403).json({ message: 'Not authorized access Admin Features' });
        }
        const {town, state} = req.body
        if (!town || !state){
            return res.status(400).json({
                success: false,
                message: "Town and state are required"
            });
        }
        const query = `restaurants in ${town}, ${state}`;
        const data = await httpSearchText(query);
        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("Error adding restaurants:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while adding restaurants",
            error: error.message
        });
    }

}

module.exports = addRestaurants;