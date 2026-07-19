const palettes = [
  ['#183b4e', '#2f6f7e'],
  ['#4c2f5f', '#81538f'],
  ['#4a3d24', '#8d713b'],
  ['#223e33', '#3c735d'],
  ['#3d2c2e', '#8b5459'],
  ['#26345c', '#526ca8'],
];

const escapeXml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const splitTitle = (title) => {
  const words = String(title || 'Untitled').trim().split(/\s+/);
  const lines = [];
  let current = '';

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > 18 && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  });

  if (current) lines.push(current);
  return lines.slice(0, 3);
};

export const getBookCover = (book = {}) => {
  if (book.coverUrl) return book.coverUrl;

  const key = Number(book.id || String(book.title || '').length || 1);
  const [start, end] = palettes[Math.abs(key) % palettes.length];
  const titleLines = splitTitle(book.title);
  const titleMarkup = titleLines
    .map(
      (line, index) =>
        `<text x="50%" y="${45 + index * 10}%" text-anchor="middle" fill="#ffffff" font-size="18" font-family="Arial, sans-serif" font-weight="700">${escapeXml(line)}</text>`,
    )
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="360" height="520" viewBox="0 0 360 520">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${start}" />
          <stop offset="1" stop-color="${end}" />
        </linearGradient>
      </defs>
      <rect width="360" height="520" rx="20" fill="url(#g)" />
      <rect x="28" y="28" width="304" height="464" rx="14" fill="none" stroke="rgba(255,255,255,.24)" stroke-width="2" />
      <text x="50%" y="22%" text-anchor="middle" fill="rgba(255,255,255,.72)" font-size="14" font-family="Arial, sans-serif" letter-spacing="3">LIBRARY</text>
      ${titleMarkup}
      <line x1="105" y1="72%" x2="255" y2="72%" stroke="rgba(255,255,255,.45)" />
      <text x="50%" y="80%" text-anchor="middle" fill="rgba(255,255,255,.88)" font-size="15" font-family="Arial, sans-serif">${escapeXml(book.author || 'Unknown author')}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};
