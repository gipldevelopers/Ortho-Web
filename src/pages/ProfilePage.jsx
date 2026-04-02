import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Building2, Phone, Calendar, LogOut, Package, Heart, Settings } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost/ortho-website/backend/public/index.php';

export default function ProfilePage() {
  const { user, logout, savedItems, enquiryItems, updateUser, authToken, clearAuthToken } =
    useAppContext();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '' });
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const startEditing = () => {
    setFormData({
      name: user.name || '',
      company: user.company || '',
    });
    setSaveError('');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (isSaving) return;
    setIsEditing(false);
    setSaveError('');
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setSaveError('Full name is required.');
      return;
    }

    setSaveError('');
    setIsSaving(true);

    try {
      if (authToken && authToken.trim() !== '') {
        const response = await fetch(`${API_BASE_URL}?route=auth/profile`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            company: formData.company.trim(),
          }),
        });
        const data = await response.json();
        if (response.status === 401) {
          clearAuthToken();
          updateUser({
            name: formData.name.trim(),
            company: formData.company.trim(),
          });
          setIsEditing(false);
          setSaveError('');
          return;
        }
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to update profile.');
        }
        updateUser(data.data.user);
      } else {
        updateUser({
          name: formData.name.trim(),
          company: formData.company.trim(),
        });
      }

      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message || 'Unable to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const stats = [
    { label: 'Saved Items', value: savedItems.length, icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Enquiries', value: enquiryItems.length, icon: Package, color: 'text-medical-600', bg: 'bg-medical-50' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-16 bg-slate-50 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="h-24 bg-gradient-to-r from-medical-500 to-medical-700" />
              <div className="px-6 pb-8 -mt-12 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full border-4 border-white shadow-md mb-4 overflow-hidden">
                  <div className="w-full h-full bg-medical-100 flex items-center justify-center">
                    <User className="w-12 h-12 text-medical-600" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                <p className="text-sm text-slate-500 mb-6">{user.company}</p>
                
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Account Settings</span>
                  </button>
                  <button 
                    onClick={() => { logout(); navigate('/'); }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => navigate(stat.label === 'Saved Items' ? '/saved' : '/enquiry')}
                >
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Profile Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 font-sans">Profile Information</h3>
                {!isEditing ? (
                  <button
                    onClick={startEditing}
                    className="text-sm font-semibold text-medical-600 hover:text-medical-700"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={cancelEditing}
                      className="text-sm font-semibold text-slate-500 hover:text-slate-600"
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="text-sm font-semibold text-medical-600 hover:text-medical-700"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>
              <div className="p-8">
                {saveError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                    {saveError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <div className="flex items-center text-slate-400 mb-1">
                      <User className="w-4 h-4 mr-2" />
                      <span className="text-xs font-semibold uppercase tracking-wider font-sans">Full Name</span>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all"
                        placeholder="Your name"
                      />
                    ) : (
                      <p className="text-slate-900 font-medium font-sans">{user.name}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-slate-400 mb-1">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="text-xs font-semibold uppercase tracking-wider font-sans">Email Address</span>
                    </div>
                    <p className="text-slate-900 font-medium font-sans">{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-slate-400 mb-1">
                      <Phone className="w-4 h-4 mr-2" />
                      <span className="text-xs font-semibold uppercase tracking-wider font-sans">Phone Number</span>
                    </div>
                    <p className="text-slate-900 font-medium font-sans">{user.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-slate-400 mb-1">
                      <Building2 className="w-4 h-4 mr-2" />
                      <span className="text-xs font-semibold uppercase tracking-wider font-sans">Company</span>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all"
                        placeholder="Company name"
                      />
                    ) : (
                      <p className="text-slate-900 font-medium font-sans">{user.company}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-slate-400 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-xs font-semibold uppercase tracking-wider font-sans">Member Since</span>
                    </div>
                    <p className="text-slate-900 font-medium font-sans">{user.joinedDate}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity Mock */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-50">
                <h3 className="text-lg font-bold text-slate-900 font-sans">Recent Enquiries</h3>
              </div>
              <div className="p-8 text-center py-12">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="text-slate-900 font-semibold mb-1 font-sans">No recent enquiries</h4>
                <p className="text-slate-500 text-sm font-sans mx-auto max-w-xs">Items you add to your enquiry list will appear here after submission.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
