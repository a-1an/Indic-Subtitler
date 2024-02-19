import React from "react";
import { IconDownload } from "@tabler/icons-react";
import { formatTime, removeFileExtension } from "@components/utils";

export default function SubtitleEditor({
  transcribed = [],
  setTranscribed,
  filename,
  requestSentToAPI,
}) {
  function handleInputChange(index, newText, type) {
    const updateTranscribe = [...transcribed];
    updateTranscribe[index][type] = newText;
    setTranscribed(updateTranscribe);
  }
  function downloadSRT() {
    const srtContent = transcribed
      .map((entry, index) => {
        const { start, end, text } = entry;
        const startTime = formatTime(start);
        const endTime = formatTime(end);
        return `${index + 1}\n${startTime} --> ${endTime}\n${text}\n\n`;
      })
      .join("");

    const blob = new Blob([srtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${removeFileExtension(filename)}.srt`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  if (!transcribed?.length && !requestSentToAPI) {
    return (
      <>
        <aside className="w-full lg:w-[75%] mt-14 md:mt-0 md:border-l-2 ">
          <div className="flex md:flex-row flex-col md:justify-end md:text-lg text-white gap-4 md:px-4 md:p-2 md:py-4"></div>

          <div className="flex justify-center items-center h-[70vh]">
            <h5 className="text-xl font-medium">
              Upload a file to edit subtitles
            </h5>
          </div>
        </aside>
      </>
    );
  }
  if (requestSentToAPI) {
    return <h1>Loading....</h1>;
  }
  return (
    <aside className="w-full lg:w-[75%] mt-14 md:mt-0 md:border-l-2 ">
      <div className="flex md:flex-row flex-col md:justify-end md:text-lg text-white gap-4 md:px-4 md:p-2 md:py-4">
        <button
          onClick={downloadSRT}
          className="bg-secondary-900 p-2 rounded-md flex gap-4 w-fit"
        >
          <IconDownload />
          Download
        </button>
      </div>
      <div>
        <div className="overflow-x-auto h-[680px]">
          <p className="text-gray-500 font-semibold mx-2">
            Click on subtitle to start editing
          </p>
          <table className="table text-lg">
            <thead className="text-lg text-gray-600">
              <tr>
                <th>Timestamp</th>
                <th>Text</th>
              </tr>
            </thead>
            <tbody className="">
              {transcribed?.map((element, index) => (
                <tr key={index}>
                  <td width="25%">
                    <p>
                      {formatTime(element.start).replace(",", ".")} -{" "}
                      {formatTime(element.end).replace(",", ".")}
                    </p>
                  </td>
                  <td>
                    <textarea
                      className="w-full resize-none"
                      rows={Math.ceil(element.text.length / 100)}
                      type="text"
                      value={element.text}
                      onChange={(e) =>
                        handleInputChange(index, e.target.value, "text")
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </aside>
  );
}
