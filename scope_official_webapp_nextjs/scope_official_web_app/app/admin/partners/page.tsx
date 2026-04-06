"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  buildLoginHref,
  clearAdminSession,
  getAdminToken,
  resolveAdminSession,
  storePostLoginRedirect
} from '@/app/admin/utils/auth';

interface Partner {
  id: string;
  name: string;
  image_url: string;
  link?: string;
  visible?: boolean;
}

interface PartnerForm { 
  name: string; 
  image_url: string; 
  link: string; 
  visible: boolean;
  imagePreview?: string;
}

export default function ManagePartners() {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<PartnerForm>({ name: '', image_url: '', link: '', visible: true });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const redirectToLogin = (path = '/admin/partners') => {
    storePostLoginRedirect(path);
    router.replace(buildLoginHref(path));
  };

  const getAuthHeaders = () => {
    const token = getAdminToken();
    if (!token) return null;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const loadPartners = async () => {
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    try {
      const authenticated = await resolveAdminSession(8000);
      if (!authenticated) {
        console.warn('[partners] auth check failed, redirecting to login');
        clearAdminSession();
        redirectToLogin('/admin/partners');
        return;
      }

      const headers = getAuthHeaders();
      if (!headers) {
        console.warn('[partners] no auth headers after session resolve');
        redirectToLogin('/admin/partners');
        return;
      }

      const res = await fetch('/api/admin/partners', {
        headers,
        credentials: 'include',
        cache: 'no-store',
        signal: controller.signal
      });
      console.log('[partners] GET /api/admin/partners status', res.status);

      if (res.ok) {
        const data = await res.json();
        if (data && data.partners) {
          setPartners(data.partners);
        }
      } else if (res.status === 401) {
        console.warn('Session expired, redirecting to login');
        clearAdminSession();
        redirectToLogin('/admin/partners');
      }
    } catch (err) {
      console.error('Failed to load partners', err);
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addPartner = async () => {
    if (!form.name || !form.image_url) {
      alert('⚠️ Name and image URL are required');
      return;
    }

    const headers = getAuthHeaders();
    if (!headers) return;

    const newPartner = {
      name: form.name,
      image_url: form.image_url,
      link: form.link,
      visible: form.visible,
      sort_order: partners.length
    };

    console.log('[addPartner] Adding:', newPartner);

    try {
      const res = await fetch('/api/admin/partners', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(newPartner)
      });

      const data = await res.json();
      console.log('[addPartner] Response:', res.status, data);

      if (res.ok) {
        await loadPartners();
        setForm({ name: '', image_url: '', link: '', visible: true });
        alert('✅ Partner added successfully!');
      } else {
        console.error('[addPartner] Failed:', data);
        alert(`❌ Failed to add partner: ${data.error || 'Unknown error'}\n${data.details || ''}`);
      }
    } catch (err) {
      console.error('[addPartner] Unexpected error:', err);
      alert(`❌ Failed to add partner: ${err}`);
    }
  };

  const deletePartner = async (id: string, index: number) => {
    if (!confirm('Delete this partner?')) return;

    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const res = await fetch(`/api/admin/partners?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      });

      if (res.ok) {
        const next = partners.filter((_, i) => i !== index);
        setPartners(next);
      } else {
        alert('Failed to delete partner');
      }
    } catch (err) {
      console.error('Delete error', err);
      alert('Failed to delete partner');
    }
  };

  const startEdit = (i: number) => {
    setEditingIndex(i);
    const p = partners[i];
    setForm({ 
      name: p.name, 
      image_url: p.image_url, 
      link: p.link || '', 
      visible: p.visible !== false,
      imagePreview: p.image_url
    });

    // Scroll the page to top so the edit form is visible to the user
    if (typeof window !== 'undefined' && window.scrollTo) {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        // fallback for older browsers
        window.scrollTo(0, 0);
      }
    }
  };

  const saveEdit = async () => {
    if (editingIndex === null) return;

    const headers = getAuthHeaders();
    if (!headers) return;

    const partner = partners[editingIndex];
    const updates = {
      name: form.name,
      image_url: form.image_url,
      link: form.link,
      visible: form.visible
    };

    console.log('[saveEdit] Updating partner:', partner.id, updates);

    try {
      const res = await fetch(`/api/admin/partners?id=${encodeURIComponent(partner.id)}`, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: JSON.stringify(updates)
      });

      const data = await res.json();
      console.log('[saveEdit] Response:', res.status, data);

      if (res.ok) {
        // Reload partners from server to get fresh data
        await loadPartners();
        setEditingIndex(null);
        setForm({ name: '', image_url: '', link: '', visible: true });
        alert('✅ Partner updated successfully!');
      } else {
        console.error('[saveEdit] Failed:', data);
        alert(`❌ Failed to update partner: ${data.error || 'Unknown error'}\n${data.details || ''}`);
      }
    } catch (err) {
      console.error('[saveEdit] Unexpected error:', err);
      alert(`❌ Failed to update partner: ${err}`);
    }
  };

  const toggleVisibility = async (id: string, currentVisible: boolean) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    console.log('[toggleVisibility] Toggling:', id, 'from', currentVisible, 'to', !currentVisible);

    try {
      const res = await fetch(`/api/admin/partners?id=${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: JSON.stringify({ visible: !currentVisible })
      });

      const data = await res.json();
      console.log('[toggleVisibility] Response:', res.status, data);

      if (res.ok) {
        // Reload all partners to ensure consistency
        await loadPartners();
      } else {
        console.error('[toggleVisibility] Failed:', data);
        alert(`Failed to toggle visibility: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('[toggleVisibility] Unexpected error:', err);
      alert(`Failed to toggle visibility: ${err}`);
    }
  };

  const move = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= partners.length) return;

    const next = [...partners];
    const [item] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, item);
    
    // Optimistically update UI
    setPartners(next);

    const headers = getAuthHeaders();
    if (!headers) return;

    console.log('[move] Reordering partners...');

    try {
      // Update sort_order for all partners in parallel
      await Promise.all(
        next.map((partner, i) =>
          fetch(`/api/admin/partners?id=${encodeURIComponent(partner.id)}`, {
            method: 'PATCH',
            headers,
            credentials: 'include',
            body: JSON.stringify({ sort_order: i })
          })
        )
      );
      
      console.log('[move] Reorder complete, reloading...');
      // Reload to ensure consistency
      await loadPartners();
    } catch (err) {
      console.error('[move] Reorder failed:', err);
      // Reload to revert to server state
      await loadPartners();
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    
    try {
      const token = getAdminToken();
      const uploadHeaders: HeadersInit = {};
      if (token) {
        uploadHeaders.Authorization = `Bearer ${token}`;
      }

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/partners/upload', {
        method: 'POST',
        headers: uploadHeaders,
        credentials: 'include',
        body: formData
      });

      if (!res.ok) {
        const failure = await res.json().catch(() => null);
        throw new Error(failure?.error || 'Upload failed');
      }

      const data = await res.json();
      if (data?.url) {
        setForm({ ...form, image_url: data.url, imagePreview: data.url });
      } else {
        throw new Error('No URL returned');
      }
    } catch (err) {
      console.error('Upload error', err);
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      alert(message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#040a28] via-[#0d1b3d] to-[#040a28] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#F24DC2] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040a28] via-[#0d1b3d] to-[#040a28] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back to Dashboard Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] mb-2">
            Manage Partners
          </h1>
          <p className="text-gray-400">Add, edit, and manage partner logos for the website carousel</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">
            {editingIndex === null ? '➕ Add New Partner' : '✏️ Edit Partner'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Partner Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., IEEE, Google, Microsoft" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F24DC2] focus:border-transparent transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Website Link (Optional)</label>
                <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://example.com" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C97FF] focus:border-transparent transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Upload Logo *</label>
                <div className="relative">
                  <input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) handleFileUpload(file); }} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[#F24DC2] file:to-[#2C97FF] file:text-white hover:file:opacity-80 cursor-pointer" disabled={uploading} />
                  {uploading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-[#F24DC2] border-t-transparent rounded-full" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Recommended: PNG with transparent background, max 200KB</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="visible" checked={form.visible} onChange={e => setForm({ ...form, visible: e.target.checked })} className="w-5 h-5 rounded border-white/10 bg-white/5 text-[#F24DC2] focus:ring-2 focus:ring-[#F24DC2] cursor-pointer" />
                <label htmlFor="visible" className="text-sm text-gray-300 cursor-pointer">Show on website</label>
              </div>

              <div className="flex gap-3 pt-2">
                {editingIndex === null ? (
                  <button onClick={addPartner} disabled={uploading || !form.name || !form.image_url} className="flex-1 px-6 py-3 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    ➕ Add Partner
                  </button>
                ) : (
                  <>
                    <button onClick={saveEdit} disabled={uploading} className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50">
                      ✓ Save Changes
                    </button>
                    <button onClick={() => { setEditingIndex(null); setForm({ name: '', image_url: '', link: '', visible: true }); }} className="px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all">
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full aspect-video bg-white/5 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center overflow-hidden">
                {form.imagePreview || form.image_url ? (
                  <div className="relative w-full h-full p-8 flex items-center justify-center">
                    <img src={form.imagePreview || form.image_url} alt="Preview" className="max-w-full max-h-full object-contain" />
                    <div className="absolute bottom-2 right-2 bg-black/70 px-3 py-1 rounded-full text-xs text-white">Preview</div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm">Upload an image to see preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">📋 Partner List ({partners.length})</h2>

          {partners.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
              <p className="text-gray-400 text-lg">No partners yet. Add your first partner above!</p>
            </div>
          ) : (
            partners.map((partner, i) => (
              <motion.div key={partner.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-[#F24DC2]/50 transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-32 h-20 bg-white/10 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                    <img src={partner.image_url} alt={partner.name} className="max-w-full max-h-full object-contain" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">{partner.name}</h3>
                    {partner.link && <p className="text-sm text-[#2C97FF] truncate">{partner.link}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${partner.visible !== false ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {partner.visible !== false ? '👁️ Visible' : '🙈 Hidden'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button onClick={() => move(i, i - 1)} disabled={i === 0} className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed" title="Move up">↑</button>
                      <button onClick={() => move(i, i + 1)} disabled={i === partners.length - 1} className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed" title="Move down">↓</button>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(i)} className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium">✏️ Edit</button>
                      <button onClick={() => toggleVisibility(partner.id, partner.visible !== false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all text-sm font-medium">{partner.visible !== false ? '🙈' : '👁️'}</button>
                      <button onClick={() => deletePartner(partner.id, i)} className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium">🗑️</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
