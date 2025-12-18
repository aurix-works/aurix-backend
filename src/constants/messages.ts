export const ERROR_MESSAGES = {
    AUTH: {
        LOGIN_REQUIRED: 'You are not logged in! Please log in to get access.',
        INVALID_TOKEN: 'Invalid token. Please log in again.',
        USER_NOT_FOUND: 'The user belonging to this token no longer exists.',
        INCORRECT_CREDENTIALS: 'Incorrect email or password',
        MISSING_CREDENTIALS: 'Please provide email and password',
        FORBIDDEN: 'You do not have permission to perform this action',
    },
    RESOURCE: {
        NOT_FOUND: (resource: string) => `${resource} not found`,
        ALREADY_EXISTS: (resource: string) => `${resource} already exists`,
        DUPLICATE_EMAIL: 'User with this email already exists in this organization',
        DUPLICATE_SLUG: 'Permission with this slug already exists',
    },
    SERVER: {
        ROUTE_NOT_FOUND: (url: string) => `Can't find ${url} on this server!`,
    }
};
