# Welfare Facility ERP Suite

介護・福祉事業所向けの業務システム基盤プロジェクトです。

## Overview

このシステムは **"ERPというより、必要になったモジュールを増やす前提の箱"** として設計されています。介護・福祉事業所の運営に必要な様々な業務を、段階的に追加していける拡張性の高いプラットフォームを目指しています。

**Phase 2 Status**: ✅ 完全なエンドツーエンド垂直スライスを実装済み（Residents管理）

## Tech Stack

### Backend
- **NestJS** - エンタープライズグレードのNode.jsフレームワーク
- **Prisma** - 型安全なORMでPostgreSQLと連携
- **PostgreSQL** - メインデータベース
- **Vitest** - 高速なユニットテストフレームワーク
- **class-validator** - リクエストバリデーション

### Frontend
- **Next.js 14** - App Routerを使用したReactフレームワーク
- **Tailwind CSS** - ユーティリティファーストのCSSフレームワーク
- **shadcn/ui** - アクセシブルで美しいUIコンポーネント
- **TypeScript** - エンドツーエンドの型安全性

### Infrastructure
- **Docker & Docker Compose** - コンテナ化された開発環境
- **Turborepo** - モノレポ管理
- **pnpm** - 高速なパッケージマネージャー

## Domain Model Summary

主要なエンティティと関係:

```
Facility (事業所)
  ├── Resident (利用者) - 要介護度、医療情報フラグ
  ├── Staff (職員) - 役職、資格、雇用形態
  ├── Shift (シフト) - 外部システム連携対応
  ├── Claim (請求) - 月次請求データ
  ├── IncidentReport (事故・ヒヤリハット)
  ├── Task (業務タスク) - カンバン形式
  └── Document (文書) - メタデータ管理
```

詳細は `packages/database/prisma/schema.prisma` を参照してください。

## Getting Started

### Requirements

- Node.js 18以上
- pnpm 8以上
- Docker & Docker Compose

### Setup Steps

1. **リポジトリのクローン**
   ```bash
   git clone <repository-url>
   cd welfare-facility-erp-suite
   ```

2. **環境変数の設定**
   ```bash
   # API用の環境変数
   cp apps/api/.env.example apps/api/.env

   # Web用の環境変数
   cp apps/web/.env.example apps/web/.env
   ```

3. **Docker Composeで起動（推奨）**
   ```bash
   # PostgreSQLとRedisを起動
   docker-compose up -d postgres redis
   ```

4. **依存関係のインストールとセットアップ**
   ```bash
   # 依存関係インストール、DB初期化、シードデータ投入
   pnpm setup

   # または個別に実行
   pnpm install
   pnpm db:generate
   pnpm db:push
   pnpm db:seed
   ```

5. **開発サーバーの起動**
   ```bash
   pnpm dev
   ```

   - **API**: http://localhost:3001
   - **Web**: http://localhost:3000
   - **API Documentation**: http://localhost:3001/api (Swagger UI)

### Alternative: Manual Database Setup

Docker Composeを使わない場合：

```bash
# PostgreSQLを手動でインストール・起動

# apps/api/.env を編集
DATABASE_URL="postgresql://postgres:password@localhost:5432/welfare_erp?schema=public"

# DBセットアップ
pnpm db:generate
pnpm db:push
pnpm db:seed
```

## Example Flow - Residents Management (Vertical Slice)

完全に動作するエンドツーエンドフローの例:

### 1. デモデータの確認

シードスクリプトにより、以下のデータが自動投入されます:
- 2つの事業所（さくら介護センター、ひまわりデイサービス）
- 4名の利用者
- 3名の職員
- タスク、インシデントレポート、請求データ

### 2. API経由でのCRUD操作

```bash
# 事業所一覧を取得
curl http://localhost:3001/facilities

# 利用者一覧を取得
curl http://localhost:3001/residents?facilityId=<facility-id>

# 利用者詳細を取得
curl http://localhost:3001/residents/<resident-id>

# 新規利用者を登録
curl -X POST http://localhost:3001/residents \
  -H "Content-Type: application/json" \
  -d '{
    "facilityId": "<facility-id>",
    "lastName": "テスト",
    "firstName": "太郎",
    "dateOfBirth": "1950-01-01",
    "gender": "male",
    "careLevel": 2
  }'

# 利用者情報を更新
curl -X PUT http://localhost:3001/residents/<resident-id> \
  -H "Content-Type: application/json" \
  -d '{"careLevel": 3}'

# 利用者を削除
curl -X DELETE http://localhost:3001/residents/<resident-id>
```

### 3. Webインターフェース経由での操作

1. http://localhost:3000/residents にアクセス
2. 事業所を選択
3. 利用者一覧が表示される
4. 「詳細」ボタンで個別ページへ遷移
5. 編集・削除が可能

### 4. バリデーションとエラーハンドリング

APIは以下を自動的に検証:
- 必須フィールドの存在
- データ型の正確性
- 要介護度の範囲（0-5）
- 性別のenum値
- 存在しない事業所への参照を拒否

エラーレスポンス例:
```json
{
  "statusCode": 400,
  "timestamp": "2024-01-20T12:00:00.000Z",
  "path": "/residents",
  "method": "POST",
  "message": ["careLevel must not be greater than 5"],
  "error": "Bad Request"
}
```

## Available Scripts

### Root Level

```bash
pnpm dev          # 全アプリを開発モードで起動
pnpm build        # 全アプリをビルド
pnpm start        # 全アプリを本番モードで起動
pnpm test         # 全アプリのテストを実行
pnpm lint         # 全アプリのLintを実行

# データベース関連
pnpm db:generate  # Prisma Clientを生成
pnpm db:push      # スキーマをDBに反映
pnpm db:migrate   # マイグレーション実行
pnpm db:seed      # シードデータ投入
pnpm db:studio    # Prisma Studio起動

# ワンコマンドセットアップ
pnpm setup        # install → generate → push → seed
```

