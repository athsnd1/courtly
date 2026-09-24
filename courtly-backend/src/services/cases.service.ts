import { CaseStatus, NoteVisibility, TaskStatus } from "@prisma/client";
import prisma from "../config/prisma.config";
import supabase from "../config/supabase.config";
import { CaseSchemaType } from "../validators/case.validator";
import { TaskSchemaType } from "../validators/task.validator";
import { HearingData } from "../validators/hearing.validator";
import * as NotifService from "./notifications.service";


export async function createCase (clerkUserId: string, clerkOrgId: string, caseData: CaseSchemaType) {

    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
        }
    });

    const org = await prisma.organization.findUnique({
        where: {
            clerkOrgId
        }
    });

    if (!user || !org) {
        throw new Error("User or Organization not found");
    }

    const createdCase = await prisma.case.create({
        data: {
            caseNumber: caseData.caseNumber,
            title: caseData.title,
            type: caseData.type,
            status: "PENDING",
            description: caseData.description,
            
            orgId: org.id,
            createdBy: user.id,

            lawyers: {
                create: caseData.lawyerIds.map((lawyerId) => ({
                    lawyerId
                }))
            },

            caseParties: {
                create: caseData.caseParties.map((party) => ({
                    name: party.name,
                    type: party.type
                }))
            }
        },
        include: {
            lawyers: {
                include: {
                    lawyer: true
                }
            }
        }
    });

    await prisma.caseEvent.create({
        data: {
            caseId: createdCase.id,
            type: "CASE_CREATED",
            action: `Case created by ${user.name}`,
            createdBy: createdCase.createdBy
        }
    });

    await NotifService.createNotifs(clerkUserId, createdCase.id, "LAWYER_ASSIGNED", "New Case Assignment", `${user.name} assigned you to a case: ${createdCase.title}—${createdCase.caseNumber}`)

    return createdCase;

};

export async function getCase (caseId: string, userId: string) {

    const user = await prisma.user.findUnique({
        where: {
            clerkId: userId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const creatorName = user.name;

    const caseGotten = await prisma.case.findUnique({
        where: {
            id: caseId,
        },
        include: {
            lawyers: {
                include: {
                    lawyer: true
                }
            },
            caseParties: true,
            caseDocuments: {
                include: {
                    uploader: {
                        select: {
                            name: true
                        }
                    },
                    case: {
                        select: {
                            title: true
                        }
                    }
                }
            },
            caseNotes: {
                where: {
                    OR: [
                        {
                            visibility: "ORGANIZATION"
                        },
                        {
                            authorId: user.id
                        }
                    ]
                },
                include: {
                    author: true
                }
            },
            caseTasks: {
                include: {
                    assignee: true
                }
            },
            caseEvents: {
                include: {
                    case: {
                        select: {
                            title: true
                        }
                    },
                    eventCreator: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdBy: "desc"
                },
                take: 10
            },
            caseHearings: {
                include: {
                    hearingCreator: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    date: "desc"
                }
            }
        }
    });

    if (!caseGotten) {
        throw new Error("Case not found");
    }

    const org = await prisma.organization.findUnique({
        where: {
            id: caseGotten?.orgId
        }
    });

    const orgName = org?.name;

    return { caseGotten, creatorName, orgName, isCreator: caseGotten.createdBy === user.id }

};


export async function getAllCases(clerkOrgId: string, clerkUserId: string, orgRole: string, search: string) {

    const org = await prisma.organization.findUnique({
        where: {
            clerkOrgId
        }
    });

    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
        }
    });

    if (!org || !user) {
        throw new Error("Organization or User not found");
    }

    const searchFilters = search ? 
        {
            OR: [
                {
                    title: {
                        contains: search as string,
                        mode: "insensitive" as const
                    }
                },
                {
                    caseNumber: {
                        contains: search as string,
                        mode: "insensitive" as const
                    }
                }
            ]
        } : {};

    if (orgRole === "org:admin") {
        return await prisma.case.findMany({
            where: {
                orgId: org.id,
                ...searchFilters
            },
            include: {
                lawyers: {
                    include: {
                        lawyer: true
                    }
                },
                organization: true,
                creator: true
            }
        });
    } else {
        return await prisma.case.findMany({
            where: {
                orgId: org.id,
                lawyers: {
                    some: {
                        lawyerId: user.id
                    }
                },
                ...searchFilters
            },
            include: {
                lawyers: {
                    include: {
                        lawyer: true
                    }
                },
                organization: true,
                creator: true
            }
        });
    }

};

