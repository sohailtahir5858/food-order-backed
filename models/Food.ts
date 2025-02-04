import { Schema, Document, model } from 'mongoose'

interface FoodDoc extends Document {
    vendorId: string;
    name: string;
    category: string;
    description: string;
    foodType: string;
    readyTime: number;
    price: number;
    rating: number;
    images: [string];
}

const FoodSchema = new Schema({
    vendorId: {
        type: String
    },
    name: {
        type: String,
        required: [true, "food name is required!"]
    },
    category: {
        type: String,
        required: [true, "category is required!"]
    },
    description: {
        type: String,
        required: [true, "description is required"]
    },
    foodType: {
        type: String,
        required: [true, "foodType is required"]
    },
    readyTime: {
        type: Number,
        required: [true, "readyTime is required"]
    },
    price: {
        type: Number,
        required: [true, "price is required"]
    },
    rating: {
        type: Number
    },
    images: {
        type: [String]
    }
}, {
    toJson: {
        transform(doc, ret) {
            delete ret._id;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
});

const Food = model<FoodDoc>("food", FoodSchema);

export { Food }