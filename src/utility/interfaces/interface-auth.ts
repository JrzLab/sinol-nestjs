export interface IToken {
  email: string;
  iat: number;
  exp: number;
}

// Prisma Interface
export interface IUserData {
  id: number;
  firstName: string;
  lastName: string | null;
  email: string;
  password: string;
  tokenReset: string | null;
  imageUrl: string | null;
  createdAt: Date;
}
