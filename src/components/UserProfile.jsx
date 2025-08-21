import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function UserProfile({ onClose }) {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">用户信息</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {user.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{user.email}</p>
              <p className="text-sm text-gray-500">
                注册时间: {new Date(user.created_at).toLocaleDateString('zh-CN')}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? '退出中...' : '退出登录'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}