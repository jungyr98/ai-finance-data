# GitHub 업로드 가이드

저장소 이름: **ai-finance-data**

---

## 방법 1: Git만 사용 (gh 명령어 없이, 권장)

`gh` 명령어가 인식되지 않을 때 이 방법을 사용하세요.

### 1. GitHub에서 새 저장소 만들기

1. **https://github.com/new** 접속
2. **Repository name**: `ai-finance-data`
3. **Public** 선택
4. **Add a README file**, **Add .gitignore** 체크 해제 (이미 로컬에 있음)
5. **Create repository** 클릭

### 2. 로컬에서 푸시

**옵션 A – 스크립트 실행 (쉬움)**

```powershell
cd d:\git-repository\ai-finance
.\scripts\push-with-git-only.ps1
```

스크립트가 GitHub 사용자명을 묻고, 원격 추가 후 `git push`까지 실행합니다.

**옵션 B – 직접 명령어 입력**

```powershell
cd d:\git-repository\ai-finance
git remote add origin https://github.com/본인사용자명/ai-finance-data.git
git push -u origin main
```

`본인사용자명`을 본인 GitHub 아이디로 바꾸세요.

이미 `origin`이 있으면 먼저 제거 후 추가:

```powershell
git remote remove origin
git remote add origin https://github.com/본인사용자명/ai-finance-data.git
git push -u origin main
```

---

## 방법 2: GitHub CLI(gh) 사용

`gh`가 설치되어 있고 터미널에서 인식될 때만 사용 가능합니다.

### 1. GitHub CLI 설치 및 로그인

- [GitHub CLI 다운로드](https://cli.github.com/) 또는 `winget install GitHub.cli`
- 설치 후 **컴퓨터를 재시작**하거나 **새 터미널**을 연 다음:

```powershell
gh auth login
```

- GitHub.com → HTTPS → 브라우저 또는 토큰으로 로그인

### 2. 저장소 생성 및 푸시

```powershell
cd d:\git-repository\ai-finance
gh repo create ai-finance-data --public --source=. --remote=origin --push
```

---

## API 키는 업로드되지 않습니다

- `.env.local`은 `.gitignore`에 포함되어 있어 커밋되지 **않습니다**.
- Vercel 배포 시 **Vercel 대시보드 > Settings > Environment Variables**에서 다음을 추가하세요:
  - `OPENDART_API_KEY`
  - `GEMINI_API_KEY`

자세한 내용은 [DEPLOYMENT.md](DEPLOYMENT.md)를 참고하세요.
