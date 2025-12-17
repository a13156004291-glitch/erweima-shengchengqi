
import React, { useState, useEffect } from 'react';
import { QRConfig, DotType, CornerType, LogoShape } from '../types';
import { Type, Palette, LayoutGrid, Image as ImageIcon, Circle, Square, Plus, Trash2, Shapes, X, Check, Droplets, Target, Sparkles, Upload } from 'lucide-react';

interface Props {
  config: QRConfig;
  onChange: (config: QRConfig) => void;
}

interface LogoItem {
  id: string;
  url: string;
  isPreset: boolean;
  name?: string;
}

const PRESET_LOGOS: LogoItem[] = [
  { id: 'wechat', url: 'https://api.iconify.design/ri:wechat-fill.svg', isPreset: true, name: '微信' },
  { id: 'alipay', url: 'https://api.iconify.design/ant-design:alipay-circle-filled.svg', isPreset: true, name: '支付宝' },
  { id: 'web', url: 'https://api.iconify.design/mdi:web.svg', isPreset: true, name: '官网' },
  { id: 'shop', url: 'https://api.iconify.design/mdi:storefront.svg', isPreset: true, name: '店铺' },
];

const DOT_TYPES: { value: DotType; label: string }[] = [
  { value: 'radial', label: '呼吸圆' },
  { value: 'liquid', label: '液态感' },
  { value: 'hexagon', label: '六边形' },
  { value: 'star', label: '星形' },
  { value: 'ring', label: '圆环' },
  { value: 'rounded', label: '柔圆' },
  { value: 'circle', label: '标准' }
];

const EYE_TYPES: { value: CornerType; label: string }[] = [
  { value: 'eye-almond', label: '眼睛' },
  { value: 'single-rounded', label: '单圆角' },
  { value: 'leaf', label: '泪滴' },
  { value: 'eye', label: '经典' },
  { value: 'eye-fancy', label: '重瞳' },
  { value: 'shield', label: '盾形' },
  { value: 'ninja', label: '手里剑' },
  { value: 'extra-rounded', label: '超圆' }
];

export default function Controls({ config, onChange }: Props) {
  const [logoLibrary, setLogoLibrary] = useState<LogoItem[]>(PRESET_LOGOS);
  const [isSyncCorner, setIsSyncCorner] = useState(true);

  const update = (path: string, value: any) => {
    const keys = path.split('.');
    const newConfig = { ...config };
    let current: any = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    onChange(newConfig);
  };

  const handleMainColorChange = (color: string) => {
    const newConfig = { ...config, dots: { ...config.dots, color } };
    if (isSyncCorner) {
      newConfig.corners = { ...newConfig.corners, outerColor: color, innerColor: color };
    }
    onChange(newConfig);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        const newLogo = { id: `custom-${Date.now()}`, url: result, isPreset: false };
        setLogoLibrary(prev => [newLogo, ...prev]); // 将新上传的放在最前面
        update('image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* 内容承载卡片 */}
      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100/50">
        <div className="flex items-center gap-3 mb-6">
          <Type className="text-indigo-600" size={18} />
          <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">承载内容</h3>
        </div>
        <textarea
          value={config.data}
          onChange={(e) => update('data', e.target.value)}
          placeholder="粘贴链接或文本..."
          className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[2rem] text-sm font-medium transition-all outline-none h-24 resize-none"
        />
      </section>

      {/* 码点形态 */}
      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100/50">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LayoutGrid className="text-indigo-600" size={18} />
            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">码点样式</h3>
          </div>
          <Sparkles className="text-indigo-200" size={16} />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {DOT_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => update('dots.type', t.value)}
              className={`py-4 rounded-2xl border-2 transition-all text-[9px] font-black uppercase ${
                config.dots.type === t.value ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* 定位块形态 */}
      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100/50">
        <div className="flex items-center gap-3 mb-8">
          <Target className="text-indigo-600" size={18} />
          <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">码眼形态</h3>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {EYE_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => update('corners.type', t.value)}
              className={`py-4 rounded-2xl border-2 transition-all text-[9px] font-black uppercase ${
                config.corners.type === t.value ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* 品牌 Logo 控制中心 */}
      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100/50 overflow-hidden">
        <div className="flex items-center gap-3 mb-8">
          <ImageIcon className="text-indigo-600" size={18} />
          <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Logo 库与上传</h3>
        </div>
        
        <div className="grid grid-cols-5 gap-3 mb-8">
          {/* 上传按钮放在库的第一位 */}
          <label className="aspect-square bg-indigo-50 rounded-xl border-2 border-dashed border-indigo-200 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 transition-all group shadow-sm">
            <Upload size={18} className="text-indigo-600 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter">本地上传</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
          </label>

          {logoLibrary.map((logo) => (
            <div key={logo.id} className="relative group/item">
              <button
                onClick={() => update('image', logo.url)}
                className={`w-full aspect-square p-2 bg-slate-50 rounded-xl border-2 transition-all flex items-center justify-center relative overflow-hidden ${
                  config.image === logo.url ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-transparent hover:border-slate-200'
                }`}
              >
                <img src={logo.url} className="w-full h-full object-contain" alt={logo.name} />
              </button>
              {!logo.isPreset && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setLogoLibrary(prev => prev.filter(l => l.id !== logo.id));
                    if (config.image === logo.url) update('image', undefined);
                  }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/item:opacity-100 transition-opacity z-10 shadow-md"
                >
                  <X size={8} strokeWidth={4} />
                </button>
              )}
            </div>
          ))}
        </div>

        {config.image && (
          <div className="space-y-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Logo 形状</label>
              <div className="flex gap-2">
                {(['circle', 'rounded-square'] as LogoShape[]).map((s) => (
                  <button 
                    key={s} 
                    onClick={() => update('logo.shape', s)} 
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${config.logo.shape === s ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {s === 'circle' ? <Circle size={16}/> : <Shapes size={16}/>}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>渲染尺寸</span>
                <span className="text-indigo-600">{Math.round(config.logo.size * 100)}%</span>
              </div>
              <input type="range" min="0.1" max="0.3" step="0.01" value={config.logo.size} onChange={(e) => update('logo.size', parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            </div>

            <div className="flex items-center justify-between p-1 bg-slate-50 rounded-2xl">
              <button onClick={() => update('logo.isSyncTheme', !config.logo.isSyncTheme)} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all flex items-center justify-center gap-2 ${config.logo.isSyncTheme ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
                <Droplets size={12} /> 颜色同步
              </button>
              <button onClick={() => update('logo.isSyncTheme', false)} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all flex items-center justify-center gap-2 ${!config.logo.isSyncTheme ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>
                原始图像
              </button>
            </div>

            <button onClick={() => update('image', undefined)} className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all">
              <Trash2 size={14} /> 移除图标
            </button>
          </div>
        )}
      </section>

      {/* 色彩空间 */}
      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100/50">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Palette className="text-indigo-600" size={18} />
            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">色彩配置</h3>
          </div>
          <button onClick={() => setIsSyncCorner(!isSyncCorner)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black transition-all ${isSyncCorner ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
            {isSyncCorner ? <Check size={12} /> : <div className="w-3 h-3 border-2 border-current rounded-full" />}
            码眼同步
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 uppercase">码点颜色</label>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <input type="color" value={config.dots.color} onChange={(e) => handleMainColorChange(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent" />
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{config.dots.color}</span>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 uppercase">底板背景</label>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <input type="color" value={config.background.color} onChange={(e) => update('background.color', e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent" />
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{config.background.color}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
