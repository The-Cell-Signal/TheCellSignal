import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Story } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { deleteStory, signOut } from './actions';
import DeleteButton from '@/components/DeleteButton';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('stories')
    .select('*')
    .order('published_at', { ascending: false });
  const list = (data ?? []) as Story[];

  return (
    <div style={{ paddingTop: 36, paddingBottom: 60 }}>
      <div className="section-head" style={{ borderTop: 'none', paddingTop: 0 }}>
        <span className="section-label">Manage stories</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/stories/new" className="btn btn-primary">
            + New story
          </Link>
          <form action={signOut}>
            <button className="btn" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </div>

      {list.length ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Featured</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td>{s.title}</td>
                <td>{s.category}</td>
                <td>{formatDate(s.published_at)}</td>
                <td>{s.featured ? 'Yes' : ''}</td>
                <td>
                  <div className="admin-actions">
                    <Link href={`/admin/stories/${s.id}/edit`}>Edit</Link>
                    <DeleteButton id={s.id} action={deleteStory} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="muted" style={{ marginTop: 20 }}>
          No stories yet. Click "+ New story" to publish your first one.
        </p>
      )}
    </div>
  );
}
