'use client';

import React from 'react';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminPasswordGuard from '@/components/auth/AdminPasswordGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminPasswordGuard>
        <div className="min-h-screen bg-black text-white font-outfit">
          {children}
        </div>
      </AdminPasswordGuard>
    </AdminGuard>
  );
}
