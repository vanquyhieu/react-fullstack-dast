import { NextFunction, Request, Response } from 'express';
import { sendJsonSuccess } from '../helpers/responseHandler';
import categoriesService from '../services/categories.service';

/**
 * Controller - Điều khiển
 * - Tiếp nhận req từ client
 * - Phản hồi lại res cho client
 */

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // destructure page and limit and set default values
    const categories = await categoriesService.getAllItems();
    sendJsonSuccess(res)(categories); // Gọi hàm mà có truyền giá trị cho data
  } catch (error) {
    next(error);
  }
};

const getItemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoriesService.getItemById(req.params.id);
    sendJsonSuccess(res)(category);
  } catch (error) {
    next(error);
  }
};


const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const newCategory = await categoriesService.createItem(payload);
    sendJsonSuccess(res)(newCategory);
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    console.log(id, req.body);
    const payload = req.body;
    const updatedCategory = await categoriesService.updateItem(id, payload);
    sendJsonSuccess(res)(updatedCategory);
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const  {id}  = req.params ;
    const deletedCategory = await categoriesService.deleteItem(id);
    sendJsonSuccess(res)(deletedCategory);
  } catch (err) {
    next(err);
  }
};

export default {
  getAll,
  getItemById,
  updateItem,
  createItem,
  deleteItem,
};