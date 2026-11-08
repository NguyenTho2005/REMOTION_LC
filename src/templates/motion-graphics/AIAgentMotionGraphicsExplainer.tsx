import React from "react";
import {
  Composition,
  Sequence,
  Audio,
  staticFile,
} from "remotion";
import { S01Hook } from "./scenes/S01Hook";
import { S02ChatbotProblem } from "./scenes/S02ChatbotProblem";
import { S03AgentIntro } from "./scenes/S03AgentIntro";
import { S04Workflow } from "./scenes/S04Workflow";
import { S05PracticalExample } from "./scenes/S05PracticalExample";
import { S06ToolCalling } from "./scenes/S06ToolCalling";
import { S07MemoryContext } from "./scenes/S07MemoryContext";
import { S08MultiAgent } from "./scenes/S08MultiAgent";
import { S09Applications } from "./scenes/S09Applications";
import { S10LimitationsRisks } from "./scenes/S10LimitationsRisks";
import { S11HumanInLoop } from "./scenes/S11HumanInLoop";
import { S12Future } from "./scenes/S12Future";
import { S13Summary } from "./scenes/S13Summary";
import { S14Outro } from "./scenes/S14Outro";

export interface MotionSceneConfig {
  id: string;
  startFrame: number;
  durationInFrames: number;
  audioSrc: string;
  narration: string;
  Component: React.FC<{ text: string }>;
}

