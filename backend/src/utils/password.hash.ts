import bcryptjs from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
  if (!password) {
    throw new Error("Password didn't reach the hashing function!");
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  return hashedPassword;
};
