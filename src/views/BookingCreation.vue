<template>
  <section id="booking-creation">
    <v-btn class="mb-4" color="primary" exact text to="/bookings">
      <v-icon left>mdi-arrow-left</v-icon>
      Bookings
    </v-btn>

    <h1 class="mb-4">Create Booking</h1>

    <v-banner v-if="error" class="text-center" color="error" dark>
      {{ error }}
    </v-banner>
    <v-banner v-if="success" class="text-center" color="success">
      {{ success }}
    </v-banner>
    <v-card outlined>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-autocomplete
            v-model="selectedClientId"
            item-value="id"
            item-text="clientFullName"
            :readonly="loading"
            :items="availableClients"
            label="Client *"
            required
          >
          </v-autocomplete>

          <v-autocomplete
            v-model="selectedRoomId"
            item-value="id"
            item-text="roomFullDesc"
            :readonly="loading"
            :items="availableRooms"
            label="Room *"
            required
          ></v-autocomplete>

          <div class="mt-6">
            <v-btn
              :disabled="!valid"
              :loading="loading"
              class=" mr-4"
              color="primary"
              @click="validate"
            >
              Create
            </v-btn>

            <v-btn :disabled="loading" text @click="reset">
              Reset Form
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Booking, Client, Room } from "@/api/models";
import { API } from "@/api/api";
import { VForm } from "@/types";

interface LocalClient extends Client {
  clientFullName: string;
}

interface LocalRoom extends Room {
  roomFullDesc: string;
}

export default Vue.extend({
  name: "BookingCreation",
  data: () => ({
    valid: true,
    bookings: [] as Booking[],
    clients: [] as LocalClient[],
    selectedClientId: null as number | null,
    rooms: [] as LocalRoom[],
    selectedRoomId: null as number | null,
    error: null,
    loading: false,
    success: null as string | null
  }),
  computed: {
    availableRooms(): LocalRoom[] {
      return this.rooms.filter(room => {
        // Exclude already booked rooms
        // Booking doesn't contain id of the room, we can only filter on number and apartment number
        return !this.bookings.find(
          booking =>
            booking.room.number === room.number &&
            booking.room.apartment.number === room.apartment.number
        );
      });
    },
    availableClients(): LocalClient[] {
      return this.clients.filter(client => {
        // Exclude clients with a booking
        // Booking doesn't contain id of the client, we can only filter on first and last names
        return !this.bookings.some(
          booking =>
            booking.client.firstName === client.firstName &&
            booking.client.lastName === client.lastName
        );
      });
    },
    form(): VForm {
      return this.$refs.form as VForm;
    },
    hasPendingChanges() {
      return (
        !this.success &&
        (this.selectedClientId !== null || this.selectedRoomId !== null)
      );
    }
  },
  mounted() {
    this.getBookings();
    this.getClients();
    this.getRooms();
  },
  methods: {
    validate() {
      if (!this.form.validate()) {
        return;
      }
      const newBooking = {
        clientId: this.selectedClientId,
        roomId: this.selectedRoomId
      };

      this.loading = true;
      API.post(`booking`, newBooking)
        .then(res => res.data)
        .then(({ message }) => {
          this.success = message;

          setTimeout(() => {
            this.$router.push({
              name: "Bookings"
            });
          }, 1000);
        })
        .catch(error => {
          this.error = error;
        })
        .finally(() => (this.loading = false));
    },
    reset() {
      this.form.reset();
    },
    getBookings() {
      API.get(`booking`)
        .then(res => res.data)
        .then(({ bookings }) => {
          this.bookings = bookings;
        });
    },
    getClients() {
      API.get(`client`)
        .then(res => res.data)
        .then(({ clients }) => {
          this.clients = (clients as Client[])
            .filter(
              client => client.firstName !== null && client.lastName !== null
            )
            .map(client => {
              return {
                ...client,
                clientFullName: `${client.firstName} ${client.lastName}`
              };
            });
        });
    },
    getRooms() {
      API.get(`room`)
        .then(res => res.data)
        .then(({ rooms }) => {
          this.rooms = (rooms as Room[]).map(room => {
            return {
              ...room,
              roomFullDesc: `Number: ${room.number}, Apartment: ${room.apartment.number} (${room.apartment.name})`
            };
          });
        });
    }
  },
  // If pending changes, we don't want the user to leave the route without warning
  beforeRouteLeave(to, from, next) {
    if (!this.hasPendingChanges) {
      next();
      return;
    }

    const answer = window.confirm(
      "Do you really want to leave? you have unsaved changes!"
    );
    if (answer) {
      next();
    } else {
      next(false);
    }
  }
});
</script>
