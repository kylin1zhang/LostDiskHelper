import React, { useState, useEffect, useRef } from 'react';
import { OwnerInfo, ChatMessage } from '../types';
import { Avatar } from './Avatar';
import { generateLocationMessage, generateOwnerReply } from '../services/geminiService';

interface FinderPanelProps {
  ownerInfo: OwnerInfo;
  onReset: () => void;
}

export const FinderPanel: React.FC<FinderPanelProps> = ({ ownerInfo, onReset }) => {
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'sent' | 'error'>('idle');
  const [locationAddress, setLocationAddress] = useState<string>('');
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'owner',
      text: `你好！我是这个U盘的小助手。${ownerInfo.message}`,
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const handleSendLocation = () => {
    setLocationStatus('locating');
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const address = await generateLocationMessage(position.coords.latitude, position.coords.longitude);
        setLocationAddress(address);
        setLocationStatus('sent');
        
        // Add a system message to chat
        const sysMsg: ChatMessage = {
          id: Date.now().toString(),
          sender: 'owner', // Simulated system acknowledgement
          text: `[系统提示] 我已收到您的位置信息：${address}。主人正在赶来！`,
          timestamp: Date.now()
        };
        setChatMessages(prev => [...prev, sysMsg]);
      },
      (err) => {
        console.error(err);
        setLocationStatus('error');
      }
    );
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate Network/Thinking delay
    const chatHistoryText = chatMessages.map(m => `${m.sender === 'user' ? 'Finder' : 'Owner'}: ${m.text}`).join('\n');
    
    const replyText = await generateOwnerReply(ownerInfo, chatHistoryText, newMsg.text);
    
    setIsTyping(false);
    setChatMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      sender: 'owner',
      text: replyText,
      timestamp: Date.now()
    }]);
  };

  const handleEmailOwner = () => {
    const subject = encodeURIComponent(`关于您的U盘 (Found your USB Drive)`);
    const historyText = chatMessages.map(m => `[${m.sender === 'user' ? '我' : '主人/助手'}]: ${m.text}`).join('\n');
    const locationText = locationAddress ? `\n\n当前位置: ${locationAddress}` : '';
    const body = encodeURIComponent(`你好 ${ownerInfo.name}，\n\n我捡到了您的U盘。\n\n聊天记录：\n${historyText}${locationText}\n\n请尽快联系我。`);
    
    window.location.href = `mailto:${ownerInfo.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 h-[80vh]">
      
      {/* Left Column: Info & Actions */}
      <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-between">
        <div className="w-full flex flex-col items-center">
            <div className="mb-4">
                <Avatar emotion={locationStatus === 'sent' ? 'happy' : 'worry'} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">发现遗失U盘</h2>
            <p className="text-gray-500 text-center mb-6">
              请帮助我回家！我的主人很着急。
            </p>

            <div className="w-full bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
              <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-2">主人信息</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">姓名:</span>
                  <span className="font-medium text-gray-900">{ownerInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">电话:</span>
                  <span className="font-medium text-gray-900 select-all">{ownerInfo.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">邮箱:</span>
                  <a href={`mailto:${ownerInfo.email}`} className="font-medium text-blue-600 hover:underline truncate max-w-[150px]">{ownerInfo.email}</a>
                </div>
                {ownerInfo.wechat && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">微信:</span>
                    <span className="font-medium text-gray-900 select-all">{ownerInfo.wechat}</span>
                  </div>
                )}
              </div>
            </div>

            {locationStatus !== 'sent' ? (
              <button
                onClick={handleSendLocation}
                disabled={locationStatus === 'locating'}
                className={`w-full py-4 rounded-xl flex items-center justify-center space-x-2 text-white font-bold text-lg transition-all ${
                  locationStatus === 'locating' ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 animate-pulse'
                }`}
              >
                 {locationStatus === 'locating' ? (
                   <span>定位中...</span>
                 ) : (
                   <>
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                     <span>点击通知主人我的位置</span>
                   </>
                 )}
              </button>
            ) : (
              <div className="w-full bg-green-100 text-green-800 p-3 rounded-xl text-center border border-green-200">
                ✅ 位置已发送：{locationAddress}
              </div>
            )}
            
             {locationStatus === 'error' && (
              <p className="text-red-500 text-sm mt-2">无法获取位置，请手动在右侧告诉主人。</p>
            )}
        </div>

        <button onClick={onReset} className="mt-8 text-xs text-gray-400 underline hover:text-gray-600">
          [模拟] 格式化/重置U盘
        </button>
      </div>

      {/* Right Column: Chat Interface */}
      <div className="bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-100">
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
            <span className="font-bold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                联系主人 ({ownerInfo.name})
            </span>
             <button 
              onClick={handleEmailOwner}
              className="text-xs bg-white border border-blue-200 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 flex items-center"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              发送邮件
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
           {chatMessages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                }`}>
                    {msg.text}
                </div>
             </div>
           ))}
           {isTyping && (
             <div className="flex justify-start">
               <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl rounded-bl-none shadow-sm">
                 <div className="flex space-x-1">
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                 </div>
               </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="发送消息给主人..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition"
            >
              <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </div>
          <div className="text-center mt-2">
             <button onClick={handleEmailOwner} className="text-xs text-gray-400 hover:text-blue-600 underline">
               如果无法联系，请点击此处发送邮件给主人
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};