<template>
  <section id="apartments">
    <h1 class="mb-4">Apartments</h1>

    <v-banner color="error" dark class="text-center" v-if="error">
      {{ error }}
    </v-banner>
    <DataTable
      :action-visible="true"
      :headers="headers"
      :loading="loading"
      :rows="apartments"
      action-libelle="Create Apartment"
      @actionClicked="goToApartmentCreation"
      @goToDetail="goToDetail"
      @refresh="getApartments"
    ></DataTable>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { API } from "@/api/api";
import { Apartment } from "@/api/models";
import DataTable from "@/components/DataTable.vue";

interface LocalApartment {
  id: string;
  name: string;
  number: string;
  nbRooms: number;
}

export default Vue.extend({
  name: "Apartments",
  components: { DataTable },
  data: () => ({
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
          this.apartments = (apartments as Apartment[]).map(apartment => {
            return {
              id: apartment.id,
              name: apartment.name,
              number: apartment.number,
              nbRooms: apartment.rooms.length
            };
          });
        })
        .catch(error => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    goToDetail(apartment: Apartment) {
      this.$router.push({
        name: "ApartmentDetail",
        params: {
          id: `${apartment.id}`,
          name: apartment.name,
          number: apartment.number
        }
      });
    },
    goToApartmentCreation() {
      this.$router.push({
        name: "ApartmentCreation"
      });
    }
  }
});
</script>
