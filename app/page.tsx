'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Copy, Check, Settings, Layout, Code, ExternalLink, GripVertical } from 'lucide-react';
import { encodeConfig } from '@/lib/utils';

type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox';

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  options?: string[];
}

export default function BuilderPage() {
  const [config, setConfig] = useState<{
    id: string;
    name: string;
    title: string;
    description: string;
    submitText: string;
    theme: {
      backgroundColor: string;
      textColor: string;
      primaryColor: string;
    };
    fields: FormField[];
  }>({
    id: 'form-1',
    name: 'My First Form',
    title: 'Contact Us',
    description: 'Please fill out this form and we will get back to you.',
    submitText: 'Send Message',
    theme: {
      backgroundColor: '#ffffff',
      textColor: '#171717',
      primaryColor: '#2563eb'
    },
    fields: [
      { id: 'f1', type: 'text' as FieldType, label: 'Full Name', required: true },
      { id: 'f2', type: 'email' as FieldType, label: 'Email Address', required: true },
      { id: 'f3', type: 'textarea' as FieldType, label: 'Message', required: false }
    ] as FormField[]
  });

  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);
  
  const encoded = encodeConfig(config);
  const origin = isMounted ? window.location.origin : '';
  const previewUrl = `${origin}/f?c=${encoded}`;
  const iframeCode = `<iframe src="${previewUrl}" width="100%" height="600" frameborder="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: ${config.theme.backgroundColor};"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addField = (type: FieldType) => {
    setConfig({
      ...config,
      fields: [
        ...config.fields,
        {
          id: `field-${Math.random().toString(36).substring(2, 9)}`,
          type,
          label: `New ${type} field`,
          required: false,
          ...(type === 'select' ? { options: ['Option 1', 'Option 2'] } : {})
        }
      ]
    });
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setConfig({
      ...config,
      fields: config.fields.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const removeField = (id: string) => {
    setConfig({
      ...config,
      fields: config.fields.filter(f => f.id !== id)
    });
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Layout className="text-blue-600" />
          <h1 className="text-xl font-bold text-neutral-900">FormBuilder</h1>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/submissions" 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Submissions
          </Link>
          <a 
            href={previewUrl} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <ExternalLink size={16} /> Open Preview
          </a>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copied ? <Check size={16} /> : <Code size={16} />}
            {copied ? 'Copied!' : 'Copy Embed Code'}
          </button>
        </div>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Settings */}
        <aside className="w-[400px] bg-white border-r overflow-y-auto flex flex-col shadow-sm z-0">
          <div className="p-6 space-y-8">
            
            {/* General Settings */}
            <section>
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Settings size={16} /> General
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Internal Form Name</label>
                  <input 
                    type="text" 
                    value={config.name}
                    onChange={e => setConfig({...config, name: e.target.value})}
                    className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Lead Gen Form"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Public Form Title</label>
                  <input 
                    type="text" 
                    value={config.title}
                    onChange={e => setConfig({...config, title: e.target.value})}
                    className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                  <textarea 
                    value={config.description}
                    onChange={e => setConfig({...config, description: e.target.value})}
                    className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Submit Button Text</label>
                  <input 
                    type="text" 
                    value={config.submitText}
                    onChange={e => setConfig({...config, submitText: e.target.value})}
                    className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </section>

            <hr className="border-neutral-200" />

            {/* Appearance */}
            <section>
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layout size={16} /> Appearance
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Background</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={config.theme.backgroundColor}
                      onChange={e => setConfig({...config, theme: {...config.theme, backgroundColor: e.target.value}})}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                    <input 
                      type="text" 
                      value={config.theme.backgroundColor}
                      onChange={e => setConfig({...config, theme: {...config.theme, backgroundColor: e.target.value}})}
                      className="flex-1 p-1.5 text-sm border border-neutral-300 rounded-md outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Text Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={config.theme.textColor}
                      onChange={e => setConfig({...config, theme: {...config.theme, textColor: e.target.value}})}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                    <input 
                      type="text" 
                      value={config.theme.textColor}
                      onChange={e => setConfig({...config, theme: {...config.theme, textColor: e.target.value}})}
                      className="flex-1 p-1.5 text-sm border border-neutral-300 rounded-md outline-none"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Primary Color (Buttons, Focus)</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={config.theme.primaryColor}
                      onChange={e => setConfig({...config, theme: {...config.theme, primaryColor: e.target.value}})}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                    <input 
                      type="text" 
                      value={config.theme.primaryColor}
                      onChange={e => setConfig({...config, theme: {...config.theme, primaryColor: e.target.value}})}
                      className="flex-1 p-1.5 text-sm border border-neutral-300 rounded-md outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-neutral-200" />

            {/* Fields */}
            <section>
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layout size={16} /> Form Fields
              </h2>
              
              <div className="space-y-3 mb-4">
                {config.fields.map((field, index) => (
                  <div key={field.id} className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 relative group">
                    <button 
                      onClick={() => removeField(field.id)}
                      className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="pr-8 space-y-3">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-neutral-500 mb-1">Label</label>
                          <input 
                            type="text" 
                            value={field.label}
                            onChange={e => updateField(field.id, { label: e.target.value })}
                            className="w-full p-1.5 text-sm border border-neutral-300 rounded bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <div className="w-24">
                          <label className="block text-xs font-medium text-neutral-500 mb-1">Type</label>
                          <select 
                            value={field.type}
                            onChange={e => updateField(field.id, { type: e.target.value as FieldType })}
                            className="w-full p-1.5 text-sm border border-neutral-300 rounded bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="number">Number</option>
                            <option value="textarea">Textarea</option>
                            <option value="select">Select</option>
                            <option value="checkbox">Checkbox</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id={`req-${field.id}`}
                          checked={field.required}
                          onChange={e => updateField(field.id, { required: e.target.checked })}
                          className="rounded border-neutral-300 text-blue-600"
                        />
                        <label htmlFor={`req-${field.id}`} className="text-xs text-neutral-600">Required field</label>
                      </div>

                      {field.type === 'select' && (
                        <div>
                          <label className="block text-xs font-medium text-neutral-500 mb-1">Options (comma separated)</label>
                          <input 
                            type="text" 
                            value={field.options?.join(', ') || ''}
                            onChange={e => updateField(field.id, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            className="w-full p-1.5 text-sm border border-neutral-300 rounded bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="Option 1, Option 2, Option 3"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => addField('text')} className="p-2 text-sm border border-neutral-200 rounded hover:bg-neutral-50 flex items-center justify-center gap-1"><Plus size={14}/> Text</button>
                <button onClick={() => addField('email')} className="p-2 text-sm border border-neutral-200 rounded hover:bg-neutral-50 flex items-center justify-center gap-1"><Plus size={14}/> Email</button>
                <button onClick={() => addField('textarea')} className="p-2 text-sm border border-neutral-200 rounded hover:bg-neutral-50 flex items-center justify-center gap-1"><Plus size={14}/> Textarea</button>
                <button onClick={() => addField('select')} className="p-2 text-sm border border-neutral-200 rounded hover:bg-neutral-50 flex items-center justify-center gap-1"><Plus size={14}/> Select</button>
                <button onClick={() => addField('checkbox')} className="p-2 text-sm border border-neutral-200 rounded hover:bg-neutral-50 flex items-center justify-center gap-1"><Plus size={14}/> Checkbox</button>
              </div>
            </section>

          </div>
        </aside>
        
        {/* Main Content - Preview */}
        <section className="flex-1 p-8 overflow-y-auto flex flex-col items-center">
          <div className="w-full max-w-2xl mb-4 flex justify-between items-center">
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Live Preview</h2>
            <span className="text-xs text-neutral-400">This is exactly how it will look in the iframe</span>
          </div>
          
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            {previewUrl ? (
              <iframe 
                src={previewUrl} 
                className="w-full min-h-[600px] border-0"
                title="Form Preview"
              />
            ) : (
              <div className="min-h-[600px] flex items-center justify-center text-neutral-400">
                Loading preview...
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
