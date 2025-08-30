<template>
  <v-card class="elevated-card">
    <!-- Header -->
    <div class="d-flex align-center px-4 py-3 header-bar">
      <div class="text-h6 font-weight-medium" v-if="title">{{ title }}</div>

      <div class="d-flex align-center ml-4">
        <slot name="filters" />
      </div>

      <v-spacer />

      <!-- Export Dropdown -->
      <v-menu offset-y>
        <template #activator="{ props: menuProps }">
          <v-btn small color="primary" variant="outlined" v-bind="menuProps">
            <v-icon small left>mdi-download</v-icon>
            Export
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="exportCSV">
            <v-list-item-title>CSV</v-list-item-title>
          </v-list-item>
          <v-list-item @click="exportExcel">
            <v-list-item-title>Excel</v-list-item-title>
          </v-list-item>
          <v-list-item @click="exportPDF">
            <v-list-item-title>PDF</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Search -->
      <v-text-field
        v-model="search"
        :placeholder="searchLabel || 'Search…'"
        prepend-inner-icon="mdi-magnify"
        hide-details
        density="compact"
        variant="outlined"
        clearable
        class="search-input"
        @update:modelValue="onSearch"
      />
    </div>

    <v-divider />

    <!-- Table -->
    <v-data-table-server
      :items="items"
      :headers="headersWithIndex"
      :items-length="total"
      :loading="loading"
      :items-per-page="pageSize"
      :page="page"
      item-value="id"
      hover
      density="comfortable"
      fixed-header
      height="auto"
      class="modern-table"
      @update:options="updateOptions"
    >
      <template #item.actions="{ item }">
        <slot name="row-actions" :item="item" />
      </template>

      <!-- Bottom Pagination -->
      <template #bottom>
        <v-divider />
        <div class="d-flex align-center justify-end px-4 py-3">
          <v-pagination
            v-model="page"
            :length="pages"
            total-visible="7"
            class="pagination-bar"
            color="primary"
          />
        </div>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export type TableHeader = {
  title: string;
  key: string;
  sortable?: boolean;π
  width?: string | number;
};

const props = defineProps<{
  headers: TableHeader[];
  items: any[];
  total: number;
  loading?: boolean;
  pageSize?: number;
  searchLabel?: string;
  title?: string;
}>();
const emit = defineEmits<{
  (
    e: "update:query",
    v: { page: number; pageSize: number; search: string }
  ): void;
}>();

const search = ref("");
const page = ref(1);
const pageSize = computed(() => props.pageSize ?? 10);
const pages = computed(() =>
  Math.max(1, Math.ceil((props.total || 0) / pageSize.value))
);

const headersWithIndex = computed(() => [
  { title: "#", key: "index", width: 50 },
  ...props.headers,
]);

watch([page, pageSize], () =>
  emit("update:query", {
    page: page.value,
    pageSize: pageSize.value,
    search: search.value,
  })
);

function onSearch() {
  page.value = 1;
  emit("update:query", {
    page: 1,
    pageSize: pageSize.value,
    search: search.value,
  });
}
function updateOptions(options: any) {
  page.value = options.page;
}

const items = computed(() =>
  props.items.map((item, idx) => ({ index: idx + 1, ...item }))
);

function exportCSV() {
  const rows = items.value.map((row) =>
    headersWithIndex.value.map((h) => row[h.key])
  );
  const csvContent = [
    headersWithIndex.value.map((h) => h.title).join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `${props.title || "table"}-export.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportExcel() {
  const worksheet = XLSX.utils.json_to_sheet(items.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${props.title || "table"}-export.xlsx`);
}

function exportPDF() {
  const doc = new jsPDF();
  const columns = headersWithIndex.value.map((h) => h.title);
  const rows = items.value.map((row) =>
    headersWithIndex.value.map((h) => row[h.key])
  );
  // @ts-ignore
  doc.autoTable({ head: [columns], body: rows });
  doc.save(`${props.title || "table"}-export.pdf`);
}
</script>

<style scoped>
.elevated-card {
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}
.header-bar {
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
}
.search-input {
  max-width: 280px;
  min-width: 180px;
}

.modern-table :deep(.v-data-table__tr):nth-child(odd) {
  background-color: #f9fafb;
}
.modern-table :deep(.v-data-table__tr:hover) {
  background-color: #f0f4f8 !important;
}
.modern-table :deep(.v-data-table__th) {
  font-weight: 600;
  font-size: 0.85rem;
  background-color: #f3f4f6;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
}
.modern-table :deep(.v-data-table__td) {
  font-size: 0.85rem;
  color: #1f2937;
}

/* Small icons for row actions and export */
.modern-table :deep(.v-icon) {
  font-size: 18px;
}

/* Pagination */
.pagination-bar {
  margin-top: 4px;
}
</style>
