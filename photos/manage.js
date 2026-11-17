(() => {
  "use strict";

  const byId = id => document.getElementById(id);
  const filesInput = byId("photo-files");
  const list = byId("photo-entries");
  const empty = byId("empty");
  const status = byId("status");
  const download = byId("download");
  const records = [];

  function validFilename(filename) {
    if (typeof filename !== "string" || filename !== filename.trim() || !/\.png$/i.test(filename) || /[\\/\u0000-\u001f\u007f]/.test(filename)) return false;
    try { encodeURIComponent(filename); return true; } catch (_) { return false; }
  }

  function render() {
    list.replaceChildren();
    empty.hidden = records.length > 0;
    for (const [index, record] of records.entries()) {
      const item = document.createElement("li");
      const image = document.createElement("img");
      image.alt = "";
      image.loading = "lazy";
      image.src = record.preview || `./${encodeURIComponent(record.file)}`;
      const name = document.createElement("strong");
      name.textContent = record.file;
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.id = `caption-${index}`;
      input.type = "text";
      input.value = record.caption;
      input.placeholder = "写真の説明";
      label.htmlFor = input.id;
      label.textContent = "写真の説明（任意）";
      input.addEventListener("input", () => { record.caption = input.value; });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove";
      remove.textContent = "一覧から削除";
      remove.setAttribute("aria-label", `${record.file}を一覧から削除`);
      remove.addEventListener("click", () => {
        records.splice(records.indexOf(record), 1);
        if (record.preview) URL.revokeObjectURL(record.preview);
        status.textContent = `${record.file}を一覧から除きました。`;
        render();
      });
      item.append(image, name, label, input, remove);
      list.append(item);
    }
  }

  filesInput.addEventListener("change", () => {
    const skipped = [];
    let added = 0;
    for (const file of filesInput.files) {
      if (!validFilename(file.name) || records.some(record => record.file.toLocaleLowerCase() === file.name.toLocaleLowerCase())) {
        skipped.push(file.name);
        continue;
      }
      records.push({ file: file.name, caption: "", preview: URL.createObjectURL(file) });
      added += 1;
    }
    filesInput.value = "";
    status.textContent = skipped.length
      ? `${added}枚を追加しました。PNG 以外または同じ名前のファイルは追加できませんでした：${skipped.join("、")}`
      : `${added}枚を追加しました。`;
    render();
  });

  download.addEventListener("click", () => {
    const photos = records.map(({ file, caption }) => ({ file, caption }));
    const content = `// 写真追加ページで編集した写真の一覧です。\nwindow.PHOTO_GALLERY = ${JSON.stringify(photos, null, 2)};\n`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/javascript;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "gallery.js";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = "写真一覧を保存しました。PNG と gallery.js を GitHub にアップロードしてください。";
  });

  // 常に最新の一覧を読み込み、既存の写真をうっかり上書きしないようにします。
  const gallery = document.createElement("script");
  const galleryUrl = new URL("./gallery.js", window.location.href);
  if (galleryUrl.protocol === "http:" || galleryUrl.protocol === "https:") galleryUrl.searchParams.set("v", String(Date.now()));
  gallery.src = galleryUrl.href;
  gallery.onload = () => {
    const saved = window.PHOTO_GALLERY;
    if (!Array.isArray(saved) || saved.some(record => !record || !validFilename(record.file) || (record.caption != null && typeof record.caption !== "string")) || new Set(saved.map(record => record.file.toLocaleLowerCase())).size !== saved.length) {
      status.textContent = "写真一覧を読み込めませんでした。gallery.js の内容を確認してください。";
      return;
    }
    records.push(...saved.map(record => ({ file: record.file, caption: record.caption || "" })));
    filesInput.disabled = false;
    download.disabled = false;
    status.textContent = "";
    render();
  };
  gallery.onerror = () => { status.textContent = "写真一覧を読み込めませんでした。ページを再読み込みしてください。"; };
  document.head.append(gallery);
})();
