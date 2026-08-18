import { NextResponse } from "next/server";
import {
  createEmailTransporter,
  verifyEmailTransporter,
  getEmailFromAddress,
} from "@/lib/email";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const doctorEmail = formData.get("doctorEmail") as string | null;
    const doctorName = formData.get("doctorName") as string | null;
    const patientName = (formData.get("patientName") as string | null) || "Patient";
    const reportFile = formData.get("reportFile");

    if (!doctorEmail || !doctorName) {
      return NextResponse.json(
        { success: false, message: "Missing doctor email or name." },
        { status: 400 }
      );
    }

    if (!reportFile || typeof reportFile === "string" || !("arrayBuffer" in reportFile)) {
      return NextResponse.json(
        { success: false, message: "Report file is missing or invalid." },
        { status: 400 }
      );
    }

    const file = reportFile as File;
    const { transporter, configError } = createEmailTransporter();
    if (configError) {
      return NextResponse.json({ success: false, message: configError }, { status: 500 });
    }

    const verifyError = await verifyEmailTransporter(transporter!);
    if (verifyError) {
      return NextResponse.json({ success: false, message: verifyError }, { status: 500 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const lastName = doctorName.split(" ").pop();

    await transporter!.sendMail({
      from: `"${patientName} via HealthX" <${getEmailFromAddress()}>`,
      to: doctorEmail,
      subject: `Consultation Report for ${patientName}`,
      text: `Dear Dr. ${lastName},\n\nPlease find the consultation report attached for ${patientName}.\n\nHealthX`,
      html: `<p>Dear Dr. ${lastName},</p><p>Please find the consultation report attached for ${patientName}.</p><p>HealthX</p>`,
      attachments: [
        {
          filename: file.name,
          content: fileBuffer,
          contentType: file.type || "application/octet-stream",
        },
      ],
    });

    return NextResponse.json({ success: true, message: "Report sent successfully!" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("send-report:", message);
    return NextResponse.json(
      { success: false, message: `Failed to send report: ${message}` },
      { status: 500 }
    );
  }
}
