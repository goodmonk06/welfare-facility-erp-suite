# Welfare Facility ERP Suite

介護・福祉事業所向けの業務システム基盤プロジェクトです。

## コンセプト

このシステムは **"ERPというより、必要になったモジュールを増やす前提の箱"** として設計されています。

介護・福祉事業所の運営に必要な様々な業務を、**段階的に追加していける拡張性の高いプラットフォーム**を目指しています。最初から全ての機能を実装するのではなく、事業所の状況やニーズに合わせて、必要な機能モジュールを追加していくアプローチを採用しています。

## 技術スタック

### バックエンド
- **NestJS** - エンタープライズグレードのNode.jsフレームワーク
- **Prisma** - 型安全なORMでPostgreSQLと連携
- **PostgreSQL** - メインデータベース
- **Redis** - キャッシュとジョブキュー（将来実装予定）

### フロントエンド
- **Next.js 14** - App Routerを使用したReactフレームワーク
- **Tailwind CSS** - ユーティリティファーストのCSSフレームワーク
- **shadcn/ui** - アクセシブルで美しいUIコンポーネント
- **Lucide Icons** - モダンなアイコンセット

### 開発環境
- **Turborepo** - モノレポ管理
- **TypeScript** - 型安全性の確保
- **pnpm** - 高速なパッケージマネージャー

## プロジェクト構成

```
welfare-facility-erp-suite/
├── apps/
│   ├── api/              # NestJS APIサーバー
│   │   └── src/
│   │       ├── residents/       # 利用者管理モジュール
│   │       ├── staff/           # 職員管理モジュール
│   │       ├── incidents/       # インシデント報告モジュール
│   │       ├── claims/          # 請求管理モジュール
│   │       ├── tasks/           # タスク管理モジュール
│   │       └── integration/     # 外部連携モジュール
│   └── web/              # Next.js Webアプリケーション
│       └── src/
│           └── app/
│               ├── dashboard/   # ダッシュボード
│               ├── residents/   # 利用者管理画面
│               ├── staff/       # 職員管理画面
│               ├── incidents/   # インシデント報告画面
│               ├── claims/      # 請求管理画面
│               └── tasks/       # タスク管理画面
└── packages/
    └── database/         # Prismaスキーマと共有データベースクライアント
```

## 実装済み機能

### 1. 利用者管理（Residents）
- 利用者の基本情報管理
- 要介護度の記録
- 入退所管理
- 医療情報フラグ（簡易版）

### 2. 職員管理（Staff）
- 職員の基本情報
- 役職・雇用形態管理
- 資格情報の記録
- シフト連携

### 3. インシデント報告（Incident Reports）
- 事故・ヒヤリハット報告
- 重要度分類
- 対応履歴の記録
- 統計情報の表示

### 4. 請求管理（Claims）
- 月次請求データ管理
- 請求ステータス管理
- 請求サマリの表示
- 金額集計機能

### 5. タスク管理（Tasks）
- カンバン形式のタスク管理
- 優先度設定
- 担当者アサイン
- 期限管理

### 6. シフト連携（Integration）
- 外部システム（shift-scheduler-v3）からのシフトインポート
- CSV/JSON形式対応
- 重複チェック機能

## データモデル

主要なエンティティ：

- **Facility**: 事業所情報
- **Resident**: 入所者/利用者
- **Staff**: 職員
- **Shift**: シフト情報
- **Claim**: 請求データ
- **IncidentReport**: 事故・ヒヤリハット
- **Task**: 業務タスク
- **Document**: 文書管理（メタデータ）

詳細は `packages/database/prisma/schema.prisma` を参照してください。

## セットアップ

### 前提条件
- Node.js 18以上
- pnpm 8以上
- PostgreSQL 14以上
- Docker & Docker Compose（推奨）

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. データベースのセットアップ

Docker Composeを使用する場合：

```bash
docker-compose up -d
```

### 3. 環境変数の設定

APIサーバーの環境変数：