export async function deleteCase (caseId: string, clerkUserId: string) {

    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const caseToDelete = await prisma.case.findFirst({
        where: {
            id: caseId,
            createdBy: user.id
        },
        include: {
            caseDocuments: true
        }
    });

    if (!caseToDelete) {
        throw new Error("You are not allowed to delete this case");
    }

    const filePaths = caseToDelete.caseDocuments.map(
        (document) => document.path
    );

    if (filePaths.length > 0) {
        const { error } = await supabase.storage
            .from("case-documents")
            .remove(filePaths);

        if (error) {
            throw new Error("Failed to delete case documents");
        }
    }

    return await prisma.case.delete({
        where: {
            id: caseId
        }
    });

};

export async function changeCaseStatus (caseId: string, clerkUserId: string, status: string) {
    
    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const caseGotten = await prisma.case.findFirst({
        where: {
            id: caseId,
            createdBy: user.id
        }
    });

    if (!caseGotten) {
        throw new Error("Case not found");
    }

    if (!Object.values(CaseStatus).includes(status as CaseStatus)) {
        throw new Error("Invalid case status");
    }

    const initialStatus = caseGotten.status;

    const updatedCase = await prisma.case.update({
        where: {
            id: caseGotten.id
        },
        data: {
            status: status as CaseStatus
        }, 
        include: {
            lawyers: {
                include: {
                    lawyer: true
                }
            }
        }
    });

    await prisma.caseEvent.create({
        data: {
            caseId,
            type: "STATUS_CHANGED",
            action: `Case status changed from ${initialStatus} to ${status}`,
            createdBy: user.id
        }
    });

    await NotifService.createNotifs(clerkUserId, caseId, "STATUS_CHANGED", "Case Status Changed", `${user.name} changed the status of ${updatedCase.title} from ${initialStatus} to ${updatedCase.status}`)
};

export async function getDocuments (clerkUserId: string) {

    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const documents = await prisma.document.findMany({
        where: {
            case: {
                lawyers: {
                    some: {
                        lawyerId: user.id
                    }
                }
            }
        },
        include: {
            case: {
                select: {
                    title: true
                }
            },
            uploader: {
                select: {
                    name: true
                }
            }
        }
    });

    const recentDocs = await prisma.document.findMany({
        where: {
            case: {
                lawyers: {
                    some: {
                        lawyerId: user.id
                    }
                }
            }
        },
        include: {
            uploader: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            dateCreated: "desc"
        },
        take: 5
    })

    return { documents, recentDocs };
};

export async function addDocument (clerkUserId: string, caseId: string, docData: any) {

    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
        }
    });

    const caseGotten = await prisma.case.findUnique({
        where: {
            id: caseId
        },
        include: {
            lawyers: {
                include: {
                    lawyer: true
                }
            }
        }
    });

    if (!user || !caseGotten) {
        throw new Error("User or case not found");
    }

    const docCreated = await prisma.document.create({
        data: {
            caseId: caseGotten.id,
            uploadedBy: user.id,
            name: docData.fileName,
            type: docData.fileType,
            path: docData.filePath,
            size: docData.fileSize
        }
    });

    await prisma.caseEvent.create({
        data: {
            caseId: caseGotten.id,
            type: "DOCUMENT_UPLOADED",
            action: `Document added to case`,
            createdBy: user.id
        }
    });

    await NotifService.createNotifs(clerkUserId, caseId, "DOCUMENT_UPLOADED", "Document Upload", `${user.name} uploaded a document to the case: ${caseGotten.title}—${caseGotten.caseNumber}`)


    return docCreated;

};

export async function deleteDocument (clerkUserId: string, caseId: string, docId: string) {

    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const caseGotten = await prisma.case.findUnique({
        where: {
            id: caseId
        }
    });

    if (!caseGotten) {
        throw new Error("Case not found");
    };

    const docToDelete = await prisma.document.findFirst({
        where: {
            id: docId,
            caseId
        }
    });

    if (!docToDelete) {
        throw new Error("Document not found");
    };

    const { error } = await supabase.storage.from("case-documents").remove([docToDelete.path]);

    if (error) {
        throw new Error(error.message);
    }

    const docTitle = docToDelete.name;

    await prisma.document.delete({
        where: {
            id: docId
        }
    });

    await prisma.caseEvent.create({
        data: {
            caseId,
            type: "DOCUMENT_DELETED",
            action: `${user.name} deleted ${docTitle}`,
            createdBy: user.id
        }
    });

};

export async function getDocUrl (caseId: string, docId: string, download: string) {

    const document = await prisma.document.findUnique({
        where: {
            id: docId,
            caseId
        }
    });

    if (!document) {
        throw new Error("Document not found");
    }

    let supabaseError;
    let signedUrl;

    const shouldDownload = download === "true";

    if (shouldDownload) {
        const { data, error } = await supabase.storage
                                    .from("case-documents")
                                    .createSignedUrl(document.path, 60 * 5, {
                                        download: document.name
                                    });
        supabaseError = error?.message;
        signedUrl = data?.signedUrl;
    } else {
        const { data, error } = await supabase.storage
                                    .from("case-documents")
                                    .createSignedUrl(document.path, 60 * 5);
        supabaseError = error?.message;
        signedUrl = data?.signedUrl;
    }

    if (supabaseError) {
        throw new Error(supabaseError);
    }

    return signedUrl;
};

