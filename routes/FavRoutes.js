import express from "express";
import {
  getFavoriteLists,
  addFavoriteList,
  updateFavoriteLists,
  deleteFavoriteList,
} from "../controllers/FavListApis.js";
import {
  getFavoriteWords,
  removeFavoriteWord,
  addFavoriteWord,
  getAllFavoriteWords,
} from "../controllers/FavApis.js";

const router = express.Router();

router.route("/:userID").get(getAllFavoriteWords); // 取得該清單內的所有單字

router
  .route("/:userID/lists")
  .get(getFavoriteLists) // 取得使用者的所有清單
  .post(addFavoriteList) // 新增一個清單
  .patch(updateFavoriteLists); // 更新該清單

router
  .route("/:userID/lists/:listID")
  .get(getFavoriteWords) // 取得該清單內的所有單字
  .delete(deleteFavoriteList); // 刪除該清單

router.route("/:userID/lists/:listID/favorites").post(addFavoriteWord); // 在清單內新增單字

router
  .route("/:userID/lists/:listID/favorites/:wordID")
  .delete(removeFavoriteWord); // 從清單內刪除單字

export { router };
