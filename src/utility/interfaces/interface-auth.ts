export interface IRegister {
  username: string;
  email: string;
  password: string;
}

export interface ILogin {
  username?: string;
  email?: string;
  password: string;
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
  displayName: string | null;
  username: string;
  tokenReset: string | null;
  joinedAt: Date;
};
