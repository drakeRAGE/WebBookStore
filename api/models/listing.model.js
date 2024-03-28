import mongoose from 'mongoose';

const lisitngSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
    offer: {
      type: Boolean,
      default: false,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', lisitngSchema);

export default Listing;
