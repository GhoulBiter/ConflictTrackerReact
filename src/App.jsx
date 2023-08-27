import { useState } from "react"
import moment from "moment"
import "./App.css"
import ConflictTable from "./components/ConflictTable";


function convertScheduleString(inputString) {
  // Extracting the necessary information using regular expressions
  const regex = /([A-Za-z]{3}\(\d{2}\/\d{2}\/\d{4}\))\s+(\d{2}:\d{2}:\d{2})\s+-\s+(\d{2}:\d{2}:\d{2})\s+([\w-]+)\s+(.*)/;
  const matches = inputString.match(regex);

  // Formatting the extracted information
  if (matches && matches.length === 6) {
    const date = matches[1];
    const startTime = matches[2];
    const endTime = matches[3];
    const place = matches[4];
    const lectureHall = matches[5];

    const formattedString = `Date: ${date} ; Time: ${startTime} - ${endTime} ; Place: ${place} ${lectureHall}`;
    return formattedString;
  }

  // If the input string doesn't match the expected format
  // console.log(inputString)
  return "Invalid input format."
}


function App() {
  const [numCourses, setNumCourses] = useState(2)
  const [courseNames, setCourseNames] = useState(["", ""])
  const [scheduleEntries, setScheduleEntries] = useState(["", ""])
  const [overlappedEntries, setOverlappedEntries] = useState([])

  const handleNumCoursesChange = (event) => {
    const count = parseInt(event.target.value)
    setNumCourses(count)
    setCourseNames(Array(count).fill(""))
    setScheduleEntries(Array(count).fill(""))
  }

  const handleCourseNameChange = (index, event) => {
    const updatedNames = [...courseNames]
    updatedNames[index] = event.target.value
    setCourseNames(updatedNames)
  }

  const handleScheduleEntryChange = (index, event) => {
    const updatedEntries = [...scheduleEntries]
    updatedEntries[index] = event.target.value
    setScheduleEntries(updatedEntries)
  }

  const processScheduleData = () => {
    const formattedEntries = {}
    // console.log(overlappedEntries)

    for (let i = 0; i < numCourses; i++) {
      const entries = scheduleEntries[i].split("\n")

      for (let j = 0; j < entries.length; j++) {
        const entry = entries[j].trim()

        if (entry !== "") {
          const formattedEntry = convertScheduleString(entry)
          // console.log(formattedEntry)

          const match = formattedEntry.match(
            /Date: (.*?) ; Time: (.*?) ; Place: (.*?)/
          )

          if (match) {
            const date = moment(match[1], "ddd(D/MM/YYYY)")
            const time = match[2].split(" - ")
            const startTime = moment(time[0], "HH:mm:ss")
            const endTime = moment(time[1], "HH:mm:ss")
            const number = j + 1

            if (!formattedEntries[date]) {
              formattedEntries[date] = []
            }

            formattedEntries[date].push({
              course: courseNames[i],
              date: match[1],
              time: match[2],
              startTime,
              endTime,
              place: match[3],
              entryNum: number,
            })
          }
        }
      }
    }

    const overlappingEntries = []

    console.log(formattedEntries)

    for (const date in formattedEntries) {
      const entries = formattedEntries[date]

      for (let i = 0; i < entries.length; i++) {
        const entryA = entries[i]

        for (let j = i + 1; j < entries.length; j++) {
          const entryB = entries[j]

          // console.log(entryA, entryB)

          if (
            entryA.startTime.isBetween(entryB.startTime, entryB.endTime, undefined, "[)") ||
            entryA.endTime.isBetween(entryB.startTime, entryB.endTime, undefined, "(]") ||
            entryB.startTime.isBetween(entryA.startTime, entryA.endTime, undefined, "[)") ||
            entryB.endTime.isBetween(entryA.startTime, entryA.endTime, undefined, "(]")
          ) {
            overlappingEntries.push([entryA, entryB])
          }
        }
      }
    }

    setOverlappedEntries(overlappingEntries)
    console.log(overlappingEntries)
  }

  return (
    <div className="flex flex-col gap-6 text-center py-8 px-6 md:px-12 lg:px-40">
      <h2 className="text-4xl text-blue-600 font-semibold">
        Conflict Identifier
      </h2>

      <div className="grid">
        <div className="mb-5 grid grid-flow-row grid-rows-display sm:grid-flow-col sm:grid-cols-display">
          <label htmlFor="numCourses" className="text-left align-middle mb-2 sm:mb-0">
            Number of Courses:
          </label>
          <select id="numCourses" className="rounded-xl px-3 py-2 align-middle" onChange={handleNumCoursesChange}>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>

        {courseNames.map((courseName, index) => (
          <div key={index} className="mb-5 grid grid-flow-row gap-2">
            <div className="grid grid-flow-row grid-rows-display sm:grid-flow-col sm:grid-cols-display">
              <label className="flex items-center mb-2 sm:mb-0">Course Name {index + 1}:</label>
              <input className="rounded-xl px-3 py-2 align-middle" type="text" value={courseName} onChange={(event) => handleCourseNameChange(index, event)} required />
            </div>

            <div className="grid grid-flow-row grid-rows-display sm:grid-flow-col sm:grid-cols-display">
              <label className="text-left align-middle mb-2 sm:mb-0">Schedule Entries {index + 1}:</label>
              <textarea className="rounded-xl px-3 py-2 align-middle" value={scheduleEntries[index]} rows={5} onChange={(event) => handleScheduleEntryChange(index, event)} required />
            </div>
          </div>
        ))}

        <button onClick={processScheduleData}>Process Schedule Data</button>
      </div>

      <div className="border-2 border-blue-800"></div>

      <div className="grid grid-flow-row gap-1">
        {/* <h3 className="text-2xl">Overlapping Entries</h3> */}

        {/* Table Layout */}
        {/* <ConflictTable overlappedEntries={overlappedEntries} numCourses={numCourses}></ConflictTable> */}
        
        {overlappedEntries.length > 0 && (
        <>
          <h3 className="text-2xl">Overlapping Entries</h3>

          <table className="table-auto border-collapse mt-6">
            <thead>
              <tr className="bg-blue-800">
                <th className="border border-slate-600 py-4 text-xl">Item</th>
                <th className="border border-slate-600 py-4 text-xl">Entries</th>
              </tr>
            </thead>

            <tbody>
              {
                overlappedEntries.map((entry, index) => {
                  // console.log(entry)
                  return (
                    <>
                      <tr>
                        <td className="border border-slate-600 text-lg font-bold" rowSpan={entry.length}>{index + 1}</td>
                        <td className="border border-slate-600 py-2">Entry {entry[0].entryNum} :: {entry[0].course} :: {entry[0].date} :: {entry[0].time}</td>
                      </tr>

                      {entry.slice(2).map((subEntry, subIndex) => (
                        <tr>
                          <td className="border border-slate-600 py-2" key={`${index}-${subIndex}`}>
                            Entry {subEntry.entryNum} :: {subEntry.course} :: {subEntry.date} :: {subEntry.time}
                          </td>
                        </tr>
                      ))}

                      <tr>
                        <td className="border border-slate-600 py-2">Entry {entry[1].entryNum} :: {entry[1].course} :: {entry[1].date} :: {entry[1].time}</td>
                      </tr>
                    </>
                  )
                })
              }
            </tbody>
          </table>
        </>)}

        {/* Original Table View */}
        {/* <table className="table-auto border-collapse mt-6">
          <thead>
            <tr className="bg-blue-800">
              <th className="border border-slate-600 py-4 text-xl">Item</th>
              <th className="border border-slate-600 py-4 text-xl">Entries</th>
            </tr>
          </thead>

          <tbody>
            {
              overlappedEntries.map((entry, index) => {
                return (
                  <>
                    <tr>
                      <td className="border border-slate-600 text-lg font-bold" rowSpan={numCourses}>{index + 1}</td>
                      <td className="border border-slate-600 py-2">Entry {entry[0].entryNum} :: {entry[0].course} :: {entry[0].date} :: {entry[0].time}</td>
                    </tr>

                    <tr>
                      <td className="border border-slate-600 py-2">Entry {entry[1].entryNum} :: {entry[1].course} :: {entry[1].date} :: {entry[1].time}</td>
                    </tr>
                  </>
                )
              })
            }
          </tbody>
        </table> */}
        

        {/* Original List Layout */}
        {/* 
        <ul className="">
          {overlappedEntries.map((entry, index) => {
            return (
              <li key={index}>
                {entry.course} :: {entry.date} :: {entry.time}
              </li>
            )
          })}
        </ul>
        */}
      </div>
    </div>
  )
}

export default App
