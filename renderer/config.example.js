// Template cho config.js
// Copy thành `config.js` rồi điền keys của bạn.
// File `config.js` đã được .gitignore — không commit lên Git.
//
// Trên GitHub Actions: file config.js được TỰ TẠO từ Secrets khi build.
// Xem .github/workflows/build.yml để biết chi tiết.
window.DEFAULT_CONFIG = {
  apiKeys: {
    gemini: '',
    groq: '',
    openrouter: '',
  },
  provider: 'gemini',
  model: 'gemini-2.5-flash',
};
