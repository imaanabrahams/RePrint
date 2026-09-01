<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="grid">
        <div class="col brand-col">
          <div class="brand">
            <span class="logo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7c0-1.7 1.3-3 3-3h10c1.7 0 3 1.3 3 3v1H4V7z" fill="currentColor"/>
                <path d="M4 10h16v8c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3v-8z" fill="currentColor" opacity="0.85"/>
              </svg>
            </span>
            <span class="word">RePrint</span>
          </div>
          <p>
            Turn your photos and ideas into beautiful, high-quality printed products
            delivered right to your door.
          </p>
        </div>

        <div class="col">
          <h4>Shop</h4>
          <RouterLink to="/shop">All Products</RouterLink>
          <RouterLink to="/create">Create Your Own</RouterLink>
          <RouterLink to="/shop">Wall Art</RouterLink>
          <RouterLink to="/shop">Gifts</RouterLink>
        </div>

        <div class="col">
          <h4>Company</h4>
          <RouterLink to="/contact">Contact Us</RouterLink>
          <RouterLink to="/contact">About</RouterLink>
          <RouterLink to="/contact">FAQs</RouterLink>
          <RouterLink to="/login">My Account</RouterLink>
        </div>

        <div class="col">
          <h4>Staff</h4>
          <RouterLink to="/admin">HR &amp; Admin</RouterLink>
        </div>
 
        <div class="col">
          <h4>Get in touch</h4>
          <span>hello@reprint.com</span>
          <span>+27 987 3456</span>
          <div class="social">
            <a href="#" aria-label="Instagram">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="#" aria-label="Facebook">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h3l1-4h-4V8c0-1 1-2 2.5-2H17V3h-3c-2.8 0-5 2.2-5 5v2H6v4h3v8h4z"/></svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.9c-.7.3-1.5.5-2.3.6.8-.5 1.5-1.3 1.8-2.3-.8.5-1.6.8-2.5 1A4 4 0 0 0 12 8.6c0 .3 0 .6.1.9a11.4 11.4 0 0 1-8.3-4.2 4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.8-.5v.1a4 4 0 0 0 3.2 3.9 4 4 0 0 1-1.8 0 4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.6 11.3 11.3 0 0 0 8.1 20c7.2 0 11.1-6 11.1-11.1v-.5c.8-.5 1.4-1.2 1.8-2z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div class="bottom">
        <span>© {{ year }} RePrint. All rights reserved.</span>
        <span class="made">Printed with <span class="heart">♥</span></span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--bg-card);
  margin-top: 40px;
  padding: 56px 0 0;
}

.grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
  gap: 40px;
  padding-bottom: 44px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.logo {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: var(--primary);
  color: #fff;
  display: grid;
  place-items: center;
}

.word {
  font-size: 22px;
  font-weight: 800;
}

.brand-col p {
  color: var(--grey);
  font-size: 14.5px;
  max-width: 280px;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.col h4 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 6px;
  color: var(--primary);
}

.col a,
.col span {
  color: var(--grey);
  font-size: 14.5px;
}

.col a:hover {
  color: var(--primary);
}

.social {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}

.social a {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: rgba(85, 133, 100, 0.14);
  color: var(--primary);
  display: grid;
  place-items: center;
  transition: background 0.15s ease, color 0.15s ease;
}

.social a:hover {
  background: var(--primary);
  color: #fff;
}

.bottom {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  border-top: 1px solid rgba(85, 133, 100, 0.18);
  padding: 20px 0;
  color: var(--grey);
  font-size: 13.5px;
}

.heart {
  color: var(--star);
}

@media (max-width: 860px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 520px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
