import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, Globe, Calendar, File, Wifi, WifiOff, AlertTriangle, Loader2, AlertCircle,Trash2,ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
    FaWordpress,
    FaJoomla,
    FaDrupal,
    FaMagento,
    FaShopify,
    FaSquarespace,
    FaGhost,
    FaBan,
    FaQuestionCircle, FaWix, FaQuestion, FaPrescription
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import prestashop from '../assets/prestashop.png';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Animation configurations
const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
};

const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

// Composant DomainDetailsPopup animé
const DomainDetailsPopup = ({ isOpen, onClose, domainData }) => {
    if (!isOpen || !domainData) return null;

    const cmsDetail = domainData.cms_detail || {};
    const whoisDetail = domainData.whois_detail || {};
    const networkDetail = domainData.network_detail || {};

    const data = {
        name: domainData.nom || 'N/A',
        status: domainData.en_ligne === 1 ? 'Online' : 'Offline',
        expirationDate: domainData.date_expiration || 'N/A',
        cms: cmsDetail.cms || 'none',
        lastCheck: new Date().toLocaleString(),
        ipAddress: networkDetail.adress_ip || 'N/A',
        serverLocation: networkDetail.server_location || 'N/A',
        sslCertificate: networkDetail.ssl_expiration ? 'Valid' : 'Invalid',
        responseTime: networkDetail.ping ? `${networkDetail.ping}ms` : 'N/A',
        version: cmsDetail.version || 'N/A',
        theme: cmsDetail.theme || 'N/A',
        plugins_detectes: cmsDetail.plugins_detectes || 'N/A',
        date_creation: whoisDetail.date_creation || 'N/A',
        registrar: whoisDetail.registrar || 'N/A',
        dns: whoisDetail.dns || 'N/A',
        networkStatus: 'Connected'
    };

    const getNetworkStatusIcon = (status) => {
        switch (status) {
            case 1: return <Wifi size={24} className="text-green-600" />;
            case 0: return <WifiOff size={24} className="text-red-600" />;
            case 'Unstable': return <AlertTriangle size={24} className="text-yellow-600" />;
            default: return <Wifi size={24} className="text-gray-600" />;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                            <motion.div
                                initial={{ x: -20 }}
                                animate={{ x: 0 }}
                            >
                                <h1 className="text-2xl font-bold text-gray-900">Domain Details</h1>
                                <p className="text-gray-500 text-sm mt-1">Explore detailed information about {data.name}</p>
                            </motion.div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Close"
                            >
                                <X size={24} className="text-gray-500" />
                            </motion.button>
                        </div>

                        <motion.div
                            className="p-6 space-y-8"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Domain Overview */}
                            <motion.section variants={fadeIn}>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Domain Overview</h2>
                                <div className="space-y-3">
                                    {[
                                        { icon: <Globe size={24} className="text-[#00D09C]" />, title: "Domain Status", value: data.status, color: data.status === 'Online' ? 'text-green-600' : 'text-red-600' },
                                        { icon: <Calendar size={24} className="text-[#702FFF]" />, title: "Expiration Date", value: data.expirationDate, color: "text-gray-500" },
                                        { icon: <File size={24} className="text-[#060014]" />, title: "CMS Detection", value: data.cms, color: "text-gray-500" }
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            variants={slideUp}
                                            className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="bg-[#00D09C]/10 p-3 rounded-lg">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item.title}</p>
                                                <p className={`text-sm ${item.color}`}>{item.value}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>

                            {/* Current Status */}
                            <motion.section variants={fadeIn}>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Current Status</h2>
                                <div className="space-y-4">
                                    {[
                                        { label: "Domain Name", value: data.name },
                                        { label: "IP Address", value: data.ipAddress },
                                        { label: "Server Location", value: data.serverLocation },
                                        { label: "SSL Certificate", value: data.sslCertificate },
                                        { label: "Response Time", value: data.responseTime }
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            variants={slideUp}
                                            className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200"
                                        >
                                            <p className="text-gray-500 text-sm">{item.label}</p>
                                            <p className="text-gray-900 text-sm col-span-2">{item.value}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>

                            {/* CMS Details */}
                            <motion.section variants={fadeIn}>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">CMS Details</h2>
                                <div className="space-y-4">
                                    {[
                                        { label: "CMS Version", value: data.version },
                                        { label: "Theme", value: data.theme },
                                        { label: "Detected Plugins", value: data.plugins_detectes }
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            variants={slideUp}
                                            className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200"
                                        >
                                            <p className="text-gray-500 text-sm">{item.label}</p>
                                            <p className="text-gray-900 text-sm col-span-2">{item.value}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>

                            {/* Network Status Check */}
                            <motion.section variants={fadeIn}>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Network Status</h2>
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    variants={staggerContainer}
                                >
                                    {[
                                        {
                                            icon: getNetworkStatusIcon(domainData.en_ligne),
                                            title: "Network Status",
                                            value: domainData.en_ligne === 1 ? 'Connected' : 'Disconnected',
                                            color: domainData.en_ligne === 1 ? 'text-green-600' : domainData.en_ligne === 0 ? 'text-red-600' : 'text-yellow-600',
                                            description: "Last checked: " + data.lastCheck
                                        },
                                        {
                                            icon: <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            </div>,
                                            title: "Ping",
                                            value: data.responseTime,
                                            description: "Latency to server"
                                        },
                                        {
                                            icon: <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            </div>,
                                            title: "HTTP Status",
                                            value: networkDetail.http_status || 'N/A',
                                            description: "HTTP response code"
                                        },
                                        {
                                            icon: <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                            </div>,
                                            title: "SSL Expiration",
                                            value: data.sslCertificate,
                                            description: "Certificate status"
                                        }
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            variants={slideUp}
                                            className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow"
                                            whileHover={{ y: -5 }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.title}</p>
                                                    <p className={`text-2xl font-bold ${item.color || 'text-gray-900'}`}>{item.value}</p>
                                                </div>
                                                {item.icon}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">{item.description}</p>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.section>

                            {/* WHOIS Information */}
                            <motion.section variants={fadeIn}>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">WHOIS Information</h2>
                                <div className="space-y-4">
                                    {[
                                        { label: "Creation Date", value: data.date_creation },
                                        { label: "Registrar", value: data.registrar },
                                        { label: "DNS Servers", value: data.dns }
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            variants={slideUp}
                                            className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200"
                                        >
                                            <p className="text-gray-500 text-sm">{item.label}</p>
                                            <p className="text-gray-900 text-sm col-span-2">{item.value}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Composant CmsIcon animé
const CmsIcon = ({ cms }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getIcon = () => {
        switch (cms?.toLowerCase()) {
            case 'wordpress': return <FaWordpress className="text-blue-600" size={20} title="WordPress" />;
            case 'joomla': return <FaJoomla className="text-red-600" size={20} title="Joomla" />;
            case 'drupal': return <FaDrupal className="text-blue-400" size={20} title="Drupal" />;
            case 'magento': return <FaMagento className="text-orange-600" size={20} title="Magento" />;
            case 'shopify': return <FaShopify className="text-green-600" size={20} title="Shopify" />;
            case 'squarespace': return <FaSquarespace className="text-gray-700" size={20} title="Squarespace" />;
            case 'ghost': return <FaGhost className="text-gray-800" size={20} title="Ghost" />;
            case 'wix': return <FaWix className="text-gray-800" size={20} title="wix" />;
            case 'prestashop': return <img src={prestashop} alt="Prestashop" width={20} height={20} title="Prestashop" />;
            case 'inconnu': return <FaQuestionCircle className="text-black-900" size={20} title="No CMS" />;
            case 'inaccessible': return <FaBan className="text-gray-600" size={20} title="Unknown CMS" />;
            default: return <FaQuestion className="text-gray-800" size={20} title="Error" />;
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.2 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="flex justify-center"
        >
            {getIcon()}
            {isHovered && (
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded mt-6"
                >
                    {cms || 'No CMS'}
                </motion.span>
            )}
        </motion.div>
    );
};



const Home = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [domains, setDomains] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [domainToDelete, setDomainToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);

    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        if (token) localStorage.setItem("token", token);
    }, [location]);

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Non authentifié");

                const response = await fetch(`${API_BASE_URL}/domaines?ts=${Date.now()}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "Cache-Control": "no-cache",
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch domains");

                const data = await response.json();
                console.log("Données reçues de l'API:", data);
                setDomains(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load domains");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDomains();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // 🔹 Correction du mapping des données
    const filteredDomains = useMemo(() => {
        if (!domains || !Array.isArray(domains)) return [];

        return domains
            .filter((domain) => {
                const domainName = domain.nom || domain.name || '';
                return domainName.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .map((domain) => {
                // Débogage pour voir la structure de chaque domaine
                console.log("Domaine brut:", domain);

                // Déterminer le CMS avec une logique plus robuste
                let cmsValue = "none";
                if (domain.cms_detail && domain.cms_detail.cms) {
                    cmsValue = domain.cms_detail.cms;
                } else if (domain.cms) {
                    cmsValue = domain.cms;
                } else if (domain.en_ligne !== 1) {
                    cmsValue = "inaccessible";
                }

                // Déterminer la date d'expiration
                let expirationDate = "N/A";
                if (domain.date_expiration) {
                    expirationDate = domain.date_expiration;
                } else if (domain.expiration) {
                    expirationDate = domain.expiration;
                }

                // Déterminer la date de dernière vérification
                let lastCheckedDate = new Date().toLocaleString();
                if (domain.updated_at) {
                    lastCheckedDate = new Date(domain.updated_at).toLocaleString();
                } else if (domain.last_scan_at) {
                    lastCheckedDate = new Date(domain.last_scan_at).toLocaleString();
                }

                return {
                    id: domain.id,
                    name: domain.nom || domain.name || "Sans nom",
                    status: domain.en_ligne === 1 ? "Online" : "Offline",
                    expiration: expirationDate,
                    cms: cmsValue,
                    lastChecked: lastCheckedDate,
                    // Garder une référence à l'objet original pour les détails
                    originalData: domain
                };
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [domains, searchTerm]);

    // Afficher la structure des données filtrées pour le débogage
    useEffect(() => {
        console.log("Données filtrées pour l'UI:", filteredDomains);
    }, [filteredDomains]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDomains = filteredDomains.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredDomains.length / itemsPerPage);

    const handleShowDetails = async (domain) => {
        try {
            // Utiliser l'originalData si disponible, sinon faire une requête
            if (domain.originalData) {
                setSelectedDomain(domain.originalData);
                setShowDetails(true);
            } else {
                const response = await fetch(`${API_BASE_URL}/domaines/${domain.id}`);
                if (!response.ok) throw new Error('Failed to fetch domain details');
                const details = await response.json();
                setSelectedDomain(details);
                setShowDetails(true);
            }
        } catch (err) {
            console.error('Failed to load domain details:', err);
            setError('Failed to load domain details');
        }
    };

    const handleExpirationClick = (domain) => {
        setDomainToDelete(domain);
        setShowDeleteModal(true);
    };

    const handleDeleteDomain = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/domaines/${domainToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to delete domain');

            setDomains(domains.filter(d => d.id !== domainToDelete.id));
            setShowDeleteModal(false);
            setDomainToDelete(null);
        } catch (err) {
            console.error('Failed to delete domain:', err);
            setError('Failed to delete domain');
            setShowDeleteModal(false);
        }
    };

    const countActiveAlerts = () => {
        if (!domains || !Array.isArray(domains)) return 0;

        const today = new Date();
        return domains.filter(d => {
            const isOffline = d.en_ligne !== 1;

            let sslExpiredOrExpiring = false;
            if (d.network_detail?.ssl_expiration) {
                const sslDate = new Date(d.network_detail.ssl_expiration);
                const sslDiffDays = (sslDate - today) / (1000 * 60 * 60 * 24);
                sslExpiredOrExpiring = sslDiffDays <= 30;
            }

            let domainExpiring = false;
            if (d.date_expiration) {
                const domainDate = new Date(d.date_expiration);
                const domainDiffDays = (domainDate - today) / (1000 * 60 * 60 * 24);
                domainExpiring = domainDiffDays <= 30;
            }

            return isOffline || sslExpiredOrExpiring || domainExpiring;
        }).length;
    };

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });

        window.history.pushState(null, '', window.location.href);
        window.onpopstate = () => {
            window.location.replace('/');
        };
    };

    const ViaDominLogo = () => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
        >
            <Globe className="w-6 h-6 text-[#00D09C]" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#00D09C] to-[#702FFF] bg-clip-text text-transparent">
        ViaDomin's
      </span>
        </motion.div>
    );

    return (
        <div className="fixed inset-0 overflow-auto bg-white font-[Inter,_Noto_Sans,sans-serif]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col min-h-screen w-full"
            >
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 w-full">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="flex justify-between h-16 items-center w-full max-w-7xl mx-auto">
                            <ViaDominLogo />

                            <nav className="hidden md:flex space-x-8">
                                {[
                                    { to: '/home', label: 'Dashboard', active: true },
                                    { to: '/alerts', label: 'Alertes' },
                                    { to: '/statistics', label: 'Statistiques' },
                                    { to: '/add-domaine', label: 'Ajouter un domaine' }
                                ].map((item) => (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                                            item.active
                                                ? 'text-[#00D09C] border-b-2 border-[#00D09C]'
                                                : 'text-gray-500 hover:text-[#00D09C]'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="flex items-center">
                                <button
                                    className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00D09C] transition-all duration-200"
                                    aria-label="Déconnexion"
                                    onClick={handleLogout}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 w-full px-4 sm:px-6 py-6">
                    <div className="w-full mx-auto px-2 sm:px-4 max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Domain Monitoring Dashboard</h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-[#00D09C] text-sm"
                            >
                                Overview of your monitored domains and their current status
                            </motion.p>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            {[
                                {
                                    title: "Total Domains Monitored",
                                    value: domains?.length || 0,
                                    gradient: "from-[#00D09C]/10 to-[#702FFF]/10",
                                    border: "border-[#00D09C]/20"
                                },
                                {
                                    title: "Total Active Alerts",
                                    value: countActiveAlerts(),
                                    gradient: "from-[#00D09C]/10 to-[#702FFF]/10",
                                    border: "border-[#00D09C]/20"
                                }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    variants={slideUp}
                                    className={`bg-gradient-to-r ${stat.gradient} p-6 rounded-xl border ${stat.border} hover:shadow-md transition-shadow`}
                                    whileHover={{ y: -5 }}
                                >
                                    <p className="text-base font-medium text-gray-700">{stat.title}</p>
                                    <motion.p
                                        className="text-2xl font-bold text-[#060014]"
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: i * 0.1 + 0.3 }}
                                    >
                                        {stat.value}
                                    </motion.p>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mb-6"
                        >
                            <div className="relative">
                                <motion.input
                                    type="text"
                                    placeholder="Search domains..."
                                    className="w-full h-12 px-4 pl-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D09C] focus:border-transparent"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    whileFocus={{ scale: 1.01 }}
                                    aria-label="Search domains"
                                />
                                <div className="absolute left-3 top-3 text-gray-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>

                        {isLoading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-center items-center h-64"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                >
                                    <Loader2 className="h-12 w-12 text-[#00D09C]" />
                                </motion.div>
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
                            >
                                <div className="flex">
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                    <p className="ml-3 text-sm text-red-700">{error}</p>
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                                >
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                            <tr>
                                                {['Domain Name', 'Status', 'Expiration', 'CMS', 'Last Checked', 'DETAILS'].map((header, i) => (
                                                    <motion.th
                                                        key={i}
                                                        initial={{ opacity: 0, y: -20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.7 + i * 0.05 }}
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        {header}
                                                    </motion.th>
                                                ))}
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                            {currentDomains.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                                        No domains found
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentDomains.map((domain, i) => (
                                                    <motion.tr
                                                        key={domain.id || i}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.8 + i * 0.03 }}
                                                        className="hover:bg-gray-50 group cursor-pointer"
                                                        whileHover={{ scale: 1.005 }}
                                                        onClick={() => handleExpirationClick(domain)}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 group-hover:text-[#00D09C] transition-colors">
                                                            {domain.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <motion.span
                                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                    domain.status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                }`}
                                                                whileHover={{ scale: 1.1 }}
                                                            >
                                                                {domain.status}
                                                            </motion.span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 group-hover:text-[#00D09C] transition-colors">
                                                            {domain.expiration}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <CmsIcon cms={domain.cms} />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 group-hover:text-[#00D09C] transition-colors">
                                                            {domain.lastChecked}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <motion.button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleShowDetails(domain);
                                                                }}
                                                                className="text-[#702FFF] hover:text-[#00D09C] transition-colors"
                                                                whileHover={{ scale: 1.2 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                aria-label={`View details for ${domain.name}`}
                                                            >
                                                                <Eye className="w-5 h-5" />
                                                            </motion.button>
                                                        </td>
                                                    </motion.tr>
                                                ))
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>

                                {/* Pagination Controls */}
                                {filteredDomains.length > itemsPerPage && (
                                    <div className="flex justify-center items-center space-x-2 mt-4">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                            aria-label="Page précédente"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>

                                        <div className="flex space-x-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                                <button
                                                    key={number}
                                                    onClick={() => setCurrentPage(number)}
                                                    className={`w-10 h-10 rounded-md flex items-center justify-center ${
                                                        currentPage === number
                                                            ? 'bg-[#00D09C] text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {number}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                            aria-label="Page suivante"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        <DomainDetailsPopup
                            isOpen={showDetails}
                            onClose={() => setShowDetails(false)}
                            domainData={selectedDomain}
                        />

                        {showDeleteModal && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                            >
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className="bg-white rounded-xl p-6 w-full max-w-md"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-900">Confirmer la suppression</h3>
                                        <X
                                            className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
                                            onClick={() => setShowDeleteModal(false)}
                                        />
                                    </div>
                                    <p className="mb-6">Êtes-vous sûr de vouloir supprimer le domaine <span
                                        className="font-semibold">{domainToDelete?.name}</span> ?</p>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => setShowDeleteModal(false)}
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
                                            onClick={handleDeleteDomain}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Supprimer
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </div>
                </main>
            </motion.div>
        </div>
    );
}


export default Home;