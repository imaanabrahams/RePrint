import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import RatingStars from "../../src/components/RatingstarsComp.vue";

describe("RatingStars", () => {
  it("renders five stars by default", () => {
    const wrapper = mount(RatingStars);
    expect(wrapper.findAll("svg")).toHaveLength(5);
  });

  it("sets the correct aria-label", () => {
    const wrapper = mount(RatingStars, { props: { rating: 4 } });
    expect(wrapper.attributes("aria-label")).toBe("4 out of 5 stars");
  });

  it("fills stars according to the rounded rating", () => {
    const wrapper = mount(RatingStars, { props: { rating: 3.4 } });
    const stars = wrapper.findAll("svg");
    const filled = stars.filter((s) => s.attributes("fill") === "#995E62");
    expect(filled).toHaveLength(3);
  });

  it("rounds a 4.6 rating up to 5 filled stars", () => {
    const wrapper = mount(RatingStars, { props: { rating: 4.6 } });
    const stars = wrapper.findAll("svg");
    const filled = stars.filter((s) => s.attributes("fill") === "#995E62");
    expect(filled).toHaveLength(5);
  });

  it("respects a custom size", () => {
    const wrapper = mount(RatingStars, { props: { size: 24 } });
    const star = wrapper.findAll("svg")[0];
    expect(star.attributes("width")).toBe("24");
  });

  it("leaves all stars unfilled for a zero rating", () => {
    const wrapper = mount(RatingStars, { props: { rating: 0 } });
    const filled = wrapper
      .findAll("svg")
      .filter((s) => s.attributes("fill") === "#995E62");
    expect(filled).toHaveLength(0);
  });
});
