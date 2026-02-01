import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
  fetchClassroomCourses,
  fetchCourseWork,
  fetchCourseAnnouncements,
  fetchCourseMaterials,
  filterCoursesByName,
  type ClassroomCourse,
  type CourseWork,
  type CourseAnnouncement,
  type CourseWorkMaterial,
} from '@/lib/classroomApi';

/**
 * Hook to fetch user's Google Classroom courses
 */
export function useClassroomCourses(enabled = true) {
  const { data: session } = useSession();
  const accessToken = (session?.user as any)?.accessToken;
  const isGoogleUser = (session?.user as any)?.provider === 'google';

  // Debug: log session info
  console.log('useClassroomCourses debug:', {
    hasSession: !!session,
    hasAccessToken: !!accessToken,
    isGoogleUser,
    provider: (session?.user as any)?.provider,
    userEmail: session?.user?.email,
  });

  return useQuery({
    queryKey: ['classroom', 'courses'],
    queryFn: () => fetchClassroomCourses(accessToken),
    enabled: enabled && !!accessToken && isGoogleUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.message?.includes('401') || error?.message?.includes('403')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

/**
 * Hook to fetch coursework for a specific course
 */
export function useCourseWork(courseId: string, enabled = true) {
  const { data: session } = useSession();
  const accessToken = (session?.user as any)?.accessToken;
  const isGoogleUser = (session?.user as any)?.provider === 'google';

  return useQuery({
    queryKey: ['classroom', 'coursework', courseId],
    queryFn: () => fetchCourseWork(courseId, accessToken),
    enabled: enabled && !!courseId && !!accessToken && isGoogleUser,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('401') || error?.message?.includes('403')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

/**
 * Hook to fetch announcements for a specific course
 */
export function useCourseAnnouncements(courseId: string, enabled = true) {
  const { data: session } = useSession();
  const accessToken = (session?.user as any)?.accessToken;
  const isGoogleUser = (session?.user as any)?.provider === 'google';

  return useQuery({
    queryKey: ['classroom', 'announcements', courseId],
    queryFn: () => fetchCourseAnnouncements(courseId, accessToken),
    enabled: enabled && !!courseId && !!accessToken && isGoogleUser,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('401') || error?.message?.includes('403')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

/**
 * Hook to fetch course materials (lectures, readings) for a specific course
 */
export function useCourseMaterials(courseId: string, enabled = true) {
  const { data: session } = useSession();
  const accessToken = (session?.user as any)?.accessToken;
  const isGoogleUser = (session?.user as any)?.provider === 'google';

  return useQuery({
    queryKey: ['classroom', 'materials', courseId],
    queryFn: () => fetchCourseMaterials(courseId, accessToken),
    enabled: enabled && !!courseId && !!accessToken && isGoogleUser,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('401') || error?.message?.includes('403')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

/**
 * Hook to filter courses by search term
 */
export function useFilteredCourses(searchTerm: string) {
  const { data: courses, ...rest } = useClassroomCourses();

  const filteredCourses = courses ? filterCoursesByName(courses, searchTerm) : undefined;

  return {
    data: filteredCourses,
    ...rest,
  };
}

/**
 * Check if user has Google Classroom access
 */
export function useHasClassroomAccess() {
  const { data: session, status } = useSession();
  const isGoogleUser = (session?.user as any)?.provider === 'google';
  const hasAccessToken = !!(session?.user as any)?.accessToken;

  return {
    hasAccess: isGoogleUser && hasAccessToken,
    isGoogleUser,
    hasAccessToken,
    isLoading: status === 'loading',
    session,
  };
}