export async function createCaseNote (clerkUserId: string, caseId: string, note: string, visibility: string) {

    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const caseGotten = await prisma.case.findUnique({
        where: {
            id: caseId
        },
        include: {
            lawyers: {
                include: {
                    lawyer: true
                }
            }
        }
    });

    if (!caseGotten) {
        throw new Error("Case not found");
    }

    await prisma.note.create({
        data: {
            caseId,
            authorId: user.id,
            content: note,
            visibility: visibility as NoteVisibility
        }
    });

    await prisma.caseEvent.create({
        data: {
            caseId,
            type: "NOTE_ADDED",
            action: `Note added to case`,
            createdBy: user.id
        }
    });

    if (visibility === "ORGANIZATION") {
        await NotifService.createNotifs(user.clerkId, caseId, "NOTE_ADDED", "Note Added", `${user.name} added a new note to: ${caseGotten.title}`)
    }
};


export async function deleteCaseNote (clerkUserId: string, caseId: string, noteId: string) {

    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const caseGotten = await prisma.case.findUnique({
        where: {
            id: caseId
        }
    });

    if (!caseGotten) {
        throw new Error("Case not found");
    }

    const noteToDelete = await prisma.note.findUnique({
        where: {
            id: noteId
        }
    });

    if (user.id !== noteToDelete?.authorId) {
        throw new Error("User cannot delete this note");
    }

    await prisma.note.delete({
        where: {
            id: noteId
        }
    });

    await prisma.caseEvent.create({
        data: {
            caseId,
            type: "NOTE_DELETED",
            action: `Note deleted by ${user.name}`,
            createdBy: user.id
        }
    });
};

export async function createCaseTask (clerkUserId: string, caseId: string, taskData: TaskSchemaType) {

    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const caseGotten = await prisma.case.findUnique({
        where: {
            id: caseId
        }
    });

    if (!caseGotten) {
        throw new Error("Case not found");
    }

    const taskCreated = await prisma.task.create({
        data: {
            caseId,
            assignedTo: taskData.assignedTo,
            title: taskData.title,
            status: "TODO",
            dueDate: new Date(taskData.dueDate)
        },
        include: {
            assignee: true
        }
    });

    await prisma.caseEvent.create({
        data: {
            caseId,
            type: "TASK_ASSIGNED",
            action: `${user.name} assigned a task to ${taskCreated.assignee.name}`,
            createdBy: user.id
        }
    });

    await NotifService.createNotification(taskCreated.assignee.clerkId, caseId, "TASK_ASSIGNED", "Task Assignment", `You've been assigned a new task by ${user.name}`);

} 

export async function deleteCaseTask (clerkUserId: string, caseId: string, taskId: string) {

    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const caseGotten = await prisma.case.findUnique({
        where: {
            id: caseId
        },
        include: {
            caseTasks: {
                where: {
                    id: taskId
                },
                select: {
                    id: true
                }
            }
        }
    });

    if (!caseGotten) {
        throw new Error("Case not found");
    }

    if (caseGotten.caseTasks.length <= 0) {
        throw new Error("Task not found or does not belong to this case")
    }

    await prisma.task.delete({
        where: {
            id: taskId
        }
    });

    await prisma.caseEvent.create({
        data: {
            caseId,
            type: "TASK_DELETED",
            action: `Task removed from ${caseGotten.title}`,
            createdBy: user.id
        }
    });

};

export async function changeTaskStatus (clerkUserId: string, caseId: string, taskId: string, status: string) {

    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const caseGotten = await prisma.case.findFirst({
        where: {
            id: caseId,
            lawyers: {
                some: {
                    lawyerId: user.id
                }
            }
        }
    });

    if (!caseGotten) {
        throw new Error("Case not found or user not authorized");
    }

    if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
        throw new Error("Invalid status type");
    }

    const taskToUpdate = await prisma.task.findUnique({
        where: {
            id: taskId
        }
    });

    const initialStatus = taskToUpdate?.status;

    await prisma.task.update({
        where: {
            id: taskId,
            caseId
        },
        data: {
            status: status as TaskStatus
        }
    });

    await prisma.caseEvent.create({
        data: {
            caseId,
            type: "STATUS_CHANGED",
            action: `Task status changed from ${initialStatus} to ${status}`,
            createdBy: user.id
        }
    })
};

