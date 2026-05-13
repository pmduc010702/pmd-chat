# PMĐ Chat ✨

> **Floating AI Assistant** — by **Phan Minh Đức**

Trợ lý AI floating dạng Messenger trên Windows / macOS / Linux. Bubble nhỏ luôn nổi trên màn hình, click mở panel chat. Hỗ trợ **Gemini · Groq · OpenRouter**, voice tiếng Việt, screenshot, web search, image gen, templates.

---

## 🎯 Tính năng chính

### Core
- 🫧 **Floating bubble** luôn-trên-cùng, kéo thả tự do
- ⌨️ **Hotkey toàn cục**: `Ctrl+Shift+Space` (bật/tắt), `Ctrl+Shift+S` (screenshot)
- 🧠 **3 nhà cung cấp**: Gemini 2.5 Flash, Groq (Llama 3.3 70B), OpenRouter (DeepSeek, Llama, Qwen — free) — đã có sẵn key mặc định
- 🎭 **6 personas**: Trợ lý, Dịch giả, Biên tập, Lập trình viên, Bạn nói chuyện, Tutor tiếng Anh
- 💾 **Bộ nhớ dài hạn** — facts AI nhớ qua mọi chat
- 📜 **Multi-conversation** — lịch sử + sidebar + **tìm kiếm**
- 🎤 **Voice input** tiếng Việt (Web Speech API)
- 📝 **Markdown + code highlight**

### Tier 1 features (v1.1)
- ↻ **Regenerate** — làm lại câu trả lời AI (hover assistant message)
- ✎ **Edit & resend** — sửa tin nhắn user và gửi lại (hover user message)
- 🔍 **Search lịch sử** — tìm trong toàn bộ chat cũ (sidebar)
- 📤 **Export Markdown** — tải chat về `.md` (sidebar)
- 🔊 **TTS** — đọc to câu trả lời bằng giọng tiếng Việt
- 📊 **Token counter** — progress bar context usage

### 5 tính năng mới (v1.0)

#### 1. 📸 Screenshot region capture
Bấm `Ctrl+Shift+S` (hoặc icon máy ảnh trên header) → kéo chọn vùng → ảnh tự thêm vào chat. Hỏi AI "lỗi gì đây", "dịch caption này", "compose này có cân không".

#### 2. 📎 Upload PDF / Text file
Click icon kẹp giấy → chọn file `.pdf`, `.txt`, `.md`, `.csv`, `.json`, `.py`, code... Gemini đọc thẳng. Tối đa 20MB/file. Hỗ trợ multi-file.

#### 3. 🌐 Web search realtime (Gemini Grounding)
Click icon 🌐 trên header → bật web search. Câu trả lời sẽ kèm nguồn từ Google, real-time. **Chỉ hoạt động với Gemini.** Free luôn.

#### 4. 🏷️ Templates / Saved prompts
Gõ `@tên_mẫu` trong chat → autocomplete → Tab để chèn. Có sẵn 4 mẫu: `@email_từ_chối`, `@viết_caption`, `@tóm_tắt_bài`, `@review_code`. Thêm/sửa/xóa trong **Cài đặt → Mẫu**.

#### 5. 🎨 Image generation
Gõ `/ảnh <mô tả>` → AI tạo ảnh ngay (qua Pollinations.ai, free, không cần API key).
VD: `/ảnh hoàng hôn trên đại dương style watercolor`

---

## 🚀 Cài đặt

### Yêu cầu
- **Node.js 18+** (download: https://nodejs.org/)
- Không cần Rust, không cần Python, không cần gì khác

### Chạy
```bash
cd floating-ai-chat-electron
npm install
npm start
```

Lần đầu sẽ cài Electron (~150MB), mất 1-2 phút. Sau đó `npm start` mở app ngay.

### Build installer
```bash
# Windows .exe installer
npm run dist:win

# macOS .dmg
npm run dist:mac

# Linux AppImage + .deb
npm run dist:linux
```

File installer sẽ ở thư mục `dist/`.

---

## 🔑 API Keys

App cần ít nhất 1 key. Đã có sẵn key Gemini mặc định trong `renderer/config.js` (xóa và thay key của bạn).

| Provider | Free tier | Link lấy key |
|---|---|---|
| **Gemini** ⭐ | 1,500 req/ngày, có vision + PDF + web search | https://aistudio.google.com/apikey |
| Groq | Rất nhanh (500+ tok/s), text only | https://console.groq.com/keys |
| OpenRouter | Nhiều model free | https://openrouter.ai/keys |

**Khuyên Gemini** vì là provider duy nhất hỗ trợ đủ: vision, PDF, web search.

---

## ⌨️ Hotkeys & Commands

### Hotkeys toàn cục
| Phím | Chức năng |
|---|---|
| `Ctrl+Shift+Space` | Mở / ẩn bubble |
| `Ctrl+Shift+S` | Chụp vùng màn hình |

### Slash commands (gõ `/`)
| Lệnh | Tác dụng |
|---|---|
| `/dịch` | Dịch sang tiếng Việt tự nhiên |
| `/tóm` | Tóm tắt văn bản |
| `/viết` | Viết lại theo style yêu cầu |
| `/giải` | Giải thích đơn giản |
| `/code` | Trợ giúp lập trình |
| `/ảnh` | Tạo ảnh AI |

### Trong chat input
- `Enter` — gửi
- `Shift+Enter` — xuống dòng
- `Ctrl+V` — dán ảnh trực tiếp
- `/` đầu dòng — gợi ý lệnh
- `@` — gợi ý mẫu (templates)
- `Tab` — chấp nhận gợi ý đầu tiên

---

## 📁 Cấu trúc dự án

```
floating-ai-chat-electron/
├── main.js                    # Electron main process
├── preload.js                 # IPC bridge
├── package.json
├── assets/                    # Icons cho installer
│   ├── icon.png/ico/icns
└── renderer/
    ├── index.html             # React app (~1500 dòng, all-in-one)
    ├── config.js              # API keys mặc định
    └── screenshot.html        # Overlay chọn vùng screenshot
```

Tất cả frontend trong **1 file HTML** — React + Tailwind qua CDN, không có build step. Sửa code → reload app (`Ctrl+R` hoặc restart).

---

## 🛠️ Tinh chỉnh

### Thêm persona / lệnh / mẫu
Mở `renderer/index.html`, tìm:
- `const PERSONAS = [...]` — thêm/sửa nhân cách
- `const COMMANDS = [...]` — thêm slash command
- `const DEFAULT_TEMPLATES = [...]` — sửa mẫu mặc định

### Đổi kích thước bubble / panel
`main.js`:
```js
const BUBBLE = { width: 96, height: 96 };
const PANEL = { width: 420, height: 640 };
```

### Đổi hotkey
`main.js` — `globalShortcut.register('CommandOrControl+Shift+Space', ...)`

---

## 🐛 Troubleshooting

**"Cannot find module 'electron'"** → `npm install` lại

**Bubble không hiện** → Tray icon ở góc phải dưới (Windows), click vào hoặc check Task Manager

**Hotkey không hoạt động** → Có app khác chiếm tổ hợp đó? Đổi trong `main.js`

**Gemini lỗi 400** → Kiểm tra API key đúng, hoặc vượt quota (1500/ngày free)

**Screenshot đen / không capture được** → Trên macOS cần cấp quyền *Screen Recording* trong System Preferences

**Voice không nghe** → Chỉ chạy trên Chromium nên Electron OK. Cấp quyền micro cho app.

---

## 📜 License

MIT — by **Phan Minh Đức**

> Crafted with ❤️ in Vietnam · 2026
