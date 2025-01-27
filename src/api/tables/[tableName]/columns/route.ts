import { NextRequest, NextResponse } from 'next/server';
import { registerRoute } from '@/lib/api-routes';
import { getTableColumns } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string> }
) {
  const { tableName } = params;
  if (!tableName) {
    return NextResponse.json({ success: false, message: 'Table name is required' }, { status: 400 });
  }
  const result = await getTableColumns(tableName);
  return NextResponse.json(result);
}

registerRoute({
  path: '/api/tables/:tableName/columns',
  method: 'GET',
  handler: async (request: NextRequest, params: Record<string, string>) => {
    const { tableName } = params;
    if (!tableName) {
      return NextResponse.json({ success: false, message: 'Table name is required' }, { status: 400 });
    }
    const result = await getTableColumns(tableName);
    return NextResponse.json(result);
  }
});

