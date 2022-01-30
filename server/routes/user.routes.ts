import {
  deleteUserById,
  getFollowersById,
  getFollowingsById,
  getUserById,
  searchUser,
  updateUserById,
  toggleFollowUser,
  getTopUsersByFollowers,
} from "../controllers/users.Controllers";
import authMiddleware from "../middleware/auth.middleware";
import uploadFile from "../middleware/uploadFile.middleware";
import express from "express";

const router = express.Router();

router.get("/topUsers", getTopUsersByFollowers); // change api endpoint name
router.get("/search", searchUser);

router
  .route("/:id")
  .get(getUserById)
  .put(authMiddleware, uploadFile().single("profilePicture"), updateUserById)
  .delete(authMiddleware, deleteUserById);

router.get("/:id/followers", authMiddleware, getFollowersById);
router.get("/:id/followings", authMiddleware, getFollowingsById);

router.put("/:id/follow", authMiddleware, toggleFollowUser);

export default router;
