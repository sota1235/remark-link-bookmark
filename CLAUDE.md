# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

`@sota1235/remark-link-bookmark` は、Markdown内のスタンドアロンHTTPS URLをブックマード（リンクカード）コンポーネントに変換するremarkプラグイン。unified/remarkエコシステム上に構築されている。

## 開発コマンド

```bash
# 依存関係のインストール
pnpm install

# ビルド（TypeScript → JavaScript）
pnpm build

# テスト（watchモード）
pnpm test

# テスト（CI、watchなし）
pnpm test:ci

# リント
pnpm lint

# フォーマット + リント修正
pnpm fix

# TypeScript watchモード
pnpm watch
```

- パッケージマネージャ: **pnpm**（npmではない）
- Node.js バージョン: `.node-version` で管理（22.16.0）
- テストフレームワーク: **Vitest**
- テストはスナップショットテスト（`src/snapshots/output.md`）を使用

## アーキテクチャ

```
src/
├── index.ts      # エントリポイント。プラグインとOptions型をエクスポート
├── plugin.ts     # プラグイン本体。Markdown ASTを走査し、単独のHTTPS URLを含むparagraphノードをブックマークHTMLに置換
├── ogp.ts        # open-graph-scraperでOGPメタデータを取得。ファイルベースのキャッシュ機構あり
├── view.ts       # ブックマークHTMLを生成。dompurifyでXSS対策済み。clsxでクラス名をマージ
├── url.ts        # URL検証（HTTPSのみ許可）
├── logger.ts     # debugライブラリのラッパー（DEBUG=remark-link-bookmark で有効化）
└── convert.test.ts  # 統合テスト（remark経由でプラグイン全体をテスト）
```

**処理フロー**: `plugin.ts`がMarkdown ASTのparagraphノードをvisitし、単一テキストノードがHTTPS URLの場合 → `ogp.ts`でOGP情報取得 → `view.ts`でHTML生成 → ASTノードをHTMLノードに置換。

## ビルド・公開

- `tsconfig.publish.json`はテストファイルを除外したビルド用設定
- npm公開はGitHub Actionsで`main`ブランチへのpush時に`package.json`のバージョン変更を検知して自動実行
- pre-commitフック（husky + lint-staged）で`.ts`ファイルにフォーマッタ・リンタを自動適用
