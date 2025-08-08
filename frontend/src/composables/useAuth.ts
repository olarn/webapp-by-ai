import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

// Global authentication state
const authState = ref(!!localStorage.getItem('teacherId'));

export function useAuth() {
  const router = useRouter();

  // Reactive authentication state
  const isTeacherLoggedIn = computed(() => {
    return authState.value;
  });

  // Update auth state when localStorage changes
  const updateAuthState = () => {
    authState.value = !!localStorage.getItem('teacherId');
  };

  // Listen for storage events (for cross-tab synchronization)
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'teacherId') {
      updateAuthState();
    }
  };

  const login = (teacherId: string) => {
    localStorage.setItem('teacherId', teacherId);
    updateAuthState();
  };

  const logout = () => {
    localStorage.removeItem('teacher');
    localStorage.removeItem('teacherId');
    updateAuthState();
    router.push('/');
  };

  onMounted(() => {
    // Initial auth state check
    updateAuthState();

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
  });

  // Watch for route changes to update auth state
  watch(() => router.currentRoute.value.path, () => {
    updateAuthState();
  });

  return {
    isTeacherLoggedIn,
    login,
    logout,
    updateAuthState
  };
}
