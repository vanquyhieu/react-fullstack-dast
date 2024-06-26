import useAuth from "../../hooks/useAuth";
import { getAvatarUrl } from "../../utils";

function Avatar() {
    const {user} = useAuth()
    return (
        <div className="flex-center cursor-pointer">
            <div className="mr-2 h-6 w-6 flex-shrink-0">
                <img
                    src={getAvatarUrl(user?.avatar)}
                    alt={user?.name || ''}
                    className="h-full w-full rounded-full object-cover"
                />
            </div>
            <p className="text-white/80">{user?.email}</p>
        </div>
    );
}

export default Avatar;
