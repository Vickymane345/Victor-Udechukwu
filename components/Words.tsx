/** Splits text into .word spans for GSAP word-by-word scroll reveals. */
export default function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} className="word">
          {word}
          {" "}
        </span>
      ))}
    </>
  );
}
