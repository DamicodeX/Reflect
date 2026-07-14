"use client";

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { collectionSchema } from '@/app/lib/schema';
import { useForm } from 'react-hook-form';
import { BarLoader } from 'react-spinners';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import type { Dispatch, SetStateAction } from 'react';
import type { z } from 'zod';

type CollectionFormValues = z.infer<typeof collectionSchema>;

type CollectionDialogProps = {
    onSuccess: (data: CollectionFormValues) => void | Promise<void>;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    loading?: boolean;
}

const CollectionDialog = ({ onSuccess, open, setOpen, loading = false }: CollectionDialogProps) => {



    const { register, handleSubmit, formState: { errors } } = useForm<CollectionFormValues>({
        resolver: zodResolver(collectionSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const onSubmit = handleSubmit(async (data) => {
        onSuccess(data);

    })

    // const loading = loading;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Collection</DialogTitle>
                </DialogHeader>
                {loading && <BarLoader color="orange" width={"100%"} />}
                <form onSubmit={onSubmit} className="space-y-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Collection Name</label>
                        <Input {...register("name")}
                            disabled={loading}
                            placeholder='Enter a Collection name...'
                            className={`${errors.name ? "border-red-500" : ""}`}
                        />
                        {errors.name && (
                            <p className="text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea {...register("description")}
                            disabled={loading}
                            placeholder='Give a description for your collection...'
                            className={`${errors.description ? "border-red-500" : ""}`}
                        />
                        {errors.description && (
                            <p className="text-red-500">{errors.description.message}</p>
                        )}
                    </div>
                    <div className='flex justify-end gap-4'>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="journal" type="submit">Create Collection</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CollectionDialog