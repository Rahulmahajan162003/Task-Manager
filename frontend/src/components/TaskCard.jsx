import React, { useContext, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Calendar, User, FolderDot, Trash2, Edit2, X, Check } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const TaskCard = ({ task, token, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-progress';
      case 'Completed': return 'status-completed';
      case 'Overdue': return 'status-overdue';
      default: return '';
    }
  };

  const handleStatusChange = async (e) => {
    const loadingToast = toast.loading('Updating status...');
    try {
      await axios.put(`/api/tasks/${task._id}`, 
        { status: e.target.value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Status updated', { id: loadingToast });
      onUpdate();
    } catch (err) {
      toast.error('Failed to update status', { id: loadingToast });
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    const loadingToast = toast.loading('Deleting task...');
    try {
      await axios.delete(`/api/tasks/${task._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Task deleted', { id: loadingToast });
      onUpdate();
    } catch (err) {
      toast.error('Failed to delete task', { id: loadingToast });
    }
  };

  const handleSaveEdit = async () => {
    const loadingToast = toast.loading('Saving changes...');
    try {
      await axios.put(`/api/tasks/${task._id}`, 
        { title: editTitle, description: editDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Task updated', { id: loadingToast });
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      toast.error('Failed to update task', { id: loadingToast });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.98 }}
      layout
      className="glass-panel" 
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}
    >
      <div>
        <div className="flex justify-between items-center mb-4">
          {isEditing ? (
            <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ margin: 0, padding: '4px 8px', width: '60%' }} />
          ) : (
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{task.title}</h3>
          )}
          
          <div className="flex items-center gap-2">
            <span className={`status-badge ${getStatusClass(task.status)}`}>{task.status}</span>
            {user.role === 'Admin' && !isEditing && (
              <>
                <button onClick={() => setIsEditing(true)} className="action-btn"><Edit2 size={14} /></button>
                <button onClick={handleDelete} className="action-btn" style={{ color: 'var(--danger-color)' }}><Trash2 size={14} /></button>
              </>
            )}
            {user.role === 'Admin' && isEditing && (
              <>
                <button onClick={handleSaveEdit} className="action-btn" style={{ color: 'var(--success-color)' }}><Check size={16} /></button>
                <button onClick={() => setIsEditing(false)} className="action-btn"><X size={16} /></button>
              </>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={2} style={{ marginTop: '8px', padding: '4px 8px' }} />
        ) : (
          <p style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>
            {task.description || 'No description provided.'}
          </p>
        )}

        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {task.project && (
            <div className="flex items-center gap-2" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <FolderDot size={14} />
              <span>{task.project.title}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Calendar size={14} />
            <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <div className="flex items-center gap-2" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <User size={14} />
            <span>{task.assignedTo ? task.assignedTo.name : 'Unassigned'}</span>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--panel-border)' }}>
        <select value={task.status} onChange={handleStatusChange} style={{ marginBottom: 0, cursor: 'pointer', background: 'transparent', border: '1px solid var(--panel-border)' }}>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>
    </motion.div>
  );
};

export default TaskCard;
