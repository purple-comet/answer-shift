# アンサー音ズレ計算ツール

maimai の譜面データ（simai形式）から、楽曲とアンサー音のタイミングのズレを計算するWebツールです。

**本番URL:** https://answer-shift.vercel.app/

## プロジェクト構成

```
answer-shift/src/
├── index.ts            # アプリケーションのエントリーポイント
├── style.css           # スタイルシート
├── types.ts            # 型定義
└── scripts/
    ├── main.ts                  # メインロジック（イベント管理）
    ├── loadSimaiData.ts         # simai形式の譜面データ解析
    ├── calculateDifference.ts   # タイミングズレ計算
    ├── exportCsv.ts             # CSV出力機能
    └── utils.ts                 # ユーティリティ関数
```

## 開発情報

### 技術スタック

- **Vite** - ビルドツール/開発サーバー
- **TypeScript** - 型安全な開発
- **Vanilla JavaScript** - フレームワークレスの軽量実装

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

### 開発時の注意点

- TypeScriptのコンパイルは Vite が自動的に行います
- 開発サーバーは `http://localhost:5173` で起動します
- ビルド成果物は `dist/` ディレクトリに出力されます

## 作者

のん（NON＊RJ）
ご連絡はX(旧Twitter)のDMまでお願いします
X: https://x.com/non_otoge