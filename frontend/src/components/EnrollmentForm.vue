<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Enroll in Course</h2>
          <button 
            @click="$emit('close')" 
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p class="text-gray-600 mt-2">{{ course?.title }}</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Personal Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                :class="{ 'border-red-500': errors.firstName }"
              />
              <p v-if="errors.firstName" class="text-red-500 text-sm mt-1">{{ errors.firstName }}</p>
            </div>
            
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                :class="{ 'border-red-500': errors.lastName }"
              />
              <p v-if="errors.lastName" class="text-red-500 text-sm mt-1">{{ errors.lastName }}</p>
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label for="company" class="block text-sm font-medium text-gray-700 mb-1">
              Company/Organization
            </label>
            <input
              id="company"
              v-model="form.company"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <!-- Course Summary -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Course Summary</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Course:</span>
              <span class="font-medium">{{ course?.title }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Instructor:</span>
              <span class="font-medium">{{ course?.instructor }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Price:</span>
              <span class="font-bold text-lg text-primary-600">${{ course?.price }}</span>
            </div>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="flex items-start space-x-3">
          <input
            id="terms"
            v-model="form.agreeToTerms"
            type="checkbox"
            required
            class="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="terms" class="text-sm text-gray-700">
            I agree to the 
            <a href="#" class="text-primary-600 hover:text-primary-500 underline">Terms and Conditions</a>
            and 
            <a href="#" class="text-primary-600 hover:text-primary-500 underline">Privacy Policy</a>
          </label>
        </div>

        <!-- Submit Button -->
        <div class="flex space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <span v-else>Proceed to Payment</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { enrollmentService } from '../services/enrollmentService';
import type { Course } from '../types/course';

interface Props {
  course: Course | null;
}

interface EnrollmentForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  proceedToPayment: [enrollmentData: EnrollmentForm & { courseId: number }];
}>();

const loading = ref(false);
const form = reactive<EnrollmentForm>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  agreeToTerms: false
});

const errors = reactive<FormErrors>({});

const validateForm = (): boolean => {
  errors.firstName = '';
  errors.lastName = '';
  errors.email = '';

  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address';
  }

  return !errors.firstName && !errors.lastName && !errors.email;
};

const handleSubmit = async () => {
  if (!validateForm() || !props.course) {
    return;
  }

  loading.value = true;
  
  try {
    const enrollmentData = {
      ...form,
      courseId: props.course.id
    };
    
    // Create enrollment record
    const enrollment = await enrollmentService.createEnrollment(enrollmentData);
    
    emit('proceedToPayment', { ...enrollmentData, enrollmentId: enrollment.enrollment_id });
  } catch (error) {
    console.error('Enrollment error:', error);
  } finally {
    loading.value = false;
  }
};
</script>
