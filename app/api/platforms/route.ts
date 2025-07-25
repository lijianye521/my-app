import { getDb } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const db = await getDb();
  const [rows] = await db.query('SELECT * FROM platform_services WHERE ? IS NULL OR service_type = ? ORDER BY sort_order', [type, type]);
  return Response.json(rows);
}
