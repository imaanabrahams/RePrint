import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Contact from "../../src/views/Contact.vue";

describe("Contact view", () => {
  it("renders the contact form and info", () => {
    const wrapper = mount(Contact);
    expect(wrapper.text()).toContain("Let's talk");
    expect(wrapper.findAll("input").length).toBeGreaterThanOrEqual(2);
    expect(wrapper.find("textarea").exists()).toBe(true);
  });

  it("does not submit when required fields are missing", async () => {
    const wrapper = mount(Contact);
    await wrapper.find("form").trigger("submit");
    expect(wrapper.find(".success").exists()).toBe(false);
  });

  it("shows a success message after a valid submit", async () => {
    const wrapper = mount(Contact);
    const inputs = wrapper.findAll("input");
    await inputs[0].setValue("Jane");
    await inputs[1].setValue("jane@x.com");
    await wrapper.find("textarea").setValue("Hello there");
    await wrapper.find("form").trigger("submit");
    expect(wrapper.find(".success").exists()).toBe(true);
    expect(wrapper.text()).toContain("Thanks Jane!");
  });

  it("renders the three info cards", () => {
    const wrapper = mount(Contact);
    const cards = wrapper.findAll(".info-card");
    expect(cards.length).toBe(3);
    expect(wrapper.text()).toContain("Visit us");
    expect(wrapper.text()).toContain("Email us");
  });
});
