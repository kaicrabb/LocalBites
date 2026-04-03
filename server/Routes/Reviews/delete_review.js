const Review = require('../../Models/reviews');

async function deleteReview(req, res) {
    const userId = req.user.id; //get user id from the authenticated token
    const reviewId = req.body.reviewId; //get review id from the request body
    try {
        //checking if review exists
        const review = await Review.findById(reviewId);
        if (!review) {
            console.log('Review not found:', reviewId);
            return res.status(404).json({ message: 'Review not found' });
        }
        //checking if the user owns the review
        if (review.User.toString() !== userId.toString()) {
            console.log('Unauthorized to delete this review:', reviewId, 'by user:', userId);
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }
        //deleting the review
        await Review.findByIdAndDelete(reviewId);
        console.log('Review deleted successfully:', reviewId);
        return res.status(200).json({ message: 'Review deleted successfully' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = deleteReview;