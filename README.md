# 🧠 NEVER MIND (Interview AI) — Frontend

사용자의 발화·행동(시선/표정/자세)을 녹화하고, AI 분석으로 즉각적인 정량 피드백을 제공하는 면접 훈련 서비스 (React)

<br/>

## 📌 서비스 소개

**NEVER MIND**는 실제 면접과 유사한 환경에서 반복 연습이 가능하도록 설계된 AI 면접 훈련 서비스입니다.

사용자는 답변을 녹화/녹음하고, 서버는 음성·시선·표정·자세를 분석해 점수/등급(양호·보통·개선필요 등) + 요약 피드백을 제공합니다.

### 🎯 핵심 가치

- **자소서/JD 기반 개인화 질문 생성**: 지원자의 자기소개서와 직무 기술서를 분석하여 맞춤형 면접 질문을 자동 생성
- **발화·행동 분석을 통한 정량 피드백 제공**: 음성, 시선, 표정, 자세 등 다각도 분석으로 객관적인 점수 제공
- **피드백 히스토리 기반 반복 연습/개선 유도**: 과거 연습 기록을 기반으로 약점 보완 및 지속적인 개선 지원

<br/>

## 🛠️ Tech Stack

### Core
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빠른 개발 서버 및 빌드 도구

### UI & Styling
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **shadcn-ui** - 재사용 가능한 UI 컴포넌트
- **Lucide React** - 아이콘 라이브러리
- **Sonner** - 토스트 알림

### State Management & Data Fetching
- **TanStack Query (React Query)** - 서버 상태 관리 및 데이터 캐싱
- **React Context API** - 전역 인증 상태 관리

### Authentication & Backend
- **Supabase** - 사용자 인증 및 세션 관리
- **Axios** - HTTP 클라이언트

### Form & Validation
- **React Hook Form** - 폼 상태 관리
- **Zod** - 스키마 기반 유효성 검증

### Routing
- **React Router v6** - 클라이언트 사이드 라우팅

<br/>

## 🚀 시작하기

### Prerequisites

다음 도구들이 설치되어 있어야 합니다:

