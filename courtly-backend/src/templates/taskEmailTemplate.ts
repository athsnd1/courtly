

export function taskAssignedEmail (caseName: string) {

    return {
        subject: "New Task Assignment",
        html:
        `
            <h2>Task Assigned</h2>
            <p>You've been assigned a new task in ${caseName}.</p>
            <p>Log in to Courtly to view the task.</p>
        `
    }
}