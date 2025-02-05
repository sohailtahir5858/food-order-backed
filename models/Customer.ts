import { Schema, model, Document } from "mongoose";
import { comparePassword, createToken, encryptPassword, generateSalt } from "../utility";
import { AuthPayload } from "../dto/auth.dto";

export interface CustomerDoc extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    image: string;
    salt: string;
    otp: number;
    otp_expiry: Date;
    verified: boolean;

    createToken(): Promise<string>;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const CustomerSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "first name is required!"]
    },
    lastName: {
        type: String,
        required: [true, "first name is required!"]
    },
    email: {
        type: String,
        required: [true, "first name is required!"],
        regex: ["/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/", "invalid email format"],
        unique: [true, "email must be unique"]
    },
    password: {
        type: String,
        required: [true, "password is required!"],
        minLength: [6, "password must be atleast 6 characters"],
        regex: ["/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/", "invalid password!"]
    },
    otp: {
        type: Number,
        required: [true, "otp is required"]
    },
    otp_expiry: {
        type: Date,
        required: [true, "otp expiry is required"]
    },
    verified: {
        type: Boolean,
        required: [true, "verified is required"],
        default: false
    },
    image: {
        type: String
    },
    salt: {
        type: String
    },
    phone: {
        type: String,
        required: [true, "phone is required"]
    }
}, {
    toJSON: {
        transform(dic, _ret) {
            delete _ret.createdAt;
            delete _ret.updatedAt;
            delete _ret._id;
            delete _ret.password;
            delete _ret.__v;
            delete _ret.otp;
            delete _ret.otp_verify;
            delete _ret.salt;
        }
    },
    timestamps: true
})

CustomerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.salt = await generateSalt();
    this.password = await encryptPassword(this.password, this.salt ?? "");
    next();
})

CustomerSchema.methods.createToken = async function () {
    return await createToken({ _id: this._id, name: this.firstName + this.lastName, email: this.email, type: "customer" } as AuthPayload)
}

CustomerSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await comparePassword(candidatePassword, this.password)
}

export const Customer = model<CustomerDoc>('customer', CustomerSchema);