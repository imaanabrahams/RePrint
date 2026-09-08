<script setup>
import { useProductsStore } from "../stores/productsStores.js";
import ProductCard from "../components/ProductcardComp.vue";
import RatingStars from "../components/RatingstarsComp.vue";
import heroImg from "../assets/hero.png";

const products = useProductsStore();
const featured = products.featured;

const steps = [
  {
    n: "01",
    title: "Choose a product",
    text: "Pick from our prints, apparel, mugs and more.",
  },
  {
    n: "02",
    title: "Add your design",
    text: "Upload a photo or create something new in our editor.",
  },
  {
    n: "03",
    title: "We print & deliver",
    text: "Premium quality printed and shipped to your door.",
  },
];

const testimonials = [
  {
    name: "Amelia Chen",
    role: "Photo Book",
    initials: "AC",
    rating: 5,
    color: "#FFCFD2",
    quote:
      "The photo book I ordered was stunning. The colours are true to life and the quality is incredible.",
  },
  {
    name: "Marcus Reid",
    role: "Canvas Print",
    initials: "MR",
    rating: 5,
    color: "#558564",
    quote:
      "Fast delivery and the canvas looks amazing on my wall. I will definitely be ordering again.",
  },
  {
    name: "Priya Sharma",
    role: "Custom Mug",
    initials: "PS",
    rating: 4,
    color: "#995E62",
    quote:
      "Simple to design and it arrived sooner than expected. The print quality is excellent.",
  },
];
</script>

<template>
  <div class="home fade-up">
    <section class="hero container">
      <div class="hero-text">
        <span class="badge-pill">⭐ Custom Print Studio</span>
        <h1 class="hero-title">
          Bring your photos<br />to <span class="accent">life</span>.
        </h1>
        <p class="hero-sub">
          Create beautiful, personalised products from your favourite moments.
          Prints, apparel, gifts and more — made just for you.
        </p>
        <div class="hero-btns">
          <RouterLink to="/shop" class="btn btn-primary">Shop Now</RouterLink>
          <RouterLink to="/create" class="btn btn-accent"
            >Create Your Own</RouterLink
          >
        </div>
        <div class="hero-stats">
          <div class="stat">
            <strong>50k+</strong>
            <span>Orders placed</span>
          </div>
          <div class="stat">
            <strong>4.9</strong>
            <span>Average rating</span>
          </div>
        </div>
      </div>

      <div class="hero-art">
        <div class="hero-frame">
          <img
            :src="heroImg"
            alt="RePrint custom print showcase"
            class="hero-img"
          />
          <span class="tag tag-one">Pencil Holder</span>
          <span class="tag tag-two">Office Decor</span>
        </div>
      </div>
    </section>

    <section class="features container">
      <div
        class="feature"
        v-for="f in ['Premium quality', 'Fast delivery', 'Eco-friendly inks']"
        :key="f"
      >
        <span class="tick">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span>{{ f }}</span>
      </div>
    </section>

    <section class="products container">
      <div class="section-head">
        <div>
          <span class="section-label">Best Sellers</span>
          <h2 class="page-title">Our favourites</h2>
        </div>
        <RouterLink to="/shop" class="btn btn-accent">View all</RouterLink>
      </div>
      <div class="grid">
        <ProductCard
          v-for="p in featured"
          :key="p.id"
          :product="p"
          variant="light"
        />
      </div>
    </section>

    <section class="how container">
      <div class="how-head">
        <span class="section-label">How it works</span>
        <h2 class="page-title">Three easy steps</h2>
      </div>
      <div class="steps">
        <div class="step" v-for="s in steps" :key="s.n">
          <span class="num">{{ s.n }}</span>
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
        </div>
      </div>
    </section>

    <section class="cta container">
      <div class="cta-box">
        <div>
          <span class="section-label">Ready to create?</span>
          <h2 class="cta-title">Turn your ideas into something real</h2>
        </div>
        <RouterLink to="/create" class="btn btn-primary btn-lg"
          >Start creating</RouterLink
        >
      </div>
    </section>

    <section class="testimonials container">
      <div class="t-head">
        <span class="section-label">Testimonials</span>
        <h2 class="page-title">Loved by our customers</h2>
      </div>
      <div class="t-grid">
        <figure class="t-card" v-for="t in testimonials" :key="t.name">
          <div class="stars">
            <RatingStars :rating="t.rating" :size="16" />
          </div>
          <blockquote>{{ t.quote }}</blockquote>
          <figcaption>
            <span class="avatar" :style="{ background: t.color }">{{
              t.initials
            }}</span>
            <div>
              <strong>{{ t.name }}</strong>
              <span>{{ t.role }}</span>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  padding-bottom: 20px;
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  padding-top: 64px;
  padding-bottom: 40px;
}

