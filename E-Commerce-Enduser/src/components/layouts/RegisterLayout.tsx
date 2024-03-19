import { Footer, RegisterHeader } from '../partials';
import { ILayout } from './MainLayout';

function RegisterLayout({ children, isHeader = true }: ILayout) {
    return (
        <div className="flex h-screen flex-col justify-between bg-[linear-gradient(-180deg,#f53d2d,#f63)]">
            {isHeader && <RegisterHeader />}
            <div className="flex-grow">{children}</div>
            <Footer />
        </div>
    );
}

export default RegisterLayout;
