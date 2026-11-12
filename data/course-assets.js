const image = (name) => `/images/courses/${name}`;

export const courseArtwork = {
  'Basic Computer': image('photo_2026-08-14_22-36-20.jpg'),
  'Advance Basic': image('photo_5_2026-08-11_18-59-44.jpg'),
  'Office Automation': image('photo_4_2026-08-11_18-59-44.jpg'),
  DCA: image('ChatGPT Image Aug 14, 2026, 10_35_25 PM.png'),
  ADCA: image('ChatGPT Image Aug 12, 2026, 11_37_07 AM.png'),
  MDCA: image('ChatGPT Image Aug 12, 2026, 11_30_17 AM.png'),
  'Punjabi Typing': image('ChatGPT Image Aug 12, 2026, 11_29_47 AM.png'),
  'Hindi Typing': image('ChatGPT Image Aug 12, 2026, 11_29_34 AM.png'),
  Accounts: image('accounts.png'),
  'Tally / GST': image('photo_7_2026-08-11_18-59-44.jpg'),
  'Graphic Designing': image('graphic-designing.png'),
  'Web Designing': image('ChatGPT Image Aug 12, 2026, 11_25_18 AM.png'),
  AutoCAD: image('autocad.png'),
  HTML: image('ChatGPT Image Aug 12, 2026, 11_45_19 PM.png'),
  Programming: image('ChatGPT Image Aug 12, 2026, 11_45_59 PM.png'),
  Python: image('ChatGPT Image Aug 12, 2026, 11_46_08 PM.png'),
  Networking: image('ChatGPT Image Aug 12, 2026, 11_45_43 PM.png'),
  Hardware: image('ChatGPT Image Aug 12, 2026, 11_45_33 PM.png'),
};

export const getCourseArtwork = (title) => courseArtwork[title];
