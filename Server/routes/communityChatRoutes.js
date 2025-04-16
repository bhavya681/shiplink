import express from "express";
import { getCommunityMessages, sendCommunityMessage } from "../controllers/communityChatController.js";
import fetchUser from "../middleware/fetchUser.js";

const router = express.Router();

router.get("/:communityId",fetchUser, getCommunityMessages); 
router.post("/",fetchUser, sendCommunityMessage); 

export default router;