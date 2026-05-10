require('dotenv').config();
const mongoose = require('mongoose');
const Expert = require('../models/Expert');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing in .env');
  process.exit(1);
}

// Generate slots for the next `daysAhead` days
const generateSlots = (daysAhead = 6) => {
  const times = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'];
  const slots = [];
  
  for (let d = 0; d < daysAhead; d++) {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + d);
    const dateString = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
    
    for (const time of times) {
      slots.push({
        date: dateString,
        time: time,
        isBooked: false // Default to all available
      });
    }
  }
  return slots;
};

const dummyExperts = [
  // Tech
  {
    name: 'Rahul Sharma',
    avatar: 'https://i.pravatar.cc/150?img=11',
    title: 'Senior Cloud Architect',
    category: 'Tech',
    experience: 12,
    rating: 4.8,
    reviewCount: 342,
    hourlyRate: 150,
    bio: 'Experienced cloud architect specializing in AWS and Kubernetes. I help startups scale their infrastructure efficiently and securely.',
    skills: ['AWS', 'Kubernetes', 'Docker', 'System Design'],
    isVerified: true,
    totalSessions: 450,
    availableSlots: generateSlots(6)
  },
  {
    name: 'Priya Kapoor',
    avatar: 'https://i.pravatar.cc/150?img=5',
    title: 'Lead Full-Stack Developer',
    category: 'Tech',
    experience: 8,
    rating: 4.9,
    reviewCount: 215,
    hourlyRate: 120,
    bio: 'Passionate about building scalable web applications. Expert in React, Node.js, and modern JavaScript ecosystems.',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    isVerified: true,
    totalSessions: 320,
    availableSlots: generateSlots(6)
  },
  {
    name: 'Arjun Reddy',
    avatar: 'https://i.pravatar.cc/150?img=12',
    title: 'AI & Machine Learning Engineer',
    category: 'Tech',
    experience: 6,
    rating: 4.7,
    reviewCount: 189,
    hourlyRate: 180,
    bio: 'I help businesses integrate generative AI and predictive analytics into their workflows. Background in NLP and computer vision.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP'],
    isVerified: false,
    totalSessions: 210,
    availableSlots: generateSlots(6)
  },
  
  // Design
  {
    name: 'Ananya Desai',
    avatar: 'https://i.pravatar.cc/150?img=9',
    title: 'Principal UX/UI Designer',
    category: 'Design',
    experience: 10,
    rating: 4.9,
    reviewCount: 405,
    hourlyRate: 110,
    bio: 'Designing user-centric digital products that convert. I focus on accessibility, clean interfaces, and seamless user experiences.',
    skills: ['Figma', 'Prototyping', 'User Research', 'Wireframing'],
    isVerified: true,
    totalSessions: 600,
    availableSlots: generateSlots(6)
  },
  {
    name: 'Karan Patel',
    avatar: 'https://i.pravatar.cc/150?img=13',
    title: 'Brand Identity Consultant',
    category: 'Design',
    experience: 7,
    rating: 4.6,
    reviewCount: 156,
    hourlyRate: 100,
    bio: 'Specializing in visual identity and brand storytelling. Let\'s build a brand that resonates with your target audience.',
    skills: ['Branding', 'Typography', 'Illustrator', 'Creative Direction'],
    isVerified: true,
    totalSessions: 240,
    availableSlots: generateSlots(6)
  },

  // Business
  {
    name: 'Vikram Singh',
    avatar: 'https://i.pravatar.cc/150?img=14',
    title: 'Startup Advisor & Strategist',
    category: 'Business',
    experience: 15,
    rating: 4.9,
    reviewCount: 290,
    hourlyRate: 200,
    bio: 'I advise early-stage startups on go-to-market strategies, fundraising, and scaling operations. Ex-founder with 2 successful exits.',
    skills: ['Strategy', 'Fundraising', 'Operations', 'Leadership'],
    isVerified: true,
    totalSessions: 380,
    availableSlots: generateSlots(6)
  },
  {
    name: 'Neha Gupta',
    avatar: 'https://i.pravatar.cc/150?img=10',
    title: 'Product Management Leader',
    category: 'Business',
    experience: 9,
    rating: 4.8,
    reviewCount: 210,
    hourlyRate: 150,
    bio: 'Helping PMs level up their careers and advising companies on agile product development and roadmap prioritization.',
    skills: ['Product Strategy', 'Agile', 'Roadmapping', 'User Interviews'],
    isVerified: false,
    totalSessions: 290,
    availableSlots: generateSlots(6)
  },

  // Marketing
  {
    name: 'Rohan Mehta',
    avatar: 'https://i.pravatar.cc/150?img=15',
    title: 'Growth Hacker & SEO Expert',
    category: 'Marketing',
    experience: 8,
    rating: 4.7,
    reviewCount: 175,
    hourlyRate: 90,
    bio: 'Data-driven marketer focusing on organic growth and SEO strategies. I help you rank higher and acquire users cheaper.',
    skills: ['SEO', 'Growth Hacking', 'Google Analytics', 'Content Strategy'],
    isVerified: true,
    totalSessions: 200,
    availableSlots: generateSlots(6)
  },
  {
    name: 'Sneha Joshi',
    avatar: 'https://i.pravatar.cc/150?img=16',
    title: 'Social Media Strategist',
    category: 'Marketing',
    experience: 5,
    rating: 4.6,
    reviewCount: 120,
    hourlyRate: 80,
    bio: 'Crafting viral social media campaigns and building engaged online communities. Let\'s boost your social presence.',
    skills: ['Social Media', 'Content Creation', 'Community Management', 'Copywriting'],
    isVerified: true,
    totalSessions: 150,
    availableSlots: generateSlots(6)
  },

  // Finance
  {
    name: 'Aditya Verma',
    avatar: 'https://i.pravatar.cc/150?img=17',
    title: 'Financial Planner & Analyst',
    category: 'Finance',
    experience: 11,
    rating: 4.8,
    reviewCount: 310,
    hourlyRate: 120,
    bio: 'Certified financial planner helping individuals and businesses manage wealth, invest smartly, and optimize taxes.',
    skills: ['Wealth Management', 'Financial Modeling', 'Tax Strategy', 'Investing'],
    isVerified: true,
    totalSessions: 420,
    availableSlots: generateSlots(6)
  },
  {
    name: 'Deepa Iyer',
    avatar: 'https://i.pravatar.cc/150?img=18',
    title: 'Fintech Consultant',
    category: 'Finance',
    experience: 14,
    rating: 4.9,
    reviewCount: 260,
    hourlyRate: 250,
    bio: 'Bridging the gap between traditional banking and modern technology. Advising on payment gateways and blockchain integration.',
    skills: ['Fintech', 'Payments', 'Blockchain', 'Banking'],
    isVerified: true,
    totalSessions: 330,
    availableSlots: generateSlots(6)
  },
  {
    name: 'Manish Tiwari',
    avatar: 'https://i.pravatar.cc/150?img=19',
    title: 'Venture Capital Analyst',
    category: 'Finance',
    experience: 6,
    rating: 4.5,
    reviewCount: 95,
    hourlyRate: 150,
    bio: 'I help founders prepare pitch decks and understand unit economics to secure seed and Series A funding.',
    skills: ['Venture Capital', 'Pitch Decks', 'Unit Economics', 'Due Diligence'],
    isVerified: false,
    totalSessions: 110,
    availableSlots: generateSlots(6)
  },

  // Health
  {
    name: 'Dr. Shruti Nair',
    avatar: 'https://i.pravatar.cc/150?img=20',
    title: 'Clinical Nutritionist',
    category: 'Health',
    experience: 10,
    rating: 4.9,
    reviewCount: 420,
    hourlyRate: 90,
    bio: 'Personalized nutrition plans for weight management, gut health, and peak performance. Evidence-based advice only.',
    skills: ['Diet Planning', 'Gut Health', 'Sports Nutrition', 'Wellness'],
    isVerified: true,
    totalSessions: 550,
    availableSlots: generateSlots(6)
  },
  {
    name: 'Amit Bhardwaj',
    avatar: 'https://i.pravatar.cc/150?img=21',
    title: 'Mental Health Counselor',
    category: 'Health',
    experience: 8,
    rating: 4.8,
    reviewCount: 300,
    hourlyRate: 100,
    bio: 'Providing a safe space to discuss anxiety, burnout, and stress management. Specialized in cognitive behavioral therapy.',
    skills: ['Counseling', 'CBT', 'Stress Management', 'Mindfulness'],
    isVerified: true,
    totalSessions: 400,
    availableSlots: generateSlots(6)
  },
  {
    name: 'Kavita Rao',
    avatar: 'https://i.pravatar.cc/150?img=22',
    title: 'Fitness & Mobility Coach',
    category: 'Health',
    experience: 7,
    rating: 4.7,
    reviewCount: 215,
    hourlyRate: 80,
    bio: 'Helping remote workers fix their posture and build functional strength through targeted mobility routines.',
    skills: ['Mobility', 'Strength Training', 'Posture Correction', 'Rehab'],
    isVerified: true,
    totalSessions: 280,
    availableSlots: generateSlots(6)
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('📦 Connected to MongoDB for seeding...');

    // Wipe existing data
    await Expert.deleteMany({});
    console.log('🧹 Cleared existing experts data');

    // Insert new data
    const insertedExperts = await Expert.insertMany(dummyExperts);
    
    console.log(`✅ ${insertedExperts.length} experts seeded successfully`);
    insertedExperts.forEach(expert => {
      console.log(`   - ${expert.name} (${expert.category})`);
    });

    mongoose.connection.close();
    console.log('🔌 Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedDB();
