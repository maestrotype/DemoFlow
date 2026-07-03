import { Project } from '@entities/project/model';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'prj-001',
    title: 'Summer Vacation Highlights',
    description: 'A cinematic documentary showcasing our family trip to the Mediterranean coast.',
    thumbnail: {
      url: '/assets/thumbnails/summer-vacation.jpg',
      alt: 'Summer vacation documentary thumbnail'
    },
    status: 'completed',
    sceneCount: 24,
    durationMs: 3600000, // 1 hour
    createdAt: new Date('2024-05-15T10:30:00Z'),
    updatedAt: new Date('2024-05-20T14:45:00Z'),
    lastEdited: new Date('2024-05-20T14:45:00Z')
  },
  {
    id: 'prj-002',
    title: 'Corporate Product Launch',
    description: 'Professional promotional video for our new software suite release.',
    thumbnail: {
      url: '/assets/thumbnails/corporate-launch.jpg',
      alt: 'Corporate product launch thumbnail'
    },
    status: 'in-progress',
    sceneCount: 18,
    durationMs: 2400000, // 40 minutes
    createdAt: new Date('2024-06-10T09:15:00Z'),
    updatedAt: new Date('2024-06-12T16:20:00Z'),
    lastEdited: new Date('2024-06-12T16:20:00Z')
  },
  {
    id: 'prj-003',
    title: 'Wedding Video Compilation',
    description: 'Romantic compilation of our wedding day ceremonies and celebrations.',
    thumbnail: {
      url: '/assets/thumbnails/wedding-video.jpg',
      alt: 'Wedding video compilation thumbnail'
    },
    status: 'draft',
    sceneCount: 32,
    durationMs: 4800000, // 1 hour 20 minutes
    createdAt: new Date('2024-06-01T11:00:00Z'),
    updatedAt: new Date('2024-06-01T11:00:00Z'),
    lastEdited: new Date('2024-06-01T11:00:00Z')
  },
  {
    id: 'prj-004',
    title: 'Tech Conference Presentation',
    description: 'Professional presentation video for the annual technology conference.',
    thumbnail: {
      url: '/assets/thumbnails/tech-conference.jpg',
      alt: 'Tech conference presentation thumbnail'
    },
    status: 'completed',
    sceneCount: 15,
    durationMs: 1800000, // 30 minutes
    createdAt: new Date('2024-04-22T13:45:00Z'),
    updatedAt: new Date('2024-04-28T17:30:00Z'),
    lastEdited: new Date('2024-04-28T17:30:00Z')
  },
  {
    id: 'prj-005',
    title: 'Travel Vlog Series',
    description: 'Episode 12 of our European travel adventure series.',
    thumbnail: {
      url: '/assets/thumbnails/travel-vlog.jpg',
      alt: 'Travel vlog series thumbnail'
    },
    status: 'in-progress',
    sceneCount: 28,
    durationMs: 3000000, // 50 minutes
    createdAt: new Date('2024-06-15T08:30:00Z'),
    updatedAt: new Date('2024-06-18T12:15:00Z'),
    lastEdited: new Date('2024-06-18T12:15:00Z')
  }
];
