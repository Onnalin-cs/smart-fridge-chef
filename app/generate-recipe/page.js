'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function GenerateRecipePage() {
  const [items, setItems] = useState([])
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    const { data } = await supabase.from('fridge_items').select('*')
    setItems(data || [])
  }

  async function generateRecipe() {
    if (items.length === 0) return alert('โปรดเพิ่มวัตถุดิบในตู้เย็นก่อนครับ')
    setLoading(true)
    setRecipe(null)

    const ingredientList = items.map(i => `${i.name} (${i.quantity} ${i.unit})`).join(', ')
    const prompt = `มีวัตถุดิบในตู้เย็นดังนี้: ${ingredientList} 
ช่วยคำนวณและสร้างเมนูอาหาร 1 เมนูที่ทำได้จริง โดยตอบกลับเป็น JSON Structure รูปแบบนี้เท่านั้น ห้ามใส่ข้อความอื่นนอกเหนือจาก JSON:
{
  "recipe_name": "ชื่อเมนู",
  "ingredients_used": ["รายการวัตถุดิบที่ใช้ 1", "รายการวัตถุดิบที่ใช้ 2"],
  "instructions": ["ขั้นตอนการทำ 1", "ขั้นตอนการทำ 2"]
}`

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      })

      const data = await res.json()
      const rawText = data.candidates[0].content.parts[0].text
      const cleanJson = rawText.replace(/```json|```/g, '').trim()
      const parsedRecipe = JSON.parse(cleanJson)
      setRecipe(parsedRecipe)
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการประมวลผล AI โปรดลองใหม่อีกครั้ง')
    } finally {
      setLoading(false)
    }
  }

  async function cookRecipe() {
    if (!recipe) return
    await supabase.from('recipe_history').insert([{
      recipe_name: recipe.recipe_name,
      ingredients_used: recipe.ingredients_used,
      instructions: recipe.instructions
    }])

    for (const ingName of recipe.ingredients_used) {
      const target = items.find(i => ingName.includes(i.name))
      if (target) {
        await supabase.from('fridge_items').delete().eq('id', target.id)
      }
    }

    alert('บันทึกการทำอาหารเรียบร้อยแล้ว!')
    router.push('/history')
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <Link href="/fridge" style={{ textDecoration: 'none', color: '#3B82F6' }}>← กลับไปตู้เย็น</Link>
      <h1 style={{ marginTop: '10px' }}>✨ AI คำนวณเมนูอาหาร</h1>

      <div style={{ background: '#F3F4F6', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <strong>วัตถุดิบที่มีอยู่ตอนนี้:</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
          {items.map(i => (
            <span key={i.id} style={{ background: '#E5E7EB', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9em' }}>
              {i.name}
            </span>
          ))}
        </div>
      </div>

      <button onClick={generateRecipe} disabled={loading} style={{ width: '100%', padding: '12px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1em', cursor: 'pointer', fontWeight: 'bold' }}>
        {loading ? '🤖 กำลังประมวลผลคำนวณเมนู...' : '🍳 ให้ AI คิดเมนูจากวัตถุดิบ'}
      </button>

      {recipe && (
        <div style={{ marginTop: '30px', border: '2px solid #10B981', padding: '20px', borderRadius: '8px', background: '#ECFDF5' }}>
          <h2>🍲 {recipe.recipe_name}</h2>
          <h3>วัตถุดิบที่ใช้:</h3>
          <ul>
            {recipe.ingredients_used.map((ing, idx) => <li key={idx}>{ing}</li>)}
          </ul>
          <h3>ขั้นตอนการทำ:</h3>
          <ol>
            {recipe.instructions.map((step, idx) => <li key={idx} style={{ marginBottom: '5px' }}>{step}</li>)}
          </ol>

          <button onClick={cookRecipe} style={{ marginTop: '15px', width: '100%', padding: '10px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1em', cursor: 'pointer' }}>
            ✅ ลงมือทำเมนูนี้ (เคลียร์วัตถุดิบออกจากตู้)
          </button>
        </div>
      )}
    </div>
  )
}
