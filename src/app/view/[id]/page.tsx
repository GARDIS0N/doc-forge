import React, { Suspense } from 'react';
import { ViewClient } from '@/components/view/ViewClient';
import { Loader2 } from 'lucide-react';

export function generateStaticParams() {
  return [{ id: 'sample' }];
}

export default async function ViewDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
          <p className="text-xs font-medium">Loading document viewer...</p>
        </div>
      }
    >
      <ViewClient id={id} />
    </Suspense>
  );
}
