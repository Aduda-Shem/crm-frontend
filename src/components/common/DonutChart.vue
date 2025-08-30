<template>
  <svg :width="size" :height="size">
    <!-- Background track -->
    <circle
      :r="radius"
      :cx="center"
      :cy="center"
      stroke="#e5e7eb"
      fill="transparent"
      :stroke-width="stroke"
    />

    <!-- Donut slices -->
    <circle
      v-for="(slice, idx) in slices"
      :key="idx"
      :r="radius"
      :cx="center"
      :cy="center"
      :stroke="colors[idx % colors.length]"
      fill="transparent"
      :stroke-width="stroke"
      :stroke-dasharray="slice.pct * circumference + ' ' + circumference"
      :stroke-dashoffset="slice.offset * circumference"
      :transform="'rotate(-90 ' + center + ' ' + center + ')'"
      stroke-linecap="butt"
    />

    <!-- Center fill -->
    <circle
      :r="radius - stroke / 2"
      :cx="center"
      :cy="center"
      fill="#f9fafb"
    />

    <!-- Total count text -->
    <text
      :x="center"
      :y="center"
      text-anchor="middle"
      dominant-baseline="middle"
      font-size="16"
      font-weight="600"
      fill="#111827"
    >
      {{ total }}
    </text>
  </svg>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";

const props = defineProps({
  data: { type: Array as () => { label: string; count: number }[], required: true },
  size: { type: Number, default: 180 },
  stroke: { type: Number, default: 18 }
});

const radius = (props.size - props.stroke) / 2;
const center = props.size / 2;
const circumference = 2 * Math.PI * radius;

// Total count
const total = computed(() =>
  props.data.reduce((acc, d) => acc + (d.count || 0), 0)
);

// Build slices with percentage and offset
const slices = computed(() => {
  let cumulative = 0;
  return props.data.map((d) => {
    const pct = total.value === 0 ? 0 : d.count / total.value;
    const slice = { pct, offset: cumulative };
    cumulative += pct;
    return slice;
  });
});

// Chart colors
const colors = ["#1976D2", "#43A047", "#FFC107", "#E53935", "#7E57C2"];
</script>

<style scoped>
svg {
  display: block;
  margin: auto;
}
</style>
