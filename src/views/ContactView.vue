<script setup>
import { ref } from 'vue'
import teamImg from '../assets/contact-team.png'

const form = ref({ name: '', email: '', subject: '', message: '' })
const sent = ref(false)

function submit() {
  if (!form.value.name || !form.value.email || !form.value.message) return
  sent.value = true
}

const info = [
  { icon: 'pin', title: 'Visit us', lines: ['123 Print Street', 'Creative District'] },
  { icon: 'phone', title: 'Call us', lines: ['+1 (555) 123-4567', 'Mon–Fri, 9am–6pm'] },
  { icon: 'mail', title: 'Email us', lines: ['hello@reprint.example', 'support@reprint.example'] },
]

function Icon({ type }) {
  void type
}
</script>

<template>
  <div class="contact fade-up container">
    <div class="head">
      <span class="section-label">Contact</span>
      <h1 class="page-title">Let's talk</h1>
      <p>Questions, custom orders or press — we'd love to hear from you.</p>
    </div>

    <div class="layout">
      <form class="panel form-panel" @submit.prevent="submit">
        <p v-if="sent" class="success" role="status">
          Thanks {{ form.name }}! Your message has been sent. We'll reply within 1–2 business days.
        </p>

        <div class="row-2">
          <label>
            <span>Name</span>
            <input v-model="form.name" class="input-field" placeholder="Your name" required />
          </label>
          <label>
            <span>Email</span>
            <input v-model="form.email" type="email" class="input-field" placeholder="you@example.com" required />
          </label>
        </div>

        <label>
          <span>Subject</span>
          <input v-model="form.subject" class="input-field" placeholder="What is this about?" />
        </label>

        <label>
          <span>Message</span>
          <textarea v-model="form.message" class="input-field message" rows="6" placeholder="Tell us more..." required></textarea>
        </label>

        <button type="submit" class="btn btn-primary submit">Send message</button>
      </form>

      <aside class="panel aside">
        <div class="map">
          <img :src="teamImg" alt="Our team and studio" />
        </div>
        <div class="aside-info">
          <p class="tagline">We're here to help with everything from order tracking to bulk printing.</p>
          <div class="quick">
            <span class="pick">Response time</span>
            <strong>Within 24 hours</strong>
          </div>
          <div class="quick">
            <span class="pick">Live chat</span>
            <strong>9am – 6pm</strong>
          </div>
        </div>
      </aside>
    </div>

    <div class="info-cards">
      <div class="info-card" v-for="i in info" :key="i.title">
        <div class="icon">
          <svg v-if="i.icon === 'pin'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
          <svg v-else-if="i.icon === 'phone'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
        </div>
        <h3>{{ i.title }}</h3>
        <p v-for="l in i.lines" :key="l">{{ l }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact {
  padding-top: 56px;
}

.head {
  text-align: center;
  max-width: 560px;
  margin: 0 auto 44px;
}

.head p {
  color: var(--grey);
  margin-top: 10px;
}

.layout {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 30px;
}

.panel {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 36px;
  box-shadow: var(--shadow);
}

.form-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

label > span {
  display: block;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}

.message {
  resize: vertical;
  min-height: 140px;
}

.submit {
  width: 100%;
  padding: 15px;
}

.success {
  background: rgba(85, 133, 100, 0.14);
  border: 1px solid var(--primary);
  color: var(--primary-dark);
  padding: 14px;
  border-radius: 10px;
  font-size: 14.5px;
}

.aside {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.map {
  flex: 1;
  min-height: 240px;
  border-radius: 14px;
  background: var(--bg);
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
}

.map img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.aside-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tagline {
  color: var(--grey);
  font-size: 15px;
}

.quick {
  background: var(--bg);
  border-radius: 10px;
  padding: 13px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.quick .pick {
  color: var(--grey);
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px;
  margin-top: 44px;
}

.info-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 30px 26px;
  text-align: center;
  box-shadow: var(--shadow);
}

.icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 16px;
  border-radius: 14px;
  background: var(--primary);
  color: #fff;
  display: grid;
  place-items: center;
}

.info-card h3 {
  font-size: 18px;
  margin-bottom: 6px;
}

.info-card p {
  color: var(--grey);
  font-size: 14.5px;
}

@media (max-width: 820px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .row-2 {
    grid-template-columns: 1fr;
  }

  .info-cards {
    grid-template-columns: 1fr;
  }
}
</style>
