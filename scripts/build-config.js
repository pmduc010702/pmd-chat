// Tạo renderer/config.js từ environment variables.
// Chạy bởi GitHub Actions trước khi build EXE/DMG.
// Local dev không cần chạy script này — tạo config.js thủ công.

const fs = require('fs');
const path = require('path');

const config = {
  apiKeys: {
    gemini: process.env.GEMINI_API_KEY || '',
    groq: process.env.GROQ_API_KEY || '',
    openrouter: process.env.OPENROUTER_API_KEY || '',
  },
  provider: 'gemini',
  model: 'gemini-2.5-flash',
};

const content =
`// Tự động tạo bởi scripts/build-config.js
// KHÔNG sửa trực tiếp file này.
window.DEFAULT_CONFIG = ${JSON.stringify(config, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'renderer', 'config.js');
fs.writeFileSync(outputPath, content);

// Log keys hiện diện (KHÔNG log giá trị thật):
const summary = Object.entries(config.apiKeys)
  .map(([k, v]) => `${k}: ${v ? '✓ (set)' : '✗ (empty)'}`)
  .join(', ');
console.log(`Generated renderer/config.js [${summary}]`);
