// URL of a backend path such as /graphql/. In development this goes through Vite's proxy on the app's
// own address (see vite.config.ts), so the login cookie Django sets belongs to the host the app runs on;
// browsers keep cookies for localhost and 127.0.0.1 apart. Builds use VITE_API_URL.
export const apiUrl = (path: string) => (import.meta.env.DEV ? path : `${import.meta.env.VITE_API_URL}${path}`);

export const loginUrl = (next: string) => apiUrl(`/accounts/login/?next=${encodeURIComponent(next)}`);
