<template>
  <section id="apartment-detail">
    <v-btn class="mb-4" to="/apartments" exact text color="primary">
      <v-icon left>mdi-arrow-left</v-icon>
      Apartments
    </v-btn>

    <h1 class="mb-4">Apartment {{ apartmentName }}</h1>

    <v-banner color="error" dark class="text-center" v-if="error">
      {{ error }}
    </v-banner>
    <v-card outlined v-if="apartmentRooms">
      <v-card-title>
        Details
      </v-card-title>

      <v-card-text>
        <div>
          <span class="font-weight-bold">Name: </span> {{ apartmentName }}
        </div>
        <div>
          <span class="font-weight-bold">Number:</span> {{ apartmentNumber }}
        </div>
      </v-card-text>

      <v-card-text>
        <v-card>
          <v-card-title>Rooms</v-card-title>
          <v-slide-y-transition class="v-list mb-4" group>
            <template v-for="(room, i) in apartmentRooms">
              <v-list-item :key="'item' + i">
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
              </v-list-item>
              <v-divider :key="'divide' + i"></v-divider>
            </template>
          </v-slide-y-transition>
          <v-card-actions>
            {{ apartmentRooms.length }} room(s), total area {{ totalArea }}m²,
            total price {{ totalPrice }}€.
          </v-card-actions>
        </v-card>
      </v-card-text>
    </v-card>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { ApartmentRoom } from "@/api/models";
import { API } from "@/api/api";

export default Vue.extend({
  name: "ApartmentDetail",
  data: () => ({
    apartmentRooms: [] as ApartmentRoom[],
    error: null
  }),
  computed: {
    apartmentId() {
      return this.$route.params.id;
    },
    apartmentName() {
      return this.$route.params.name;
    },
    apartmentNumber() {
      return this.$route.params.number;
    },
    totalArea() {
      return this.apartmentRooms
        .map(room => room.area)
        .reduce((previousValue, currentValue) => {
          return String(Number(previousValue) + Number(currentValue));
        }, "0");
    },
    totalPrice() {
      return this.apartmentRooms
        .map(room => room.price)
        .reduce((previousValue, currentValue) => {
          return String(Number(previousValue) + Number(currentValue));
        }, "0");
    }
  },
  mounted() {
    console.log("ROUTE PARAMS", this.$route);
    this.getApartmentDetails();
  },
  watch: {
    $route(to, from) {
      if (to.params.id !== from.params.id) {
        this.getApartmentDetails();
      }
    }
  },
  methods: {
    getApartmentDetails() {
      if (!this.apartmentId) {
        return;
      }

      API.get(`apartment/${this.apartmentId}`)
        .then(res => res.data)
        .then(({ test }) => {
          this.apartmentRooms = test as ApartmentRoom[];
        })
        .catch(error => {
          this.error = error;
        });
    }
  }
});
</script>
