# 재무 데이터 시각화 분석 서비스

한국 상장회사의 재무정보를 쉽고 명확하게 분석하는 AI 기반 웹 서비스입니다.

## 주요 기능

- **회사 검색**: 회사명 또는 종목코드로 빠르게 검색
- **재무 데이터 시각화**: 복잡한 재무제표를 보기 좋은 차트로 표현
- **AI 분석**: Gemini AI가 누구나 이해할 수 있게 재무 데이터를 분석
- **다양한 보고서**: 사업보고서, 분기보고서 등 다양한 재무 보고서 지원

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **스타일링**: Tailwind CSS
- **차트**: Recharts
- **검색**: Fuse.js
- **API 통합**:
  - OpenDart (금융감독원 전자공시 시스템)
  - Gemini 2.0 Flash (Google AI)

## 설치 및 실행

### 1. 저장소 복제 및 의존성 설치

```bash
cd ai-finance
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```bash
OPENDART_API_KEY=your_opendart_api_key
GEMINI_API_KEY=your_gemini_api_key
```

#### API 키 발급 방법

**OpenDart API 키**:
1. [금융감독원 OpenDart](https://opendart.fss.or.kr) 방문
2. 인증키 신청/관리 > 인증키 신청
3. 약관 동의 후 신청

**Gemini API 키**:
1. [Google AI Studio](https://aistudio.google.com/app/apikey) 방문
2. API 키 만들기 클릭
3. 생성된 키 복사

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 프로젝트 구조

```
ai-finance/
├── app/
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 메인 페이지 (회사 검색)
│   ├── company/[code]/page.tsx    # 회사별 재무 정보 페이지
│   ├── api/
│   │   ├── financial/route.ts     # OpenDart API 프록시
│   │   └── analyze/route.ts       # Gemini AI 분석 API
│   └── globals.css
├── components/
│   ├── CompanySearch.tsx          # 회사 검색 컴포넌트
│   ├── FinancialCharts.tsx        # 재무 차트 컴포넌트
│   └── AIAnalysis.tsx             # AI 분석 결과 컴포넌트
├── lib/
│   ├── types.ts                   # TypeScript 타입 정의
│   ├── opendart.ts                # OpenDart API 클라이언트
│   ├── gemini.ts                  # Gemini API 클라이언트
│   └── utils.ts                   # 유틸리티 함수
├── public/
│   └── data/
│       └── companies.json         # 회사 정보 (corp.xml 변환)
├── scripts/
│   └── convert-corp-xml.js        # XML → JSON 변환 스크립트
└── package.json
```

## 빌드 및 배포

### 프로덕션 빌드

```bash
npm run build
npm start
```

### Vercel 배포

1. [Vercel](https://vercel.com) 계정 생성
2. GitHub 저장소 연결
3. 환경 변수 설정:
   - `OPENDART_API_KEY`
   - `GEMINI_API_KEY`
4. 배포

## API 엔드포인트

### 1. 재무 데이터 조회

```
GET /api/financial?corp_code=00126380&bsns_year=2023&reprt_code=11011
```

**파라미터**:
- `corp_code`: 회사 고유번호 (8자리)
- `bsns_year`: 사업연도 (4자리)
- `reprt_code`: 보고서 코드
  - `11011`: 사업보고서
  - `11012`: 반기보고서
  - `11013`: 1분기보고서
  - `11014`: 3분기보고서

### 2. AI 분석

```
POST /api/analyze
Content-Type: application/json

{
  "companyName": "삼성전자",
  "year": "2023",
  "financialData": [...]
}
```

## 주요 기능 설명

### 회사 검색

- 회사명, 종목코드, 고유번호로 검색
- Fuse.js를 사용한 퍼지 검색으로 오타 교정
- 실시간 검색 결과 표시
- 키보드 네비게이션 지원

### 재무 차트

- **재무상태표**: 자산, 부채, 자본 연도별 비교 (막대 그래프)
- **손익계산서**: 매출액, 영업이익, 당기순이익 추이 (선 그래프)
- **자산 구성**: 유동자산 vs 비유동자산 (원형 그래프)
- **부채 & 자본 구성**: 부채와 자본의 비율 (원형 그래프)
- 연결재무제표 / 개별재무제표 전환 가능
- 3년 데이터 비교

### AI 분석

Gemini AI가 다음 항목을 분석합니다:

1. **재무 건전성 평가**: 자산, 부채, 자본 상태
2. **수익성 분석**: 매출액과 영업이익 추세
3. **성장성 분석**: 연년간 성장 또는 감소
4. **주요 특이사항**: 눈여겨볼 점

일반인도 이해할 수 있는 쉬운 언어로 설명됩니다.

## 주의사항

- **데이터 출처**: 모든 재무 데이터는 금융감독원 OpenDart에서 제공
- **API 제한**: OpenDart는 일일 20,000건의 요청 제한 적용
- **투자 판단**: AI 분석은 참고자료이며 투자 판단의 기준이 아님
- **API 키 보안**: `.env.local` 파일을 절대 공개 저장소에 커밋하지 마세요

## 에러 처리

### OpenDart API 에러 코드

| 코드 | 설명 |
|------|------|
| 000 | 정상 |
| 013 | 조회된 데이터 없음 |
| 020 | 요청 제한 초과 |
| 021 | 조회 가능 회사 개수 초과 |
| 100 | 부적절한 파라미터 값 |

### 해결 방법

1. **"조회된 데이터 없음"**: 다른 연도나 보고서 타입 선택
2. **"요청 제한 초과"**: 잠시 후 다시 시도
3. **"API 키 설정 오류"**: 환경 변수 확인

## 성능 최적화

- 정적 데이터(companies.json)는 빌드 타임에 생성
- API 응답은 3600초(1시간) 캐싱
- 차트는 클라이언트 사이드에서 렌더링
- Recharts의 lazy loading으로 초기 로드 최적화

## 라이선스

MIT

## 지원 및 피드백

버그 보고 또는 기능 제안은 GitHub Issues를 통해 주시기 바랍니다.

## 참고 자료

- [금융감독원 OpenDart API 개발가이드](https://opendart.fss.or.kr/guide)
- [Google Gemini API 문서](https://ai.google.dev/tutorials/python_quickstart)
- [Next.js 문서](https://nextjs.org/docs)
- [Recharts 문서](https://recharts.org/)
