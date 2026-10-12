"use client";

import { useEffect, useRef } from "react";
import { copy } from '../../data/content';
import { useScrollState } from '../../architecture/scrollContext';
import { usePreferences } from '../../architecture/preferences';
import { prepareIntroMedia } from './introMedia';
import styles from "./ScrollIntro.module.css";

// Source: 210 frames at 30 fps. Keep the final seek inside the media duration.
const FPS = 30;

export default function ScrollIntro() {
  const { reducedMotion } = usePreferences();
  const { state } = useScrollState();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || reducedMotion) return;

    void prepareIntroMedia().then(url => {
      if (!disposed) { video.src = url; video.load(); }
    }).catch(() => { if (!disposed) video.dispatchEvent(new Event('error')); });
    let frame = 0;
    let duration = 0;
    let target = 0;
    let displayed = -1;
    let lastTick = 0;
    let disposed = false;
    let scrollDirty = true;

    // Only one seek may be in flight. New scroll events replace the target,
    // avoiding a queue of stale seeks when the user scrolls quickly.
    const tick = (now: number) => {
      frame = 0;
      if (disposed || !duration || video.readyState < 2) return;
      // Coalesce wheel/trackpad bursts into one layout read per animation frame.
      if (scrollDirty) {
        const rect = section.getBoundingClientRect();
        const travel = Math.max(1, section.offsetHeight - 36);
        target = Math.min(1, Math.max(0, -rect.top / travel)) * duration;
        scrollDirty = false;
      }
      if (video.seeking) return; // seeked schedules the next update.

      const elapsed = now - lastTick;
      const dt = !lastTick || elapsed > 150 ? 16.7 : Math.min(elapsed, 64);
      lastTick = now;
      if (displayed < 0) displayed = video.currentTime;
      const difference = target - displayed;
      // Large gestures catch up faster without abruptly jumping to the target.
      // Always follow the latest target, including immediate direction reversals.
      const smoothingMs = 60 - 32 * Math.min(1, Math.abs(difference) / 1.5);
      const next = displayed + difference * (1 - Math.exp(-dt / smoothingMs));
      const snapped = Math.abs(target - next) < 1 / FPS ? target : next;
      const time = Math.round(snapped * FPS) / FPS;
      if (Math.abs(time - video.currentTime) >= 0.5 / FPS) {
        // Keep sub-frame progress so small movements never stall on rounding.
        displayed = snapped;
        video.currentTime = Math.min(time, duration);
      } else {
        displayed = snapped;
      }
      if (Math.abs(target - displayed) >= 0.5 / FPS && !video.seeking) schedule();
    };

    const schedule = () => {
      if (!frame && !disposed) frame = requestAnimationFrame(tick);
    };

    const update = () => {
      scrollDirty = true;
      schedule();
    };

    const ready = () => {
      if (!Number.isFinite(video.duration)) return;
      duration = Math.max(0, video.duration - 1 / FPS);
      update();
    };
    const seeked = () => { schedule(); };
    video.addEventListener("loadeddata", ready);
    video.addEventListener("canplay", ready);
    video.addEventListener("seeked", seeked);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer = new ResizeObserver(update);
    observer.observe(section);
    if (video.readyState >= 2) ready();
    update();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      video.removeEventListener("loadeddata", ready);
      video.removeEventListener("canplay", ready);
      video.removeEventListener("seeked", seeked);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, [reducedMotion]);

  return (
    <section id="S00" ref={sectionRef} className={styles.intro} aria-labelledby="S00-title">
      <h1 id="S00-title" className={styles.accessibleTitle}>{copy("THE HUNT")}</h1>
      <div className={styles.stage} style={{ visibility: state.active.id === 'S00' ? 'visible' : 'hidden' }}>
        <video ref={videoRef} className={styles.video} poster="/media/intro-poster.webp" preload="auto" muted playsInline disablePictureInPicture data-intro-video aria-hidden="true">
        </video>
      </div>
    </section>
  );
}
