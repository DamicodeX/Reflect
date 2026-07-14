"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

const EditButton: FC<{ entryId: string }> = ({ entryId }) => {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="cursor-pointer"
      size="sm"
      onClick={() => router.push(`/journal/write?edit=${entryId}`)}
    >
      <Edit className="h-4 w-4 mr-2" />
      Edit
    </Button>
  );
}

export default EditButton