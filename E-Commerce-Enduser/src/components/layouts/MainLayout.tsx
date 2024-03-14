import { Footer, Header } from '../partials';

export interface ILayout {
    children: React.ReactNode;
    isHeader?: boolean;
}

function MainLayout({ children, isHeader = true }: ILayout) {
    return (
        <div className="flex h-screen flex-col justify-between w-full p-0 m-0">
            {isHeader && <Header />}
            <div className="flex-grow w-full">{children}</div>
            <Footer />
        </div>
    );
}

export default MainLayout;
