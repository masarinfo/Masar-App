# وثيقة المعمارية الرئيسية والنظام التأسيسي (Master Architecture Document)

**اسم المشروع الفني:** Masar SaaS (مسار - منصة بيئة العمل وتدوين الملاحظات العربية الفائقة)  
**إصدار الوثيقة:** v1.0.0  
**الحالة:** النواة والتصميم التأسيسي (Baseline Specification)

---

## 1. ميثاق المشروع (Project Charter & Core Principles)

هدف مشروع **مسار (Masar)** هو بناء أسرع وأرقى منصة تشاركية عربية لبيئة العمل (Collaborative Workspace) تدمج مزايا Notion, Linear, Airtable, و Obsidian في منتج واحد فائق الأداء.

### المبادئ الخمسة لبناء المشروع بالذكاء الاصطناعي (Core AI Engineering Principles):
1. **السرعة أولاً (Performance-First)**: وقت تحميل الصفحات < 100ms، واستجابة المحرر < 16ms.
2. **الدعم العربي الكامل (Arabic & RTL First)**: تصميم الواجهة، محرر النصوص، والبحث مفصلة للغة العربية من الصفر.
3. **العمل المحوّلي والمحلي (Offline & Local-First)**: حفظ البيانات فورياً في المتصفح عبر IndexedDB والمزامنة الخلفية بدون تأخير.
4. **التأطير بالتجزئة (Modular Micro-Architecture)**: كود نظيف مقسم لـ Modules مستقلة ذات اختبارات موثوقة.
5. **الاتساق التام (Strict Consistency)**: التزام صارم بدليل التصميم، تسمية المتغيرات، ومعايير الكود المحددة في هذه الوثيقة.

---

## 2. جدول المحطات والتجزئة البرمجية (Modular Roadmap Breakdown)

سنبني المشروع على **مراحل تدرجية متسلسلة**، كل مرحلة تحتوي على Modules مستقلة ومكتملة (DB → API → Backend → Frontend → RTL Tests):

```
[ المرحلة الأولى: المعمارية والدليل الأساسي (Master Architecture) ] ← (تمت بنجاح)
                 │
                 ▼
[ المرحلة الثانية: التأسيس والبنية التحتية (Foundation & Monorepo Setup) ]
  • Module 00: Monorepo & Docker Engine Setup
  • Module 01: Authentication, OAuth & Security Core
  • Module 02: Design System, Design Tokens & Arabic Typography
  • Module 03: Workspace, Teams & RBAC Permissions
                 │
                 ▼
[ المرحلة الثالثة: المحرر الفائق (Core Block Editor Engine) ]
  • Module 04: TipTap RTL Engine & Custom Arabic Blocks
  • Module 05: Yjs Realtime Collaboration & Hocuspocus Sync
  • Module 06: Page Tree & Nested Documents
                 │
                 ▼
[ المرحلة الرابعة: قواعد البيانات التفاعلية (Interactive Databases) ]
  • Module 07: Database Schema Engine & Field Types
  • Module 08: Table View & Virtualized Grid
  • Module 09: Kanban Board (RTL Drag & Drop)
  • Module 10: Calendar & Hijri Integration
  • Module 11: Formula Engine & Rollups
                 │
                 ▼
[ المرحلة الخامسة: البحث والذكاء الاصطناعي (Search & AI Services) ]
  • Module 12: Meilisearch Arabic Full-Text Engine
  • Module 13: Masar Arabic AI Copilot & Document Generator
                 │
                 ▼
[ المرحلة السادسة: الإطلاق والمؤشرات (Enterprise & Billing) ]
  • Module 14: SaaS Billing (Stripe / Moyasar) & Subscription Logic
  • Module 15: Audit Logs, Webhooks & Enterprise Integration
```

---

## 3. المعمارية الفنية وهيكل المجلدات (Monorepo Architecture)

سنستخدم بنية **Monorepo (pnpm workspaces)** لجمع الـ Frontend والـ Backend ودليل التصميم في مشروع واحد منظّم:

