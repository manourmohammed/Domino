import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, Globe, Calendar, File, Wifi, WifiOff, AlertTriangle, Bell, Loader2, AlertCircle } from 'lucide-react';
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
    FaQuestionCircle
} from 'react-icons/fa';

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
            case 'Connected': return <Wifi size={24} className="text-green-600" />;
            case 'Disconnected': return <WifiOff size={24} className="text-red-600" />;
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
                                            icon: getNetworkStatusIcon(data.networkStatus),
                                            title: "Network Status",
                                            value: data.networkStatus,
                                            color: data.networkStatus === 'Connected' ? 'text-green-600' : data.networkStatus === 'Disconnected' ? 'text-red-600' : 'text-yellow-600',
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
            case 'none':
            case null:
            case undefined: return <FaBan className="text-gray-400" size={20} title="No CMS" />;
            default: return <FaQuestionCircle className="text-gray-600" size={20} title="Unknown CMS" />;
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

// Composant principal Home avec animations
const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [domains, setDomains] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        if (token) localStorage.setItem('token', token);
    }, [location]);

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/domaines`);
                if (!response.ok) throw new Error('Failed to fetch domains');
                const data = await response.json();
                setDomains(data);
                setIsLoading(false);
                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError('Failed to load domains');
                setIsLoading(false);
            }
        };

        fetchDomains();
    }, []);

    const filteredDomains = useMemo(() => {
        if (!domains) return [];
        return domains
            .filter(domain => domain?.nom?.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(domain => ({
                id: domain.id,
                name: domain.nom,
                status: domain.en_ligne === 1 ? 'Online' : 'Offline',
                expiration: domain.date_expiration || 'N/A',
                cms: domain.cms_detail?.cms || 'none',
                lastChecked: new Date().toLocaleString()
            }));
    }, [domains, searchTerm]);

    const handleShowDetails = async (domain) => {
        try {
            const response = await fetch(`${API_BASE_URL}/domaines/${domain.id}`);
            if (!response.ok) throw new Error('Failed to fetch domain details');
            const details = await response.json();
            setSelectedDomain({ ...domain, ...details });
            setShowDetails(true);
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Failed to load domain details');
        }
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
                                    { to: '/home', label: 'Dashboard' ,active: true },
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
                                    aria-label="Notifications"
                                >
                                    <Bell className="h-6 w-6" />
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
                                    value: domains?.filter(d => d.en_ligne !== 1).length || 0,
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
                                            {['Domain Name', 'Status', 'Expiration', 'CMS', 'Last Checked', 'Actions'].map((header, i) => (
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
                                        {filteredDomains?.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                                    No domains found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredDomains?.map((domain, i) => (
                                                <motion.tr
                                                    key={domain.id || i}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.8 + i * 0.03 }}
                                                    className="hover:bg-gray-50"
                                                    whileHover={{ scale: 1.005 }}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {domain.expiration}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <CmsIcon cms={domain.cms} />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {domain.lastChecked}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <motion.button
                                                            onClick={() => handleShowDetails(domain)}
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
                        )}

                        <DomainDetailsPopup
                            isOpen={showDetails}
                            onClose={() => setShowDetails(false)}
                            domainData={selectedDomain}
                        />
                    </div>
                </main>
            </motion.div>
        </div>
    );
}

export default Home;