"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import {
	AdminField,
	AdminInput,
	AdminSelect,
} from "@/components/admin/forms/admin-field";
import { AdminImageField } from "@/components/admin/forms/admin-image-field";
import { AdminRepeater } from "@/components/admin/forms/admin-repeater";
import { AdminStickySaveBar } from "@/components/admin/forms/admin-sticky-save-bar";
import { useAdminForm } from "@/components/admin/forms/use-admin-form";
import type { AdminUserRecord } from "@/lib/admin/admin-users";
import type { ItineraryStop, UpcomingItinerary } from "@/lib/member-content";
import type { PastJourney } from "@/lib/past-journeys-content";

type EditableItinerary = UpcomingItinerary | PastJourney;
import { cn } from "@/lib/utils";

const tabs = [
	{ id: "profile", label: "Profile" },
	{ id: "upcoming", label: "Upcoming" },
	{ id: "past", label: "Past journeys" },
	{ id: "dna", label: "Travel DNA" },
	{ id: "referrals", label: "Referrals" },
	{ id: "concierge", label: "Concierge" },
] as const;

type UserTab = (typeof tabs)[number]["id"];

export function UserDetailView({ user }: { user: AdminUserRecord }) {
	const [activeTab, setActiveTab] = useState<UserTab>("profile");
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm(structuredClone(user));

	return (
		<>
			<AdminPageHeader
				title={user.name}
				description={user.email}
				action={
					<Link
						href="/member/upcoming"
						className="inline-flex h-8 items-center justify-center rounded-sm border border-luxinc-border px-3 font-sans text-xs text-luxinc-text transition-colors hover:border-luxinc-gold/50 hover:text-luxinc-gold"
					>
						Open member dashboard
					</Link>
				}
			/>
			<div className="grid gap-8 lg:grid-cols-[280px_1fr]">
				<AdminPanel>
					<div className="flex flex-col items-center text-center">
						<div className="relative size-20 overflow-hidden rounded-full ring-2 ring-luxinc-gold">
							<Image
								src={data.avatarSrc}
								alt=""
								fill
								className="object-cover"
								sizes="80px"
								unoptimized={data.avatarSrc.startsWith("blob:")}
							/>
						</div>
						<p className="mt-4 font-sans text-sm font-semibold text-luxinc-text">
							{data.name}
						</p>
						<p className="mt-1 font-sans text-sm text-luxinc-text-muted">
							{data.email}
						</p>
						<p className="mt-3 font-sans text-xs capitalize text-luxinc-text-muted">
							{data.role} · {data.status}
						</p>
					</div>
				</AdminPanel>
				<div>
					<div className="mb-6 flex flex-wrap gap-2 border-b border-luxinc-border/60">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTab(tab.id)}
								className={cn(
									"px-4 py-2 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold",
									activeTab === tab.id
										? "border-b-2 border-luxinc-gold text-luxinc-gold"
										: "text-luxinc-text-muted hover:text-luxinc-text",
								)}
							>
								{tab.label}
							</button>
						))}
					</div>
					{activeTab === "profile" ? (
						<AdminPanel title="Profile">
							<div className="grid gap-5 md:grid-cols-2">
								<AdminField label="Full name" htmlFor="user-name">
									<AdminInput
										id="user-name"
										value={data.name}
										onChange={(e) => setField("name", e.target.value)}
									/>
								</AdminField>
								<AdminField label="Email" htmlFor="user-email">
									<AdminInput
										id="user-email"
										value={data.email}
										onChange={(e) => setField("email", e.target.value)}
									/>
								</AdminField>
								<AdminField label="Phone" htmlFor="user-phone">
									<AdminInput
										id="user-phone"
										value={data.phone ?? ""}
										onChange={(e) => setField("phone", e.target.value)}
									/>
								</AdminField>
								<AdminField label="Role" htmlFor="user-role">
									<AdminSelect
										id="user-role"
										value={data.role}
										onChange={(e) =>
											setField("role", e.target.value as AdminUserRecord["role"])
										}
									>
										<option value="member">Member</option>
										<option value="admin">Admin</option>
									</AdminSelect>
								</AdminField>
								<AdminField label="Status" htmlFor="user-status">
									<AdminSelect
										id="user-status"
										value={data.status}
										onChange={(e) =>
											setField(
												"status",
												e.target.value as AdminUserRecord["status"],
											)
										}
									>
										<option value="active">Active</option>
										<option value="disabled">Disabled</option>
									</AdminSelect>
								</AdminField>
							</div>
							<div className="mt-5">
								<AdminImageField
									label="Avatar"
									imageSrc={data.avatarSrc}
									imageAlt=""
									onImageSrcChange={(value) => setField("avatarSrc", value)}
									onImageAltChange={() => undefined}
								/>
							</div>
						</AdminPanel>
					) : null}
					{activeTab === "upcoming" || activeTab === "past" ? (
						<ItineraryTab
							label={activeTab === "upcoming" ? "Upcoming itineraries" : "Past journeys"}
							items={activeTab === "upcoming" ? data.upcoming : data.pastJourneys}
							onChange={(items) =>
								setField(activeTab === "upcoming" ? "upcoming" : "pastJourneys", items)
							}
							showRateCta={activeTab === "past"}
						/>
					) : null}
					{activeTab === "dna" ? (
						<AdminPanel title="Travel DNA">
							<AdminField label="Chart period" htmlFor="dna-period">
								<AdminInput
									id="dna-period"
									value={data.travelDnaPeriod}
									onChange={(e) =>
										setField(
											"travelDnaPeriod",
											e.target.value as AdminUserRecord["travelDnaPeriod"],
										)
									}
								/>
							</AdminField>
							<p className="mt-4 font-sans text-sm text-luxinc-text-muted">
								Location bars, preferred destinations, and topic rankings use the
								same structure as the member Travel DNA page. Full per-field
								editing will connect when persistence is added.
							</p>
						</AdminPanel>
					) : null}
					{activeTab === "referrals" ? (
						<AdminPanel title="Referral programmes">
							{data.referralProgrammes.map((programme, index) => (
								<div
									key={programme.id}
									className="mb-4 border border-luxinc-border/40 p-4 last:mb-0"
								>
									<AdminField
										label="Referral link"
										htmlFor={`ref-link-${index}`}
									>
										<AdminInput
											id={`ref-link-${index}`}
											value={programme.referralLink}
											onChange={(e) => {
												const referralProgrammes = [...data.referralProgrammes];
												referralProgrammes[index] = {
													...programme,
													referralLink: e.target.value,
												};
												setField("referralProgrammes", referralProgrammes);
											}}
										/>
									</AdminField>
									<p className="mt-2 font-sans text-sm text-luxinc-text">
										{programme.title}
									</p>
								</div>
							))}
						</AdminPanel>
					) : null}
					{activeTab === "concierge" ? (
						<AdminPanel title="Concierge">
							<p className="font-sans text-sm text-luxinc-text-muted">
								Concierge threads are read-only in this preview. Members can chat
								from the member dashboard; clearing history will be available
								when the API is connected.
							</p>
							<button
								type="button"
								disabled
								className="mt-4 inline-flex h-10 items-center rounded-md border border-luxinc-border px-4 font-sans text-sm text-luxinc-text-muted opacity-50"
							>
								Clear chat history
							</button>
						</AdminPanel>
					) : null}
					{activeTab === "profile" ? (
						<AdminPanel title="Danger zone" className="mt-6">
							<p className="font-sans text-sm text-luxinc-text-muted">
								Disable or delete this account. Actions are preview-only until
								persistence is connected.
							</p>
							<div className="mt-4 flex flex-wrap gap-3">
								<button
									type="button"
									className="h-10 rounded-md border border-[#FF7F50] px-4 font-sans text-sm text-[#FF7F50]"
								>
									Disable account
								</button>
								<button
									type="button"
									className="h-10 rounded-md border border-[#FF7F50] px-4 font-sans text-sm text-[#FF7F50]"
								>
									Delete user
								</button>
							</div>
						</AdminPanel>
					) : null}
				</div>
			</div>
			<AdminStickySaveBar
				isDirty={isDirty}
				isSaving={isSaving}
				saveMessage={saveMessage}
				onSave={save}
				onDiscard={discard}
			/>
		</>
	);
}

