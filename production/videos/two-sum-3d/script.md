# TWO SUM — 3D ALGORITHM EXPLAINER (SCREENPLAY)
**Định dạng:** 1080 × 1920 (9:16 Vertical) · 30 FPS · Thời lượng: ~95–105s  
**Giọng đọc:** ZeroTTS (`quangminh`)  
**Phong cách:** Cinematic 3D Educational Motion Graphics + Three.js  

---

### CẢNH 1 — HOOK (00:00 - 00:10)
- **Visual 3D:** Mảng 3D số nguyên `[2, 7, 11, 15]` lơ lửng giữa không gian số. Hai con trỏ quét đỏ và xanh quét liên tục chậm chạp qua từng cặp số. Bên phải, một bảng Hash Map phát sáng vàng với một đường dây liên kết tức thì.
- **Camera:** Dolly pan từ góc nghiêng 3D vào trung tâm khối mảng.
- **Narration:**
  "Nếu bạn đi phỏng vấn lập trình, gần như chắc chắn sẽ gặp bài toán Two Sum. Nhưng tại sao có người mất O n bình phương, trong khi cao thủ chỉ giải trong một vòng lặp?"

---

### CẢNH 2 — ĐỀ BÀI TWO SUM (00:10 - 00:19)
- **Visual 3D:** Khối mảng số `[2, 7, 11, 15]` nổi bật rõ từng ô: số 2 (index 0), số 7 (index 1), số 11 (index 2), số 15 (index 3). Mục tiêu `Target = 9` xuất hiện phía trên với ánh hào quang vàng. Hai khối ô 2 và 7 nhấc bổng lên và xoay nhẹ.
- **Camera:** Góc nhìn chính diện thẳng vào mảng và chỉ số index.
- **Narration:**
  "Đề bài cho một mảng số nguyên và một mục tiêu target. Nhiệm vụ của bạn là tìm vị trí của hai số có tổng đúng bằng target. Nhớ kỹ nhé, chúng ta cần trả về chỉ số index, chứ không phải giá trị của số đó."

---

### CẢNH 3 — BRUTE FORCE (VÉT CẠN) (00:19 - 00:30)
- **Visual 3D:** Hai con trỏ 3D: Con trỏ $i$ màu xanh lam ghim tại ô index 0 (giá trị 2). Con trỏ $j$ màu san hô đỏ chạy lần lượt qua index 1 (7), index 2 (11), index 3 (15). Phép cộng $2 + 7 = 9$ khớp, nhưng thuật toán vét cạn vẫn phải chuẩn bị quét toàn bộ trường hợp xấu nhất.
- **Camera:** Camera tracking theo chuyển động của con trỏ $j$.
- **Narration:**
  "Cách trực quan nhất là thử mọi cặp số bằng hai vòng lặp lồng nhau. Con trỏ i đứng ở phần tử đầu tiên, con trỏ j chạy quét qua tất cả các phần tử còn lại để tính tổng."

---

### CẢNH 4 — TẠI SAO O(N²)? (00:30 - 00:40)
- **Visual 3D:** Mảng 3D biến đổi thành một Ma trận so sánh 3D tam giác (Comparison Matrix). Khi số phần tử $n$ tăng lên từ 4 lên 10.000, số lượng ô kiểm tra bùng nổ thành một kim tự tháp khối hộp khổng lồ.
- **Camera:** Camera kéo lùi nhanh (wide pull-back) thể hiện sự bùng nổ dữ liệu.
- **Narration:**
  "Với bốn phần tử, số phép so sánh chưa nhiều. Nhưng khi mảng có mười nghìn số, hai vòng lặp này sẽ thực hiện gần năm mươi triệu phép tính. Thời gian O n bình phương sẽ khiến hệ thống nghẽn lại."

---

### CẢNH 5 — Ý TƯỞNG HASH MAP (00:40 - 00:50)
- **Visual 3D:** Một bảng lưu trữ 3D hiện đại màu xanh ngọc xuất hiện bên cạnh mảng: Bảng Hash Map với hai cột `Key (Giá trị)` và `Value (Chỉ số)`. Một viên gạch số di chuyển vào bảng, tượng trưng cho việc "ghi nhớ".
- **Camera:** Camera chuyển động quỹ đạo orbit 45 độ mượt mà.
- **Narration:**
  "Để tối ưu, hãy thay đổi góc nhìn. Thay vì mải miết đi tìm số thứ hai ở tương lai, tại sao không ghi nhớ những số ta đã từng đi qua? Đó chính là lúc Hash Map xuất hiện."

