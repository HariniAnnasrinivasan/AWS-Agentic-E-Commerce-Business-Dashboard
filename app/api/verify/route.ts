import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        // Simple validation as per requirements
        // "Validate token format (starts with "session-")"
        if (!token || !token.startsWith('session-')) {
            return NextResponse.json({ valid: false, error: 'Invalid token format' }, { status: 401 });
        }

        // In a real app, verify expiry and signature here.
        // For this simple implementation:
        return NextResponse.json({ valid: true });

    } catch (error: any) {
        console.error('Verify Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
