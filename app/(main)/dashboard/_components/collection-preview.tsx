"use client";

import { getMoodById } from "@/app/lib/mood";
import { formatDistanceToNow } from "date-fns";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

type Entry = {
  id: string;
  mood: string;
  title: string;
  createdAt: string | Date;
};

type FolderTabProps = {
  colorClass: string;
};

type EntryPreviewProps = {
  entry: Entry;
};

type BaseCollectionPreviewProps = {
  entries?: Entry[];
  isUnorganized?: boolean;
};

type CreateCollectionPreviewProps = {
  isCreateNew: true;
  onCreateNew: () => void;
};

type ExistingCollectionPreviewProps = BaseCollectionPreviewProps & {
  id: string;
  name: string;
  isCreateNew?: false;
  onCreateNew?: never;
};

type UnorganizedCollectionPreviewProps = BaseCollectionPreviewProps & {
  name: string;
  isUnorganized: true;
  id?: never;
  isCreateNew?: false;
  onCreateNew?: never;
};

type CollectionPreviewProps = CreateCollectionPreviewProps | ExistingCollectionPreviewProps | UnorganizedCollectionPreviewProps;


const colorSchemes = {
  unorganized: {
    bg: "bg-amber-100 hover:bg-amber-50",
    tab: "bg-amber-200 group-hover:bg-amber-300",
  },
  collection: {
    bg: "bg-blue-100 hover:bg-blue-50",
    tab: "bg-blue-200 group-hover:bg-blue-300",
  },
  createCollection: {
    bg: "bg-gray-200 hover:bg-gray-100",
    tab: "bg-gray-100 hover:bg-gray-50",
  },
};

const FolderTab = ({ colorClass }: FolderTabProps) => {
  return (
    <div className={`absolute inset-x-4 -top-2 h-2 rounded-t-md transform -skew-x-6 transition-colors ${colorClass}`}></div>
  );
}

const EntryPreview = ({ entry }: EntryPreviewProps) => (
  <div className="bg-white/50 p-2 rounded text-sm truncate">
    <span className="mr-2">{getMoodById(entry?.mood)?.emoji}</span>
    {entry.title}
  </div>
);

const CollectionPreview = (props: CollectionPreviewProps) => {
  if (props.isCreateNew) {
    return <button 
    onClick={props.onCreateNew}
    className="relative group-h-[200px] cursor-pointer">
      <FolderTab colorClass={colorSchemes["createCollection"].bg}/>

      <div className={`relative h-full rounded-lg p-6 shadow-md hover:shadow-lg transition-all flex flex-col items-center 
        justify-center gap-4 ${colorSchemes["createCollection"].tab}`}>

        <div className="h-12 w-12 rounded-full bg-gray-200 group-hover:bg-gray-300 flex items-center justify-center">
        <PlusIcon className="h-6 w-6 text-gray-600"/>
        </div>
        <p className="text-sm font-medium text-gray-700">Create New Collection</p>
      </div>
    </button>
  }

  const entries = props.entries ?? [];
  const collectionKey = props.isUnorganized ? "unorganized" : props.id;

  return <Link href={`/collection/${collectionKey}`} className="group relative">
    <FolderTab 
    colorClass={colorSchemes[props.isUnorganized ? "unorganized" : "collection"].tab}
    />
    <div className={`relative rounded-lg p-6 shadow-md hoer:shadow-lg transition-all 
      ${colorSchemes[props.isUnorganized ? "unorganized" : "collection"].bg}`}>
      <div>
        <span>{props.isUnorganized ? "📂" : "📁"}</span>
        <h3 className="text-lg font-semibold truncate">{props.name}</h3>
      </div>
      <div className="spacy-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{entries.length} entries</span>
          {entries.length > 0 && (
            <span>
              {formatDistanceToNow(new Date(entries[0].createdAt),{addSuffix: true})}
            </span>
          )}
        </div>
        <div className="space-y-2 mt-4">
          {entries.length > 0 ? (
            entries.slice(0, 2).map((entry) => (
              <EntryPreview key={entry.id} entry={entry} />
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No entries yet</p>
          )}
        </div>
      </div>
    </div>
  </Link>
}

export default CollectionPreview