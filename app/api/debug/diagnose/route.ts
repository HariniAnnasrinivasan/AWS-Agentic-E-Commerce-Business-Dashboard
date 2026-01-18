import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await query("SELECT column_name FROM information_schema.columns WHERE table_name = 'deliveries'");
        return NextResponse.json(res.rows.map((r: any) => r.column_name));
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
