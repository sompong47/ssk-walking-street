import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const userToken = cookies().get('user_token')?.value;
  const adminToken = cookies().get('admin_token')?.value;

  if (adminToken) {
    return NextResponse.json({ isLoggedIn: true, role: 'admin', user: { name: 'Admin', phone: 'admin' } });
  }

  if (userToken) {
    try {
        const user = JSON.parse(userToken);
        return NextResponse.json({ isLoggedIn: true, role: 'user', user });
    } catch (e) {
        return NextResponse.json({ isLoggedIn: false });
    }
  }

  return NextResponse.json({ isLoggedIn: false });
}