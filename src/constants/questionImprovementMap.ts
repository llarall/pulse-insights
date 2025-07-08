export type QuestionImprovementEntry = {
	link: string;
	suggestions: string[];
};

export const questionImprovementMap: Record<string, QuestionImprovementEntry> =
	{
		"My instructor modeled and promoted inclusivity.": {
			link: "https://udlguidelines.cast.org/representation/perception/perspectives-identities/",
			suggestions: [
				"Incorporate a range of authors with various identities, including gender, race, different abilities, nationality, and socio-economic background.",
				"Recognize the range of people, cultures, and histories that contribute to current understanding.",
				"Attend to the ways in which people and cultures are being portrayed.",
				"Challenge stereotypical or harmful portrayals of people and cultures.",
				"Seek authentic, complex portrayals of people, cultures, histories, and world views.",
			],
		},
		"The course materials were accessible to me.": {
			link: "https://udlguidelines.cast.org/action-expression/interaction/assistive-technologies/",
			suggestions: [
				"Ensure navigation and interaction can be performed with a variety of tools, including keyboard, mouse, switch devices, and voice commands.",
				"Offer the ability to leverage alternate keyboard commands for mouse action.",
				"Use access to alternative keyboards (e.g., on-screen keyboards for touchscreens).",
				"Customize overlays for touch screens and keyboards.",
				"Select software that works seamlessly with keyboard alternatives.",
			],
		},
		"This course was structured so that I could work effectively with others who were different from me.":
			{
				link: "https://udlguidelines.cast.org/engagement/effort-persistence/collaboration/",
				suggestions: [
					"Create community agreements that emphasize learners\u2019 ideas for fostering collaboration, interdependence, and collective learning.",
					"Create teams with clear goals, roles, expectations, and responsibilities.",
					"Use prompts that guide learners in when and how to ask for help.",
					"Use prompts or protocols that guide learners to surface and share differing perspectives.",
					"Encourage and support opportunities for peer interactions and supports (e.g., peer tutors).",
					"Construct communities of learners engaged in common or differing interests, activities, or identities.",
					"Encourage questions to more fully understand concepts, ideas, and perspectives.",
				],
			},
		"My instructor addressed students' non-academic needs.": {
			link: "https://peer.asee.org/who-benefits-from-equitable-grading-a-case-study-from-a-core-electrical-and-computer-engineering-course.pdf",
			suggestions: ["Make late policy more flexible."],
		},
		"I had the necessary resources to achieve the course learning outcomes.": {
			link: "https://udlguidelines.cast.org/representation/perception/customize-display/",
			suggestions: [
				"Customize font, text size, spacing, background color, and text color.",
				"Adjust size and contrast of images and visual content.",
				"Allow customization of audio speed, volume, and visual layout.",
			],
		},
		"Course learning activities helped me connect to the content.": {
			link: "https://udlguidelines.cast.org/engagement/interests-identities/relevance-value-authenticity/",
			suggestions: [
				"Make activities culturally and socially relevant.",
				"Design authentic tasks that reflect clear purpose.",
				"Enable active participation and exploration.",
				"Encourage personal response, evaluation, and self-reflection.",
				"Foster imaginative and creative thinking.",
			],
		},
		"Feedback on test, assignments, and/or graded activities informed my thinking and learning.":
			{
				link: "https://udlguidelines.cast.org/engagement/effort-persistence/feedback/",
				suggestions: [
					"Offer feedback that encourages perseverance and self-awareness.",
					"Emphasize effort and improvement over competition.",
					"Provide timely, specific, and informative feedback.",
					"Model reflective strategies for growth.",
					"Encourage risk taking and perspective sharing.",
				],
			},
		"I felt like I belonged in this course.": {
			link: "",
			suggestions: [
				"Create opportunities for learners to define belonging and community.",
				"Encourage sharing of identity and joy through connection.",
				"Examine and address bias and exclusion.",
			],
		},
		"Students like me are REPRESENTED in my engineering major/minor.": {
			link: "",
			suggestions: [
				"Incorporate a diverse range of authors and contributors.",
				"Portray cultures and people authentically and complexly.",
				"Challenge stereotypes and harmful depictions.",
			],
		},
		"This course helped me believe I can SUCCEED in an engineering field.": {
			link: "",
			suggestions: [
				"Emphasize growth and capability through feedback.",
				"Highlight transferable and generalizable skills.",
				"Support scaffolding to connect to new contexts.",
			],
		},
		"Because of this course, I feel more likely to COMPLETE an engineering major/minor.":
			{
				link: "",
				suggestions: [
					"Clarify and restate long-term goals.",
					"Break goals into manageable short-term objectives.",
					"Connect excellence to cultural and identity relevance.",
				],
			},
		"Because of this course, I feel more like I BELONG in an engineering major/minor.":
			{
				link: "",
				suggestions: [
					"Foster a supportive culture around mistakes.",
					"Use inclusive communication practices like sign language or circle practice.",
					"Address exclusionary practices through group dialogue.",
				],
			},
		"Because of this course, I feel more SATISFIED with my engineering major/minor.":
			{
				link: "",
				suggestions: [
					"Make content personally and socially relevant.",
					"Encourage exploration and active participation.",
					"Incorporate self-reflection and creative thinking.",
				],
			},
		"This course was well organized.": {
			link: "",
			suggestions: [
				"Clearly post goals, objectives, and schedules.",
				"Use alerts to preview changes in schedule.",
				"Establish class routines.",
				"Use planning tools like checklists and templates.",
			],
		},
		"Course activities gave me the chance to show my progress towards course learning outcomes.":
			{
				link: "",
				suggestions: [
					"Provide frequent, scaffolded feedback opportunities.",
					"Use progress tracking tools like charts and prompts.",
					"Encourage self-monitoring and reflection.",
				],
			},
		"Directions and expectations for tests, assignments, and/or graded activities were clear.":
			{
				link: "",
				suggestions: [
					"Provide transcripts and checklists.",
					"Use models and examples to emphasize key ideas.",
					"Highlight key elements in visuals and text.",
				],
			},
		"Tests, assignments, and/or graded activities matched the course learning outcomes.":
			{
				link: "",
				suggestions: [
					"Align assessments with meaningful learning objectives.",
					"Use authentic, hands-on activities.",
					"Allow for exploratory and iterative practice.",
				],
			},
		"I had opportunities to develop professional skills.": {
			link: "",
			suggestions: [
				"Integrate teamwork, communication, and leadership tasks.",
				"Provide authentic, real-world assignments.",
				"Scaffold professional practice and feedback loops.",
			],
		},
		"I had opportunities to become a better learner.": {
			link: "",
			suggestions: [
				"Encourage self-reflection and personal strength awareness.",
				"Provide prompts and supports for emotional regulation.",
				"Use tools to track and reflect on progress.",
				"Enable social reflection opportunities.",
			],
		},
	};
