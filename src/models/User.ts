export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string; // Hashed
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
