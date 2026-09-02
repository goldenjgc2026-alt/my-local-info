const fs = require('fs');
const path = require('path');

async function main() {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    console.error('GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
    process.exit(1);
  }

  const dataFilePath = path.join(__dirname, '..', 'public', 'data', 'local-info.json');
  const postsDirPath = path.join(__dirname, '..', 'src', 'content', 'posts');

  // [1단계] 최신 데이터 확인
  let localData = { items: [] };
  try {
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    localData = JSON.parse(fileContent);
  } catch (err) {
    console.error('local-info.json 읽기 에러:', err.message);
    process.exit(1);
  }

  if (!Array.isArray(localData.items) || localData.items.length === 0) {
    console.log('공공서비스 데이터가 없습니다.');
    return;
  }

  const latestItem = localData.items[localData.items.length - 1];
  const targetName = latestItem.name || latestItem.title || '';

  if (!targetName) {
    console.log('최신 항목의 서비스명이 올바르지 않습니다.');
    return;
  }

  // src/content/posts/ 폴더 확인 및 파일 검사
  if (!fs.existsSync(postsDirPath)) {
    fs.mkdirSync(postsDirPath, { recursive: true });
  }

  const existingFiles = fs.readdirSync(postsDirPath);
  for (const file of existingFiles) {
    if (file.endsWith('.md')) {
      const content = fs.readFileSync(path.join(postsDirPath, file), 'utf8');
      if (content.includes(targetName)) {
        console.log('이미 작성된 글입니다');
        return;
      }
    }
  }

  // [2단계] Gemini AI로 블로그 글 생성
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${geminiApiKey}`;

  const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보: ${JSON.stringify(latestItem, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: (오늘 날짜 YYYY-MM-DD)
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: YYYY-MM-DD-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

  console.log('Gemini AI 블로그 글 생성 요청 중...');

  const geminiResponse = await fetch(geminiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  if (!geminiResponse.ok) {
    throw new Error(`Gemini API 요청 실패: ${geminiResponse.status} ${geminiResponse.statusText}`);
  }

  const geminiResult = await geminiResponse.json();
  let rawText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // 마크다운 코드블록 감싸진 경우 제거
  rawText = rawText.replace(/^```markdown/gi, '').replace(/^```/gi, '').replace(/```$/gi, '').trim();

  // FILENAME 추출 분리
  const filenameMatch = rawText.match(/FILENAME:\s*([a-zA-Z0-9_-]+(?:\.md)?)/i);
  let fileName = '';

  if (filenameMatch) {
    fileName = filenameMatch[1].trim();
    if (!fileName.endsWith('.md')) {
      fileName += '.md';
    }
    // FILENAME 줄 제거
    rawText = rawText.replace(/FILENAME:\s*[a-zA-Z0-9_-]+(?:\.md)?/i, '').trim();
  } else {
    const today = new Date().toISOString().split('T')[0];
    fileName = `${today}-service.md`;
  }

  // [3단계] 파일 저장
  const savePath = path.join(postsDirPath, fileName);
  fs.writeFileSync(savePath, rawText, 'utf8');
  console.log(`블로그 글 생성 및 저장 완료: ${fileName}`);
}

main().catch(err => {
  console.error('블로그 글 생성 중 에러 발생:', err.message);
  process.exit(1);
});
