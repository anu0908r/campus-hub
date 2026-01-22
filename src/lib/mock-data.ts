export const courses = [
    {
      id: 'C101',
      title: 'Introduction to Creative Writing',
      description: 'Explore the fundamentals of storytelling, character development, and narrative structure.',
      image: { id: 'course-1', hint: 'student writing' },
    },
    {
      id: 'C102',
      title: 'Advanced Web Development',
      description: 'Dive deep into modern front-end frameworks and back-end architecture.',
      image: { id: 'course-2', hint: 'laptop code' },
    },
    {
      id: 'C103',
      title: 'World History: Ancient Civilizations',
      description: 'A survey of major civilizations from prehistory to the medieval period.',
      image: { id: 'course-3', hint: 'history books' },
    },
    {
      id: 'C104',
      title: 'Organic Chemistry I',
      description: 'An introduction to the structure, properties, and reactions of organic compounds.',
      image: { id: 'course-4', hint: 'science lab' },
    },
    {
      id: 'C105',
      title: 'Fundamentals of Digital Art',
      description: 'Learn the core principles of digital painting, illustration, and design.',
      image: { id: 'course-5', hint: 'art canvas' },
    },
    {
      id: 'C106',
      title: 'Music Theory and Composition',
      description: 'Study the building blocks of music and create your own compositions.',
      image: { id: 'course-6', hint: 'grand piano' },
    },
];

export const notes = [
    {
      id: 'N001',
      title: 'Lecture 1 - The Hero\'s Journey',
      course: 'Introduction to Creative Writing',
      date: '2024-05-10',
      size: '2.3 MB',
    },
    {
      id: 'N002',
      title: 'React Hooks Explained',
      course: 'Advanced Web Development',
      date: '2024-05-09',
      size: '5.1 MB',
    },
    {
      id: 'N003',
      title: 'Study Guide - Midterm Exam',
      course: 'World History: Ancient Civilizations',
      date: '2024-05-08',
      size: '800 KB',
    },
    {
      id: 'N004',
      title: 'Lab Report - Synthesis of Aspirin',
      course: 'Organic Chemistry I',
      date: '2024-05-07',
      size: '1.5 MB',
    },
];
  
export const resources = [
  {
    title: 'The Purdue Online Writing Lab (OWL)',
    description: 'A comprehensive resource for academic writing, grammar, and citation styles.',
    type: 'Website',
    href: 'https://owl.purdue.edu/',
  },
  {
    title: 'MDN Web Docs',
    description: 'The ultimate resource for web developers, maintained by Mozilla.',
    type: 'Documentation',
    href: 'https://developer.mozilla.org/',
  },
  {
    title: 'Khan Academy',
    description: 'Free online courses, lessons, and practice for a wide range of subjects.',
    type: 'Platform',
    href: 'https://www.khanacademy.org/',
  },
  {
    title: 'Project Gutenberg',
    description: 'A library of over 60,000 free eBooks.',
    type: 'eBooks',
    href: 'https://www.gutenberg.org/',
  },
];
