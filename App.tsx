import React, { useEffect, useState } from 'react';
import { AppMode, OwnerInfo } from './types';
import { SetupPanel } from './components/SetupPanel';
import { FinderPanel } from './components/FinderPanel';

const LOCAL_STORAGE_KEY = 'usb_owner_data_v1';

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.SETUP);
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo | null>(null);

  useEffect(() => {
    // Check if the "USB" is already configured
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed: OwnerInfo = JSON.parse(savedData);
        if (parsed.isRegistered) {
          setOwnerInfo(parsed);
          setMode(AppMode.FOUND);
        }
      } catch (e) {
        console.error("Failed to parse USB data", e);
      }
    }
  }, []);

  const handleSaveOwner = (info: OwnerInfo) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(info));
    setOwnerInfo(info);
    setMode(AppMode.FOUND);
  };

  const handleReset = () => {
    if (window.confirm("确定要格式化/重置此程序吗？这将清除主人信息。")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setOwnerInfo(null);
      setMode(AppMode.SETUP);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-100 to-transparent pointer-events-none"></div>

      <header className="relative z-10 pt-8 pb-4 text-center">
        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
          USB回家助手
        </h1>
        <p className="text-blue-600/80 text-sm mt-1">
          {mode === AppMode.SETUP ? "设备初始化设置" : "安全联络中心"}
        </p>
      </header>

      <main className="relative z-10 flex-1 px-4 py-6">
        {mode === AppMode.SETUP ? (
          <SetupPanel onSave={handleSaveOwner} />
        ) : (
          ownerInfo && <FinderPanel ownerInfo={ownerInfo} onReset={handleReset} />
        )}
      </main>

      <footer className="text-center py-4 text-gray-400 text-xs">
        <p>此程序仅为技术方案演示。实际使用请勿存储敏感个人信息。</p>
        <p>基于 Gemini API 构建</p>
      </footer>
    </div>
  );
}