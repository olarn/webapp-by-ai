<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Teacher Dashboard</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Welcome, {{ teacher?.name }}</span>
            <button
              @click="handleLogout"
              class="text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Courses</p>
              <p class="text-2xl font-semibold text-gray-900">{{ courses.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Active Courses</p>
              <p class="text-2xl font-semibold text-gray-900">{{ activeCoursesCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Disabled Courses</p>
              <p class="text-2xl font-semibold text-gray-900">{{ disabledCoursesCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Actions -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-6 border-b border-gray-200">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div class="flex-1 max-w-lg">
              <label for="search" class="sr-only">Search courses</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  id="search"
                  v-model="searchKeyword"
                  @input="handleSearch"
                  type="text"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search your courses..."
                />
              </div>
            </div>
            <div class="flex space-x-3">
              <button
                @click="showCreateModal = true"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Course
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-600 text-lg font-medium">{{ error }}</div>
        <button 
          @click="loadCourses" 
          class="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>

      <!-- Course Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="course in filteredCourses" 
          :key="course.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <!-- Course Image -->
          <div class="aspect-video bg-gray-200 relative overflow-hidden">
            <img 
              :src="getImageUrl(course.image_url)" 
              :alt="course.title"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div class="absolute top-3 right-3">
              <span 
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  course.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]"
              >
                {{ course.status }}
              </span>
            </div>
          </div>

          <!-- Course Content -->
          <div class="p-6 space-y-4">
            <h3 class="text-xl font-semibold text-gray-900 line-clamp-2">
              {{ course.title }}
            </h3>
            
            <p class="text-gray-600 text-sm line-clamp-3">
              {{ course.description }}
            </p>

            <div class="flex items-center justify-between">
              <div class="text-2xl font-bold text-gray-900">
                ${{ course.price }}
              </div>
              <div class="text-sm text-gray-500">{{ course.category }}</div>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-2">
              <button
                @click="editCourse(course)"
                class="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit
              </button>
              <button
                @click="toggleCourseStatus(course)"
                :class="[
                  'flex-1 px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2',
                  course.status === 'active'
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500'
                    : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                ]"
              >
                {{ course.status === 'active' ? 'Disable' : 'Enable' }}
              </button>
              <button
                @click="deleteCourse(course.id)"
                class="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && filteredCourses.length === 0" class="text-center py-12">
        <div class="text-gray-500 text-lg">
          {{ searchKeyword ? 'No courses found matching your search.' : 'No courses created yet.' }}
        </div>
        <button 
          v-if="!searchKeyword"
          @click="showCreateModal = true" 
          class="mt-4 btn-primary"
        >
          Create Your First Course
        </button>
      </div>
    </main>

    <!-- Create/Edit Course Modal -->
    <CourseModal
      v-if="showCreateModal || editingCourse"
      :course="editingCourse"
      :show="showCreateModal || !!editingCourse"
      @close="closeModal"
      @save="handleSaveCourse"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { courseApi } from '../services/api';
import { imageCache } from '../services/imageCache';
import { useAuth } from '@/composables/useAuth';
import type { Course } from '../types/course';
import CourseModal from './CourseModal.vue';

const router = useRouter();
const courses = ref<Course[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchKeyword = ref('');
const showCreateModal = ref(false);
const editingCourse = ref<Course | null>(null);

const teacher = ref(JSON.parse(localStorage.getItem('teacher') || '{}'));

const activeCoursesCount = computed(() => 
  courses.value.filter(course => course.status === 'active').length
);

const disabledCoursesCount = computed(() => 
  courses.value.filter(course => course.status === 'disabled').length
);

const filteredCourses = computed(() => {
  if (!searchKeyword.value) return courses.value;
  
  const keyword = searchKeyword.value.toLowerCase();
  return courses.value.filter(course =>
    course.title.toLowerCase().includes(keyword) ||
    course.description.toLowerCase().includes(keyword) ||
    course.category.toLowerCase().includes(keyword)
  );
});

const loadCourses = async () => {
  try {
    loading.value = true;
    error.value = null;
    courses.value = await courseApi.getTeacherCourses();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load courses';
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  // Search is handled by computed property
};

const editCourse = (course: Course) => {
  editingCourse.value = course;
};

const closeModal = () => {
  showCreateModal.value = false;
  editingCourse.value = null;
};

const handleSaveCourse = async (courseData: any) => {
  try {
    if (editingCourse.value) {
      await courseApi.updateCourse(editingCourse.value.id, courseData);
    } else {
      await courseApi.createCourse(courseData);
    }
    await loadCourses();
    closeModal();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to save course';
  }
};

const toggleCourseStatus = async (course: Course) => {
  try {
    const newStatus = course.status === 'active' ? 'disabled' : 'active';
    await courseApi.updateCourseStatus(course.id, newStatus);
    await loadCourses();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to update course status';
  }
};

const deleteCourse = async (courseId: number) => {
  if (!confirm('Are you sure you want to delete this course?')) return;
  
  try {
    await courseApi.deleteCourse(courseId);
    await loadCourses();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to delete course';
  }
};

const getImageUrl = (relativePath: string): string => {
  return imageCache.getImageUrl(relativePath);
};

const { logout } = useAuth();

const handleLogout = () => {
  logout();
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = getImageUrl('/images/placeholder-course.svg');
};

onMounted(() => {
  loadCourses();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
