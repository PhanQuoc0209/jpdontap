# Manabi Wukong (悟空日本語) — Web & App Học Tiếng Nhật Kết Hợp Game

Ứng dụng web và mobile app học tiếng Nhật kết hợp Game RPG Vượt ải, được chuyển thể và nâng cấp từ mô hình học tập tương tác của **Pandarin** (App Store) và tích hợp toàn bộ dataset giáo trình tiếng Nhật từ **Manabiman** (JPD113, JPD123, JPD133, Bảng chữ cái Hiragana/Katakana, Hán tự, Ngữ pháp).

Linh thú đồng hành xuyên suốt ứng dụng là **TÔN NGỘ KHÔNG (Sun Wukong)** với Vòng Kim Cô, Gậy Như Ý, Cân Đẩu Vân và các đòn đánh võ thuật huyền thoại!

---

## 🌟 Điểm Nổi Bật & Tính Năng Chuyển Thể

### 1. Linh Thú Đồng Hành: Tôn Ngộ Không (Mascot)
- Thay thế linh thú Panda trong ứng dụng gốc bằng **Tôn Ngộ Không** (Sun Wukong / Mỹ Hầu Vương).
- Đồ hoạ vector tương tác đa biểu cảm:
  - `idle`: Lướt trên Cân Đẩu Vân, quay gậy Như Ý, nhắc nhở học viên.
  - `attack`: Vung Kim Cô Bổng tung chưởng khi người chơi trả lời trắc nghiệm đúng.
  - `happy`: Nhảy cẫng ăn Đào Tiên (🍑), bắn pháo hoa khi vượt ải.
  - `hurt`: Bị choáng váng khi người chơi trả lời sai.
  - Tương tác chạm: Bấm vào Ngộ Không trên trang chủ để nghe thoại động viên.

### 2. Chế Độ Game: Tây Du Hàng Ma — Đấu Boss Vượt Ải (`/boss-battle`)
*Mô phỏng 100% cơ chế Boss Journey của Pandarin:*
- **8 Đại Yêu Vương**:
  1. *Lv.1 Xích Hỏa Long (赤火竜)* — Rồng lửa Núi Hoa Quả Sơn
  2. *Lv.2 Hoàng Phong Ma Quái (黄風怪)* — Cuồng phong Sa Mạc
  3. *Lv.3 Bạch Cốt Tinh (白骨精)* — Yêu quái biến hóa
  4. *Lv.4 Kim Giác & Ngân Giác (金角・銀角)* — Tử Kim Hồ Lô
  5. *Lv.5 Hồng Hài Nhi (紅孩児)* — Tam Muội Chân Hỏa
  6. *Lv.6 Ngưu Ma Vương (牛魔王)* — Hỏa Diệm Sơn
  7. *Lv.7 Cửu Vĩ Linh Hồ (九尾の狐)* — Mê Hồn Sơn Các
  8. *Lv.8 Đại Bàng Kim Sí Điểu (金翅大鵬)* — Cửa Ải Tây Thiên
- **Thanh máu HP đối kháng**: Boss HP (100–380) vs Ngộ Không HP (100).
- **Hệ thống Combo**: Đúng liên tiếp tăng combo 🔥 (x1, x2, x3... cộng sát thương).
- **Hệ thống câu hỏi**: Trắc nghiệm từ vựng, chữ Hán, ngữ pháp, có nút nghe phát âm tiếng Nhật giọng bản xứ (TTS).
- **Phần thưởng vượt ải**: Tích lũy Điểm kinh nghiệm (XP) và Đào Tiên (🍑) để nâng cấp danh hiệu.

### 3. Học Flashcards & Ghi Nhớ Ngắt Quãng SRS (`/flashcards`)
- Giao diện lật thẻ 3D mượt mà (chạm để lật 2 mặt: Mặt trước hiển thị Chữ Hán/Kana/Romaji + Audio; Mặt sau hiển thị nghĩa tiếng Việt, mẹo liên tưởng của Ngộ Không).
- Hệ thống đánh giá 3 mức độ: *Chưa nhớ* (lặp lại sau 1p), *Tạm nhớ* (lặp lại sau 10p), *Thuộc làu* (lặp lại sau 1 ngày).
- Thống kê thời gian thực: Thẻ đến hạn, Thẻ mới, Đang học, Đã nhớ.

### 4. Luyện Viết Chữ Hán Từng Nét Chuẩn (`/luyen-viet`)
- Khung vẽ Canvas lưới 4 ô mễ tự (Tianzige / Genkouyoushi) chuẩn thư pháp.
- Hướng dẫn nét vẽ mờ (ghost stroke) và điểm xung nhịp hướng dẫn di chuyển bút.
- Hiển thị đầy đủ số nét, âm Hán Việt, nghĩa, Onyomi, Kunyomi và phát âm.

