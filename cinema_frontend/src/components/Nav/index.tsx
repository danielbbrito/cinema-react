import { Link, useLocation } from "react-router-dom";

export const Nav = () => {
    const location = useLocation();
    
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <i className="bi bi-film me-2"></i>
                    CineWeb
                </Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${location.pathname === "/" ? "active" : ""}`} 
                                aria-current={location.pathname === "/" ? "page" : undefined} 
                                to="/"
                            >
                                <i className="bi bi-house-door me-1"></i>
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${location.pathname.startsWith("/filmes") ? "active" : ""}`} 
                                aria-current={location.pathname.startsWith("/filmes") ? "page" : undefined} 
                                to="/filmes"
                            >
                                <i className="bi bi-film me-1"></i>
                                Filmes
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${location.pathname.startsWith("/salas") ? "active" : ""}`} 
                                aria-current={location.pathname.startsWith("/salas") ? "page" : undefined} 
                                to="/salas"
                            >
                                <i className="bi bi-door-open me-1"></i>
                                Salas
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${location.pathname.startsWith("/sessoes") ? "active" : ""}`} 
                                aria-current={location.pathname.startsWith("/sessoes") ? "page" : undefined} 
                                to="/sessoes"
                            >
                                <i className="bi bi-calendar-event me-1"></i>
                                Sessões
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${location.pathname.startsWith("/lancheCombos") ? "active" : ""}`} 
                                aria-current={location.pathname.startsWith("/lancheCombos") ? "page" : undefined} 
                                to="/lancheCombos"
                            >
                                <i className="bi bi-cup-hot me-1"></i>
                                Lanche Combos
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${location.pathname.startsWith("/pedidos") ? "active" : ""}`} 
                                aria-current={location.pathname.startsWith("/pedidos") ? "page" : undefined} 
                                to="/pedidos"
                            >
                                <i className="bi bi-receipt me-1"></i>
                                Pedidos
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}