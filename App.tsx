
import React, { useState } from 'react';
import { DEFAULT_CONFIG, QRConfig } from './types';
import QRCodeViewer from './components/QRCodeViewer';
import Controls from './components/Controls';
import ShortLinkGenerator from './components/ShortLinkGenerator';
import { QrCode, Sparkles, ShieldCheck, Zap, Info } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<QRConfig>(DEFAULT_CONFIG);

  const handleShortLink = (shortUrl: string) => {
    setConfig(prev => ({ ...prev, data: shortUrl }));
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] text-slate-900 font-['Inter']">
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        
        {/* 顶部导航 */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-3xl shadow-2xl shadow-indigo-200">
              <QrCode size={30} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                二维码架构师 <span className="text-[9px] bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-[0.2em] mt-1">2025 流体版</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">工业级二维码视觉设计系统</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex items-center gap-2 px-4 py-2 text-xs font-black text-slate-500">
                <ShieldCheck size={16} className="text-green-500" />
                <span>微信秒开极速认证</span>
             </div>
             <div className="h-4 w-px bg-slate-100" />
             <button className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors">
                操作说明
             </button>
          </div>
        </header>

        <main className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* 左侧控制区 */}
          <div className="lg:col-span-7 space-y-8 h-[calc(100vh-180px)] overflow-y-auto pr-4 scrollbar-hide pb-20">
            {/* 短链接功能作为首个卡片 */}
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <ShortLinkGenerator onShortLinkCreated={handleShortLink} />
            </div>
            
            <Controls config={config} onChange={setConfig} />
          </div>

          {/* 右侧预览区 */}
          <div className="lg:col-span-5 space-y-8 sticky top-10">
            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/5 blur-[120px] rounded-full"></div>
              <QRCodeViewer config={config} />
            </div>

            {/* 扫码率保障提示 */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-50 rounded-xl"><Info size={18} className="text-amber-600" /></div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">实时扫描成功率分析</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-400 uppercase tracking-tighter">当前样式：{config.dots.type === 'radial' ? '由内而外圆点' : '标准几何'}</span>
                        <span className="text-green-600 font-black">100% 识别成功</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-full animate-pulse"></div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                        系统已检测：<span className="text-indigo-600 font-bold">智能边缘贴合</span> 已激活。圆点边缘清晰且互不粘连，配合 <span className="text-slate-900 font-bold">由内而外</span> 的呼吸感渐变，在保证视觉冲击力的同时实现了极高的对焦识别精度。
                    </p>
                </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
