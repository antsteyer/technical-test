<template>
  <section id="bookings">
    <h1 class="mb-4">Bookings</h1>

    <v-banner color="error" dark class="text-center" v-if="error">
      An Error occured while loading the list
    </v-banner>
    <DataTable
      :action-visible="true"
      :headers="headers"
      :loading="loading"
      :rows="bookings"
      action-libelle="Add Booking"
      @actionClicked="goToBookingCreation"
      @goToDetail="goToDetail"
      @refresh="getBookings"
    ></DataTable>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { API } from "@/api/api";
import { Booking } from "@/api/models";
import DataTable from "@/components/DataTable.vue";

interface LocalBooking extends Booking {
  clientFullName: string;
}

export default Vue.extend({
  name: "Bookings",
  components: { DataTable },
  data: () => ({
    headers: [
      {
        text: "Creation Date",
        align: "start",
        value: "createdAt"
      },
      {
        text: "Last Update",
        value: "updatedAt"
      },
      {
        text: "Client",
        value: "clientFullName"
      },
      {
        text: "Room",
        value: "room.number"
      },
      { text: "Actions", value: "actions", sortable: false }
    ],
    bookings: [] as LocalBooking[],
    loading: false,
    error: null
  }),
  mounted() {
    this.getBookings();
  },
  methods: {
    getBookings() {
      this.loading = true;
      API.get(`booking`)
        .then(res => res.data)
        .then(({ bookings }) => {
          this.bookings = (bookings as Booking[]).map(booking => {
            return {
              ...booking,
              createdAt: new Date(booking.createdAt).toLocaleDateString(),
              updatedAt: new Date(booking.updatedAt).toLocaleDateString(),
              clientFullName: booking.client
                ? `${booking.client.firstName} ${booking.client.lastName}`
                : ""
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
    goToDetail(booking: Booking) {
      this.$router.push({
        name: "BookingDetail",
        params: {
          id: `${booking.id}`
        }
      });
    },
    goToBookingCreation() {
      this.$router.push({
        name: "BookingCreation"
      });
    }
  }
});
</script>