### API (apps/api)

```bash
cd apps/api
pnpm dev          # 開発モード起動（ホットリロード）
pnpm build        # ビルド
pnpm start        # 本番モード起動
pnpm test         # Vitestテスト実行
pnpm test:watch   # Vitestウォッチモード
pnpm lint         # ESLint実行
```

### Web (apps/web)

```bash
cd apps/web
pnpm dev          # 開発モード起動
pnpm build        # 本番ビルド
pnpm start        # 本番サーバー起動
pnpm lint         # Next.js Lint実行
```

## Testing

### Running Tests

```bash
# 全テストを実行
pnpm test

# APIのテストのみ実行
cd apps/api && pnpm test

# ウォッチモード
cd apps/api && pnpm test:watch
```

### Test Coverage

現在の実装:
- ✅ Residents Service - ユニットテスト（モック使用）
  - バリデーション（必須フィールド、データ範囲）
  - エラーハンドリング（NotFound, BadRequest）
  - CRUD操作の動作確認

将来追加予定:
- E2Eテスト（Supertest）
- フロントエンドテスト（Vitest + Testing Library）
- インテグレーションテスト

## Architecture & DX Features

### Type Safety
- PrismaによるDB→TypeScript型生成
- class-validatorによる実行時バリデーション
- APIからフロントエンドまで完全な型推論

### Error Handling
- グローバルExceptionFilter
- 一貫したエラーレスポンス形式
- 適切なHTTPステータスコード

### API Documentation
- Swagger UIによる自動生成
- リクエスト/レスポンスのスキーマ表示
- Try it out機能

### Developer Experience
- Turborepoによる効率的なビルド
- ホットリロード対応
- ワンコマンドセットアップ（`pnpm setup`）
- Docker Composeによる環境一貫性

## Project Structure

```
welfare-facility-erp-suite/
├── apps/
│   ├── api/                    # NestJS APIサーバー
│   │   ├── src/
│   │   │   ├── common/        # 共通フィルター、インターセプター
│   │   │   ├── facilities/    # 事業所管理
│   │   │   ├── residents/     # 利用者管理 ✅ 完全実装
│   │   │   ├── staff/         # 職員管理
│   │   │   ├── incidents/     # インシデント報告
│   │   │   ├── claims/        # 請求管理
│   │   │   ├── tasks/         # タスク管理
│   │   │   └── integration/   # 外部連携
│   │   └── vitest.config.ts   # テスト設定
│   └── web/                    # Next.js Webアプリ
│       └── src/
│           ├── app/
│           │   ├── dashboard/ # ダッシュボード
│           │   └── residents/ # 利用者管理画面 ✅ 完全実装
│           ├── components/    # UIコンポーネント
│           └── lib/
│               ├── api/       # 型安全なAPIクライアント
│               └── utils.ts   # ユーティリティ
└── packages/
    └── database/              # Prismaスキーマ
        ├── prisma/
        │   ├── schema.prisma  # データモデル定義
        │   └── seed.ts        # シードデータ ✅
        └── src/
            └── index.ts       # Prisma Client export
```

## Future Extensions

このシステムは拡張性を重視して設計されており、以下のモジュールを段階的に追加できます:

### Priority 1 - 基本業務
- [ ] **Staff CRUD** - 職員管理の完全実装
- [ ] **Incident Reports CRUD** - インシデント管理の完全実装
- [ ] **Authentication & Authorization** - ロールベースアクセス制御

### Priority 2 - 業務管理
- [ ] **在庫管理** - 消耗品・医薬品の在庫管理
- [ ] **送迎管理** - 送迎ルート最適化、運行記録
- [ ] **食事管理** - 献立作成、栄養管理
- [ ] **バイタル記録** - 体温、血圧などの記録と分析

### Priority 3 - ケア記録
- [ ] **介護記録** - 日々のケア記録の電子化
- [ ] **ケアプラン管理** - ケアプラン作成・更新支援
- [ ] **モニタリング** - 利用者状態の定期モニタリング

### Priority 4 - 連携・分析
- [ ] **家族ポータル** - 家族向け情報共有
- [ ] **医療機関連携** - 診療情報の共有
- [ ] **BI/ダッシュボード** - KPI可視化、経営分析
- [ ] **監査ログ** - 全操作の監査証跡

## Docker Deployment

### Development with Docker Compose

```bash
# すべてのサービスを起動
docker-compose up

# バックグラウンドで起動
docker-compose up -d

# ログを確認
docker-compose logs -f

# 停止
docker-compose down
```

### Production Build

```bash
# ビルド
pnpm build

# 本番起動
pnpm start
```

## Troubleshooting

### データベース接続エラー

```bash
# PostgreSQLが起動しているか確認
docker-compose ps

# ログ確認
docker-compose logs postgres

# 再起動
docker-compose restart postgres
```

### Prisma Clientエラー

```bash
# Prisma Clientを再生成
pnpm db:generate

# DBスキーマを再同期
pnpm db:push
```

### ポート競合

デフォルトポート:
- API: 3001
- Web: 3000
- PostgreSQL: 5432
- Redis: 6379

変更する場合は `.env` ファイルを編集してください。

## Contributing

1. 新機能はブランチを切って開発
2. テストを追加
3. Pull Requestを作成

## License

MIT

---

**介護・福祉の現場をITで支える、拡張可能なプラットフォーム**

Phase 2 - Production Ready ✅
