```
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
    const { data } = await supabase
      .from('fridge_items')
      .select('*')

    setItems(data || [])
  }

  async function generateRecipe() {
    if (items.length === 0) {
      alert('โปรดเพิ่มวัตถุดิบในตู้เย็นก่อนครับ')
      return
    }

    setLoading(true)
    setRecipe(null)

    const ingredientList = items
      .map(i => `${i.name} (${i.quantity} ${i.unit})`)
      .join(', ')

    const prompt = `
มีวัตถุดิบในตู้เย็นดังนี้:
${ingredientList}

ช่วยคิดเมนูอาหาร 1 เมนูที่ทำได้จริง

ตอบกลับเป็น JSON เท่านั้น ห้ามมีข้อความอื่น
โครงสร้างต้องเป็น:

{
  "recipe_name": "ชื่อเมนู",
  "ingredients_used": [
    "วัตถุดิบที่ใช้"
  ],
  "instructions": [
    "ขั้นตอนที่ 1",
    "ขั้นตอนที่ 2",
    "ขั้นตอนที่ 3"
  ]
}

พยายามใช้วัตถุดิบที่มีอยู่ให้มากที่สุด
`

    try {
      const res = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        alert(data.error || 'เกิดข้อผิดพลาดจาก Gemini')
        return
      }

      const rawText = data.text
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)

      if (!jsonMatch) {
        throw new Error('AI ไม่ได้ส่ง JSON กลับมา')
      }

      const parsedRecipe = JSON.parse(jsonMatch[0])

      setRecipe(parsedRecipe)
    } catch (error) {
      console.error(error)
      alert('เกิดข้อผิดพลาดในการสร้างเมนู กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  async function cookRecipe() {
    if (!recipe) return

    await supabase
      .from('recipe_history')
      .insert([{
        recipe_name: recipe.recipe_name,
        ingredients_used: recipe.ingredients_used,
        instructions: recipe.instructions
      }])

    for (const ingName of recipe.ingredients_used) {
      const target = items.find(
        i =>
          ingName.includes(i.name) ||
          i.name.includes(ingName)
      )

      if (target) {
        await supabase
          .from('fridge_items')
          .delete()
          .eq('id', target.id)
      }
    }

    alert('บันทึกการทำอาหารเรียบร้อยแล้ว!')
    router.push('/history')
  }

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'sans-serif'
      }}
    >
      <Link
        href="/fridge"
        style={{
          textDecoration: 'none',
          color: '#3B82F6'
        }}
      >
        ← กลับไปตู้เย็น
      </Link>

      <h1 style={{ marginTop: '10px' }}>
        ✨ AI คำนวณเมนูอาหาร
      </h1>

      <div
        style={{
          background: '#F3F4F6',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}
      >
        <strong>วัตถุดิบที่มีอยู่ตอนนี้:</strong>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '10px'
          }}
        >
          {items.map(i => (
            <span
              key={i.id}
              style={{
                background: '#E5E7EB',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.9em'
              }}
            >
              {i.name}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={generateRecipe}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          background: loading ? '#9CA3AF' : '#10B981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1.1em',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold'
        }}
      >
        {loading
          ? '🤖 กำลังประมวลผล...'
          : '🍳 ให้ AI คิดเมนูจากวัตถุดิบ'}
      </button>

      {recipe && (
        <div
          style={{
            marginTop: '30px',
            border: '2px solid #10B981',
            padding: '20px',
            borderRadius: '8px',
            background: '#ECFDF5'
          }}
        >
          <h2>🍲 {recipe.recipe_name}</h2>

          <h3>วัตถุดิบที่ใช้:</h3>

          <ul>
            {recipe.ingredients_used.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>

          <h3>ขั้นตอนการทำ:</h3>

          <ol>
            {recipe.instructions.map((step, idx) => (
              <li
                key={idx}
                style={{ marginBottom: '5px' }}
              >
                {step}
              </li>
            ))}
          </ol>

          <button
            onClick={cookRecipe}
            style={{
              marginTop: '15px',
              width: '100%',
              padding: '10px',
              background: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1em',
              cursor: 'pointer'
            }}
          >
            ✅ ลงมือทำเมนูนี้ (เคลียร์วัตถุดิบออกจากตู้)
          </button>
        </div>
      )}
    </div>
  )
}
```

```
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { prompt } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ไม่พบ GEMINI_API_KEY ใน Vercel' },
        { status: 500 }
      )
    }

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      }
    )

    const data = await response.json()

    if (!response.ok || data.error) {
      return NextResponse.json(
        {
          error: data.error?.message || 'Gemini API Error'
        },
        { status: response.status || 500 }
      )
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return NextResponse.json(
        { error: 'Gemini ไม่ส่งผลลัพธ์กลับมา' },
        { status: 500 }
      )
    }

    return NextResponse.json({ text })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: error.message || 'เกิดข้อผิดพลาด'
      },
      { status: 500 }
    )
  }
}
```
