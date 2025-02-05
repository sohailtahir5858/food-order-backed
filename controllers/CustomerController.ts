import { plainToClass } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { createCustomerInput, customerLoginInput, verifyOtpInput } from '../dto/customer.dto';
import { validate } from 'class-validator';
import { generateOtp, generateSalt, onRequestOtp } from '../utility';
import { Customer as CustomerModel } from '../models/Customer';

export const customerSignup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerInput = plainToClass(createCustomerInput, req.body)
        const validationErrors = await validate(customerInput, { validationError: { target: false } })
        if (validationErrors.length > 0) {
            const errorMessages = validationErrors
                .map((error) => Object.values(error.constraints || {}));
            return res.status(400).json(errorMessages)
        }

        const { email, password, phone, firstName, lastName } = customerInput
        const { otp, otp_expiry } = await generateOtp();
        const salt = await generateSalt();
        const customer = await CustomerModel.create({
            firstName,
            lastName,
            email,
            password,
            phone,
            otp: otp,
            otp_expiry: otp_expiry,
            verified: false,
            image: "",
            salt
        });

        if (!customer) {
            res.status(400).json({ message: "could not create customer!" })
            return
        }
        // await onRequestOtp(otp, phone);
        const token = await customer.createToken();

        res.status(200).json({ customer, token })
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ error: (error as Error).message })
    }
}

export const customerLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = plainToClass(customerLoginInput, req.body)
        const validationErrors = await validate(input, { validationError: { target: false } })
        if (validationErrors.length > 0) {
            const errorMessages = validationErrors
                .map((error) => Object.values(error.constraints || {}));
            return res.status(400).json(errorMessages)
        }

        const { email, password } = input
        const customer = await CustomerModel.findOne({ email: email });
        if (!customer || !await customer.comparePassword(password)) {
            res.status(400).json({ message: "could not create customer!" })
            return
        }

        const token = await customer.createToken();
        res.status(200).json({ customer, token });
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ error: (error as Error).message })
    }
}

export const customerVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = plainToClass(verifyOtpInput, req.body)
        const user = req.user

        const validationErrors = await validate(input, { validationError: { target: false } })
        if (validationErrors.length > 0) {
            const errorMessages = validationErrors
                .map((error) => Object.values(error.constraints || {}));
            return res.status(400).json(errorMessages)
        }
        const { otp } = input
        const customer = await CustomerModel.findById(user._id)
        const currentTime = new Date();
        if (customer.otp == otp && currentTime <= new Date(customer.otp_expiry)) {
            customer.verified = true;
            customer.save();
            res.status(200).json({ success: "otp verified. please proceed to login", customer })
        } else {
            res.status(400).json({ error: "invalid otp. please request for another one." })
        }
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ error: (error as Error).message })
    }
}

export const requestOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const customer = await CustomerModel.findById(user._id)
        if (!customer) {
            res.status(400).json({ message: "could not find customer!" })
            return
        }
        const { otp, otp_expiry } = await generateOtp();
        await onRequestOtp(otp, customer.phone);
        customer.otp = otp;
        customer.otp_expiry = otp_expiry;
        customer.verified = false;
        customer.save();

        res.status(200).json({ message: "otp has been sent. please verify to continue" })
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ error: (error as Error).message })
    }
}

export const getCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const customer = await CustomerModel.findById(user._id)
        if (!customer) {
            res.status(400).json({ message: "could not find customer!" })
            return
        }

        res.status(200).json({ customer })

    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ error: (error as Error).message })
    }
}

export const updateCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const customer = await CustomerModel.findById(user._id)
        if (!customer) {
            res.status(400).json({ message: "could not find customer!" })
            return
        }

        const { firstName, lastName, phone } = req.body
        customer.firstName = firstName ?? customer.firstName;
        customer.lastName = lastName ?? customer.lastName;
        customer.phone = phone ?? customer.phone;
        customer.save();
        res.status(200).json({ customer })
    } catch (error) {
        console.log((error as Error).message)
        res.status(400).json({ error: (error as Error).message })
    }
}