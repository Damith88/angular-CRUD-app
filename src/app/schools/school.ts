export interface Address {
    street: string;
    suburb: string;
    postcode: string;
    state: string;
}

export interface School {
    id?: number;
    name: string;
    address: Address;
    studentCount: number;
}