
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 0; // รับข้อมูลสดใหม่เสมอ

export default async function FridgePage() {
  const { data: items, error } = await supabase
    .from('fridge_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching fridge items:', error);
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>วัตถุดิบในตู้เย็นของคุณ 🥦</h2>
      {items && items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong> ({item.category}) - {item.quantity} {item.unit}
            </li>
          ))}
        </ul>
      ) : (
        <p>ยังไม่มีวัตถุดิบในตู้เย็น</p>
      )}
    </main>
  );
}
