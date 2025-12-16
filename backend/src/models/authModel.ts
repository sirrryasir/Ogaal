import { prisma } from '../config/prisma.js';

export const createUser = async (email: string, password: string, fullName: string, role?: 'ADMIN' | 'GOVERNMENT' | 'NGO_WORKER' | 'COMMUNITY_MEMBER', ngo_id?: number) => {
  return await prisma.user.create({
    data: {
      email,
      password,
      fullName,
      role: role || 'COMMUNITY_MEMBER',
      ngo_id
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