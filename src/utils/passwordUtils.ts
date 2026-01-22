import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password (async)
 */
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a hashed password (async)
 */
export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

/**
 * Hash a plain text password (sync - for Sequelize hooks)
 */
export const hashPasswordSync = (password: string): string => {
    return bcrypt.hashSync(password, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a hashed password (sync)
 */
export const comparePasswordSync = (
    password: string,
    hashedPassword: string
): boolean => {
    return bcrypt.compareSync(password, hashedPassword);
};