```bash
cd apps/api
cp .env.example .env
# DATABASE_URLなどを編集
```

### 4. データベースマイグレーション

```bash
pnpm db:generate
pnpm db:push
```

### 5. 開発サーバーの起動

```bash
pnpm dev
```

- API: http://localhost:3001
- Web: http://localhost:3000
- API Documentation: http://localhost:3001/api

## 今後追加予定のモジュール

このシステムは拡張性を重視して設計されており、以下のモジュールを段階的に追加していくことができます：

### 業務管理系
- [ ] **在庫管理** - 消耗品・医薬品の在庫管理
- [ ] **送迎管理** - 送迎ルート最適化、運行記録
- [ ] **食事管理** - 献立作成、栄養管理、食材発注
- [ ] **入浴管理** - 入浴スケジュール、記録
- [ ] **バイタル記録** - 体温、血圧などの記録と分析

### ケア記録系
- [ ] **介護記録** - 日々のケア記録の電子化
- [ ] **ケアプラン管理** - ケアプラン作成・更新支援
- [ ] **モニタリング** - 利用者状態の定期モニタリング
- [ ] **アセスメント** - 包括的なアセスメント機能

### 連携・コミュニケーション
- [ ] **家族ポータル** - 家族向け情報共有プラットフォーム
- [ ] **医療機関連携** - 診療情報の共有
- [ ] **行政報告** - 各種行政報告の自動生成
- [ ] **スタッフコミュニケーション** - チャット、申し送り

### 分析・レポート
- [ ] **BI/ダッシュボード** - KPI可視化、経営分析
- [ ] **リスク分析** - インシデントパターン分析
- [ ] **稼働率分析** - 施設・スタッフ稼働率の可視化
- [ ] **収支分析** - 詳細な収支レポート

### その他
- [ ] **権限管理** - ロールベースアクセス制御（RBAC）
- [ ] **監査ログ** - 全操作の監査証跡
- [ ] **通知システム** - メール・プッシュ通知
- [ ] **ワークフロー** - 承認フローの自動化
- [ ] **帳票出力** - 各種帳票のPDF出力

## API仕様

APIの詳細仕様は Swagger UI で確認できます：
http://localhost:3001/api

主要なエンドポイント：

- `GET /residents` - 利用者一覧
- `GET /staff` - 職員一覧
- `GET /incidents` - インシデント一覧
- `GET /claims` - 請求一覧
- `GET /tasks` - タスク一覧
- `POST /integration/shifts/import` - シフトインポート

## 外部システム連携

### shift-scheduler-v3 連携

シフト情報をインポートするためのエンドポイント：

```bash
POST /integration/shifts/import
Content-Type: application/json

{
  "facilityId": "facility-id",
  "source": "shift-scheduler-v3",
  "shifts": [
    {
      "staffId": "staff-id",
      "date": "2024-01-20",
      "shiftType": "day",
      "startTime": "09:00",
      "endTime": "18:00"
    }
  ]
}
```

## 開発ガイドライン

### 新しいモジュールの追加手順

1. **データモデルの定義**
   ```prisma
   // packages/database/prisma/schema.prisma
   model NewFeature {
     id String @id @default(cuid())
     // フィールド定義
   }
   ```

2. **NestJSモジュールの作成**
   ```bash
   cd apps/api/src
   mkdir new-feature
   # module, service, controller, dto を作成
   ```

3. **フロントエンド画面の実装**
   ```bash
   cd apps/web/src/app
   mkdir new-feature
   # page.tsx を作成
   ```

4. **サイドバーにメニュー追加**
   - `apps/web/src/components/sidebar.tsx` を編集

## テスト

```bash
# ユニットテスト
pnpm test

# E2Eテスト
pnpm test:e2e
```

## デプロイ

```bash
# ビルド
pnpm build

# 本番起動
pnpm start
```

## ライセンス

MIT

## サポート

問題や質問がある場合は、GitHubのIssuesで報告してください。

---

**介護・福祉の現場をITで支える、拡張可能なプラットフォーム**
