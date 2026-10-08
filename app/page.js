import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2.5em', color: '#10B981' }}>🍳 Smart Fridge Chef</h1>
      <p style={{ color: '#4B5563', fontSize: '1.1em', marginBottom: '30px' }}>
        จัดการวัตถุดิบในตู้เย็น และรังสรรค์เมนูอาหารสุดพิเศษด้วย AI
      </p>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <Link href="/fridge" style={{ padding: '12px 24px', background: '#3B82F6', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          🧊 ไปที่ตู้เย็นของฉัน (/fridge)
        </Link>
        <Link href="/history" style={{ padding: '12px 24px', background: '#2E7D32', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          📜 ประวัติสูตรอาหาร (/history)
        </Link>
      </div>
    </div>
  )
}
