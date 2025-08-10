import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CourseList from '../src/components/CourseList.vue';
import { courseApi } from '../src/services/api';

// Mock the API service
vi.mock('../src/services/api', () => ({
  courseApi: {
    getActiveCourses: vi.fn()
  }
}));

// Mock vue-router
const mockRouter = {
  push: vi.fn()
};

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}));

describe('CourseList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    const wrapper = mount(CourseList, {
      global: {
        stubs: { 'router-link': { template: '<a><slot /></a>' } }
      }
    });
    expect(wrapper.find('.animate-spin').exists()).toBe(true);
  });

  it('renders courses when data is loaded', async () => {
    const mockCourses = [
      {
        id: 1,
        title: 'Functional Programming',
        description: 'Learn functional programming concepts',
        image_url: '/image1.jpg',
        instructor: 'John Doe',
        price: 49.99,
        category: 'Programming',
        created_at: '2023-01-01T00:00:00Z',
        teacher_id: 1,
        status: 'active' as const
      }
    ];

    vi.mocked(courseApi.getActiveCourses).mockResolvedValue(mockCourses);

    const wrapper = mount(CourseList, {
      global: {
        stubs: { 'router-link': { template: '<a><slot /></a>' } }
      }
    });

    // Wait for the component to load
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.grid').exists()).toBe(true);
    expect(wrapper.text()).toContain('Functional Programming');
    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('$49.99');
  });

  it('renders error state when API fails', async () => {
    vi.mocked(courseApi.getActiveCourses).mockRejectedValue(new Error('API Error'));

    const wrapper = mount(CourseList, {
      global: {
        stubs: { 'router-link': { template: '<a><slot /></a>' } }
      }
    });

    // Wait for the component to load
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('API Error');
    expect(wrapper.find('button').text()).toContain('Try Again');
  });

  it('navigates to course detail when course is clicked', async () => {
    const mockCourses = [
      {
        id: 1,
        title: 'Functional Programming',
        description: 'Learn functional programming concepts',
        image_url: '/image1.jpg',
        instructor: 'John Doe',
        price: 49.99,
        category: 'Programming',
        created_at: '2023-01-01T00:00:00Z',
        teacher_id: 1,
        status: 'active' as const
      }
    ];

    vi.mocked(courseApi.getActiveCourses).mockResolvedValue(mockCourses);

    const wrapper = mount(CourseList, {
      global: {
        stubs: { 'router-link': { template: '<a><slot /></a>' } }
      }
    });

    // Wait for the component to load
    await flushPromises();
    await wrapper.vm.$nextTick();

    // Click on the course card
    await wrapper.find('.card').trigger('click');

    expect(mockRouter.push).toHaveBeenCalledWith('/course/1');
  });

  it('renders empty state when no courses are available', async () => {
    vi.mocked(courseApi.getActiveCourses).mockResolvedValue([]);

    const wrapper = mount(CourseList, {
      global: {
        stubs: { 'router-link': { template: '<a><slot /></a>' } }
      }
    });

    // Wait for the component to load
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('No courses available at the moment');
  });
});
