import { api } from "@/lib/api";

type UploadFileData = {
  fileName: string;
  fileType: string;
  filePath: string;
  caseId: string;
  fileSize: number;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

export default async function uploadFileToDb ({ fileName, fileType, filePath, caseId, fileSize }: UploadFileData) {

    const response = await api.post(`/cases/${caseId}/documents`, {
        fileName,
        fileType,
        filePath,
        fileSize: formatFileSize(fileSize)
    });

    return response.data;

}