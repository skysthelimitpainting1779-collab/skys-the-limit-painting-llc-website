interface TestimonialCardProps {
  quote: string;
  author: string;
}

export default function TestimonialCard({
  quote,
  author,
}: TestimonialCardProps) {
  return (
    <div className="border border-white/5 bg-white/[0.02] p-4 text-xs leading-relaxed text-gray-300">
      <div className="flex gap-1 text-white mb-1">
        &#9733;&#9733;&#9733;&#9733;&#9733;
      </div>
      <p className="italic">&ldquo;{quote}&rdquo;</p>
      <p className="mt-2 font-bold text-white">&mdash; {author}</p>
    </div>
  );
}
