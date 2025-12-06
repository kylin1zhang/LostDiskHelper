import React, { useState } from 'react';
import { OwnerInfo } from '../types';
import { Avatar } from './Avatar';

interface SetupPanelProps {
  onSave: (info: OwnerInfo) => void;
}

export const SetupPanel: React.FC<SetupPanelProps> = ({ onSave }) => {
  const [formData, setFormData] = useState<OwnerInfo>({
    name: '',
    phone: '',
    email: '',
    wechat: '',
    message: '如果捡到此盘，请务必联系我，盘内有重要资料，必有重谢！',
    isRegistered: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      alert("请至少填写姓名、电话和邮箱");
      return;
    }
    onSave({ ...formData, isRegistered: true });
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-blue-600 p-6 text-center">
        <Avatar emotion="happy" />
        <h2 className="text-2xl font-bold text-white mt-4">我是您的U盘小管家</h2>
        <p className="text-blue-100 text-sm mt-2">请先绑定您的信息，以防丢失</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">您的姓名 <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="例如：张伟"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">手机号码 <span className="text-red-500">*</span></label>
          <input
            type="tel"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="方便捡拾者电话联系"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">电子邮箱 <span className="text-red-500">*</span></label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="接收留言邮件"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">微信号 (选填)</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="另一种联系方式"
            value={formData.wechat}
            onChange={(e) => setFormData({...formData, wechat: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">致捡拾者的留言</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 transform hover:scale-[1.02]"
        >
          立即绑定保护
        </button>
      </form>
    </div>
  );
};