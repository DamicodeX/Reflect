import { getCollections } from '@/actions/collection'
import { getJournalEntries } from '@/actions/journal';
// import { log } from 'console';
import React from 'react'
import Collections from './_components/Collections';
import MoodAnalytics from './_components/mood-analytics';

type JournalEntry = {
  id: string;
  title: string;
  mood: string;
  createdAt: string | Date;
  collectionId: string | null;
};

type EntriesByCollection = Record<string, JournalEntry[]>;
export const dynamic = "force-dynamic";

const Dashboard = async () => {

  const collections = await getCollections();
  const entriesData = await getJournalEntries({});
  // console.log("Collections :", collections)
  // console.log("Entries Data :", entriesData)

  const entriesByCollection = (entriesData.data?.entries ?? []).reduce<EntriesByCollection>((acc, entry) => {
    const collectionId = entry.collectionId || "unorganized";
    if (!acc[collectionId]) {
      acc[collectionId] = [];
    }
    acc[collectionId].push(entry);
    return acc;
  }, {})

  // log("Entries by Collection :", entriesByCollection)

  return (
    <div className='px-4 py-8 space-y-8'>
      <section className='space-y-4'>
        <MoodAnalytics />
      </section>

      <Collections
        collections={collections}
        entriesByCollection={entriesByCollection}
      />
    </div>
  )
}

export default Dashboard