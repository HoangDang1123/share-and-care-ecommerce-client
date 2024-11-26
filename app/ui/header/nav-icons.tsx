import Search from './icons/search';
import User from './icons/user';
import Cart from './icons/cart';
import { useAuth } from "@/app/context/AuthContext";

export default function NavIcons() {
    const { isLogin } = useAuth();

    return (
        <div className="flex space-x-6">
            <Search />
            <User isLogin={isLogin} />
            <Cart isLogin={isLogin} />
        </div>
    )
}
