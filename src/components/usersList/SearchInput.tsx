import { Search } from "lucide-react"
import { Input } from "../ui/input"
import type React from "react"

const SearchInput:React.FC<{search: string, setSearch: (value: string) => void}> = ({search, setSearch}) => {
  return (
    <div className="relative px-5">
      <Input value={search} onChange={(e) => setSearch(e.target.value)} type="text" className="my-3 ps-8" placeholder="Search or start new chart"/>
      <Search size={18} className="absolute left-7 text-slate-500 transform top-[50%] -translate-y-1/2"/>
    </div>
  )
}

export default SearchInput
