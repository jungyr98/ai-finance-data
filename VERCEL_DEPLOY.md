# Vercel CLI로 배포하기

## 1. Vercel CLI 설치

**Node.js가 설치된 터미널**에서 실행하세요 (PowerShell, CMD, VS Code 터미널 등).

```bash
npm install -g vercel
```

전역 설치가 어렵다면 프로젝트에서만 사용:

```bash
cd d:\git-repository\ai-finance
npm install -D vercel
```

---

## 2. 로그인

최초 1회만 실행:

```bash
vercel login
```

- 이메일 입력 → 받은 메일의 **Verify** 링크 클릭  
- 또는 **Continue with GitHub** 선택

---

## 3. 배포

프로젝트 폴더에서:

```bash
cd d:\git-repository\ai-finance
vercel --prod
```

또는 npm 스크립트 사용 (전역 설치한 경우):

```bash
npm run deploy
```

**처음 실행 시 나오는 질문:**

- **Set up and deploy?** → `Y`
- **Which scope?** → 본인 계정 선택
- **Link to existing project?** → `N` (새 프로젝트)
- **What's your project's name?** → `ai-finance-data` 또는 원하는 이름
- **In which directory is your code located?** → `./` (엔터)

이후에는 `vercel --prod`만 실행하면 됩니다.

---

## 4. 환경 변수 설정 (필수)

배포 후 API가 동작하려면 Vercel에 환경 변수를 넣어야 합니다.

### 방법 A: Vercel 대시보드

1. https://vercel.com/dashboard 접속
2. 프로젝트 **ai-finance-data** 선택
3. **Settings** → **Environment Variables**
4. 추가:
   - **Name**: `OPENDART_API_KEY`  
     **Value**: (OpenDart API 키)  
     **Environment**: Production, Preview, Development
   - **Name**: `GEMINI_API_KEY`  
     **Value**: (Gemini API 키)  
     **Environment**: Production, Preview, Development
5. **Save** 후 **Redeploy** (Deployments → ... → Redeploy)

### 방법 B: CLI로 추가

```bash
cd d:\git-repository\ai-finance
vercel env add OPENDART_API_KEY
vercel env add GEMINI_API_KEY
```

값 입력 후 Production/Preview/Development 선택.  
추가한 뒤 한 번 다시 배포:

```bash
vercel --prod
```

---

## 5. 배포 확인

배포가 끝나면 터미널에 예시처럼 URL이 나옵니다.

```
Production: https://ai-finance-data-xxx.vercel.app
```

해당 주소로 접속해 회사 검색·재무 차트·분석이 동작하는지 확인하세요.

---

## 요약 명령어

```bash
cd d:\git-repository\ai-finance
npm install -g vercel
vercel login
vercel --prod
```

환경 변수는 위 4번처럼 대시보드 또는 `vercel env add`로 설정한 뒤, 필요하면 `vercel --prod`로 한 번 더 배포하면 됩니다.
