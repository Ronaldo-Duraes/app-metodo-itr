'use client';

import React, { Suspense } from 'react';
import AdminLeads from '@/components/landing/AdminLeads';

export default function AdminLeadsPage() {
    return (
        <div className="min-h-screen bg-[#030308]">
            <Suspense fallback={<div className="min-h-screen bg-[#030308] flex items-center justify-center"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>}>
                <AdminLeads />
            </Suspense>
        </div>
    );
}
