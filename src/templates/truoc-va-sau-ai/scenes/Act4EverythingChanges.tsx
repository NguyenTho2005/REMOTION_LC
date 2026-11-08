import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { FILM_COLORS } from "../design-tokens";
import { PaperBackground } from "../components/PaperBackground";
import { SecondaryCharacter, SecondaryCharacterType } from "../character/SecondaryCharacters";

interface StoryCard {
  type: SecondaryCharacterType;
  title: string;
  role: string;
  detail: string;
  accentColor: string;
  icon: string;
  start: number;
  end: number;
}

const stories: StoryCard[] = [
  {
    type: "student",
    title: "Bạn Sinh Viên",
    role: "Học tập & Nghiên cứu",
    detail: "Hiểu khái niệm toán học phức tạp như giải thích cho đứa trẻ lên năm",
    accentColor: FILM_COLORS.studentHoodie,
    icon: "🎓",
    start: 120,
    end: 480,
  },
  {
    type: "programmer",
    title: "Lập Trình Viên",
    role: "Phát triển phần mềm",
    detail: "Biến ý tưởng thành sản phẩm mẫu chỉ sau một buổi chiều cuối tuần",
    accentColor: "#4F46E5",
    icon: "💻",
    start: 480,
    end: 840,
  },
  {
    type: "business_owner",
    title: "Chủ Tiệm Nhỏ",
    role: "Kinh doanh & Khởi nghiệp",
    detail: "Tự viết bài quảng cáo, tự làm thực đơn mà không cần đội ngũ đắt đỏ",
    accentColor: FILM_COLORS.warmYellow,
    icon: "☕",
    start: 840,
    end: 1200,
  },
  {
    type: "designer",
    title: "Nhà Thiết Kế",
    role: "Sáng tạo nghệ thuật",
    detail: "Thử nghiệm hai mươi biến thể màu sắc và bố cục trong chớp mắt",
    accentColor: FILM_COLORS.coral,
    icon: "🎨",
    start: 1200,
    end: 1560,
  },
  {
    type: "elder",
    title: "Người Lớn Tuổi",
    role: "Kết nối gia đình",
    detail: "Tự tin viết thư cảm ơn ấm áp và trang trọng gửi con cháu phương xa",
    accentColor: FILM_COLORS.elderSweater,
    icon: "💌",
    start: 1560,
    end: 1920,
  },
];

export const Act4EverythingChanges: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 1950

  // Title Card animation
  const titleSpring = spring({
    frame: frame - 15,
    fps: 30,
    config: { damping: 14, stiffness: 100 },
  });
  const titleOpacity = interpolate(frame, [15, 35, 120, 150], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        width: 1920,
        height: 1080,
        overflow: "hidden",
      }}
    >
      <PaperBackground ambient="morning" showGrid={true}>
        {/* Gallery / Story Cards Showcase */}
        {stories.map((story) => {
          const isVisible = frame >= story.start && frame <= story.end;
          if (!isVisible) return null;

          const progress = (frame - story.start) / (story.end - story.start);
          const cardSpring = spring({
            frame: frame - story.start,
            fps: 30,
            config: { damping: 13, stiffness: 120 },
          });

          const opacity = interpolate(
            progress,
            [0, 0.1, 0.85, 1],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={story.type}
              style={{
                position: "absolute",
                top: 200,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                opacity,
                transform: `scale(${cardSpring})`,
                zIndex: 20,
              }}
            >
              <div
                style={{
                  backgroundColor: FILM_COLORS.stickerWhite,
                  border: `5px solid ${FILM_COLORS.ink}`,
                  borderRadius: 36,
                  padding: "48px 64px",
                  boxShadow: `0 24px 60px ${FILM_COLORS.stickerShadow}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 56,
                  maxWidth: 1200,
                  width: "90%",
                }}
              >
                {/* Character Illustration Sticker */}
                <div
                  style={{
                    backgroundColor: story.accentColor + "22",
                    border: `4px solid ${FILM_COLORS.ink}`,
                    borderRadius: 28,
                    padding: "24px 32px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <SecondaryCharacter type={story.type} scale={1.4} />
                  <div
                    style={{
                      marginTop: 12,
                      backgroundColor: story.accentColor,
                      color: FILM_COLORS.stickerWhite,
                      fontWeight: 900,
                      fontSize: 18,
                      padding: "4px 16px",
                      borderRadius: 16,
                      border: `2px solid ${FILM_COLORS.ink}`,
                    }}
                  >
                    {story.icon} {story.role}
                  </div>
                </div>

                {/* Narrative Description */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: story.accentColor,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {story.role}
                  </div>
                  <div
                    style={{
                      fontSize: 48,
                      fontWeight: 900,
                      color: FILM_COLORS.ink,
                      marginBottom: 18,
                      fontFamily: "sans-serif",
                    }}
                  >
                    {story.title}
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      lineHeight: 1.5,
                      fontWeight: 600,
                      color: FILM_COLORS.inkSubtle,
                      fontFamily: "sans-serif",
                    }}
                  >
                    &ldquo;{story.detail}&rdquo;
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Small Progress Dots for the 5 Stories */}
        <div
          style={{
            position: "absolute",
            bottom: 220,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {stories.map((story) => {
            const isActive = frame >= story.start && frame <= story.end;
            return (
              <div
                key={`dot-${story.type}`}
                style={{
                  width: isActive ? 40 : 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: isActive ? story.accentColor : FILM_COLORS.paperDark,
                  border: `2px solid ${FILM_COLORS.ink}`,
                }}
              />
            );
          })}
        </div>

        {/* Act Title Card */}
        {frame < 180 && (
          <div
            style={{
              position: "absolute",
              top: 80,
              left: 120,
              opacity: titleOpacity,
              transform: `translateY(${(1 - titleSpring) * -30}px)`,
            }}
          >
            <div
              style={{
                backgroundColor: FILM_COLORS.sageGreen,
                color: FILM_COLORS.stickerWhite,
                padding: "8px 24px",
                borderRadius: 12,
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: "0.08em",
                border: `3px solid ${FILM_COLORS.ink}`,
                boxShadow: `0 6px 16px ${FILM_COLORS.stickerShadow}`,
                display: "inline-block",
              }}
            >
              HỒI 4 · VẠN VẬT ĐỔI THAY
            </div>
          </div>
        )}
      </PaperBackground>
    </div>
  );
};
