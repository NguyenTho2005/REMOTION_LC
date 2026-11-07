# Voice Guidelines — ZeroTTS Integration

## Official Voice Matching Matrix

| Voice ID | Display Name | Gender | Optimal Content Category | Tone & Style |
|---|---|---|---|---|
| `quangminh` | Quang Minh | Nam | Tech News, AI News | Rõ ràng, dứt khoát, tin tức công nghệ hiện đại |
| `baotrang` | Bảo Trang | Nữ | AI News, Official Releases | Trưởng thành, chuyên nghiệp, trung tính |
| `tiendat` | Tiến Đạt | Nam | AI Tool Review, GitHub Showcase | Sôi nổi, năng lượng cao, lôi cuốn |
| `giahuy` | Gia Huy | Nam | Tech Explainer, Deep Dives | Trầm ấm, tâm tình, giải thích chi tiết |
| `maichi` | Mai Chi | Nữ | AI Explainer, Tutorials | Trẻ trung, nhẹ nhàng, thân thiện |
| `huuduc` | Hữu Đức | Nam | Historical Tech, Deep Architecture | Điềm đạm, lớn tuổi, truyền cảm |
| `kimoanh` | Kim Oanh | Nữ | Tech Storytelling | Ấm áp, truyền cảm hứng |
| `hamy` | Hà My | Nữ | Quick Tips, Creative AI | Cao, biểu cảm, hoạt họa |

## Speech Quality Principles
1. **Pronunciation & Acronyms:** ZeroTTS normalizer expands standard acronyms (e.g. AI -> Ây Ai, API, GPU, RAM). Keep technical loan words clean.
2. **Chunking Limit:** Max chunk duration is 15 seconds. Divide scripts at punctuation boundaries (`.`, `!`, `?`).
3. **Consistency:** All narration segments for a video must use the same `voice_id` to preserve speaker identity.
