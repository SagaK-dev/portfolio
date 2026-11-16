(() => {
  "use strict";

  const data = window.PORTFOLIO_DATA || {};
  const clean = value => typeof value === "string" ? value.trim() : "";
  const entries = value => Array.isArray(value) ? value : [];
  const byId = id => document.getElementById(id);

  // http(s)、相対パス、指定されたメールのみをリンクとして扱います。
  function safeUrl(value, allowEmail = false) {
    const raw = clean(value);
    if (!raw || /[\u0000-\u001f\u007f]/.test(raw)) return "";
    try {
      const url = new URL(raw, document.baseURI);
      if (url.protocol === "https:" || url.protocol === "http:") return raw;
      if (allowEmail && url.protocol === "mailto:" && /^mailto:/i.test(raw)) return raw;
      const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(raw);
      if (url.protocol === "file:" && !hasScheme && !raw.startsWith("//")) return raw;
    } catch (_) {
      // 不正な URL は表示しません。
    }
    return "";
  }

  function setText(id, value) {
    const element = byId(id);
    element.textContent = value;
    element.hidden = !value;
  }

  function toggleSection(id, visible) {
    byId(id).hidden = !visible;
    byId(`nav-${id}`).hidden = !visible;
  }

  function makeLink(label, url) {
    const link = document.createElement("a");
    link.href = url;
    link.append(document.createTextNode(label));
    const arrow = document.createElement("span");
    arrow.className = "link-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    link.append(arrow);
    return link;
  }

  const name = clean(data.name) || "ポートフォリオ";
  byId("header-name").textContent = name;
  byId("hero-name").textContent = name;
  byId("footer-name").textContent = name;
  document.title = `${name} | ポートフォリオ`;
  document.querySelector('meta[name="description"]').content = `${name} のポートフォリオ。制作物と自己紹介を掲載しています。`;
  setText("hero-role", clean(data.role));

  const projectList = byId("project-list");
  for (const project of entries(data.projects)) {
    if (!project || typeof project !== "object" || !clean(project.title)) continue;
    const article = document.createElement("article");
    article.className = "project";
    const heading = document.createElement("h3");
    heading.textContent = clean(project.title);
    article.append(heading);

    const detail = document.createElement("div");
    detail.className = "project-detail";
    const description = clean(project.description);
    if (description) {
      const paragraph = document.createElement("p");
      paragraph.className = "project-description";
      paragraph.textContent = description;
      detail.append(paragraph);
    }
    const meta = document.createElement("div");
    meta.className = "project-meta";
    const technologies = entries(project.technologies).map(clean).filter(Boolean);
    if (technologies.length) {
      const list = document.createElement("ul");
      list.className = "technology-list";
      list.setAttribute("aria-label", "使用技術");
      for (const technology of technologies) {
        const item = document.createElement("li");
        item.textContent = technology;
        list.append(item);
      }
      meta.append(list);
    }
    const links = document.createElement("ul");
    links.className = "project-links";
    for (const item of entries(project.links)) {
      if (!item || typeof item !== "object") continue;
      const label = clean(item.label);
      const url = safeUrl(item.url);
      if (!label || !url) continue;
      const li = document.createElement("li");
      li.append(makeLink(label, url));
      links.append(li);
    }
    if (links.children.length) meta.append(links);
    if (meta.children.length) detail.append(meta);
    article.append(detail);

    const imageUrl = safeUrl(project.image);
    if (imageUrl) {
      const figure = document.createElement("figure");
      figure.className = "project-image";
      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = clean(project.imageAlt) || `${clean(project.title)} の画像`;
      image.loading = "lazy";
      figure.append(image);
      article.append(figure);
    }
    projectList.append(article);
  }
  toggleSection("projects", projectList.children.length > 0);

  const about = clean(data.about);
  setText("about-text", about);
  const skillList = byId("skill-list");
  for (const skill of entries(data.skills).map(clean).filter(Boolean)) {
    const li = document.createElement("li");
    li.textContent = skill;
    skillList.append(li);
  }
  skillList.hidden = !skillList.children.length;
  toggleSection("about", Boolean(about || skillList.children.length));

  const contact = data.contact && typeof data.contact === "object" ? data.contact : {};
  const contactList = byId("contact-list");
  function addContact(label, text, url) {
    if (!label || !text || !url) return;
    const li = document.createElement("li");
    const category = document.createElement("span");
    category.className = "contact-label";
    category.textContent = label;
    li.append(category, makeLink(text, url));
    contactList.append(li);
  }
  const email = clean(contact.email);
  // メールアドレスを URL のクエリや追加ヘッダーとして解釈させない。
  if (email && !/[\s?#]/.test(email) && email.includes("@")) {
    addContact("メール", email, safeUrl(`mailto:${email}`, true));
  }
  for (const item of entries(contact.links)) {
    if (!item || typeof item !== "object") continue;
    addContact(clean(item.label), clean(item.text) || clean(item.label), safeUrl(item.url));
  }
  toggleSection("contact", contactList.children.length > 0);
})();
