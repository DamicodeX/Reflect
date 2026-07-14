
"use client";

import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { journalSchema } from '@/app/lib/schema';
import { BarLoader } from 'react-spinners';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getMoodById, MOODS } from '@/app/lib/mood';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/use-fetch';
import { useRouter } from 'next/navigation';
import { createJournalEntry, getJournalEntry, saveDraft, getDraft, updateJournalEntry } from '@/actions/journal';
import { toast } from 'sonner';
import { createCollection, getCollections } from '@/actions/collection';
import CollectionDialog from '@/components/collectioin-dialog';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

type JournalFormValues = z.infer<typeof journalSchema>;
type CollectionFormValues = {
  name: string;
  description?: string;
};

const JournalEntry = () => {


  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = React.useState(false);

  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);

  const {
    loading: entryLoading,
    data: entryData,
    fn: fetchEntry,
  } = useFetch(getJournalEntry);

  // Drafts
  const {
    loading: draftLoading,
    data: draftData,
    fn: fetchDraft,
  } = useFetch(getDraft);


  // Saving Draft
  const { loading: savingDraft, fn: saveDraftFn } = useFetch(saveDraft);


  const {
    loading: createActionLoading,
    fn: createActionFn,
    data: createActionResult,
  } = useFetch(createJournalEntry);

  const {
    loading: updateActionLoading,
    fn: updateActionFn,
    data: updateActionResult,
  } = useFetch(updateJournalEntry);

  const {
    loading: collectionLoading,
    fn: fetchCollections,
    data: collections,
  } = useFetch(getCollections);

  const {
    loading: createCollectionLoading,
    fn: createCollectionFn,
  } = useFetch(createCollection);

  const { register, control, formState: { errors, isDirty }, handleSubmit, setValue, reset, getValues } = useForm<JournalFormValues>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: "",
      content: "",
      mood: "",
      collectionId: "",
    }
  })

  useEffect(() => {
    fetchCollections();

    if (editId) {
      fetchEntry(editId)
    } else {
      fetchDraft();
    }
  }, [editId, fetchCollections, fetchDraft, fetchEntry]);

  useEffect(() => {
    if (isEditMode && entryData && "title" in entryData) {
      reset({
        title: entryData.title || "",
        content: entryData.content || "",
        mood: entryData.mood || "",
        collectionId: entryData.collectionId || "",
      })
    } else if (draftData?.success && draftData?.data) {
      reset({
        title: draftData.data.title || "",
        content: draftData.data.content || "",
        mood: draftData.data.mood || "",
        collectionId: "",
      })
    } else {
      reset({
        title: "",
        content: "",
        mood: "",
        collectionId: "",
      })
    }
  }, [draftData, entryData, isEditMode, reset]);

  const router = useRouter();


  useEffect(() => {
    const actionResult = isEditMode ? updateActionResult : createActionResult;
    const actionLoading = isEditMode ? updateActionLoading : createActionLoading;

    if (!actionResult || actionLoading) {
      return;
    }

    if ("success" in actionResult) {
      toast.error(actionResult.error);
      return;
    }

    router.push(`/collection/${actionResult.collectionId ? actionResult.collectionId : "unorganized"}`);
    toast.success(`Journal entry ${isEditMode ? "updated" : "created"} successfully!`);
  }, [createActionLoading, createActionResult, isEditMode, router, updateActionLoading, updateActionResult])
  const selectedMood = useWatch({ control, name: "mood" });

  // console.log("Selected Mood:", selectedMood);
  // console.log("Form Values", useWatch({ control }));



  const onSubmit = handleSubmit(async (data) => {
    const mood = getMoodById(data.mood)

    if (!mood) {
      toast.error("Please select a valid mood.");
      return;
    }

    if (isEditMode && editId) {
      updateActionFn({
        ...data,
        moodQuery: mood.pixabayQuery,
        id: editId,
      })
      return;
    }

    createActionFn({
      ...data,
      moodQuery: mood.pixabayQuery,
    })
  })

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleSaveDraft = async () => {
    if (!isDirty) {
      toast.error("No changes to save");
      return;
    }

    const draftValues = getValues();
    const result = await saveDraftFn(draftValues);

    if (result?.success) {
      toast.success("Draft saved successfully!");
      router.push("/dashboard");
    }
  }

  const handleCreateCollection = async (data: CollectionFormValues) => {
    const createdCollection = await createCollectionFn(data);

    if (createdCollection && "id" in createdCollection) {
      setIsCollectionDialogOpen(false);
      await fetchCollections();
      setValue("collectionId", createdCollection.id);
      toast.success(`Collection "${createdCollection.name}" created successfully!`);
    }
  }
  const isLoading = (isEditMode ? updateActionLoading : createActionLoading) || collectionLoading || createCollectionLoading || entryLoading || draftLoading || savingDraft;



  return (<div>
    <form className="space-y-2 mx-auto" onSubmit={onSubmit}>
      <h1 className="text-5xl md:text-6xl gradient-title">{isEditMode ? "Edit Entry" : "What's on your mind?"}</h1>

      {isLoading && <BarLoader color="orange" width={"100%"} />}

      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input {...register("title")}
          readOnly={isLoading}
          placeholder='Give your entry a title...'
          className={`py-5 md:text-md ${errors.title ? "border-red-500" : ""}`}
        />
        {errors.title && (
          <p className="text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">How are you feeling?</label>
        <Controller
          name="mood"
          control={control}
          render={({ field }) => {
            return (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className={`w-full ${errors.mood ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select a mood..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MOODS).map((mood) => {
                    return (
                      <SelectItem key={mood.id} value={mood.id}>
                        <span className="flex items-center gap-2">
                          {mood.emoji} {mood.label}
                        </span>
                      </SelectItem>)
                  })}
                </SelectContent>
              </Select>
            )
          }}
        />
        {errors.mood && (
          <p className="text-red-500">{errors.mood.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{getMoodById(selectedMood)?.prompt ?? "Write your thoughts..."}</label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <ReactQuill
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              readOnly={isLoading}
              className={`overflow-hidden rounded-md [&_.ql-container]:h-55! [&_.ql-container]:min-h-55! [&_.ql-editor]:min-h-55! ${errors.content ? "border border-red-500" : ""}`}
              theme='snow'
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["blockquote", "code-block"],
                  ["link"],
                  ["clean"],
                ]
              }}
            />
          )}
        />
        {errors.content && (
          <p className="text-red-500">{errors.content.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Add to Collection (Optional)
        </label>
        <Controller
          name="collectionId"
          control={control}
          render={({ field }) => {
            return (
              <Select onValueChange={(value) => {

                if (value === "new") {
                  setIsCollectionDialogOpen(true)
                } else { field.onChange(value) }
              }} value={field.value || undefined}>

                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a collection..." />
                </SelectTrigger>
                <SelectContent>
                  {(collections ?? []).map((collection) => {
                    return (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </SelectItem>)
                  })}
                  <SelectItem value="new">
                    <span className="text-orange-600"> + Create New Collection</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            );
          }}
        />
        {errors.collectionId && (
          <p className="text-red-500">{errors.collectionId.message}</p>
        )}
      </div>

      <div className="space-x-4 flex">
        {!isEditMode && (
          <Button
            onClick={handleSaveDraft}
            type="button"
            variant="outline"
            disabled={savingDraft || !isDirty}
          >
            {savingDraft && <Loader2 className="mr-2 h-4 w-4 animate-spin" color="white" width={50} />}
            Save as Draft
          </Button>
        )}




        <Button type="submit" variant="journal" disabled={isEditMode ? updateActionLoading : createActionLoading}>{isEditMode ? "Update" : "Publish"}</Button>

        {isEditMode && (
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (entryData && typeof entryData === "object" && "id" in entryData) {
                router.push(`/journal/${entryData.id}`);
              }
            }}
            variant="destructive"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
    <CollectionDialog
      loading={createCollectionLoading}
      onSuccess={handleCreateCollection}
      open={isCollectionDialogOpen}
      setOpen={setIsCollectionDialogOpen}
    />
  </div>)
}

export default JournalEntry