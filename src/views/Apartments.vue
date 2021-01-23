<template>
  <section id="apartments">
    <h1>Apartments</h1>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { API } from "@/api/api";
import { Apartment } from "@/api/models";

interface LocalApartment {
  id: string;
  name: string;
  number: string;
  nbRooms: number;
  area: string;
}

export default Vue.extend({
  name: "Apartments",
  data: () => ({
    search: "",
    headers: [
      {
        text: "Number",
        align: "start",
        value: "number"
      },
      {
        text: "Name",
        value: "name"
      },
      {
        text: "Rooms",
        value: "nbRooms"
      },
      {
        text: "Area",
        value: "area"
      },
      { text: "Actions", value: "actions", sortable: false }
    ],
    apartments: [] as LocalApartment[],
    loading: false,
    error: null
  }),
  mounted() {
    this.getApartments();
  },
  methods: {
    getApartments() {
      this.loading = true;
      API.get(`apartment`)
        .then(res => res.data)
        .then(({ apartments }) => {
          console.log("Apartments", apartments);
          this.apartments = (apartments as Apartment[]).map(apartment => {
            return {
              id: apartment.id,
              name: apartment.name,
              number: apartment.number,
              nbRooms: apartment.rooms.length,
              area: apartment.rooms
                .map(room => room.area)
                .reduce(
                  (prevRoomArea, currentRoomArea) =>
                    prevRoomArea + currentRoomArea
                )
            };
          });
        })
        .catch(error => {
          console.error(error);
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
});
</script>
