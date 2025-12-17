
import React, { useEffect, useRef, useState, useCallback } from 'react';
// @ts-ignore
import QRCode from 'qrcode';
import { Download, Loader2, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { QRConfig, LogoShape, DotType, CornerType } from '../types';

export default function QRCodeViewer({ config }: { config: QRConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);
  const [analysis, setAnalysis] = useState({ score: 100, status: '极致', color: 'text-emerald-500', icon: CheckCircle2 });

  const runDiagnostics = useCallback((fg: string, bg: string) => {
    const getLuminance = (hex: string) => {
      const rgb = hex.match(/[A-Za-z0-9]{2}/g)?.map(v => parseInt(v, 16) / 255) || [0,0,0];
      const a = rgb.map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };
    const l1 = getLuminance(fg);
    const l2 = getLuminance(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    if (ratio > 7) return { score: 100, status: '极速识别', color: 'text-emerald-500', icon: CheckCircle2 };
    if (ratio > 4.5) return { score: 85, status: '识别良好', color: 'text-indigo-500', icon: ShieldCheck };
    return { score: 45, status: '环境敏感', color: 'text-amber-500', icon: AlertTriangle };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (config.image) {
      const img = new Image();
      img.src = config.image;
      img.crossOrigin = "anonymous";
      img.onload = () => { if (isMounted) setLogoImg(img); };
    } else {
      setLogoImg(null);
    }
    return () => { isMounted = false; };
  }, [config.image]);

  const drawEyePath = (cCtx: CanvasRenderingContext2D, size: number, type: CornerType, pos: 'tl' | 'tr' | 'bl') => {
    cCtx.beginPath();
    const r = size * 0.45;
    
    switch (type) {
      case 'eye-almond': {
        let radii: [number, number, number, number] = [0, r, 0, r];
        if (pos === 'tr' || pos === 'bl') radii = [r, 0, r, 0];
        cCtx.roundRect(0, 0, size, size, radii);
        break;
      }
      case 'single-rounded': {
        let radii: [number, number, number, number] = [r, 0, 0, 0];
        if (pos === 'tr') radii = [0, r, 0, 0];
        else if (pos === 'bl') radii = [0, 0, 0, r];
        cCtx.roundRect(0, 0, size, size, radii);
        break;
      }
      case 'leaf': {
        let radii: [number, number, number, number] = [0, r, r, r];
        if (pos === 'tr') radii = [r, 0, r, r];
        else if (pos === 'bl') radii = [r, r, r, 0];
        cCtx.roundRect(0, 0, size, size, radii);
        break;
      }
      case 'rounded':
        cCtx.roundRect(0, 0, size, size, size * 0.2);
        break;
      case 'extra-rounded':
        cCtx.roundRect(0, 0, size, size, size * 0.45);
        break;
      case 'shield':
        cCtx.moveTo(0, 0); 
        cCtx.lineTo(size, 0); 
        cCtx.lineTo(size, size * 0.7);
        cCtx.bezierCurveTo(size, size * 0.9, size * 0.7, size, size * 0.5, size);
        cCtx.bezierCurveTo(size * 0.3, size, 0, size * 0.9, 0, size * 0.7);
        cCtx.closePath();
        break;
      case 'ninja':
        const cp = size / 2, offset = size * 0.2;
        cCtx.moveTo(cp, 0);
        cCtx.quadraticCurveTo(size - offset, offset, size, cp);
        cCtx.quadraticCurveTo(size - offset, size - offset, cp, size);
        cCtx.quadraticCurveTo(offset, size - offset, 0, cp);
        cCtx.quadraticCurveTo(offset, offset, cp, 0);
        break;
      default:
        cCtx.rect(0, 0, size, size);
    }
    cCtx.fill();
  };

  const render = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    setAnalysis(runDiagnostics(config.dots.color, config.background.color));

    try {
      const qr = QRCode.create(config.data, { errorCorrectionLevel: 'H' });
      const modules = qr.modules;
      const count = modules.size;
      const resolution = 2048; 
      const pixelSize = Math.floor(resolution / (count + 12));
      const margin = pixelSize * 6;
      const totalSize = count * pixelSize + margin * 2;

      canvas.width = totalSize;
      canvas.height = totalSize;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 1. 绘制背景
      ctx.fillStyle = config.background.color;
      ctx.fillRect(0, 0, totalSize, totalSize);

      // 2. 绘制三个定位块
      const drawEye = (x: number, y: number, pos: 'tl' | 'tr' | 'bl') => {
        const s = pixelSize;
        ctx.save();
        ctx.translate(x, y);
        
        ctx.fillStyle = config.corners.outerColor;
        drawEyePath(ctx, 7 * s, config.corners.type, pos);
        
        ctx.fillStyle = config.background.color;
        ctx.save();
        ctx.translate(s, s);
        drawEyePath(ctx, 5 * s, config.corners.type, pos);
        ctx.restore();
        
        ctx.fillStyle = config.corners.innerColor;
        ctx.save();
        ctx.translate(2 * s, 2 * s);
        drawEyePath(ctx, 3 * s, config.corners.type, pos);
        ctx.restore();
        
        ctx.restore();
      };

      drawEye(margin, margin, 'tl');
      drawEye(margin + (count - 7) * pixelSize, margin, 'tr');
      drawEye(margin, margin + (count - 7) * pixelSize, 'bl');

      // 3. 绘制码点
      const center = totalSize / 2;
      const logoArea = totalSize * config.logo.size;
      const protectZone = logoArea + pixelSize * 1.5;

      for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
          if (!modules.get(r, c)) continue;
          
          const isFinder = (r < 7 && c < 7) || (r < 7 && c >= count - 7) || (r >= count - 7 && c < 7);
          if (isFinder) continue;

          const cx = margin + c * pixelSize + pixelSize / 2;
          const cy = margin + r * pixelSize + pixelSize / 2;

          if (logoImg && config.logo.shape !== 'none') {
            const dist = Math.sqrt(Math.pow(cx - center, 2) + Math.pow(cy - center, 2));
            if (dist < protectZone / 2) continue;
          }

          ctx.fillStyle = config.dots.color;
          const s = pixelSize * 0.94;
          const rad = s / 2;

          ctx.beginPath();
          switch (config.dots.type) {
            case 'radial':
              const d = Math.sqrt(Math.pow(cx - center, 2) + Math.pow(cy - center, 2));
              const scale = 1 - (d / (totalSize / 1.2)) * 0.25;
              ctx.arc(cx, cy, rad * scale, 0, Math.PI * 2);
              break;
            case 'liquid':
              ctx.roundRect(cx - s/2, cy - s/2, s, s, s * 0.45);
              break;
            case 'hexagon':
              for(let i=0; i<6; i++) {
                const a = i * Math.PI / 3;
                ctx[i === 0 ? 'moveTo' : 'lineTo'](cx + rad * Math.cos(a), cy + rad * Math.sin(a));
              }
              ctx.closePath();
              break;
            case 'rounded':
              ctx.roundRect(cx - s/2, cy - s/2, s, s, s * 0.25);
              break;
            case 'circle': case 'dot':
              ctx.arc(cx, cy, rad, 0, Math.PI * 2);
              break;
            default:
              ctx.rect(cx - s/2, cy - s/2, s, s);
          }
          ctx.fill();
        }
      }

      // 4. 绘制 Logo
      if (logoImg && config.logo.shape !== 'none') {
        ctx.save();
        ctx.beginPath();
        if (config.logo.shape === 'circle') ctx.arc(center, center, logoArea / 2, 0, Math.PI * 2);
        else ctx.roundRect(center - logoArea / 2, center - logoArea / 2, logoArea, logoArea, logoArea * 0.2);
        
        ctx.fillStyle = config.logo.isSyncBackground ? config.background.color : config.logo.backgroundColor;
        ctx.shadowColor = 'rgba(0,0,0,0.1)'; ctx.shadowBlur = 40;
        ctx.fill();
        ctx.clip();

        const aspect = logoImg.width / logoImg.height;
        let dw = logoArea, dh = logoArea;
        if (aspect > 1) dh = logoArea / aspect; else dw = logoArea * aspect;

        if (config.logo.isSyncTheme) {
          const off = document.createElement('canvas');
          off.width = dw; off.height = dh;
          const oCtx = off.getContext('2d');
          if (oCtx) {
            oCtx.drawImage(logoImg, 0, 0, dw, dh);
            oCtx.globalCompositeOperation = 'source-in';
            oCtx.fillStyle = config.dots.color;
            oCtx.fillRect(0, 0, dw, dh);
            ctx.drawImage(off, center - dw/2, center - dh/2, dw, dh);
          }
        } else {
          ctx.drawImage(logoImg, center - dw / 2, center - dh / 2, dw, dh);
        }
        ctx.restore();
      }

    } catch (e) { console.error("渲染失败:", e); }
  }, [config, logoImg, runDiagnostics]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `qrcode-architect-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    setIsRendering(true);
    const timer = setTimeout(() => { render(); setIsRendering(false); }, 50);
    return () => clearTimeout(timer);
  }, [render]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
      <div className="relative p-2 bg-white rounded-[3.8rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100/50">
        <div className="p-8 bg-white rounded-[3.2rem] relative overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-auto z-10 relative" />
          {isRendering && <div className="absolute inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={handleDownload}
          className="py-5 bg-slate-900 hover:bg-black text-white rounded-3xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
        >
          <Download size={16} strokeWidth={3} /> 下载作品
        </button>
        <div className="bg-white px-6 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
           <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">扫码成功率</span>
              <span className={`text-[11px] font-black ${analysis.color}`}>{analysis.status}</span>
           </div>
           <analysis.icon size={18} className={analysis.color} />
        </div>
      </div>
    </div>
  );
}
