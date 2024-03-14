import express from 'express';
import purchaseController from '../../controllers/purchase.controller';
import {  authenticateToken } from '../../middleware/auth.middleware';
/***
 * Route chỉ làm nhiệm vụ định tuyến
 * Mapping request giữa client với Server
 * ==> Không nên chứa các Logic 
 */
const router = express.Router();

//Get All categories from DB
router.get('/', purchaseController.getAll);

//get user by ID
//Gắn middleware vào để check id có phải là số không
router.get('/:status/:user', purchaseController.getItemById);

//Create a new user
//Check Token
//Check xem user có quyền User không ?
router.post('/add-to-cart',authenticateToken ,purchaseController.createItem);

router.post('/purchase',authenticateToken ,purchaseController.createItem);


/**
 * Update a user by ID
 * PATH /api/v1//:id
 */
router.patch('/:id',  purchaseController.updateItem);

/**
 * Delete a user by ID
 * DELETE /api/v1//:id
 */
router.delete('/:id',purchaseController.deleteItem);

//Xuất router ra
export default router;