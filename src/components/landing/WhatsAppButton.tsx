import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site-contact";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Hi, I'm interested in luxury properties")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-[hsl(142,70%,40%)] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300"
    >
      <MessageCircle size={28} />
    </a>
  );
}
