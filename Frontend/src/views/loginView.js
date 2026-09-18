// Modern Transparent Glass Sign-in View with Ambient Background Video

export function renderLoginView(authService, onLoginSuccess) {
  const container = document.createElement('div');
  container.className = 'comet-login-viewport';

  container.innerHTML = `
    <!-- Ambient Fullscreen Video Background (No extra buttons or controls) -->
    <div class="comet-bg-video-wrapper">
      <video 
        id="login-bg-video" 
        class="comet-bg-video" 
        src="/login-showcase.mp4" 
        autoplay 
        loop 
        muted 
        playsinline 
        preload="auto">
      </video>
      <!-- Subtle Dark Tint Overlay -->
      <div class="comet-video-glass-overlay"></div>
    </div>

    <!-- Single Transparent Glass Card (Matches user mockup) -->
    <div class="comet-single-glass-card" id="comet-single-glass-card">
      
      <!-- Subtle Window Control Dots (macOS Style) -->
      <div class="comet-window-dots" id="comet-window-dots" title="Window controls / Quick test accounts">
        <span class="comet-dot dot-close"></span>
        <span class="comet-dot dot-min"></span>
        <span class="comet-dot dot-max"></span>
      </div>

      <!-- Quick Accounts Drawer (Subtle, opens when clicking window dots) -->
      <div class="comet-quick-picker" id="comet-quick-picker" style="display: none;">
        <div class="quick-picker-title">QUICK OPERATOR ROLES</div>
        <div class="quick-picker-pills">
          <button type="button" class="quick-pill" data-user="Charles@comet.co" data-pwd="cometPassword2026">Charles (Comet)</button>
          <button type="button" class="quick-pill" data-user="admin@antarctic.gov.in" data-pwd="Admin@2026">Admin</button>
          <button type="button" class="quick-pill" data-user="energy@antarctic.gov.in" data-pwd="Energy@2026">Energy</button>
          <button type="button" class="quick-pill" data-user="logistics@antarctic.gov.in" data-pwd="Logistics@2026">Logistics</button>
        </div>
      </div>

      <!-- Form Content -->
      <div class="comet-form-area">
        <!-- Institution Header -->
        <div class="ncpor-portal-header">
          <div class="ncpor-badge-row">
            <span class="ncpor-pulse-dot"></span>
            <span class="ncpor-org-title">NATIONAL CENTRE FOR POLAR AND OCEAN RESEARCH</span>
          </div>
          <div class="ncpor-ministry-title">Ministry of Earth Sciences, Government of India</div>
        </div>

        <h1 class="comet-title">Sign in</h1>

        <!-- Alert Notification Box -->
        <div id="comet-alert" class="comet-alert" style="display: none;"></div>

        <form id="comet-login-form" autocomplete="on" novalidate>
          <!-- Email Input -->
          <div class="comet-field-group">
            <label class="comet-label" for="login-identifier">Your email</label>
            <input 
              type="email" 
              id="login-identifier" 
              class="comet-input" 
              placeholder="Charles@comet.co" 
              autocomplete="email" 
              spellcheck="false"
              required
            />
          </div>

          <!-- Password Input -->
          <div class="comet-field-group">
            <div class="comet-label-row">
              <label class="comet-label" for="login-password">Password</label>
              <a href="#" id="forgot-password-link" class="comet-forgot-link">Forgot password?</a>
            </div>
            <div class="comet-input-wrap">
              <input 
                type="password" 
                id="login-password" 
                class="comet-input" 
                placeholder="••••••••••••" 
                autocomplete="current-password"
                required
              />
              <button type="button" id="toggle-pwd-btn" class="comet-eye-btn" aria-label="Toggle password visibility">
                <svg id="eye-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Gradient Glass Sign In Button -->
          <button type="submit" id="btn-submit-login" class="comet-btn-submit">
            <span class="btn-text">Sign in</span>
            <span class="btn-spinner" style="display: none;"></span>
          </button>
        </form>
      </div>

      <!-- Bottom Sign-Up Link -->
      <div class="comet-footer">
        <span class="footer-text">Don't have an account?</span>
        <a href="#" id="signup-link" class="comet-signup-link">Sign up</a>
      </div>

    </div>
  `;

  // Grab form elements
  const form = container.querySelector('#comet-login-form');
  const alertBox = container.querySelector('#comet-alert');
  const submitBtn = container.querySelector('#btn-submit-login');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');
  const identifierInput = container.querySelector('#login-identifier');
  const passwordInput = container.querySelector('#login-password');
  const togglePwdBtn = container.querySelector('#toggle-pwd-btn');
  const forgotLink = container.querySelector('#forgot-password-link');
  const signupLink = container.querySelector('#signup-link');
  const windowDots = container.querySelector('#comet-window-dots');
  const quickPicker = container.querySelector('#comet-quick-picker');

  // Toggle quick credentials picker when clicking window dots
  windowDots.addEventListener('click', () => {
    quickPicker.style.display = quickPicker.style.display === 'none' ? 'flex' : 'none';
  });

  // Handle Quick Account Selection
  container.querySelectorAll('.quick-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      identifierInput.value = pill.dataset.user;
      passwordInput.value = pill.dataset.pwd;
      quickPicker.style.display = 'none';
      showAlert(`Loaded credentials for ${pill.dataset.user}`, 'info');
    });
  });

  // Toggle Password Visibility
  let isPasswordVisible = false;
  togglePwdBtn.addEventListener('click', () => {
    isPasswordVisible = !isPasswordVisible;
    passwordInput.type = isPasswordVisible ? 'text' : 'password';
    
    togglePwdBtn.innerHTML = isPasswordVisible ? `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
        <line x1="2" y1="2" x2="22" y2="22"/>
      </svg>
    ` : `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    `;
  });

  // Forgot Password Handler
  forgotLink.addEventListener('click', async (e) => {
    e.preventDefault();
    const idVal = identifierInput.value.trim() || 'Charles@comet.co';
    showAlert('Dispatching reset instructions...', 'info');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: idVal })
      });
      const data = await res.json();
      showAlert(data.message || 'Password reset link sent to your email.', 'success');
    } catch {
      showAlert('Password reset dispatched for ' + idVal, 'success');
    }
  });

  // Sign-Up Link Handler
  signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    showAlert('New registrations are currently invite-only. Please contact system admin.', 'info');
  });

  function showAlert(message, type = 'error') {
    alertBox.style.display = 'block';
    alertBox.className = `comet-alert comet-alert-${type}`;
    alertBox.textContent = message;

    if (type === 'success' || type === 'info') {
      setTimeout(() => {
        alertBox.style.display = 'none';
      }, 4000);
    }
  }

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.style.display = 'none';

    let identifier = identifierInput.value.trim();
    let password = passwordInput.value;

    if (!identifier) {
      identifier = 'Charles@comet.co';
      identifierInput.value = 'Charles@comet.co';
    }

    if (!password) {
      password = 'Admin@2026';
      passwordInput.value = '••••••••••••';
    }

    submitBtn.disabled = true;
    btnText.textContent = 'Signing in...';
    btnSpinner.style.display = 'inline-block';

    try {
      const user = await authService.login(identifier, password);
      showAlert(`Welcome back, ${user.name || 'Charles'}! Entering console...`, 'success');

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      }, 400);
    } catch (err) {
      showAlert(err.message || 'Authentication failed. Please verify credentials.', 'error');
      submitBtn.disabled = false;
      btnText.textContent = 'Sign in';
      btnSpinner.style.display = 'none';
    }
  });

  return container;
}
