import { getJournalEntry } from '@/actions/journal';
import { getMoodById } from '@/app/lib/mood';
import Image from 'next/image';
import { format } from "date-fns";
import EditButton from '../_compontents/edit-button';
import DeleteDialog from '../_compontents/deleteDialog';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge"

const JournalEntryPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const entry = await getJournalEntry(id);

  if (!entry || 'error' in entry) {
    return <div>Entry not found</div>;
  }

  const mood = getMoodById(entry.mood);


  return (
    <>
      <div>{
        entry.moodImageUrl && (
          <div className="relative h-48 md:h-64 w-full">
            <Image
              src={entry.moodImageUrl}
              alt="Mood visualization"
              className="object-contain w-full h-full"
              fill
              priority
            />
          </div>
        )}

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-5xl font-bold gradient-title"> {entry.title} </h1>
                <p className="text-gray-500">
                  Created {format(new Date(entry.createdAt), "PPP")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <EditButton entryId={id} />
                <DeleteDialog entryId={id} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {entry.collection && (
                <Link href={`/collections/${entry.collection.id}`}>
                  {/* <Badge */}
                  <Badge>Collection: {entry.collection.name}</Badge>
                </Link>
              )}
              <Badge variant="outline"
                style={{
                  backgroundColor: `var(--${mood?.color}-50)`,
                  color: `var(--${mood?.color}-700)`,
                  borderColor: `var(--${mood?.color}-200)`,
                }}
              >Feeling {mood?.label}</Badge>
            </div>
          </div>
        </div>

        <hr/>

        <div className="ql-snow">
          <div className="ql-editor" dangerouslySetInnerHTML={{__html: entry.content}}/>
        </div>

        <div className="text-sm text-gray-500 pt-4 border-t">
          Last updated {format(new Date(entry.updatedAt), "PPP 'at' p")}
        </div>
      </div>
    </>

  )
}

export default JournalEntryPage