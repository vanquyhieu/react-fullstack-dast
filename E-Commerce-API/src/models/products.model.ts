import { Schema, model, Types } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import buildSlug from '../helpers/buildSlug';
import { IProduct } from '../types/model';
import crypto from 'crypto';

const arrayLimit = (val: any) => val.length <= 5;

const imageSchema = new Schema({
  url: { type: String },
});

// Định nghĩa schema cho thuộc tính của mỗi biến thể
const attributeSchema = new Schema({
  name: { type: String },
  value: { type: String },
});

// Định nghĩa schema cho giá của mỗi biến thể
const priceSchema = new Schema({
  option: String,
  price: Number,
});

// Định nghĩa schema cho biến thể
const variantSchema = new Schema({
  id: String,
  name: { type: String },
  attributes: [attributeSchema], // Sử dụng một mảng các thuộc tính
  prices: {
    type: [priceSchema],
    default: [{ ...priceSchema, priceSchema }],
  },
  quantity: { type: Number },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
});
// Định nghĩa schema cho giá của mỗi biến thể
const priceMinMaxSchema = new Schema({
  price_min: Number,
  price_max: Number,
});

const commentSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    maxLength: 3000,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
});
// Định nghĩa interface cho một biến thể sản phẩm
interface IVariant {
  id: string;
  name: string;
  attributes: { name: string; values: string[] }[]; // Một mảng các thuộc tính có tên và mảng các giá trị
  prices: { option: string; price: number }[]; // Một mảng các giá
  quantity: number;
  discount: number;
}

const productSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    auto: true,
  },
  id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  variants: {
    type: [variantSchema],
    default: [],
  },
  priceMinMax: {
    type: priceMinMaxSchema,
    default: {
      price_min: 0,
      price_max: 0,
    },
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
  images: {
    type: [imageSchema],
    validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
    default: [],
  },
  comments: {
    type: [commentSchema],
    default: [],
  },
  view: {
    type: Number,
  },
  sold: {
    type: Number,
    default: 0,
  },
  slug: {
    type: String,
    lowercase: true,
    required: false,
    unique: true,
    maxLength: 160,
    validate: {
      validator: (value: string) => {
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

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });
productSchema.plugin(mongooseLeanVirtuals);
productSchema.pre('save', function (next) {
  const product = this;
  //variant
  let totalQuantities = 0;
  let productPriceMin = 0;
  let productPriceMax = 0;
  let productDiscount = 0;
  if (product.variants && product.variants.length === 1) {
    product.variants.forEach((variant: IVariant & any) => {
      const hash = crypto.createHash('md5').update(`${product.name}_${variant.attributes[0].value}`).digest('hex');
      variant.id = hash;
      if (variant.attributes.length === 1) {
        variant.name = `${product.name}_${variant.attributes[0].value}`;
      } else variant.name = `${product.name}_${variant.attributes[0].value}_${variant.attributes[1].value}`;
      // Kiểm tra nếu biến thể có giá và có ít nhất hai lựa chọn giá
      if (variant.prices && variant.prices.length >= 2) {
        const defaultPrices = variant.prices.filter((price: { option: string; price: number }) => price.option === 'default') as number[];
        const salesPrices = variant.prices.filter((price: { option: string; price: number }) => price.option === 'sales') as number[];
        variant.discount = (salesPrices[0] / defaultPrices[0]) * 100;
        const variantPrices = variant.prices.map((price: { price: number }) => price.price);
        if (variantPrices.length === 1) {
          (productPriceMin === productPriceMax) === variantPrices;
        } else {
          productPriceMin = Math.min(...variantPrices);
          productPriceMax = Math.max(...variantPrices);
        }
      }
      // Kiểm tra nếu variant.quantity tồn tại và có giá trị, nếu không, sử dụng giá trị mặc định là 0
      const quantityValue = variant.quantity;
    });
  } else {
    product.variants.forEach((variant: IVariant & any) => {
      const hash = crypto.createHash('md5').update(`${product.name}_${variant.attributes[0].value}_${variant.attributes[1].value}`).digest('hex');
      variant.id = hash;
      if (variant.attributes.length === 1) {
        variant.name = `${product.name}_${variant.attributes[0].value}`;
      } else variant.name = `${product.name}_${variant.attributes[0].value}_${variant.attributes[1].value}`;
      // Kiểm tra nếu biến thể có giá và có ít nhất hai lựa chọn giá
      if (variant.prices && variant.prices.length >= 2) {
        const defaultPrices = variant.prices.filter((price: { option: string; price: number }) => price.option === 'default') as number[];
        const salesPrices = variant.prices.filter((price: { option: string; price: number }) => price.option === 'sales') as number[];

        variant.discount = (salesPrices[0] / defaultPrices[0]) * 100;

        const variantPrices = variant.prices.map((price: { price: number }) => price.price);
        if (variantPrices.length === 1) {
          (productPriceMin === productPriceMax) === variantPrices;
        } else {
          productPriceMin = Math.min(...variantPrices);
          productPriceMax = Math.max(...variantPrices);
        }
      }
      // Kiểm tra nếu variant.quantity tồn tại và có giá trị, nếu không, sử dụng giá trị mặc định là 0
      const quantityValue = variant.quantity;
      // totalQuantities += quantityValue.reduce((a:number, b:number) => a + b, 0);
    });
  }
  //giá
  if (product.priceMinMax) {
    product.priceMinMax.price_min = productPriceMin;
    product.priceMinMax.price_max = productPriceMax;
  }
  //slug
  product.slug = buildSlug(product.name);
  // Gọi next() một lần sau khi tất cả công việc đã được thực hiện
  next();
});
const Product = model<IProduct>('Product', productSchema);
export default Product;
