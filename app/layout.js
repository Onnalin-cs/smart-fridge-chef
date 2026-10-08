
export const metadata = {
  title: 'Smart Fridge Chef',
  description: 'จัดการวัตถุดิบในตู้เย็น และรังสรรค์เมนูอาหารสุดพิเศษด้วย AI',
};
 
export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
