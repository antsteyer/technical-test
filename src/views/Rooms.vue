<template>
  <section id="rooms">
    <h1 class="mb-4">Rooms</h1>

    <v-banner v-if="error" class="text-center" color="error" dark>
      An Error occured while loading the list
    </v-banner>
    <DataTable
      :action-visible="true"
      :headers="headers"
      :loading="loading"
      :rows="rooms"
      action-libelle="Create Room"
      group-by="apartment.name"
      sort-by="number"
      item-key="id"
      :show-group-by="true"
      @actionClicked="goToRoomCreation"
      @refresh="getRooms"
    ></DataTable>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import DataTable from "@/components/DataTable.vue";
import { Room } from "@/api/models";
import { API } from "@/api/api";

export default Vue.extend({
  name: "Rooms",
  components: { DataTable },
  data: () => ({
    headers: [
      {
        text: "Number",
        align: "start",
        value: "number"
      },
      {
        text: "Area",
        value: "area"
      },
      {
        text: "Price",
        value: "price"
      },
      {
        text: "Apartment",
        value: "apartment.name"
      }
    ],
    rooms: [] as Room[],
    loading: false,
    error: null
  }),
  mounted() {
    this.getRooms();
  },
  methods: {
    getRooms() {
      this.loading = true;
      API.get(`room`)
        .then(res => res.data)
        .then(({ rooms }) => {
          this.rooms = rooms;
        })
        .catch(error => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    goToRoomCreation() {
      this.$router.push({
        name: "RoomCreation"
      });
    }
  }
});
</script>
