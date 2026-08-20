import StoryForm from '@/components/StoryForm';

export default function NewStoryPage() {
  return (
    <div style={{ paddingTop: 36, paddingBottom: 60, maxWidth: 640 }}>
      <h2 className="section-label" style={{ marginBottom: 20 }}>
        New story
      </h2>
      <StoryForm />
    </div>
  );
}
