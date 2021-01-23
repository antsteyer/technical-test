import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    redirect: "/apartments"
  },
  // Apartments
  {
    path: "/apartments",
    name: "Apartments",
    component: () => import("../views/Apartments.vue")
  },
  {
    path: "/apartments/creation",
    name: "ApartmentCreation",
    component: () => import("../views/ApartmentCreation.vue")
  },
  {
    path: "/apartments/:id",
    name: "ApartmentDetail",
    component: () => import("../views/ApartmentDetail.vue")
  },
  // Clients
  {
    path: "/clients",
    name: "Clients",
    component: () => import("../views/Clients.vue")
  },
  {
    path: "/clients/creation",
    name: "ClientCreation",
    component: () => import("../views/ClientCreation.vue")
  },
  {
    path: "/client/:id",
    name: "clientDetail",
    component: () => import("../views/ClientDetail.vue")
  },
  // Bookings
  {
    path: "/bookings",
    name: "Bookings",
    component: () => import("../views/Bookings.vue")
  },
  {
    path: "/bookings/creation",
    name: "BookingCreation",
    component: () => import("../views/BookingCreation.vue")
  },
  {
    path: "/bookings/:id",
    name: "BookingDetail",
    component: () => import("../views/BookingDetail.vue")
  },
  // Rooms
  {
    path: "/rooms",
    name: "Rooms",
    component: () => import("../views/Rooms.vue")
  },
  {
    path: "/rooms/creation",
    name: "RoomCreation",
    component: () => import("../views/RoomCreation.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
