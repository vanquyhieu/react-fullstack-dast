import { Footer, Header } from '../partials';

export interface ILayout {
    children: React.ReactNode;
    isHeader?: boolean;
}

function MainLayout({ children, isHeader = true }: ILayout) {
    return (
        <div>
            {isHeader && <Header />}
            <div>{children}</div>
            <Footer />
        </div>
    );
}

export default MainLayout;
