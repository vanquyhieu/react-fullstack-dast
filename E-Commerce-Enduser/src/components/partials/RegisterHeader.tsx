import { Link, useMatch } from 'react-router-dom';
import { Logo } from '../icons';

function RegisterHeader() {

    return (
        <header className="container">
            <nav className="flex-center mx-6">
                <Link to="/" className="flex h-32 w-32">
                    <Logo className="fill-white" />
                </Link>
                
            </nav>
        </header>
    );
}

export default RegisterHeader;
