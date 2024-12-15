import * as bcrypt from 'bcryptjs';

const hashText = async (text: string) => bcrypt.hash(text, 15);
const compareText = async (text: string, hash: string) => bcrypt.compare(text, hash);

export { hashText, compareText };
