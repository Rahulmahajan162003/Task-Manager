import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderPlus, ClipboardList, Layers, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', project: '', assignedTo: '' });

  const fetchData = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        axios.get('${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/projects', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/tasks', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setProjects(projRes.data);
      setTasks(taskRes.data);
      
      if (user.role === 'Admin') {
        const userRes = await axios.get('${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users', { headers: { Authorization: `Bearer ${token}` } });
        setUsers(userRes.data);
      }
    } catch (err) {
      toast.error('Failed to load dashboard data');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, user.role]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating project...');
    try {
      await axios.post('${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/projects', newProject, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewProject({ title: '', description: '' });
      toast.success('Project created successfully!', { id: loadingToast });
      fetchData(); // Refresh seamlessly
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create project', { id: loadingToast });
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Assigning task...');
    try {
      const payload = { ...newTask };
      if (!payload.assignedTo) delete payload.assignedTo;

      await axios.post('${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/tasks', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewTask({ title: '', description: '', dueDate: '', project: '', assignedTo: '' });
      toast.success('Task assigned seamlessly!', { id: loadingToast });
      fetchData(); // Refresh seamlessly
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to assign task', { id: loadingToast });
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure? This will delete the project and all associated tasks.')) return;
    const loadingToast = toast.loading('Deleting project...');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Project deleted', { id: loadingToast });
      fetchData();
    } catch (err) {
      toast.error('Failed to delete project', { id: loadingToast });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '20px', paddingBottom: '40px' }}>
      
      <div className="flex items-center gap-2 mb-4" style={{ marginTop: '10px' }}>
        <Layers size={24} color="var(--primary-color)" />
        <h1 style={{ margin: 0 }}>Overview</h1>
      </div>
      
      {user.role === 'Admin' && (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div className="glass-panel" style={{ borderTop: '3px solid var(--primary-color)' }}>
            <div className="flex items-center gap-2 mb-4">
              <FolderPlus size={18} color="var(--primary-color)" />
              <h3 style={{ margin: 0 }}>Create Project</h3>
            </div>
            <form onSubmit={handleCreateProject}>
              <input type="text" placeholder="Project Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required />
              <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} rows={2} />
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>Create Project</button>
            </form>
          </div>
          
          <div className="glass-panel" style={{ borderTop: '3px solid var(--success-color)' }}>
             <div className="flex items-center gap-2 mb-4">
              <ClipboardList size={18} color="var(--success-color)" />
              <h3 style={{ margin: 0 }}>Assign Task</h3>
            </div>
            <form onSubmit={handleCreateTask}>
              <input type="text" placeholder="Task Title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
              <select value={newTask.project} onChange={e => setNewTask({...newTask, project: e.target.value})} required>
                <option value="" disabled>Select Project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
              </select>
              <div className="flex gap-4">
                <input type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} required style={{ flex: 1 }} />
                <select value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})} style={{ flex: 1 }}>
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', backgroundColor: 'var(--success-color)' }}>Assign Task</button>
            </form>
          </div>
        </div>
      )}

      {user.role === 'Admin' && projects.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Active Projects</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', marginBottom: '40px' }}>
            <AnimatePresence>
              {projects.map(proj => (
                <motion.div key={proj._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel" style={{ padding: '16px' }}>
                  <div className="flex justify-between items-center">
                    <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>{proj.title}</h4>
                    <button onClick={() => handleDeleteProject(proj._id)} className="action-btn" style={{ color: 'var(--danger-color)' }}><Trash2 size={14} /></button>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>{proj.description || 'No description'}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      <h2 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginTop: '20px' }}>Your Tasks</h2>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        <AnimatePresence>
          {tasks.length > 0 ? tasks.map(task => (
            <TaskCard key={task._id} task={task} token={token} onUpdate={fetchData} />
          )) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '40px 0', gridColumn: '1 / -1' }}>
              <p style={{color: 'var(--text-secondary)'}}>No tasks assigned yet. You're all caught up!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Dashboard;
