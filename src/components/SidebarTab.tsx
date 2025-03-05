import { Link } from 'react-router-dom'

interface SidebarTabProps {
    name: string,
    iconUrl: string,
    active?: boolean
}

function SidebarTab({ name, iconUrl, active }:SidebarTabProps) {
  return (
    <Link
        to={"/" + name.toLowerCase()}
        className={`px-4 py-3 flex items-center ${
            active ? "bg-[#920B0B]" : "hover:bg-[#B25F5F]"
        }`}
    >
        <img
            src={iconUrl}
            width={24}
            height={24}
            className="mr-2"
        />
        <span
            className={`text-lg ${
                active ? "font-semibold" : "font-normal"
            }`}
        >
            {name}
        </span>
    </Link>
  )
}

export default SidebarTab