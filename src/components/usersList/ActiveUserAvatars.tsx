import { EllipsisVertical } from "lucide-react"

const ActiveUserAvatars = () => {
  const avatar:string[] = [
  ]
  return (
    <div>
        <div className="flex justify-between">
          <p className="font-semibold text-lg">Active User</p>
          <EllipsisVertical className="text-green-500 cursor-pointer"/>
        </div>
        <div className="flex gap-4 my-2">
            {avatar.length > 0 ? (avatar?.map((item:string | undefined,index:number) => <div key={index} className="relative rounded-full w-10 h-10">
              <img className="rounded-full w-full h-full" src={item} alt="users active  img" />
              <span className="border w-3 h-3 rounded-full bg-green-500 absolute right-0 bottom-0"></span>
            </div>)) : (<p className="font-semibold text-md text-slate-400">No Active User</p>)}
        </div>
    </div>
  )
}

export default ActiveUserAvatars