---

### CẢNH 6 — PHÉP TÍNH BÙ (COMPLEMENT) (00:50 - 01:03)
- **Visual 3D:** Công thức toán học $9 - \text{current} = \text{complement}$ bay ra.
  - Bước 1: $9 - 2 = 7$. Tra bảng trống -> Thêm thẻ `2 → index 0` vào Hash Map.
  - Bước 2: Bước sang số 7, $9 - 7 = 2$. Tra bảng -> Phát hiện số 2 đã nằm sẵn ở index 0!
- **Camera:** Zoom cận cảnh vào công thức và ô Hash Map phát sáng khi tra cứu trúng.
- **Narration:**
  "Với mỗi số hiện tại, ta chỉ cần tìm phần bù bằng target trừ đi chính nó. Tại số hai, phần bù là bảy. Bảng đang trống, ta lưu hai vào vị trí số không. Bước sang số bảy, phần bù là hai. Tra vào bảng: số hai đã có sẵn ở vị trí số không!"

---

### CẢNH 7 — KHỚP KẾT QUẢ HOÀN HẢO (01:03 - 01:13)
- **Visual 3D:** Hai khối ô số 2 và 7 bay lại gần nhau, hợp nhất tỏa sáng hiệu ứng thành công. Banner kết quả `indices = [0, 1]` xuất hiện với hai đường dây nối trực tiếp về vị trí gốc trên mảng.
- **Camera:** Slow dolly in với góc nhìn đầy thỏa mãn thị giác.
- **Narration:**
  "Bùm! Hai cộng bảy đúng bằng chín. Ta lấy ngay được chỉ số không từ bảng và chỉ số một hiện tại. Kết quả là mảng không, một. Cực kỳ nhanh gọn chỉ với một lần duyệt duy nhất!"

---

### CẢNH 8 — NHỮNG CÁI BẪY PHỔ BIẾN (01:13 - 01:26)
- **Visual 3D:** Ba biểu tượng cảnh báo: Trả về giá trị thay vì chỉ số (hiển thị gạch chéo đỏ trên `[2, 7]`). Ví dụ mảng trùng lặp `[3, 3]` với target 6: khối số 3 tự nối với chính nó gây lỗi lặp phần tử. Khối Hash Map minh họa việc kiểm tra phần bù TRƯỚC KHI lưu vào bảng.
- **Camera:** Split view hoặc chuyển động pan 3 bước nhanh, dứt khoát.
- **Narration:**
  "Có ba cái bẫy lớn: trả về giá trị thay vì chỉ số; tái sử dụng chính một phần tử hai lần; và xử lý trùng lặp như mảng ba, ba mục tiêu sáu. Nếu bạn thêm vào bảng trước khi kiểm tra, số ba sẽ tự bắt cặp với chính nó!"

---

### CẢNH 9 — SO SÁNH ĐỘ PHỨC TẠP (01:26 - 01:36)
- **Visual 3D:** Hai bảng so sánh 3D đối xứng:
  - Bên trái: Vét cạn (Time: O(n²) đỏ rực, Space: O(1) xanh lá).
  - Bên phải: Hash Map (Time: O(n) xanh lá tốc độ cao, Space: O(n) tiêu tốn thêm bộ nhớ).
- **Camera:** Camera cân bằng đối xứng hai cột.
- **Narration:**
  "Hãy nhìn sự khác biệt: Vét cạn tốn O n bình phương thời gian nhưng chỉ O một bộ nhớ. Hash Map chỉ mất O n thời gian nhờ đánh đổi thêm O n không gian lưu trữ. Đây là sự đánh đổi kinh điển trong khoa học máy tính."

---

### CẢNH 10 — TỔNG KẾT & CTA (01:36 - 01:46)
- **Visual 3D:** Mảng 3D quay trở lại rực rỡ, vòng lặp xanh ngọc lướt qua một lượt nhẹ nhàng. Logo kênh DevPeek36 và nút Subscribe 3D xuất hiện ấn tượng.
- **Camera:** Pull-back cinematic xoay nhẹ 15 độ nâng dần lên cao.
- **Narration:**
  "Đừng vét cạn mọi cặp số, hãy nhớ lại quá khứ và tìm kiếm phần bù. Đăng ký kênh DevPeek36 để làm chủ các thuật toán LeetCode tiếp theo nhé!"
