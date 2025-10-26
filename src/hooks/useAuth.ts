import { useAuthContext } from '@/components/providers/AuthRefreshProvider';

/**
 * Custom hook for accessing authentication state and functions.
 * Must be used within AuthRefreshProvider.
 *
 * @returns {Object} Authentication context
 * @property {User | null} user - Current authenticated user or null
 * @property {boolean} loading - Whether auth state is being loaded
 * @property {Function} login - Function to initiate login flow
 * @property {Function} logout - Function to logout and clear session
 * @property {Function} refreshAuth - Function to manually refresh auth state
 *
 * @example
 * const { user, loading, login, logout } = useAuth();
 *
 * if (loading) return <div>Loading...</div>;
 * if (!user) return <div>Please login</div>;
 * return <div>Welcome {user.name}</div>;
 */
export const useAuth = useAuthContext;
