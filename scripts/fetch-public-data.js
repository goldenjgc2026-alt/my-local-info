const fs = require('fs');
const path = require('path');

async function main() {
  const publicDataApiKey = process.env.PUBLIC_DATA_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!publicDataApiKey) {
    console.error('PUBLIC_DATA_API_KEY 환경변수가 설정되지 않았습니다.');
    process.exit(1);
  }

  if (!geminiApiKey) {
    console.error('GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
    process.exit(1);
  }

  const dataFilePath = path.join(__dirname, '..', 'public', 'data', 'local-info.json');

  // [1단계] 공공데이터포털 API에서 데이터 가져오기
  const endpoint = 'https://api.odcloud.kr/api/gov24/v3/serviceList';
  const url = `${endpoint}?page=1&perPage=20&returnType=JSON&serviceKey=${encodeURIComponent(publicDataApiKey)}`;

  console.log('공공데이터포털 API 요청 중...');
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`공공데이터 API 요청 실패: ${response.status} ${response.statusText}`);
  }

  const resJson = await response.json();
  const rawList = resJson.data || [];

  if (!Array.isArray(rawList) || rawList.length === 0) {
    console.log('공공데이터 목록이 비어있습니다.');
    return;
  }

  // 가져온 데이터에서 아래 순서로 필터링:
  // 서비스명, 서비스목적요약, 지원대상, 소관기관명 중
  // 1) "광명" 포함 항목이 있으면 그것만 사용
  // 2) "광명" 없으면 "경기" 포함 항목 사용
  // 3) "경기"도 없으면 전체 데이터 사용
  const containsText = (item, keyword) => {
    const fields = [
      item.서비스명 || item['서비스명'] || '',
      item.서비스목적요약 || item['서비스목적요약'] || '',
      item.지원대상 || item['지원대상'] || '',
      item.소관기관명 || item['소관기관명'] || ''
    ];
    return fields.some(text => String(text).includes(keyword));
  };

  let candidateList = rawList.filter(item => containsText(item, '광명'));
  if (candidateList.length === 0) {
    candidateList = rawList.filter(item => containsText(item, '경기'));
  }
  if (candidateList.length === 0) {
    candidateList = rawList;
  }

  // [2단계] 기존 데이터와 비교
  let localData = { items: [] };
  try {
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    localData = JSON.parse(fileContent);
    if (!Array.isArray(localData.items)) {
      localData.items = [];
    }
  } catch (err) {
    console.error('기존 local-info.json 읽기 오류:', err.message);
    throw err;
  }

  const existingNames = new Set(
    localData.items.map(item => item.name || item.title || '').filter(Boolean)
  );

  const newCandidate = candidateList.find(item => {
    const name = item.서비스명 || item['서비스명'] || '';
    return name && !existingNames.has(name);
  });

  if (!newCandidate) {
    console.log('새로운 데이터가 없습니다');
    return;
  }

  const targetName = newCandidate.서비스명 || newCandidate['서비스명'];
  console.log(`새로운 공공서비스 발견: ${targetName}`);

  // [3단계] Gemini AI로 새 항목 1개만 가공
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${geminiApiKey}`;

  const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

공공데이터 내용:
${JSON.stringify(newCandidate, null, 2)}`;

  console.log('Gemini AI 가공 요청 중...');
  const geminiBody = JSON.stringify({
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  });

  let geminiResponse;
  for (let attempt = 1; attempt <= 3; attempt++) {
    geminiResponse = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: geminiBody
    });

    if (geminiResponse.ok) break;

    if ((geminiResponse.status === 503 || geminiResponse.status === 429) && attempt < 3) {
      console.log(`Gemini API 일시 오류 (${geminiResponse.status}), ${attempt * 3}초 후 재시도... (${attempt}/3)`);
      await new Promise(r => setTimeout(r, attempt * 3000));
    } else {
      throw new Error(`Gemini API 요청 실패: ${geminiResponse.status} ${geminiResponse.statusText}`);
    }
  }

  const geminiResult = await geminiResponse.json();
  const rawText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Gemini 응답에서 JSON 부분만 파싱 (마크다운 코드블록 제거)
  const cleanedText = rawText
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  let newItem;
  try {
    newItem = JSON.parse(cleanedText);
  } catch (err) {
    throw new Error(`Gemini 응답 JSON 파싱 실패: ${err.message}\n응답 내용:\n${rawText}`);
  }

  // [4단계] 기존 데이터에 추가
  localData.items.push(newItem);

  fs.writeFileSync(dataFilePath, JSON.stringify(localData, null, 2), 'utf8');
  console.log('새로운 공공데이터 항목이 성공적으로 추가되었습니다.');
}

main().catch(err => {
  console.error('작업 수행 중 에러 발생 (기존 데이터 유지):', err.message);
  process.exit(1);
});
