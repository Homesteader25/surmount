import LogSelector from "@/app/components/LogSelector";
import CodeEditor from "@/app/components/CodeEditor";

export default function Page() {

    // Faux data, delete later
    let ls = [
        {name: "log1", content: "Hello"},
        {name: "log2", content: "How are"},
        {name: "log3", content: "You."},
    ]

  return (
    <main className="flex min-h-screen">
      <LogSelector logs={ls}/>
      <CodeEditor/>
    </main>
  );
}