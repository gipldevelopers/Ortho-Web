import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionTitle from './SectionTitle';

// CSS for pulsing animations
const styles = `
  @keyframes pulse-red {
    0% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
  }
  
  @keyframes pulse-ring {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
  
  .pain-marker {
    animation: pulse-red 2s infinite;
    background: rgba(239, 68, 68, 0.8);
  }
  
  .pain-marker::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.2);
    animation: pulse-ring 2s infinite;
  }
  
  .pain-marker:hover {
    transform: scale(1.2);
    animation: none;
    background: rgba(239, 68, 68, 0.9);
  }
  
  .pain-marker.highlighted {
    background: rgba(220, 38, 38, 0.9);
    transform: scale(1.1);
    animation: pulse-red 1.5s infinite;
  }
`;

// Body part data with positions (percentages for responsive positioning)
const bodyParts = [
  
  {
    id: 'shoulder',
    name: 'Shoulder',
    position: { top: '18%', left: '59%' },
    href: '/products/upper-limb',
    description: 'Shoulder braces & slings',
    highlighted: true, // This one will be highlighted
  },
  {
    id: 'elbow',
    name: 'Elbow',
    position: { top: '20%', left: '51%' },
    href: '/products/upper-limb',
    description: 'Elbow supports & braces',
  },
  {
    id: 'wrist',
    name: 'Wrist & Hand',
    position: { top: '29%', left: '43%' },
    href: '/products/wrist-hand',
    description: 'Wrist braces & thumb supports',
  },
  {
    id: 'back',
    name: 'Back & Spine',
    position: { top: '40%', left: '54%' },
    href: '/products/lumbar',
    description: 'Lumbar supports & posture',
  },
  {
    id: 'knee',
    name: 'Knee',
    position: { top: '58%', left: '67%' },
    href: '/products/knee',
    description: 'Knee braces & supports',
  },
  {
    id: 'ankle',
    name: 'Ankle & Foot',
    position: { top: '82%', left: '67%' },
    href: '/products/ankle-foot',
    description: 'Ankle stabilizers & braces',
  },
];

// Pain marker component
const PainMarker = ({ part, onHover, hoveredPart, onClick }) => {
  const isHovered = hoveredPart === part.id;
  const isHighlighted = part.highlighted;

  return (
    <motion.button
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 + bodyParts.indexOf(part) * 0.1 }}
      onClick={() => onClick(part)}
      onMouseEnter={() => onHover(part.id)}
      onMouseLeave={() => onHover(null)}
      className="absolute z-10 group"
      style={{
        top: part.position.top,
        left: part.position.left,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Pain marker - transparent red dot */}
      <div
        className={`
          relative w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 
          rounded-full border-2 border-white 
          pain-marker transition-all duration-300
          ${isHighlighted ? 'highlighted' : ''}
        `}
      >
        {/* Highlighted marker shows label inside */}
        {isHighlighted && (
          <span className="absolute inset-0 flex items-center justify-center text-white text-[8px] sm:text-[10px] font-bold">
            
          </span>
        )}
      </div>
      
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          y: isHovered ? 0 : 10 
        }}
        className="absolute bottom-full -right-16 -translate-x-1/2 mb-3 w-32 sm:w-40 pointer-events-none z-20"
      >
        <div className="bg-white rounded-xl shadow-xl p-2 sm:p-3 border border-red-100 text-center">
          <p className="font-semibold text-slate-900 text-xs sm:text-sm">{part.name}</p>
          <p className="text-xs text-slate-500">{part.description}</p>
        </div>
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
          <div className="w-2 h-2 bg-white rotate-45 border-r border-b border-red-100" />
        </div>
      </motion.div>
    </motion.button>
  );
};

// Side category buttons for mobile
const CategoryButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
      {bodyParts.map((part) => (
        <button
          key={part.id}
          onClick={() => navigate(part.href)}
          className="flex items-center space-x-2 p-3 bg-white rounded-xl border border-red-100 shadow-sm hover:border-red-400 hover:shadow-md transition-all text-left"
        >
          <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
          <div>
            <p className="font-medium text-slate-900 text-sm">{part.name}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default function PainLocator() {
  const [hoveredPart, setHoveredPart] = useState(null);
  const navigate = useNavigate();

  const handleMarkerClick = (part) => {
    navigate(part.href);
  };

  return (
    <>
      <style>{styles}</style>
      <section className="py-6 sm:py-10 lg:py-14 bg-gradient-to-b from-white to-red-50/30">
        <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2">
          <SectionTitle
            title="Locate Your Pain Area"
            // subtitle="Get the right support where you need it"
          />
          
          <div className="mt-2 sm:mt-2">
            <div className="relative max-w-4xl mx-auto">
              {/* Body Image Container */}
              <div className="relative aspect-[16/9] bg-gradient-to-br from-red-50/50 to-red-100/30 rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-xl">
                {/* Background pattern */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #ef4444 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                  }}
                />
                
                {/* Main body image */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <img
                    src="/home/body-diagram/running_img-82b3e6ac.webp"
                    alt="Body pain areas"
                    className="w-full h-full object-contain object-center rounded-xl"
                  />
                </div>

                {/* Pain markers - visible on all screens */}
                <div className="absolute inset-0">
                  {bodyParts.map((part) => (
                    <PainMarker
                      key={part.id}
                      part={part}
                      onHover={setHoveredPart}
                      hoveredPart={hoveredPart}
                      onClick={handleMarkerClick}
                    />
                  ))}
                </div>

                {/* Instruction text */}
               
              </div>

              {/* Mobile category buttons */}
              <CategoryButtons />

              {/* Desktop side guide (Left) */}
              <div className="hidden lg:block absolute top-0 left-0 -translate-x-full pr-8">
                <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-5 w-52">
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-red-500 rounded-full" />
                    Quick Guide
                  </h4>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-50 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-red-600 border border-red-100">1</div>
                      <p className="text-xs text-slate-600 leading-tight">Identify the area where you feel discomfort.</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-50 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-red-600 border border-red-100">2</div>
                      <p className="text-xs text-slate-600 leading-tight">Click the red hotspot for specialized solutions.</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-50 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-red-600 border border-red-100">3</div>
                      <p className="text-xs text-slate-600 leading-tight">Consult with our specialists for a precise fit.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop side legend (Right) */}
              <div className="hidden lg:block absolute top-0 right-0 translate-x-full pl-8">
                <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-5 w-52">
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-red-500 rounded-full" />
                    Pain Areas
                  </h4>
                  <div className="space-y-3">
                    {bodyParts.map((part) => (
                      <button
                        key={part.id}
                        onClick={() => handleMarkerClick(part)}
                        onMouseEnter={() => setHoveredPart(part.id)}
                        onMouseLeave={() => setHoveredPart(null)}
                        className="flex items-center space-x-3 w-full text-left group"
                      >
                        <span 
                          className={`
                            w-3 h-3 rounded-full transition-all duration-300
                            ${part.highlighted ? 'bg-red-600' : 'bg-red-400'}
                            ${hoveredPart === part.id ? 'scale-125' : ''}
                          `}
                        />
                        <span 
                          className={`
                            text-sm transition-colors
                            ${hoveredPart === part.id ? 'text-red-600 font-medium' : 'text-slate-600'}
                          `}
                        >
                          {part.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          {/* <div className="text-center mt-12 sm:mt-16">
            <p className="text-slate-600 mb-4">
              Not sure which product you need? Contact our specialists.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Talk to a Specialist
            </a>
          </div> */}
        </div>
      </section>
    </>
  );
}
