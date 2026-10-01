const themeButton = document.querySelector<HTMLButtonElement>('.theme-toggle');
function updateThemeLabel() {
  themeButton?.setAttribute(
    'aria-label',
    document.documentElement.dataset.theme === 'light' ? '어두운 테마로 변경' : '밝은 테마로 변경',
  );
}
updateThemeLabel();
themeButton?.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch {
    /* Storage may be unavailable in private mode. */
  }
  updateThemeLabel();
});

const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const mobileNav = document.querySelector<HTMLElement>('#mobile-nav');
function closeMenu() {
  if (mobileNav) mobileNav.hidden = true;
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', '메뉴 열기');
}
menuButton?.addEventListener('click', () => {
  if (!mobileNav) return;
  mobileNav.hidden = !mobileNav.hidden;
  menuButton.setAttribute('aria-expanded', String(!mobileNav.hidden));
  menuButton.setAttribute('aria-label', mobileNav.hidden ? '메뉴 열기' : '메뉴 닫기');
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileNav && !mobileNav.hidden) {
    closeMenu();
    menuButton?.focus();
  }
});
mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
matchMedia('(min-width: 601px)').addEventListener('change', closeMenu);

const progress = document.querySelector<HTMLElement>('.reading-progress');
let scrollQueued = false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  scrollQueued = false;
}
window.addEventListener(
  'scroll',
  () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(updateProgress);
    }
  },
  { passive: true },
);
updateProgress();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll('.section-heading, .project-feature, .note-row, .about-teaser, .reveal')
    .forEach((el) => {
      el.classList.add('reveal-ready');
      observer.observe(el);
    });
}
const clock = document.querySelector('[data-clock]');
function updateClock() {
  if (clock)
    clock.textContent = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Seoul',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
}
updateClock();
setInterval(updateClock, 60000);

let toastTimeout: ReturnType<typeof setTimeout>;
export function toast(message: string) {
  const el = document.querySelector<HTMLElement>('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove('visible'), 3000);
}
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) =>
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy || window.location.href);
      toast('클립보드에 복사했습니다.');
    } catch {
      toast('복사하지 못했습니다. 주소창의 링크를 직접 복사해 주세요.');
    }
  }),
);
document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
