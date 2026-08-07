import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import styles from './PortfolioManager.module.css';
import { Plus, Trash2 } from 'lucide-react';

interface PortfolioItem {
  id: string;
  url: string;
  category: string;
  title: string;
}

export function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ url: '', category: 'Wedding', title: '' });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('portfolio').select('*');
    if (error) {
      console.error(error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.url || !newItem.title) return;
    
    const { data, error } = await supabase.from('portfolio').insert([newItem]);
    if (error) {
      console.error('Error adding portfolio item:', error);
    } else if (data) {
      setItems([...items, ...data]);
      setShowAdd(false);
      setNewItem({ url: '', category: 'Wedding', title: '' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this image from portfolio?')) return;
    
    const { error } = await supabase.from('portfolio').delete().eq('id', id);
    if (error) {
      console.error('Error deleting portfolio item:', error);
    } else {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Portfolio Manager</h1>
          <p>Manage the images displayed on the public gallery.</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className={styles.addBtn}>
          <Plus size={18} />
          {showAdd ? 'Cancel' : 'Add New Item'}
        </button>
      </div>

      {showAdd && (
        <form className={styles.addForm} onSubmit={handleAdd}>
          <h3>Add Portfolio Item</h3>
          <div className={styles.inputGroup}>
            <label>Image URL</label>
            <input 
              required
              placeholder="https://example.com/image.jpg"
              value={newItem.url}
              onChange={(e) => setNewItem({...newItem, url: e.target.value})}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Title / Description</label>
              <input 
                required
                placeholder="e.g. Smith Wedding"
                value={newItem.title}
                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Category</label>
              <select 
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
              >
                <option value="Wedding">Wedding</option>
                <option value="Portrait">Portrait</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
          </div>
          <button type="submit" className={styles.submitBtn}>Save Item</button>
        </form>
      )}

      <div className={styles.grid}>
        {loading ? (
          <p>Loading portfolio...</p>
        ) : items.length === 0 ? (
          <p>No portfolio items yet.</p>
        ) : (
          items.map(item => (
            <div key={item.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={item.url} alt={item.title} />
                <button 
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(item.id)}
                  aria-label="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className={styles.cardInfo}>
                <h4>{item.title}</h4>
                <span>{item.category}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
