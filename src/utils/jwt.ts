import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
  role: string;
}

// Generate JWT token
const generateToken = (user: UserPayload): string => {
  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email,  role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: '1h', // Token expires in 1 hour
    }
  );

  return token;
};



export { generateToken };