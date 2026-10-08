'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function HistoryPage() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetchHistory()
  }, [])

  async function fetchHistory() {
    const { data } = await supabase.from('recipe_history').select('*').order('created_at', { ascending: false })
    setHistory(data || [])
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <Link href="/fridge" style={{ textDecoration: 'none', color: '#3B82F6' }}>← กลับไปตู้เย็น</Link>
      <h1 style={{ marginTop: '10px' }}>📜 ประวัติการประกอบอาหาร</h1>

      <div style={{ background: '#FEF3C7', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: '#92400E' }}>
        🌱 <strong>Food Waste Saved:</strong> คุณประกอบอาหารและเคลียร์วัตถุดิบไปแล้วทั้งหมด <strong>{history.length}</strong> เมนู!
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {history.map(item => (
          <div key={item.id} style={{ border: '1px solid #E5E7EB', padding: '15px', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>🍲 {item.recipe_name}</h3>
            <div style={{ fontSize: '0.85em', color: '#6B7280', marginBottom: '10px' }}>
              ทำเมื่อ: {new Date(item.created_at).toLocaleString('th-TH')}
            </div>
            <strong>วัตถุดิบที่นำมาใช้:</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
              {Array.isArray(item.ingredients_used) && item.ingredients_used.map((ing, idx) => (
                <span key={idx} style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85em' }}>
                  {ing}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
