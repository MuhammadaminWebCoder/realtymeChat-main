import { Search } from "lucide-react"
import { Input } from "../ui/input"

const SearchInput = () => {
  return (
    <div className="relative">
      <Input className="my-3 ps-8" placeholder="Search or start new chart"/>
      <Search size={18} className="absolute left-2 text-slate-500 transform top-[50%] -translate-y-1/2"/>
    </div>
  )
}

export default SearchInput
