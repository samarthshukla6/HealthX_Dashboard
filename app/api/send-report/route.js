import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const doctorEmail = formData.get("doctorEmail");
    const doctorName = formData.get("doctorName");
    const patientName = formData.get("patientName") || "Patient";
    const reportFile = formData.get("reportFile");

    if (!doctorEmail || !doctorName) {
      return NextResponse.json(
        { success: false, message: "Missing doctor email or name." },
        { status: 400 }
      );
    }
    if (!reportFile || typeof reportFile === "string" || !reportFile.name) {
      return NextResponse.json(
        { success: false, message: "Report file is missing or invalid." },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await reportFile.arrayBuffer());

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT || 587),
      secure: process.env.EMAIL_SERVER_PORT == 465,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    try {
      await transporter.verify();
    } catch {
      return NextResponse.json(
        { success: false, message: "Email server configuration error." },
        { status: 500 }
      );
    }

    const lastName = doctorName.split(" ").pop();
    await transporter.sendMail({
      from: `"${patientName} via HealthX" <${process.env.EMAIL_FROM}>`,
      to: doctorEmail,
      subject: `Consultation Report for ${patientName}`,
      text: `Dear Dr. ${lastName},\n\nPlease find the consultation report attached for ${patientName}.\n\nHealthX`,
      html: `<p>Dear Dr. ${lastName},</p><p>Please find the consultation report attached for ${patientName}.</p><p>HealthX</p>`,
      attachments: [
        {
          filename: reportFile.name,
          content: fileBuffer,
          contentType: reportFile.type || "application/octet-stream",
        },
      ],
    });

    return NextResponse.json({ success: true, message: "Report sent successfully!" });
  } catch (error) {
    console.error("send-report:", error);
    return NextResponse.json(
      { success: false, message: `Failed to process request: ${error.message}` },
      { status: 500 }
    );
  }
}
