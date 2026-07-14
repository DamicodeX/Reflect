"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import useFetch from "@/hooks/use-fetch";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {deleteCollection} from "@/actions/collection";
import { toast } from "sonner";



type Collection = {
  id: string
  name: string
}

type Props = {
  collection: Collection
  entriesCount?: number
}

const DeleteCollectionDialog = ({collection, entriesCount = 0}: Props) => {

  const router = useRouter();


  const  [open, setOpen] = useState(false)

  const {
    loading: isDeleting,
    fn: deleteCollectionFn,
  } = useFetch(deleteCollection)

  const handleDelete = async () => {
    const result = await deleteCollectionFn(collection.id); 

    if (result) {
      setOpen(false);
      toast.error(
        `Collection "${collection.name}" and all its entries have been deleted.`
      );
      router.push("/dashboard")
    }
  }


  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="cursor-pointer">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &quot;{collection.name}&quot;</AlertDialogTitle>
        <div className="space-y-2 text-muted-foreground text-sm">
          <p>This will permanently delete:</p>
          <ul className="list-disc list-inside">
            <li><strong>{collection.name}</strong> collection</li>
            <li>
              {entriesCount} Journal{""}
              {entriesCount === 1 ? " entry" : " entries"}
            </li>
          </ul> 
          <p className="text-red-600 font-semibold">This action cannot be undone.</p>         
        </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600"
          disabled={isDeleting}
          >{isDeleting ? "Deleting..." : "Delete Collection"}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCollectionDialog