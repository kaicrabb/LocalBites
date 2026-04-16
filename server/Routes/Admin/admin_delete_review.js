const review = require('../../Models/reviews');

async function adminDeleteReview(req, res) {
    const reviewId = req.body.reviewId; //get review id from the request body 
    
    if (!req.user.IsAdmin) {// check that the user is an admin
        console.log('Unauthorized to delete this review:', reviewId, 'by user:', req.user.id);
        return res.status(403).json({ message: 'Not authorized to delete this review' });
    }
    try {
        //checking if review exists
        const reviewToDelete = await review.findById(reviewId);
        if (!reviewToDelete) {
            console.log('Review not found:', reviewId);
            return res.status(404).json({ message: 'Review not found' });
        }
        //deleting the review
        await review.findByIdAndDelete(reviewId);
        console.log('Review deleted successfully by admin:', reviewId);
        return res.status(200).json({ message: 'Review deleted successfully' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = adminDeleteReview;