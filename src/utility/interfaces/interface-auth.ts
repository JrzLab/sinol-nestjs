export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister extends ILogin {
  firstName: string;
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
  email: string;
  password: string;
  id: number;
  firstName: string;
  lastName: string | null;
  tokenReset: string | null;
  createdAt: Date;
}
