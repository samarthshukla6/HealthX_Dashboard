import { NextResponse } from "next/server";
import {
  createEmailTransporter,
  verifyEmailTransporter,
  getEmailFromAddress,
} from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      doctorName,
      doctorEmail,
      doctorSpeciality,
      appointmentDate,
      appointmentTime,
      patientName = "A Patient",
    } = body;

    if (!doctorName || !doctorEmail || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (doctor, date, time)." },
        { status: 400 }
      );
    }

    const { transporter, configError } = createEmailTransporter();
    if (configError) {
      return NextResponse.json({ success: false, message: configError }, { status: 500 });
    }

    const verifyError = await verifyEmailTransporter(transporter!);
    if (verifyError) {
      return NextResponse.json({ success: false, message: verifyError }, { status: 500 });
    }

    const lastName = doctorName.split(" ").pop();
    await transporter!.sendMail({
      from: `"${patientName} via HealthX" <${getEmailFromAddress()}>`,
      to: doctorEmail,
      subject: `Appointment Request: ${patientName} - ${appointmentDate}`,
      text: `Dear Dr. ${lastName},\n\n${patientName} has requested an appointment.\n\nSpeciality: ${doctorSpeciality || "N/A"}\nDate: ${appointmentDate}\nTime: ${appointmentTime}\n\nPlease confirm or propose an alternative.\n\nHealthX`,
      html: `<h4>Appointment Request</h4>
        <p>Dear Dr. ${lastName},</p>
        <p><strong>${patientName}</strong> has requested an appointment.</p>
        <ul>
          <li><strong>Speciality:</strong> ${doctorSpeciality || "N/A"}</li>
          <li><strong>Date:</strong> ${appointmentDate}</li>
          <li><strong>Time:</strong> ${appointmentTime}</li>
        </ul>
        <p>Please confirm or propose an alternative.</p>`,
    });

    return NextResponse.json({ success: true, message: "Appointment request sent!" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("schedule-appointment:", message);
    return NextResponse.json(
      { success: false, message: `Failed to request appointment: ${message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ success: true, bookedSlots: [] });
}
