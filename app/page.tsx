import CommunityGrid from "@/components/community-grid";
import { members } from "@/data/members";

export default function Home() {
	return <CommunityGrid members={members} />;
}