function ItineraryTab({
	label,
	items,
	onChange,
	showRateCta,
}: {
	label: string;
	items: EditableItinerary[];
	onChange: (items: EditableItinerary[]) => void;
	showRateCta?: boolean;
}) {
	return (
		<AdminPanel>
			<AdminRepeater<EditableItinerary>
				label={label}
				items={items}
				onChange={onChange}
				createItem={() => ({
					id: `itinerary-${Date.now()}`,
					destination: "",
					travelDate: "",
					image: "/images/sd3.png",
					imageAlt: "",
					stops: [{ time: "8:00 AM", activity: "" }],
				})}
				getKey={(item) => item.id}
				renderItem={(item, index, update) => (
					<div className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<AdminField label="Destination" htmlFor={`dest-${item.id}`}>
								<AdminInput
									id={`dest-${item.id}`}
									value={item.destination}
									onChange={(e) => update({ destination: e.target.value })}
								/>
							</AdminField>
							<AdminField label="Travel date" htmlFor={`date-${item.id}`}>
								<AdminInput
									id={`date-${item.id}`}
									value={item.travelDate}
									onChange={(e) => update({ travelDate: e.target.value })}
								/>
							</AdminField>
						</div>
						<AdminImageField
							label="Image"
							imageSrc={item.image}
							imageAlt={item.imageAlt}
							onImageSrcChange={(value) => update({ image: value })}
							onImageAltChange={(value) => update({ imageAlt: value })}
						/>
						<StopsRepeater
							stops={item.stops}
							onChange={(stops) => update({ stops })}
						/>
						{showRateCta ? (
							<AdminField label="CTA label" htmlFor={`cta-${item.id}`}>
								<AdminInput
									id={`cta-${item.id}`}
									defaultValue="Rate Your Experience"
									disabled
								/>
							</AdminField>
						) : null}
					</div>
				)}
			/>
		</AdminPanel>
	);
}

function StopsRepeater({
	stops,
	onChange,
}: {
	stops: ItineraryStop[];
	onChange: (stops: ItineraryStop[]) => void;
}) {
	return (
		<AdminRepeater<ItineraryStop>
			label="Itinerary stops"
			items={stops}
			onChange={onChange}
			createItem={() => ({ time: "", activity: "" })}
			getKey={(stop, index) => `${stop.time}-${index}`}
			renderItem={(stop, _index, update) => (
				<div className="grid gap-3 md:grid-cols-2">
					<AdminField label="Time" htmlFor={`stop-time-${stop.time}`}>
						<AdminInput
							id={`stop-time-${stop.time}`}
							value={stop.time}
							onChange={(e) => update({ time: e.target.value })}
						/>
					</AdminField>
					<AdminField label="Activity" htmlFor={`stop-act-${stop.activity}`}>
						<AdminInput
							id={`stop-act-${stop.activity}`}
							value={stop.activity}
							onChange={(e) => update({ activity: e.target.value })}
						/>
					</AdminField>
				</div>
			)}
		/>
	);
}
