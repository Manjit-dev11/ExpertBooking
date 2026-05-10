// constants/mockData.ts

export const CATEGORIES = ['All', 'Tech', 'Design', 'Business', 'Marketing', 'Finance', 'Health']

const generateSlots = (daysAhead: number) => {
  const slots: { date: string; time: string; isBooked: boolean }[] = []
  const times = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM']
  for (let d = 0; d < daysAhead; d++) {
    const date = new Date()
    date.setDate(date.getDate() + d)
    const dateStr = date.toISOString().split('T')[0]
    times.forEach(time => {
      slots.push({
        date: dateStr,
        time,
        isBooked: Math.random() < 0.3,
      })
    })
  }
  return slots
}

export interface Expert {
  _id: string
  name: string
  avatar: string
  title: string
  category: string
  experience: number
  rating: number
  reviewCount: number
  hourlyRate: number
  bio: string
  skills: string[]
  isVerified: boolean
  totalSessions: number
  availableSlots: { date: string; time: string; isBooked: boolean }[]
}

export interface Booking {
  _id: string
  expertId: string
  expertName: string
  expertAvatar: string
  expertTitle: string
  userName: string
  userEmail: string
  date: string
  timeSlot: string
  notes: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  hourlyRate: number
}

export const MOCK_EXPERTS: Expert[] = [
  {
    _id: '1',
    name: 'Arjun Mehta',
    avatar: 'https://i.pravatar.cc/150?img=11',
    title: 'Senior Product Designer',
    category: 'Design',
    experience: 8,
    rating: 4.9,
    reviewCount: 214,
    hourlyRate: 120,
    bio: 'I help startups craft pixel-perfect products. Previously at Figma and Notion. Passionate about design systems and 0→1 products.',
    skills: ['Figma', 'Design Systems', 'UX Research', 'Prototyping', 'Branding'],
    isVerified: true,
    totalSessions: 540,
    availableSlots: generateSlots(6),
  },
  {
    _id: '2',
    name: 'Priya Kapoor',
    avatar: 'https://i.pravatar.cc/150?img=47',
    title: 'Full Stack Engineer',
    category: 'Tech',
    experience: 6,
    rating: 4.8,
    reviewCount: 189,
    hourlyRate: 150,
    bio: 'Ex-Google engineer. I specialize in scalable Node.js + React systems. Love mentoring early-career developers.',
    skills: ['React', 'Node.js', 'AWS', 'MongoDB', 'System Design'],
    isVerified: true,
    totalSessions: 390,
    availableSlots: generateSlots(6),
  },
  {
    _id: '3',
    name: 'Rohan Desai',
    avatar: 'https://i.pravatar.cc/150?img=33',
    title: 'Growth Marketing Lead',
    category: 'Marketing',
    experience: 5,
    rating: 4.7,
    reviewCount: 98,
    hourlyRate: 90,
    bio: 'Helped 30+ startups grow from 0 to $1M ARR. Expert in SEO, paid ads, and viral content loops.',
    skills: ['SEO', 'Paid Ads', 'Content Strategy', 'Email Marketing', 'Analytics'],
    isVerified: false,
    totalSessions: 210,
    availableSlots: generateSlots(6),
  },
  {
    _id: '4',
    name: 'Sneha Iyer',
    avatar: 'https://i.pravatar.cc/150?img=21',
    title: 'Business Strategy Consultant',
    category: 'Business',
    experience: 12,
    rating: 5.0,
    reviewCount: 302,
    hourlyRate: 200,
    bio: 'McKinsey alumni. I help founders navigate growth, fundraising, and strategic pivots.',
    skills: ['Strategy', 'Fundraising', 'Operations', 'GTM', 'Financial Modeling'],
    isVerified: true,
    totalSessions: 720,
    availableSlots: generateSlots(6),
  },
  {
    _id: '5',
    name: 'Karan Shah',
    avatar: 'https://i.pravatar.cc/150?img=52',
    title: 'Personal Finance Advisor',
    category: 'Finance',
    experience: 9,
    rating: 4.6,
    reviewCount: 143,
    hourlyRate: 110,
    bio: 'Certified CFP. I simplify investing, tax planning, and FIRE strategy for millennials.',
    skills: ['Investing', 'Tax Planning', 'Mutual Funds', 'FIRE', 'Insurance'],
    isVerified: true,
    totalSessions: 310,
    availableSlots: generateSlots(6),
  },
  {
    _id: '6',
    name: 'Meera Nair',
    avatar: 'https://i.pravatar.cc/150?img=29',
    title: 'Mental Health & Wellness Coach',
    category: 'Health',
    experience: 7,
    rating: 4.9,
    reviewCount: 267,
    hourlyRate: 80,
    bio: 'Licensed therapist + ICF coach. I work on burnout, anxiety, and performance mindset for founders.',
    skills: ['CBT', 'Mindfulness', 'Burnout Recovery', 'Leadership Coaching', 'NLP'],
    isVerified: true,
    totalSessions: 450,
    availableSlots: generateSlots(6),
  },
  {
    _id: '7',
    name: 'Dev Malhotra',
    avatar: 'https://i.pravatar.cc/150?img=60',
    title: 'AI/ML Engineer',
    category: 'Tech',
    experience: 4,
    rating: 4.7,
    reviewCount: 77,
    hourlyRate: 180,
    bio: 'Building LLM products at a YC startup. Expert in RAG pipelines, fine-tuning, and AI product strategy.',
    skills: ['Python', 'LLMs', 'RAG', 'PyTorch', 'MLOps'],
    isVerified: false,
    totalSessions: 130,
    availableSlots: generateSlots(6),
  },
  {
    _id: '8',
    name: 'Ananya Bose',
    avatar: 'https://i.pravatar.cc/150?img=16',
    title: 'Brand & Visual Designer',
    category: 'Design',
    experience: 6,
    rating: 4.8,
    reviewCount: 156,
    hourlyRate: 100,
    bio: 'Crafting brand identities for D2C and SaaS companies. Worked with 80+ founders to find their visual voice.',
    skills: ['Brand Identity', 'Illustration', 'Motion Design', 'Figma', 'Adobe Suite'],
    isVerified: true,
    totalSessions: 280,
    availableSlots: generateSlots(6),
  },
]

