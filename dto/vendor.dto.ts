
export interface CreateVendorInput {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    email: string;
    password: string;
    phone: string;
}

export interface EditVendorInputs {
    name: string;
    address: string;
    phone: string;
    foodType: [string];
}

export interface EditVendorServiceInputs {
    serviceAvailability: boolean;
}

export interface VendorLoginInputs {
    email: string;
    password: string;
}

export interface VendorPayload {
    _id: string;
    name: string;
    email: string;
    foodType: [string];
    user: any;
}