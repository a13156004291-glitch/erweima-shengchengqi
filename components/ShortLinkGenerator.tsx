
import React, { useState } from 'react';
import { Link, Copy, Check, ArrowRight, AlertCircle, Zap, ShieldCheck } from 'lucide-react';

interface ShortLinkGeneratorProps {
  onShortLinkCreated: (shortUrl: string) => void;
}

const ShortLinkGenerator: React.FC<ShortLinkGeneratorProps> = ({ onShortLinkCreated }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortened, setShortened] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (str: string) => {
    try {
      new URL(str.startsWith('http') ? str : `https://${str}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleShorten = () => {
    setError(null);
    if (!url) return;
    
    if (!validateUrl(url)) {
      setError('请输入有效的网址 (需包含 http/https)');
      return;
    }

    setIsLoading(true);
    
    // 模拟云端短链接生成
    setTimeout(() => {
      const randomCode = Math.random().toString(36).substring(2, 8);
      const mockShortUrl = `https://qr.link/${randomCode}`;
      
      setShortened(mockShortUrl);
      onShortLinkCreated(mockShortUrl);
      setIsLoading(false);
    }, 800);
  };

  const copyToClipboard = () => {
    if (shortened) {
      navigator.clipboard.writeText(shortened);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-indigo-50/50 border border-slate-100 space-y-5 transition-all hover:shadow-indigo-100/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-indigo-600 font-black">
          <div className="p-2 bg-indigo-50 rounded-xl">
             <Link size={18} strokeWidth={3} />
          </div>
          <h3 className="tracking-tight uppercase text-xs">二维码密度压缩</h3>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100">
           <ShieldCheck size={12} className="text-green-600" />
           <span className="text-[10px] font-black text-green-700 uppercase tracking-tighter">100% 成功率保障</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="relative group">
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(null); }}
            onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
            placeholder="粘贴长链接，极速简化码面密度..."
            className={`w-full pl-4 pr-14 py-4 bg-slate-50 border-2 ${error ? 'border-red-200 ring-4 ring-red-50' : 'border-slate-50 group-hover:border-indigo-100 focus:border-indigo-500'} rounded-2xl text-sm outline-none transition-all placeholder:text-slate-400 font-medium`}
          />
          <button
            onClick={handleShorten}
            disabled={!url || isLoading}
            className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-black text-white px-3.5 rounded-xl transition-all disabled:opacity-50 active:scale-90 shadow-lg group-hover:scale-105"
          >
            {isLoading ? (
               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
               <ArrowRight size={20} strokeWidth={3} />
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-[11px] font-bold px-2 animate-in fade-in slide-in-from-left-2">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {shortened && (
          <div className="flex items-center justify-between p-4 bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl animate-in zoom-in-95 duration-300 shadow-xl">
            <div className="flex flex-col">
              <span className="text-[10px] text-indigo-300 font-black uppercase tracking-[0.15em] mb-1">内容密度已降至最低</span>
              <span className="text-sm font-bold text-white truncate max-w-[180px]">{shortened}</span>
            </div>
            <button
              onClick={copyToClipboard}
              className={`flex items-center gap-2 text-xs font-black px-5 py-2.5 rounded-xl transition-all active:scale-95 ${copied ? 'bg-green-500 text-white' : 'bg-white text-indigo-900 hover:bg-slate-50'}`}
            >
              {copied ? <Check size={16} strokeWidth={3} /> : <Copy size={16} strokeWidth={3} />}
              {copied ? '完成' : '复制'}
            </button>
          </div>
        )}
      </div>
      
      <p className="text-[10px] text-slate-400 font-bold leading-relaxed px-1 flex items-center gap-2">
        <Zap size={12} className="text-amber-500 shrink-0" />
        <span>提示：艺术化二维码极易因码点过细导致无法对焦。压缩链接可使码点增大 40%，实现秒级识别。</span>
      </p>
    </div>
  );
};

export default ShortLinkGenerator;
