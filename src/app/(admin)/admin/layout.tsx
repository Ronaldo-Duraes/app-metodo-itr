'use client';

import React from 'react';
import AdminPasswordGuard from '@/components/auth/AdminPasswordGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminPasswordGuard>
      <div className="min-h-screen bg-black text-white font-outfit">
        {children}
      </div>
    </AdminPasswordGuard>
  );
}
