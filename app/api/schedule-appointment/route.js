import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT || 587),
  secure: process.env.EMAIL_SERVER_PORT == 465,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

async function verifyTransporter() {
  try {
    await transporter.verify();
    return true;
  } catch (err) {
    console.error("Nodemailer verification failed:", err);
    return false;
  }
}

export async function POST(req) {
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

    if (!(await verifyTransporter())) {
      return NextResponse.json(
        { success: false, message: "Email server configuration error." },
        { status: 500 }
      );
    }

    const lastName = doctorName.split(" ").pop();
    await transporter.sendMail({
      from: `"${patientName} via HealthX" <${process.env.EMAIL_FROM}>`,
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
    console.error("schedule-appointment POST:", error);
    return NextResponse.json(
      { success: false, message: `Failed to request appointment: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ success: true, bookedSlots: [] });
}
