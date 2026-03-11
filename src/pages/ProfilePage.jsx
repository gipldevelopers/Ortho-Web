import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Building2, Phone, Calendar, LogOut, Package, Heart, Settings } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function ProfilePage() {
  const { user, logout, savedItems, enquiryItems } = useAppContext();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

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
              <div className="px-8 py-6 border-b border-slate-50">
                <h3 className="text-lg font-bold text-slate-900 font-sans">Profile Information</h3>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    <p className="text-slate-900 font-medium font-sans">{user.company}</p>
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
