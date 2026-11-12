export const institute = {
  name: 'Vision Computer & Coaching Institute',
  shortName: 'VCCI',
  tagline: 'Input Student, Output Success.',
  phones: ['+91 77106-38292', '+91 62808-78187'],
  email: 'visioncomputer01@gmail.com',
  location: 'Ludhiana, Punjab, India',
  mapsUrl: 'https://maps.app.goo.gl/UN1atTd3aVRS6fm28?g_st=iwb',
};

export const navigationItems = [
  { label: 'Home', href: '#home', pageHref: '/' },
  { label: 'About Us', href: '#about', pageHref: '/about' },
  { label: 'Courses', href: '#courses', pageHref: '/courses' },
  { label: 'Student Zone', href: '#student-zone', pageHref: '/student-zone' },
  { label: 'Gallery', href: '#gallery', pageHref: '/gallery' },
  { label: 'Contact Us', href: '#contact', pageHref: '/contact' },
];

export const courses = [
  'Advance Basic', 'Basic Computer', 'DCA', 'ADCA', 'MDCA', 'Office Automation',
  'Punjabi Typing', 'Hindi Typing', 'Accounts', 'Tally / GST', 'Graphic Designing',
  'Web Designing', 'Programming', 'AutoCAD', 'HTML', 'Python', 'Networking', 'Hardware',
];

export const courseGroups = [
  { title: 'Computer Foundations', courses: ['Basic Computer', 'Advance Basic', 'Office Automation', 'DCA', 'ADCA', 'MDCA'] },
  { title: 'Typing & Office Skills', courses: ['Punjabi Typing', 'Hindi Typing', 'Accounts', 'Tally / GST'] },
  { title: 'Design & Digital Skills', courses: ['Graphic Designing', 'Web Designing', 'AutoCAD', 'HTML'] },
  { title: 'Programming & Technology', courses: ['Programming', 'Python', 'Networking', 'Hardware'] },
];

export const featuredCourses = ['DCA', 'ADCA', 'Tally / GST', 'Graphic Designing', 'Web Designing', 'Python'];

export const branches = [
  { name: 'VCCI, Ludhiana', location: 'Ludhiana, Punjab, India', mapsUrl: institute.mapsUrl, status: 'Current branch' },
];

// Legacy gallery route support. Official photographs can replace these entries later.
export const galleryPlaceholders = [
  ['Institute', 'Official VCCI institute photography.'],
  ['Computer Lab', 'Official VCCI computer-lab photography.'],
  ['Classroom', 'Official VCCI classroom photography.'],
  ['Activities', 'Official VCCI activity photography.'],
];

export const benefitGroups = [
  { icon: 'practice', title: 'Learning Excellence', items: ['Strong Foundation', 'Experienced Faculty', 'Practical Training'] },
  { icon: 'certificate', title: 'Career & Recognition', items: ['Certification', 'Placement Support'] },
  { icon: 'support', title: 'Student Support', items: ['Personalized Support', 'Online Classes Facility'] },
  { icon: 'infrastructure', title: 'Learning Environment', items: ['Modern Infrastructure'] },
];
