
export type DotType = 'square' | 'circle' | 'rounded' | 'radial' | 'star' | 'diamond' | 'hexagon' | 'triangle' | 'eye' | 'eye-fancy' | 'dot' | 'cross' | 'ring' | 'liquid';
export type CornerType = 'square' | 'rounded' | 'extra-rounded' | 'eye' | 'eye-fancy' | 'dot' | 'leaf' | 'shield' | 'ninja' | 'eye-almond' | 'single-rounded';
export type LogoShape = 'circle' | 'square' | 'rounded-square' | 'ellipse' | 'triangle' | 'none';

export interface QRConfig {
  data: string;
  image?: string;
  width: number;
  height: number;
  margin: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  dots: {
    type: DotType;
    color: string;
  };
  background: {
    color: string;
    opacity: number;
  };
  corners: {
    type: CornerType;
    outerColor: string;
    innerColor: string;
  };
  logo: {
    size: number;
    padding: number;
    shape: LogoShape;
    backgroundColor: string;
    isSyncBackground: boolean;
    isSyncTheme: boolean; 
  };
}

export const DEFAULT_CONFIG: QRConfig = {
  data: 'https://gemini.google.com',
  width: 1200,
  height: 1200,
  margin: 40,
  errorCorrectionLevel: 'H',
  dots: {
    type: 'radial',
    color: '#6366f1',
  },
  background: {
    color: '#ffffff',
    opacity: 1,
  },
  corners: {
    type: 'eye',
    outerColor: '#6366f1',
    innerColor: '#6366f1',
  },
  logo: {
    size: 0.22,
    padding: 10,
    shape: 'rounded-square',
    backgroundColor: '#ffffff',
    isSyncBackground: true,
    isSyncTheme: true,
  },
};

export const STYLE_PRESETS: Array<{
  name: string;
  config: {
    dots: { type: DotType; color: string };
    corners: { type: CornerType; outerColor: string; innerColor: string };
    background: { color: string; opacity: number };
  };
}> = [
  {
    name: '工业级扫码王',
    config: {
      dots: { type: 'radial', color: '#000000' },
      corners: { type: 'eye', outerColor: '#000000', innerColor: '#000000' },
      background: { color: '#ffffff', opacity: 1 }
    }
  },
  {
    name: '极简商务 (圆角)',
    config: {
      dots: { type: 'rounded', color: '#1a1a1a' },
      corners: { type: 'rounded', outerColor: '#000000', innerColor: '#000000' },
      background: { color: '#ffffff', opacity: 1 }
    }
  }
];
