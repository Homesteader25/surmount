import { Button } from "@headlessui/react";

type log = {
    name : string;
    content : string;
    // dateCreated : Date;
    // dateLastEdited : Date;
}

interface LogSelectorProps {
    logs : log[];
}

export default function LogSelector( { logs } : LogSelectorProps) {
    return (
        <div className="bg-gray-800 text-white p-4">

            <Button className="bg-blue-500 p-2 my-2 rounded-md hover:bg-slate-500">
                Create New Log
            </Button>
            <div className="space-y-2">
                <div className="">
                    {logs.map((item) => (
                        <button
                            className="list-item w-full text-left p-2 hover:bg-gray-700 rounded-md"
                            key={item.name}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}