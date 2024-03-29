import Category from '../models/categories.model';
import { ICategory } from '../types/model';

/**
 * Service là nơi chứa các logic xử lý và tương tác trực tiếp với cơ sở dữ liệu
 */

const getAllItems = async (page: number, limit: number) => {
  try {
    const categories = await Category.find()
      .select('-__v')
      .skip((page - 1) * limit)
      .limit(limit).exec()

    const totalRecords = await Category.countDocuments();
    return {
      categories,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
      page_size: limit,
    };
  } catch (error) {
    throw error;
  }
};

const getItemById = async (id: string) => {
  try {
    const category = await Category.findById(id);
    return category;
  } catch (error) {
    throw error;
  }
};

const getItemByIdPerPage = async (payload:any) => {
  try {
    const category = await Category.findById(payload);
    return category;
  } catch (error) {
    throw error;
  }
};

const createItem = async (payload: ICategory) => {
  try {
    const addCategory = await Category.create(payload);
    return addCategory;
  } catch (error) {
    throw error;
  }
};

const updateItem = async (id: string, payload: ICategory) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return updatedCategory;
  } catch (error) {
    throw error;
  }
};

const deleteItem = async (id: string) => {
  try {
    const deletedCategory = await Category.deleteOne({id});
    return deletedCategory;
  } catch (error) {
    throw error;
  }
};

export default {
  getAllItems,
  getItemById,
  getItemByIdPerPage,
  updateItem,
  createItem,
  deleteItem,
};
