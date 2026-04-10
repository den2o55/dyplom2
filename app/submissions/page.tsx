'use client';

import { useEffect, useState } from 'react';
import { Loader2, ArrowLeft, Download, Database } from 'lucide-react';
import Link from 'next/link';
import type { Submission } from '@/lib/bigquery';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/submissions');
      if (!res.ok) throw new Error('Failed to fetch submissions');
      const data = await res.json();
      setSubmissions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (submissions.length === 0) return;

    // Get all unique keys from all submission data
    const dataKeys = new Set<string>();
    submissions.forEach(sub => {
      Object.keys(sub.data).forEach(key => dataKeys.add(key));
    });

    const headers = ['Date', 'Form ID', 'Form Name', ...Array.from(dataKeys), 'URL', 'User Agent', 'Cookies', 'Screen', 'Timezone'];
    
    const rows = submissions.map(sub => {
      const row = [
        new Date(sub.createdAt).toLocaleString(),
        sub.formId,
        sub.formName,
        ...Array.from(dataKeys).map(key => sub.data[key] || ''),
        sub.metadata?.url || '',
        sub.metadata?.userAgent || '',
        sub.metadata?.cookies || '',
        sub.metadata?.screenResolution || '',
        sub.metadata?.timezone || ''
      ];
      // Escape quotes and wrap in quotes for CSV
      return row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-neutral-500 hover:text-neutral-900 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <Database className="text-blue-600" />
            <h1 className="text-xl font-bold text-neutral-900">Submissions</h1>
          </div>
        </div>
        <button 
          onClick={downloadCSV}
          disabled={submissions.length === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} /> Export CSV
        </button>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-neutral-400 w-8 h-8" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
            {error}
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl border border-neutral-200 shadow-sm">
            <Database className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-1">No submissions yet</h3>
            <p className="text-neutral-500">When users fill out your forms, their data will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map((sub) => (
              <div key={sub.id} className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="bg-neutral-50 px-6 py-3 border-b border-neutral-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-neutral-900">{sub.formName}</span>
                    <span className="text-xs text-neutral-500 font-mono bg-neutral-200/50 px-2 py-1 rounded">ID: {sub.formId}</span>
                  </div>
                  <span className="text-sm text-neutral-500">
                    {new Date(sub.createdAt).toLocaleString()}
                  </span>
                </div>
                
                <div className="p-6 grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Form Data</h4>
                    <dl className="space-y-3">
                      {Object.entries(sub.data).map(([key, value]) => (
                        <div key={key}>
                          <dt className="text-sm font-medium text-neutral-700">{key}</dt>
                          <dd className="text-sm text-neutral-900 mt-0.5 bg-neutral-50 p-2 rounded border border-neutral-100 break-words">
                            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Metadata</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b border-neutral-100">
                        <dt className="text-neutral-500">URL</dt>
                        <dd className="text-neutral-900 truncate max-w-[200px]" title={sub.metadata?.url}>{sub.metadata?.url || 'N/A'}</dd>
                      </div>
                      <div className="flex justify-between py-1 border-b border-neutral-100">
                        <dt className="text-neutral-500">Referrer</dt>
                        <dd className="text-neutral-900 truncate max-w-[200px]" title={sub.metadata?.referrer}>{sub.metadata?.referrer || 'N/A'}</dd>
                      </div>
                      <div className="flex justify-between py-1 border-b border-neutral-100">
                        <dt className="text-neutral-500">Timezone</dt>
                        <dd className="text-neutral-900">{sub.metadata?.timezone || 'N/A'}</dd>
                      </div>
                      <div className="flex justify-between py-1 border-b border-neutral-100">
                        <dt className="text-neutral-500">Screen</dt>
                        <dd className="text-neutral-900">{sub.metadata?.screenResolution || 'N/A'}</dd>
                      </div>
                      <div className="flex justify-between py-1 border-b border-neutral-100">
                        <dt className="text-neutral-500">Language</dt>
                        <dd className="text-neutral-900">{sub.metadata?.language || 'N/A'}</dd>
                      </div>
                      <div className="pt-2">
                        <dt className="text-neutral-500 mb-1">Cookies</dt>
                        <dd className="text-xs text-neutral-600 font-mono bg-neutral-50 p-2 rounded border border-neutral-100 break-all max-h-24 overflow-y-auto">
                          {sub.metadata?.cookies || 'None'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
