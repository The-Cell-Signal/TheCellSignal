function parseInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.filter(Boolean).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={`${keyPrefix}-${i}`}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

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
                {parseInline(line, `${i}-${j}`)}
                {j < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