export async function getCaseActivities (clerkUserId: string) {

    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const [events, totalEvents, eventsByType] = await Promise.all([
        prisma.caseEvent.findMany({
                where: {
                case: {
                    lawyers: {
                        some: {
                            lawyerId: user.id
                        }
                    }
                }
            },
            include: {
                eventCreator: {
                    select: {
                        name: true
                    }
                },
                case: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                date: "desc"
            },
            take: 50
        }),

        prisma.caseEvent.count({
            where: {
                case: {
                    lawyers: {
                        some: {
                            lawyerId: user.id
                        }
                    }
                }
            },
        }),

        prisma.caseEvent.groupBy({
            by: ["type"],
            _count: {
                _all: true
            },
            where: {
                case: {
                    lawyers: {
                        some: {
                            lawyerId: user.id
                        }
                    }
                }
            },
        })
    ]);
    
    return { events, totalEvents, eventsByType };
};

export async function getCaseTasks (clerkUserId: string) {

    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
    }});

    if (!user) {
        throw new Error("User not found");
    }

    const tasks = await prisma.task.findMany({
        where: {
            case: {
                lawyers: {
                    some: {
                        lawyerId: user.id
                    }
                }
            }
        },
        include: {
            case: {
                select: {
                    title: true
                }
            },
            assignee: {
                select: {
                    name: true
                }
            }
        }
    });

    const tasksDue = await prisma.task.findMany({
        where: {
            case: {
                lawyers: {
                    some: {
                        lawyerId: user.id
                    }
                }
            }
        },
        orderBy: {
            dueDate: "desc"
        },
        take: 5
    });

    return { tasks, tasksDue }
};

export async function createHearing (clerkUserId: string, caseId: string, hearingData: HearingData) {

    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const caseToAdd = await prisma.case.findFirst({
        where: {
            id: caseId,
            lawyers: {
                some: {
                    lawyerId: user.id
                }
            }
        },
        include: {
            lawyers: {
                include: {
                    lawyer: true
                }
            }
        }
    });

    if (!caseToAdd) {
        throw new Error("User does not have access to this case");
    }

    const hearing = await prisma.hearing.create({
        data: {
            caseId,
            date: new Date(`${hearingData.date}T${hearingData.time}`),
            court: hearingData.court,
            createdBy: user.id,
            description: hearingData.description || null
        }
    });

    await prisma.caseEvent.create({
        data: {
            caseId: caseToAdd.id,
            type: "HEARING_SCHEDULED",
            action: `Hearing scheduled by ${user.name}`,
            createdBy: user.id
        }
    });

    await NotifService.createNotifs(clerkUserId, caseId, "HEARING_SCHEDULED", "New Hearing Scheduled", `${user.name} scheduled a new hearing for ${caseToAdd.title} on ${hearingData.date} at ${hearingData.time}`);

};

export async function deleteHearing (clerkUserId: string, caseId: string, hearingId: string) {

    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const relatedCase = await prisma.case.findFirst({
        where: {
            lawyers: {
                some: {
                    lawyerId: user.id
                }
            },
            caseHearings: {
                some: {
                    id: hearingId
                }
            }
        }
    });

    if (!relatedCase) {
        throw new Error("Case not found");
    }

    const deletedCaseId = relatedCase.id;

    await prisma.hearing.delete({
        where: {
            id: hearingId
        }
    });

    await prisma.caseEvent.create({
        data: {
            caseId: deletedCaseId,
            type: "HEARING_DELETED",
            action: `Hearing deleted by ${user.name}`,
            createdBy: user.id
        }
    });
};

export async function getHearings (clerkUserId: string) {
    
    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    return await prisma.hearing.findMany({
        where: {
            case: {
                lawyers: {
                    some: {
                        lawyerId: user.id
                    }
                }
            }
        },
        include: {
            hearingCreator: {
                select: {
                    name: true
                }
            },
            case: {
                select: {
                    title: true
                }
            }
        }
    });
};

export async function getData (clerkUserId: string) {

    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const [numCases, numHearings, numTasks, numDocs] = await Promise.all([
        prisma.case.count({
            where: {
                lawyers: {
                    some: {
                        lawyerId: user.id
                    }
                },
                status: "ACTIVE"
            }
        }),

        prisma.hearing.count({
            where: {
                case: {
                    lawyers: {
                        some: {
                            lawyerId: user.id
                        }
                    }
                },
                date: {
                    gte: new Date()
                }
            }
        }),

        prisma.task.count({
            where: {
                case: {
                    lawyers: {
                        some: {
                            lawyerId: user.id
                        }
                    }
                },
                status: "TODO"
            }
        }),

        prisma.document.count({
            where: {
                case: {
                    lawyers: {
                        some: {
                            lawyerId: user.id
                        }
                    }
                }
            }
        })

    ]);

    return { numCases, numHearings, numTasks, numDocs };
}