import { useNavigate, useParams } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import getCase from "@/api/getCase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HiArchive, HiDocumentText } from "react-icons/hi";
import { GiGreekTemple } from "react-icons/gi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LuActivity, LuArchive, LuArrowLeft, LuCalendar, LuCircleCheck, LuFileText, LuLockKeyhole, LuMessageSquare, LuPenLine, LuPlus, LuTrash2, LuUpload, LuUser} from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import uploadFileToDb from "@/api/uploadFileToDb";
import { useSupabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import formatDate from "@/lib/formatDate";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import viewDocument from "@/api/viewDocument";
import downloadDocument from "@/api/downloadDocument";
import changeCaseStatus from "@/api/changeCaseStatus";
import type { Task, Case, Note, Hearing } from "@/types/case.type";
import deleteCase from "@/api/deleteCase";
import type { DocType } from "@/types/doc.type";
import type { CaseNote } from "@/types/note.type";
import createCaseNote from "@/api/createCaseNote";
import { deleteCaseNote } from "@/api/deleteCaseNote";
import type { TaskData } from "@/types/task.type";
import { createCaseTask } from "@/api/createCaseTask";
import { deleteCaseTask } from "@/api/deleteCaseTask";
import { changeTaskStatus } from "@/api/changeTaskStatus";
import { Button } from "@/components/ui/button";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import DataTable from "@/components/DataTable";
import { caseDocumentColumns } from "@/components/tables/case-document-columns";
import NoCases from "@/components/NoCases";
import { useForm } from "react-hook-form";
import { type HearingData, hearingSchema } from "@/validators/hearing.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import createHearing from "@/api/createHearing";
import deleteCaseHearing from "@/api/deleteCaseHearing";

const EventColorMappings = {
  CASE_CREATED: "text-blue-500 bg-blue-50 border-blue-500",
  LAWYER_ASSIGNED: "text-purple-500 bg-purple-50 border-purple-500",
  TASK_ASSIGNED: "text-orange-500 bg-orange-50 border-orange-500",
  TASK_DELETED: "text-red-500 bg-red-50 border-red-500",
  STATUS_CHANGED: "text-yellow-600 bg-yellow-50 border-yellow-600",
  HEARING_SCHEDULED: "text-cyan-500 bg-cyan-50 border-cyan-500",
  DOCUMENT_UPLOADED: "text-green-500 bg-green-50 border-green-500",
  DOCUMENT_DELETED: "text-red-500 bg-red-50 border-red-500",
  NOTE_ADDED: "text-indigo-500 bg-indigo-50 border-indigo-500",
  NOTE_DELETED: "text-red-500 bg-red-50 border-red-500",
};

const PartyColorMappings = {
  PLAINTIFF: "text-blue-600 bg-blue-50 border-blue-500",
  DEFENDANT: "text-red-600 bg-red-50 border-red-600",
  CLAIMANT: "text-indigo-600 bg-indigo-50 border-indigo-600",
  RESPONDENT: "text-orange-600 bg-orange-50 border-orange-600",
  APPELLANT: "text-purple-600 bg-purple-50 border-purple-600",
  APPELLEE: "text-pink-600 bg-pink-50 border-pink-600",
  PETITIONER: "text-cyan-600 bg-cyan-50 border-cyan-600",
  WITNESS: "text-yellow-600 bg-yellow-50 border-yellow-600",
  VICTIM: "text-rose-600 bg-rose-50 border-rose-600",
  ACCUSED: "text-red-600 bg-red-50 border-red-600",
  COMPLAINANT: "text-teal-600 bg-teal-50 border-teal-600",
  INTERVENOR: "text-violet-600 bg-violet-50 border-violet-600",
  THIRD_PARTY: "text-amber-600 bg-amber-50 border-amber-600",
  OTHER: "text-gray-600 bg-gray-50 border-gray-600",
};


export default function CaseInfoPage() {

  const navigate = useNavigate();

  const { id: caseId } = useParams();

  const [docToDelete, setDocToDelete] = useState<DocType | null>(null);
  const [caseToDelete, setCaseToDelete] = useState<Case | null>(null);

  const [noteData, setNoteData] = useState<CaseNote>({ note: "", visibility: "PRIVATE" });
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const [taskData, setTaskData] = useState<TaskData>({ title: "", assignedTo: "", dueDate: "" });
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [hearingToDelete, setHearingToDelete] = useState<Hearing | null>(null);

  const { data: caseData, isPending, isError, error } = useQuery({
    queryKey: ["case", caseId],
    queryFn: () => getCase(caseId!),
    enabled: !!caseId
  });

  useEffect(() => {
    if (isError && error) {
      toast.error(error.message || 'Something went wrong!');
    }
  }, [isError, error]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allowedTypes = [
    "application/pdf",

    // Word
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    // Excel
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    // PowerPoint
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    // Images
    "image/jpeg",
    "image/png",
  ];

  const MAX_FILE_SIZE = 25 * 1024 * 1024;

  const queryClient = useQueryClient();

  const uploadFileMutation = useMutation({
    mutationFn: uploadFileToDb,

    onMutate: () => {
      const toastId = toast.loading("Uploading file...");
      return { toastId };
    },

    onError: (_error, _variables, context) => { 
      toast.error("Failed to upload document", { id: context?.toastId }); 
    },

    onSuccess: (_data, _variables, context) => {
      toast.success("Document uploaded successfully", { id: context?.toastId });
      queryClient.invalidateQueries({
        queryKey: ["case", caseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["docs"],
      });
      queryClient.invalidateQueries({
        queryKey: ["activities"]
      });
      queryClient.invalidateQueries({
        queryKey: ["data"]
      });
     }
  });

  const supabase = useSupabase();

  async function uploadFile (e: React.ChangeEvent<HTMLInputElement>) {

    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("File type not allowed");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File must be less thatn 25MB");
      return;
    }
  
    const filePath = `${caseId}/${crypto.randomUUID()}-${selectedFile.name}`;

    const { error } = await supabase.storage
                      .from("case-documents")
                      .upload(filePath, selectedFile);

    if (error) {
      console.error("Supabase upload error:", error);
      toast.error("Upload failed");
      return;
    }

    uploadFileMutation.mutate({ fileName: selectedFile.name, fileType: selectedFile.type, filePath, caseId: caseId!, fileSize: selectedFile.size });

  };

  async function deleteDoc (docId: string) {
    return await api.delete(`/cases/${caseId}/documents/${docId}`);
  };

  const deleteDocMutation = useMutation({
    mutationFn: deleteDoc,

    onMutate: () => {
      const toastId = toast.loading("Deleting document...");

      return { toastId };
    },

    onSuccess: (_data, _variables, context) => {
      setDocToDelete(null);
      toast.success("Document deleted successfully", { id: context?.toastId});
      queryClient.invalidateQueries({
        queryKey: ["case", caseId]
      });
      queryClient.invalidateQueries({
        queryKey: ["docs"]
      });
      queryClient.invalidateQueries({
        queryKey: ["activities"]
      });
      queryClient.invalidateQueries({
        queryKey: ["data"]
      });
    },

    onError: (_error, _variables, context) => {
      setDocToDelete(null);
      toast.error("Failed to delete document", { id: context?.toastId });
    }
  });

  const updateCaseStatusMutation = useMutation({
    mutationFn: changeCaseStatus,

    onMutate: () => {
      const toastId = toast.loading("Changing case status...");
      return { toastId };
    },

    onError: (_error, _variables, context) => { 
      toast.error("Failed to update case status", { id: context?.toastId })
    },

    onSuccess: (_data, _variables, context) => { 
      toast.success("Case status updated successfully", { id: context?.toastId});
      queryClient.invalidateQueries({
        queryKey: ["case", caseId]
      });
      queryClient.invalidateQueries({
        queryKey: ["activities"]
      });
      queryClient.invalidateQueries({
        queryKey: ["data"]
      });
    }
  });

  const deleteCaseMutation = useMutation({
    mutationFn: deleteCase,

    onMutate: () => {
      const toastId = toast.loading("Deleting case...");
      return { toastId }
    },

    onError: (_error, _variables, context) => {
      setCaseToDelete(null);
      toast.error("Failed to delete case", { id: context?.toastId });
    },

    onSuccess: (_data, _variables, context) => {
      setCaseToDelete(null);
      toast.success("Case deleted successfully", { id: context?.toastId });
      navigate("/dashboard/cases");
      queryClient.invalidateQueries({
        queryKey: ["cases"]
      });
      queryClient.invalidateQueries({
        queryKey: ["activities"]
      });
      queryClient.invalidateQueries({
        queryKey: ["data"]
      });
    }
  });


  const createNoteMutation = useMutation({
    mutationFn: createCaseNote,

    onMutate: () => {
      const toastId = toast.loading("Creating case note...");
      return { toastId };
    },

    onError: (_error, _variables, context) => {
      toast.error("Failed to create note", { id: context?.toastId });
    }, 

    onSuccess: (_data, _variables, context) => {
      toast.success("Note created successfully", { id: context?.toastId });
      queryClient.invalidateQueries({
        queryKey: ["case", caseId]
      });
      queryClient.invalidateQueries({
        queryKey: ["activities"]
      });
      setNoteData({ note: "", visibility: "PRIVATE"});
    }
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteCaseNote,

    onMutate: () => {
      const toastId = toast.loading("Deleting case note...");
      return { toastId };
    },

    onError: (_error, _variables, context) => {
      setNoteToDelete(null);
      toast.error("Failed to delete case note", { id: context?.toastId });
    },

    onSuccess: (_data, _variables, context) => {
      setNoteToDelete(null);
      toast.success("Note deleted successfully", { id: context?.toastId });
      queryClient.invalidateQueries({
        queryKey: ["case", caseId]
      });
      queryClient.invalidateQueries({
        queryKey: ["activities"]
      });
    }
  });

  const createTaskMutation = useMutation({
    mutationFn: createCaseTask,

    onMutate: () => {
      const toastId = toast.loading("Creating task...");
      return { toastId };
    },

    onError: (_error, _variables, context) => {
      toast.error("Failed to create task", { id: context?.toastId });
    },

    onSuccess: (_data, _variables, context) => {
      toast.success("Task created succesfully", { id: context?.toastId });
      setTaskData({ title: "", assignedTo: "", dueDate: "" });
      queryClient.invalidateQueries({
        queryKey: ["case", caseId]
      });
      queryClient.invalidateQueries({
        queryKey: ["activities"]
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks"]
      });
      queryClient.invalidateQueries({
        queryKey: ["data"]
      });
    }

  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteCaseTask,

    onMutate: () => {
      const toastId = toast.loading("Deleting task...");
      return { toastId };
    },

    onError: (_error, _variables, context) => {
      setTaskToDelete(null);
      toast.error("Failed to delete task", { id: context?.toastId });
    },

    onSuccess: (_data, _variables, context) => {
      setTaskToDelete(null)
      toast.success("Task deleted succesfully", { id: context?.toastId });
      queryClient.invalidateQueries({
        queryKey: ["case", caseId]
      });
      queryClient.invalidateQueries({
        queryKey: ["activities"]
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks"]
      });
      queryClient.invalidateQueries({
        queryKey: ["data"]
      });
    }
  });

  const changeTaskStatusMutation = useMutation({
    mutationFn: changeTaskStatus,

    onMutate: () => {
      const toastId = toast.loading("Changing task status...");
      return { toastId };
    },

    onError: (_error, _variables, context) => {
      toast.error("Failed to change task status", { id: context?.toastId });
    },

    onSuccess: (_data, _variables, context) => {
      toast.success("Task status changed successfully", { id: context?.toastId });
      queryClient.invalidateQueries({
        queryKey: ["case", caseId]
      });
      queryClient.invalidateQueries({
        queryKey: ["activities"]
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks"]
      });
      queryClient.invalidateQueries({
        queryKey: ["data"]
      });
    }
  });

  const { register: hearingRegister, handleSubmit: hearingSubmitHandler, formState: { errors: hearingErrors }, reset } = useForm<HearingData>({
    resolver: zodResolver(hearingSchema),
  });

  const createHearingMutation = useMutation({
    mutationFn: createHearing,

    onMutate: () => {
      const toastId = toast.loading("Adding hearing...");
      return { toastId };
    },

    onError: (_error, _variables, context) => {
      toast.error("Failed to add hearing", { id: context?.toastId });
    },

    onSuccess: (_data, _variables, context) => {
      toast.success("Hearing added successfully", { id: context?.toastId });
      reset({
        court: "",
        date: "",
        time: "",
        description: ""
      });
      queryClient.invalidateQueries({
        queryKey: ["case", caseId]
      });
      queryClient.invalidateQueries({
        queryKey: ["hearings"]
      });
      queryClient.invalidateQueries({
        queryKey: ["data"]
      });
    }
  });

  const deleteHearingMutation = useMutation({
    mutationFn: deleteCaseHearing,

    onMutate: () => {
      const toastId = toast.loading("Deleting hearing...");
      return { toastId };
    },

    onError: (_error, _variables, context) => {
      setHearingToDelete(null);
      toast.error("Failed to delete hearing", { id: context?.toastId });
    },

    onSuccess: (_data, _variables, context) => {
      setHearingToDelete(null)
      toast.success("Hearing deleted succesfully", { id: context?.toastId });
      queryClient.invalidateQueries({
        queryKey: ["case", caseId]
      });
      queryClient.invalidateQueries({
        queryKey: ["activities"]
      });
      queryClient.invalidateQueries({
        queryKey: ["hearings"]
      });
      queryClient.invalidateQueries({
        queryKey: ["data"]
      });
    }
  });
  


  async function onHearingFormSubmit (data: HearingData) {
    createHearingMutation.mutate({ hearingData: data, caseId: caseId! });
  }

  if (isPending) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage errorText={error.message}/>;
  }

  return (
    <div className="w-full h-full pb-20">

      {
        docToDelete && 
        <ConfirmationDialog 
        closeDialogFunc={() => {setDocToDelete(null)}} 
        dialogActionFunc={() => {deleteDocMutation.mutate(docToDelete.id)}} actionText="Are you sure you want to delete this document?" firstBtnText="Delete Doc" 
        secBtnText="Cancel"
          />
      }

      {
        caseToDelete &&
        <ConfirmationDialog 
        closeDialogFunc={() => {setCaseToDelete(null)}} 
        dialogActionFunc={() => {deleteCaseMutation.mutate(caseToDelete.id)}} actionText="Are you sure you want to delete this case?" firstBtnText="Delete Case" 
        secBtnText="Cancel"
          />
      }

      {
        noteToDelete &&
        <ConfirmationDialog 
        closeDialogFunc={() => {setNoteToDelete(null)}} 
        dialogActionFunc={() => {deleteNoteMutation.mutate({ caseId: caseId as string, noteId: noteToDelete.id})}} actionText="Are you sure you want to delete this note?" firstBtnText="Delete Note" 
        secBtnText="Cancel"
          />
      }

      {
        taskToDelete &&
        <ConfirmationDialog 
        closeDialogFunc={() => {setTaskToDelete(null)}} 
        dialogActionFunc={() => {deleteTaskMutation.mutate({ caseId: caseId as string, taskId: taskToDelete.id})}} actionText="Are you sure you want to delete this task?" firstBtnText="Delete Task" 
        secBtnText="Cancel"
          />
      }

      {
        hearingToDelete &&
        <ConfirmationDialog 
        closeDialogFunc={() => {setHearingToDelete(null)}} 
        dialogActionFunc={() => {deleteHearingMutation.mutate({caseId: caseId as string, hearingId: hearingToDelete.id})}} actionText="Are you sure you want to delete this hearing?" firstBtnText="Delete Hearing" 
        secBtnText="Cancel"
          />
      }

      <div className="w-full flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">

            <div className="font-sora text-navy text-xl">
              <span className="text-sm">Case:</span> {caseData?.caseGotten.caseNumber} — {caseData?.caseGotten.title}
            </div>

            <span className={`shrink-0 py-1 px-2 rounded-full font-jet text-xs border-1 ${caseData?.caseGotten.status === "PENDING" ? "bg-pending-bg text-pending border-pending" : caseData?.caseGotten.status === "ACTIVE" ? "bg-active-bg text-active border-active" : "bg-closed-bg text-closed border-closed"}`}>{caseData?.caseGotten.status}</span>
          </div>

          <div className="text-sec-text font-sora text-sm">Here's what's happening with your case</div>
        </div>

        <Button className="bg-navy font-sora h-[40px] hover:bg-sec-navy hover:scale-99 cursor-pointer hover:opacity-95" onClick={() => {navigate("/dashboard/cases")}}>
          <LuArrowLeft />
          <span>Go Back</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 w-full h-full gap-4">

        <div className="flex flex-col gap-2 w-full h-full">

            <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between flex-wrap gap-3 border-1 border-border w-full mt-6 bg-cards rounded-md p-3">
            <div className="flex flex-col gap-1">

              <div className="flex items-center gap-1">
                <HiDocumentText className="text-icon-green"/> 
                <span className="text-sm text-navy font-sora">Case Type</span>
              </div>

              <span className="ml-5 font-jet text-navy">{caseData?.caseGotten.type}</span>

            </div>

            <div className="flex flex-col gap-1">

              <div className="flex items-center gap-1">
                <BiUser className="text-logo"/> 
                <span className="text-sm text-navy font-sora">Created By</span>
              </div>

              <span className="ml-5 font-jet text-navy">{caseData?.creatorName}</span>

            </div>

            <div className="flex flex-col gap-1">

              <div className="flex items-center gap-1">
                <GiGreekTemple className="text-pending"/> 
                <span className="text-sm text-navy font-sora">Organization</span>
              </div>

              <span className="ml-5 font-jet text-navy">{caseData?.orgName}</span>

            </div>
          </div>

          <div className="w-full mt-4 bg-cards border border-border rounded-md overflow-hidden h-max p-4">

          {/* Lawyers */}
          <div className="flex items-center h-max">
            <h2 className="font-sora text-navy w-full">Assigned Lawyers</h2>
          </div>

          <div className="mt-2 mb-2 w-full h-max max-w-full overflow-x-auto border-1 border-border rounded-md max-h-[350px] overflow-y-auto">
            <Table className="h-max">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-gray-500 font-sora">Lawyer</TableHead>
                  <TableHead className="text-gray-500 font-sora">Email</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="h-max">
                {caseData?.caseGotten.lawyers.map((item: any) => (
                  <TableRow key={item.lawyerId} className="h-max">
                    <TableCell className="font-sora text-navy">
                      {item.lawyer.name}
                    </TableCell>

                    <TableCell className="font-sora text-gray-700">
                      {item.lawyer.email}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Parties */}
          <div className="border-t-1 border-border mt-6 pt-4">
            <h2 className="font-sora text-navy w-full">Case Parties</h2>
          </div>

          <div className="mt-2 mb-2 w-full h-max max-w-full overflow-x-auto border-1 border-border rounded-md max-h-[350px] overflow-y-auto">
            <Table className="w-full h-full">
              <TableHeader className="sticky top-0 ">
                <TableRow className="bg-gray-100">
                  <TableHead className="text-gray-500 font-sora">Name</TableHead>
                  <TableHead className="text-gray-500 font-sora">Role</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {caseData?.caseGotten.caseParties.map((party: any) => (
                  <TableRow key={party.id}>
                    <TableCell className="font-sora text-navy">
                      {party.name}
                    </TableCell>

                    <TableCell>
                      <span className={`inline-flex px-2 rounded-full ${PartyColorMappings[party.type]} border border-border font-jet text-xs text-navy`}>
                        {party.type}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

        </div>

          {/* Documents */}
          <div className="flex flex-col bg-cards border-1 border-border w-full rounded-md mt-4 p-4 max-h-[350px] overflow-y-auto">

            <div className="flex items-center justify-between w-full">
              <div className="font-sora text-navy">Documents</div>
              
              <button className="max-w-[109px] bg-sec-navy font-jet hover:opacity-95 hover:scale-99 cursor-pointer text-white transition-all justify-center rounded-md py-1 px-3 text-sm flex items-center gap-1 disabled:bg-gray-400" onClick={() => {fileInputRef.current!.click()}} disabled={caseData?.caseGotten.status === "CLOSED"}>
                <LuUpload /> <span>Upload</span>
                <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => {uploadFile(e)}} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"/>
              </button>

            </div>

            {caseData?.caseGotten.caseDocuments.length <= 0 ?
            (<div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4"> 
                <NoCases textToShow="You haven't added any documents yet" Icon={HiArchive}/>
              </div>
            ) : <DataTable
            columns={caseDocumentColumns(
              caseId as string,
              viewDocument,
              downloadDocument,
              setDocToDelete
            )}
            data={caseData?.caseGotten.caseDocuments ?? []}
          />}

          </div>

          {/* Recent Activity */}
          <div className="flex flex-col bg-cards border-1 border-border p-4 w-full h-max rounded-md mt-4">
              <div className="font-sora text-navy">Recent Activity</div>

              {caseData?.caseGotten.caseDocuments.length <= 0 ?
                (<div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4"> 
                    <NoCases textToShow="No recent activity to report" Icon={LuActivity}/>
                  </div>
                ) : <div className="mt-6 border-1 border-border rounded-md w-full h-full max-h-[300px] max-w-full overflow-x-auto">
                <Table >
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-gray-100 font-sora">
                      <TableHead className="text-gray-500">Date</TableHead>
                      <TableHead className="text-gray-500">User</TableHead>
                      <TableHead className="text-gray-500">Related Case</TableHead>
                      <TableHead className="text-gray-500">Action Type</TableHead>
                      <TableHead className="text-gray-500">Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {caseData?.caseGotten.caseEvents.map((eventItem) => (
                      <TableRow key={eventItem.id} className="p-4">
                        
                        <TableCell className="text-gray-800 font-sora p-3">{formatDate(eventItem.date)}</TableCell>

                        <TableCell className="text-gray-800 font-sora">
                          <div className="font-sora text-gray-800 flex items-center gap-1">
                            <LuUser />
                            <span>{eventItem.eventCreator.name}</span>
                          </div>
                        </TableCell>

                        <TableCell className="text-gray-800 font-sora">
                          {eventItem.case.title}
                        </TableCell>

                        <TableCell className="text-gray-800 font-jet">
                          <span className={`rounded-full px-3 py-1 ${EventColorMappings[eventItem.type]} border-1 border-border`}>{eventItem.type}</span>
                        </TableCell>

                        <TableCell className="text-gray-800 font-sora max-w-prose whitespace-normal">
                          {eventItem.action}
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>}

          </div>

          {/* Hearings */}
          <div className="flex flex-col bg-cards border-1 border-border p-4 w-full h-max rounded-md">

            <div className="font-sora text-navy">Upcoming Hearings</div>

            <div className="flex flex-col gap-1 w-full overflow-y-auto max-h-[200px] mt-4 rounded-md mb-4">

              { caseData?.caseGotten.caseHearings <= 0 ? (<div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4"> 
                <NoCases textToShow="No hearings to look forward to" Icon={GiGreekTemple}/>
              </div>
            ) : caseData?.caseGotten.caseHearings.map((hearing: Hearing) => (
                <div key={hearing.id} className={`flex gap-2 mt-1 pb-2 pl-3 relative before:absolute before:h-full before:left-1 ${new Date(hearing.date).getDay() === new Date().getDay() ? "before:bg-red-500" : "before:bg-icon-green"}  before:w-[3px] before:rounded-full`}>

                  <div className="flex flex-col gap-1">

                    <div className="font-sora w-full text-navy text-sm">{hearing.description || "No description provided for this hearing"}</div>
                    
                    <div className="w-full flex items-center gap-1"> 
                      <div className="font-jet text-xs text-gray-400 flex items-center gap-1">
                        <LuCalendar className="-mt-0.5"/>
                        <span>{new Date(hearing.date).getDay() === new Date().getDay() ? `Today, ${formatDate(hearing.date)}` : formatDate(hearing.date)}</span>
                      </div> 

                      <span className="text-xs text-gray-400">•</span>

                      <div className="font-jet text-xs text-gray-400 flex items-center gap-1">
                        <LuUser className="-mt-0.5"/>
                        <span>{hearing.hearingCreator.name}</span>
                      </div> 

                    </div>

                  </div>

                  <div className="cursor-pointer hover:bg-bgcol p-2 ml-auto h-max rounded-md" onClick={() => {setHearingToDelete(hearing)}}> <LuTrash2 className="text-red-500"/> </div>

                </div>
              ))}

            </div>

            <form className="w-full p-3 border-1 border-border rounded-md" onSubmit={hearingSubmitHandler(onHearingFormSubmit)}>

              <div className="flex flex-col gap-1 w-full mb-3">

                <label className="font-sora text-sec-navy text-sm">Hearing Date <span className="text-red-500">*</span></label>
                <input {...hearingRegister("date")} type="date" className="h-[40px] w-full border-1 border-border p-2 rounded-md hover:border-active-dot focus:border-active-dot focus:outline-none transition-all font-sora"/>

                {hearingErrors.date && <span className="font-jet text-red-500 text-xs">{hearingErrors.date?.message}</span>}
              </div>

              <div className="flex flex-col gap-1 w-full mb-3">

                <label className="font-sora text-sec-navy text-sm">Time of hearing <span className="text-red-500">*</span></label>
                <input {...hearingRegister("time")} type="time" className="h-[40px] w-full border-1 border-border p-2 rounded-md hover:border-active-dot focus:border-active-dot focus:outline-none transition-all font-sora"/>

                {hearingErrors.date && <span className="font-jet text-red-500 text-xs">{hearingErrors.date?.message}</span>}
              </div>

              <div className="flex flex-col gap-1 w-full mb-3">

                <label className="font-sora text-sec-navy text-sm">Court <span className="text-red-500">*</span></label>
                <input {...hearingRegister("court")} type="text" className="h-[40px] w-full border-1 border-border p-2 rounded-md hover:border-active-dot focus:border-active-dot focus:outline-none transition-all font-sora" placeholder="e.g. High Court"/>

                {hearingErrors.court && <span className="font-jet text-red-500 text-xs">{hearingErrors.court?.message}</span>}
              </div>

              <label className="font-sora text-sec-navy text-sm">Description</label>
              <textarea {...hearingRegister("description")} className="font-sora w-full h-[100px] rounded-md p-2 mt-2 border-1 border-border hover:border-accent-blue focus:outline-0 focus:border-accent-blue" placeholder="Add a description for this hearing..."/>

              {hearingErrors.description && <p className="text-red-500 font-jet text-xs">{hearingErrors.description?.message}</p>}

              <button type="submit" className="bg-sec-navy text-white font-sora flex items-center justify-center gap-1 w-full h-[40px] rounded-md py-1 px-2 mt-2 cursor-pointer hover:opacity-95 hover:scale-99 disabled:bg-gray-400 transition-all" disabled={caseData?.caseGotten.status === "CLOSED"}>
                <LuPlus />
                <span>Add Hearing</span>
              </button>
            </form>

          </div>

        </div>

        <div className="flex flex-col gap-6 w-full h-full mt-6">

          {/* Quick Actions */}
          {
            caseData?.isCreator && 
            <div className="flex flex-col p-4 bg-cards border-1 border-border rounded-md">
              <div className="font-sora text-navy">Quick Actions</div>

              <div className="flex flex-col gap-2 w-full mt-4">
                <div className="flex items-center gap-2 w-full border-b-1 border-border pb-4">
                  <button className="w-full bg-red-500 flex items-center gap-1 font-sora hover:opacity-95 hover:scale-99 cursor-pointer text-white transition-all justify-center rounded-md py-2 px-3 text-sm " onClick={() => {setCaseToDelete(caseData?.caseGotten)}}>
                    <LuTrash2 /> <span>Delete Case</span>
                  </button>
                  
                  <button className="w-full bg-closed flex items-center gap-1 font-sora hover:opacity-95 hover:scale-99 cursor-pointer text-white transition-all justify-center rounded-md py-2 px-3 text-sm disabled:bg-gray-400" disabled={caseData?.caseGotten.status === "CLOSED"} onClick={() => {updateCaseStatusMutation.mutate({ caseId: caseId as string, caseStatus: "CLOSED" })}}>
                    <LuLockKeyhole /> <span>Close Case</span>
                  </button>
                </div>

                <div className="flex flex-col items-center gap-2 w-full mt-2">
                  <button className="w-full bg-active flex items-center gap-1 font-sora hover:opacity-95 hover:scale-99 cursor-pointer text-white transition-all justify-center rounded-md py-2 px-3 text-sm disabled:bg-gray-400" disabled={caseData?.caseGotten.status === "ACTIVE"} onClick={() => {updateCaseStatusMutation.mutate({ caseId: caseId as string, caseStatus: "ACTIVE" })}}>
                    <LuCircleCheck /> <span>Mark as Active</span>
                  </button>
                  <button className="w-full bg-pending flex items-center gap-1 font-sora hover:opacity-95 hover:scale-99 cursor-pointer text-white transition-all justify-center rounded-md py-2 px-3 text-sm disabled:bg-gray-400" disabled={caseData?.caseGotten.status === "PENDING"} onClick={() => {updateCaseStatusMutation.mutate({ caseId: caseId as string, caseStatus: "PENDING" })}}>
                    <LuArchive /> <span>Mark as Pending</span>
                  </button>
                </div>

              </div>

          </div>
          }

          {/* Tasks */}
          <div className="flex flex-col bg-cards border-1 border-border p-4 w-full h-max rounded-md">
              <div className="font-sora text-navy">Case Tasks</div>

              <div className="w-full overflow-y-auto max-h-[200px] flex flex-col gap-1 mt-4 border-1 border-border rounded-md p-2">
                  { caseData?.caseGotten.caseTasks.length <= 0 ? (<div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4"> 
                <NoCases textToShow="You haven't added any tasks yet" Icon={LuFileText}/>
              </div>
            ) : caseData?.caseGotten.caseTasks.map((task) => (
                  <div key={task.id} className="flex gap-2 border-b-1 border-border pb-2">

                    <input type="checkbox" checked={task.status === "COMPLETED"} onChange={() => {changeTaskStatusMutation.mutate({ caseId: caseId as string, taskId: task.id as string, status: task.status === "TODO" ? "COMPLETED" : "TODO"})}} className="text-lg shrink-0 accent-active-dot text-white cursor-pointer"/>

                    <div className="flex flex-col">

                      <div className={`font-sora w-full ${task.status === "COMPLETED" ? "line-through text-gray-500" : "text-navy"} text-sm`}>{task.title}</div>
                      
                      <div className="w-full flex items-center gap-1 flex-wrap"> 
                        <span className="font-jet text-xs text-gray-400">Due: {formatDate(task.dueDate)}</span> <span className="text-xs text-gray-400">•</span>
                        <span className="font-jet text-xs text-gray-400">Assignee: {task.assignee.name}</span>
                      </div>

                    </div>

                    <div className="cursor-pointer hover:bg-bgcol p-2 ml-auto h-max rounded-md" onClick={() => {setTaskToDelete(task)}}> <LuTrash2 className="text-red-500"/> </div>

                  </div>
                ))}
              </div>

              <form className="w-full border-1 border-border rounded-md p-3 mt-6" onSubmit={(e) => createTaskMutation.mutate({event: e, title: taskData.title, assignedTo: taskData.assignedTo, dueDate: taskData.dueDate, caseId: caseId as string })}>

              <div className="flex flex-col sm:flex-row flex-wrap w-full justify-between h-max gap-1">

                <div className="flex items-center gap-2 w-full">
                  
                  <span className="font-sora text-sm text-sec-navy">Set due date:</span>
                  <input type="date" className="font-sora border-1 border-border bg-bgcol p-1 rounded-md cursor-pointer hover:border-active-dot focus:border-active-dot transition-all text-sec-navy text-sm" value={taskData.dueDate} onChange={(e) => {setTaskData((prev) => ({...prev, dueDate: e.target.value}))}}/>
                  
                </div>

                <div className="flex items-center gap-1 w-full mt-1 overflow-x-auto">
                  <span className="font-sora text-sm text-sec-navy">Assign to:</span>
                  <select className="font-sora border-1 border-border bg-bgcol p-1 rounded-md cursor-pointer hover:border-active-dot focus:border-active-dot transition-all text-sec-navy text-sm" value={taskData.assignedTo} onChange={(e) => {setTaskData((prev) => ({...prev, assignedTo: e.target.value}))}}>
                    {caseData?.caseGotten.lawyers.map((lawyer: any) => (
                      <option key={lawyer.lawyerId} value={lawyer.lawyerId} className="">{lawyer.lawyer.name} ({lawyer.lawyer.email})</option>
                    ))}
                  </select>
                </div>

              </div>

              <input type="text" value={taskData.title} className="font-sora w-full h-[56px] rounded-md p-2 mt-2 border-1 border-border hover:border-active-dot focus:outline-0 focus:border-active-dot" placeholder="Create a new task..." onChange={(e) => {setTaskData((prev) => ({...prev, title: e.target.value}))}}/>

              <button type="submit" className="bg-active-dot text-white font-sora flex items-center justify-center gap-1 w-full min-h-[40px] rounded-md py-1 px-2 mt-2 cursor-pointer hover:opacity-95 hover:scale-99 disabled:bg-gray-400" disabled={caseData?.caseGotten.status === "CLOSED"}>
                <LuPlus />
                <span>Create Task</span>
              </button>
            </form>

          </div>

          {/* Notes */}
          <div className="flex flex-col bg-cards border-1 border-border p-4 w-full h-max rounded-md">

            <div className="font-sora text-navy">Case Notes</div>

            <div className="flex flex-col gap-1 w-full overflow-y-auto max-h-[200px] mt-4 border-1 border-border rounded-md p-2">

              { caseData?.caseGotten.caseNotes <= 0 ? (<div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4"> 
                <NoCases textToShow="You haven't made any notes yet" Icon={LuPenLine}/>
              </div>
            ) : caseData?.caseGotten.caseNotes.map((note) => (
                <div key={note.id} className="flex gap-2 mt-1 border-b-1 border-border pb-2">

                  <LuMessageSquare className="text-navy mt-1.5"/>

                  <div className="flex flex-col gap-1">

                    <div className="font-sora w-full text-navy text-sm">{note.content}</div>
                    
                    <div className="w-full flex items-center gap-1"> 
                      <div className="font-jet text-xs text-gray-400 flex items-center gap-1">
                        <LuCalendar className="-mt-0.5"/>
                        <span>{formatDate(note.createdAt)}</span>
                      </div> 

                      <span className="text-xs text-gray-400">•</span>

                      <div className="font-jet text-xs text-gray-400 flex items-center gap-1">
                        {note.visibility === "PRIVATE" ? <LuLockKeyhole className="-mt-0.5"/> : <GiGreekTemple className="-mt-0.5"/>}
                        <span>{note.visibility}</span>
                      </div>

                      <span className="text-xs text-gray-400">•</span>

                      <div className="font-jet text-xs text-gray-400 flex items-center gap-1">
                        <LuUser />
                        <span>{note.author.name}</span>
                      </div>
                    </div>

                  </div>

                  {/* Add functionality for deleting notes and viewing full case note if case text becomes too long */}
                  <div className="cursor-pointer hover:bg-bgcol p-2 ml-auto h-max rounded-md" onClick={() => {setNoteToDelete(note)}}> <LuTrash2 className="text-red-500"/> </div>

                </div>
              ))}

            </div>

            <form className="w-full" onSubmit={(e) => createNoteMutation.mutate({event: e, caseId: caseId as string, note: noteData.note, visibility: noteData.visibility})}>

              <div className="flex items-center justify-between w-full mt-4">
                <span className="font-sora text-sm text-sec-navy">Set note visibility:</span>
                <select value={noteData.visibility} 
                  onChange={(e) => {
                    setNoteData((prev) => ({
                      ...prev, 
                      visibility: e.target.value as CaseNote["visibility"]
                    }))
                  }} className="font-sora border-1 border-border bg-bgcol p-1 rounded-md cursor-pointer hover:border-accent-blue focus:border-accent-blue transition-all text-sec-navy text-sm">
                    <option value="PRIVATE">Private</option>
                    <option value="ORGANIZATION">Organization</option>
                  </select>
              </div>

              <textarea value={noteData.note} className="font-sora w-full h-[100px] rounded-md p-2 mt-2 border-1 border-border hover:border-accent-blue focus:outline-0 focus:border-accent-blue" placeholder="Add a quick note..." onChange={(e) => {setNoteData((prev) => ({...prev, note: e.target.value}))}}/>

              <button type="submit" className="bg-sec-navy text-white font-sora flex items-center justify-center gap-1 w-full h-[40px] rounded-md py-1 px-2 mt-2 cursor-pointer hover:opacity-95 hover:scale-99 disabled:bg-gray-400 transition-all" disabled={caseData?.caseGotten.status === "CLOSED"}>
                <LuPlus />
                <span>Add Note</span>
              </button>
            </form>

          </div>
        </div>

      </div>

    </div>
  )
}
