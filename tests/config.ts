import 'dotenv/config';

export const config = {
  baseUrl: process.env.BASE_URL ?? 'https://opensource-demo.orangehrmlive.com',
  username: process.env.ORANGEHRM_USER ?? 'Admin',
  password: process.env.ORANGEHRM_PASSWORD ?? 'admin123',
  adminStorageState: '.auth/admin.json',
};
