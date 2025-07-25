import bcryptjs from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
  if (!password) {
    throw new Error("Password didn't reach the hashing function!");
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  return hashedPassword;
};

export const RandomPassword = async () =>
  await bcryptjs.hash(Math.random().toString(36).slice(-8), 10);
