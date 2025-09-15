export interface RoleEntity {
  id: number;
  name: string;
  description?: string;
  children?: RoleEntity[];
}

export interface UserContext {
  id: number;
  role: RoleEntity;
}

export interface AuthContext {
  user: UserContext;
}

export type RoleName = "owner" | "admin" | "viewer";
