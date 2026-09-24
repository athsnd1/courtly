

export function emailTemplate (to: string, subject: string, message: string) {
    
    return {
        from: "Courtly <onboarding@resend.dev>",
        to,
        subject,
        html: `
            <h1>${subject}</h1>

            <p>${message}</p>

            <p>Log in to courtly now to stay up to date.</p>
        ` 
    }
}