"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';

interface Partner {
  id: string;
  name: string;
  image_url: string;
  link?: string;
  visible?: boolean;
}

const LOCAL_KEY = 'partners_data_v1';

export default function ManagePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  interface PartnerForm { name: string; image_url: string; link: string; visible: boolean }
  const [form, setForm] = useState<PartnerForm>({ name: '', image_url: '', link: '', visible: true });
  const [uploading, setUploading] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [adminKey, setAdminKey] = useState<string | null>(null)
  const [adminInput, setAdminInput] = useState('')

  // load partners (server if adminKey present, otherwise localStorage)
  const loadPartners = async (key?: string | null) => {
    const stored = key ?? (typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null)
    if (stored) {
      try {
        const res = await fetch('/api/admin/partners', { headers: { 'x-admin-api-key': stored } })
        if (res.ok) {
          const j = await res.json()
          if (j && j.partners) {
            setPartners(j.partners)
            return
          }
        } else if (res.status === 401) {
          console.warn('Admin fetch unauthorized; clear admin token or paste valid key.')
        }
      } catch (err) {
        console.warn('Admin partners fetch failed, falling back to localStorage', err)
      }
    }

    try {
      const raw = localStorage.getItem(LOCAL_KEY)
      if (raw) setPartners(JSON.parse(raw))
    } catch (e) {
      console.error('Failed to load partners', e)
    }
  }

  useEffect(() => {
    loadPartners(null)
  }, [])

  const saveAll = (next: Partner[]) => {
    setPartners(next)
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
    } catch (e) {
      console.error('Failed to persist partners', e)
    }

    // attempt to sync to server if admin token is present
    ;(async () => {
      try {
        const keyToUse = adminKey || (typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null)
        if (!keyToUse) return
        for (const p of next) {
          try {
            const isUuid = typeof p.id === 'string' && p.id.length > 8
            if (isUuid) {
              await fetch(`/api/admin/partners?id=${encodeURIComponent(p.id)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-admin-api-key': keyToUse },
                body: JSON.stringify(p),
              })
            } else {
              await fetch(`/api/admin/partners`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-api-key': keyToUse },
                body: JSON.stringify(p),
              })
            }
          } catch (err) {
            console.debug('Partner sync failed for', p.name, err)
          }
        }
      } catch (err) {
        /* ignore sync errors */
      }
    })()
  }

  const addPartner = () => {
    if (!form.name || !form.image_url) return alert('Name and image URL are required');
    const p: Partner = { id: Date.now().toString(), name: form.name, image_url: form.image_url, link: form.link, visible: true };
    const next = [...partners, p];
    saveAll(next);
    setForm({ name: '', image_url: '', link: '', visible: true });
  };

  const deletePartner = (i: number) => {
    if (!confirm('Delete this partner?')) return;
    const idToDelete = partners[i]?.id
    const next = partners.slice(); next.splice(i, 1);
    saveAll(next);
    // attempt server delete if admin token present
    const adminKey = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (adminKey && idToDelete) {
      fetch(`/api/admin/partners?id=${encodeURIComponent(idToDelete)}`, { method: 'DELETE', headers: { 'x-admin-api-key': adminKey } }).catch(() => {})
    }
  };

  const startEdit = (i: number) => {
    setEditingIndex(i);
    const p = partners[i];
    setForm({ name: p.name, image_url: p.image_url, link: p.link || '', visible: p.visible !== false });
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const next = partners.slice();
    next[editingIndex] = { ...next[editingIndex], name: form.name, image_url: form.image_url, link: form.link, visible: form.visible };
    saveAll(next);
    setEditingIndex(null);
    setForm({ name: '', image_url: '', link: '', visible: true });
  };

  const toggleVisibility = (i: number) => {
    const next = partners.slice();
    next[i] = { ...next[i], visible: !next[i].visible };
    saveAll(next);
  };

  const move = (i: number, delta: number) => {
    const j = i + delta;
    if (j < 0 || j >= partners.length) return;
    const next = partners.slice();
    const [item] = next.splice(i, 1);
    next.splice(j, 0, item);
    saveAll(next);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Partners</h2>
      <p className="text-sm text-gray-500 mb-6">Add, edit, reorder and delete partner entries. Images should be hosted or uploaded separately; paste the image URL here.</p>

      <div className="mb-4">
        {adminKey ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-400">Admin key loaded</span>
            <button onClick={() => { localStorage.removeItem('admin_token'); setAdminKey(null); setPartners([]); }} className="px-2 py-1 bg-gray-600 text-white rounded">Clear</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input value={adminInput} onChange={e => setAdminInput(e.target.value)} placeholder="Paste admin key to enable server sync" className="p-2 border rounded bg-[#07102a] text-white placeholder-gray-400 border-gray-600 flex-1" />
            <button onClick={() => { localStorage.setItem('admin_token', adminInput); setAdminKey(adminInput); setAdminInput(''); loadPartners(adminInput); }} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
          </div>
        )}
      </div>

      <div className="border rounded p-4 mb-6">
        <h3 className="font-semibold mb-2">{editingIndex === null ? 'Add Partner' : 'Edit Partner'}</h3>
        <div className="grid grid-cols-1 gap-2">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Display name" className="p-2 border rounded bg-[#07102a] text-white placeholder-gray-400 border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F24DC2]" />
          <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="Image URL" className="p-2 border rounded bg-[#07102a] text-white placeholder-gray-400 border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F24DC2]" />
          {/* File upload: reads file and uploads to Supabase Storage via server endpoint */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (!f) return
                setSelectedFileName(f.name)
                // read as data URL
                const dataUrl = await new Promise<string>((resolve, reject) => {
                  const fr = new FileReader()
                  fr.onload = () => resolve(fr.result as string)
                  fr.onerror = (err) => reject(err)
                  fr.readAsDataURL(f)
                })
                const base64 = dataUrl.split(',')[1]
                const filename = `${Date.now()}_${f.name.replace(/\s+/g, '_')}`
                setUploading(true)
                try {
                  const adminKey = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : ''
                  console.log('[admin/ui] upload handler - adminKey length:', adminKey ? adminKey.length : 0)
                  const res = await fetch('/api/admin/partners/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-admin-api-key': adminKey || '' },
                    body: JSON.stringify({ filename, contentType: f.type, base64 })
                  })
                  if (!res.ok) throw new Error('Upload failed')
                  const j = await res.json()
                  if (j?.url) {
                    setForm({ ...form, image_url: j.url })
                    // show small confirmation
                    // optional: you can auto-save or notify user
                  } else {
                    throw new Error('No url returned')
                  }
                } catch (err) {
                  console.error('Upload error', err)
                  alert('Upload failed')
                } finally {
                  setUploading(false)
                }
              }}
            />
            {uploading ? <span className="text-sm text-gray-400">Uploading...</span> : selectedFileName ? <span className="text-sm text-gray-500">{selectedFileName}</span> : null}
          </div>
          <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="External link (optional)" className="p-2 border rounded bg-[#07102a] text-white placeholder-gray-400 border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F24DC2]" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.visible} onChange={e => setForm({ ...form, visible: e.target.checked })} />
            <span>Visible on site</span>
          </label>
          <div className="flex gap-2">
            {editingIndex === null ? (
              <button onClick={addPartner} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
            ) : (
              <>
                <button onClick={saveEdit} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                <button onClick={() => { setEditingIndex(null); setForm({ name: '', image_url: '', link: '', visible: true }); }} className="px-4 py-2 bg-gray-600 text-white rounded">Cancel</button>
              </>
            )}
            <button onClick={() => { setForm({ name: '', image_url: '', link: '', visible: true }); setEditingIndex(null); }} className="px-4 py-2 bg-gray-600 text-white rounded">Reset</button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {partners.length === 0 && <p className="text-sm text-gray-500">No partners yet.</p>}
        {partners.map((p, i) => (
          <div key={p.id} className="flex items-center gap-4 border rounded p-3 bg-[#07102a] border-gray-700">
            <div className="w-24 h-12 relative">
              {/* thumbnail preview (use img fallback if URL is not external-optimized) */}
              <img src={p.image_url} alt={p.name} style={{ objectFit: 'contain', width: '100%', height: '100%' }} className="rounded bg-white/5 object-contain" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white">{p.name}</div>
              <div className="text-sm text-gray-300">{p.link}</div>
              <div className="text-xs text-gray-400">{p.visible === false ? 'Hidden' : 'Visible'}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-1">
                <button onClick={() => move(i, -1)} className="px-2 py-1 bg-gray-600 text-white rounded">↑</button>
                <button onClick={() => move(i, 1)} className="px-2 py-1 bg-gray-600 text-white rounded">↓</button>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(i)} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
                <button onClick={() => deletePartner(i)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                <button onClick={() => toggleVisibility(i)} className="px-3 py-1 bg-gray-600 text-white rounded">{p.visible === false ? 'Show' : 'Hide'}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
