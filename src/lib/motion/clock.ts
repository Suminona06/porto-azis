/**
 * Live Jakarta (GMT +7 / WIB) monospace clock formatting and lifecycle helpers.
 */

const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000;

/**
 * Formats a Date instance in UTC+7 (Asia/Jakarta) as `hh:mm A (GMT +7)`.
 */
export function formatJakartaTime12h(date: Date = new Date()): string {
  const shifted = new Date(date.getTime() + JAKARTA_OFFSET_MS);
  const hours24 = shifted.getUTCHours();
  const minutes = shifted.getUTCMinutes();
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  const hh = String(hours12).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return `${hh}:${mm} ${period} (GMT +7)`;
}

/**
 * Immediately renders the live Jakarta clock into `target` and updates whenever the minute changes.
 * Returns a cleanup callback to stop the timer.
 */
export function startJakartaClock(
  target: HTMLElement,
  onTick?: (formatted: string) => void,
): () => void {
  let lastRendered = '';

  const render = () => {
    const formatted = formatJakartaTime12h(new Date());
    if (formatted !== lastRendered) {
      lastRendered = formatted;
      target.textContent = formatted;
      onTick?.(formatted);
    }
  };

  render();
  const intervalId = window.setInterval(render, 1000);

  return () => {
    window.clearInterval(intervalId);
  };
}
