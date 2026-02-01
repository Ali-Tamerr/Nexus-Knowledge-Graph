import { useState, useMemo } from 'react';
import { signIn } from 'next-auth/react';
import { Search, Grid, List, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useClassroomCourses } from '@/hooks/useClassroomApi';
import { ClassroomCourse } from '@/lib/classroomApi';

interface ClassroomSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseSelect: (course: ClassroomCourse) => void;
}

export function ClassroomSelectionModal({ 
  isOpen, 
  onClose, 
  onCourseSelect 
}: ClassroomSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { 
    data: courses = [], 
    isLoading, 
    error,
    refetch 
  } = useClassroomCourses(isOpen);

  // Filter courses based on search term
  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) return courses;
    
    const term = searchTerm.toLowerCase();
    return courses.filter(course => 
      course.name.toLowerCase().includes(term) ||
      course.description?.toLowerCase().includes(term) ||
      course.descriptionHeading?.toLowerCase().includes(term)
    );
  }, [courses, searchTerm]);

  const handleChangeAccount = async () => {
    try {
      await signIn('google', { 
        callbackUrl: window.location.href,
        redirect: false 
      });
    } catch (error) {
      console.error('Error changing Google account:', error);
    }
  };

  const handleCourseClick = (course: ClassroomCourse) => {
    onCourseSelect(course);
  };

  if (error) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Google Classroom" size="lg">
        <div className="p-6 text-center">
          <p className="text-red-400 mb-4">Failed to load Google Classroom courses.</p>
          <p className="text-sm text-zinc-400 mb-6">
            Please check your Google account permissions and try again.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => refetch()} variant="secondary">
              Retry
            </Button>
            <Button onClick={handleChangeAccount} variant="brand">
              Change Account
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Google Classroom Course" size="lg">
      <div className="flex flex-col h-[600px]">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <Button
              variant="secondary"
              onClick={handleChangeAccount}
              className="whitespace-nowrap"
            >
              Change account
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-zinc-700 text-white' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-zinc-700 text-white' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2 text-zinc-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading courses...</span>
              </div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-zinc-400 mb-2">
                  {searchTerm ? 'No courses found matching your search.' : 'No courses available.'}
                </p>
                {searchTerm && (
                  <Button
                    variant="secondary"
                    onClick={() => setSearchTerm('')}
                    size="sm"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-3'
            }>
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => handleCourseClick(course)}
                  className={`
                    border border-zinc-700 rounded-lg p-4 cursor-pointer
                    transition-colors hover:bg-zinc-800 hover:border-zinc-600
                    ${viewMode === 'grid' ? 'aspect-square flex flex-col' : 'flex items-center gap-4'}
                  `}
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1 line-clamp-2">
                      {course.name}
                    </h3>
                    {course.description && (
                      <p className="text-sm text-zinc-400 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                    {course.room && (
                      <p className="text-xs text-zinc-500 mt-1">
                        Room: {course.room}
                      </p>
                    )}
                  </div>
                  
                  {course.enrollmentCode && (
                    <div className="mt-2 text-xs">
                      <span className="px-2 py-1 bg-zinc-700 text-zinc-300 rounded">
                        {course.enrollmentCode}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}