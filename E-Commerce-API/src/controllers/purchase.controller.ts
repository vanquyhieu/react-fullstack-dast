import { NextFunction, Request, Response } from "express";
import { sendJsonSuccess } from "../helpers/responseHandler";
import purchaseService from "../services/purchase.service";


const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const purchase = await purchaseService.getAllItems(); // Đổi từ 'suppliersService' thành 'purchaseService'
      sendJsonSuccess(res)(purchase);
    } catch (error) {
      next(error);
    }
  };
  const getItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract user ID and status from request parameters (assuming numeric status)
      const { user, status } = req.params;
      const statusParse = parseInt(status)

      const userServer = res.locals.user; // Replace with appropriate logic to get logged-in user
      if(user && user === userServer){
        // Call purchase service using validated user ID and status (assuming purchaseService provides getItemById)
        const purchase = await purchaseService.getItemById({user, statusParse});
        sendJsonSuccess(res)(purchase); // Assuming sendJsonSuccess exists and sends a successful response
      }
    } catch (error) {
      next(error); // Pass error for handling by middleware or error handler
    }
  };
  
  
  const createItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      const user = res.locals.user; // Access the user information
      const newpurchase = await purchaseService.createItem(payload,user);
      sendJsonSuccess(res)(newpurchase);
    } catch (error) {
      next(error);
    }
  };
  
  const updateItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      console.log(id, req.body);
      const payload = req.body;
      const updatedEmployee = await purchaseService.updateItem(id, payload); // Đổi từ 'suppliersService' thành 'purchaseService'
      sendJsonSuccess(res)(updatedEmployee);
    } catch (error) {
      next(error);
    }
  };
  
  const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deletedEmployee = await purchaseService.deleteItem(id); // Đổi từ 'suppliersService' thành 'purchaseService'
      sendJsonSuccess(res)(deletedEmployee);
    } catch (error) {
      next(error);
    }
  };
  
  export default {
    getAll,
    getItemById,
    updateItem,
    createItem,
    deleteItem,
  };
  