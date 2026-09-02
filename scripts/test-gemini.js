const key = process.env.GEMINI_API_KEY;
console.log('키 길이:', key ? key.length : 0);
console.log('키 앞 15자:', key ? key.substring(0, 15) : '없음');
console.log('키에 줄바꿈 포함:', key ? key.includes('\n') || key.includes('\r') : false);
console.log('키에 공백 포함:', key ? key.includes(' ') : false);
console.log('키에 따옴표 포함:', key ? key.includes('"') || key.includes("'") : false);

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key.trim())}`;
console.log('\n요청 URL:', url.substring(0, 100) + '...');

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ contents: [{ parts: [{ text: 'hello' }] }] })
})
  .then(r => {
    console.log('\nHTTP 상태코드:', r.status, r.statusText);
    return r.text();
  })
  .then(t => {
    console.log('응답:', t.substring(0, 500));
  })
  .catch(e => console.error('에러:', e.message));
