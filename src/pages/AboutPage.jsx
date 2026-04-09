import { motion } from 'framer-motion';
import { Award, CheckCircle, Factory, Globe, Heart, Shield, Target, Users, Zap, TrendingUp } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import FeatureCard from '../components/FeatureCard';
import { companyTimeline, certifications, whyChooseUs } from '../data';

const aboutFeatures = [
  {
    icon: Factory,
    title: 'State-of-the-Art Manufacturing',
    description: 'Advanced manufacturing space with climate control for consistent product quality',
  },
  {
    icon: Shield,
    title: 'Rigorous Quality Control',
    description: '15+ quality checks on every item, from raw materials to packaging.',
  },
  {
    icon: Globe,
    title: 'Global Distribution Network',
    description: 'Distribution centers across three continents ensuring worldwide availability',
  },
  {
    icon: Zap,
    title: 'Continuous Innovation',
    description: 'Dedicated R&D team collaborating with orthopedic specialists to innovate continuously.',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Patient First',
    description: ' Designs centered on effective recovery',
  },
  {
    icon: Target,
    title: 'Excellence',
    description: 'Consistent quality across every product.',
  },
  {
    icon: Shield,
    title: 'Integrity',
    description: 'Transparent pricing and timelines.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Built with clinicians for real-world success.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-12 gradient-bg overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 bg-medical-100 text-medical-700 rounded-full text-sm font-medium mb-6"
            >
              About OrthoCare 
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6"
            > Trusted 
              <span className="gradient-text"> Orthopedic Solutions </span>
                 for Nearly 30 Years {' '}
              
            </motion.h1> 
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 leading-relaxed"
            >
              Since 1995, Ortho Care has partnered with leading surgeons, physiotherapists, and rehab experts to develop orthopedic supports that deliver realworld results. ISO 13485 certiϐied, CE marked, and FDA registered, our products serve 50+ countries with over 500 solutions trusted by 10,000+ healthcare professionals globally. 

            </motion.p>
          </div>
        </div>
      </section>

      {/* Manufacturing Section */}
      <section id="manufacturing" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionTitle
                title="World-Class Manufacturing"
                subtitle="Our Facility"
                centered={false}
              />
              <p className="text-slate-600 mb-8 leading-relaxed">
                Our 100,000 sq. ft. facility features automated cutting and precision sewing in clean-room environments to produce orthopedic supports that meet stringent quality demands at scale.
              </p>
              
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {aboutFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-medical-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-medical-600" />
                    </div>
                    <div>
                      {/* <h4 className="font-semibold text-slate-900 text-sm sm:text-base mb-1 line-clamp-1">{feature.title}</h4> */}
                      <p className="text-[11px] sm:text-sm text-slate-500 line-clamp-2">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="/about/Manufacturing Facility copy.avif"
                  alt="Manufacturing Facility"
                  className="rounded-2xl shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=400&h=400&fit=crop"
                  alt="Quality Control"
                  className="rounded-2xl shadow-lg mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop"
                  alt="Research Lab"
                  className="rounded-2xl shadow-lg -mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop"
                  alt="Production Line"
                  className="rounded-2xl shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Our Milestones"
          />
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-medical-200 hidden md:block" />
            
            <div className="space-y-12">
              {companyTimeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="w-full md:w-1/2 md:px-12">
                    <div className={`${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <span className="text-2xl sm:text-4xl font-bold gradient-text">{item.year}</span>
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mt-1 sm:mt-2">{item.title}</h3>
                      <p className="text-sm sm:text-base text-slate-600 mt-1 sm:mt-2">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-center justify-center w-12 h-12 my-4 md:my-0">
                    <div className="w-4 h-4 bg-medical-500 rounded-full z-10" />
                    <div className="absolute w-12 h-12 bg-medical-100 rounded-full animate-pulse" />
                  </div>
                  
                  <div className="w-full md:w-1/2 md:px-12" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Certiϐied Quality You Can Trust"
          />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-4 sm:p-8 card-shadow-hover border border-slate-100"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 gradient-medical rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-white">
                  <cert.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-sm sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2 line-clamp-1">{cert.name}</h3>
                <p className="text-[11px] sm:text-base text-slate-500 line-clamp-2">{cert.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-12 gradient-medical relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-6 md:p-12"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-medical-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-medical-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-4">Our Mission</h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Make recovery accessible and effective worldwide, with products designed to enhance real patient outcomes. 
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-6 md:p-12"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-medical-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-medical-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-4">Our Vision</h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Become the most trusted name in orthopedic supports, ensuring every patient has access to quality recovery aids. 
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Our Commitment to Care "
          />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {values.map((value, index) => (
              <FeatureCard key={value.title} feature={value} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
