import express from 'express';
import { listShipment, deleteShipment, fetchAll, fetchMine, editShipment, fetchMyShipments, getShipmentById } from '../controllers/shipment.js';
import ftechUser from '../middleware/fetchUser.js';
import checkPriviledge from '../middleware/checkPriviledge.js';

const router=new express.Router();

router.post('/listing/post',ftechUser,checkPriviledge,listShipment); 
router.delete('/listing/delete/:id',ftechUser,deleteShipment); 
router.get('/listing/all',ftechUser,fetchAll); 
router.get('/listing/:id',ftechUser,checkPriviledge,fetchMine); 
router.put('/listing/edit/:id',ftechUser,checkPriviledge,editShipment);
router.get('/listing/all/mine',ftechUser,fetchMyShipments);
router.get('/listing/shipment/:id',ftechUser,getShipmentById);

export default router;
