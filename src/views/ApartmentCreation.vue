<template>
  <section id="create-apartment">
    <v-btn class="mb-4" color="primary" exact text to="/apartments">
      <v-icon left>mdi-arrow-left</v-icon>
      Apartments
    </v-btn>

    <h1 class="mb-4">Create Apartment</h1>

    <v-banner v-if="error" class="text-center" color="error" dark>
      {{ error }}
    </v-banner>
    <v-banner v-if="success" class="text-center" color="success">
      {{ success }}
    </v-banner>
    <v-card outlined>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="number"
            :readonly="loading"
            :rules="numberRules"
            label="Number *"
            required
          ></v-text-field>

          <v-text-field
            v-model="name"
            :readonly="loading"
            :rules="nameRules"
            label="Name *"
            required
          ></v-text-field>

          <v-subheader>
            Rooms
            <v-spacer></v-spacer>
            <AddRoomModal v-if="!loading" @newRoom="onNewRoom"></AddRoomModal>
          </v-subheader>

          <v-card v-if="rooms.length > 0">
            <v-slide-y-transition class="v-list mb-4" group>
              <v-list-item v-for="(room, i) in rooms" :key="i">
                <v-list-item-avatar>
                  <v-icon color="primary">
                    mdi-bed
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    Number {{ room.number }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    Area: {{ room.area }}m², Price: {{ room.price }}€
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn
                    :disabled="loading"
                    icon
                    title="Delete the room"
                    @click="deleteRoom(i)"
                  >
                    <v-icon>mdi-trash-can</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-slide-y-transition>

            <v-card-actions>
              {{ rooms.length }} rooms, total area {{ totalArea }}m², total
              price {{ totalPrice }}€.
            </v-card-actions>
          </v-card>

          <v-slide-y-transition>
            <div
              v-if="showAtLeastOneRoomRule"
              class="mt-4 subtitle-1 error--text no-room-warn"
              role="alert"
            >
              You need to add at least one room to create the apartment.
            </div>
          </v-slide-y-transition>

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
import { VForm } from "@/types";
import AddRoomModal from "@/components/AddRoomModal.vue";
import { isNil } from "lodash";
import { ApartmentRoom } from "@/api/models";
import { API } from "@/api/api";

export default Vue.extend({
  name: "ApartmentCreation",
  components: { AddRoomModal },
  data: () => ({
    valid: true,
    number: "",
    name: "",
    rooms: [] as ApartmentRoom[],
    numberRules: [(v: string | null) => !!v || "Number is required"],
    nameRules: [(v: string | null) => !!v || "Name is required"],
    error: null,
    loading: false,
    success: null
  }),
  computed: {
    showAtLeastOneRoomRule() {
      return this.rooms.length === 0;
    },
    form(): VForm {
      return this.$refs.form as VForm;
    },
    totalArea() {
      return this.rooms
        .map(room => room.area)
        .reduce((previousValue, currentValue) => {
          return String(Number(previousValue) + Number(currentValue));
        }, "0");
    },
    totalPrice() {
      return this.rooms
        .map(room => room.price)
        .reduce((previousValue, currentValue) => {
          return String(Number(previousValue) + Number(currentValue));
        }, "0");
    },
    hasPendingChanges() {
      const hasNumberChanged = !isNil(this.number) && this.number !== "";
      const hasNameChanged = !isNil(this.name) && this.name !== "";
      const hasRoomsChanged = this.rooms.length > 0;

      return (
        !this.success && (hasNumberChanged || hasNameChanged || hasRoomsChanged)
      );
    }
  },
  methods: {
    validate() {
      if (!this.form.validate()) {
        return;
      }

      if (this.form.validate() && this.showAtLeastOneRoomRule) {
        // At least one room
        return;
      }

      const newApartment = {
        number: this.number,
        name: this.name,
        rooms: this.rooms
      };
      this.loading = true;
      API.post(`apartment`, newApartment)
        .then(res => res.data)
        .then(({ message }) => {
          this.success = message;

          // Delayed redirection
          setTimeout(() => {
            this.$router.push({ name: "Apartments" });
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
    onNewRoom(room: ApartmentRoom) {
      this.rooms.push(room);
    },
    deleteRoom(idRoom: number) {
      this.rooms.splice(idRoom, 1);
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
