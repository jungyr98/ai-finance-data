# Vercel 배포 가이드

이 프로젝트는 Vercel에 최적화되어 있습니다.

## 배포 전 준비사항

1. GitHub에 저장소 생성
2. 프로젝트를 GitHub에 푸시

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ai-finance.git
git branch -M main
git push -u origin main
```

## Vercel 배포 단계

### 방법 1: Vercel 웹사이트 (권장)

1. [Vercel](https://vercel.com) 접속
2. GitHub로 로그인
3. **Add New** > **Project** 클릭
4. GitHub 저장소 선택
5. 프로젝트명 설정 (기본값: `ai-finance`)
6. **Environment Variables** 섹션에서 다음 변수 추가:
   - `OPENDART_API_KEY`: OpenDart API 키
   - `GEMINI_API_KEY`: Gemini API 키
7. **Deploy** 클릭

### 방법 2: Vercel CLI

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 배포
vercel --prod

# 환경 변수 설정
vercel env add OPENDART_API_KEY
vercel env add GEMINI_API_KEY

# 재배포
vercel --prod
```

## 환경 변수 설정

Vercel 대시보드에서:

1. **Settings** > **Environment Variables**
2. 다음 변수 추가 (본인의 API 키로 설정):
   ```
   OPENDART_API_KEY=your_opendart_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

## 자동 배포 설정

GitHub에 푸시하면 자동으로 배포됩니다:

- **main** 브랜치 푸시 → 프로덕션 배포
- **다른 브랜치** 푸시 → 프리뷰 배포

## 배포 후 확인

1. Vercel 대시보드에서 배포 상태 확인
2. 제공된 URL로 접속하여 기능 테스트
3. 회사 검색 기능 정상 작동 확인
4. 재무 데이터 로딩 및 차트 표시 확인
5. AI 분석 기능 작동 확인

## 문제 해결

### 배포 실패

1. **빌드 오류**: 로그 확인
   - Vercel 대시보드 > Deployments > Failed > View Logs

2. **환경 변수 오류**: 
   - 변수명 정확히 입력되었는지 확인
   - API 키 유효성 확인

3. **메모리 부족**:
   - XML 파일이 너무 크면 증분 빌드 고려
   - 또는 프리뷰 배포 먼저 확인

### 런타임 오류

1. **API 호출 실패**:
   - 환경 변수 설정 확인
   - API 키 유효성 확인
   - 네트워크 상태 확인

2. **데이터 로딩 실패**:
   - companies.json 생성 확인
   - 빌드 로그에서 XML 변환 상태 확인

## 성능 최적화

- 정적 파일 캐싱: 24시간
- API 응답 캐싱: 1시간
- Next.js 이미지 최적화 사용
- CDN 통해 전 세계 배포

## 비용

Vercel 무료 플랜:

- **배포**: 무제한
- **서버**: US 리전
- **API 제한**: 없음 (단, OpenDart API 제한 적용)
- **환경 변수**: 지원

## 커스텀 도메인 (선택)

1. Vercel 대시보드 > Settings > Domains
2. 도메인 추가
3. DNS 설정

자세한 내용은 [Vercel 문서](https://vercel.com/docs)를 참고하세요.
