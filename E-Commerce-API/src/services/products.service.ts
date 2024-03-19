import Product from '../models/products.model';
import { IProduct } from '../types/model';

interface ProductListConfig {
  page?: number | string;
  totalRecords?: number;
  totalPages?:number;
  currentPage?:number;
  recordsPerPage?:number;
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
const getAllItems = async (currentPage: number, pageSize: number) => {

  /**
   * Page 1: 0 - 10 (Lấy 10 sp đầu)
   * Page 2: 11 - 20 (Lấy 10 sp tiếp theo)
   * ...
   */
  // Tương đương: SELECT * FROM products (SQL)
  const products = await Product.find({}, ' -__v').
  populate('supplier', '-__v ').
  populate('category', '-__v ').
  skip((currentPage - 1) * pageSize).
  limit(pageSize);
  
  /// get total documents in the Categories collection 
  const totalRecords = await Product.countDocuments();
  const pagination = {
    totalRecords, 
    totalPages: Math.ceil(totalRecords / pageSize),
    currentPage: currentPage,
    page_size: pageSize
}

  //return response, total pages, and current page
  return {
    products,
    pagination
  };
};

const getItemById = async (id: string) => {
  // SELECT * FROM products WHERE id = id
  console.log(id);

  //Lấy tất cả ngoại trừ __v
  const product = await Product.findOne({_id: id}, '-__v').
  populate('category', '-__v').
  populate('supplier','-__v').
  lean({ virtuals: true });

  return product;
};
const getItemByParams = async (currentPage: number, pageSize: number,category: string) => {
  // SELECT * FROM products WHERE id = id
  //Lấy tất cả ngoại trừ __v
  const products = await Product.find({category}, '-__v')
  /// get total documents in the Categories collection 
  const totalRecords = await Product.countDocuments();
  const pagination = {
    totalRecords, 
    totalPages: Math.ceil(totalRecords / pageSize),
    currentPage: currentPage,
    page_size: pageSize
}

  //return response, total pages, and current page
  return {
    products,
    pagination
  };

};

const getItemBySlug = async (category: string) => {
  //Lấy tất cả ngoại trừ __v
  const product = await Product.findOne({category: category}, '-__v').
  populate('category', '-__v').
  populate('supplier','-__v').
  lean({ virtuals: true });

  return product;
};
const createItem = async (payload: IProduct) => {
  // Kiểm tra xem email đã tồn tại chưa
  
  // Lưu xuống database
  const product = await Product.create(payload);
  return product;
};

const updateItem = async (id: string, payload: IProduct) => {
  const product = Product.findByIdAndUpdate(id, payload, {
    new: true, //==> trả về product với thông tin sau khi đã thay đổi
  });
  return product;
};

const deleteItem = async (id: string) => {
  const product = Product.findByIdAndDelete(id);
  return product;
};

export default {
  getAllItems,
  getItemById,
  getItemByParams,
  updateItem,
  createItem,
  deleteItem,
  getItemBySlug
};