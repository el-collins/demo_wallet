export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string; // Hashed
    createdAt: Date;
    updatedAt: Date;
  }