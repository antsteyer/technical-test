<template>
  <v-card outlined>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        :disabled="loading"
        append-icon="mdi-magnify"
        clearable
        dense
        hide-details
        label="Search"
        single-line
      ></v-text-field>
      <v-btn
        :loading="loading"
        class="ml-2"
        icon
        title="Refresh"
        @click.stop="refreshData"
      >
        <v-icon>mdi-cached</v-icon>
      </v-btn>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="rows"
      :loading="loading"
      :search="search"
      :item-key="itemKey"
      :sort-by="sortBy"
      :group-by="groupBy"
      :show-group-by="showGroupBy"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn
          icon
          text
          class="mr-2"
          small
          color="primary"
          @click="goToDetail(item)"
          title="go to detail"
        >
          <v-icon small>
            mdi-magnify
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-card-actions>
      <v-btn
        v-if="actionVisible"
        color="primary"
        @click="actionClicked"
        v-text="actionLibelle"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "DataTable",
  props: {
    rows: {
      type: Array as () => any[],
      required: true
    },
    headers: {
      type: Array as () => any[]
    },
    loading: {
      type: Boolean,
      default: false
    },
    groupBy: {
      type: String
    },
    showGroupBy: {
      type: Boolean,
      default: false
    },
    sortBy: {
      type: String
    },
    itemKey: {
      type: String
    },

    // Action button under datatable
    actionVisible: {
      type: Boolean,
      default: false
    },
    actionLibelle: {
      type: String
    }
  },
  data: () => ({
    search: null
  }),
  methods: {
    refreshData() {
      this.$emit("refresh");
    },
    goToDetail(item: any) {
      this.$emit("goToDetail", item);
    },
    actionClicked() {
      this.$emit("actionClicked");
    }
  }
});
</script>
