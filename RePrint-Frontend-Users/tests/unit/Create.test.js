import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Create from "../../src/views/Create.vue";

describe("Create view", () => {
  it("renders the design studio form", () => {
    const wrapper = mount(Create);
    expect(wrapper.text()).toContain("Create your own product");
    expect(wrapper.find("select").exists()).toBe(true);
  });

  it("shows 11 product types in the select", () => {
    const wrapper = mount(Create);
    expect(wrapper.findAll("option").length).toBe(11);
  });

  it("renders 20 colour swatches", () => {
    const wrapper = mount(Create);
    expect(wrapper.findAll(".swatch")).toHaveLength(20);
  });

  it("increments quantity via the stepper", async () => {
    const wrapper = mount(Create);
    const plus = wrapper.findAll(".stepper button")[1];
    await plus.trigger("click");
    expect(wrapper.find(".stepper span").text()).toBe("2");
  });

  it("keeps quantity at a minimum of 1", async () => {
    const wrapper = mount(Create);
    const minus = wrapper.findAll(".stepper button")[0];
    await minus.trigger("click");
    await minus.trigger("click");
    expect(wrapper.find(".stepper span").text()).toBe("1");
  });

  it("selects a size option", async () => {
    const wrapper = mount(Create);
    const buttons = wrapper.findAll(".opt");
    await buttons[1].trigger("click");
    expect(wrapper.find(".opt.active").text()).toBe("Medium");
  });

  it("shows the success state after submitting", async () => {
    const wrapper = mount(Create);
    await wrapper.find(".create-btn").trigger("click");
    expect(wrapper.find(".success").exists()).toBe(true);
    expect(wrapper.text()).toContain("Processing your design");
  });
});
