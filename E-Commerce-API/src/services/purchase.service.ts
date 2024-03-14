import mongoose from 'mongoose';
import Purchase from '../models/purchase.model'; 
import { IPurchase } from '../types/model'; 

const getAllItems = async () => {
  
  const purchase = Purchase.find({}, ' -__v ');
  
  return purchase;
};

const getItemById = async (payload:{statusParse: number, user: string}) => {
  // console.log(id);
  const newPurchase = await Purchase.find({payload}); 
  return newPurchase;
};

const createItem = async (payload:IPurchase[], user:string) => {
  const newPurchase = await Purchase.create({...payload,user}); 
  return newPurchase;
};

const updateItem = async (_id: string, payload: IPurchase) => {
  const newPurchase = Purchase.findByIdAndUpdate(_id, payload, {
    new: true,
  });
  return newPurchase;
};

const deleteItem = async (id: string) => {
  const newPurchase = Purchase.findByIdAndDelete(id); 
  return newPurchase;
};

export default {
  getAllItems,
  getItemById,
  updateItem,
  createItem,
  deleteItem,
};