.hero-title {
  font-size: clamp(38px, 6vw, 66px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -1.5px;
  margin: 16px 0 18px;
}

.accent {
  color: var(--primary);
}

.hero-sub {
  font-size: 17px;
  color: var(--grey);
  max-width: 460px;
  margin-bottom: 30px;
}

.hero-btns {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.hero-stats {
  display: flex;
  gap: 40px;
  margin-top: 40px;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat strong {
  font-size: 28px;
  font-weight: 800;
  color: var(--primary);
}

.stat span {
  color: var(--grey);
  font-size: 14px;
}

.hero-art {
  display: grid;
  place-items: center;
}

.hero-frame {
  position: relative;
  width: 100%;
  max-width: 480px;
  aspect-ratio: 1 / 1;
  border-radius: 32px;
  background: var(--bg-card);
  padding: 26px;
  box-shadow: var(--shadow);
  display: grid;
  place-items: center;
  transform: rotate(2deg);
}

.hero-frame .hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

.tag {
  position: absolute;
  background: var(--primary);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  padding: 10px 18px;
  border-radius: 40px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.tag-one {
  top: -14px;
  left: -10px;
  background: var(--accent);
  color: var(--dark);
}

.tag-two {
  bottom: -12px;
  right: -8px;
}

.features {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 20px 24px 10px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 9px;
  background: var(--bg-card);
  padding: 13px 20px;
  border-radius: 40px;
  font-weight: 600;
  font-size: 15px;
}

.tick {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  display: grid;
  place-items: center;
}

.products {
  padding-top: 70px;
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.section-head .page-title {
  margin-top: 6px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.how {
  padding-top: 90px;
}

.how-head {
  text-align: center;
  margin-bottom: 40px;
}

.how-head .page-title {
  margin-top: 8px;
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.step {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 34px 28px;
  box-shadow: var(--shadow);
}

.num {
  font-size: 40px;
  font-weight: 800;
  color: var(--accent);
  -webkit-text-stroke: 1px var(--primary);
}

.step h3 {
  font-size: 19px;
  margin: 10px 0 8px;
}

.step p {
  color: var(--grey);
  font-size: 15px;
}

.cta {
  padding-top: 90px;
}

.cta-box {
  background: var(--primary);
  border-radius: var(--radius-lg);
  padding: 52px 48px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  flex-wrap: wrap;
}

.cta-box .section-label {
  color: var(--accent);
}

.cta-title {
  font-size: clamp(24px, 3.5vw, 40px);
  font-weight: 800;
  max-width: 560px;
  margin-top: 8px;
}

.btn-lg {
  padding: 16px 32px;
  font-size: 16px;
}

.testimonials {
  padding-top: 90px;
}

.t-head {
  text-align: center;
  margin-bottom: 40px;
}

.t-head .page-title {
  margin-top: 8px;
}

.t-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.t-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 34px 30px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.t-card blockquote {
  color: var(--grey);
  font-size: 15.5px;
  line-height: 1.7;
  flex: 1;
}

.t-card figcaption {
  display: flex;
  align-items: center;
  gap: 12px;
  border-top: 1px solid rgba(85, 133, 100, 0.16);
  padding-top: 16px;
}

.avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  flex-shrink: 0;
}

.t-card figcaption div {
  display: flex;
  flex-direction: column;
}

.t-card figcaption strong {
  font-size: 15px;
}

.t-card figcaption span:not(.avatar) {
  color: var(--grey);
  font-size: 13px;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
    padding-top: 40px;
  }

  .hero-sub {
    margin-inline: auto;
  }

  .hero-btns,
  .hero-stats {
    justify-content: center;
  }

  .grid,
  .steps,
  .t-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .steps {
    grid-template-columns: 1fr;
  }
}
</style>
