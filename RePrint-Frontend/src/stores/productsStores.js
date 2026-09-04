import { defineStore } from "pinia";
import { api } from "../apiReprint";
import p1 from "../assets/p1.png";
import p2 from "../assets/p2.png";
import p3 from "../assets/p3.png";
import p4 from "../assets/p4.png";
import p5 from "../assets/p5.png";
import p6 from "../assets/p6.png";
import p7 from "../assets/p7.png";
import best1 from "../assets/best1.png";
import best2 from "../assets/best2.png";
import best3 from "../assets/best3.png";
import { markMockFallback } from '../apiStatus.js'

const localCatalog = [
  {
    id: 1,
    name: "Paper Towel Holder",
    category: "Home Decor",
    price: 549,
    rating: 4.8,
    reviews: 126,
    image: p1,
    description:
      "A modern, 3D-printed paper towel holder that looks great in any kitchen. Sturdy, easy to load and built to last.",
    options: ["Single", "Set of 2"],
  },
  {
    id: 2,
    name: "Sunglass Organiser",
    category: "Home Decor",
    price: 449,
    rating: 4.6,
    reviews: 203,
    image: p2,
    description:
      "A neat, 3D-printed organiser that keeps your sunglasses safe, scratch-free and easy to grab.",
    options: ["Small", "Medium", "Large"],
  },
  {
    id: 3,
    name: "Outlet Box",
    category: "Home Decor",
    price: 799,
    rating: 4.9,
    reviews: 88,
    image: p3,
    description:
      "A practical, 3D-printed outlet box that tidies cables and adds extra storage beside your power points. Neatly organised and easy to install.",
    options: ["Single", "Double"],
  },
  {
    id: 4,
    name: "Desk Accessories",
    category: "Office",
    price: 899,
    rating: 4.7,
    reviews: 152,
    image: p4,
    description:
      "Stylish, printed desk accessories that keep your workspace tidy. From pen pots to cable clips, built to be both practical and good-looking.",
    options: ["Starter", "Complete", "Deluxe"],
  },
  {
    id: 5,
    name: "Headphones & Watch Holder",
    category: "Home Decor",
    price: 349,
    rating: 4.5,
    reviews: 319,
    image: p5,
    description:
      "A compact, 3D-printed holder that stores your headphones and watch together in one tidy spot. Keeps them off the desk and always within reach.",
    options: ["Black", "White", "Green"],
  },
  {
    id: 6,
    name: "Eco-Friendly Plant Pot",
    category: "Garden",
    price: 299,
    rating: 4.4,
    reviews: 241,
    image: p6,
    description:
      "A sustainable, 3D-printed plant pot made from eco-friendly materials. Stylish, durable and perfect for your favourite plants.",
    options: ["Small", "Medium", "Large"],
  },
  {
    id: 7,
    name: "Animal Fidget & Keyring",
    category: "Toys",
    price: 179,
    rating: 4.8,
    reviews: 126,
    image: best1,
    featured: true,
    description:
      "A fun, 3D-printed animal fidget and keyring in one. Satisfying to play with and handy to clip onto your keys or bag.",
    options: ["Rabbit", "Cat", "Bear"],
  },
  {
    id: 8,
    name: "Jewellery Holder",
    category: "Home Decor",
    price: 449,
    rating: 4.6,
    reviews: 203,
    image: best2,
    featured: true,
    description:
      "A stylish, 3D-printed jewellery holder that keeps your rings, earrings and necklaces organised, tangle-free and easy to grab.",
    options: ["Small", "Medium", "Large"],
  },
  {
    id: 9,
    name: "Game Controller Stand",
    category: "Gaming",
    price: 549,
    rating: 4.9,
    reviews: 88,
    image: best3,
    featured: true,
    description:
      "A sturdy, 3D-printed stand that holds your game controller neatly when you are done playing. Keeps your setup tidy and your controller safe.",
    options: ["Single", "Double"],
  },
  {
    id: 10,
    name: "Sweet Dispenser",
    category: "Toys",
    price: 199,
    rating: 4.6,
    reviews: 98,
    image: p7,
    description:
      "A fun, 3D-printed sweet dispenser that makes it easy to hand out your favourite treats. Perfect for parties, kids and playful kitchens.",
    options: ["Small", "Large"],
  },
];

function parseOptions(raw) {
  if (Array.isArray(raw)) return raw;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.base_price),
    rating: Number(row.rating) || 4.5,
    reviews: Number(row.reviews) || 0,
    image: row.image_url || "",
    description: row.description || "",
    options: parseOptions(row.options),
    featured: row.featured === 1 || row.featured === true,
    customizable: row.customizable === 1 || row.customizable === true,
    estimated_days: row.estimated_days,
  };
}

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: localCatalog,
    source: "local",
    loaded: false,
  }),
  getters: {
    byId: (state) => (id) => state.products.find((p) => p.id === Number(id)),
    featured: (state) => state.products.filter((p) => p.featured),
  },
  actions: {
    async load() {
      try {
        const rows = await api.get("/products");
        if (rows && rows.length > 0 && rows[0].image_url) {
          this.products = rows.map(toProduct);
          this.source = "api";
        } else {
          this.products = localCatalog;
          this.source = "local";
          markMockFallback('/products (no image_url on returned rows)');
        }
      } catch {
        this.products = localCatalog;
        this.source = "local";
        markMockFallback('/products');
      } finally {
        this.loaded = true;
      }
    },
  },
});