```text
masar-saas/
├── apps/
│   ├── web/                         # Next.js 15 (App Router - Frontend)
│   │   ├── app/                     # (ar) Localization Routing & Pages
│   │   ├── components/
│   │   │   ├── ui/                  # Shadcn UI RTL customized components
│   │   │   ├── editor/              # TipTap Arabic Block Editor
│   │   │   ├── database/            # Tables, Kanban, Calendar Views
│   │   │   └── layout/              # Sidebar Tree, Navigation & Topbar
│   │   ├── hooks/                   # Custom Hooks (UseYjs, UseOffline, UseSearch)
│   │   ├── stores/                  # Zustand Store for UI State
│   │   └── styles/                  # Tailwind Design Tokens & Arabic Fonts
│   │
│   └── api/                         # NestJS Backend Microservice
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/            # JWT, OAuth, RBAC Guards
│       │   │   ├── workspace/       # Workspace Management
│       │   │   ├── page/            # Document & Block API
│       │   │   ├── sync/            # Hocuspocus / Yjs WebSockets
│       │   │   ├── search/          # Meilisearch Indexing Service
│       │   │   └── ai/              # Arabic AI Prompt Engine
│       │   ├── common/              # Filters, Interceptors, Decorators
│       │   └── prisma/              # Prisma Service & Migrations
│       └── test/                    # End-to-End E2E Tests
│
├── packages/
│   ├── db/                          # Shared Prisma Schema & Client
│   ├── config/                      # ESLint, Prettier, TypeScript Configs
│   └── types/                       # Shared TypeScript Interfaces & DTOs
│
├── docker-compose.yml               # Postgres, Redis, Meilisearch Containers
└── package.json
```

---

## 4. مخطط قاعدة البيانات الشامل (Complete Prisma Schema Document)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  OWNER
  ADMIN
  MEMBER
  GUEST
}

enum PropertyType {
  TEXT
  NUMBER
  SELECT
  MULTI_SELECT
  DATE
  PERSON
  FILES
  CHECKBOX
  URL
  EMAIL
  FORMULA
  RELATION
  ROLLUP
}

model User {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String
  avatarUrl     String?
  language      String         @default("ar")
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  memberships   Member[]
  pages         Page[]
  auditLogs     AuditLog[]
}

model Workspace {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  icon        String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  members     Member[]
  pages       Page[]
}

model Member {
  id          String    @id @default(cuid())
  role        Role      @default(MEMBER)
  userId      String
  workspaceId String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())

  @@unique([userId, workspaceId])
}

model Page {
  id          String        @id @default(cuid())
  title       String        @default("صفحة جديدة")
  icon        String?
  coverUrl    String?
  content     Json?         // TipTap JSON or Yjs document binary snapshot
  isPublished Boolean       @default(false)
  isArchived  Boolean       @default(false)
  isDatabase  Boolean       @default(false)
  workspaceId String
  authorId    String
  parentId    String?
  parent      Page?         @relation("NestedPages", fields: [parentId], references: [id], onDelete: Cascade)
  children    Page[]        @relation("NestedPages")
  properties  Property[]
  rows        DatabaseRow[]
  workspace   Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  author      User          @relation(fields: [authorId], references: [id])
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model Property {
  id         String       @id @default(cuid())
  name       String
  type       PropertyType @default(TEXT)
  options    Json?        // For SELECT & MULTI_SELECT options
  pageId     String
  page       Page         @relation(fields: [pageId], references: [id], onDelete: Cascade)
}

model DatabaseRow {
  id        String   @id @default(cuid())
  pageId    String   // Belongs to Page (Database)
  data      Json     // Key-value of property IDs to values
  page      Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model AuditLog {
  id        String   @id @default(cuid())
  action    String
  entity    String
  entityId  String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```

---

## 5. دليل معايير التصميم والكود (Design System & Coding Standards)

### أ. الخطوط ونظام التصميم العربي (Arabic Typography & RTL System):
- **الخط الأساسي للنصوص (Body & UI)**: `Readex Pro` أو `Tajawal` من Google Fonts.
- **الخط العريض للعناوين (Headings)**: `Cairo` أو `Readex Pro` (Font Weight 700).
- **محاذاة العناصر (RTL Layout)**:
  - الشريط الجانبي (Sidebar) على اليمين ➡️.
  - اتجاه النص التلقائي (`dir="auto"`) للبلوكات للتعامل اللحظي مع الجمل المشتركة (عربي + إنجليزي + كود).
  - مصفوفة الألوان: dark/light mode باستخدام HSL CSS variables متناسقة وفخمة جداً.

### ب. قواعد تسمية وتوحيد الكود (Naming Conventions):
- **الملفات والمكونات**: `kebab-case` للملفات (مثل `arabic-block-editor.tsx`)، و `PascalCase` للمكونات (مثل `ArabicBlockEditor`).
- **المتغيرات والدوال**: `camelCase` (مثل `fetchWorkspacePages`, `isRtlMode`).
- **واجهات DTOs و Interfaces**: تبدأ بـ `I` أو تنتهي بـ `Dto` (مثل `CreateWorkspaceDto`).

---

## 6. الخطوة التالية (Execution Rule)

هذه الوثيقة هي **المرجع الدائم والمعياري (Master Architecture)** لجميع العمليات.  
عند البدء في المحادثة الجديدة، سنقرأ هذه الوثيقة مباشرة ونبدأ في **Phase 2: Foundation (Module 00: Monorepo & Docker Engine Setup)** لتوليد الكود الأساسي للمشروع، تثبيت الحزم، وإنشاء البنية التأسيسية.
