<template>
  <div class="space-y-8">
    <!-- Back Button -->
    <div>
      <button 
        @click="goBack" 
        class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        <span>Back to Courses</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 text-lg font-medium">{{ error }}</div>
      <button 
        @click="loadCourse" 
        class="mt-4 btn-primary"
      >
        Try Again
      </button>
    </div>

    <!-- Course Detail -->
    <div v-else-if="course" class="space-y-8">
      <!-- Course Header -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Course Image -->
        <div class="lg:col-span-2">
          <div class="aspect-video bg-gray-200 rounded-xl overflow-hidden">
            <img 
              :src="getImageUrl(course.image_url)" 
              :alt="course.title"
              class="w-full h-full object-cover"
              @error="handleImageError"
              @load="loadImageWithCache(getImageUrl(course.image_url))"
            />
          </div>
        </div>

        <!-- Course Info -->
        <div class="space-y-6">
          <div class="card p-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {{ course.category }}
                </span>
                <div class="text-right">
                  <div class="text-3xl font-bold text-gray-900">
                    ${{ course.price }}
                  </div>
                  <div class="text-sm text-gray-500">USD</div>
                </div>
              </div>

              <div class="space-y-2">
                <h1 class="text-3xl font-bold text-gray-900">
                  {{ course.title }}
                </h1>
                <p class="text-gray-600">
                  {{ course.description }}
                </p>
              </div>

              <!-- Teacher Profile -->
              <div v-if="teacher" class="border-t pt-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">About the Instructor</h3>
                <TeacherProfile :teacher="teacher" />
              </div>
              <div v-else class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span class="text-gray-600 font-medium">
                    {{ course.instructor.split(' ').map(n => n[0]).join('') }}
                  </span>
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ course.instructor }}</div>
                  <div class="text-sm text-gray-500">Instructor</div>
                </div>
              </div>

              <button 
                @click="showEnrollmentForm = true"
                class="w-full btn-primary text-lg py-3"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Course Details -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- What You'll Learn -->
        <div class="card p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
          <ul class="space-y-3">
            <li class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700">Master core concepts and principles</span>
            </li>
            <li class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700">Hands-on practical exercises</span>
            </li>
            <li class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700">Real-world project implementation</span>
            </li>
            <li class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700">Certificate of completion</span>
            </li>
          </ul>
        </div>

        <!-- Course Features -->
        <div class="card p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Course Features</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-700">Duration</span>
              <span class="font-medium text-gray-900">8-12 hours</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700">Level</span>
              <span class="font-medium text-gray-900">Intermediate</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700">Language</span>
              <span class="font-medium text-gray-900">English</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700">Access</span>
              <span class="font-medium text-gray-900">Lifetime</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700">Created</span>
              <span class="font-medium text-gray-900">{{ formatDate(course.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enrollment Form Modal -->
    <EnrollmentForm
      v-if="showEnrollmentForm"
      :course="course"
      @close="closeEnrollmentForm"
      @proceed-to-payment="handleEnrollmentSubmit"
    />

    <!-- Payment Screen Modal -->
    <PaymentScreen
      v-if="showPaymentScreen && enrollmentData"
      :course="course"
      :enrollment-data="enrollmentData"
      @close="closePaymentScreen"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { courseApi, teacherApi } from '../services/api';
import { imageCache } from '../services/imageCache';
import TeacherProfile from './TeacherProfile.vue';
import EnrollmentForm from './EnrollmentForm.vue';
import PaymentScreen from './PaymentScreen.vue';
import type { Course, Teacher } from '../types/course';

const router = useRouter();
const route = useRoute();
const course = ref<Course | null>(null);
const teacher = ref<Teacher | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const showEnrollmentForm = ref(false);
const showPaymentScreen = ref(false);
const enrollmentData = ref<any>(null);

const courseId = parseInt(route.params.id as string);

const loadCourse = async () => {
  try {
    loading.value = true;
    error.value = null;
    course.value = await courseApi.getCourseById(courseId);
    
    // Load teacher profile if course has teacher_id
    if (course.value && course.value.teacher_id) {
      try {
        teacher.value = await teacherApi.getTeacherById(course.value.teacher_id);
      } catch (teacherError) {
        console.warn('Failed to load teacher profile:', teacherError);
        // Don't fail the entire page if teacher profile fails to load
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load course';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/');
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const handleEnrollmentSubmit = (data: any) => {
  enrollmentData.value = data;
  showEnrollmentForm.value = false;
  showPaymentScreen.value = true;
};

const closeEnrollmentForm = () => {
  showEnrollmentForm.value = false;
};

const closePaymentScreen = () => {
  showPaymentScreen.value = false;
  enrollmentData.value = null;
};

onMounted(() => {
  loadCourse();
});
</script>
