'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({
  id,
  action
}: {
  id: string;
  action: (id: string) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    if (!confirm('Delete this story? This cannot be undone.')) return;
    startTransition(async () => {
      await action(id);
      router.refresh();
    });
  }

  return (
    <button type="button" className="link-danger" onClick={handleClick} disabled={pending}>
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
