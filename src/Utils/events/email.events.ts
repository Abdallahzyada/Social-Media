import { EventEmitter } from "node:events";
import Mail from "nodemailer/lib/mailer";
import { templet } from "../email/verify.email.templates";
import { sendEmail } from "../email/send.email";

export const emailEvents = new EventEmitter();

interface IEmail extends Mail.Options {
  otp: string;
  username: string;
}

emailEvents.on("confirmEmail", async (data: IEmail) => {
  try {
    data.subject = "Confirm Your email";
    data.html = templet(data.otp, data.username, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.error(`Failed to send email: ${error}`);
  }
});
