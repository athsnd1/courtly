import Breadcrumb from "@/components/Breadcrumb";
import PageInfo from "@/components/PageInfo";
import { CaseSchema, type CaseSchemaType } from "@/validators/case.schema";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuPlus, LuTrash2, LuX } from "react-icons/lu";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCase } from "@/api/createCase";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";

interface Lawyer {
  id: string;
  name: string;
  email: string;
}

interface Lawyers {
  currentUser: { id: string, name: string, email: string};
  others: Lawyer[];
}

export default function AddCasePage() {

  const navigate = useNavigate();

  const [lawyers, setLawyers] = useState<Lawyers | null>(null);

  const [selectedLawyers, setSelectedLawyers] = useState<Lawyer[]>([]);

  const [showOptions, setShowOptions] = useState(false);

  const [searchString, setSearchString] = useState("");

  const debouncedSearchString = useDebounce(searchString, 500);

  const { handleSubmit, register, control, getValues, setValue, formState: { errors } } = useForm<CaseSchemaType>({
    resolver: zodResolver(CaseSchema),
    defaultValues: {
      caseNumber: "",
      title: "",
      type: "CIVIL",
      description: "",
      lawyerIds: [],
      caseParties: [
        {name: "", type: "PLAINTIFF"}
      ],
    }
  });

  const getCurrentLawyer = async () => {
    const response = await api.get("/organization/lawyers");
    setLawyers(response.data);
    setValue("lawyerIds", [response.data.currentUser.id])
  };

  useEffect(() => {
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getCurrentLawyer();

  }, []);

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "caseParties"
  });

  async function getLawyers (searchString: string) {
    if (!searchString) return;

    const response = await api.get(`/organization/lawyers?search=${searchString}`);

    setLawyers(response.data);

    return response.data;
  };

  const { data } = useQuery({
    queryKey: ["lawyers", debouncedSearchString],
    queryFn: () => getLawyers(debouncedSearchString),
    enabled: debouncedSearchString.trim().length >= 2,
  });

  function addLawyer(lawyer: Lawyer) {
    const currentIds = getValues("lawyerIds");

    if (currentIds.includes(lawyer.id)) return;

    setValue("lawyerIds", [...currentIds, lawyer.id]);
    setSelectedLawyers((prev) => [...prev, lawyer]);

    setShowOptions(false);
  }

  function removeLawyer(id: string) {
    const currentIds = getValues("lawyerIds");

    setValue(
      "lawyerIds",
      currentIds.filter((lawyerId) => lawyerId !== id)
    );

    setSelectedLawyers((prev) =>
      prev.filter((lawyer) => lawyer.id !== id)
    );
  }

  const queryClient = useQueryClient();

  const createCaseMutation = useMutation({
    mutationFn: createCase,

    onMutate: () => {
      const toastId = toast.loading("Creating case...");
      return { toastId };
    },

    onError: (_error, _variables, context) => {
      toast.error("Failed to create case", { id: context?.toastId })
    },

    onSuccess: async (createdCase, _variables, context) => {

      toast.success("Case created successfully", { id: context?.toastId }); 

      navigate(`/dashboard/cases/${createdCase.id}`);

      queryClient.invalidateQueries({
        queryKey: ["cases"]
      });

      queryClient.invalidateQueries({
        queryKey: ["activities"]
      });

      queryClient.invalidateQueries({
        queryKey: ["notifs"]
      });
    }
  });

  function onSubmit (data: CaseSchemaType) {
    createCaseMutation.mutate(data);
  };

  return (
    <div className="h-full w-full">

      <Breadcrumb firstPage="Dashboard" secondPage="Add Case"/>

      <PageInfo page_name="Add New Case" page_summary="Create and organize a new legal case."/>

      <form className="w-full h-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full h-max p-4 mt-6 mb-2 bg-cards border-1 border-border rounded-md">

          {/* Basic case details */}
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full h-max">
            <div className="flex flex-col gap-1 w-full">
              <label className="font-sora text-sec-navy">Case Number <span className="text-red-500">*</span></label>
              <input {...register("caseNumber")} type="text" className="h-[40px] w-full border-1 border-border p-2 rounded-md hover:border-active-dot focus:border-active-dot focus:outline-none transition-all font-sora" placeholder="CV-2026-XXXX"/>
              {errors.caseNumber && <span className="font-jet text-red-500 text-sm">{errors.caseNumber?.message}</span>}
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="font-sora text-sec-navy">Case Title <span className="text-red-500">*</span></label>
              <input {...register("title")} type="text" className="h-[40px] w-full border-1 border-border p-2 rounded-md hover:border-active-dot focus:border-active-dot focus:outline-none transition-all font-sora" placeholder="Smith v. Doe"/>
              {errors.title && <span className="font-jet text-red-500 text-sm">{errors.title?.message}</span>}
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="font-sora text-sec-navy">Case Type <span className="text-red-500">*</span></label>

              <select {...register("type")} className="h-max w-full border-1 border-border p-2 rounded-md hover:border-active-dot focus:border-active-dot focus:outline-none transition-all font-sora cursor-pointer">
                <option value="CIVIL">Civil</option>
                <option value="CRIMINAL">Criminal</option>
                <option value="CORPORATE">Corporate</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="FAMILY">Family</option>
                <option value="LABOR">Labor</option>
                <option value="PROPERTY">Property</option>
                <option value="TAX">Tax</option>
                <option value="OTHER">Other</option>
              </select>

              {errors.type && <span className="font-jet text-red-500 text-sm">{errors.type?.message}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-4">
            <label className="font-sora text-sec-navy">Description</label>
            <textarea {...register("description")} className="h-[150px] w-full border-1 border-border p-2 rounded-md hover:border-active-dot focus:border-active-dot focus:outline-none transition-all font-sora" placeholder="Description"/>
            {errors.description && <span className="font-sora text-red-500">{errors.description?.message}</span>}
          </div>

        </div>

        {/* Add Lawyers to case */}
        <div className="w-full h-max p-4 mt-6 mb-2 bg-cards border-1 border-border rounded-md">

          <label className="font-sora text-sec-navy text-lg">Assign Lawyers</label>

          <div className="w-full flex items-center gap-3">
            <div className="font-sora flex items-center w-full gap-2">
              <span className="py-1 px-3 bg-border border-1 border-gray-500 rounded-full text-sm flex items-center gap-1 w-max border-r-1 relative after:content-[''] after:absolute after:h-full after:w-[2px] after:bg-border after:-right-3 shrink-0 mr-3">{lawyers?.currentUser.name}</span>

              <div className="flex items-center gap-2 w-full">
                {selectedLawyers && selectedLawyers.map((lawyer) => (
                  <span key={lawyer.id} className="py-1 px-3 bg-prim-text text-white rounded-full text-sm flex items-center gap-1 w-max cursor-pointer hover:opacity-95 hover:scale-99 border-r-1">{lawyer && lawyer.name} <LuX onClick={() => removeLawyer(lawyer.id)}/></span>
                ))}
              </div>
            </div>

            <div className="w-full">

              <div className="flex items-center gap-1 w-full">
                 
                 <div className="w-full relative">
                   <input type="text" className="h-[40px] w-full max-w-[150px] border-1 border-border p-2 rounded-md hover:border-active-dot focus:border-active-dot focus:outline-none transition-all font-sora" placeholder="Find a lawyer" onChange={(e) => {setSearchString(e.target.value); setShowOptions(true)}} onBlur={() => {setShowOptions(false)}}/>

                    { 
                      showOptions && lawyers?.others &&
                      <div className="font-sora bg-cards rounded-md flex flex-col items-center gap-2 pb-2 shadow-sm shadow-[rgba(0,0,0,0.1)] min-w-[200px] max-w-[250px] sm:max-w-[400px] absolute top-full left-0 mt-1 border-1 border-border">

                        <div className="mt-2 border-b-1 border-border w-full py-0.5 px-2 flex items-center justify-between">
                          <span>Options</span>
                          <LuX className="cursor-pointer" onClick={() => setShowOptions(false)}/>
                        </div>
                      
                        <div className="max-h-[500px] overflow-y-auto flex flex-col items-center gap-1 p-2">
                          {lawyers.others.map((lawyer) => (
                          <div key={lawyer.id} className="font-sora text-sm cursor-pointer hover:opacity-95 p-2 mx-2 rounded-md hover:bg-bgcol transition-all whitespace-normal border-1 border-border w-full" onMouseDown={() => addLawyer(lawyer)}>
                            {lawyer.name} ({lawyer.email})
                          </div>
                        ))}
                        </div>
                      
                    </div>
                    }
                 </div>

                </div>

            </div>
          </div>

        </div>


        {/* Add Case Parties */}
        <div className="w-full h-max p-4 mt-6 mb-2 bg-cards border-1 border-border rounded-md">

          <div className="flex items-center justify-between">
            <label className="font-sora text-sec-navy text-lg">Case Parties</label>

            <button type="button" className="flex items-center gap-1 bg-prim-text py-1.5 px-2 rounded-md text-white hover:opacity-95 hover:scale-99 cursor-pointer transition-all" onClick={() => {append({
              name: "", type: "PLAINTIFF"
            })}}>
              <LuPlus />
              <span className="">Add Party</span>
            </button>

          </div>

          {
            fields.map((field, index) => (
              <div className="flex flex-col sm:flex-row items-center w-full gap-6 mt-4 border-1 border-border p-2 pb-3 rounded-md focus-within:border-active-dot" key={field.id}>

              <div className="flex flex-col gap-1 w-full">
                <label className="font-sora text-sec-navy">Party Name</label>
                <input {...register(`caseParties.${index}.name`)} type="text" className="h-[40px] w-full border-1 border-border p-2 rounded-md hover:border-active-dot focus:border-active-dot focus:outline-none transition-all font-sora" placeholder="John Doe"/>
                {errors.caseParties && <span className="font-jet text-red-500 text-sm">{errors.caseParties?.[index]?.name?.message}</span>}
              </div>

              <div className="flex flex-col gap-1 w-full ">
                <div className="flex items-center w-full justify-between">

                  <label className="font-sora text-sec-navy">Party Type</label>

                  <LuTrash2 className="text-red-500 cursor-pointer hover:opacity-95 hover:scale-99 text-xl mb-1" onClick={() => {remove(index)}}/>
                </div>

                <select {...register(`caseParties.${index}.type`)} className="h-max w-full border-1 border-border p-2 rounded-md hover:border-active-dot focus:border-active-dot focus:outline-none transition-all font-sora cursor-pointer">
                  <option value="PLAINTIFF">Plaintiff</option>
                  <option value="DEFENDANT">Defendant</option>
                  <option value="CLAIMANT">Claimant</option>
                  <option value="RESPONDENT">Respondent</option>
                  <option value="APPELLANT">Appellant</option>
                  <option value="APPELLEE">Appellee</option>
                  <option value="PETITIONER">Petitioner</option>
                  <option value="WITNESS">Witness</option>
                  <option value="VICTIM">Victim</option>
                  <option value="ACCUSED">Accused</option>
                  <option value="COMPLAINANT">Complainant</option>
                  <option value="INTERVENOR">Intervenor</option>
                  <option value="THIRD_PARTY">Third Party</option>
                  <option value="OTHER">Other</option>
                </select>

                {errors.caseParties && <span className="font-jet text-red-500">{errors.caseParties?.[index]?.type?.message}</span>}
              </div>
            </div>
            ))
          }

        </div>

        <div className="flex items-center gap-2 w-full mt-4 pb-20 sm:pb-5">
          <button type="button" className="bg-border p-2 rounded-md font-sora hover:scale-99 hover:opacity-95 cursor-pointer flex items-center gap-1 transition-all">
            <LuX />
            <span>Cancel</span>
          </button>

          <button type="submit" className="h-[40px] font-sora flex items-center gap-1 p-2 rounded-md text-white bg-active-dot cursor-pointer hover:opacity-80 hover:scale-99 transition-all" disabled={createCaseMutation.isPending}>
            {
              createCaseMutation.isPending ? 
              <div className="flex items-center gap-1"> 
                <ClipLoader 
                  color="#ffffff"
                  loading={createCaseMutation.isPending}
                  size={16}
                /> Creating...
              </div> : 
              <div className="flex items-center gap-1">
                <LuPlus />
                <span>Create Case</span>
              </div>
            }
          </button>
        </div>

      </form>

    </div>
  )
}
