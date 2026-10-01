# tae0code · Personal space

차콜과 라임 컬러, 인터랙티브 신경망 그래픽, Markdown 블로그를 갖춘 개인 포트폴리오입니다. Astro로 정적 HTML을 생성하여 GitHub Pages에서 서버 없이 동작합니다.

## 시작하기

Node.js 22.12 이상이 필요합니다.

```sh
npm install
npm run dev
```

화면: http://localhost:4321

```sh
npm run check
npm run build
npm test
npm run preview
```

## 코드 포맷

Astro, TypeScript, CSS와 설정 파일은 Prettier로 정리합니다. 들여쓰기는 공백 2칸, 줄 길이는 100자를 기준으로 하며 Astro 태그의 속성은 한 줄에 하나씩 표시합니다. 블로그 본문과 자동 생성 파일은 포맷 대상에서 제외합니다.

```sh
npm run format        # 코드 줄바꿈과 들여쓰기 정리
npm run format:check  # 수정 없이 형식 검사
```

GitHub Actions에서도 형식을 검사합니다. 기능 변경 후 `npm run format`을 실행하면 같은 스타일을 유지할 수 있습니다.

## 내 콘텐츠로 바꾸기

| 내용                                 | 위치                     |
| ------------------------------------ | ------------------------ |
| 이름, 소개, 연락처, 기술, 경력, 학력 | `src/data/profile.ts`    |
| 프로젝트 목록과 상세 내용            | `src/data/projects.ts`   |
| 블로그 글                            | `src/content/posts/*.md` |
| PDF 이력서                           | `public/resume.pdf`      |
| 색상, 글꼴, 반응형 디자인            | `src/styles/global.css`  |
| 첫 화면 구성과 대표 프로젝트 카드    | `src/pages/index.astro`  |

현재 자기소개와 기술 목록은 수정 가능한 예시이며, 실제 경력이나 학력은 넣지 않았습니다. 이름은 작업 환경의 `tae0code`를 사용했습니다. `STARTER NOTE`가 붙은 세 글은 시작을 위한 예시입니다. 실제 게시 전 직접 쓴 글로 교체하거나 `draft: true`로 숨기세요. 빈 이메일·GitHub·LinkedIn 링크는 자동으로 숨겨집니다.

### 이력서

`profile.ts`의 `experience`, `education` 배열에 실제 정보를 입력합니다.

```ts
experience: [
  {
    company: '회사 또는 활동명',
    role: '역할',
    period: '2024.03 — 현재',
    description: '담당한 일과 구체적인 기여를 작성합니다.',
  },
],
education: [
  { school: '학교 또는 교육 기관', degree: '전공 또는 교육 과정', period: '기간' },
],
```

실제 이력서 파일을 `public/resume.pdf`에 넣고 다시 빌드하면 다운로드 버튼이 나타납니다. 다른 이름을 쓰려면 `profile.resumeFile`을 바꾸세요. 파일이 없으면 잘못된 다운로드 링크를 만들지 않습니다. 웹 이력서의 **인쇄 · PDF로 저장**은 인쇄용 레이아웃으로 출력합니다. 정적 사이트이므로 방문자가 파일을 업로드하는 관리자 기능은 포함하지 않습니다.

### 블로그 글

`src/content/posts/my-first-post.md`를 추가하면 `/writing/my-first-post/` 주소가 생성됩니다.

```markdown
---
title: '첫 번째 글'
description: '글 목록에 표시할 짧은 설명'
date: 2026-10-01
category: Notes
tags: [TypeScript, Learning]
draft: false
starter: false
---

## 시작하며

여기에 본문을 작성합니다.
```

분류는 `Building`, `Interaction`, `Notes`입니다. 새 분류를 추가하려면 `src/content.config.ts`의 목록을 수정합니다. `draft: true`인 글은 글 목록·홈·상세 경로·RSS·사이트맵에서 제외됩니다. 글을 추가하면 홈의 최신 글과 RSS도 자동으로 갱신됩니다. 게시 날짜는 작성자가 정하는 값이며 미래 날짜를 자동으로 숨기지는 않습니다.

### 프로젝트

`src/data/projects.ts` 배열에 고유한 `slug`의 프로젝트를 추가하면 목록과 상세 경로가 함께 생성됩니다. `demoUrl`, `sourceUrl`을 채우면 상세 페이지에서 해당 링크가 나타납니다. 홈의 대표 프로젝트는 별도의 편집 디자인이므로 `src/pages/index.astro`에서 변경합니다.

## GitHub Pages에 배포하기

1. GitHub에 `tae0code.github.io` 저장소를 만들거나 사용할 저장소를 선택합니다.
2. 이 프로젝트를 저장소의 `main` 브랜치에 올립니다. `node_modules`, `dist`, `.astro`, `.env`는 올리지 않습니다.
3. 저장소의 **Settings → Pages → Build and deployment → Source**에서 **GitHub Actions**를 선택합니다.
4. `main`에 push하면 포함된 `deploy.yml`이 검증·빌드·배포를 진행합니다. 처음 설정한 뒤에는 **Actions → Deploy to GitHub Pages → Run workflow**로 직접 실행할 수도 있습니다.

저장소의 소유자와 이름을 배포 환경에서 읽어 주소를 자동으로 설정합니다.

- `사용자명.github.io` 저장소: `https://사용자명.github.io/`
- 그 외 저장소: `https://사용자명.github.io/저장소명/`

프로젝트 하위 경로에서도 CSS, 글 링크, 이력서, RSS 주소가 함께 맞춰집니다. 로컬에서 같은 환경을 확인하려면 다음처럼 빌드할 수 있습니다.

```sh
GITHUB_REPOSITORY=tae0code/git.io npm run build
npm test
npm run preview
```

이 경우 미리보기 경로는 `/git.io/`입니다. 기본 경로로 돌아오려면 환경 변수 없이 다시 빌드합니다.

커스텀 도메인은 GitHub 저장소 변수에 `SITE_URL=https://도메인`, `BASE_PATH=/`를 설정하고 `public/CNAME`과 GitHub Pages 도메인 설정을 함께 구성합니다.

공식 가이드: [Astro · GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)

## 인터랙션과 접근성

- Canvas 신경망: 5개 층의 뉴런 사이로 신호가 흐르고, 마우스 근처의 노드·연결선이 밝아지며 클릭·터치로 신호 활성화. 별도 버튼으로 키보드에서도 신호 전송 가능. 화면 밖이나 비활성 탭에서는 렌더링 중지
- 동작 줄이기 설정 존중 및 수동 일시 정지
- 다크·라이트 테마와 기기 내 테마 기억
- 스크롤 등장 효과 및 읽기 진행 표시
- 글 검색·분류, 검색어 URL 유지, `/` 검색 단축키
- About 터미널: `help`, `about`, `skills`, `projects`, `blog`, `resume`, `clear`; 위·아래 키로 명령 기록 탐색
- 키보드 포커스, 본문 바로가기, 모바일 메뉴, 인쇄용 이력서
- 글 목차, 코드 구문 강조, RSS, 사이트맵, 404 페이지

글꼴도 빌드 결과에 포함되며 외부 CDN에 의존하지 않습니다. 분석 도구나 방문자 추적 스크립트는 포함하지 않습니다.
