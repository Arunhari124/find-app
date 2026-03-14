import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageSquare, Heart, CheckCircle, Navigation, ArrowLeft, Send, X, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "../lib/supabase";



export default function Feed() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [likedItems, setLikedItems] = useState({});
  const [showCommentsFor, setShowCommentsFor] = useState(null);
  const [reportedUsers, setReportedUsers] = useState({});

 useEffect(() => {
  fetchItems();
}, []);

async function fetchItems() {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  } else {
    setItems(data);
  }
}

  const toggleLike = (id) => {
    setLikedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSwipe = (id) => {
    // Remove the item from the stack
    setItems(prev => {
      const remainingItems = prev.filter(item => item.id !== id);
      // Loop back to the beginning if we run out of items
      if (remainingItems.length === 0) {
        const savedItems = JSON.parse(localStorage.getItem('find_items') || 'null');
        return savedItems && savedItems.length > 0 ? savedItems : mockItems;
      }
      return remainingItems;
    });
    setShowCommentsFor(null);
  };

  const handleReportUser = (id) => {
    setReportedUsers(prev => ({ ...prev, [id]: true }));
    // In a real app, this would send a report to the backend
  };

  const handleAddComment = (id) => {
    const text = newComment[id];
    if (!text || !text.trim()) return;
    
    const updatedItems = items.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          comments: [...(item.comments || []), { id: Date.now(), user: 'Current User', text: text.trim() }] 
        };
      }
      return item;
    });
    setItems(updatedItems);
    localStorage.setItem('find_items', JSON.stringify(updatedItems));
    setNewComment({ ...newComment, [id]: '' });
  };

  return (
    <div className="page-container" style={{ paddingBottom: '20px', overflow: 'hidden' }}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4" style={{ marginTop: '20px', zIndex: 100 }}>
        <div className="flex items-center">
          <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}>
            <ArrowLeft size={24} color="#fff" />
          </button>
          <div style={{ marginLeft: '16px' }}>
            <h1 style={{ fontSize: '24px', color: '#fff' }}>Discover</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Swipe to view next nearby item</p>
          </div>
        </div>
      </div>

      {/* 3D Stack Container */}
      <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 150px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        {items.length === 0 && (
           <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
             <h3>Loading nearby items...</h3>
           </div>
        )}

        <AnimatePresence>
          {items.map((item, index) => {
            // Only render top 3 cards for performance and visual clarity
            if (index > 2) return null;
            
            const isTop = index === 0;

            return (
              <motion.div
                key={item.id}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  maxHeight: '650px',
                  maxWidth: '450px',
                  backgroundColor: 'var(--surface)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${item.type === 'Lost' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                  borderRadius: 'var(--border-radius-lg)',
                  boxShadow: isTop ? 'var(--surface-glow)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  zIndex: items.length - index,
                  transformOrigin: 'bottom center'
                }}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{
                  opacity: 1 - index * 0.15,
                  y: index * 20, // Offset down
                  scale: 1 - index * 0.05, // Scale down
                }}
                exit={{ x: -500, opacity: 0, rotate: -20, transition: { duration: 0.3 } }}
                drag={isTop ? "x" : false} // Only top card is draggable
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipeThreshold = 100;
                  if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > 500) {
                    handleSwipe(item.id);
                  }
                }}
                whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
              >
                
                {/* Card Image Area (Gradient Placeholder) */}
                <div style={{ 
                  flex: '0 0 45%', 
                  background: item.type === 'Lost' ? 'linear-gradient(to bottom, rgba(239, 68, 68, 0.2), transparent)' : 'linear-gradient(to bottom, rgba(16, 185, 129, 0.2), transparent)',
                  display: 'flex', 
                  flexDirection: 'column',
                  padding: '20px',
                  position: 'relative'
                }}>
                   <span style={{ 
                      alignSelf: 'flex-start',
                      padding: '6px 16px', 
                      borderRadius: '20px', 
                      fontSize: '14px', 
                      fontWeight: 'bold',
                      backgroundColor: item.type === 'Lost' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: item.type === 'Lost' ? '#ef4444' : '#10b981',
                      border: `1px solid ${item.type === 'Lost' ? '#ef4444' : '#10b981'}`
                    }}>
                      {item.status.toUpperCase()}
                   </span>
                   {isTop && (
                     <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '15px', fontSize: '12px' }}>
                       Swipe to dismiss ↔️
                     </div>
                   )}
                </div>
                
                {/* Details Area */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 5px 0' }}>{item.name}</h3>
                      <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        <span style={{ fontWeight: 500 }}>{item.userName}</span>
                        {item.verified && <CheckCircle size={14} color="var(--primary)" />}
                        <span>•</span>
                        <span>{item.category}</span>
                      </div>
                    </div>
                    {/* Report User Button */}
                    <button 
                      onClick={() => handleReportUser(item.id)}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer',
                        color: reportedUsers[item.id] ? '#ef4444' : 'var(--text-secondary)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        fontSize: '10px',
                        gap: '2px'
                      }}
                      title="Report User"
                    >
                      <Flag size={18} fill={reportedUsers[item.id] ? "#ef4444" : "none"} />
                      {reportedUsers[item.id] ? 'Reported' : 'Report'}
                    </button>
                  </div>

                  {item.matchAlert && (
                    <div style={{ 
                      margin: '15px 0', padding: '12px', 
                      backgroundColor: 'rgba(59, 130, 246, 0.15)', border: '1px solid var(--primary)', borderRadius: 'var(--border-radius-md)',
                      display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                      <Navigation size={18} color="var(--primary)" />
                      <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>Smart Match found nearby!</span>
                    </div>
                  )}

                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, margin: '15px 0', flex: 1, overflowY: 'auto' }}>
                    {item.desc}
                  </p>

                  {/* Actions Row */}
                  <div className="flex justify-between items-center" style={{ marginTop: 'auto', gap: '10px' }}>
                    <button className="neo-button" style={{ flex: 1, padding: '12px' }} onClick={() => setShowCommentsFor(showCommentsFor === item.id ? null : item.id)}>
                      <MessageSquare size={20} color={showCommentsFor === item.id ? 'var(--primary)' : 'var(--text-primary)'} />
                    </button>
                    <a href={`https://wa.me/${item.phone}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'flex' }}>
                      <button className="neo-button" style={{ width: '100%', padding: '12px', background: 'rgba(37, 211, 102, 0.1)', borderColor: 'rgba(37, 211, 102, 0.3)' }}>
                        <Send size={20} color="#25D366" />
                      </button>
                    </a>
                    <button className="neo-button" style={{ flex: 1, padding: '12px' }} onClick={() => toggleLike(item.id)}>
                      <Heart size={20} color={likedItems[item.id] ? "#ef4444" : "var(--text-primary)"} fill={likedItems[item.id] ? "#ef4444" : "none"} />
                    </button>
                  </div>
                  
                </div>

                {/* Sliding Comments Section */}
                <AnimatePresence>
                  {showCommentsFor === item.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ 
                        position: 'absolute', bottom: 0, left: 0, width: '100%', 
                        background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)',
                        borderTop: '1px solid var(--surface-border)', zIndex: 10,
                        padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px'
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <h4 style={{ margin: 0 }}>Comments ({item.comments?.length || 0})</h4>
                        <button onClick={() => setShowCommentsFor(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
                      </div>
                      
                      <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {item.comments && item.comments.length > 0 ? item.comments.map(c => (
                          <div key={c.id} style={{ fontSize: '13px', background: 'rgba(255,255,255,0.05)', padding: '10px 14px', borderRadius: '12px' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--primary)', marginRight: '6px' }}>{c.user}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{c.text}</span>
                          </div>
                        )) : <div style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', margin: '10px 0' }}>No comments yet.</div>}
                      </div>

                      <div className="flex gap-2">
                        <input 
                          type="text" placeholder="Add a comment..." className="neo-input" 
                          style={{ padding: '12px', fontSize: '14px' }}
                          value={newComment[item.id] || ''}
                          onChange={(e) => setNewComment({ ...newComment, [item.id]: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddComment(item.id)}
                        />
                        <button className="neo-button primary" style={{ padding: '0 20px' }} onClick={() => handleAddComment(item.id)}>Post</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
