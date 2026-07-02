import { Project } from '../model';

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Summer Vacation Highlights',
    description: 'A 3-minute montage showcasing the best moments from our family summer vacation with beach scenes, adventures, and sunset views.',
    thumbnail: {
      url: '/assets/thumbnails/summer-vacation.jpg',
      alt: 'Summer Vacation Highlights thumbnail'
    },
    status: 'completed',
    sceneCount: 24,
    durationMs: 180000,
    createdAt: '2023-07-15T10:30:00Z',
    updatedAt: '2023-07-20T14:45:00Z',
    lastEdited: '2023-07-20T14:45:00Z'
  },
  {
    id: '2',
    title: 'Corporate Product Demo',
    description: 'Professional 2-minute product demonstration video for our quarterly investor presentation featuring key features and benefits.',
    thumbnail: {
      url: '/assets/thumbnails/corporate-demo.jpg',
      alt: 'Corporate Product Demo thumbnail'
    },
    status: 'in-progress',
    sceneCount: 12,
    durationMs: 120000,
    createdAt: '2023-08-01T09:15:00Z',
    updatedAt: '2023-08-03T11:20:00Z',
    lastEdited: '2023-08-03T11:20:00Z'
  },
  {
    id: '3',
    title: 'Wedding Ceremony Film',
    description: 'Complete wedding ceremony footage edited into a beautiful 10-minute highlight reel with romantic music and special moments.',
    thumbnail: {
      url: '/assets/thumbnails/wedding-ceremony.jpg',
      alt: 'Wedding Ceremony Film thumbnail'
    },
    status: 'draft',
    sceneCount: 32,
    durationMs: 600000,
    createdAt: '2023-08-10T16:45:00Z',
    updatedAt: '2023-08-10T16:45:00Z'
  },
  {
    id: '4',
    title: 'Tech Conference Keynote',
    description: 'A 5-minute keynote presentation video with professional visuals, speaker highlights, and audience reactions from the annual tech conference.',
    thumbnail: {
      url: '/assets/thumbnails/tech-conference.jpg',
      alt: 'Tech Conference Keynote thumbnail'
    },
    status: 'completed',
    sceneCount: 18,
    durationMs: 300000,
    createdAt: '2023-06-15T12:00:00Z',
    updatedAt: '2023-06-20T18:30:00Z',
    lastEdited: '2023-06-20T18:30:00Z'
  },
  {
    id: '5',
    title: 'Fitness Training Series',
    description: 'Comprehensive 4-part training series for fitness enthusiasts with exercise demonstrations and expert tips.',
    thumbnail: {
      url: '/assets/thumbnails/fitness-training.jpg',
      alt: 'Fitness Training Series thumbnail'
    },
    status: 'in-progress',
    sceneCount: 28,
    durationMs: 480000,
    createdAt: '2023-09-01T09:30:00Z',
    updatedAt: '2023-09-05T14:20:00Z',
    lastEdited: '2023-09-05T14:20:00Z'
  },
  {
    id: '6',
    title: 'Real Estate Property Tour',
    description: 'Professional 3-minute virtual property tour showcasing key features and lifestyle benefits of the premium residential complex.',
    thumbnail: {
      url: '/assets/thumbnails/real-estate-tour.jpg',
      alt: 'Real Estate Property Tour thumbnail'
    },
    status: 'draft',
    sceneCount: 15,
    durationMs: 180000,
    createdAt: '2023-09-15T11:00:00Z',
    updatedAt: '2023-09-15T11:00:00Z'
  }
];