import Category from '../models/categories.model';
import { ICategory } from '../types/model';

/**
 * Service là nơi chứa các logic xử lý và tương tác trực tiếp với cơ sở dữ liệu
 */

const getAllItems = async () => {
  try {
    const categories = await Category.find()
      .select('-__v')
    const totalRecords = await Category.countDocuments();
    const pagination = {
      totalRecords,
    };
    return {
      categories,
      pagination,
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
    const deletedCategory = await Category.findByIdAndDelete(id);
    return deletedCategory;
  } catch (error) {
    throw error;
  }
};

export default {
  getAllItems,
  getItemById,
  updateItem,
  createItem,
  deleteItem,
};
