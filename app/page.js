import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Smart Fridge Chef 🍳</h1>
      <p>จัดการวัตถุดิบในตู้เย็น และรังสรรค์เมนูอาหารสุดพิเศษด้วย AI</p>
      
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link href="/fridge" style={buttonStyle}>
          จัดการวัตถุดิบในตู้เย็น (/fridge)
        </Link>
        <Link href="/history" style={{ ...buttonStyle, backgroundColor: '#2e7d32' }}>
          ประวัติสูตรอาหาร (/history)
        </Link>
      </div>
    </main>
  );
}

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#0070f3',
  color: 'white',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 'bold',
};
