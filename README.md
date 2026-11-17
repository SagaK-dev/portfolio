# K.Saga ポートフォリオ

制作物、写真、自己紹介、技術紹介、連絡先を掲載する静的サイトです。HTML、CSS、JavaScript のみで動作します。

## ファイル構成

```text
portfolio/
├── index.html      ページの構造
├── style.css       デザイン
├── site-data.js    名前、制作物、写真、自己紹介、連絡先の設定
├── script.js       設定をページに表示する処理
├── fonts/          Great Vibes フォントとライセンス
├── images/         制作物の画像を置く場所
├── photos/         写真・写真一覧・写真追加ページ
└── technologies/   技術一覧・技術追加ページ
```

## 内容を変更する

`site-data.js` をテキストエディター、または GitHub のファイル編集画面で開いて編集します。ファイルを保存した後、ブラウザーのページを再読み込みしてください。

- `name`：名前・活動名
- `role`：職種・活動内容。空欄の場合は表示されません。
- `about`：自己紹介
- `skills`：スキルの一覧。不要な場合は `[]` のままにします。
- `projects`：制作物の一覧
- `photos`：手動で登録する写真の一覧。写真追加ページで登録した写真は `photos/gallery.js` に保存されます。
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

1. [写真追加ページ](https://sagak-dev.github.io/portfolio/photos/manage.html)を開き、PNG ファイルを選びます。
2. 写真の説明を入力し、**写真一覧を保存** を押します。`gallery.js` がダウンロードされます。
3. [GitHub のアップロード画面](https://github.com/SagaK-dev/portfolio/upload/main/photos)を開き、今回選んだ PNG ファイルと `gallery.js` の両方をドラッグし、**Commit changes** を押します。

ファイル名は `gallery.js` にしてください。ダウンロード時に `gallery (1).js` などになった場合は、名前を変更してからアップロードします。説明は写真の下に表示されます。写真をクリックすると画像全体を表示できます。

写真追加ページで以前登録した写真とその説明も表示されます。一覧から写真を除いて保存すると、サイト上からは消えますが、画像ファイルは GitHub に残ります。`site-data.js` に手動で登録した写真も引き続き表示されます。

### 技術を追加する

1. [技術追加ページ](https://sagak-dev.github.io/portfolio/technologies/manage.html)を開き、**技術を追加** を押します。
2. 技術名と説明を入力します。必要な数だけ追加でき、以前登録した項目の編集・削除もできます。
3. **技術一覧を保存** を押し、ダウンロードした `technologies.js` を[GitHub のアップロード画面](https://github.com/SagaK-dev/portfolio/upload/main/technologies)にドラッグし、**Commit changes** を押します。

ファイル名は `technologies.js` にしてください。ダウンロード時に `technologies (1).js` などになった場合は、名前を変更してからアップロードします。技術紹介は連絡先の上に表示されます。

写真追加ページと技術追加ページは、URL を知っていれば誰でも開けます。ただし、ページで操作しただけでは公開サイトは変更されず、反映にはリポジトリへの書き込み権限が必要です。

## ローカルで確認する

ファイルを同じフォルダーに保存し、`index.html` をブラウザーで開きます。インストールやビルドは不要です。ページの内容を表示するには JavaScript を有効にしてください。

本文には Google Fonts の BIZ UDPGothic を使用します。読み込めない環境では端末のフォントで表示されます。

## GitHub Pages で公開する

1. このリポジトリの **Settings** → **Pages** を開きます。
2. **Build and deployment** の **Source** で **Deploy from a branch** を選択します。
3. **Branch** で `main` と `/(root)` を選び、**Save** を押します。
4. デプロイの完了後、Pages の設定画面に表示される URL を開きます。このリポジトリの標準 URL は `https://sagak-dev.github.io/portfolio/` です。

以後は `main` ブランチのファイルを更新すると、公開サイトにも反映されます。反映まで少し時間がかかる場合があります。

