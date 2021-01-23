<template>
  <section id="clients">
    <h1 class="mb-4">Clients</h1>

    <v-banner color="error" dark class="text-center" v-if="error">
      {{ error }}
    </v-banner>
    <DataTable
      :action-visible="true"
      :headers="headers"
      :loading="loading"
      :rows="clients"
      action-libelle="Create Client"
      @actionClicked="goToClientCreation"
      @goToDetail="goToDetail"
      @refresh="getClients"
    ></DataTable>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import DataTable from "@/components/DataTable.vue";
import { Client } from "@/api/models";
import { API } from "@/api/api";

interface LocalClient extends Client {
  nbBookings: number;
}

export default Vue.extend({
  name: "Clients",
  components: { DataTable },
  data: () => ({
    headers: [
      {
        text: "First Name",
        align: "start",
        value: "firstName"
      },
      {
        text: "Last Name",
        value: "lastName"
      },
      {
        text: "Phone",
        value: "phone"
      },
      {
        text: "Birthdate",
        value: "birthDate"
      },
      {
        text: "Bookings",
        value: "nbBookings"
      },
      { text: "Actions", value: "actions", sortable: false }
    ],
    clients: [] as LocalClient[],
    loading: false,
    error: null
  }),
  mounted() {
    this.getClients();
  },
  methods: {
    getClients() {
      this.loading = true;
      API.get(`client`)
        .then(res => res.data)
        .then(({ clients }) => {
          this.clients = (clients as Client[]).map(client => {
            return {
              ...client,
              nbBookings: client.bookings.length
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
    goToDetail(client: LocalClient) {
      this.$router.push({
        name: "ClientDetail",
        params: {
          id: `${client.id}`
        }
      });
    },
    goToClientCreation() {
      this.$router.push({
        name: "ClientCreation"
      });
    }
  }
});
</script>
