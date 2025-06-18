import { EllipsisVertical } from "lucide-react"

const ActiveUserAvatars = () => {
  const avatar = [
    'https://themost.com.tr/wp-content/uploads/2023/04/tm-men1_0000_Evansite95-2.jpg',
    'https://themost.com.tr/wp-content/uploads/2023/04/tm-men1_0000_Evansite95-2.jpg',
    'https://themost.com.tr/wp-content/uploads/2023/04/tm-men1_0000_Evansite95-2.jpg',
    'https://themost.com.tr/wp-content/uploads/2023/04/tm-men1_0000_Evansite95-2.jpg',
    'https://themost.com.tr/wp-content/uploads/2023/04/tm-men1_0000_Evansite95-2.jpg',
  ]
  return (
    <div>
        <div className="flex justify-between">
          <p className="font-semibold text-lg">Active User</p>
          <EllipsisVertical className="text-green-500 cursor-pointer"/>
        </div>
        <div className="flex gap-4 my-2">
            {avatar.map((item:string,index:number) => <div key={index} className="relative rounded-full w-10 h-10">
              <img className="rounded-full w-full h-full" src={item} alt="users active  img" />
              <span className="border w-3 h-3 rounded-full bg-green-500 absolute right-0 bottom-0"></span>
            </div>)}
        </div>
    </div>
  )
}

export default ActiveUserAvatars
