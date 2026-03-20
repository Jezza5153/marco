import { neon } from '@neondatabase/serverless';

export function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

export type RsvpEntry = {
  id: number;
  name: string;
  attending: boolean;
  guests_count: number;
  message: string | null;
  created_at: string;
};
