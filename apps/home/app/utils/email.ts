import * as nodemailer from "nodemailer";
import * as path from "path";
import { FreelancerAcceptanceEmailData } from "../types/type-email";
import { getAstraDB, ASTRA_KEYSPACES } from "../lib/db";

// Validate credentials
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS?.replace(/\s/g, ""); // Remove spaces from App Password

if (!emailUser || !emailPass) {
  console.warn("EMAIL_USER or EMAIL_PASS not set in environment variables.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

export async function sendFreelancerAcceptanceEmail(
  data: FreelancerAcceptanceEmailData
): Promise<void> {
  const fs = require("fs");
  let logoPath = path.join(process.cwd(), "public/assets/freelinkd-logo.svg");
  
  if (!fs.existsSync(logoPath)) {
     const altPath = path.join(process.cwd(), "apps/home/public/assets/freelinkd-logo.svg");
     if (fs.existsSync(altPath)) {
        logoPath = altPath;
     } else {
        console.warn("Logo file not found at:", logoPath);
     }
  }

  const currentYear = new Date().getFullYear();

  const mailOptions = {
    from: `"Freelinkd Team" <${process.env.EMAIL_USER || "noreply@freelinkd.com"}>`,
    to: data.freelancerEmail,
    attachments: [
      {
        filename: "freelinkd-logo.svg",
        path: logoPath,
        cid: "freelinkd-logo",
      },
    ],
    subject: "Welcome to Freelinkd - Your Registration is Approved!",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f0f4f8; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(8, 31, 92, 0.15);">
                
                <!-- Header with Logo -->
                <tr>
                  <td style="background: linear-gradient(135deg, #081f5c 0%, #1a3a8f 50%, #2d4ea3 100%); padding: 50px 40px; text-align: center;">
                    <div style="margin-bottom: 25px;">
                      <img src="cid:freelinkd-logo"
                           alt="Freelinkd"
                           style="height: 50px; width: auto;">
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                      Welcome Aboard!
                    </h1>
                    <p style="color: rgba(255,255,255,0.85); margin: 15px 0 0 0; font-size: 16px; font-weight: 400;">
                      Your journey as a Freelinkd Talent begins now
                    </p>
                  </td>
                </tr>

                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="font-size: 18px; line-height: 1.7; color: #1e293b; margin: 0 0 25px 0;">
                      Hello <strong style="color: #081f5c;">${data.freelancerName}</strong>,
                    </p>

                    <p style="font-size: 16px; line-height: 1.8; color: #475569; margin: 0 0 25px 0;">
                      Congratulations! After carefully reviewing your application, we're thrilled to inform you that you've been officially accepted as a <strong style="color: #081f5c;">Freelinkd Talent</strong>. Your skills and experience impressed us, and we believe you'll be a valuable addition to our community.
                    </p>

                    <!-- Credentials Card -->
                    <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 30px; border-radius: 16px; margin: 30px 0; border: 1px solid #e2e8f0;">
                      <div style="text-align: center; margin-bottom: 20px;">
                        <span style="background: linear-gradient(135deg, #ff6f00 0%, #ff9500 100%); color: #ffffff; font-size: 12px; font-weight: 700; padding: 8px 20px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px;">
                          Your Login Credentials
                        </span>
                      </div>
                      
                      <div style="background: #ffffff; padding: 25px; border-radius: 12px; border-left: 4px solid #ff6f00; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <table width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding: 10px 0;">
                              <span style="color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Email</span>
                              <p style="margin: 5px 0 0 0; font-size: 16px; color: #1e293b; font-weight: 600;">${data.freelancerEmail}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-top: 1px solid #f1f5f9;">
                              <span style="color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Temporary Password</span>
                              <p style="margin: 5px 0 0 0; font-size: 16px; color: #1e293b; font-weight: 600; font-family: 'Courier New', monospace; background: #fef3c7; padding: 8px 12px; border-radius: 6px; display: inline-block;">FreelinkdTalent</p>
                            </td>
                          </tr>
                        </table>
                      </div>

                      <p style="text-align: center; font-size: 12px; color: #94a3b8; margin: 15px 0 0 0;">
                        Please change your password after your first login
                      </p>
                    </div>

                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 35px 0;">
                      <a href="https://freelinkd.com/site/freelancer/login"
                         style="background: linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%); color: #ffffff; padding: 18px 45px; text-decoration: none; border-radius: 12px; font-weight: 700; display: inline-block; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 10px 30px rgba(255, 111, 0, 0.35); transition: all 0.3s ease;">
                        Access Your Dashboard →
                      </a>
                    </div>

                    <!-- What's Next Section -->
                    <div style="background: #fafbfc; padding: 25px; border-radius: 12px; margin: 30px 0;">
                      <h3 style="color: #1e293b; font-size: 16px; margin: 0 0 20px 0; font-weight: 600;">
                        What's Next?
                      </h3>
                      <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #475569;">
                            <span style="color: #10b981; font-weight: 700; margin-right: 10px;">1.</span>
                            Complete your profile with portfolio and skills
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #475569;">
                            <span style="color: #10b981; font-weight: 700; margin-right: 10px;">2.</span>
                            Browse available projects that match your expertise
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #475569;">
                            <span style="color: #10b981; font-weight: 700; margin-right: 10px;">3.</span>
                            Start connecting with clients and grow your career!
                          </td>
                        </tr>
                      </table>
                    </div>

                    <p style="font-size: 15px; line-height: 1.7; color: #475569; margin: 25px 0 0 0;">
                      We're excited to have you on board and can't wait to see the amazing work you'll accomplish. If you have any questions, our support team is always here to help.
                    </p>

                    <!-- Signature -->
                    <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0; color: #64748b; font-size: 14px;">Best regards,</p>
                      <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 600;">The Freelinkd Team</p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #1e293b; padding: 30px 40px; text-align: center;">
                    <p style="margin: 0 0 15px 0; color: #94a3b8; font-size: 13px;">
                      Need help? Contact us at 
                      <a href="mailto:support@freelinkd.com" style="color: #ff6f00; text-decoration: none; font-weight: 600;">support@freelinkd.com</a>
                    </p>
                    <div style="margin: 20px 0;">
                      <a href="#" style="display: inline-block; margin: 0 8px; color: #64748b; text-decoration: none; font-size: 12px;">Website</a>
                      <span style="color: #475569;">•</span>
                      <a href="#" style="display: inline-block; margin: 0 8px; color: #64748b; text-decoration: none; font-size: 12px;">LinkedIn</a>
                      <span style="color: #475569;">•</span>
                      <a href="#" style="display: inline-block; margin: 0 8px; color: #64748b; text-decoration: none; font-size: 12px;">Instagram</a>
                    </div>
                    <p style="margin: 20px 0 0 0; color: #64748b; font-size: 11px;">
                      © ${currentYear} Freelinkd. All rights reserved.<br>
                      This is an automated message, please do not reply directly.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      "✅ Freelancer acceptance email sent successfully to:",
      data.freelancerEmail
    );
  } catch (error) {
    console.error("❌ Error sending freelancer acceptance email:", error);
    throw error;
  }
}

/**
 * Get Freelancer Collection from AstraDB
 * Helper function to access the freelancer_form collection
 */
async function getFreelancerCollection() {
  const db = getAstraDB();
  const collection = db.getCollectionFromKeyspace(
    ASTRA_KEYSPACES.FREELANCER,
    "freelancer_form"
  ) as any;
  return collection;
}

/**
 * Send Freelancer Acceptance Email by ID
 * Fetches freelancer data from database and sends acceptance email
 */
export async function sendFreelancerAcceptanceEmailById(
  freelancerId: string
): Promise<void> {
  try {
    const collection = await getFreelancerCollection();
    const freelancerData = await collection.findOne({ _id: freelancerId });

    if (!freelancerData) {
      throw new Error(`Freelancer with ID ${freelancerId} not found`);
    }

    const freelancerName =
      freelancerData.name || freelancerData.nama || "Freelancer";
    const freelancerEmail = freelancerData.email;

    if (!freelancerEmail) {
      throw new Error(`Email not found for freelancer ${freelancerId}`);
    }

    const emailData: FreelancerAcceptanceEmailData = {
      freelancerName,
      freelancerEmail,
      projectName: "",
      acceptanceMessage: "",
      companyName: "Freelinkd Team",
    };

    await sendFreelancerAcceptanceEmail(emailData);
  } catch (error) {
    console.error("Error sending freelancer acceptance email by ID:", error);
    throw error;
  }
}

async function createFreelancerAccount(freelancerData: any): Promise<void> {
  const db = getAstraDB();
  const collection = db.getCollectionFromKeyspace(
    ASTRA_KEYSPACES.FREELANCER,
    "data_freelancer"
  ) as any;

  const defaultPassword = "FreelinkdTalent";

  const accountData = {
    name: freelancerData.name,
    email: freelancerData.email,
    phone: freelancerData.phone || "",
    password: defaultPassword,
    skills: freelancerData.skills || "",
    address: freelancerData.address || "",
    status: "active",
    rank: "Classic",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    formId: freelancerData._id,
  };

  await collection.insertOne(accountData);
  console.log("Freelancer account created for:", freelancerData.email);
}

async function updateFreelancerFormStatus(
  freelancerId: string,
  status: string
): Promise<void> {
  const collection = await getFreelancerCollection();
  await collection.updateOne(
    { _id: freelancerId },
    { $set: { status, updatedAt: new Date().toISOString() } }
  );
}

/**
 * Approve Freelancer by ID
 * Complete workflow: update status, create account, send email
 */
export async function approveFreelancerById(
  freelancerId: string
): Promise<void> {
  try {
    const collection = await getFreelancerCollection();
    const freelancerData = await collection.findOne({ _id: freelancerId });

    if (!freelancerData) {
      throw new Error(`Freelancer with ID ${freelancerId} not found`);
    }

    // Update status to approved
    await updateFreelancerFormStatus(freelancerId, "approved");
    console.log(`✅ Freelancer status updated to 'approved'`);

    // Create freelancer account
    await createFreelancerAccount(freelancerData);

    // Send acceptance email
    await sendFreelancerAcceptanceEmailById(freelancerId);

    console.log(`🎉 Freelancer ${freelancerData.email} successfully approved!`);
  } catch (error) {
    console.error("❌ Error approving freelancer:", error);
    throw error;
  }
}

/**
 * Reject Freelancer by ID
 * Updates status to rejected (can be extended to send rejection email)
 */
export async function rejectFreelancerById(
  freelancerId: string,
  reason?: string
): Promise<void> {
  try {
    const collection = await getFreelancerCollection();
    const freelancerData = await collection.findOne({ _id: freelancerId });

    if (!freelancerData) {
      throw new Error(`Freelancer with ID ${freelancerId} not found`);
    }

    // Update status to rejected
    await collection.updateOne(
      { _id: freelancerId },
      {
        $set: {
          status: "rejected",
          rejectionReason: reason || "",
          updatedAt: new Date().toISOString(),
        },
      }
    );

    console.log(`❌ Freelancer ${freelancerData.email} has been rejected`);
  } catch (error) {
    console.error("❌ Error rejecting freelancer:", error);
    throw error;
  }
}
