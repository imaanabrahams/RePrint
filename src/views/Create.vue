<script setup>
import { ref, computed } from 'vue'
import fallbackImg from '../assets/create-design.png'
import p2 from '../assets/p2.png'
import p3 from '../assets/p3.png'
import p4 from '../assets/p4.png'
import p6 from '../assets/p6.png'
import p7 from '../assets/p7.png'
import fidget from '../assets/fidget.png'
import keyring from '../assets/keyring.png'
import best2 from '../assets/best2.png'
import best3 from '../assets/best3.png'
import p8 from '../assets/p8.png'

const form = ref({
  productType: 'Phone Stand',
  title: '',
  size: 'Small',
})

const imageMap = {
  'Phone Stand': p8,
  'Home Decor': p2,
  'Planter': p6,
  'Desk Organiser': p4,
  'Cable Organiser': p3,
  'Gaming Accessory': best3,
  'Fidget Toy': fidget,
  'Keyring': keyring,
  'Jewellery Holder': best2,
  'Toy Sweet Dispenser': p7,
  'Custom Part': fallbackImg,
}

const previewImg = computed(() => imageMap[form.value.productType] || fallbackImg)

const productTypes = [
  'Phone Stand',
  'Home Decor',
  'Planter',
  'Desk Organiser',
  'Cable Organiser',
  'Gaming Accessory',
  'Fidget Toy',
  'Keyring',
  'Jewellery Holder',
  'Toy Sweet Dispenser',
  'Custom Part',
]
const sizes = ['Small', 'Medium', 'Large']
const swatches = [
  '#000000',
  '#FFFFFF',
  '#F5F0E6',
  '#B5B5BC',
  '#FFD9E8',
  '#FFCFD2',
  '#FDE2E4',
  '#E8C1D0',
  '#FFD7BA',
  '#FFE8CF',
  '#FFF4C2',
  '#FBF8CC',
  '#E4F1D1',
  '#CDEAC0',
  '#B5E8D5',
  '#CCEBF5',
  '#D6E4FF',
  '#E3D9FF',
  '#F0D7FF',
  '#C9DBD1',
]

const color = ref(swatches[0])
const quantity = ref(1)
const submitted = ref(false)

const previewLabel = ref(
  {
    'Phone Stand': 'Your design',
    'Home Decor': 'Your decor',
    'Planter': 'Your planter',
    'Desk Organiser': 'Your organiser',
    'Cable Organiser': 'Your organiser',
    'Gaming Accessory': 'Your accessory',
    'Fidget Toy': 'Your fidget',
    'Keyring': 'Your keyring',
    'Jewellery Holder': 'Your holder',
    'Toy Sweet Dispenser': 'Your sweet dispenser',
    'Custom Part': 'Your part',
  }[form.value.productType]
)

function submit() {
  submitted.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="create fade-up container">
    <div class="head">
      <span class="section-label">Design Studio</span>
      <h1 class="page-title">Create your own product</h1>
      <p>Personalise any product with your photos, colours and text.</p>
    </div>

    <div v-if="submitted" class="success" role="status">
      <div class="check">✓</div>
      <h2>Processing your design</h2>
      <p>Your custom product has been added to the queue. We'll confirm once it's ready to print.</p>
      <button class="btn btn-primary" @click="submitted = false">Create another</button>
    </div>

    <div v-else class="editor">
      <div class="panel form-panel">
        <div class="field">
          <label>Product type</label>
          <select v-model="form.productType" class="input-field">
            <option v-for="t in productTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>

        <div class="field">
          <label>Title / caption</label>
          <input v-model="form.title" class="input-field" placeholder="e.g. Minimal phone stand" />
        </div>

        <div class="field">
          <label>Colour</label>
          <div class="swatches">
            <button
              v-for="c in swatches"
              :key="c"
              class="swatch"
              :style="{ background: c }"
              :class="{ active: color === c }"
              @click="color = c"
              :aria-label="`Select colour ${c}`"
            ></button>
          </div>
        </div>

        <div class="field">
          <label>Size</label>
          <div class="options">
            <button
              v-for="s in sizes"
              :key="s"
              class="opt"
              :class="{ active: form.size === s }"
              @click="form.size = s"
            >
              {{ s }}
            </button>
          </div>
        </div>

        <div class="field">
          <label>Quantity</label>
          <div class="stepper">
            <button @click="quantity = Math.max(1, quantity - 1)">−</button>
            <span>{{ quantity }}</span>
            <button @click="quantity++">+</button>
          </div>
        </div>

        <button class="btn btn-primary create-btn" @click="submit">Create product</button>
      </div>

      <div class="panel preview-panel">
        <div class="preview-label">{{ previewLabel }}</div>
        <div class="preview">
          <img :src="previewImg" alt="Product preview" class="preview-img" />
        </div>
        <div class="meta-row">
          <span>{{ form.productType }}</span>
          <span>{{ form.size }}</span>
          <span>Qty: {{ quantity }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create {
  padding-top: 56px;
}

.head {
  text-align: center;
  max-width: 620px;
  margin: 0 auto 44px;
}

.head p {
  color: var(--grey);
  margin-top: 10px;
}

.editor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 36px;
}

.panel {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 34px;
  box-shadow: var(--shadow);
}

.form-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.field label {
  display: block;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 10px;
  color: var(--dark);
}

.swatches {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.swatch {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 3px solid transparent;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.swatch:hover {
  transform: scale(1.1);
}

.swatch.active {
  border-color: var(--dark);
  transform: scale(1.1);
}

.options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.opt {
  padding: 11px 22px;
  border-radius: 10px;
  background: var(--bg);
  font-weight: 600;
  border: 2px solid transparent;
  transition: all 0.15s ease;
}

.opt:hover {
  border-color: var(--accent);
}

.opt.active {
  background: var(--primary);
  color: #fff;
}

.stepper {
  display: inline-flex;
  align-items: center;
  background: var(--bg);
  border-radius: 10px;
  overflow: hidden;
}

.stepper button {
  width: 44px;
  height: 44px;
  font-size: 20px;
  color: var(--primary);
}

.stepper span {
  width: 48px;
  text-align: center;
  font-weight: 700;
}

.create-btn {
  width: 100%;
  padding: 15px;
}

.preview-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-label {
  color: var(--grey);
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
}

.preview {
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  display: grid;
  place-items: center;
  padding: 26px;
  position: relative;
  overflow: hidden;
  background: var(--bg);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  color: var(--grey);
  font-size: 13.5px;
  font-weight: 600;
}

.success {
  text-align: center;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 60px 40px;
  max-width: 560px;
  margin: 0 auto;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.check {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  font-size: 34px;
  display: grid;
  place-items: center;
  margin-bottom: 8px;
}

.success p {
  color: var(--grey);
  margin-bottom: 10px;
}

@media (max-width: 820px) {
  .editor {
    grid-template-columns: 1fr;
  }
}
</style>