export const MOTION_SCENES: MotionSceneConfig[] = [
  {
    id: "S01",
    startFrame: 0,
    durationInFrames: 350,
    audioSrc: "audio/stickman/S01.wav",
    narration:
      "Hãy tưởng tượng bạn có một nhân viên làm việc hai mươi bốn giờ mỗi ngày, không cần nghỉ trưa, không phàn nàn và có thể xử lý hàng loạt công việc chỉ bằng vài dòng yêu cầu. Nghe giống khoa học viễn tưởng đúng không? Nhưng đây chính là ý tưởng đằng sau AI Agent.",
    Component: S01Hook,
  },
  {
    id: "S02",
    startFrame: 350,
    durationInFrames: 334,
    audioSrc: "audio/stickman/S02.wav",
    narration:
      "Thông thường, khi sử dụng AI chatbot, chúng ta đặt câu hỏi và nhận câu trả lời. Muốn làm việc tiếp theo, chúng ta lại phải nhập yêu cầu mới. AI chủ yếu phản hồi những gì được yêu cầu, chứ không tự động thực hiện toàn bộ quy trình thay chúng ta.",
    Component: S02ChatbotProblem,
  },
  {
    id: "S03",
    startFrame: 684,
    durationInFrames: 293,
    audioSrc: "audio/stickman/S03.wav",
    narration:
      "AI Agent được phát triển để giải quyết một phần hạn chế đó. Thay vì chỉ trả lời câu hỏi, nó có thể tiếp nhận một mục tiêu, phân tích công việc, lập kế hoạch và sử dụng các công cụ phù hợp để hoàn thành nhiệm vụ.",
    Component: S03AgentIntro,
  },
  {
    id: "S04",
    startFrame: 977,
    durationInFrames: 307,
    audioSrc: "audio/stickman/S04.wav",
    narration:
      "Hãy nhìn vào quy trình cơ bản. Đầu tiên, Agent nhận mục tiêu. Tiếp theo, nó phân tích yêu cầu và chia công việc thành từng bước. Sau đó, nó lựa chọn công cụ, thực hiện hành động, kiểm tra kết quả và điều chỉnh nếu cần thiết.",
    Component: S04Workflow,
  },
  {
    id: "S05",
    startFrame: 1284,
    durationInFrames: 384,
    audioSrc: "audio/stickman/S05.wav",
    narration:
      "Ví dụ, bạn yêu cầu Agent nghiên cứu một chủ đề và tạo báo cáo. Thay vì chỉ đưa ra vài gợi ý, Agent có thể tìm kiếm thông tin, đọc tài liệu, tổng hợp nội dung, tạo bản báo cáo và lưu kết quả vào một tệp. Tất nhiên, những thao tác quan trọng vẫn cần được kiểm tra.",
    Component: S05PracticalExample,
  },
  {
    id: "S06",
    startFrame: 1668,
    durationInFrames: 355,
    audioSrc: "audio/stickman/S06.wav",
    narration:
      "Một thành phần rất quan trọng là Tool Calling. AI Agent có thể sử dụng những công cụ được cấp quyền như trình duyệt, hệ thống tệp, cơ sở dữ liệu hoặc API. Nhờ đó, nó không chỉ tạo ra văn bản mà còn có thể tương tác với phần mềm bên ngoài.",
    Component: S06ToolCalling,
  },
  {
    id: "S07",
    startFrame: 2023,
    durationInFrames: 372,
    audioSrc: "audio/stickman/S07.wav",
    narration:
      "Nhưng nếu Agent không nhớ những gì đã làm trước đó thì sao? Đây là lúc Memory phát huy tác dụng. Bộ nhớ giúp hệ thống lưu lại thông tin liên quan, ghi nhận tiến trình và sử dụng ngữ cảnh từ những lần tương tác trước. Nhờ vậy, Agent có thể làm việc nhất quán hơn.",
    Component: S07MemoryContext,
  },
  {
    id: "S08",
    startFrame: 2395,
    durationInFrames: 365,
    audioSrc: "audio/stickman/S08.wav",
    narration:
      "Với những nhiệm vụ lớn hơn, chúng ta có thể xây dựng hệ thống nhiều Agent. Một Agent phụ trách nghiên cứu, một Agent viết nội dung, một Agent kiểm tra và một Agent tổng hợp kết quả. Chúng phối hợp với nhau dưới sự điều phối của một hệ thống trung tâm.",
    Component: S08MultiAgent,
  },
  {
    id: "S09",
    startFrame: 2760,
    durationInFrames: 350,
    audioSrc: "audio/stickman/S09.wav",
    narration:
      "AI Agent có thể được ứng dụng trong rất nhiều lĩnh vực. Ví dụ, hỗ trợ lập trình, phân tích dữ liệu, chăm sóc khách hàng, nghiên cứu tài liệu hay tự động hóa những công việc lặp đi lặp lại. Điều quan trọng là lựa chọn đúng nhiệm vụ và công cụ phù hợp.",
    Component: S09Applications,
  },
  {
    id: "S10",
    startFrame: 3110,
    durationInFrames: 322,
    audioSrc: "audio/stickman/S10.wav",
    narration:
      "Tuy nhiên, AI Agent không phải phép màu. Nó có thể hiểu sai yêu cầu, lựa chọn công cụ không phù hợp hoặc tạo ra kết quả thiếu chính xác. Nếu được cấp quyền quá rộng, một hành động sai cũng có thể gây ra hậu quả ngoài ý muốn.",
    Component: S10LimitationsRisks,
  },
  {
    id: "S11",
    startFrame: 3432,
    durationInFrames: 336,
    audioSrc: "audio/stickman/S11.wav",
    narration:
      "Vì vậy, Human in the Loop rất quan trọng. Con người vẫn cần kiểm tra, phê duyệt những hành động nhạy cảm và đánh giá kết quả cuối cùng. AI nên hỗ trợ con người làm việc hiệu quả hơn, chứ không có nghĩa là chúng ta giao toàn bộ quyền kiểm soát cho nó.",
    Component: S11HumanInLoop,
  },
  {
    id: "S12",
    startFrame: 3768,
    durationInFrames: 334,
    audioSrc: "audio/stickman/S12.wav",
    narration:
      "Trong tương lai, AI Agent có thể trở thành một lớp trợ lý thông minh nằm trong các phần mềm chúng ta sử dụng hằng ngày. Từ việc quản lý công việc, hỗ trợ phát triển phần mềm đến kết nối nhiều dịch vụ khác nhau, khả năng tự động hóa sẽ ngày càng mở rộng.",
    Component: S12Future,
  },
  {
    id: "S13",
    startFrame: 4102,
    durationInFrames: 394,
    audioSrc: "audio/stickman/S13.wav",
    narration:
      "Tóm lại, AI Agent không đơn thuần là một chatbot thông minh hơn. Nó là một hệ thống có khả năng tiếp nhận mục tiêu, lập kế hoạch, sử dụng công cụ, ghi nhớ ngữ cảnh và đánh giá kết quả. Đây chính là điểm khác biệt quan trọng giữa việc hỏi AI và giao một nhiệm vụ cho AI thực hiện.",
    Component: S13Summary,
  },
  {
    id: "S14",
    startFrame: 4496,
    durationInFrames: 276,
    audioSrc: "audio/stickman/S14.wav",
    narration:
      "Bạn nghĩ AI Agent sẽ thay đổi công việc nào đầu tiên? Hãy để lại ý kiến ở phần bình luận. Nếu muốn khám phá thêm những công nghệ AI mới, hãy theo dõi kênh để không bỏ lỡ những video tiếp theo nhé!",
    Component: S14Outro,
  },
];

export const TOTAL_MOTION_FRAMES = 4772; // ~159.08 seconds @ 30 FPS

export const AIAgentMotionGraphicsExplainer: React.FC = () => {
  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#080c18",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {MOTION_SCENES.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationInFrames}
          name={`${scene.id} - ${scene.narration.slice(0, 25)}...`}
        >
          {/* Motion Graphics Scene Component */}
          <scene.Component text={scene.narration} />

          {/* Voice Narration Audio */}
          <Audio src={staticFile(scene.audioSrc)} />
        </Sequence>
      ))}
    </div>
  );
};

export const AIAgentMotionGraphicsExplainerComposition: React.FC = () => {
  return (
    <Composition
      id="AIAgentMotionGraphicsExplainer"
      component={AIAgentMotionGraphicsExplainer}
      durationInFrames={TOTAL_MOTION_FRAMES}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
  );
};
