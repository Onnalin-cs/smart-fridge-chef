
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function FridgePage() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState('เนื้อสัตว์')
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState('ชิ้น')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    const { data } = await supabase.from('fridge_items').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }

  async function addItem(e) {
    e.preventDefault()
    if (!name) return
    setLoading(true)
    await supabase.from('fridge_items').insert([{ name, category, quantity: Number(quantity), unit }])
    setName('')
    setQuantity(1)
    setLoading(false)
    fetchItems()
  }

  async function deleteItem(id) {
    await supabase.from('fridge_items').delete().eq('id', id)
    fetchItems()
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🧊 วัตถุดิบในตู้เย็น</h1>
        <Link href="/generate-recipe" style={{ padding: '10px 20px', background: '#10B981', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          🍳 คำนวณเมนูอาหาร
        </Link>
      </header>

      {/* ฟอร์มเพิ่มวัตถุดิบ */}
      <form onSubmit={addItem} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '30px', background: '#F3F4F6', padding: '15px', borderRadius: '8px' }}>
        <input placeholder="ชื่อวัตถุดิบ เช่น หมูสับ" value={name} onChange={e => setName(e.target.value)} style={{ padding: '8px' }} required />
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '8px' }}>
          <option>เนื้อสัตว์</option>
          <option>ผัก</option>
          <option>ไข่และนม</option>
          <option>เครื่องปรุง</option>
          <option>อื่นๆ</option>
        </select>
        <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} style={{ padding: '8px' }} />
        <input placeholder="หน่วย เช่น กรัม/ฟอง" value={unit} onChange={e => setUnit(e.target.value)} style={{ padding: '8px' }} />
        <button type="submit" disabled={loading} style={{ background: '#3B82F6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {loading ? 'บันทึก...' : '+ เพิ่ม'}
        </button>
      </form>

      {/* รายการวัตถุดิบ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
        {items.map(item => (
          <div key={item.id} style={{ border: '1px solid #E5E7EB', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '1.1em' }}>{item.name}</strong>
              <div style={{ fontSize: '0.85em', color: '#6B7280' }}>{item.category} · {item.quantity} {item.unit}</div>
            </div>
            <button onClick={() => deleteItem(item.id)} style={{ background: '#EF4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>ลบ</button>
          </div>
        ))}
      </div>
    </div>
  )
}
