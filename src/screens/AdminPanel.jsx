import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Trash2, Edit3, CheckCircle, AlertTriangle, ArrowLeft, Save } from 'lucide-react';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    const savedItems = JSON.parse(localStorage.getItem('find_items') || '[]');
    setItems(savedItems);
  };

  const saveItems = (newItems) => {
    setItems(newItems);
    localStorage.setItem('find_items', JSON.stringify(newItems));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      saveItems(items.filter(item => item.id !== id));
    }
  };

  const handleVerify = (id, status) => {
    saveItems(items.map(item => item.id === id ? { ...item, aiStatus: status, verified: status === 'verified' } : item));
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const saveEdit = () => {
    saveItems(items.map(item => item.id === editingId ? editForm : item));
    setEditingId(null);
  };

  return (
    <div className="page-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', background: 'var(--bg-gradient)' }}>
      
      <div className="flex items-center justify-between mb-8" style={{ marginTop: '20px' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}>
            <ArrowLeft size={24} color="#fff" />
          </button>
          <Shield size={32} color="var(--primary)" />
          <h1 style={{ fontSize: '28px', color: '#fff' }}>Admin Dashboard</h1>
        </div>
      </div>

      <div className="neo-card" style={{ padding: '20px', overflowX: 'auto', background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
              <th style={{ padding: '15px' }}>ID</th>
              <th style={{ padding: '15px' }}>Type</th>
              <th style={{ padding: '15px' }}>Item Name</th>
              <th style={{ padding: '15px' }}>User</th>
              <th style={{ padding: '15px' }}>Verification Status</th>
              <th style={{ padding: '15px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {editingId === item.id ? (
                  // Edit Mode
                  <>
                    <td style={{ padding: '15px', color: 'var(--text-secondary)' }}>{item.id}</td>
                    <td style={{ padding: '15px' }}>
                      <select value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})} className="neo-input" style={{ padding: '8px' }}>
                        <option value="Lost">Lost</option>
                        <option value="Found">Found</option>
                      </select>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="neo-input" style={{ padding: '8px' }} />
                    </td>
                    <td style={{ padding: '15px' }}>
                      <input type="text" value={editForm.userName} onChange={e => setEditForm({...editForm, userName: e.target.value})} className="neo-input" style={{ padding: '8px' }} />
                    </td>
                    <td style={{ padding: '15px' }}>
                      <select value={editForm.aiStatus || 'verified'} onChange={e => setEditForm({...editForm, aiStatus: e.target.value, verified: e.target.value === 'verified'})} className="neo-input" style={{ padding: '8px' }}>
                        <option value="pending">Pending AI Review</option>
                        <option value="verified">Verified</option>
                        <option value="flagged">Flagged (Fake)</option>
                      </select>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="neo-button" style={{ padding: '8px' }}><Save size={16} color="var(--found-color)" /></button>
                        <button onClick={() => setEditingId(null)} className="neo-button" style={{ padding: '8px' }}><X size={16} color="var(--text-secondary)" /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  // View Mode
                  <>
                    <td style={{ padding: '15px', color: 'var(--text-secondary)' }}>{item.id}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold',
                        backgroundColor: item.type === 'Lost' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: item.type === 'Lost' ? '#ef4444' : '#10b981'
                      }}>
                        {item.type}
                      </span>
                    </td>
                    <td style={{ padding: '15px', fontWeight: '500' }}>{item.name}</td>
                    <td style={{ padding: '15px', color: 'var(--text-secondary)' }}>{item.userName}</td>
                    <td style={{ padding: '15px' }}>
                      {item.aiStatus === 'pending' ? (
                        <span style={{ color: '#eab308', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={16}/> Pending</span>
                      ) : item.aiStatus === 'flagged' ? (
                        <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={16}/> Flagged</span>
                      ) : (
                        <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={16}/> Verified</span>
                      )}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div className="flex gap-2">
                        {item.aiStatus === 'pending' && (
                          <button onClick={() => handleVerify(item.id, 'verified')} className="neo-button" style={{ padding: '8px' }} title="Mark as Verified">
                            <CheckCircle size={16} color="var(--found-color)" />
                          </button>
                        )}
                        <button onClick={() => startEdit(item)} className="neo-button" style={{ padding: '8px' }} title="Edit Post">
                          <Edit3 size={16} color="var(--primary)" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="neo-button" style={{ padding: '8px' }} title="Delete Post">
                          <Trash2 size={16} color="var(--lost-color)" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No items found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
