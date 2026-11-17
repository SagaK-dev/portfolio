(() => {
  "use strict";

  const data = window.PORTFOLIO_DATA || {};
  const clean = value => typeof value === "string" ? value.trim() : "";
  const entries = value => Array.isArray(value) ? value : [];
  const byId = id => document.getElementById(id);

  // http(s) と相対パスのみをリンクとして扱います。
  function safeUrl(value) {
    const raw = clean(value);
    if (!raw || /[\u0000-\u001f\u007f]/.test(raw)) return "";
    try {
      const url = new URL(raw, document.baseURI);
      if (url.protocol === "https:" || url.protocol === "http:") return raw;
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
  byId("profile-mark").textContent = name.split(/[\s.]+/u)
    .filter(Boolean).map(part => Array.from(part)[0]).join("").slice(0, 2).toUpperCase();
  document.title = `${name} | ポートフォリオ`;
  document.querySelector('meta[name="description"]').content = `${name} のポートフォリオ。制作物と自己紹介を掲載しています。`;
  setText("hero-role", clean(data.role));

  const projectList = byId("project-list");
  for (const project of entries(data.projects)) {
    if (!project || typeof project !== "object" || !clean(project.title)) continue;
    const article = document.createElement("article");
    article.className = "project";
    const validLinks = entries(project.links).flatMap(item => {
      if (!item || typeof item !== "object") return [];
      const label = clean(item.label);
      const url = safeUrl(item.url);
      return label && url ? [{ label, url }] : [];
    });
    const cover = document.createElement(validLinks.length ? "a" : "div");
    cover.className = "project-cover";
    if (validLinks.length) {
      cover.href = validLinks[0].url;
      cover.setAttribute("aria-label", `${clean(project.title)}：${validLinks[0].label}`);
    }
    const imageUrl = safeUrl(project.image);
    if (imageUrl) {
      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = clean(project.imageAlt) || `${clean(project.title)} の画像`;
      image.loading = "lazy";
      cover.append(image);
    } else {
      const initial = document.createElement("span");
      initial.className = "project-initial";
      initial.setAttribute("aria-hidden", "true");
      initial.textContent = Array.from(clean(project.title))[0].toUpperCase();
      cover.append(initial);
    }
    article.append(cover);

    const detail = document.createElement("div");
    detail.className = "project-detail";
    const heading = document.createElement("h3");
    heading.textContent = clean(project.title);
    detail.append(heading);
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
    for (const { label, url } of validLinks) {
      const li = document.createElement("li");
      li.append(makeLink(label, url));
      links.append(li);
    }
    if (links.children.length) meta.append(links);
    if (meta.children.length) detail.append(meta);
    article.append(detail);

    projectList.append(article);
  }
  toggleSection("projects", projectList.children.length > 0);

  const photoList = byId("photo-list");
  const managedPhotos = entries(window.PHOTO_GALLERY).flatMap(photo => {
    if (!photo || typeof photo !== "object") return [];
    const filename = clean(photo.file);
    if (!filename || filename !== photo.file || !/\.png$/i.test(filename) || /[\\/\u0000-\u001f\u007f]/.test(filename)) return [];
    const caption = clean(photo.caption);
    try {
      return [{ src: `./photos/${encodeURIComponent(filename)}`, alt: caption || filename.replace(/\.png$/i, ""), caption }];
    } catch (_) {
      return [];
    }
  });
  for (const photo of [...entries(data.photos), ...managedPhotos]) {
    if (!photo || typeof photo !== "object") continue;
    const source = safeUrl(photo.src);
    if (!source) continue;
    const caption = clean(photo.caption);
    const alt = clean(photo.alt) || caption || "写真";
    const figure = document.createElement("figure");
    figure.className = "photo-item";
    const link = document.createElement("a");
    link.href = source;
    link.setAttribute("aria-label", `${alt}を開く`);
    const image = document.createElement("img");
    image.src = source;
    image.alt = alt;
    image.loading = "lazy";
    image.decoding = "async";
    link.append(image);
    figure.append(link);
    if (caption) {
      const text = document.createElement("figcaption");
      text.textContent = caption;
      figure.append(text);
    }
    photoList.append(figure);
  }
  byId("photo-empty").hidden = photoList.children.length > 0;

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
  function addContact(label, text, url = "") {
    if (!label || !text) return;
    const li = document.createElement("li");
    const category = document.createElement("span");
    category.className = "contact-label";
    category.textContent = label;
    const value = url ? makeLink(text, url) : document.createElement("span");
    if (!url) {
      value.className = "contact-value";
      value.textContent = text;
    }
    li.append(category, value);
    contactList.append(li);
  }
  const email = clean(contact.email);
  if (email) addContact("メール", email);
  for (const item of entries(contact.links)) {
    if (!item || typeof item !== "object") continue;
    const url = safeUrl(item.url);
    if (url) addContact(clean(item.label), clean(item.text) || clean(item.label), url);
  }
  toggleSection("contact", contactList.children.length > 0);

  const nextSection = ["projects", "photos", "about", "contact"].find(id => !byId(id).hidden);
  const heroNext = byId("hero-next");
  heroNext.hidden = !nextSection;
  if (nextSection) {
    heroNext.href = `#${nextSection}`;
    const labels = { projects: "制作物へ移動", photos: "写真へ移動", about: "自己紹介へ移動", contact: "連絡先へ移動" };
    heroNext.setAttribute("aria-label", labels[nextSection]);
  }
})();
