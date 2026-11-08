export function triggerFlyToCartAnimation(startElement: HTMLElement, cartButtonId: string = 'cart-button-icon') {
  const cartIcon = document.getElementById(cartButtonId);
  if (!cartIcon || !startElement) return;

  const startRect = startElement.getBoundingClientRect();
  const endRect = cartIcon.getBoundingClientRect();

  // Create flying clone element
  const flying = document.createElement('div');
  flying.innerHTML = `
    <div style="
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.8);
      font-size: 20px;
    ">
      🛍️
    </div>
  `;
  flying.style.position = 'fixed';
  flying.style.left = `${startRect.left + startRect.width / 2 - 22}px`;
  flying.style.top = `${startRect.top + startRect.height / 2 - 22}px`;
  flying.style.zIndex = '9999';
  flying.style.pointerEvents = 'none';
  flying.style.transition = 'all 0.65s cubic-bezier(0.2, 0.9, 0.3, 1)';
  document.body.appendChild(flying);

  // Trigger animation next tick
  requestAnimationFrame(() => {
    flying.style.left = `${endRect.left + endRect.width / 2 - 22}px`;
    flying.style.top = `${endRect.top + endRect.height / 2 - 22}px`;
    flying.style.transform = 'scale(0.3) rotate(360deg)';
    flying.style.opacity = '0.2';
  });

  // Remove and bounce cart icon
  setTimeout(() => {
    if (flying.parentNode) {
      document.body.removeChild(flying);
    }
    cartIcon.classList.add('scale-125');
    setTimeout(() => cartIcon.classList.remove('scale-125'), 200);
  }, 680);
}

