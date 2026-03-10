import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919773740037?text=Hi%2C%20I%27m%20interested%20in%20luxury%20properties"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-[hsl(142,70%,40%)] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300"
    >
      <MessageCircle size={28} />
    </a>
  );
}
