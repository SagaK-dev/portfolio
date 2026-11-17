(() => {
  "use strict";

  const byId = id => document.getElementById(id);
  const list = byId("entries");
  const empty = byId("empty");
  const status = byId("status");
  const add = byId("add");
  const download = byId("download");
  const records = [];

  function render() {
    list.replaceChildren();
    empty.hidden = records.length > 0;
    for (const [index, record] of records.entries()) {
      const item = document.createElement("li");
      const nameLabel = document.createElement("label");
      const name = document.createElement("input");
      name.id = `name-${index}`;
      name.type = "text";
      name.value = record.name;
      name.placeholder = "例：Java";
      name.maxLength = 120;
      name.required = true;
      nameLabel.htmlFor = name.id;
      nameLabel.textContent = "技術名（必須）";
      name.addEventListener("input", () => { record.name = name.value; });

      const descriptionLabel = document.createElement("label");
      const description = document.createElement("textarea");
      description.id = `description-${index}`;
      description.value = record.description;
      description.placeholder = "この技術の説明";
      description.maxLength = 3000;
      descriptionLabel.htmlFor = description.id;
      descriptionLabel.textContent = "説明";
      description.addEventListener("input", () => { record.description = description.value; });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove";
      remove.textContent = "一覧から削除";
      remove.setAttribute("aria-label", `${record.name || "この技術"}を一覧から削除`);
      name.addEventListener("input", () => {
        remove.setAttribute("aria-label", `${record.name || "この技術"}を一覧から削除`);
      });
      remove.addEventListener("click", () => {
        const removedName = record.name.trim() || "技術";
        records.splice(records.indexOf(record), 1);
        status.textContent = `${removedName}を一覧から除きました。`;
        render();
        add.focus();
      });
      item.append(nameLabel, name, descriptionLabel, description, remove);
      list.append(item);
    }
  }

  add.addEventListener("click", () => {
    records.push({ name: "", description: "" });
    render();
    byId(`name-${records.length - 1}`).focus();
    status.textContent = "技術名と説明を入力してください。";
  });

  download.addEventListener("click", () => {
    const missingIndex = records.findIndex(record => !record.name.trim());
    if (missingIndex !== -1) {
      status.textContent = "技術名を入力するか、不要な項目を削除してください。";
      byId(`name-${missingIndex}`).focus();
      return;
    }
    const technologies = records.map(({ name, description }) => ({
      name: name.trim(),
      description: description.trim()
    }));
    const content = `// 技術追加ページで編集した技術の一覧です。\nwindow.PORTFOLIO_TECHNOLOGIES = ${JSON.stringify(technologies, null, 2)};\n`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/javascript;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "technologies.js";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = "技術一覧を保存しました。technologies.js を GitHub にアップロードしてください。";
  });

  // 既存の一覧を読み込めない場合は、うっかり空の一覧で上書きしないようにします。
  const dataScript = document.createElement("script");
  const dataUrl = new URL("./technologies.js", window.location.href);
  if (dataUrl.protocol === "http:" || dataUrl.protocol === "https:") dataUrl.searchParams.set("v", String(Date.now()));
  dataScript.src = dataUrl.href;
  dataScript.onload = () => {
    const saved = window.PORTFOLIO_TECHNOLOGIES;
    if (!Array.isArray(saved) || saved.some(record =>
      !record || typeof record !== "object" || typeof record.name !== "string" ||
      !record.name.trim() || (record.description != null && typeof record.description !== "string")
    )) {
      status.textContent = "技術一覧を読み込めませんでした。technologies.js の内容を確認してください。";
      return;
    }
    records.push(...saved.map(record => ({ name: record.name, description: record.description || "" })));
    add.disabled = false;
    download.disabled = false;
    status.textContent = "";
    render();
  };
  dataScript.onerror = () => { status.textContent = "技術一覧を読み込めませんでした。ページを再読み込みしてください。"; };
  document.head.append(dataScript);
})();
