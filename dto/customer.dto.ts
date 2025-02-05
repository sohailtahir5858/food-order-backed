import { IsEmail, Length, MinLength } from "class-validator";

export class createCustomerInput {
    @IsEmail()
    email: string;

    @Length(7, 12)
    password: string;

    @Length(7, 12)
    phone: number;

    @MinLength(1)
    firstName: string;

    @MinLength(1)
    lastName: string;
}

export class customerLoginInput {
    @IsEmail()
    email: string;

    @MinLength(5)
    password: string;
}

export class verifyOtpInput {
    @Length(5, 6)
    otp: number;
}

export interface CustomerPayload {
    _id: string;
    name: string;
    email: string;
    type: string;
    user: any | null;
}

