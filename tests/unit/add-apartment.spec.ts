import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import ApartmentCreation from "@/views/ApartmentCreation.vue";

describe("ApartmentCreation.vue", () => {
  it("warns user if no room added to the apartment", () => {
    const wrapper = shallowMount(ApartmentCreation);

    wrapper.setData({ rooms: [] });

    const localVm = wrapper.vm as any;
    expect(localVm.showAtLeastOneRoomRule).to.equal(true);
    expect(wrapper.find(".no-room-warn").exists()).to.equal(true);
  });

  it("display no error if apartment has at least one room", () => {
    const wrapper = shallowMount(ApartmentCreation);

    wrapper.setData({ rooms: [{ number: "10", price: "10", area: "10" }] });

    const localVm = wrapper.vm as any;
    expect(localVm.showAtLeastOneRoomRule).to.equal(false);
  });
});
