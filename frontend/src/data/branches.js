import bakaaroImage from '../assets/branch-bakaaro.png';
import xamarWeyneImage from '../assets/branch-xamar-weyne.png';
import banaadirImage from '../assets/branch-banaadir.png';

const branches = [
  {
    id: 'bakaaro',
    number: '01',
    name: 'Bakaaro Branch',
    area: 'Hodan District',
    location: 'Bakaaro area, Hodan District, Mogadishu',
    hours: 'Saturday–Thursday · 8:00 AM–8:00 PM',
    image: bakaaroImage,
    alt: 'The welcoming entrance and reading interior of Bakaaro Library Branch',
    summary: 'An accessible community branch serving readers, students, and families around the Bakaaro area.',
    description: 'Bakaaro Branch is designed as an active neighbourhood gateway to knowledge. Its collection and member-support services make it easy to discover books, understand request options, and find a dependable place for focused reading.',
    services: [
      { title: 'General collection', description: 'A broad selection of books for study, personal development, and everyday reading.', icon: 'books' },
      { title: 'Borrowing support', description: 'Clear assistance with borrowing requests, approvals, due dates, and returns.', icon: 'borrow' },
      { title: 'Member assistance', description: 'Practical guidance for accounts, catalogue searches, and library services.', icon: 'dashboard' },
    ],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bakaaro+Mogadishu+Somalia',
  },
  {
    id: 'xamar-weyne',
    number: '02',
    name: 'Xamar Weyne Branch',
    area: 'Xamar Weyne District',
    location: 'Xamar Weyne District, Mogadishu',
    hours: 'Saturday–Thursday · 8:00 AM–7:00 PM',
    image: xamarWeyneImage,
    alt: 'The arched reading hall of Xamar Weyne Library Branch',
    summary: 'A city-centre branch combining a calm reading environment with accessible catalogue and request support.',
    description: 'Xamar Weyne Branch connects the cultural heart of the city with a refined, welcoming place to read and learn. Members can browse the catalogue, receive help with requests, and use quiet areas for independent study.',
    services: [
      { title: 'Quiet reading', description: 'Comfortable spaces created for concentrated study and thoughtful reading.', icon: 'books' },
      { title: 'Catalogue guidance', description: 'Help finding titles by author, category, ISBN, or availability.', icon: 'search' },
      { title: 'Request support', description: 'Assistance with borrowing and purchase requests from start to decision.', icon: 'orders' },
    ],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Xamar+Weyne+Mogadishu+Somalia',
  },
  {
    id: 'banaadir',
    number: '03',
    name: 'Banaadir Branch',
    area: 'Banaadir area',
    location: 'Banaadir area, Mogadishu',
    hours: 'Saturday–Thursday · 8:00 AM–8:00 PM',
    image: banaadirImage,
    alt: 'The spacious modern learning interior of Banaadir Library Branch',
    summary: 'A modern learning branch bringing books, study support, and responsive member services closer to the community.',
    description: 'Banaadir Branch offers a bright, forward-looking environment for readers and learners. Its community collection, open study areas, and member services support both independent learning and shared discovery.',
    services: [
      { title: 'Community collection', description: 'Relevant titles for learners, families, researchers, and general readers.', icon: 'books' },
      { title: 'Study support', description: 'A welcoming setting for individual work, reading, and collaborative learning.', icon: 'sparkles' },
      { title: 'Account assistance', description: 'Support for memberships, request history, purchases, and borrowing activity.', icon: 'dashboard' },
    ],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Banaadir+Mogadishu+Somalia',
  },
];

export const getBranch = (id) => branches.find((branch) => branch.id === id);
export default branches;
