import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getProfile, updateProfile } from '../services/authService';
import Loader from '../components/common/Loader';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [updateMsg, setUpdateMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setFormData({ name: data.name, email: data.email, password: '' });
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <Loader />;
  if (!profile) return <div className="container mt-4">Failed to load profile.</div>;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateMsg({ type: '', text: '' });
    try {
      const updatedData = await updateProfile({
        name: formData.name,
        email: formData.email,
        ...(formData.password && { password: formData.password })
      });
      setProfile({ ...profile, name: updatedData.name, email: updatedData.email });
      setEditMode(false);
      setFormData(prev => ({ ...prev, password: '' }));
      setUpdateMsg({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setUpdateMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setUpdateMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
  };

  return (
    <div className="container mt-4 profile-page">
      <h2>My Profile</h2>
      {updateMsg.text && (
        <div className={updateMsg.type === 'error' ? 'error-message' : 'success-message'}>
          {updateMsg.text}
        </div>
      )}
      
      <div className="profile-card">
        <div className="profile-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3>Account Information</h3>
          <button className="btn btn-outline btn-sm" onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editMode ? (
          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>New Password (leave blank to keep current)</label>
              <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </form>
        ) : (
          <div className="profile-info">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Account Type:</strong> <span className="badge">{profile.role}</span></p>
            <p><strong>Member Since:</strong> {new Date(profile.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
