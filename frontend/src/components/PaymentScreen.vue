<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Payment</h2>
          <button 
            @click="$emit('close')" 
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p class="text-gray-600 mt-2">Complete your enrollment</p>
      </div>

      <!-- Payment Content -->
      <div class="p-6 space-y-6">
        <!-- Order Summary -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Course:</span>
              <span class="font-medium">{{ course?.title }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Student:</span>
              <span class="font-medium">{{ enrollmentData.firstName }} {{ enrollmentData.lastName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Email:</span>
              <span class="font-medium">{{ enrollmentData.email }}</span>
            </div>
            <div class="border-t pt-2 mt-2">
              <div class="flex justify-between">
                <span class="text-lg font-semibold">Total:</span>
                <span class="text-xl font-bold text-primary-600">${{ course?.price }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900">Payment Information</h3>
          
          <!-- Payee Information -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-semibold text-blue-900 mb-2">Payee Information</h4>
            <div class="space-y-1 text-sm text-blue-800">
              <div><strong>Account Name:</strong> Course Platform Inc.</div>
              <div><strong>Account Number:</strong> 1234-5678-9012-3456</div>
              <div><strong>Bank:</strong> Mock Bank</div>
              <div><strong>Reference:</strong> ENR-{{ enrollmentData.courseId }}-{{ Date.now().toString().slice(-6) }}</div>
            </div>
          </div>

          <!-- QR Code -->
          <div class="text-center">
            <h4 class="font-semibold text-gray-900 mb-3">Scan QR Code to Pay</h4>
            <div class="bg-white border-2 border-gray-200 rounded-lg p-4 inline-block">
              <div class="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <div class="text-center">
                  <div class="w-32 h-32 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <svg class="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <p class="text-xs text-gray-600">Mock QR Code</p>
                  <p class="text-xs text-gray-500 mt-1">${{ course?.price }}</p>
                </div>
              </div>
            </div>
            <p class="text-sm text-gray-600 mt-2">
              Use your mobile banking app to scan this QR code
            </p>
          </div>

          <!-- Alternative Payment Methods -->
          <div class="space-y-3">
            <h4 class="font-semibold text-gray-900">Alternative Payment Methods</h4>
            <div class="grid grid-cols-2 gap-3">
              <button 
                @click="selectPaymentMethod('credit')"
                :class="[
                  'p-3 border rounded-lg text-left transition-colors',
                  selectedPaymentMethod === 'credit' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                  <span class="font-medium">Credit Card</span>
                </div>
              </button>
              
              <button 
                @click="selectPaymentMethod('bank')"
                :class="[
                  'p-3 border rounded-lg text-left transition-colors',
                  selectedPaymentMethod === 'bank' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.5 1L2 6v12h1.5v-2h15v2H22V6l-9.5-5zM20 16H4V8h16v8z"/>
                  </svg>
                  <span class="font-medium">Bank Transfer</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Mock Payment Button -->
          <div class="pt-4">
            <button
              @click="processPayment"
              :disabled="processing"
              class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="processing" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </span>
              <span v-else>Pay ${{ course?.price }}</span>
            </button>
            <p class="text-xs text-gray-500 text-center mt-2">
              This is a mock payment gateway for demonstration purposes
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Dialog -->
    <div v-if="showSuccessDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
        <p class="text-gray-600 mb-6">
          Your enrollment has been confirmed. You will receive a confirmation email shortly.
        </p>
        <button
          @click="handleSuccess"
          class="w-full btn-primary"
        >
          Continue to Home
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { enrollmentService } from '../services/enrollmentService';
import type { Course } from '../types/course';

interface EnrollmentData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  agreeToTerms: boolean;
  courseId: number;
  enrollmentId?: string;
}

interface Props {
  course: Course | null;
  enrollmentData: EnrollmentData;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const router = useRouter();
const processing = ref(false);
const showSuccessDialog = ref(false);
const selectedPaymentMethod = ref<'qr' | 'credit' | 'bank'>('qr');

const selectPaymentMethod = (method: 'qr' | 'credit' | 'bank') => {
  selectedPaymentMethod.value = method;
};

const processPayment = async () => {
  processing.value = true;
  
  try {
    console.log('Starting payment process...');
    console.log('Enrollment data:', props.enrollmentData);
    
    // Process payment through service
    const paymentData = {
      enrollmentId: props.enrollmentData.enrollmentId || `ENR-${Date.now()}`,
      amount: props.course?.price || 0,
      paymentMethod: selectedPaymentMethod.value,
      reference: `ENR-${props.enrollmentData.courseId}-${Date.now().toString().slice(-6)}`
    };
    
    console.log('Payment data:', paymentData);
    
    const payment = await enrollmentService.processPayment(paymentData);
    console.log('Payment created:', payment);
    
    // Complete the payment with a transaction ID
    const transactionId = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    console.log('Completing payment with transaction ID:', transactionId);
    
    await enrollmentService.completePayment(payment.payment_id, transactionId);
    console.log('Payment completed successfully');
    
    // Show success dialog
    showSuccessDialog.value = true;
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
  } finally {
    processing.value = false;
  }
};

const handleSuccess = () => {
  console.log('Payment success, navigating to home...');
  showSuccessDialog.value = false;
  emit('close');
  router.push('/');
};
</script>
