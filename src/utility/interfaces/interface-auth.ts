export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister extends ILogin {
  firstName: string;
  lastName?: string;
}

export interface IResetPassword {
  email: string;
  password: string;
  token: string;
}

export interface IRequestResetPass {
  email: string;
}

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
  createdAt: Date;
}

export interface ISigninGoogle {
  email: string;
  firstName: string;
  lastName?: string | null;
  imageUrl?: string | null;
}

export interface IVerifyToken {
  email: string;
  token: string;
}