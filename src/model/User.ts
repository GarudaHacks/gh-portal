/**
 * User as returned by any auth endpoint.
 */
export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  role: string;
  status: string;
}
