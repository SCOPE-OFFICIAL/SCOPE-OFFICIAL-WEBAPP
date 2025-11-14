"use client"

import React, { useEffect, useState, useRef } from 'react'

interface TypeaheadProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  fetchUrl?: string
}

export default function Typeahead({ value, onChange, placeholder = '', fetchUrl = '/api/gallery/folders?visible=true' }: TypeaheadProps) {
  const [options, setOptions] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value || '')
  const [highlight, setHighlight] = useState(0)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let mounted = true
    fetch(fetchUrl)
      .then(r => r.json())
      .then(json => {
        if (!mounted) return
        setOptions(json.folders || [])
      })
      .catch(err => {
        console.warn('Typeahead fetch failed', err)
      })
    return () => { mounted = false }
  }, [fetchUrl])

  useEffect(() => {
    setQuery(value || '')
  }, [value])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()))

  function commit(v: string) {
    onChange(v)
    setQuery(v)
    setOpen(false)
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); onChange(e.target.value) }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault(); setHighlight(h => Math.min(h + 1, filtered.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault(); setHighlight(h => Math.max(h - 1, 0))
          } else if (e.key === 'Enter') {
            e.preventDefault(); if (filtered[highlight]) commit(filtered[highlight])
          } else if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
      />

      {open && filtered.length > 0 && (
        <div className="absolute z-40 left-0 right-0 mt-1 bg-[#0b0f1a] border border-white/10 rounded-lg shadow-lg max-h-56 overflow-auto">
          {filtered.map((opt, idx) => (
            <div
              key={opt}
              onMouseDown={(e) => { e.preventDefault(); commit(opt) }}
              onMouseEnter={() => setHighlight(idx)}
              className={`px-4 py-3 cursor-pointer text-sm ${idx === highlight ? 'bg-white/5' : ''} text-white`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