- **Node.js** (v18 이상) - [nvm으로 설치하기](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** (Node.js와 함께 설치됨)
- **Git**

### Installation

#### 1. 레포지토리 클론

```bash
git clone https://github.com/SUNSHINCAPSTONE2025/interview-fe.git
cd interview-fe
```

#### 2. 의존성 설치

```bash
npm install
```

#### 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **참고**:
> - Vite에서는 환경 변수에 `VITE_` 접두사가 필수입니다.
> - `.env.test` 파일을 참고하여 설정할 수 있습니다.
> - Supabase 프로젝트는 [Supabase 대시보드](https://supabase.com/dashboard)에서 생성할 수 있습니다.

#### 4. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 `http://localhost:8080`에서 실행됩니다.

<br/>

## 📜 사용 가능한 스크립트

```bash
# 개발 서버 시작 (localhost:8080)
npm run dev

# 프로덕션 빌드
npm run build

# 개발 모드 빌드
npm run build:dev

# 린터 실행
npm run lint

# 프로덕션 빌드 미리보기
npm run preview
```

<br/>

## 📂 프로젝트 구조

```
interview-fe/
├── src/
│   ├── api/                    # API 레이어
│   │   ├── auth.ts            # Supabase 인증 API
│   │   ├── contents.ts        # 컨텐츠 및 자소서 관리 API
│   │   └── sessions.ts        # 세션 및 녹화 관리 API
│   │
│   ├── components/            # React 컴포넌트
│   │   ├── ui/               # shadcn-ui 기본 컴포넌트
│   │   └── layout/           # 레이아웃 컴포넌트
│   │
│   ├── contexts/              # React Context
│   │   └── AuthContext.tsx   # 인증 상태 관리
│   │
│   ├── hooks/                 # Custom React Hooks
│   │
│   ├── lib/                   # 유틸리티 및 설정
│   │   ├── api.ts            # API 요청 헬퍼
│   │   ├── supabaseClient.ts # Supabase 클라이언트
│   │   └── utils.ts          # 유틸리티 함수
│   │
│   ├── pages/                 # 페이지 컴포넌트
│   │   ├── Auth.tsx          # 로그인/회원가입
│   │   ├── Dashboard.tsx     # 대시보드
│   │   ├── NewSession.tsx    # 새 세션 생성
│   │   ├── SessionDetail.tsx # 세션 상세
│   │   ├── PracticeGuide.tsx # 연습 가이드
│   │   ├── PracticeSetup.tsx # 연습 설정
│   │   ├── PracticeRoom.tsx  # 녹화 진행
│   │   └── Feedback.tsx      # 피드백 확인
│   │
│   ├── types/                 # TypeScript 타입 정의
│   │   ├── auth.ts           # 인증 관련 타입
│   │   ├── content.ts        # 컨텐츠 관련 타입
│   │   └── session.ts        # 세션 관련 타입
│   │
│   ├── App.tsx                # 메인 App 컴포넌트 (라우팅)
│   └── main.tsx               # 진입점
│
├── public/                    # 정적 파일
├── .env                       # 환경 변수 (gitignore)
├── .env.test                  # 환경 변수 예시
├── vite.config.ts            # Vite 설정
├── tailwind.config.ts        # Tailwind 설정
├── tsconfig.json             # TypeScript 설정
└── package.json              # 프로젝트 메타데이터
```

<br/>

## 🔄 주요 기능 및 흐름

### 1. 인증 시스템 (Dual Authentication)

NEVER MIND는 이중 인증 시스템을 사용합니다:

1. **Supabase Auth**: 사용자 인증 및 세션 관리
2. **Backend API**: 사용자 프로필 및 애플리케이션 데이터

**인증 흐름**:
```
로그인/회원가입 (Supabase)
    ↓
Access Token & Refresh Token 발급
    ↓
localStorage에 토큰 저장
    ↓
Backend API 요청 시 Authorization 헤더에 토큰 포함
    ↓
AuthContext에서 전역 인증 상태 관리
```

### 2. 면접 연습 세션 흐름

```
1. 컨텐츠 생성 (/new)
   - 회사명, 직무, 직무기술서(JD) 입력
   - 자소서 Q&A 추가 (선택)
   - 자소서 기반 면접 질문 생성

2. 세션 생성 (/session/:id)
   - 연습 유형 선택 (소프트 스킬 / 직무 질문)
   - 질문 계획 생성

3. 연습 준비 (/practice/:id/setup)
   - 질문 및 연습 목표 검토
   - 연습 설정 구성

4. 연습 진행 (/practice/:id/run)
   - 실시간 녹화 세션
   - 질문별 비디오/오디오 답변 녹화
   - createAttemptWithRecording으로 시도 기록 생성

5. 피드백 확인 (/feedback/:id)
   - AI 분석 결과 및 피드백 표시
   - 음성, 시선, 표정, 자세 점수 확인
```

### 3. 라우팅 구조

| 경로 | 설명 | 보호 여부 |
|------|------|-----------|
| `/` | 대시보드 (세션 목록) | Public |
| `/auth` | 로그인/회원가입 | Public |
| `/new` | 새 연습 세션 생성 | Protected |
| `/session/:id` | 세션 상세 보기 | Protected |
| `/practice/:id` | 연습 가이드 | Protected |
| `/practice/:id/setup` | 연습 설정 | Protected |
| `/practice/:id/run` | 실시간 연습 진행 | Protected |
| `/feedback/:id` | 피드백 확인 | Protected |

> **Protected Routes**: `ProtectedRoute` 컴포넌트로 감싸져 있으며, `AuthContext`의 `isAuthenticated`를 확인합니다.

<br/>

## 🏗️ API 레이어 구조

### API 모듈 분리

```typescript
src/api/
├── auth.ts       # Supabase 인증 (로그인, 회원가입, 로그아웃, 세션 관리)
├── contents.ts   # 컨텐츠 및 자소서 관리, 면접 질문 생성
└── sessions.ts   # 연습 세션 생명주기, 질문 계획, 녹화 업로드
```

### API 요청 헬퍼

모든 Backend API 호출은 `apiRequest` 헬퍼를 사용합니다:

```typescript
// src/lib/api.ts
apiRequest(endpoint, options)
```

**기능**:
- Authorization 헤더에 Supabase access token 자동 추가
- 에러 응답 처리 및 `ApiError` 인스턴스 발생
- `VITE_API_BASE_URL` 기반 URL 구성

### 에러 핸들링

```typescript
import { ApiError } from "@/lib/api";

try {
  await authApi.login(data);
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401: // Unauthorized
      case 403: // Forbidden
      case 409: // Conflict
        // 각 상태 코드별 처리
    }
  }
}
```

<br/>

## 🎨 UI 컴포넌트

### shadcn-ui 사용

프로젝트는 [shadcn-ui](https://ui.shadcn.com/)를 기반으로 구축되었습니다:

- **기본 컴포넌트**: `src/components/ui/`에 위치
- **커스텀 컴포넌트**: `src/components/`에 위치
- **경로 별칭**: `@/`는 `src/` 디렉토리로 매핑됨

### 토스트 알림

[Sonner](https://sonner.emilkowal.ski/)를 사용한 사용자 알림:

```typescript
import { toast } from "sonner";

toast.success("성공 메시지");
toast.error("에러 메시지");
toast.info("정보 메시지");
```

<br/>

## 🔧 개발 가이드

### 새 API 엔드포인트 추가

1. `src/types/`의 적절한 파일에 타입 추가
2. `src/api/`의 적절한 모듈에 API 함수 추가
3. 인증이 필요한 경우 `apiRequest` 헬퍼 사용
4. 인증 작업의 경우 Supabase 클라이언트 직접 사용

### 새 페이지 추가

1. `src/pages/`에 페이지 컴포넌트 생성
2. `src/App.tsx`에 라우트 추가
3. 인증이 필요한 경우 `ProtectedRoute`로 감싸기
4. 사용자 및 인증 메서드 접근을 위해 `useAuth()` 훅 사용

### 폼 처리

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  // 스키마 정의
});

const form = useForm({
  resolver: zodResolver(formSchema),
});
```

### 세션/시도 상태

- **Session Status**: `"draft"` | `"running"` | `"done"` | `"canceled"`
- **Attempt Status**: `"ok"` | `"aborted"`
- **Question Types**: `"BASIC"` | `"GENERATED"`
- **Practice Types**: `"soft"` | `"job"`

<br/>

## 📸 미디어 녹화

연습 세션 중 비디오/오디오 녹화:

- `PracticeRoom` 페이지에서 녹화 진행
- Blob은 FormData를 통해 `/api/sessions/:id/attempts`로 업로드
- 각 시도는 비디오 및 오디오 에셋 생성
- 시도 데이터 포함 사항:
  - `session_question_id`: 질문 ID
  - `started_at`: 시작 시간
  - `ended_at`: 종료 시간
  - `duration_sec`: 지속 시간 (초)
  - `status`: 시도 상태

<br/>

## 🤝 기여하기

1. 이 저장소를 Fork 합니다
2. Feature 브랜치를 생성합니다 (`git checkout -b feat/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'feat: add amazing feature'`)
4. 브랜치에 Push 합니다 (`git push origin feat/amazing-feature`)
5. Pull Request를 생성합니다

<br/>

## 📄 License

This project is licensed under the MIT License.

<br/>

## 🔗 관련 링크

- **Backend Repository**: [interview-be](https://github.com/SUNSHINCAPSTONE2025/interview-be)
- **Supabase**: [https://supabase.com](https://supabase.com)
- **shadcn-ui**: [https://ui.shadcn.com](https://ui.shadcn.com)

<br/>

---

Made with ❤️ by SUNSHIN CAPSTONE 2025
