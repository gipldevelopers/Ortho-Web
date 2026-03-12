import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp({
  phone = '1234567890', // replace with your number, no + or spaces
  presetMessage = 'Hello! I would like to know more about your products.',
}) {
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    presetMessage,
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 group"
      aria-label="Chat with us on WhatsApp"
    >
      <div className="w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40 flex items-center justify-center text-white transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
        <MessageCircle className="w-7 h-7" />
      </div>
    </a>
  );
}
