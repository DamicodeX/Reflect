"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import CollectionPreview from "./collection-preview";
import CollectionDialog from '@/components/collectioin-dialog';
import useFetch from '@/hooks/use-fetch';
import { createCollection } from '@/actions/collection';
import { toast } from 'sonner';

type Collection = {
    id: string;
    name: string;
};

type JournalEntry = {
    id: string;
    title: string;
    mood: string;
    createdAt: string | Date;
};

type EntriesByCollection = Record<string, JournalEntry[]>;

type CollectionFormValues = {
    name: string;
    description?: string;
};

type Props = {
    collections?: Collection[];
    entriesByCollection?: EntriesByCollection;
};

const Collections = ({ collections = [], entriesByCollection }: Props) => {
    const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
    const router = useRouter();

    const {
        loading: createCollectionLoading,
        fn: createCollectionFn,
    } = useFetch(createCollection);

    const handleCreateCollection = async(data: CollectionFormValues) => {
        const createdCollection = await createCollectionFn(data);

        if (createdCollection && "id" in createdCollection) {
            setIsCollectionDialogOpen(false);
            toast.success(`Collection "${createdCollection.name}" created successfully!`);
            router.refresh();
        }
    };

    return (
        <section>
            <h2 className="text-3xl font-bold gradient-title">Collections</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <CollectionPreview
                    isCreateNew={true}
                    onCreateNew={() => setIsCollectionDialogOpen(true)}
                />
                {(entriesByCollection?.unorganized?.length ?? 0) > 0 && (
                    <CollectionPreview
                        name="Unorganized"
                        entries={entriesByCollection?.unorganized}
                        isUnorganized={true}
                    />
                )}
                {collections.map((collection) => (
                    <CollectionPreview
                        key={collection.id}
                        id={collection.id}
                        name={collection.name}
                        entries={entriesByCollection?.[collection.id] || []}
                    />
                ))}
                <CollectionDialog
                    loading={createCollectionLoading}
                    onSuccess={handleCreateCollection}
                    open={isCollectionDialogOpen}
                    setOpen={setIsCollectionDialogOpen}
                />
            </div>
        </section>

    )
}

export default Collections