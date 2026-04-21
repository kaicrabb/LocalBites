/*
    * The route expects a POST request and requires the user to be authenticated (i.e., req.user should be populated by the authentication middleware).
    * The handler retrieves the user's information from the database using the user ID obtained from the authenticated token.
    * Then the handler updates either Username (unique) or Bio based on the input.
    * Appropriate error responses are sent back to the client if the user is not found or if there is a server error during the retrieval process.
    * This route can be used by clients to update information intended mainly for displays not identifying or blocking actions.
*/

const user = require('../Models/user');

async function updateUserInfo(req, res) {
    try {
        const userId = req.user?.id;
        const { Bio, Username } = req.body
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if(Username){
            const existingUser = await User.findOne({ Username });

            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).json({ message: "Username already taken" });
            }

            foundUser.Username = Username;
        }
        if(Bio){
            foundUser.Bio = Bio
        }
        await foundUser.save();

        return res.status(200).json({
            message: "User updated successfully",
            user: foundUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = updateUserInfo;