export const MOCK_BOOKINGS: Booking[] = [
  {
    _id: 'b1',
    expertId: '1',
    expertName: 'Arjun Mehta',
    expertAvatar: 'https://i.pravatar.cc/150?img=11',
    expertTitle: 'Senior Product Designer',
    userName: 'Rahul Verma',
    userEmail: 'rahul@example.com',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '11:00 AM',
    notes: 'Need help with my app redesign.',
    status: 'confirmed',
    hourlyRate: 120,
  },
  {
    _id: 'b2',
    expertId: '3',
    expertName: 'Rohan Desai',
    expertAvatar: 'https://i.pravatar.cc/150?img=33',
    expertTitle: 'Growth Marketing Lead',
    userName: 'Rahul Verma',
    userEmail: 'rahul@example.com',
    date: (() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().split('T')[0] })(),
    timeSlot: '3:00 PM',
    notes: '',
    status: 'pending',
    hourlyRate: 90,
  },
  {
    _id: 'b3',
    expertId: '4',
    expertName: 'Sneha Iyer',
    expertAvatar: 'https://i.pravatar.cc/150?img=21',
    expertTitle: 'Business Strategy Consultant',
    userName: 'Rahul Verma',
    userEmail: 'rahul@example.com',
    date: (() => { const d = new Date(); d.setDate(d.getDate() - 3); return d.toISOString().split('T')[0] })(),
    timeSlot: '9:00 AM',
    notes: 'Discussed fundraising strategy.',
    status: 'completed',
    hourlyRate: 200,
  },
]
