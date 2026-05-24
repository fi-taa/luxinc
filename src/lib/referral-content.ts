export interface ReferralProgramme {
	id: string;
	image: string;
	imageAlt: string;
	title: string;
	description: string;
	referralLink: string;
}

export const referralProgrammes: ReferralProgramme[] = [
	{
		id: "east-africa-voyage",
		image: "/images/c3.png",
		imageAlt: "Luxury East African voyage referral ticket for Ethiopia and Tanzania",
		title: "Invite Friends & Earn Travel Rewards",
		description:
			"Give your friends €20 off and earn points for every successful booking",
		referralLink: "https://luxinc.com/ref/daniel-alemayehu",
	},
	{
		id: "east-africa-kenya",
		image: "/images/j.png",
		imageAlt: "Luxury East African voyage referral ticket for Ethiopia, Tanzania, and Kenya",
		title: "Invite Friends & Earn Travel Rewards",
		description:
			"Give your friends €20 off and earn points for every successful booking",
		referralLink: "https://luxinc.com/ref/daniel-alemayehu-kenya",
	},
];
