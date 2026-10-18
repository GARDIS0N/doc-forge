import React, { Suspense } from 'react';
import { allTemplates } from '@/lib/registry';
import { EditorClient } from '@/components/editor/EditorClient';
import { Loader2 } from 'lucide-react';

export function generateStaticParams() {
  return allTemplates.map((t) => ({
    slug: t.meta.slug,
  }));
}

export default async function EditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
          <p className="text-xs font-medium">Loading DocForge Editor...</p>
        </div>
      }
    >
      <EditorClient slug={slug} />
    </Suspense>
  );
}
