import express from 'express';
import { editProfile, fetchUserProfile, getAllUsers, login, profile, register, resetPassword } from '../controllers/user.js';
import ftechUser from '../middleware/fetchUser.js';

const router=new express.Router();

router.post('/user/register',register);
router.get('/user/profile',ftechUser,profile);
router.post('/user/login',login);
router.put('/user/edit/:id',editProfile);
router.post("/user/reset-password", resetPassword);
router.get('/user/:id',fetchUserProfile);
router.get('/users',ftechUser,getAllUsers)

export default router;
