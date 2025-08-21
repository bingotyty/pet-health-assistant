import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password);
      }

      if (result.error) {
        setMessage(result.error.message);
      } else if (!isLogin) {
        setMessage('注册成功！请查看邮箱验证链接。');
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 sparkle">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="text-8xl mb-4 heart-pulse">🐾</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent mb-3">
            宠物健康小助手
          </h1>
          <p className="text-rose-500 font-medium mb-2">
            💕 用AI守护毛孩子的健康 💕
          </p>
          <p className="text-pink-500 text-sm">
            {isLogin ? '🌸 欢迎回来~ 🌸' : '✨ 开始美好旅程 ✨'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gradient-to-br from-white to-pink-50 py-8 px-6 shadow-2xl rounded-3xl border border-pink-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-rose-600 mb-2 flex items-center">
                <span className="mr-2">📧</span>
                邮箱地址
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border-2 border-pink-200 rounded-2xl placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 bg-gradient-to-r from-white to-pink-50 transition-all duration-200"
                  placeholder="请输入您的邮箱~"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-rose-600 mb-2 flex items-center">
                <span className="mr-2">🔐</span>
                密码
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border-2 border-pink-200 rounded-2xl placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 bg-gradient-to-r from-white to-pink-50 transition-all duration-200"
                  placeholder="请输入您的密码~"
                />
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded-xl text-sm font-medium text-center ${
                message.includes('成功') 
                  ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-600 border border-emerald-200' 
                  : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-600 border border-red-200'
              }`}>
                <span className="mr-2">{message.includes('成功') ? '✅' : '❌'}</span>
                {message}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-pink w-full flex justify-center py-4 px-6 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    处理中...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="mr-2">{isLogin ? '🚪' : '✨'}</span>
                    {isLogin ? '登录账户' : '创建账户'}
                    <span className="ml-2">💝</span>
                  </div>
                )}
              </button>
            </div>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-pink-500 hover:text-pink-600 font-medium transition-colors duration-200"
              >
                {isLogin ? '💕 没有账户？点击注册 💕' : '🌸 已有账户？点击登录 🌸'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}