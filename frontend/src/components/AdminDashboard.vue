<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1 class="text-xl font-bold">Admin Dashboard</h1>
        <div class="flex items-center space-x-4">
          <button @click="logout" class="text-sm text-red-600 hover:text-red-800">Logout</button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- New Classes Section -->
      <section class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 class="text-sm text-gray-500">New Classes (last 3 months)</h2>
            <div class="mt-4">
              <BarChart :labels="stats?.months || []" :values="stats?.newClassesPerMonth || []" color="blue" />
            </div>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-700">Details</h3>
            <ul class="mt-4 space-y-2">
              <li v-for="(m, idx) in stats?.months || []" :key="m" class="flex items-center justify-between text-sm">
                <span class="text-gray-500">{{ m }}</span>
                <span class="font-medium text-gray-900">{{ stats?.newClassesPerMonth[idx] ?? 0 }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Income Section -->
      <section class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 class="text-sm text-gray-500">Total Income (last 3 months)</h2>
            <div class="mt-4">
              <BarChart :labels="stats?.months || []" :values="stats?.incomePerMonth || []" color="green" />
            </div>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-700">Details</h3>
            <ul class="mt-4 space-y-2">
              <li v-for="(m, idx) in stats?.months || []" :key="`inc-` + m" class="flex items-center justify-between text-sm">
                <span class="text-gray-500">{{ m }}</span>
                <span class="font-medium text-gray-900">{{ formatCurrency(stats?.incomePerMonth[idx] ?? 0) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Enrollment Status Pie Section -->
      <section class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 class="text-sm text-gray-500">Enrollments Status</h2>
            <div class="mt-4">
              <PieChart
                :labels="statusLabels"
                :values="statusValues"
                :colors="['#f59e0b', '#10b981', '#ef4444']"
              />
            </div>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-700">Details</h3>
            <ul class="mt-4 space-y-2">
              <li v-for="(label, idx) in statusLabels" :key="`st-` + label" class="flex items-center justify-between text-sm">
                <span class="flex items-center gap-2 text-gray-600">
                  <span class="inline-block w-3 h-3 rounded-sm" :style="{ backgroundColor: statusColors[idx] }"></span>
                  {{ label }}
                </span>
                <span class="font-medium text-gray-900">{{ statusValues[idx] ?? 0 }}</span>
              </li>
            </ul>
            <div class="mt-4 text-sm text-gray-500">Pending enrollments: <span class="font-semibold text-gray-900">{{ stats?.pendingEnrollments ?? '-' }}</span></div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineComponent, h } from 'vue';
import { useRouter } from 'vue-router';
import { adminApi, type AdminOverview } from '../services/adminApi';

const router = useRouter();
const stats = ref<AdminOverview | null>(null);

const logout = () => {
  localStorage.removeItem('admin');
  localStorage.removeItem('adminId');
  router.push('/admin/login');
};

onMounted(async () => {
  try {
    stats.value = await adminApi.getOverview();
  } catch (e) {
    // noop for now
  }
});

const formatCurrency = (n: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);

const statusLabels = computed(() => ['Pending', 'Confirmed', 'Cancelled']);
const statusValues = computed(() => [
  stats.value?.enrollmentStatusCounts.pending ?? 0,
  stats.value?.enrollmentStatusCounts.confirmed ?? 0,
  stats.value?.enrollmentStatusCounts.cancelled ?? 0
]);
const statusColors = computed(() => ['#f59e0b', '#10b981', '#ef4444']);
</script>

<script lang="ts">
export default defineComponent({
  name: 'AdminDashboard',
  components: {
    BarChart: defineComponent({
      name: 'BarChart',
      props: {
        labels: { type: Array as () => string[], required: true },
        values: { type: Array as () => number[], required: true },
        color: { type: String, default: 'blue' }
      },
      setup(props) {
        const colorMap: Record<string, string> = {
          blue: '#3b82f6',
          green: '#10b981',
          orange: '#f59e0b',
          red: '#ef4444',
          gray: '#6b7280'
        };
        return () => {
          const max = Math.max(1, ...props.values);
          const barColor = colorMap[props.color] ?? props.color ?? '#3b82f6';
          return h('div', { class: 'space-y-2', role: 'img', 'aria-label': 'Bar chart' }, [
            h('div', { class: 'flex text-xs text-gray-500 justify-between' }, props.labels.map((l) => h('span', l))),
            h(
              'div',
              { class: 'flex items-end space-x-2 h-40' },
              props.values.map((v, i) =>
                h('div', {
                  class: 'flex-1',
                  style: {
                    backgroundColor: barColor,
                    height: `${Math.max(5, Math.round((v / max) * 100))}%`,
                    minWidth: '20px'
                  },
                  title: String(v),
                  'aria-label': `${props.labels[i] ?? ''}: ${v}`
                })
              )
            ),
          ]);
        };
      }
        }),
        PieChart: defineComponent({
          name: 'PieChart',
          props: {
            labels: { type: Array as () => string[], required: true },
            values: { type: Array as () => number[], required: true },
            colors: { type: Array as () => string[], default: () => ['#f59e0b', '#10b981', '#ef4444'] }
          },
          setup(props) {
            const total = () => props.values.reduce((a, b) => a + b, 0);
            return () => {
              const t = total() || 1;
              let acc = 0;
              const sectors = props.values.map((v, idx) => {
                const start = (acc / t) * 2 * Math.PI;
                acc += v;
                const end = (acc / t) * 2 * Math.PI;
                const largeArc = end - start > Math.PI ? 1 : 0;
                const r = 60;
                const cx = 80;
                const cy = 80;
                const x1 = cx + r * Math.cos(start);
                const y1 = cy + r * Math.sin(start);
                const x2 = cx + r * Math.cos(end);
                const y2 = cy + r * Math.sin(end);
                const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
                return h('path', { d, fill: props.colors[idx % props.colors.length], 'aria-label': `${props.labels[idx]}: ${props.values[idx]}`, title: `${props.labels[idx]}: ${props.values[idx]}` });
              });
              return h('svg', { viewBox: '0 0 160 160', class: 'w-48 h-48', role: 'img', 'aria-label': 'Enrollment status pie chart' }, sectors);
            };
          }
        })
  }
});
</script>


