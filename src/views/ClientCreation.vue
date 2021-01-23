<template>
  <section id="client-creation">
    <v-btn class="mb-4" color="primary" exact text to="/clients">
      <v-icon left>mdi-arrow-left</v-icon>
      Clients
    </v-btn>

    <h1 class="mb-4">Create Client</h1>

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
            v-model="firstName"
            :readonly="loading"
            :rules="firstNameRules"
            label="First Name *"
            required
          ></v-text-field>

          <v-text-field
            v-model="lastName"
            :readonly="loading"
            :rules="lastNameRules"
            label="Last Name *"
            required
          ></v-text-field>

          <v-text-field
            v-model="email"
            :readonly="loading"
            :rules="emailRules"
            label="Email *"
            required
          ></v-text-field>

          <v-text-field
            v-model="phone"
            :readonly="loading"
            :rules="phoneRules"
            label="Phone *"
            required
          ></v-text-field>

          <v-text-field
            v-model="nationality"
            :readonly="loading"
            :rules="nationalityRules"
            label="Nationality *"
            required
          ></v-text-field>

          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="birthDate"
                label="Birthday *"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              ref="picker"
              v-model="birthDate"
              :max="new Date().toISOString().substr(0, 10)"
              min="1950-01-01"
              @change="saveMenu"
            ></v-date-picker>
          </v-menu>

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
import { isNil } from "lodash";
import { API } from "@/api/api";

export default Vue.extend({
  name: "ClientCreation",
  data: () => ({
    menu: false,
    valid: true,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    birthDate: null as string | null,
    firstNameRules: [(v: string | null) => !!v || "First Name is required"],
    lastNameRules: [(v: string | null) => !!v || "Last Name is required"],
    emailRules: [
      (v: string | null) => !!v || "Email is required",
      (v: string | null) =>
        (v && /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(v)) ||
        "Email format must be : xxx@xx.xx (ex: dupond@dupont.fr)"
    ],
    phoneRules: [
      (v: string | null) => !!v || "Phone is required",
      (v: string | null) =>
        (v &&
          /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(v)) ||
        "Phone format is incorrect"
    ],
    nationalityRules: [(v: string | null) => !!v || "Nationality is required"],
    birthDateRules: [(v: string | null) => !!v || "Birthdate is required"],
    showAtLeastOneRoomRule: false,
    error: null,
    loading: false,
    success: null as string | null
  }),
  watch: {
    menu(val) {
      val &&
        setTimeout(() => ((this.$refs.picker as any).activePicker = "YEAR"));
    }
  },
  computed: {
    form(): VForm {
      return this.$refs.form as VForm;
    },
    hasPendingChanges() {
      const hasFirstNameChanged = this.firstName !== "";
      const hasLastNameChanged = this.lastName !== "";
      const hasEmailChanged = this.email !== "";
      const hasPhoneChanged = this.phone !== "";
      const hasNationalityChanged = this.nationality !== "";
      const hasBirthdayChanged =
        !isNil(this.birthDate) && this.birthDate !== "";

      return (
        !this.success &&
        (hasFirstNameChanged ||
          hasLastNameChanged ||
          hasEmailChanged ||
          hasPhoneChanged ||
          hasNationalityChanged ||
          hasBirthdayChanged)
      );
    }
  },
  methods: {
    validate() {
      if (!this.form.validate()) {
        return;
      }

      const newClient = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        nationality: this.nationality,
        birthDate: this.birthDate
      };

      this.loading = true;
      API.post(`client`, newClient)
        .then(res => res.data)
        .then(() => {
          this.success = "Client created";

          setTimeout(() => {
            this.$router.push({ name: "Clients" });
          }, 1000);
        })
        .catch(error => (this.error = error))
        .finally(() => (this.loading = false));
    },
    reset() {
      this.form.reset();
      this.showAtLeastOneRoomRule = false;
    },
    saveMenu(date: any) {
      (this.$refs.menu as any).save(date);
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
