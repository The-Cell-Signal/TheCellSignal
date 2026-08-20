export default function StoryBody({ body }: { body: string }) {
  const blocks = body.split(/\n\s*\n/);

  return (
    <div className="detail-content">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        const imageMatch = trimmed.match(/^!\[(.*)\]\((\S+)\)$/);

        if (imageMatch) {
          const [, caption, url] = imageMatch;
          return (
            <figure key={i} className="story-figure">
              <img src={url} alt={caption} />
              {caption && <figcaption>{caption}</figcaption>}
            </figure>
          );
        }

        const lines = trimmed.split('\n');
        return (
          <p key={i}>
            {lines.map((line, j) => (
              <span key={j}>
                {line}
                {j < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
