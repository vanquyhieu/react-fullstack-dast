import Joi from "joi";
import { IPurchase } from "../types/model";



const orderDetailSchema = Joi.object<IPurchase>({
  product_Id: Joi.string().required(),
  buy_count: Joi.number().min(1).required(),
    price: Joi.number().min(1).required(),
  });
  
  const orderSchema = Joi.object<IPurchase>({
    createdAt: Joi.date().required(),
    updatedAt: Joi.date(),
    status: Joi.string().valid('WAINTING', 'COMPLETED', 'CANCEL').default('WAINTING').required(),
    user: Joi.string().required(),
  });

  
  export default {
    orderDetailSchema,
    orderSchema
  };