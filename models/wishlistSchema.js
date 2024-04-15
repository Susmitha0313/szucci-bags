const Mongoose = require("mongoose");
const wishlistSchema = new Mongoose.Schema({
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products : [{
        productId: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        }
    }],
    addedAt: {
        type: Date,
        default: Date.now
    }
});
const Wishlist = Mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;