### 5. Luyện Phát Âm & Shadowing Cùng Ngộ Không (`/phat-am`)
- Nghe mẫu phát âm tiếng Nhật giọng chuẩn bằng Web Speech Synthesis.
- Nút Micro thu âm và nhận diện giọng nói tiếng Nhật (Web Speech Recognition API), tự động chấm điểm độ chính xác (0-100%) và phản hồi.

### 6. Minigame Mưa Chữ — 文字の雨 (`/mua-chu`)
- Chữ Kana và từ vựng rơi tự do từ trên bầu trời với tốc độ tăng dần.
- Người chơi gõ Romaji hoặc chọn đáp án để Ngộ Không vung gậy Như Ý phá vỡ trước khi chạm đất.
- Tính điểm, đếm mạng sống (❤️ x3) và lưu chuỗi combo.

### 7. Bản Đồ Học Tập Giáo Trình Chuẩn (`/hoc-tap`)
- **Bảng chữ cái (Nhập môn)**: 103 chữ Hiragana + 103 chữ Katakana, đầy đủ Chữ thuần (Gozyuuon), Âm đục (Dakuten), Âm ghép (Yoon), kèm mẹo hình ảnh liên tưởng (mnemonic), emoji, keyword tiếng Việt và phát âm.
- **JPD113 (Nhật 1)**: 11 bài học (Chào hỏi, Tuổi tác, Ngày tháng, Sở thích, Mua sắm, Đồ ăn, Giờ giấc, Hoạt động, Sinh hoạt...).
- **JPD123 (Nhật 2)**: 12 bài học (Phương tiện, Tính từ miêu tả, Thời tiết, Vị giác, Cảm xúc, Rủ rê, So sánh, Ẩm thực, Vị trí...).
- **JPD133 (Nhật 3)**: 12 bài học (Gia đình, Ngoại hình, Cho nhận, Đơn vị đếm, Câu lạc bộ, Thủ tục giấy tờ, Chỉ đường, Bệnh trạng, Thi cử...).
- **Hán tự (Kanji)**: 31 chữ Hán N5 căn bản, phân tích số nét, bộ thủ, On/Kun, từ ghép mẫu.
- **Ngữ pháp (Grammar)**: 10 mẫu câu ngữ pháp cốt lõi có công thức, giải thích tiếng Việt và câu ví dụ song ngữ Nhật - Việt.

---

## 📁 Cấu Trúc Dự Án

```
d:\Pj\JPD/
├── data/                      # Toàn bộ dataset trích xuất từ manabiman.io.vn
│   ├── alphabet.json          # 103 Hiragana + 103 Katakana + gợi ý liên tưởng
│   ├── vocabulary.json        # 335 từ vựng chia theo 35 units JPD113-123-133
│   ├── kanji.json             # Danh mục chữ Hán N5 chi tiết
│   ├── grammar.json           # Mẫu ngữ pháp & câu ví dụ song ngữ
│   └── bosses.json            # 8 Boss Tây Du Ký và thông số màn đấu
├── src/
│   ├── app/
│   │   ├── page.tsx           # Trang chủ (Mission board, Thống kê, Luyện nhanh)
│   │   ├── boss-battle/       # Màn đấu Boss vượt ải (Pandarin clone)
│   │   ├── hoc-tap/           # Bản đồ học tập & bảng chữ cái
│   │   ├── flashcards/        # Lật thẻ SRS thông minh
│   │   ├── luyen-viet/        # Luyện viết chữ Hán canvas mễ tự
│   │   ├── phat-am/           # Luyện phát âm & Shadowing qua Micro
│   │   ├── mua-chu/           # Minigame Mưa chữ rơi
│   │   ├── ca-nhan/           # Hồ sơ học viên & danh hiệu Ngộ Không
│   │   ├── globals.css        # Thiết kế Tailwind v4 phong cách Wabi-sabi + Thần thoại
│   │   └── layout.tsx         # Layout khung App chuẩn mobile-first
│   ├── components/
│   │   ├── WukongMascot.tsx   # Linh thú Ngộ Không đa biểu cảm & cử động
│   │   ├── TopHeader.tsx      # Thanh trạng thái (Streak, Đào Tiên, XP)
│   │   └── Navbar.tsx         # Thanh điều hướng 5 tab chuẩn App di động
│   └── lib/
│       ├── dataset.ts         # Khởi tạo và phân loại dữ liệu học tập
│       ├── sound.ts           # Tổng hợp âm thanh chiến đấu & Web Speech TTS
│       └── utils.ts           # Utility helper
└── package.json
```

---

## 🚀 Hướng Dẫn Chạy Ứng Dụng

### Khởi động môi trường phát triển (Dev server)
```bash
npm run dev
```
Truy cập vào trình duyệt: `http://localhost:3000`

### Kiểm tra TypeScript & Build sản phẩm
```bash
npm run typecheck
npm run build
npm start
```
