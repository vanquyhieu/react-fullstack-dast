import { Schema, model, Types } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import buildSlug from '../helpers/buildSlug';
import { IProduct } from '../types/model';
import crypto from 'crypto';


const arrayLimit = (val: any) => val.length <= 5;

const imageSchema = new Schema({
  url: { type: String },
});


const productSchema = new Schema({
  _id:{
    type: Types.ObjectId,
    auto:true,
  },
  id:{
    type:Number,
    unique:true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  variants: [{
    id: String,
    name: String,
    attributes: [{
      name: String,
      value: String
    }],
    prices: [{
      option: String,
      price: Number
    }]
  }],

  price_before_discount: {
    type: Number,
  },
  supplier: {
    type: Types.ObjectId,
    ref: 'Supplier',
    required: false,
  },
  category: {
    type: Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    maxLength: 3000,
  },
  rating: {
    type: Number,
    required: false,
    min: 0,
    max: 5,
  },
  images: {
    type: [imageSchema],
    validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
    default: [],
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  view: {
    type: Number,
  },
  sold: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    required: false,
    default: 0,
    min: 0,
    max: 100,
  },
  slug: {
    type: String,
    lowercase: true,
    required: false,
    unique: true,
    maxLength: 160,
    validate: {
      validator: (value: any) => {
        if (!value) return true;
  
        if (value.length > 0) {
          const slugRegex = /^[a-z0-9\-]+$/;
          return slugRegex.test(value);
        }
  
        return true;
      },
      message: 'Slug phải duy nhất và chỉ chứa chữ cái, số và dấu gạch ngang',
    },
  },
});

productSchema.virtual('url').get(function () {
  return '/products/' + this._id;
});

productSchema.virtual('numImages').get(function () {
  return this.images.length;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

productSchema.plugin(mongooseLeanVirtuals);

productSchema.pre('save', function(next) {
  const product = this;

  product.variants.forEach(variant => {
    const hash = crypto.createHash('md5').update(`${product.name}_${variant.attributes[0].value}_${variant.attributes[1].value}`).digest('hex');
    variant.id = hash;
  });

  if (!this.slug && this.name) {
    this.slug = buildSlug(this.name);
  }
  next();
});
const Product = model<IProduct>('Product', productSchema);
export default Product;