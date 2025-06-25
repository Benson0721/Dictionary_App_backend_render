import mongoose from "mongoose";
const { Schema } = mongoose;

const FavoriteWordSchema = new Schema({
  word: {
    type: String,
    required: true,
  },
  phonetic: {
    type: String,
    required: true,
  },
  audio: {
    type: String,
    default: "",
  },
  meaning: {
    type: String,
    required: true,
  },
  favoriteLists: [
    {
      type: mongoose.Types.ObjectId,
      ref: "FavoriteLists",
    },
  ],
  users: [{
    type: mongoose.Types.ObjectId,
    ref: "User",
  },]
});

export const FavoriteWord = mongoose.model("FavoriteWord", FavoriteWordSchema);
