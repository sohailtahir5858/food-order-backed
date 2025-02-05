import mongoose, { Schema, Document, model } from "mongoose"
import { comparePassword, createToken, encryptPassword, generateSalt } from "../utility";
import { AuthPayload } from "../dto/auth.dto";

interface VendorDoc extends Document {
    name: string;
    address: string;
    email: string;
    pincode: string;
    password: string;
    phone: string;
    ownerName: string;
    foodType: [string];
    salt: string;
    serviceAvailable: boolean;
    coverImages: string[];
    rating: number;
    foods: any;

    comparePassword(candidatePassword: string): Promise<boolean>;
    createToken(): Promise<string>;
}


const VendorSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name field is required!"]
    },
    address: {
        type: String,
        required: [true, "Address field is required!"]
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        matches: [
            '^([a-zA-Z0-9!#$%&*+=?^_`{|}~-]+(\.[ A-Za-z0-9!#$%&*+=?^_`{|}~-]+)*)@(([ a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9] )?\.)+[a-zA-Z0-9]([a-zA-Z0-9-]*[a-z A-Z0-9])?)$',
            'Please enter a valid email'
        ],
        unique: [true, "Email already exists!"]
    },
    pincode: {
        type: Number,
        required: [true, "Pincode is required!"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        minLength: 8
    },
    phone: {
        type: String,
        required: [true, "Phone is required!"],
        minLength: 8
    },
    ownerName: {
        type: String,
        required: [true, "ownerName is required!"],
        minLength: 8
    },
    foodType: {
        type: [String],
        required: [true, "foodType is required"]
    },
    coverImages: {
        type: [String]
    },
    rating: {
        type: Number
    },
    salt: {
        type: String,
        required: false
    },
    serviceAvailable: {
        type: Boolean,
        default: false
    },
    foods: [{
        type: mongoose.Types.ObjectId,
        ref: "food"
    }]
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret._id;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
});


VendorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.salt = await generateSalt();
    this.password = await encryptPassword(this.password, this.salt ?? "");
    next();
});

VendorSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await comparePassword(candidatePassword, this.password)
}

VendorSchema.methods.createToken = async function () {
    return await createToken({ _id: this._id, name: this.name, email: this.email, foodType: this.foodType, type: "vendor" } as AuthPayload);
}

export const Vendor = model<VendorDoc>("vendors", VendorSchema);

