import { imagesType } from "./product.type";

export interface Category {
        _id: string;
        name: string;
        images: imagesType[];
}
