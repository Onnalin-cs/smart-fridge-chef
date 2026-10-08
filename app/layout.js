
export const metadata = {
  title: 'Smart Fridge Chef',
  description: 'ระบบคำนวณและแนะนำเมนูอาหารจากวัตถุดิบในตู้เย็น',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#FAF5FF' }}>
        {children}
      </body>
    </html>
  )
}
