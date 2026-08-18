"use client";

import { useState, useRef } from "react";
import { Send, Mail } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const doctors = [
  { id: 1, name: "Dr. Evelyn Reed", speciality: "Cardiology", avatarUrl: "/doctor1.jpeg", email: "work.sanskarjain@gmail.com" },
  { id: 2, name: "Dr. Marcus Chen", speciality: "Neurology", avatarUrl: "/doctor2.jpeg", email: "samarthshukla150604@gmail.com" },
  { id: 3, name: "Dr. Anya Sharma", speciality: "Pediatrics", avatarUrl: "/doctor3.jpeg", email: "anya.sharma@example.com" },
];

export default function MiniShareReport() {
  const [open, setOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const fileInputRef = useRef(null);

  const handlePickDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setFeedback(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedDoctor) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsSending(true);
    setFeedback(null);
    const formData = new FormData();
    formData.append("reportFile", file);
    formData.append("doctorEmail", selectedDoctor.email);
    formData.append("doctorName", selectedDoctor.name);

    try {
      const res = await fetch("/api/send-report", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Send failed");
      setFeedback({ type: "ok", text: `Sent to ${selectedDoctor.name.split(" ").pop()}` });
      setOpen(false);
    } catch (err) {
      setFeedback({ type: "err", text: err.message });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsSending(false);
    }
  };

  return (
    <div className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-white p-3 flex flex-col justify-between shadow-sm">
      <input ref={fileInputRef} type="file" accept=".pdf,.txt,.md" className="hidden" onChange={handleFileChange} />
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <Mail className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-900">Share Report</p>
          <p className="text-[10px] text-slate-500 truncate">Email PDF to doctor</p>
        </div>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            disabled={isSending}
            className="w-full mt-2 h-8 text-xs justify-center gap-1"
          >
            <Send className="h-3 w-3" />
            {isSending ? "Sending…" : "Choose doctor"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align="start">
          <p className="text-xs font-medium text-slate-700 px-1 mb-2">Select recipient</p>
          {doctors.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => handlePickDoctor(d)}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-left"
            >
              <img src={d.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
              <div>
                <p className="text-xs font-medium text-slate-900">{d.name}</p>
                <p className="text-[10px] text-slate-500">{d.speciality}</p>
              </div>
            </button>
          ))}
        </PopoverContent>
      </Popover>

      {feedback && (
        <p className={`text-[10px] mt-1 truncate ${feedback.type === "ok" ? "text-green-600" : "text-red-600"}`}>
          {feedback.text}
        </p>
      )}
    </div>
  );
}
