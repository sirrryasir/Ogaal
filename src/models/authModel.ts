import { prisma } from '../config/prisma';

export const createUser = async (email: string, password: string, fullName: string) => {
  return await prisma.user.create({
    data: {
      email,
      password,
      fullName,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const createPasswordResetToken = async (userId: number, token: string, expiresAt: Date) => {
  return await prisma.passwordResetToken.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
};

export const findPasswordResetToken = async (token: string) => {
  return await prisma.passwordResetToken.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });
};

export const deletePasswordResetToken = async (token: string) => {
  return await prisma.passwordResetToken.delete({
    where: {
      token,
    },
  });
};

export const updateUserPassword = async (userId: number, newPassword: string) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: newPassword,
    },
  });
};