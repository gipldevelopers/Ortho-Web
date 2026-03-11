import {
  Heart,
  Footprints,
  Bone,
  CircleDot,
  Accessibility,
  Hand,
  Activity,
  Move,
  Shield,
  Award,
  Users,
  Globe,
  CheckCircle,
  Clock,
  Stethoscope,
  Zap,
  Target,
  FileText,
  Briefcase,
  TrendingUp,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';

export const categories = [
  {
    id: 'compression',
    name: 'Compression Products',
    description: 'Medical-grade compression garments for improved circulation and recovery support.',
    icon: Heart,
    href: '/products/compression',
  },
  {
    id: 'ankle-foot',
    name: 'Ankle & Foot Supports',
    description: 'Comprehensive range of ankle braces, foot supports, and orthotic solutions.',
    icon: Footprints,
    href: '/products/ankle-foot',
  },
  {
    id: 'knee',
    name: 'Knee Supports & Braces',
    description: 'Advanced knee braces and supports for sports injuries and post-surgical recovery.',
    icon: Bone,
    href: '/products/knee',
  },
  {
    id: 'lumbar',
    name: 'Lumbar & Pelvic Supports',
    description: 'Ergonomic back supports and pelvic belts for pain relief and posture correction.',
    icon: CircleDot,
    href: '/products/lumbar',
  },
  {
    id: 'upper-limb',
    name: 'Upper Limb Supports',
    description: 'Shoulder braces, arm slings, and elbow supports for comprehensive upper body care.',
    icon: Accessibility,
    href: '/products/upper-limb',
  },
  {
    id: 'wrist-hand',
    name: 'Wrist & Hand Supports',
    description: 'Wrist braces, thumb supports, and hand splints for RSI and injury recovery.',
    icon: Hand,
    href: '/products/wrist-hand',
  },
  {
    id: 'cervical',
    name: 'Cervical & Posture Supports',
    description: 'Neck collars, posture correctors, and chest supports for spinal alignment.',
    icon: Activity,
    href: '/products/cervical',
  },
  {
    id: 'therapy',
    name: 'Therapy & Mobility Aids',
    description: 'Hot/cold therapy products and mobility aids for rehabilitation and daily living.',
    icon: Move,
    href: '/products/therapy',
  },
];

export const featuredProducts = [
  {
    id: 'knee-brace-pro',
    name: 'Pro Knee Support Brace',
    code: 'OC-KB-001',
    category: 'Knee Supports',
    description: 'Professional-grade knee brace with adjustable compression and side stabilizers for ACL recovery.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&h=500&fit=crop',
    badge: 'Best Seller',
    features: ['Adjustable compression', 'Side stabilizers', 'Breathable fabric'],
    indications: ['ACL recovery', 'MCL injuries', 'Sports protection'],
  },
  {
    id: 'ankle-support',
    name: 'Ankle Stabilizer Support',
    code: 'OC-AS-002',
    category: 'Ankle & Foot',
    description: 'Lightweight ankle support with figure-8 strap design for sprain prevention and recovery.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&h=500&fit=crop',
    badge: 'New',
    features: ['Figure-8 strap', 'Lightweight design', 'Universal fit'],
    indications: ['Ankle sprains', 'Instability', 'Sports protection'],
  },
  {
    id: 'compression-sleeve',
    name: 'Medical Compression Sleeve',
    code: 'OC-CS-003',
    category: 'Compression',
    description: 'Graduated compression sleeve for improved blood circulation and reduced swelling.',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&h=500&fit=crop',
    features: ['Graduated compression', 'Moisture-wicking', 'Anti-microbial'],
    indications: ['Varicose veins', 'Edema', 'Post-surgical'],
  },
  {
    id: 'back-support',
    name: 'Lumbar Support Belt',
    code: 'OC-LB-004',
    category: 'Lumbar Supports',
    description: 'Ergonomic lumbar belt with dual adjustment straps for lower back pain relief.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&h=500&fit=crop',
    badge: 'Popular',
    features: ['Dual adjustment', 'Breathable mesh', 'Removable pads'],
    indications: ['Lower back pain', 'Posture correction', 'Lifting support'],
  },
  {
    id: 'wrist-brace',
    name: 'Adjustable Wrist Brace',
    code: 'OC-WB-005',
    category: 'Wrist & Hand',
    description: 'Splinted wrist brace with removable metal stays for carpal tunnel and RSI relief.',
    image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=500&h=500&fit=crop',
    features: ['Removable stays', 'Adjustable straps', 'Neoprene blend'],
    indications: ['Carpal tunnel', 'RSI', 'Wrist sprains'],
  },
  {
    id: "shoulder-brace",
    name: "Shoulder Recovery Brace",
    code: "OC-SB-006",
    category: "Upper Limb",
    bodyPart: "Shoulder",
    usage: "Post-Surgical",
    description: "Comprehensive shoulder brace with rotator cuff support and immobilization features.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&h=500&fit=crop",
    badge: "Medical Grade",
    features: ["Rotator cuff support", "Immobilization", "Universal sizing"],
    indications: ["Rotator cuff injuries", "Dislocations", "Post-surgical"],
  },
  {
    id: "wrist-splint",
    name: "Advanced Wrist Splint",
    code: "OC-WS-007",
    category: "Wrist & Hand",
    bodyPart: "Wrist",
    usage: "Daily Support",
    description: "Breathable wrist splint for carpal tunnel relief and stability.",
    image: "https://images.unsplash.com/photo-1588615419958-e630ebb3b1bc?w=500&h=500&fit=crop",
    features: ["Aluminum stay", "Breathable mesh", "Adjustable straps"],
    indications: ["Carpal Tunnel", "Wrist Sprains"],
  },
  {
    id: "posture-corrector",
    name: "Ergo Posture Corrector",
    code: "OC-PC-008",
    category: "Cervical & Posture",
    bodyPart: "Neck",
    usage: "Daily Support",
    description: "Adjustable posture corrector to pull shoulders back and align the spine.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop",
    badge: "New",
    features: ["Soft padding", "Adjustable", "Discrete under clothes"],
    indications: ["Slouching", "Back pain", "Neck strain"],
  },
  {
    id: "elbow-support",
    name: "Tennis Elbow Sleeve",
    code: "OC-ES-009",
    category: "Upper Limb",
    bodyPart: "Shoulder",
    usage: "Sports",
    description: "Compression sleeve for lateral epicondylitis relief.",
    image: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=500&h=500&fit=crop",
    features: ["Gel pad", "Breathable", "Targeted compression"],
    indications: ["Tennis Elbow", "Golfer's Elbow"],
  },
];

// Add bodyPart and usage to existing products
featuredProducts.forEach(p => {
  if (p.id === 'knee-brace-pro') { p.bodyPart = 'Knee'; p.usage = 'Sports'; }
  if (p.id === 'ankle-support') { p.bodyPart = 'Ankle'; p.usage = 'Sports'; }
  if (p.id === 'compression-sleeve') { p.bodyPart = 'Back'; p.usage = 'Daily Support'; }
  if (p.id === 'back-support') { p.bodyPart = 'Back'; p.usage = 'Daily Support'; }
  if (p.id === 'wrist-brace') { p.bodyPart = 'Wrist'; p.usage = 'Daily Support'; }
});

export const whyChooseUs = [
  {
    icon: Shield,
    title: 'Quality Manufacturing',
    description: 'ISO 13485 certified manufacturing facilities with rigorous quality control processes ensuring every product meets medical-grade standards.',
  },
  {
    icon: Award,
    title: 'Medical Grade Materials',
    description: 'We use only hypoallergenic, breathable, and durable materials that are tested for biocompatibility and long-term comfort.',
  },
  {
    icon: Users,
    title: 'Trusted by Professionals',
    description: 'Our products are recommended by orthopedic surgeons, physiotherapists, and hospitals in over 50 countries worldwide.',
  },
  {
    icon: Globe,
    title: 'Global Compliance',
    description: 'CE marked, FDA registered, and compliant with international medical device regulations for complete peace of mind.',
  },
];

export const statistics = [
  { value: '28+', label: 'Years Experience', suffix: '' },
  { value: '500', label: 'Products', suffix: '+' },
  { value: '50', label: 'Countries', suffix: '+' },
  { value: '10000', label: 'Healthcare Partners', suffix: '+' },
];

export const companyTimeline = [
  {
    year: '1995',
    title: 'Company Founded',
    description: 'OrthoCare was established with a vision to provide quality orthopedic solutions.',
  },
  {
    year: '2002',
    title: 'ISO Certification',
    description: 'Achieved ISO 13485 certification for medical device quality management.',
  },
  {
    year: '2008',
    title: 'Global Expansion',
    description: 'Expanded operations to 25 countries across Europe and Asia.',
  },
  {
    year: '2015',
    title: 'R&D Center',
    description: 'Opened state-of-the-art research and development facility.',
  },
  {
    year: '2022',
    title: 'Digital Transformation',
    description: 'Launched digital platform for distributors and healthcare partners.',
  },
];

export const certifications = [
  { name: 'ISO 13485:2016', description: 'Medical Device Quality Management', icon: CheckCircle },
  { name: 'CE Marking', description: 'European Conformity Certified', icon: Shield },
  { name: 'FDA Registered', description: 'US Food & Drug Administration', icon: Award },
  { name: 'GMP Compliant', description: 'Good Manufacturing Practice', icon: CheckCircle },
];

export const downloadFiles = [
  { name: 'Complete Product Catalogue 2024', type: 'PDF', size: '15.2 MB', icon: FileText },
  { name: 'Compression Products Datasheet', type: 'PDF', size: '3.8 MB', icon: FileText },
  { name: 'Knee Supports Technical Guide', type: 'PDF', size: '2.4 MB', icon: FileText },
  { name: 'ISO 13485 Certificate', type: 'PDF', size: '1.2 MB', icon: Award },
  { name: 'CE Certification Documents', type: 'PDF', size: '2.1 MB', icon: Shield },
  { name: 'Distributor Price List', type: 'PDF', size: '0.8 MB', icon: Briefcase },
];
