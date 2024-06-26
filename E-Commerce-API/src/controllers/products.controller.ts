import { NextFunction, Request, Response } from 'express';
import { sendJsonSuccess } from '../helpers/responseHandler';
import productsService from '../services/products.service';

export interface ProductListConfig {
  page?: number | string;
  totalRecords?: number;
  totalPages?: number;
  currentPage?: number;
  recordsPerPage?: number;
  limit?: number | string;
  sort_by?: 'createAt' | 'view' | 'sold' | 'price';
  order?: 'asc' | 'desc';
  exclude?: string;
  rating_filter?: number | string;
  price_max?: number | string;
  price_min?: number | string;
  name?: string;
  category?: string;
}

//  * Controller - Điều khiển
//  * - Tiếp nhận req từ client
//  * - Phản hồi lại res cho client
//  */

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('req.query.productCTL', req.query)
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit =   req.query.limit ? parseInt(req.query.limit as string) : 10;
    const category = req.query.category as string;
    let sort_by = req.query.sort_by as string;
    const order = req.query.order as string; 
      if (order === 'desc'||'asc') {
        sort_by = sort_by === 'price'? 'price' : sort_by;
      } 
    const products = await productsService.getAllItems(page, limit, category, sort_by);
    // check số lượng sản phẩm hiện thị trên 1 page.
    // console.log(products.length);
    sendJsonSuccess(res)(products); // Gọi hàm mà có truyền giá trị cho data
  } catch (error) {
    next(error);
  }
};

const getItemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productsService.getItemById(req.params.id);
    sendJsonSuccess(res)(product);
  } catch (error) {
    next(error);
  }
};

const getItemByParams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productsService.getItemByParams()
    sendJsonSuccess(res)(product);
  } catch (error) {
    next(error);
  }
};


const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const newProduct = await productsService.createItem(payload);
    sendJsonSuccess(res)(newProduct);
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    console.log(id, req.body);
    const payload = req.body;
    const updatedProduct = await productsService.updateItem(id, payload);
    sendJsonSuccess(res)(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productsService.deleteItem(id);
    sendJsonSuccess(res)(deletedProduct);
  } catch (err) {
    next(err);
  }
};

export default {
  getAll,
  getItemById,
  getItemByParams,
  updateItem,
  createItem,
  deleteItem,
};
