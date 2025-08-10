export interface Admin {
  id: number;
  username: string;
  name: string;
  password_hash: string;
  password_salt: string;
  created_at: string;
}

export interface AdminSanitized {
  id: number;
  username: string;
  name: string;
}


