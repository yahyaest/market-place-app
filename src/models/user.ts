export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  phone?: number;
  role: "USER" | "ADMIN";
}

export interface AddUser {
  username: string;
  email: string;
  password: string;
  phone?: number;
}