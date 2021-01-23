<template>
  <v-dialog v-model="showDialog" persistent max-width="400px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on">
        <v-icon left>mdi-plus</v-icon>
        Add room
      </v-btn>
    </template>
    <v-form v-model="valid" ref="form">
      <v-card>
        <v-card-title>
          <span class="headline">Room</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="Number *"
            v-model="number"
            :rules="numberRules"
            required
          ></v-text-field>

          <v-text-field
            label="Area *"
            v-model="area"
            :rules="areaRules"
            suffix="m²"
            type="number"
            required
          ></v-text-field>

          <v-text-field
            label="Price *"
            type="number"
            v-model="price"
            :rules="priceRules"
            suffix="€"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn :disabled="!valid" color="primary" @click="onSave">
            Save
          </v-btn>
          <v-btn color="error" text @click="onCancel">
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { VForm } from "@/types";

export default Vue.extend({
  name: "AddRoomModal",
  data: () => ({
    showDialog: false,
    valid: true,
    number: "",
    area: "",
    price: "",
    numberRules: [(v: string | null) => !!v || "Number is required"],
    areaRules: [(v: string | null) => !!v || "Area is required"],
    priceRules: [
      (v: string | null) => !!v || "Price is required",
      (v: string | null) =>
        (v && Number(v) > 0) || "Price cannot be lower or equal to 0",
      (v: string | null) =>
        (v && /^\d+(.\d{1,2})?$/.test(v)) ||
        "Price format must be : x.xx (ex: 10.50)"
    ]
  }),
  computed: {
    form(): VForm {
      return this.$refs.form as VForm;
    }
  },
  methods: {
    onSave() {
      if (!this.form.validate()) {
        return;
      }

      const newRoom = {
        number: this.number,
        area: this.area,
        price: this.price
      };
      this.$emit("newRoom", newRoom);
      this.form.reset();
      this.showDialog = false;
    },
    onCancel() {
      this.form.reset();
      this.showDialog = false;
    }
  }
});
</script>

<style scoped></style>
