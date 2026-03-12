'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { decodeConfig } from '@/lib/utils';

function FormContent() {
  const searchParams = useSearchParams();
  const configParam = searchParams.get('c');
  const [config, setConfig] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (configParam) {
      try {
        const decoded = decodeConfig(configParam);
        setConfig(decoded);
      } catch (e) {
        setError('Invalid form configuration');
      }
    } else {
      setError('No configuration provided');
    }
  }, [configParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const metadata = {
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookies: document.cookie,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: new Date().toISOString(),
      };

      const payload = {
        formId: config.id || 'unknown',
        formName: config.name || config.title || 'Untitled Form',
        data: formData,
        metadata,
      };

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Submission failed');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return <div className="p-4 text-red-500 bg-red-50 rounded-md font-sans m-4">{error}</div>;
  }

  if (!config) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-neutral-400" /></div>;
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center font-sans transition-colors duration-300" style={{ backgroundColor: config.theme?.backgroundColor || '#ffffff', color: config.theme?.textColor || '#000000' }}>
        <div>
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="opacity-80">Your submission has been received.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 font-sans transition-colors duration-300" style={{ backgroundColor: config.theme?.backgroundColor || '#ffffff', color: config.theme?.textColor || '#000000' }}>
      <div className="max-w-xl mx-auto">
        {config.title && <h1 className="text-2xl font-bold mb-2">{config.title}</h1>}
        {config.description && <p className="mb-6 opacity-80">{config.description}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {config.fields?.map((field: any) => (
            <div key={field.id} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium opacity-90">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              
              {field.type === 'textarea' ? (
                <textarea
                  required={field.required}
                  className="w-full p-2.5 border rounded-lg bg-white/50 focus:ring-2 outline-none transition-all shadow-sm"
                  style={{ 
                    borderColor: config.theme?.primaryColor ? `${config.theme.primaryColor}40` : '#e5e7eb',
                    color: '#000'
                  }}
                  rows={4}
                  onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                />
              ) : field.type === 'select' ? (
                <select
                  required={field.required}
                  className="w-full p-2.5 border rounded-lg bg-white/50 focus:ring-2 outline-none transition-all shadow-sm"
                  style={{ 
                    borderColor: config.theme?.primaryColor ? `${config.theme.primaryColor}40` : '#e5e7eb',
                    color: '#000'
                  }}
                  onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                >
                  <option value="">Select an option</option>
                  {field.options?.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    required={field.required}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => setFormData({...formData, [field.id]: e.target.checked})}
                  />
                  <span className="text-sm opacity-80">I agree</span>
                </div>
              ) : (
                <input
                  type={field.type}
                  required={field.required}
                  className="w-full p-2.5 border rounded-lg bg-white/50 focus:ring-2 outline-none transition-all shadow-sm"
                  style={{ 
                    borderColor: config.theme?.primaryColor ? `${config.theme.primaryColor}40` : '#e5e7eb',
                    color: '#000'
                  }}
                  onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 flex justify-center items-center gap-2 mt-8 shadow-md"
            style={{ backgroundColor: config.theme?.primaryColor || '#000000' }}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? 'Submitting...' : (config.submitText || 'Submit')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function FormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-neutral-400" /></div>}>
      <FormContent />
    </Suspense>
  );
}
