<template>
  <div class="teacher-profile">
    <!-- Teacher Card -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-start space-x-4">
        <!-- Teacher Portrait -->
        <div class="flex-shrink-0">
          <div class="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
            <img 
              v-if="teacher.portrait_url" 
              :src="getImageUrl(teacher.portrait_url)" 
              :alt="teacher.name"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-primary-100">
              <span class="text-primary-600 font-bold text-lg">
                {{ teacher.name.split(' ').map(n => n[0]).join('') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Teacher Info -->
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            {{ teacher.name }}
          </h3>
          
          <!-- Background -->
          <p v-if="teacher.background" class="text-sm text-gray-600 mb-3 line-clamp-2">
            {{ teacher.background }}
          </p>
          
          <!-- Specialties -->
          <div v-if="teacher.specialties && teacher.specialties.length > 0" class="flex flex-wrap gap-2">
            <span 
              v-for="specialty in teacher.specialties" 
              :key="specialty"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              {{ specialty }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { imageCache } from '../services/imageCache';
import type { Teacher } from '../types/course';

interface Props {
  teacher: Teacher;
}

const props = defineProps<Props>();

const getImageUrl = (relativePath: string): string => {
  return imageCache.getImageUrl(relativePath);
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.style.display = 'none';
  // The fallback div with initials will show instead
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
