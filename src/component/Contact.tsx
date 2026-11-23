import { FaEnvelope, FaObjectGroup, FaUser } from "react-icons/fa";
import Input from "./Input";
import { BiPhone } from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
import { useTheme } from "../contexts/ThemeContext";
import { useContent } from "../contexts/content";
import { useToast } from "../contexts/toast";
import { sendContactMessage } from "../services/api";
import { track } from "../services/analytics";
import { useState } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "";

type Status = "idle" | "loading" | "success" | "error" | "empty";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website: string; // honeypot anti-spam
}

export default function Contact() {
  const { theme } = useTheme();
  const { contact } = useContent();
  const toast = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    website: "",
  });

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleChange = (name: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setStatus("empty");
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      await sendContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject,
        message: formData.message,
        website: formData.website,
      });

      // Envoi EmailJS en parallèle (si configuré dans .env et non-bot)
      if (!formData.website && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        try {
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              object: formData.subject,
              subject: formData.subject,
              message: formData.message,
            },
            EMAILJS_PUBLIC_KEY
          );
        } catch (emailErr) {
          console.warn("EmailJS warning:", emailErr);
        }
      }

      track("contact_form_sent");
      setStatus("success");
      toast.success("Message envoyé avec succès !");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Une erreur s'est produite.";
      setErrorMsg(msg);
      setStatus("error");
      toast.error(msg);
    }
  };

  return (
    <div
      className={`flex p-4 w-full gap-4 flex-col justify-center items-center ${
        theme === "dark" ? "bg-gray-900" : "bg-transparent"
      }`}
      id="contact"
    >
      <div className="text-center mb-12">
        <span className="text-sm font-semibold text-amber-500 uppercase tracking-wide">{contact.eyebrow}</span>
        <h2 className={`text-4xl md:text-5xl font-bold mt-2 mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          {contact.title}
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          {contact.description}
        </p>
      </div>

      <div
        className={`flex p-6 justify-center m-auto w-full md:w-[80%] flex-col md:flex-row rounded transition-all ${
          theme === "dark" ? "bg-gray-800/50 border border-gray-700/50" : "bg-white border border-gray-200"
        }`}
      >
        <div className="flex p-4 flex-col gap-4">
          <a
            href={`tel:${contact.phone.replace(/\s+/g, "")}`}
            onClick={() => track("phone_click")}
            className={`flex self-start gap-6 hover:text-amber-500 transition-colors ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
          >
            <BiPhone className="text-amber-500" size={25} />
            <span>{contact.phone}</span>
          </a>
          <a
            href={`mailto:${contact.email}`}
            onClick={() => track("email_click")}
            className={`flex self-start gap-6 hover:text-amber-500 transition-colors ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
          >
            <FaEnvelope className="text-amber-500" size={25} />
            <span>{contact.email}</span>
          </a>
          <div className={`flex self-start gap-6 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            <CiLocationOn className="text-amber-500" size={25} />
            <span>{contact.location}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="md:w-[50%] p-4 flex gap-4 flex-col">
          {/* Champ honeypot anti-spam */}
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={(e) => handleChange("website", e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <Input
            icons={<FaUser />}
            type="text"
            name="name"
            value={formData.name}
            placeholder="Nom complet"
            onChangeValue={(val: string) => handleChange("name", val)}
          />
          <Input
            icons={<FaEnvelope />}
            type="email"
            name="email"
            value={formData.email}
            placeholder="E-mail"
            onChangeValue={(val: string) => handleChange("email", val)}
          />
          <Input
            icons={<BiPhone />}
            type="tel"
            name="phone"
            value={formData.phone}
            placeholder="Téléphone (optionnel)"
            onChangeValue={(val: string) => handleChange("phone", val)}
          />
          <Input
            icons={<FaObjectGroup />}
            type="text"
            name="subject"
            value={formData.subject}
            placeholder="Objet"
            onChangeValue={(val: string) => handleChange("subject", val)}
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("message", e.target.value)}
            className={`h-40 p-2 rounded outline-none resize-none ${
              theme === "dark"
                ? "bg-gray-700 text-white placeholder-gray-400 border border-gray-600"
                : "bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300"
            }`}
            placeholder="Message..."
          />

          {status === "empty" && <p className="text-red-400 text-sm">Veuillez remplir tous les champs obligatoires.</p>}
          {status === "success" && <p className="text-green-400 text-sm">Message envoyé avec succès !</p>}
          {status === "error" && <p className="text-red-400 text-sm">{errorMsg || "Une erreur s'est produite. Réessaie plus tard."}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="p-3 bg-amber-400 hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors cursor-pointer"
          >
            {status === "loading" ? "Envoi en cours..." : contact.ctaLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
