import Image from "next/image";
import { dummyUi } from "@sbm/ui";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="mb-8 text-4xl font-bold">Admin App</h1>
      <Image
        className="dark:invert"
        src="/next.svg"
        alt="Next.js logo"
        width={100}
        height={20}
        priority
      />
      <p className="mt-8 text-lg">UI Package says: {dummyUi}</p>
    </div>
  );
}
