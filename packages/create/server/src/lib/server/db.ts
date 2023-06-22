import { PrismaClient } from '@prisma/client';
import type { AuthKey, AuthSession, AuthUser } from '@prisma/client';
const database = new PrismaClient({
    log: ['query', 'info', 'error', 'warn']
});
export default database;
export { 
    database,
    AuthKey,
    AuthSession,
    AuthUser,
}