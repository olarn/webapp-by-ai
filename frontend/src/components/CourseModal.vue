<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="close"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ isEditing ? 'Edit Course' : 'Create New Course' }}
                </h3>
                <div class="mt-4 space-y-4">
                  <!-- Title -->
                  <div>
                    <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      id="title"
                      v-model="form.title"
                      type="text"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                      placeholder="e.g., Advanced Functional Programming with TypeScript"
                    />
                  </div>

                  <!-- Description -->
                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id="description"
                      v-model="form.description"
                      rows="3"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                      placeholder="e.g., Master functional programming concepts with TypeScript. Learn monads, functors, and advanced patterns for building robust applications."
                    ></textarea>
                  </div>

                  <!-- Image URL -->
                  <div>
                    <label for="image_url" class="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      id="image_url"
                      v-model="form.image_url"
                      type="url"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                      placeholder="e.g., https://example.com/course-image.jpg or /images/fp-course.svg"
                    />
                  </div>

                  <!-- Instructor -->
                  <div>
                    <label for="instructor" class="block text-sm font-medium text-gray-700">Instructor</label>
                    <input
                      id="instructor"
                      v-model="form.instructor"
                      type="text"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                      placeholder="e.g., Dr. John Smith"
                    />
                  </div>

                  <!-- Price -->
                  <div>
                    <label for="price" class="block text-sm font-medium text-gray-700">Price ($)</label>
                    <input
                      id="price"
                      v-model.number="form.price"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                      placeholder="e.g., 99.99"
                    />
                  </div>

                  <!-- Category -->
                  <div>
                    <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      id="category"
                      v-model="form.category"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    >
                      <option value="">Select a category</option>
                      <option value="Functional Programming">Functional Programming</option>
                      <option value="Object-Oriented Programming">Object-Oriented Programming</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Mobile Development">Mobile Development</option>
                    </select>
                  </div>

                  <!-- Status (only for editing) -->
                  <div v-if="isEditing">
                    <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      id="status"
                      v-model="form.status"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              :disabled="loading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="mr-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading ? 'Saving...' : (isEditing ? 'Update Course' : 'Create Course') }}
            </button>
            <button
              type="button"
              @click="close"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Course } from '../types/course';

interface Props {
  course?: Course | null;
  show: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', courseData: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const loading = ref(false);

const form = ref({
  title: '',
  description: '',
  image_url: '',
  instructor: '',
  price: 0,
  category: '',
  status: 'active' as 'active' | 'disabled'
});

const isEditing = computed(() => !!props.course);

// Watch for course changes to populate form
watch(() => props.course, (course) => {
  if (course) {
    form.value = {
      title: course.title,
      description: course.description,
      image_url: course.image_url,
      instructor: course.instructor,
      price: course.price,
      category: course.category,
      status: course.status
    };
  } else {
    // Reset form for new course
    form.value = {
      title: '',
      description: '',
      image_url: '',
      instructor: '',
      price: 0,
      category: '',
      status: 'active'
    };
  }
}, { immediate: true });

const close = () => {
  emit('close');
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    
    const courseData = {
      ...form.value,
      teacher_id: parseInt(localStorage.getItem('teacherId') || '1')
    };
    
    emit('save', courseData);
  } catch (error) {
    console.error('Error saving course:', error);
  } finally {
    loading.value = false;
  }
};
</script>
