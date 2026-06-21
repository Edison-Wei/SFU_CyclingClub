"use client"

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { RawExecutiveNSponsor } from "@/types/ClubType";

async function fetchExecutiveNSponsorData(): Promise<RawExecutiveNSponsor[]> {
    try {
        const res = await fetch("/api/executivensponsor", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error(`HTTP Error status: ${res.status}`);
        const data = await res.json();
        return data.results || data || [];
    } catch (error) {
        console.error("Failed to load Executive & Sponsor configurations: ", error);
        return [];
    }
}

function ExecSponsorContent() {
    const [items, setItems] = useState<RawExecutiveNSponsor[]>([]);
    const [selectedItem, setSelectedItem] = useState<RawExecutiveNSponsor | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [link, setLink] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchExecutiveNSponsorData();

            setItems(data)
            if (data.length > 0) {
                selectItem(data[0])
            }
        }
        loadData()
        setIsLoading(false)
    }, []);

    function selectItem(item: RawExecutiveNSponsor) {
        setSelectedItem(item);
        setName(item.name || "");
        setRole(item.role || "");
        setLink(item.link || "");
        setDescription(item.description || "");
        setFormError(null);
        setFormSuccess(null);
    }

    // Dynamically setup an un-saved raw entry skeleton to register a brand new item
    function handleAddNewItem(type: "executive" | "sponsor") {
        const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
        const placeholderItem: RawExecutiveNSponsor = {
            id: newId,
            name: `New ${type === "executive" ? "Executive Member" : "Corporate Sponsor"}`,
            role: type === "executive" ? "Executive Role Title" : "",
            link: type === "sponsor" ? "https://" : "",
            description: "Provide short background profile details here...",
        };

        setItems((prev) => [...prev, placeholderItem]);
        selectItem(placeholderItem);
    }

    async function handleSaveChanges(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedItem) return;

        setFormError(null);
        setFormSuccess(null);
        setIsSubmitting(true);

        // Patch the single modified profile entry inside local matrix arrays
        const updatedItems = items.map((item) => {
            if (item.id === selectedItem.id) {
                return { ...item, name, role, link, description };
            }
            return item;
        });

        try {
            const res = await fetch("/api/modifyexecspon", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedItems), // Passing full raw config matrix layout back
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Server rejected profile batch configurations updates.");
            }

            setItems(updatedItems);
            setSelectedItem({ ...selectedItem, name, role, link, description });
            setFormSuccess("Profile records mapped and safely deployed on server nodes.");
        } catch (error: any) {
            setFormError(error.message || "Failed to save data matrix alterations.");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDeleteItem(id: number) {
        const confirmDelete = confirm("Are you sure you want to drop this record from master logs? This will sync instantly on save.");
        if (!confirmDelete) return;

        const filteredItems = items.filter(item => item.id !== id);
        setItems(filteredItems);

        try {
            // TODO: Change endpoint
            const res = await fetch("/api/modifyexecspon", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filteredItems),
            });

            if (!res.ok) throw new Error("Sync failed during asset deletion sequence parsing.");

            setSelectedItem(filteredItems.length > 0 ? filteredItems[0] : null);
            setFormSuccess("Dropped row configuration parsed and committed successfully.");
        } catch (error: any) {
            setFormError(error.message || "Dropped context synchronization failure.");
        }
    }

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            <div className="px-8 pt-6 pb-6 border-b border-base-300 bg-base-100">
                <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <p className="text-secondary text-xs uppercase tracking-[0.2em] font-semibold mb-1">Executive Portal</p>
                        <h1 className="text-primary text-3xl font-bold tracking-tight">Organization Profile Manager</h1>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleAddNewItem("executive")}
                            className="btn btn-primary btn-sm font-bold text-primary-content"
                        >
                            + Add Executive
                        </button>
                        <button
                            onClick={() => handleAddNewItem("sponsor")}
                            className="btn btn-outline btn-sm font-bold hover:bg-base-300 hover:text-base-content"
                        >
                            + Add Sponsor
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                <div className="w-full lg:col-span-5 h-[50vh] lg:h-[65vh] flex flex-col bg-base-200 rounded-box border border-base-300 shadow-sm overflow-hidden">
                    <div className="flex border-b border-base-300 bg-base-100 px-4 py-3">
                        <span className="text-sm font-bold tracking-wider uppercase text-primary">Active Directory Records</span>
                    </div>

                    <div className="grid grid-cols-6 px-4 py-2 bg-base-100 border-b border-base-300">
                        <span className="col-span-4 text-[10px] uppercase tracking-widest font-bold text-secondary">Profile Identity</span>
                        <span className="col-span-2 text-[10px] uppercase tracking-widest font-bold text-secondary text-right">Entity Group</span>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-base-300">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full text-secondary text-xs font-medium animate-pulse">
                                Assembling system profiles data logs...
                            </div>
                        ) : items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-secondary py-16 text-center p-4">
                                <span className="text-3xl opacity-20 mb-1">👥</span>
                                <p className="text-xs font-semibold">Master index registry context blocks appear blank.</p>
                            </div>
                        ) : (
                            items.map((item) => {
                                const isExec = !!item.role;
                                const isActive = selectedItem?.id === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => selectItem(item)}
                                        className={`w-full grid grid-cols-6 items-center px-4 py-3.5 text-left transition-all hover:bg-base-300/60 ${isActive ? "bg-base-300 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                                            }`}
                                    >
                                        <div className="col-span-4 truncate pr-2">
                                            <span className="text-primary font-semibold text-sm block truncate">{item.name || "Unnamed Resource"}</span>
                                            <span className="text-secondary text-[11px] font-mono tracking-tighter opacity-70 block truncate">
                                                {isExec ? item.role : item.link}
                                            </span>
                                        </div>
                                        <span className={`col-span-2 text-[10px] font-bold tracking-wider uppercase text-right self-center ${isExec ? "text-info" : "text-success"
                                            }`}>
                                            {isExec ? "Executive" : "Sponsor"}
                                        </span>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    <div className="px-4 py-2 border-t border-base-300 bg-base-100">
                        <p className="text-[10px] text-secondary uppercase tracking-widest font-medium">
                            {items.length} entity channels cached locally
                        </p>
                    </div>
                </div>

                <div className="w-full lg:col-span-7 flex flex-col bg-base-200 rounded-box border border-base-300 shadow-sm overflow-hidden min-h-[450px]">
                    {selectedItem ? (
                        <form onSubmit={handleSaveChanges} className="p-6 flex flex-col gap-5 text-sm h-full justify-between bg-base-100">
                            <div className="flex flex-col gap-5">
                                <div className="border-b border-base-300 pb-3 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-primary text-xl font-bold tracking-tight">Record Workspace Profile</h2>
                                        <p className="text-secondary text-[10px] uppercase tracking-wider font-semibold mt-0.5">
                                            Type Variant Entity Category: <span className="text-base-content font-bold">{selectedItem.role ? "Executive Officer" : "Commercial Sponsor Link"}</span>
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteItem(selectedItem.id)}
                                        className="btn btn-ghost btn-xs text-error hover:bg-error/10 font-bold tracking-wider"
                                    >
                                        DROP RECORD
                                    </button>
                                </div>

                                {formError && <div className="bg-error/10 border border-error/20 text-error p-3 rounded text-xs font-medium">{formError}</div>}
                                {formSuccess && <div className="bg-success/10 border border-success/20 text-success p-3 rounded text-xs font-medium">{formSuccess}</div>}

                                {/* Common Identity Parameter Field */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-semibold text-xs uppercase tracking-wider text-secondary">Individual Name / Corporate Title</label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full bg-base-100 font-medium"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                {selectedItem.role ? (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="font-semibold text-xs uppercase tracking-wider text-secondary">Official Assigned Role Designation</label>
                                        <input
                                            type="text"
                                            className="input input-bordered w-full bg-base-100 text-base-content font-semibold"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            placeholder="e.g. Club Treasurer / President"
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="font-semibold text-xs uppercase tracking-wider text-secondary">Redirect Target Partner Link URL</label>
                                        <input
                                            type="url"
                                            className="input input-bordered w-full bg-base-100 text-success font-mono text-xs"
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                            placeholder="https://sponsorwebsite.com"
                                            required
                                        />
                                    </div>
                                )}

                                {/* Common Description Workspace Memo Block */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-semibold text-xs uppercase tracking-wider text-secondary">Operational Biography / Profile Details Statement</label>
                                    <textarea
                                        className="textarea textarea-bordered h-36 w-full bg-base-100 leading-relaxed text-sm"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Provide descriptions defining operational scopes, details, sponsorships bounds..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Form Actions Footer Panel controls */}
                            <div className="border-t border-base-300 pt-4 flex justify-end mt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn btn-primary btn-sm px-6 font-bold tracking-wide text-primary-content shadow-sm"
                                >
                                    {isSubmitting ? "Syncing..." : "Apply Local Updates"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-secondary gap-2 p-12 bg-base-100">
                            <span className="text-4xl opacity-20">⚙️</span>
                            <p className="text-xs uppercase tracking-widest font-semibold">Select an entity row reference to alter configurations</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default function ExecSponsorDashboard() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <p className="text-secondary text-sm font-medium animate-pulse">Syncing Corporate Asset Arrays...</p>
            </div>
        }>
            <ExecSponsorContent />
        </Suspense>
    );
}