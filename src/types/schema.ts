export type VisualAnimationType =
  | 'svg_self_draw'       // Vẽ nét SVG từ từ theo tiến độ giọng đọc
  | 'rough_flowchart'     // Sơ đồ khối vẽ tay nối tiếp nhau bằng mũi tên
  | 'kinetic_sketch_text' // Chữ viết tay kết hợp gạch chân/khoanh tròn bằng bút dạ
  | 'split_comparison'    // Chia đôi màn hình so sánh Before/After hoặc A/B
  | 'diagram_zoom_pan';   // Phóng to/di chuyển camera trên một bản vẽ lớn

export interface CaptionChunk {
  id: string;
  text: string;
  startSec: number;
  endSec: number;
  startFrame: number;
  endFrame: number;
  highlightWords: string[]; // Các từ khóa cần tô màu bút dạ (highlighter)
}

export interface VisualElementSpec {
  type: VisualAnimationType;
  title: string;
  svgConceptDescription: string; // Mô tả chi tiết hình vẽ để code thành SVG/RoughJS
  accentColor: '#D94E34' | '#2B5B6C' | '#E5A93C';
  triggerAtFrameOffset: number; // Frame bắt đầu chạy hiệu ứng vẽ trong scene
}

export interface SceneManifest {
  sceneId: string;
  sceneIndex: number;
  voiceoverText: string;
  audioFilePath: string; // Ví dụ: "/audio/scene_01.mp3"
  durationInSeconds: number;
  durationInFrames: number;
  startFrameGlobal: number;
  visualSpec: VisualElementSpec;
  captions: CaptionChunk[];
}

export interface VideoProjectManifest {
  projectTitle: string;
  fps: 30;
  width: 1080;
  height: 1920;
  totalDurationInSeconds: number;
  totalDurationInFrames: number; // Phải < 3600 (dưới 2 phút)
  theme: {
    background: string;
    inkColor: string;
    fontHeading: string;
    fontBody: string;
  };
  scenes: SceneManifest[];
}
