<template>
  <div class="space-y-8" data-testid="course-list">
    <!-- Hero Section -->
    <div class="text-center space-y-4">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900">
        Discover Amazing Courses
      </h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Learn from expert instructors in Functional Programming, Object-Oriented Programming, and DevOps with Kubernetes.
      </p>
      <div class="flex justify-center space-x-4">
        <router-link
          to="/teacher/login"
          data-testid="teacher-login-link"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Teacher Login
        </router-link>
      </div>
    </div>

    <!-- Search Section -->
    <div class="max-w-2xl mx-auto">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          data-testid="search-input"
          placeholder="Search courses by title, instructor, or category..."
          class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          @input="handleSearch"
        />
        <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            @click="clearSearch"
            class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Search Results Info -->
      <div v-if="searchQuery" class="mt-4 text-center">
        <p class="text-sm text-gray-600">
          Showing {{ filteredCourses.length }} of {{ allCourses.length }} courses
          <span v-if="searchQuery">for "{{ searchQuery }}"</span>
        </p>
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
        data-testid="course-card"
        class="card hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        @click="navigateToCourse(course.id)"
      >
        <!-- Course Image -->
        <div class="aspect-video bg-gray-200 relative overflow-hidden">
          <img 
            :src="getImageUrl(course.image_url)" 
            :alt="course.title"
            class="w-full h-full object-cover"
            @error="handleImageError"
            @load="loadImageWithCache(getImageUrl(course.image_url))"
          />
          <div class="absolute top-3 right-3">
            <span class="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              {{ course.category }}
            </span>
          </div>
        </div>

        <!-- Course Content -->
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2" data-testid="course-title">
            {{ course.title }}
          </h3>
          <p class="text-gray-600 text-sm mb-4 line-clamp-3">
            {{ course.description }}
          </p>
          
          <!-- Teacher Info -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-600 font-semibold text-sm">
                  {{ getInitials(course.teacher_name) }}
                </span>
              </div>
              <button 
                class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                data-testid="course-teacher"
                @click.stop="viewTeacherProfile(course.teacher_id)"
              >
                {{ course.teacher_name }}
              </button>
            </div>
            <div class="text-lg font-bold text-primary-600">
              ${{ course.price }} USD
            </div>
          </div>
          
          <!-- Action Button -->
          <button 
            class="w-full btn-primary"
            data-testid="view-course-button"
            @click.stop="navigateToCourse(course.id)"
          >
            View Course
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && filteredCourses.length === 0" class="text-center py-12">
      <div v-if="searchQuery" class="text-gray-500 text-lg">
        No courses found matching "{{ searchQuery }}". Try a different search term.
      </div>
      <div v-else class="text-gray-500 text-lg">No courses available at the moment.</div>
    </div>

    <!-- Teacher Profile Modal -->
    <div v-if="showTeacherModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Teacher Profile</h3>
            <button 
              @click="closeTeacherModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div v-if="selectedTeacher" class="space-y-4">
            <TeacherProfile :teacher="selectedTeacher" />
          </div>
          
          <div v-else-if="teacherLoading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-500">
            Teacher profile not available
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { courseApi, teacherApi } from '../services/api';
import { imageCache } from '../services/imageCache';
import TeacherProfile from './TeacherProfile.vue';
import type { Course, Teacher } from '../types/course';

const router = useRouter();
const courses = ref<Course[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');

// Teacher profile modal state
const showTeacherModal = ref(false);
const selectedTeacher = ref<Teacher | null>(null);
const teacherLoading = ref(false);

// Computed property for filtered courses
const filteredCourses = computed(() => {
  if (!searchQuery.value.trim()) {
    return courses.value;
  }
  
  const query = searchQuery.value.toLowerCase().trim();
  return courses.value.filter(course => 
    course.title.toLowerCase().includes(query) ||
    course.description.toLowerCase().includes(query) ||
    course.instructor.toLowerCase().includes(query) ||
    course.category.toLowerCase().includes(query)
  );
});

// Computed property for all courses count
const allCourses = computed(() => courses.value);

const loadCourses = async () => {
  try {
    loading.value = true;
    error.value = null;
    courses.value = await courseApi.getActiveCourses();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load courses';
  } finally {
    loading.value = false;
  }
};

const navigateToCourse = (courseId: number) => {
  router.push(`/course/${courseId}`);
};

const getImageUrl = (relativePath: string): string => {
  return imageCache.getImageUrl(relativePath);
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = getImageUrl('/images/placeholder-course.svg');
};

const loadImageWithCache = async (url: string): Promise<string> => {
  try {
    return await imageCache.getImage(url);
  } catch (error) {
    console.error('Error loading cached image:', error);
    return getImageUrl('/images/placeholder-course.svg');
  }
};

// Search functionality
const handleSearch = () => {
  // Search is handled by computed property
  // This function can be used for additional search logic if needed
};

const clearSearch = () => {
  searchQuery.value = '';
};

// Teacher profile functions
const showTeacherProfile = async (teacherId: number) => {
  showTeacherModal.value = true;
  teacherLoading.value = true;
  selectedTeacher.value = null;
  
  try {
    selectedTeacher.value = await teacherApi.getTeacherById(teacherId);
  } catch (error) {
    console.error('Failed to load teacher profile:', error);
  } finally {
    teacherLoading.value = false;
  }
};

const closeTeacherModal = () => {
  showTeacherModal.value = false;
  selectedTeacher.value = null;
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
