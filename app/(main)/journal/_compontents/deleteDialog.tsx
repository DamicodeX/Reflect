"use client";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
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
// import { deleteCollection } from "@/actions/collection";
import {deleteJournalEntry} from "@/actions/journal";
import { toast } from "sonner";



const DeleteDialog = ({ entryId }: { entryId: string }) => {

    const router = useRouter();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const {
        loading: isDeleting,
        fn: deleteJournalEntryFn,
    } = useFetch(deleteJournalEntry)

    const handleDelete = async () => {
        const deletedEntry = await deleteJournalEntryFn(entryId);

        if (deletedEntry && typeof deletedEntry === "object" && !("success" in deletedEntry)) {
            setDeleteDialogOpen(false);
            toast.error("Journal Entry deleted successfully");

            const collectionId = deletedEntry.collectionId || "unorganized";
            router.push(`/collection/${collectionId}`)
        }
    }


    return (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="cursor-pointer">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the journal entry.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 cursor-pointer"
                        disabled={isDeleting}
                    >{isDeleting ? "Deleting..." : "Delete Entry"}</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteDialog