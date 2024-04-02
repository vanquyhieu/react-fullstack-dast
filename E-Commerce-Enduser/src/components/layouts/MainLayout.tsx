import { Footer, Header } from '../partials';

export interface ILayout {
    children: React.ReactNode;
    isHeader?: boolean;
}

function MainLayout({ children, isHeader = true }: ILayout) {
    return (
        <div className="flex-col h-screen justify-between w-full p-0 m-0">
            {isHeader && <Header />}
            <div>{children}</div>
            <Footer />
        </div>
    );
}

export default MainLayout;
