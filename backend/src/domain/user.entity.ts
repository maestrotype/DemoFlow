export class UserEntity {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: string;
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<UserEntity>) {
    Object.assign(this, data);
  }
}
