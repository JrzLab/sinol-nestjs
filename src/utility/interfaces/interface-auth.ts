export interface IToken {
  email: string;
  iat: number;
  exp: number;
}

// Prisma Interface
export interface IUserData {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string | null;
  tokenReset: string | null;
  imageUrl: string | null;
  createdAt: Date;
}

export interface ISigninGoogle {
  email: string;
  firstName: string;
  lastName?: string | null;
  imageUrl?: string | null;
}
