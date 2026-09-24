import { resend } from "../config/resend.config";
import { emailTemplate } from "../templates/emailTemplate";
import { taskAssignedEmail } from "../templates/taskEmailTemplate";


export async function sendTaskEmail (to: string, caseName: string) {

    const email = taskAssignedEmail(caseName);

    return resend.emails.send({
        from: "Courtly <onboarding@resend.dev>",
        to,
        subject: email.subject,
        html: email.html
    });
};

export async function sendEmail (to: string, subject: string, message: string) {

    const email = emailTemplate(to, subject, message);

    return resend.emails.send(
        email
    );
};