import { searchUsers } from "@/lib/database"
import UserCard from "@/components/user-card"

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ""
  const users = query ? searchUsers(query) : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
        {query && (
          <p className="text-gray-600">
            Results for "{query}" ({users.length} found)
          </p>
        )}
      </div>

      {users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {query ? "No users found matching your search." : "Enter a search term to find users."}
          </p>
        </div>
      )}
    </div>
  )
}
