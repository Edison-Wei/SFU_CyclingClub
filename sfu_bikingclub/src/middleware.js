export {default} from 'next-auth/middleware';

// stops users from accessing blog once they are signed out (protects pages)

export const config = {matcher: ['/blog'] };