# Visual Assets Directory (`public/assets/`)

Thư mục lưu trữ hình ảnh và tài nguyên thị giác dùng cho video trong **REMOTION-LC**.

---

## 📁 Cấu trúc thư mục

```text
public/assets/
├── images/             # Chứa hình ảnh chung (ảnh chụp màn hình, logo, tech icons, banner, minh họa...)
│   └── .gitkeep
└── {video_id}/         # (Tùy chọn) Chứa visual artifacts riêng biệt của từng video project
```

---

## 🚀 Cách sử dụng ảnh trong Remotion

Trong Remotion, tất cả file tĩnh trong thư mục `public/` được nạp thông qua hàm `staticFile()`.

### 1. Dùng thẻ `<Img />` của Remotion (Khuyến nghị)
Thẻ `<Img />` tự động đợi ảnh tải xong trước khi render frame, giúp tránh tình trạng chớp nháy hoặc khung hình trắng:

```tsx
import { Img, staticFile } from "remotion";

export const MyImageScene: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Img
        src={staticFile("assets/images/my-photo.png")}
        style={{
          maxWidth: "900px",
          maxHeight: "1200px",
          objectFit: "contain",
          borderRadius: 16,
        }}
      />
    </div>
  );
};
```

### 2. Định dạng được hỗ trợ
- `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`, `.gif`

> [!NOTE]
> Khi đặt ảnh vào thư mục `public/assets/images/ten_anh.png`, đường dẫn truyền vào `staticFile` sẽ là:
> `staticFile("assets/images/ten_anh.png")`
