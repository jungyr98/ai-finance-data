# Gemini API 할당량 및 사용 가이드

## 📊 무료 플랜 할당량

### Gemini 1.5 Flash (현재 사용 중)

| 항목 | 할당량 | 시간 단위 |
|------|--------|---------|
| 요청 수 | 15 RPM | 분당 |
| 토큰 수 | 1M | 일당 |
| 콘텐츠 생성 | 최대 30개 | 일당 |

## ⚠️ "할당량 초과" 오류가 발생했을 때

### 원인
```
[429 Too Many Requests] 
You exceeded your current quota
```

이 오류는 다음 원인으로 발생합니다:

1. **일일 토큰 한계**: 무료 플랜은 일일 100만 토큰 제한
2. **분당 요청 제한**: 15개 요청/분 제한
3. **일일 요청 수 제한**: 제한된 요청 수 초과

## ✅ 해결 방법

### 방법 1: 잠시 기다리기 (무료, 권장)

**분당 제한 초과**: 약 4분 대기 후 재시도
```
분당 15개 요청 제한
→ 약 4분마다 리셋
```

**일일 제한 초과**: 다음 날 자정(UTC) 대기
```
일일 100만 토큰/30개 요청 제한
→ 24시간 후 리셋
```

### 방법 2: Gemini API 유료 플랜 업그레이드 (권장)

#### 단계별 가이드

1. **Google AI Studio 접속**
   - [Google AI Studio](https://aistudio.google.com) 방문
   - Google 계정으로 로그인

2. **API 키 관리**
   - 좌측 메뉴 > "API Keys"
   - 기존 키 클릭

3. **결제 설정**
   - "Enable billing" 클릭
   - Google Cloud Console로 리다이렉트
   - 결제 계정 추가

4. **API 활성화**
   - Generative Language API 활성화
   - 할당량 확인 (무제한)

#### 유료 플랜 요금

**Gemini 1.5 Flash** (현재 모델)
- 입력: $0.075 / 100만 토큰
- 출력: $0.3 / 100만 토큰

**예시**:
- 회사 1개 분석: 약 $0.001 (0.1원)
- 월 100개 분석: 약 $0.1 (100원)

### 방법 3: 다른 모델 사용

더 높은 무료 할당량을 원한다면:

```typescript
// 현재 (추천)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

// 대안 (더 최신, 비슷한 성능)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

// 대안 (더 느림, 더 싼 비용)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-mini' })
```

## 🔧 코드 수정 (이미 적용됨)

프로젝트는 다음과 같이 개선되었습니다:

### 1. 모델 변경
```typescript
// ❌ gemini-2.0-flash (낮은 무료 할당량)
// ✅ gemini-1.5-flash (높은 무료 할당량)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
```

### 2. 에러 처리 개선
```typescript
try {
  // API 호출
} catch (error) {
  if (errorMessage.includes('quota')) {
    throw new Error('할당량 초과 - 명확한 가이드 제공')
  }
}
```

### 3. 사용자 친화적 메시지
- 무엇이 잘못되었는지 명확히 설명
- 해결 방법 제시
- 언제 다시 시도할 수 있는지 안내

## 📈 사용량 모니터링

### Google AI Studio에서 확인

1. [Google AI Studio](https://aistudio.google.com) 접속
2. 좌측 "Usage" 메뉴
3. 현재 사용량 확인

### 정보
- 일일 토큰 사용량
- 요청 수
- 모델별 사용 통계

## 💡 최적화 팁

### 1. 프롬프트 최적화
```typescript
// ❌ 불필요한 데이터 포함
const prompt = `${ALL_FINANCIAL_DATA} 분석해줘`

// ✅ 필요한 데이터만 포함
const prompt = `매출: 100억, 이익: 20억. 분석해줘`
```

### 2. 캐싱 활용
```typescript
// 같은 데이터 분석 요청은 캐시 사용
// Next.js API Routes는 자동 캐싱 지원
```

### 3. 배치 처리
```typescript
// 여러 분석을 한 번에 하지 말고
// 사용자 요청에만 응답
```

## ❓ FAQ

### Q1: 정확히 언제 할당량이 리셋되나요?

**분당**: 매 분 정각 (예: 12:00, 12:01, 12:02)
**일당**: 매일 자정 UTC (한국: 오전 9시)

### Q2: 유료 요금제는 안전한가요?

네, 매우 안전합니다:
- 신용카드 자동 청구
- 월 최대 금액 설정 가능
- 언제든지 취소 가능
- Google이 운영하는 공식 서비스

### Q3: 한 사용자당 할당량이 있나요?

아니요, API 키 기준입니다:
- 1개 프로젝트 = 1개 할당량
- 여러 사용자가 같은 API 키 공유 시 합산

### Q4: 할당량 초과 시 자동 재시도되나요?

아니요, 수동으로 재시도해야 합니다:
- "AI 분석 다시 받기" 버튼 클릭
- 4분 대기 후 재시도

## 🚀 권장 사항

### 프로덕션 환경

| 상황 | 권장사항 |
|------|--------|
| 소규모 (월 <100분석) | 무료 플랜 |
| 중규모 (월 100-1000분석) | 유료 플랜 |
| 대규모 (월 >1000분석) | 엔터프라이즈 |

### 개발 환경

1. **로컬 테스트**: 무료 플랜 사용
2. **스테이징**: 유료 플랜 사용 (작은 예산)
3. **프로덕션**: 유료 플랜 + 모니터링

## 📞 추가 지원

- [Gemini API 문서](https://ai.google.dev/tutorials/python_quickstart)
- [할당량 제한 상세](https://ai.google.dev/gemini-api/docs/rate-limits)
- [결제 설정](https://support.google.com/cloud/answer/6288653)

---

**요약**: 현재 gemini-1.5-flash를 사용 중이며, 무료 플랜의 할당량을 초과하면 내일 다시 시도하거나 유료 플랜으로 업그레이드하세요.
