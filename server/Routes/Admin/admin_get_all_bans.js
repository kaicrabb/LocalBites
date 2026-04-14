import Bans from '../../Models/bans';
import User from '../../Models/user';

async function adminGetAllBans(req, res) {
    if (!req.user.IsAdmin) {// check that the user is an admin
        console.log('Unauthorized to get all bans:', 'by user:', req.user.id);
        return res.status(403).json({ message: 'Not authorized to get all bans' });
    }
    try {
        const allBans = await Bans.find();
        const bansWithUserInfo = await Promise.all(allBans.map(async (ban) => {
            const user = await User
                .findById(ban.userId)
                .select('Username Email'); // Select only the fields you want to return
            return {
                id: ban._id,
                userId: ban.userId,
                username: user ? user.Username : 'Unknown User',
                email: user ? user.Email : 'Unknown Email',
                reason: ban.reason,
                bannedAt: ban.bannedAt,
                expiresAt: ban.expiresAt
            };
        }
        ));
        return res.status(200).json({ bans: bansWithUserInfo });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = adminGetAllBans;