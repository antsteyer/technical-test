<template>
  <v-app>
    <v-app-bar app clipped-left color="primary" dark>
      <v-img
        alt="Chez nestor Logo"
        contain
        max-height="50"
        max-width="200"
        src="https://www.chez-nestor.com/_nuxt/img/186473d.png"
        transition="scale-transition"
      />
    </v-app-bar>

    <v-navigation-drawer app clipped permanent width="200">
      <v-list dense nav>
        <v-list-item-group v-model="currentRoute" color="primary">
          <v-list-item
            v-for="(route, i) in routes"
            :key="i"
            :to="route.routeUrl"
          >
            <v-list-item-icon>
              <v-icon v-text="route.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="route.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="pa-4" fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

interface LinkItem {
  text: string;
  routeUrl: string;
  icon: string;
}

export default Vue.extend({
  name: "App",

  data: () => ({
    currentRoute: 0,
    routes: [
      {
        text: "Apartments",
        routeUrl: "/apartments",
        icon: "mdi-home-modern"
      },
      {
        text: "Rooms",
        routeUrl: "/rooms",
        icon: "mdi-bed"
      },
      {
        text: "Clients",
        routeUrl: "/clients",
        icon: "mdi-account-tie"
      },
      {
        text: "Bookings",
        routeUrl: "/bookings",
        icon: "mdi-book"
      }
    ] as LinkItem[]
  })
});
</script>
