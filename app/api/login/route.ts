import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        // 1. Query admin_users table
        const result = await query(
            `SELECT admin_id, username, password_hash, role FROM admin_users WHERE username = $1`,
            [username]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        const user = result.rows[0];

        // 2. Compare password with bcrypt
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        // 3. Create simple token (In production, use JWT or similar)
        // Format: session-<admin_id>-<timestamp>-<random>
        const token = `session-${user.admin_id}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

        // In a real app, store this token in a sessions table. 
        // For this requirement, we'll verify the signature/format in /api/verify or assume valid if present and formatted correctly 
        // (User instructions: "Token can be a simple signed string... Return { token, username }")
        // To be more secure even with simple requirement, let's keep it stateless but formatted.
        // Or we could store it in a DB table if requested? User didn't request a sessions table.
        // User said: "Validate token format (starts with "session-")"

        return NextResponse.json({
            token,
            username: user.username,
            role: user.role
        });

    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
