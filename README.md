# K.Saga ポートフォリオ

制作物、写真、自己紹介、連絡先を掲載する静的サイトです。HTML、CSS、JavaScript のみで動作します。

## ファイル構成

```text
portfolio/
├── index.html      ページの構造
├── style.css       デザイン
├── site-data.js    名前、制作物、写真、自己紹介、連絡先の設定
├── script.js       設定をページに表示する処理
├── fonts/          Great Vibes フォントとライセンス
└── images/         制作物の画像や写真を置く場所
```

## 内容を変更する

`site-data.js` をテキストエディター、または GitHub のファイル編集画面で開いて編集します。ファイルを保存した後、ブラウザーのページを再読み込みしてください。

- `name`：名前・活動名
- `role`：職種・活動内容。空欄の場合は表示されません。
- `about`：自己紹介
- `skills`：スキルの一覧。不要な場合は `[]` のままにします。
- `projects`：制作物の一覧
- `photos`：写真の一覧。空の場合は「写真はまだありません。」と表示されます。
- `contact.email`：メールアドレス。不要な場合は `""` にします。
- `contact.links`：GitHub などへのリンク。不要な場合は `[]` にします。

制作物、自己紹介、連絡先が空の場合、それぞれの項目とナビゲーションは表示されません。

### 制作物を追加する

`projects` の `[ ]` の中に、項目をカンマで区切って追加します。以下は書き方の**記入例**です。公開前に実際の情報に書き換えるか、削除してください。

```js
projects: [
  {
    title: "作品名",
    description: "作品の説明。",
    technologies: ["使用技術"],
    image: "./images/example.png",
    imageAlt: "画像の内容を説明する短い文章",
    links: [
      { label: "作品を見る", url: "https://example.com/" }
    ]
  },
  {
    title: "別の作品名",
    description: "別の作品の説明。",
    technologies: [],
    image: "",
    imageAlt: "",
    links: []
  }
],
```

画像やリンクが不要な場合は、例のように `""` や `[]` にしてください。リンクは複数追加できます。現在の Saga のリンクには、ご指定の GitHub プロフィール URL を設定しています。作品専用の URL がある場合は `projects` 内の `url` を変更してください。

### 画像を追加する

1. 画像ファイルを `images` フォルダーに置きます。GitHub 上では、リポジトリの `images` フォルダーを開き、`Add file` → `Upload files` からアップロードできます。
2. 該当する制作物の `image` に、`"./images/ファイル名.png"` のように入力します。実際のファイル名と大文字・小文字を一致させてください。
3. `imageAlt` に、画像の内容が伝わる短い説明を入力します。

### 写真を追加する

1. 写真を `images` フォルダーにアップロードします。ファイル名の大文字・小文字も含めて正確に控えてください。
2. `site-data.js` の `photos` に写真を追加します。`src` には画像のパス、`alt` には写真の内容、`caption` には必要に応じて説明文を入力します。

以下は**記入例**です。実際のファイル名と説明に変更して使用してください。

```js
photos: [
  { src: "./images/photo-01.jpg", alt: "山の風景", caption: "山の風景" },
  { src: "./images/photo-02.jpg", alt: "街の風景", caption: "" }
],
```

`caption` を空欄にすると説明文は表示されません。写真をクリックすると画像全体を表示できます。

## ローカルで確認する

ファイルを同じフォルダーに保存し、`index.html` をブラウザーで開きます。インストールやビルドは不要です。ページの内容を表示するには JavaScript を有効にしてください。

## GitHub Pages で公開する

1. このリポジトリの **Settings** → **Pages** を開きます。
2. **Build and deployment** の **Source** で **Deploy from a branch** を選択します。
3. **Branch** で `main` と `/(root)` を選び、**Save** を押します。
4. デプロイの完了後、Pages の設定画面に表示される URL を開きます。このリポジトリの標準 URL は `https://sagak-dev.github.io/portfolio/` です。

以後は `main` ブランチのファイルを更新すると、公開サイトにも反映されます。反映まで少し時間がかかる場合があります。
