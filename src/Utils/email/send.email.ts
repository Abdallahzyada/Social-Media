import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { env } from "../../config/config.service";

export const sendEmail = async (data: Mail.Options): Promise<void> => {
  if (data.html && data.attachments?.length && data.text) {
    throw new Error("Missing email content!");
  }
  const transporter = createTransport({
    service:"gmail",
    auth:{
        user:env.EMAIL_USERNAME,
        pass:env.EMAIL_PASSWORD
    }
  })

  await transporter.sendMail({
    ...data,
    from:`"AZ social app" ${env.EMAIL_HOST}`,
    
  })
};
