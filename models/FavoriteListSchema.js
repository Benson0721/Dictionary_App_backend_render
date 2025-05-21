import mongoose from "mongoose";
const { Schema } = mongoose;

const FavoriteListSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  icon: {
    type: String,
    require: true,
  },
  favoriteWords: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Favorite",
    },
  ],
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

export const FavoriteLists = mongoose.model("FavoriteLists", FavoriteListSchema);
