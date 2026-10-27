"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function ReferenceExperience({ markup }: { markup: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const equipmentDialogRef = useRef<HTMLDialogElement>(null);
  const equipmentVideoSlotRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [dialog, setDialog] = useState<"contact" | "fees" | "kakao" | null>(null);
  const html = useMemo(() => ({ __html: markup }), [markup]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const header = root.querySelector<HTMLElement>("#header")!;
    const hero = root.querySelector<HTMLElement>("#keyvisualMain .slide")!;
    const heroSlides = Array.from(hero.querySelectorAll<HTMLElement>(".swiper-slide"));
    const gallery = root.querySelector<HTMLElement>("#gallery")!;
    const gallerySlides = Array.from(gallery.querySelectorAll<HTMLElement>(".swiper-slide"));
    const menuButton = root.querySelector<HTMLButtonElement>(".btn-gnb")!;
    const menu = root.querySelector<HTMLElement>(".gnb-wrap")!;
    const content = root.querySelector<HTMLElement>("#content")!;
    const quick = root.querySelector<HTMLElement>(".quick-wrap")!;
    const quickToggle = quick.querySelector<HTMLButtonElement>(".reference-quick-toggle")!;
    const heroStatus = root.querySelector<HTMLElement>(".reference-carousel-status")!;
    const galleryStatus = root.querySelector<HTMLElement>(".reference-gallery-status")!;
    let heroIndex = 0;
    let galleryIndex = 0;
    let menuOpen = false;
    let quickOpen = false;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let motionReduced = motionPreference.matches;
    let automatic = !motionReduced;
    let hovering = false;
    let heroVisible = true;
    let scrollFrame = 0;
    const panelAnimations = new Map<HTMLElement, Animation>();

    function updateSlides(slides: HTMLElement[], active: number) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("reference-slide-active", i === active);
        slide.setAttribute("aria-hidden", String(i !== active));
        slide.inert = i !== active;
      });
    }
    function moveHero(direction: number) {
      automatic = false;
      heroIndex = (heroIndex + direction + heroSlides.length) % heroSlides.length;
      updateSlides(heroSlides, heroIndex);
      heroStatus.textContent = `${heroIndex + 1}번째 주요 안내, ${heroSlides[heroIndex].querySelector(".title")!.textContent}`;
    }
    function setMenu(open: boolean, restoreFocus = false) {
      menuOpen = open;
      document.documentElement.classList.toggle("reference-menu-open", open);
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      document.body.style.overflow = open ? "hidden" : "";
      const mobile = window.innerWidth <= 1279;
      menu.inert = mobile && !open;
      menu.setAttribute("aria-hidden", String(mobile && !open));
      content.inert = open; quick.inert = open;
      root!.querySelector<HTMLElement>("#footer")!.inert = open;
      if (open) menu.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
      else if (restoreFocus) menuButton.focus({ preventScroll: true });
    }
    function resize() {
      hero.style.height = `${Math.max(700, window.innerWidth > 1279 ? window.innerHeight - header.offsetHeight : window.innerHeight)}px`;
      if (window.innerWidth > 1279 && menuOpen) setMenu(false);
      menu.inert = window.innerWidth <= 1279 && !menuOpen;
      menu.setAttribute("aria-hidden", String(menu.inert));
      if (window.innerWidth > 1279 && quickOpen) setQuick(false);
    }
    function setQuick(open: boolean, focus = false) {
      quickOpen = open; quick.classList.toggle("reference-quick-open", open);
      quickToggle.setAttribute("aria-expanded", String(open));
      quickToggle.setAttribute("aria-label", open ? "빠른 메뉴 닫기" : "빠른 메뉴 열기");
      if (focus) quickToggle.focus({ preventScroll: true });
    }
    function scroll() {
      const top = root!.querySelector<HTMLElement>(".top-content")!.offsetHeight;
      header.classList.toggle("active", window.scrollY > top);
      const offset = window.innerWidth > 1279 ? 66 : header.offsetHeight;
      const positions = Array.from(root!.querySelectorAll<HTMLAnchorElement>("#gnb a")).map(link => {
        const target = root!.querySelector<HTMLElement>(link.hash);
        const position = target ? target.getBoundingClientRect() : null;
        const active = !!position && position.top <= offset + 1 && position.bottom > offset + 1;
        return { link, active };
      });
      positions.forEach(({ link, active }) => {
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
      });
    }
    function scheduleScroll() {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(() => { scrollFrame = 0; scroll(); });
    }
    function selectTab(link: HTMLAnchorElement, animate = true) {
      const menu = link.closest<HTMLElement>(".cmn-tabmenu")!;
      const links = Array.from(menu.querySelectorAll<HTMLAnchorElement>(":scope > .item > a"));
      const index = links.indexOf(link);
      const panels = menu.nextElementSibling?.querySelectorAll<HTMLElement>(":scope > .cont");
      links.forEach((item, i) => { item.classList.toggle("selected", i === index); item.setAttribute("aria-selected", String(i === index)); item.tabIndex = i === index ? 0 : -1; });
      panels?.forEach((panel, i) => {
        panelAnimations.get(panel)?.cancel(); panelAnimations.delete(panel);
        panel.classList.toggle("active", i === index); panel.setAttribute("aria-hidden", String(i !== index)); panel.inert = i !== index;
        if (i === index && animate && !motionReduced) {
          const animation = panel.animate([{ opacity: 0.45 }, { opacity: 1 }], { duration: 180, easing: "cubic-bezier(.23,1,.32,1)" });
          panelAnimations.set(panel, animation);
        }
      });
    }
    root.querySelectorAll<HTMLElement>(".cmn-tabmenu").forEach((menu, group) => {
      menu.setAttribute("role", "tablist");
      menu.setAttribute("aria-label", group === 0 ? "건강검진 종류" : group === 1 ? "종합검진 프로그램" : "내시경 검사 종류");
      const links = Array.from(menu.querySelectorAll<HTMLAnchorElement>(":scope > .item > a"));
      const panels = menu.nextElementSibling?.querySelectorAll<HTMLElement>(":scope > .cont");
      links.forEach((link, i) => {
        link.setAttribute("role", "tab"); link.id = `reference-tab-${group}-${i}`;
        link.setAttribute("aria-controls", `reference-panel-${group}-${i}`);
        const active = panels?.[i]?.classList.contains("active") ?? i === 0;
        link.parentElement?.setAttribute("role", "presentation");
        link.classList.toggle("selected", active); link.setAttribute("aria-selected", String(active)); link.tabIndex = active ? 0 : -1;
        if (panels?.[i]) { panels[i].id = `reference-panel-${group}-${i}`; panels[i].setAttribute("role", "tabpanel"); panels[i].setAttribute("aria-labelledby", link.id); panels[i].setAttribute("aria-hidden", String(!active)); panels[i].tabIndex = 0; panels[i].inert = !active; }
      });
    });
    root.querySelectorAll<HTMLElement>("#section11 .img-btn li").forEach((item, i) => item.setAttribute("aria-pressed", String(i === 0)));
    function updateGallery(announce = false) {
      updateSlides(gallerySlides, galleryIndex);
      root!.querySelectorAll<HTMLElement>("#section11 .img-btn li").forEach((item, i) => item.setAttribute("aria-pressed", String(i === galleryIndex)));
      if (announce) galleryStatus.textContent = `${galleryIndex + 1} / ${gallerySlides.length}, ${gallerySlides[galleryIndex].querySelector("img")?.alt}`;
    }
    function handleClick(event: MouseEvent) {
      const target = event.target as Element;
      if (target.closest("[data-kakao-pending]")) {
        event.preventDefault();
        if (quickOpen) setQuick(false, true);
        setDialog("kakao");
        return;
      }
      if (target.closest(".reference-quick-toggle")) { setQuick(!quickOpen); return; }
      if (quickOpen && !target.closest(".quick-wrap")) setQuick(false);
      if (quickOpen && target.closest(".quick-wrap a")) setQuick(false, true);
      if (target.closest(".btn-gnb")) { setMenu(!menuOpen, menuOpen); return; }
      if (target.closest(".fixo-dimmed")) { setMenu(false, true); return; }
      const tab = target.closest<HTMLAnchorElement>(".cmn-tabmenu a");
      if (tab) { event.preventDefault(); selectTab(tab, event.detail !== 0); return; }
      const arrow = target.closest<HTMLElement>(".arrow");
      if (arrow) {
        const direction = arrow.classList.contains("arrow-prev") ? -1 : 1;
        if (hero.contains(arrow)) moveHero(direction);
        else { galleryIndex = (galleryIndex + direction + gallerySlides.length) % gallerySlides.length; updateGallery(true); }
        return;
      }
      const thumb = target.closest<HTMLElement>("#section11 .img-btn li");
      if (thumb) { galleryIndex = Array.from(thumb.parentElement!.children).indexOf(thumb); updateGallery(true); return; }
      const link = target.closest<HTMLAnchorElement>("a");
      if (!link) return;
      const hash = link.getAttribute("href");
      if (link.classList.contains("btn-nopay")) { event.preventDefault(); setDialog("fees"); return; }
      if (hash === "#contact" || hash === "#none" || hash === "#;") { event.preventDefault(); setMenu(false); setDialog("contact"); return; }
      if (hash?.startsWith("#")) {
        const destination = root!.querySelector<HTMLElement>(hash);
        if (destination) {
          event.preventDefault(); setMenu(false);
          const offset = window.innerWidth > 1279 ? 65 : header.offsetHeight;
          const top = hash === "#wrap" ? 0 : destination.getBoundingClientRect().top + window.scrollY - offset;
          window.history.replaceState(null, "", hash);
          window.scrollTo({ top: Math.max(0, top), behavior: motionReduced ? "instant" : "smooth" });
          if (event.detail === 0 && hash !== "#wrap") { destination.tabIndex = -1; destination.focus({ preventScroll: true }); }
        }
      }
    }
    function handleKey(event: KeyboardEvent) {
      root!.dataset.keyboard = "true";
      if (event.key === "Escape" && quickOpen) { setQuick(false, true); return; }
      if (event.key === "Escape" && menuOpen) { setMenu(false); menuButton.focus(); return; }
      const target = event.target as HTMLElement;
      if (menuOpen && event.key === "Tab") {
        const controls = [menuButton, ...menu.querySelectorAll<HTMLAnchorElement>("a")];
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && (target === first || !controls.includes(target as HTMLButtonElement))) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && target === last) { event.preventDefault(); first.focus(); }
      }
      if (target.matches(".cmn-tabmenu a") && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        event.preventDefault(); const links = Array.from(target.closest(".cmn-tabmenu")!.querySelectorAll<HTMLAnchorElement>(":scope > .item > a"));
        const current = links.indexOf(target as HTMLAnchorElement);
        const index = event.key === "Home" ? 0 : event.key === "End" ? links.length - 1 : (current + (event.key === "ArrowRight" ? 1 : links.length - 1)) % links.length;
        selectTab(links[index], false); links[index].focus({ preventScroll: true });
      } else if ((event.key === "Enter" || event.key === " ") && target.matches('.arrow, .img-btn li')) { event.preventDefault(); target.click(); }
    }
    function handlePointer() { root!.dataset.keyboard = "false"; }
    function pauseOnFocus() { automatic = false; }
    function pointerEnter() { hovering = true; }
    function pointerLeave() { hovering = false; }
    function changeMotion() { motionReduced = motionPreference.matches; if (motionReduced) automatic = false; }
    const observer = new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; });
    observer.observe(hero);
    updateSlides(heroSlides, 0); updateGallery(); resize(); scroll();
    root.addEventListener("click", handleClick); root.addEventListener("keydown", handleKey);
    root.addEventListener("pointerdown", handlePointer);
    hero.addEventListener("focusin", pauseOnFocus); hero.addEventListener("pointerenter", pointerEnter); hero.addEventListener("pointerleave", pointerLeave);
    motionPreference.addEventListener("change", changeMotion);
    window.addEventListener("resize", resize); window.addEventListener("scroll", scheduleScroll, { passive: true });
    const timer = window.setInterval(() => {
      if (automatic && !menuOpen && !hovering && heroVisible && !document.hidden && !document.querySelector("dialog[open]")) {
        heroIndex = (heroIndex + 1) % heroSlides.length; updateSlides(heroSlides, heroIndex);
      }
    }, 6000);
    return () => {
      window.clearInterval(timer); window.cancelAnimationFrame(scrollFrame); observer.disconnect(); panelAnimations.forEach(animation => animation.cancel());
      root.removeEventListener("click", handleClick); root.removeEventListener("keydown", handleKey); root.removeEventListener("pointerdown", handlePointer);
      hero.removeEventListener("focusin", pauseOnFocus); hero.removeEventListener("pointerenter", pointerEnter); hero.removeEventListener("pointerleave", pointerLeave);
      motionPreference.removeEventListener("change", changeMotion);
      window.removeEventListener("resize", resize); window.removeEventListener("scroll", scheduleScroll);
      document.documentElement.classList.remove("reference-menu-open"); document.body.style.overflow = "";
    };
  }, [markup]);

  useEffect(() => {
    const preview = rootRef.current?.querySelector<HTMLElement>(".equipment-video-preview");
    const video = preview?.querySelector<HTMLVideoElement>("video");
    const trigger = preview?.querySelector<HTMLButtonElement>(".equipment-video-open");
    const player = equipmentDialogRef.current;
    const slot = equipmentVideoSlotRef.current;
    if (!preview || !video || !trigger || !player || !slot) return;

    // Keep one player so playback position, captions and native controls survive expansion.
    const placeholder = document.createComment("equipment video position");
    let previousOverflow = "";
    let expanded = false;
    function restoreVideo(focusTrigger: boolean) {
      if (!expanded) return;
      video!.pause();
      // A markup refresh may already have replaced the original preview.
      if (placeholder.isConnected) placeholder.replaceWith(video!);
      else video!.remove();
      expanded = false;
      document.body.style.overflow = previousOverflow;
      if (focusTrigger && trigger!.isConnected) trigger!.focus({ preventScroll: true });
    }
    function openVideo() {
      if (player!.open || !window.matchMedia("(max-width: 768px)").matches) return;
      previousOverflow = document.body.style.overflow;
      expanded = true;
      video!.before(placeholder);
      slot!.replaceChildren(video!);
      player!.showModal();
      document.body.style.overflow = "hidden";
      // Run within the tap gesture; if playback is denied, native controls remain available.
      void video!.play().catch(() => {});
    }
    function closeVideo() { restoreVideo(true); }
    trigger.addEventListener("click", openVideo);
    player.addEventListener("close", closeVideo);
    preview.classList.add("equipment-video-ready");
    return () => {
      trigger.removeEventListener("click", openVideo);
      player.removeEventListener("close", closeVideo);
      if (player.open) player.close();
      restoreVideo(false);
      preview.classList.remove("equipment-video-ready");
    };
  }, [markup]);

  useEffect(() => {
    if (dialog) { returnFocus.current = document.activeElement as HTMLElement; dialogRef.current?.showModal(); document.body.style.overflow = "hidden"; }
    else { dialogRef.current?.close(); document.body.style.overflow = ""; returnFocus.current?.focus(); }
    return () => { document.body.style.overflow = ""; };
  }, [dialog]);

  return <>
    <a className="reference-skip" href="#content" onClick={event => {
      event.preventDefault();
      rootRef.current?.querySelector<HTMLElement>("#content")?.focus();
    }}>본문 바로가기</a>
    <div ref={rootRef} dangerouslySetInnerHTML={html} />
    <dialog className="equipment-video-dialog" ref={equipmentDialogRef}
      aria-labelledby="equipment-video-dialog-title" onClick={event => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}>
      <div className="equipment-video-dialog-header">
        <h2 id="equipment-video-dialog-title">서울바른내과 장비 소개</h2>
        <button type="button" aria-label="영상 닫기" onClick={() => equipmentDialogRef.current?.close()}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </div>
      <div className="equipment-video-dialog-slot" ref={equipmentVideoSlotRef} />
    </dialog>
    <dialog className="reference-dialog clinic-visit-dialog" ref={dialogRef}
      aria-labelledby="reference-dialog-title" aria-describedby="reference-dialog-description"
      onCancel={() => setDialog(null)} onClick={event => {
        if (event.target === event.currentTarget) setDialog(null);
      }}>
      <button className="reference-dialog-close" onClick={() => setDialog(null)} aria-label="닫기">×</button>
      <p>SEOUL BARUN INTERNAL MEDICINE</p>
      <h2 id="reference-dialog-title">{dialog === "kakao" ? "카톡 상담 안내" : dialog === "fees" ? "비급여 항목 안내" : "상담 및 방문 안내"}</h2>
      <div id="reference-dialog-description">
        {dialog === "kakao"
          ? "카카오톡 상담 채널은 추후 연결됩니다."
          : dialog === "fees"
          ? "비급여 항목과 비용은 추후 추가됩니다."
          : "대표전화는 추후 추가됩니다. 서울특별시 동대문구 고산자로 435, 3층(제기동)에 있습니다."}
      </div>
      <button className="reference-dialog-confirm" onClick={() => setDialog(null)}>확인</button>
    </dialog>
  </>;
}
