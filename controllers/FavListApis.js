import { FavoriteLists } from "../../server/models/FavoriteListSchema.js";
import { FavoriteWord } from "../../server/models/FavoriteWordSchema.js";

export const getFavoriteLists = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { userID } = req.params;
    const favLists = await FavoriteLists.find({ user: userID });

    res.json({ favLists });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFavoriteList = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { userID } = req.params;
  const { data } = req.body;

  try {
    const newList = await FavoriteLists.create({ ...data, user: userID });
    res.json(newList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateFavoriteLists = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { listUpdates } = req.body;

  if (!Array.isArray(listUpdates) || listUpdates.length === 0) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid data format" });
  }

  const bulkOps = listUpdates.map((update) => ({
    updateOne: {
      filter: { _id: update.listId },
      update: { $set: { icon: update.icon, name: update.name } },
    },
  }));
  try {
    await FavoriteLists.bulkWrite(bulkOps);

    const updatedLists = await FavoriteLists.find({});
    return res.json({ success: true, lists: updatedLists });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteFavoriteList = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { listID } = req.params;
  try {
    await FavoriteLists.findByIdAndDelete(listID);
    await FavoriteWord.updateMany(
      { favoriteLists: listID },
      { $pull: { favoriteLists: listID } }
    );
    res.json({ success: "delete list complate" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
