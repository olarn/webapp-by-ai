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

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-sm text-gray-500">New Classes (last 3 months)</h2>
          <div class="mt-4">
            <BarChart :labels="stats?.months || []" :values="stats?.newClassesPerMonth || []" color="blue" />
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-sm text-gray-500">Total Income (last 3 months)</h2>
          <div class="mt-4">
            <BarChart :labels="stats?.months || []" :values="stats?.incomePerMonth || []" color="green" />
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
          <div>
            <h2 class="text-sm text-gray-500">Pending Enrollments</h2>
            <p class="mt-4 text-4xl font-semibold">{{ stats?.pendingEnrollments ?? '-' }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
</script>

<script lang="ts">
import { defineComponent, h } from 'vue';

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
        return () => h('div', { class: 'space-y-2' }, [
          h('div', { class: 'flex text-xs text-gray-500 justify-between' }, props.labels.map((l) => h('span', l))),
          h(
            'div',
            { class: 'flex items-end space-x-2 h-40' },
            props.values.map((v) =>
              h('div', {
                class: `flex-1 bg-${props.color}-500`,
                style: {
                  height: `${Math.max(5, v)}px`,
                  minWidth: '20px'
                },
                title: String(v)
              })
            )
          ),
        ]);
      }
    })
  }
});
</script>


