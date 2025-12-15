import { prisma } from '../config/prisma.js';
export const createUser = async (email, password, fullName, role, ngo_id) => {
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
export const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email,
        },
    });
};
//# sourceMappingURL=authModel.js.map