/**
 * Show control
 * @param control 
 */
export function show(control: GraphicsElement): void {
  control.style.display = "inline";
}

/**
 * Show many controls
 * @param controls 
 */
export function showMany(controls: GraphicsElement[]): void {
  const max = controls.length - 1;
  for (let i = max; i >= 0; i--) {
    controls[i].style.display = "inline";
  }
}

/**
 * Hide control
 * @param control 
 */
export function hide(control: GraphicsElement): void {
  control.style.display = "none";
}

/**
 * Hide many controls
 * @param controls 
 */
export function hideMany(controls: GraphicsElement[]): void {
  const max = controls.length - 1;
  for (let i = max; i >= 0; i--) {
    controls[i].style.display = "none";
  }
}

// Set visibility
export function setVisibility(control: GraphicsElement, visible: boolean): void {
  control.style.display = visible
    ? "inline"
    : "none";
}

// highlight a control vith animation
export function highlight(control: GraphicsElement): void {
  control.animate("highlight");
}

// update color only when requested
export function fill(control: GraphicsElement, color: string): void {
  // if (control.style.fill === color) return;
  // console.warn(`${color} ${control.style.fill}`);
  control.style.fill = color;
}