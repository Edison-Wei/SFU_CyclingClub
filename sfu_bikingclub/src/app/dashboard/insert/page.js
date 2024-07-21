'use client'

import { useState } from "react";

export default function InsertRoute() {
    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    return (
        <>
            <div className="pt-4 md:px-24 px-14 h-screen">
                <div className="w-full p-5 flex flex-col bg-gray-100 rounded-xl shadow-xl">
                    <section className="grid grid-cols-2 justify-around">
                        <div className="flex flex-col">
                            <label className="">Ride Title</label>
                            <input type="" className="" onChange={(e) => (setTitle(e.target.value))} placeholder="Long Slow Ride..., Short Hard Ride..."></input>
                        </div>
                        <div className="">
                            <label className="">Difficulty</label>
                            <select onChange={(e) => (setDifficulty(e.target.value))}>
                                <option className="" value={"beginner"}>Beginner Ride</option>
                                <option className="" value={"intermediate"}>Intermediate Ride</option>
                                <option className="" value={"other"}>Other</option>
                            </select>
                            {difficulty == "other"? <input type="text" className="" onChange={(e) => (setDifficulty(e.target.value))}></input>: null}
                        </div>
                    </section>
                    <section className="">
                        <div className="">
                            <label className="">Ride Date:</label>
                            <input type="date" className="" onChange={(e) => (setDate(e.target.value))}></input>
                        </div>
                        <div className="">
                            <label className="">Start Time</label>
                            <input type="time" className="" onChange={(e) => (setStartTime(e.target.value))}></input>
                        </div>
                        <div className="">
                            <label className="">End Time</label>
                            <input type="time" className="" onChange={(e) => (setEndTime(e.target.value))}></input>
                        </div>
                    </section>
                    <section className="">
                        <label className="">GeoJSON</label>
                        <textarea className=""></textarea>
                    </section>
                </div>
            </div>
        </>
    );
}

const data = {
    title: "No active",
    gpx: "",
    difficulty: "null",
    distance: 0,
    start_date: "2024-01-01",
    start_time: "00:00",
    end_time: "00:00"
  }