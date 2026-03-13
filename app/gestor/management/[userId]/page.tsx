import UserDetailsEditor from "@/components/UserManagement/userDetailsEditor";

interface UserDetailsPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  const { userId } = await params;

  return (
    <div className="w-full flex flex-col gap-4 pb-8">
      <div className="w-full flex-1 px-4 md:px-8">
        <UserDetailsEditor userId={userId} />
      </div>
    </div>
  );
}

