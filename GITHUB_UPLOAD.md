# GitHub 업로드 가이드

저장소 이름: **ai-finance-data**

## 방법 1: GitHub CLI 사용 (권장)

### 0. 로그인 (필수)

저장소 생성 전에 한 번만 실행:

```powershell
gh auth login
```

- **GitHub.com** 선택 → **HTTPS** → **Login with a web browser** 또는 토큰 입력
- 로그인 완료 후 아래 3단계 실행

### 1. GitHub CLI 설치

- [GitHub CLI 다운로드](https://cli.github.com/) 또는
- `winget install GitHub.cli`
- 설치 후 **새 터미널**을 열어주세요.

### 2. 로그인

```powershell
gh auth login
```

- GitHub.com 선택 → HTTPS → 로그인(브라우저 또는 토큰)

### 3. 저장소 생성 및 푸시

프로젝트 폴더에서:

```powershell
cd d:\git-repository\ai-finance
gh repo create ai-finance-data --public --source=. --remote=origin --push
```

완료 후 URL 예: `https://github.com/사용자명/ai-finance-data`

---

## 방법 2: 웹에서 저장소 생성 후 Git으로 푸시

### 1. GitHub에서 새 저장소 만들기

1. https://github.com/new 접속
2. **Repository name**: `ai-finance-data`
3. **Public** 선택
4. **Add a README file** 체크 해제 (이미 로컬에 있음)
5. **Create repository** 클릭

### 2. 로컬에서 원격 추가 및 푸시

```powershell
cd d:\git-repository\ai-finance
git remote add origin https://github.com/본인사용자명/ai-finance-data.git
git branch -M main
git push -u origin main
```

`본인사용자명`을 본인 GitHub 아이디로 바꾸세요.

---

## API 키는 업로드되지 않습니다

- `.env.local`은 `.gitignore`에 포함되어 있어 커밋되지 **않습니다**.
- Vercel 배포 시 **Vercel 대시보드 > Settings > Environment Variables**에서 다음을 추가하세요:
  - `OPENDART_API_KEY`
  - `GEMINI_API_KEY`

자세한 내용은 [DEPLOYMENT.md](DEPLOYMENT.md)를 참고하세요.
